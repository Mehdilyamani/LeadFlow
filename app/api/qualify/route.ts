import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// ── Types ──────────────────────────────────────────────────────────────────────
interface IncomingMessage {
  role: 'user' | 'assistant'
  content: string
}

// ── System prompt ──────────────────────────────────────────────────────────────
function buildSystemPrompt(agencyName: string) {
  return `Tu es l'assistant IA de "${agencyName}", une agence immobilière premium au Maroc.
Ton rôle: qualifier les prospects immobiliers de manière naturelle et chaleureuse.

PROTOCOLE DE QUALIFICATION (5 questions, une à la fois):
Q1 → "Vous cherchez à acheter ou à louer ?"
Q2 → "Quel type de bien vous intéresse ? (villa, appartement, penthouse...)"
Q3 → "Quel est votre budget approximatif ?"
Q4 → "Dans quelle ville ou quartier ?"
Q5 → "Dans quel délai souhaitez-vous concrétiser votre projet ? Et votre prénom ?"

RÈGLES:
- Une seule question par message
- Sois chaleureux, professionnel, concis (2-3 phrases max)
- Confirme la réponse précédente avant de poser la question suivante
- Réponds en français. Si le visiteur écrit en darija, adapte-toi naturellement

APRÈS AVOIR COLLECTÉ LES 5 RÉPONSES, réponds UNIQUEMENT avec ce JSON (rien d'autre):
{"done":true,"message":"Message de remerciement personnalisé de 2 phrases","lead":{"name":"prénom du prospect","budget":"montant ou fourchette","type":"Achat ou Location","propertyType":"type de bien exact","location":"ville ou quartier","timeline":"délai précis","score":7,"temperature":"Hot","reason":"Justification courte du score"}}

CRITÈRES DE SCORE:
- Hot (score 8-10): Budget précis élevé + délai ≤ 3 mois + coordonnées complètes
- Warm (score 5-7): Budget approximatif OU délai 3-6 mois OU contact partiel
- Cold (score 1-4): Budget vague OU délai > 6 mois OU pas de contact`
}

// ── Mock fallback (when API key is absent) ─────────────────────────────────────
const MOCK_QUESTIONS = [
  "Parfait, merci ! Quel type de bien vous intéresse ? (villa, appartement, penthouse...)",
  "Super choix ! Quel est votre budget approximatif pour ce projet ?",
  "Excellent ! Dans quelle ville ou quartier cherchez-vous ce bien ?",
  "Très bien ! Dans quel délai souhaitez-vous concrétiser votre projet ? Et quel est votre prénom ?",
]

const MOCK_LEAD = {
  name: "Mohammed",
  budget: "5 000 000 MAD",
  type: "Achat",
  propertyType: "Villa",
  location: "Casablanca",
  timeline: "3 mois",
  score: 9,
  temperature: "Hot" as const,
  reason: "Budget précis élevé, délai court et prospect très motivé.",
}

function getMockResponse(messages: IncomingMessage[]) {
  const userCount = messages.filter(m => m.role === 'user').length
  if (userCount < MOCK_QUESTIONS.length) {
    return { done: false, message: MOCK_QUESTIONS[userCount - 1] }
  }
  return {
    done: true,
    message: `Merci ${MOCK_LEAD.name} ! Votre dossier a été transmis à notre équipe — un conseiller vous contacte sous 30 minutes. 🏠`,
    lead: MOCK_LEAD,
  }
}

// ── Normalize lead from Gemini JSON → widget format ────────────────────────────
function normalizeLead(raw: Record<string, unknown>) {
  const temp = (raw.temperature as string) || 'Warm'
  return {
    name: (raw.name as string) || 'Prospect',
    budget: (raw.budget as string) || 'Non précisé',
    type: (raw.type as string) || 'Achat',
    propertyType: (raw.propertyType as string) || 'Bien immobilier',
    location: (raw.location as string) || 'Maroc',
    timeline: (raw.timeline as string) || 'Non précisé',
    contact: (raw.name as string) || 'Non fourni',
    score: typeof raw.score === 'number' ? raw.score : 7,
    label: (temp === 'Hot' ? 'Hot' : temp === 'Cold' ? 'Cold' : 'Warm') as 'Hot' | 'Warm' | 'Cold',
    reason: (raw.reason as string) || `Score basé sur les critères de qualification.`,
  }
}

// ── Handler ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages, agencyName } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY

    // ── No API key → use mock so demo never breaks ──
    if (!apiKey) {
      const mock = getMockResponse(messages as IncomingMessage[])
      if (mock.done && 'lead' in mock) {
        return NextResponse.json({
          message: mock.message,
          done: true,
          lead: {
            ...mock.lead,
            contact: mock.lead.name,
            label: mock.lead.temperature,
            reason: mock.lead.reason,
          },
        })
      }
      return NextResponse.json({ message: mock.message, done: false })
    }

    // ── Gemini call ──
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const systemPrompt = buildSystemPrompt(agencyName || 'Prestige Immobilier')
    const conversationHistory = (messages as IncomingMessage[])
      .map(m => `${m.role === 'user' ? 'Visiteur' : 'Assistant'}: ${m.content}`)
      .join('\n\n')

    const prompt = `${systemPrompt}\n\n---\nHistorique de la conversation:\n${conversationHistory}\n\nAssistant:`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        if (parsed.done && parsed.lead) {
          return NextResponse.json({
            message: parsed.message || 'Merci pour ces informations !',
            done: true,
            lead: normalizeLead(parsed.lead),
          })
        }
      } catch {
        // fall through to plain message
      }
    }

    return NextResponse.json({ message: text, done: false })
  } catch (err) {
    console.error('qualify API error:', err)
    // Return a safe fallback so the demo never shows a broken state
    return NextResponse.json({
      message: "Je suis là pour vous aider ! Quel type de bien vous intéresse ?",
      done: false,
    })
  }
}
