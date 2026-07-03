import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import disposableDomains from 'disposable-email-domains'
import supabaseServer from '../../DB/supabaseServer'
import { PROVIDERS, type Provider, type Verdict } from '@/lib/verifiers'

export const maxDuration = 60

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/
const GREYLIST_WINDOW_MS = 20 * 60 * 60 * 1000
const MAX_CONSECUTIVE_UNKNOWN = 3
const DISPOSABLE_SET = new Set(disposableDomains)

// ── Small helpers ────────────────────────────────────────────────────────────
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA) // burn equivalent time, avoid short-circuit leak
    return false
  }
  return crypto.timingSafeEqual(bufA, bufB)
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function monthStart(): string {
  return `${new Date().toISOString().slice(0, 7)}-01`
}

// ── verifier_usage helpers ───────────────────────────────────────────────────
interface UsageRow { service: string; day: string; count: number; disabled: boolean }

async function getUsageToday(service: string): Promise<UsageRow | null> {
  const { data } = await supabaseServer
    .from('verifier_usage')
    .select('*')
    .eq('service', service)
    .eq('day', todayStr())
    .maybeSingle()
  return (data as UsageRow) ?? null
}

async function getMonthlySum(service: string): Promise<number> {
  const { data } = await supabaseServer
    .from('verifier_usage')
    .select('count')
    .eq('service', service)
    .gte('day', monthStart())
  if (!data) return 0
  return (data as { count: number }[]).reduce((sum, row) => sum + (row.count ?? 0), 0)
}

async function incrementUsage(service: string): Promise<void> {
  const existing = await getUsageToday(service)
  await supabaseServer.from('verifier_usage').upsert({
    service,
    day: todayStr(),
    count: (existing?.count ?? 0) + 1,
    disabled: existing?.disabled ?? false,
  })
}

async function disableToday(service: string): Promise<void> {
  const existing = await getUsageToday(service)
  await supabaseServer.from('verifier_usage').upsert({
    service,
    day: todayStr(),
    count: existing?.count ?? 0,
    disabled: true,
  })
}

async function shouldSkip(provider: Provider): Promise<boolean> {
  if (provider.isConfigured && !provider.isConfigured()) return true
  const usage = await getUsageToday(provider.name)
  if (usage?.disabled) return true
  if (provider.dailyLimit !== undefined && (usage?.count ?? 0) >= provider.dailyLimit) return true
  if (provider.monthlyLimit !== undefined) {
    const sum = await getMonthlySum(provider.name)
    if (sum >= provider.monthlyLimit) return true
  }
  return false
}

// ── Cascade runner ───────────────────────────────────────────────────────────
interface CascadeOutcome { verdict: Verdict; raw: unknown; service: string }

async function runCascade(startIndex: number, email: string): Promise<{ outcome?: CascadeOutcome; servicesDown: string[] }> {
  const servicesDown: string[] = []
  for (let i = startIndex; i < PROVIDERS.length; i++) {
    const provider = PROVIDERS[i]
    if (await shouldSkip(provider)) {
      servicesDown.push(provider.name)
      continue
    }

    await incrementUsage(provider.name)

    try {
      const raw = await provider.call(email)
      const verdict = provider.mapVerdict(raw)
      return { outcome: { verdict, raw, service: provider.name }, servicesDown }
    } catch {
      await disableToday(provider.name)
      servicesDown.push(provider.name)
    }
  }
  return { servicesDown }
}

