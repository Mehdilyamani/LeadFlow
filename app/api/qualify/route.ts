import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import supabaseServer from '../../DB/supabaseServer'

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface SessionData {
  agencyName?: string
  [key: string]: unknown
}

interface RawLead {
  name?: string
  contact?: string
  budget?: string
  timeline?: string
  property_type?: string
  propertyType?: string
  location?: string
}

type Score = 'HOT' | 'WARM' | 'COLD'

// ── Server-side scoring ────────────────────────────────────────────────────────
function calculateScore(lead: RawLead): Score {
  const budget   = (lead.budget   || '').toLowerCase()
  const timeline = (lead.timeline || '').toLowerCase()

  const highBudget =
    budget.includes('1m') ||
    budget.includes("plus d'1m") ||
    budget.includes('1 000 000') ||
    budget.includes('500k-1m') ||
    budget.includes('500k-1') ||
    /[5-9]\d{5,}/.test(budget.replace(/\s/g, '')) ||
    /[1-9]\d{6,}/.test(budget.replace(/\s/g, ''))

  const shortTimeline =
    timeline.includes('ce mois') ||
    timeline.includes('mois-ci') ||
    timeline.includes('immédiat') ||
    timeline.includes('urgent')

  const mediumTimeline =
    shortTimeline ||
    timeline.includes('3 mois') ||
    timeline.includes('dans 3')

  if (shortTimeline && highBudget) return 'HOT'
  if (mediumTimeline || highBudget) return 'WARM'
  return 'COLD'
}

// ── System prompt ──────────────────────────────────────────────────────────────
function buildSystemPrompt(agencyName: string) {
  return `Tu es l'assistant de "${agencyName}".
Qualifie le visiteur en 5 questions courtes.
Ton style : simple, humain, 1-2 phrases max.
Pour la toute première question, commence par une courte salutation puis demande le prénom.

Collecte dans cet ordre :
1. Prénom
2. Budget (moins de 500k / 500k-1M / plus d'1M MAD)
3. Délai (ce mois-ci / dans 3 mois / dans 6 mois / je regarde)
4. Type de bien (appartement / villa / terrain)
5. Ville ou quartier

Une question à la fois. Pas de formules corporate.
Langue : français. Darija si le visiteur l'utilise.

Quand tu as les 5 réponses, réponds UNIQUEMENT avec ce JSON :
{"done":true,"message":"Parfait [prénom], un conseiller vous rappelle bientôt.","lead":{"name":"[prénom]","contact":"[prénom]","budget":"...","timeline":"...","property_type":"...","location":"..."}}`
}

// ── Score → widget display mapping ────────────────────────────────────────────
const SCORE_DISPLAY: Record<Score, { label: 'Hot' | 'Warm' | 'Cold'; numeric: number }> = {
  HOT:  { label: 'Hot',  numeric: 9 },
  WARM: { label: 'Warm', numeric: 6 },
  COLD: { label: 'Cold', numeric: 2 },
}

function buildLeadPayload(lead: RawLead, score: Score) {
  const { label, numeric } = SCORE_DISPLAY[score]
  return {
    name:          lead.name          ?? 'Prospect',
    contact:       lead.contact       ?? lead.name ?? 'Non fourni',
    budget:        lead.budget        ?? 'Non précisé',
    timeline:      lead.timeline      ?? 'Non précisé',
    property_type: lead.property_type ?? lead.propertyType ?? 'Non précisé',
    location:      lead.location      ?? 'Non précisé',
    label,
    numericScore: numeric,
  }
}

// ── Insert lead into Supabase ──────────────────────────────────────────────────
async function saveLead(lead: RawLead, score: Score) {
  const { error } = await supabaseServer.from('leads').insert({
    name:          lead.name          ?? 'Prospect',
    contact:       lead.contact       ?? lead.name ?? 'Non fourni',
    budget:        lead.budget        ?? 'Non précisé',
    timeline:      lead.timeline      ?? 'Non précisé',
    property_type: lead.property_type ?? lead.propertyType ?? 'Non précisé',
    location:      lead.location      ?? 'Non précisé',
    score,
  })
  if (error) console.error('Supabase insert error:', error.message)
}

// ── Handler ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body        = await req.json()
  const messages: Message[] = Array.isArray(body.messages) ? body.messages : []
  const sessionData: SessionData = body.sessionData ?? {}
  const agencyName  = sessionData.agencyName ?? 'Prestige Immobilier'

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key configured' }, { status: 500 })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const systemPrompt = buildSystemPrompt(agencyName)
    const history = messages
      .map(m => `${m.role === 'user' ? 'Visiteur' : 'Assistant'}: ${m.content}`)
      .join('\n\n')

    const prompt = `${systemPrompt}\n\n---\nHistorique:\n${history}\n\nAssistant:`

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    })
    const text = (result.text ?? '').trim()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        if (parsed.done && parsed.lead) {
          const rawLead = parsed.lead as RawLead
          const score   = calculateScore(rawLead)
          await saveLead(rawLead, score)
          return NextResponse.json({
            reply:      parsed.message ?? 'Merci pour ces informations !',
            isComplete: true,
            score,
            lead:       buildLeadPayload(rawLead, score),
          })
        }
      } catch {
        // not JSON, continue as plain reply
      }
    }

    return NextResponse.json({ reply: text, isComplete: false })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[qualify] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
