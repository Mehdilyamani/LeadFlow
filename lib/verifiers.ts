// Cascade of free email-verification providers. Each entry knows how to call its
// API and how to normalize the response into a shared verdict — the route just
// walks the array in order.

export type Verdict = 'ok' | 'catch_all' | 'invalid' | 'unknown'

export interface ProviderResult {
  verdict: Verdict
  raw: unknown
}

export interface Provider {
  name: string
  /** Daily call limit tracked in verifier_usage, undefined = no daily cap enforced locally */
  dailyLimit?: number
  /** Monthly call limit (sum across days in the current month), used by ZeroBounce */
  monthlyLimit?: number
  /** Returns true if this provider should be skipped regardless of usage (e.g. missing credentials) */
  isConfigured?: () => boolean
  call: (email: string) => Promise<unknown>
  mapVerdict: (raw: unknown) => Verdict
}

const ABUSE_MARKERS = ['abuse', 'insufficient', 'out of credits']

class ProviderDownError extends Error {}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/** Fetches, and throws ProviderDownError on network failure, 401/403/429, or an abuse-flavored body — the caller disables the service for the day and moves to the next one. */
async function guardedFetch(url: string, init: RequestInit = {}): Promise<{ text: string; json: unknown }> {
  let res: Response
  try {
    res = await fetchWithTimeout(url, init)
  } catch {
    throw new ProviderDownError('network timeout or failure')
  }

  const text = await res.text().catch(() => '')
  const lowerText = text.toLowerCase()

  if (res.status === 401 || res.status === 403 || res.status === 429) {
    throw new ProviderDownError(`http ${res.status}`)
  }
  if (ABUSE_MARKERS.some(marker => lowerText.includes(marker))) {
    throw new ProviderDownError('abuse marker in response body')
  }
  if (!res.ok) {
    throw new ProviderDownError(`http ${res.status}`)
  }

  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    throw new ProviderDownError('unparsable response body')
  }

  return { text, json }
}

function asRecord(raw: unknown): Record<string, unknown> {
  return raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
}

// ── 1. MyEmailVerifier ───────────────────────────────────────────────────────
const myEmailVerifier: Provider = {
  name: 'myemailverifier',
  dailyLimit: 95,
  call: async (email) => {
    const key = process.env.MEV_API_KEY
    if (!key) throw new ProviderDownError('missing MEV_API_KEY')
    const { json } = await guardedFetch(
      `https://client.myemailverifier.com/verifier/validate_single/${encodeURIComponent(email)}/${key}`,
    )
    return json
  },
  mapVerdict: (raw) => {
    const r = asRecord(raw)
    const status = String(r.Status ?? '').toLowerCase()
    if (r.Disposable_Domain === 1 || r.Disposable_Domain === '1') return 'invalid'
    if (r.catch_all === 1 || r.catch_all === '1' || status === 'catch-all') return 'catch_all'
    if (r.Greylisted === 1 || r.Greylisted === '1' || status === 'unknown') return 'unknown'
    if (status === 'valid') return 'ok'
    if (status === 'invalid') return 'invalid'
    return 'unknown'
  },
}

// ── 2. Verifalia ─────────────────────────────────────────────────────────────
async function verifaliaAuthHeader(): Promise<string> {
  const user = process.env.VERIFALIA_USERNAME
  const pass = process.env.VERIFALIA_PASSWORD
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64')
}

const verifalia: Provider = {
  name: 'verifalia',
  dailyLimit: 23,
  isConfigured: () => Boolean(process.env.VERIFALIA_USERNAME && process.env.VERIFALIA_PASSWORD),
  call: async (email) => {
    const auth = await verifaliaAuthHeader()
    const headers = { 'Content-Type': 'application/json', Authorization: auth }

    let res: Response
    try {
      res = await fetchWithTimeout('https://api.verifalia.com/v2.5/email-validations?waitTime=30000', {
        method: 'POST',
        headers,
        body: JSON.stringify({ entries: [{ inputData: email }] }),
      })
    } catch {
      throw new ProviderDownError('network timeout or failure')
    }

    if (res.status === 401 || res.status === 403 || res.status === 429) {
      throw new ProviderDownError(`http ${res.status}`)
    }

    let bodyText = await res.text().catch(() => '')
    if (ABUSE_MARKERS.some(marker => bodyText.toLowerCase().includes(marker))) {
      throw new ProviderDownError('abuse marker in response body')
    }
    if (!res.ok) throw new ProviderDownError(`http ${res.status}`)

    let json: Record<string, unknown> = {}
    try {
      json = bodyText ? JSON.parse(bodyText) : {}
    } catch {
      throw new ProviderDownError('unparsable response body')
    }

    let overview = asRecord(json.overview)
    let validationId = overview.id ?? json.id

    // Synchronous completion (200, waitTime honored)
    if (overview.status === 'Completed' || res.status === 200) {
      return json
    }

    // 202 async — poll up to 3 times, 5s apart
    if (res.status === 202 && validationId) {
      for (let attempt = 0; attempt < 3; attempt++) {
        await new Promise(r => setTimeout(r, 5000))
        let pollRes: Response
        try {
          pollRes = await fetchWithTimeout(`https://api.verifalia.com/v2.5/email-validations/${validationId}`, {
            headers: { Authorization: auth },
          })
        } catch {
          throw new ProviderDownError('network timeout or failure')
        }
        if (pollRes.status === 401 || pollRes.status === 403 || pollRes.status === 429) {
          throw new ProviderDownError(`http ${pollRes.status}`)
        }
        bodyText = await pollRes.text().catch(() => '')
        if (ABUSE_MARKERS.some(marker => bodyText.toLowerCase().includes(marker))) {
          throw new ProviderDownError('abuse marker in response body')
        }
        if (!pollRes.ok) throw new ProviderDownError(`http ${pollRes.status}`)
        try {
          json = bodyText ? JSON.parse(bodyText) : {}
        } catch {
          throw new ProviderDownError('unparsable response body')
        }
        overview = asRecord(json.overview)
        if (overview.status === 'Completed') return json
      }
    }

    return json
  },
  mapVerdict: (raw) => {
    const r = asRecord(raw)
    const entries = asRecord(r.entries)
    const data = Array.isArray(entries.data) ? entries.data : []
    const classification = asRecord(data[0]).classification
    if (classification === 'Deliverable') return 'ok'
    if (classification === 'Risky') return 'catch_all'
    if (classification === 'Undeliverable') return 'invalid'
    return 'unknown'
  },
}

