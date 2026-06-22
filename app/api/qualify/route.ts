import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import supabaseServer from '../../DB/supabaseServer'

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface PropertyContext {
  id: string
  title: string
  price?: string
  location?: string
  city?: string
  area?: string
  beds?: number
  baths?: number
  type?: string
  description?: string
  features?: string[]
}

interface SessionData {
  agencyName?: string
  propertyContext?: PropertyContext | null
  clientId?: string
  agencyContext?: string
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

// ── Scoring ────────────────────────────────────────────────────────────────────
function calculateScore(lead: RawLead): Score {
  const budget   = (lead.budget   || '').toLowerCase()
  const timeline = (lead.timeline || '').toLowerCase()

  const highBudget =
    budget.includes('1m') || budget.includes("plus d'1m") ||
    budget.includes('1 000 000') || budget.includes('500k-1m') ||
    budget.includes('500k-1') ||
    /[5-9]\d{5,}/.test(budget.replace(/\s/g, '')) ||
    /[1-9]\d{6,}/.test(budget.replace(/\s/g, ''))

  const shortTimeline =
    timeline.includes('ce mois') || timeline.includes('mois-ci') ||
    timeline.includes('immédiat') || timeline.includes('urgent')

  const mediumTimeline = shortTimeline || timeline.includes('3 mois') || timeline.includes('dans 3')

  if (shortTimeline && highBudget) return 'HOT'
  if (mediumTimeline || highBudget) return 'WARM'
  return 'COLD'
}

// ── System prompts ─────────────────────────────────────────────────────────────
function buildSystemPrompt(agencyName: string, propertyContext?: PropertyContext | null, agencyDescription?: string | null): string {

  if (propertyContext) {
    // ── ENTRY 2: visitor came from a property page ────────────────────────────
    const loc          = [propertyContext.location, propertyContext.city].filter(Boolean).join(', ')
    const featuresStr  = propertyContext.features?.join(', ') || 'Non précisé'
    const knownType    = propertyContext.type   || '...'
    const knownLoc     = loc || '...'

    return `Tu es l'assistant de "${agencyName}".

Le widget a déjà affiché ce message au visiteur :
"Excellent choix ! ${propertyContext.title} est un très beau bien. Avez-vous des questions à son sujet avant que je vous mette en relation avec un conseiller ?"

Ne répète PAS de message d'accueil. Enchaîne directement depuis là.

DONNÉES COMPLÈTES DU BIEN (utilise-les pour répondre aux questions du visiteur) :
- Titre       : ${propertyContext.title}
- Prix        : ${propertyContext.price ?? 'Non communiqué'} MAD
- Type        : ${propertyContext.type ?? 'Non précisé'}
- Surface     : ${propertyContext.area ?? 'Non précisé'}
- Chambres    : ${propertyContext.beds ?? 'Non précisé'}
- Salle de bain : ${propertyContext.baths ?? 'Non précisé'}
- Localisation: ${loc || 'Non précisé'}
- Description : ${propertyContext.description ?? 'Non précisé'}
- Prestations : ${featuresStr}

Réponds à toutes les questions du visiteur sur ce bien avec précision et enthousiasme.

Puis qualifie-le dans cet ordre, UN champ à la fois.
Accuse chaque réponse chaleureusement (1-2 phrases naturelles, pas robotiques) avant la prochaine question :
1. Prénom
2. Budget (moins de 500k / 500k-1M / plus d'1M)
3. Délai (ce mois-ci / dans 3 mois / dans 6 mois / je regarde)
4. Contact EN DERNIER — pose exactement :
   "Pour qu'un conseiller vous recontacte avec une sélection adaptée, quel est le meilleur moyen de vous joindre ? (numéro WhatsApp ou email)"
   → Si le visiteur donne seulement son prénom sans contact réel, redemande-lui.
   → contact = numéro de téléphone ou adresse email uniquement.

NE pose PAS de question sur le type de bien ni la localisation — déjà connus.
Une question à la fois. Langue : français.

Quand tu as les 4 réponses, réponds UNIQUEMENT avec ce JSON :
{"done":true,"message":"Parfait [prénom], merci ! Un conseiller va vous recontacter très vite concernant ${propertyContext.title}. En attendant, je reste à votre disposition si vous avez d'autres questions — n'hésitez pas.","lead":{"name":"[prénom]","contact":"[numéro ou email]","budget":"...","timeline":"...","property_type":"${knownType}","location":"${knownLoc}"}}`
  }

  // ── ENTRY 1: floating widget, no property context ─────────────────────────
  return `Tu es l'assistant de "${agencyName}".

Le widget a déjà accueilli le visiteur. Ta PREMIÈRE réponse doit s'enchaîner naturellement — PAS de "Bonjour", PAS de message d'accueil séparé. Continue directement depuis là.

${agencyDescription
  ? `Ce visiteur explore le site. Voici le contexte de l'agence pour répondre à ses questions. Sois chaleureux et utile.\n\nCONTEXTE DE L'AGENCE :\n${agencyDescription}`
  : `Ce visiteur explore le site. Réponds à ses questions sur l'agence si tu as l'information. Sois chaleureux et utile.\nN'invente jamais de biens ni de prix, même de façon générale. Ne dis pas que l'agence "a" des propriétés si tu ne les connais pas. Si le visiteur demande quelles propriétés sont disponibles, dis-lui simplement qu'un conseiller lui enverra une sélection personnalisée.`}

Puis qualifie-le naturellement, UN champ à la fois.
Accuse chaque réponse chaleureusement (1-2 phrases naturelles) avant la prochaine question :
1. Prénom
2. Budget (moins de 500k / 500k-1M / plus d'1M)
3. Délai (ce mois-ci / dans 3 mois / dans 6 mois / je regarde)
4. Type de bien (appartement / villa / terrain / autre)
5. Ville ou quartier
6. Contact EN DERNIER — pose exactement :
   "Pour qu'un conseiller vous recontacte avec une sélection adaptée, quel est le meilleur moyen de vous joindre ? (numéro WhatsApp ou email)"
   → Si le visiteur donne seulement son prénom sans contact réel, redemande-lui.
   → contact = numéro de téléphone ou adresse email uniquement.

Une question à la fois. Langue : français.

Quand tu as les 6 réponses, réponds UNIQUEMENT avec ce JSON :
{"done":true,"message":"Parfait [prénom], merci ! Un conseiller va vous recontacter très vite pour avancer ensemble. En attendant, je reste à votre disposition si vous avez d'autres questions ou un autre projet en tête — n'hésitez pas.","lead":{"name":"[prénom]","contact":"[numéro ou email]","budget":"...","timeline":"...","property_type":"...","location":"..."}}`
}

// ── Score → widget payload ─────────────────────────────────────────────────────
const SCORE_DISPLAY: Record<Score, { label: 'Hot' | 'Warm' | 'Cold'; numeric: number }> = {
  HOT:  { label: 'Hot',  numeric: 9 },
  WARM: { label: 'Warm', numeric: 6 },
  COLD: { label: 'Cold', numeric: 2 },
}

function buildLeadPayload(lead: RawLead, score: Score, knownLocation?: string | null) {
  const { label, numeric } = SCORE_DISPLAY[score]
  return {
    name:          lead.name          ?? 'Prospect',
    contact:       lead.contact       ?? lead.name ?? 'Non fourni',
    budget:        lead.budget        ?? 'Non précisé',
    timeline:      lead.timeline      ?? 'Non précisé',
    property_type: lead.property_type ?? lead.propertyType ?? 'Non précisé',
    location:      knownLocation      ?? lead.location ?? 'Non précisé',
    label,
    numericScore:  numeric,
  }
}

// ── Supabase insert ────────────────────────────────────────────────────────────
async function saveLead(
  lead: RawLead,
  score: Score,
  propertyInterest?: string | null,
  knownLocation?: string | null,
  clientId?: string | null,
) {
  const { error } = await supabaseServer.from('leads').insert({
    name:              lead.name          ?? 'Prospect',
    contact:           lead.contact       ?? lead.name ?? 'Non fourni',
    budget:            lead.budget        ?? 'Non précisé',
    timeline:          lead.timeline      ?? 'Non précisé',
    property_type:     lead.property_type ?? lead.propertyType ?? 'Non précisé',
    location:          knownLocation      ?? lead.location ?? 'Non précisé',
    score,
    property_interest: propertyInterest   ?? null,
    client_id:         clientId           ?? null,
  })
  if (error) console.error('Supabase insert error:', error.message)
}

// ── Retry helpers ─────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

function isRetryable(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase()
  return msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted') ||
         msg.includes('500') || msg.includes('503') || msg.includes('unavailable')
}

function retryDelay(err: unknown, attempt: number): number {
  const msg = err instanceof Error ? err.message : String(err)
  const parsed = msg.match(/retry in ([\d.]+)s/i)
  if (parsed) return Math.ceil(parseFloat(parsed[1]) * 1000) + 1000
  const is429 = /429|quota|resource_exhausted/i.test(msg)
  return is429 ? [15000, 30000][attempt - 1] ?? 30000 : [2000, 4000][attempt - 1] ?? 4000
}

// ── Handler ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body            = await req.json()
  const messages: Message[] = Array.isArray(body.messages) ? body.messages : []
  const sessionData: SessionData = body.sessionData ?? {}
  const agencyName      = sessionData.agencyName ?? 'Démo LeadFlow'
  const propertyContext = sessionData.propertyContext ?? null
  const clientId        = typeof sessionData.clientId === 'string' ? sessionData.clientId : null
  const agencyContext   = typeof sessionData.agencyContext === 'string' ? sessionData.agencyContext : null

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'No API key configured' }, { status: 500 })

  // Derive known location from the property context directly (no DB round-trip)
  const knownLocation = propertyContext
    ? [propertyContext.location, propertyContext.city].filter(Boolean).join(', ') || null
    : null

  // Per-client context for Entry 1 — skipped when Entry 2 applies (propertyContext present)
  // Priority: DB description > direct agencyContext prop > null (generic fallback)
  let agencyDescription: string | null = agencyContext
  if (clientId && !propertyContext) {
    try {
      const { data } = await supabaseServer
        .from('clients')
        .select('description')
        .eq('client_id', clientId)
        .maybeSingle()
      if (data?.description) agencyDescription = data.description
    } catch {
      // non-fatal: agencyContext (if any) still used
    }
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const systemPrompt = buildSystemPrompt(agencyName, propertyContext, agencyDescription)
    const history = messages
      .map(m => `${m.role === 'user' ? 'Visiteur' : 'Assistant'}: ${m.content}`)
      .join('\n\n')

    const prompt = `${systemPrompt}\n\n---\nHistorique:\n${history}\n\nAssistant:`

    let text = ''
    let lastErr: unknown
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        })
        text = (result.text ?? '').trim()
        lastErr = undefined
        break
      } catch (err) {
        lastErr = err
        if (!isRetryable(err) || attempt === 2) break
        await sleep(retryDelay(err, attempt + 1))
      }
    }
    if (lastErr) {
      if (isRetryable(lastErr))
        return NextResponse.json({
          reply: "Je rencontre un souci technique momentané, pouvez-vous reformuler votre message ?",
          isComplete: false,
        })
      throw lastErr
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        if (parsed.done && parsed.lead) {
          const rawLead = parsed.lead as RawLead
          const score   = calculateScore(rawLead)
          await saveLead(rawLead, score, propertyContext?.title, knownLocation, clientId)
          return NextResponse.json({
            reply:      parsed.message ?? 'Merci pour ces informations !',
            isComplete: true,
            score,
            lead:       buildLeadPayload(rawLead, score, knownLocation),
          })
        }
      } catch {
        // not valid JSON — fall through to plain reply
      }
    }

    return NextResponse.json({ reply: text, isComplete: false })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[qualify] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