// ── Domain checks ────────────────────────────────────────────────────────────
async function resolveMx(domain: string): Promise<boolean | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`, {
      signal: controller.signal,
    })
    if (!res.ok) return null
    const json = await res.json()
    return Array.isArray(json.Answer) && json.Answer.length > 0
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

/** Returns a final verdict if the domain alone decides it (catch_all / invalid), or null to proceed to the cascade. */
async function precheckDomain(domain: string): Promise<'catch_all' | 'invalid' | null> {
  const { data: domainRow } = await supabaseServer
    .from('domain_status')
    .select('*')
    .eq('domain', domain)
    .maybeSingle()

  if (domainRow) {
    if (domainRow.is_catch_all) return 'catch_all'
    if (domainRow.has_mx === false) return 'invalid'
    return null
  }

  const hasMx = await resolveMx(domain)
  if (hasMx === null) return null // DNS lookup failed technically — don't block, let the cascade decide

  await supabaseServer.from('domain_status').upsert({
    domain,
    has_mx: hasMx,
    is_catch_all: false,
    checked_at: new Date().toISOString(),
  })
  return hasMx ? null : 'invalid'
}

// ── Persistence ──────────────────────────────────────────────────────────────
async function persistVerification(params: {
  email: string
  domain: string
  verdict: Verdict
  service: string | null
  raw: unknown
  attempts: number
  checkedAtIso: string
}): Promise<void> {
  const { email, domain, verdict, service, raw, attempts, checkedAtIso } = params
  await supabaseServer.from('email_verifications').upsert({
    email,
    domain,
    verdict,
    service,
    raw,
    attempts,
    checked_at: checkedAtIso,
  })
  if (verdict === 'catch_all') {
    await supabaseServer.from('domain_status').upsert({
      domain,
      is_catch_all: true,
      has_mx: true,
      checked_at: checkedAtIso,
    })
  }
}

// ── Cascade → response ───────────────────────────────────────────────────────
async function attemptCascade(email: string, domain: string, startIndex: number, previousAttempts: number) {
  const { outcome, servicesDown } = await runCascade(startIndex, email)
  const checkedAtIso = new Date().toISOString()

  if (!outcome) {
    return NextResponse.json({
      email,
      verdict: 'unverifiable',
      services_down: servicesDown,
      checked_at: checkedAtIso,
    })
  }

  if (outcome.verdict === 'unknown') {
    const attempts = previousAttempts + 1
    if (attempts >= MAX_CONSECUTIVE_UNKNOWN) {
      await persistVerification({ email, domain, verdict: 'invalid', service: outcome.service, raw: outcome.raw, attempts, checkedAtIso })
      return NextResponse.json({
        email, verdict: 'invalid', service: outcome.service, cached: false, checked_at: checkedAtIso, details: {},
      })
    }
    await persistVerification({ email, domain, verdict: 'unknown', service: outcome.service, raw: outcome.raw, attempts, checkedAtIso })
    return NextResponse.json({
      email,
      verdict: 'unknown',
      service: outcome.service,
      cached: false,
      checked_at: checkedAtIso,
      retry_after: new Date(Date.now() + GREYLIST_WINDOW_MS).toISOString(),
      details: { greylisted: true },
    })
  }

  await persistVerification({ email, domain, verdict: outcome.verdict, service: outcome.service, raw: outcome.raw, attempts: previousAttempts + 1, checkedAtIso })
  return NextResponse.json({
    email, verdict: outcome.verdict, service: outcome.service, cached: false, checked_at: checkedAtIso, details: {},
  })
}

async function respondDomainVerdict(
  email: string,
  domain: string,
  verdict: 'catch_all' | 'invalid',
  details: Record<string, boolean> = {},
) {
  const checkedAtIso = new Date().toISOString()
  await persistVerification({ email, domain, verdict, service: null, raw: null, attempts: 1, checkedAtIso })
  return NextResponse.json({
    email, verdict, service: null, cached: false, checked_at: checkedAtIso, details,
  })
}

// ── Handler ──────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const emailParam = searchParams.get('email')
  const secretParam = searchParams.get('secret')

  const expectedSecret = process.env.VERIFY_EMAIL_SECRET
  if (!expectedSecret || !secretParam || !safeCompare(secretParam, expectedSecret)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!emailParam) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  const email = emailParam.trim().toLowerCase()
  const checkedAtIso = new Date().toISOString()

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({
      email, verdict: 'invalid', service: null, cached: false, checked_at: checkedAtIso, details: {},
    })
  }

  const domain = email.split('@')[1]

  try {
    // 2. Cache
    const { data: cached } = await supabaseServer
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (cached) {
      if (cached.verdict === 'ok' || cached.verdict === 'catch_all' || cached.verdict === 'invalid') {
        return NextResponse.json({
          email, verdict: cached.verdict, service: cached.service, cached: true, checked_at: cached.checked_at, details: {},
        })
      }

      if (cached.verdict === 'unknown') {
        const retryAfter = new Date(new Date(cached.checked_at).getTime() + GREYLIST_WINDOW_MS)
        if (new Date() < retryAfter) {
          return NextResponse.json({
            email, verdict: 'unknown', service: cached.service, cached: true, checked_at: cached.checked_at,
            retry_after: retryAfter.toISOString(), details: { greylisted: true },
          })
        }

        const idx = PROVIDERS.findIndex(p => p.name === cached.service)
        const startIndex = idx === -1 ? 0 : idx + 1
        return await attemptCascade(email, domain, startIndex, cached.attempts ?? 1)
      }
    }

    // 3. Domain
    const domainVerdict = await precheckDomain(domain)
    if (domainVerdict) {
      return await respondDomainVerdict(email, domain, domainVerdict)
    }

    // 4. Disposable
    if (DISPOSABLE_SET.has(domain)) {
      return await respondDomainVerdict(email, domain, 'invalid', { disposable: true })
    }

    // 5. Cascade from the top
    return await attemptCascade(email, domain, 0, 0)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[verify-email] error:', msg)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