// ── 3. Reoon ─────────────────────────────────────────────────────────────────
const reoon: Provider = {
  name: 'reoon',
  dailyLimit: 23,
  call: async (email) => {
    const key = process.env.REOON_API_KEY
    if (!key) throw new ProviderDownError('missing REOON_API_KEY')
    const { json } = await guardedFetch(
      `https://emailverifier.reoon.com/api/v1/verify?email=${encodeURIComponent(email)}&key=${key}&mode=power`,
    )
    return json
  },
  mapVerdict: (raw) => {
    const r = asRecord(raw)
    const status = String(r.status ?? '').toLowerCase()
    if (status === 'valid') return 'ok'
    if (status === 'catch_all' || r.is_catch_all === true) return 'catch_all'
    if (['invalid', 'disabled', 'disposable'].includes(status)) return 'invalid'
    return 'unknown'
  },
}

// ── 4. ZeroBounce ────────────────────────────────────────────────────────────
const zeroBounce: Provider = {
  name: 'zerobounce',
  monthlyLimit: 95,
  call: async (email) => {
    const key = process.env.ZEROBOUNCE_API_KEY
    if (!key) throw new ProviderDownError('missing ZEROBOUNCE_API_KEY')
    const { json } = await guardedFetch(
      `https://api.zerobounce.net/v2/validate?api_key=${key}&email=${encodeURIComponent(email)}`,
    )
    return json
  },
  mapVerdict: (raw) => {
    const r = asRecord(raw)
    const status = String(r.status ?? '').toLowerCase()
    if (status === 'valid') return 'ok'
    if (status === 'catch-all') return 'catch_all'
    if (['invalid', 'abuse', 'do_not_mail'].includes(status)) return 'invalid'
    return 'unknown'
  },
}

// ── 5. NeverBounce ───────────────────────────────────────────────────────────
const neverBounce: Provider = {
  name: 'neverbounce',
  call: async (email) => {
    const key = process.env.NEVERBOUNCE_API_KEY
    if (!key) throw new ProviderDownError('missing NEVERBOUNCE_API_KEY')
    const { json } = await guardedFetch(
      `https://api.neverbounce.com/v4/single/check?key=${key}&email=${encodeURIComponent(email)}`,
    )
    return json
  },
  mapVerdict: (raw) => {
    const r = asRecord(raw)
    const result = String(r.result ?? '').toLowerCase()
    if (result === 'valid') return 'ok'
    if (result === 'catchall') return 'catch_all'
    if (['invalid', 'disposable'].includes(result)) return 'invalid'
    return 'unknown'
  },
}

// ── 6. Emailable ─────────────────────────────────────────────────────────────
const emailable: Provider = {
  name: 'emailable',
  call: async (email) => {
    const key = process.env.EMAILABLE_API_KEY
    if (!key) throw new ProviderDownError('missing EMAILABLE_API_KEY')
    const { json } = await guardedFetch(
      `https://api.emailable.com/v1/verify?email=${encodeURIComponent(email)}&api_key=${key}`,
    )
    return json
  },
  mapVerdict: (raw) => {
    const r = asRecord(raw)
    const state = String(r.state ?? '').toLowerCase()
    if (state === 'deliverable') return 'ok'
    if (state === 'risky') return 'catch_all'
    if (state === 'undeliverable') return 'invalid'
    return 'unknown'
  },
}

// ── 7. MillionVerifier ───────────────────────────────────────────────────────
const millionVerifier: Provider = {
  name: 'millionverifier',
  call: async (email) => {
    const key = process.env.MILLIONVERIFIER_API_KEY
    if (!key) throw new ProviderDownError('missing MILLIONVERIFIER_API_KEY')
    const { json } = await guardedFetch(
      `https://api.millionverifier.com/api/v3/?api=${key}&email=${encodeURIComponent(email)}&timeout=10`,
    )
    const r = asRecord(json)
    if (typeof r.error === 'string' && r.error.toLowerCase().includes('abuse')) {
      throw new ProviderDownError('abuse marker in response body')
    }
    return json
  },
  mapVerdict: (raw) => {
    const r = asRecord(raw)
    const result = String(r.result ?? '').toLowerCase()
    if (result === 'ok') return 'ok'
    if (result === 'catch_all') return 'catch_all'
    if (['invalid', 'disposable'].includes(result)) return 'invalid'
    return 'unknown'
  },
}

export const PROVIDERS: Provider[] = [
  myEmailVerifier,
  verifalia,
  reoon,
  zeroBounce,
  neverBounce,
  emailable,
  millionVerifier,
]

export { ProviderDownError }
