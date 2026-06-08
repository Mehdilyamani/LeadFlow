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
}

interface SessionData {
  agencyName?: string
  propertyContext?: PropertyContext | null
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
function buildSystemPrompt(
  agencyName: string,
  propertyContext?: PropertyContext | null,
  knownLocation?: string | null,
) {
  const contextLine = propertyContext
    ? `\nContexte : le visiteur consulte "${propertyContext.title}".`
    : ''

  // Fix 1: when widget already greeted the visitor, Gemini must NOT add its own welcome
  const greetingInstruction = propertyContext
    ? `IMPORTANT : le widget a déjà accueilli le visiteur et mentionné ce bien. Ta toute première réponse doit être UNIQUEMENT la question du prénom et du contact (question 1) — sans salutation, sans introduction, sans répétition du nom du bien.`
    : `Pour la toute première question, commence par une courte salutation puis pose la question 1 (prénom + contact).`

  // Fix 2: skip location question when we already know it
  const questionCount = knownLocation ? 4 : 5
  const questions = knownLocation
    ? `Collecte dans cet ordre :
1. Prénom ET contact — pose exactement : "Quel est votre prénom et votre numéro WhatsApp (ou email) pour qu'un conseiller vous recontacte ?"
   → Si le visiteur donne seulement un prénom sans numéro ni email, redemande-lui le contact AVANT de continuer.
   → name = prénom uniquement / contact = numéro de téléphone ou adresse email
2. Budget (moins de 500k / 500k-1M / plus d'1M MAD)
3. Délai (ce mois-ci / dans 3 mois / dans 6 mois / je regarde)
4. Type de bien (appartement / villa / terrain)

NE pose PAS de question sur la ville ou le quartier — la localisation est déjà connue : ${knownLocation}.`
    : `Collecte dans cet ordre :
1. Prénom ET contact — pose exactement : "Quel est votre prénom et votre numéro WhatsApp (ou email) pour qu'un conseiller vous recontacte ?"
   → Si le visiteur donne seulement un prénom sans numéro ni email, redemande-lui le contact AVANT de continuer.
   → name = prénom uniquement / contact = numéro de téléphone ou adresse email
2. Budget (moins de 500k / 500k-1M / plus d'1M MAD)
3. Délai (ce mois-ci / dans 3 mois / dans 6 mois / je regarde)
4. Type de bien (appartement / villa / terrain)
5. Ville ou quartier`

  const locationInJson = knownLocation
    ? `"location":"${knownLocation.replace(/"/g, '\\"')}"`
    : `"location":"..."`

  return `Tu es l'assistant de "${agencyName}".${contextLine}
Qualifie le visiteur en ${questionCount} questions courtes.
Ton style : simple, humain, 1-2 phrases max.
${greetingInstruction}

${questions}

Une question à la fois. Pas de formules corporate.
Langue : français. Darija si le visiteur l'utilise.

Quand tu as les ${questionCount} réponses, réponds UNIQUEMENT avec ce JSON :
{"done":true,"message":"Parfait [prénom], un conseiller vous rappelle bientôt.","lead":{"name":"[prénom]","contact":"[prénom]","budget":"...","timeline":"...","property_type":"...",${locationInJson}}}`
}

// ── Score → widget display mapping ────────────────────────────────────────────
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

// ── Insert lead into Supabase ──────────────────────────────────────────────────
async function saveLead(
  lead: RawLead,
  score: Score,
  propertyInterest?: string | null,
  knownLocation?: string | null,
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
  })
  if (error) console.error('Supabase insert error:', error.message)
}

// ── Handler ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body            = await req.json()
  const messages: Message[] = Array.isArray(body.messages) ? body.messages : []
  const sessionData: SessionData = body.sessionData ?? {}
  const agencyName      = sessionData.agencyName ?? 'Prestige Immobilier'
  const propertyContext = sessionData.propertyContext ?? null

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key configured' }, { status: 500 })
  }

  // Fix 2: look up the property's location from DB to skip the location question
  let knownLocation: string | null = null
  if (propertyContext?.id) {
    const { data } = await supabaseServer
      .from('properties')
      .select('location, city')
      .eq('id', propertyContext.id)
      .single()
    if (data?.location) {
      knownLocation = [data.location, data.city].filter(Boolean).join(', ')
    }
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const systemPrompt = buildSystemPrompt(agencyName, propertyContext, knownLocation)
    const history = messages
      .map(m => `${m.role === 'user' ? 'Visiteur' : 'Assistant'}: ${m.content}`)
      .join('\n\n')

    const prompt = `${systemPrompt}\n\n---\nHistorique:\n${history}\n\nAssistant:`

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
          await saveLead(rawLead, score, propertyContext?.title, knownLocation)
          return NextResponse.json({
            reply:      parsed.message ?? 'Merci pour ces informations !',
            isComplete: true,
            score,
            lead:       buildLeadPayload(rawLead, score, knownLocation),
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
