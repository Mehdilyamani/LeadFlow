import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildSystemPrompt(agencyName: string) {
  return `Tu es l'assistant IA de "${agencyName}", une agence immobilière premium au Maroc.
Ton rôle: qualifier les prospects immobiliers de manière naturelle et chaleureuse.

PROTOCOLE DE QUALIFICATION (5 étapes, une question à la fois):
Étape 1 → Accueil chaleureux + "Vous cherchez à acheter ou à louer ?"
Étape 2 → "Quel type de bien vous intéresse ? (villa, appartement, penthouse, local commercial...)"
Étape 3 → "Quel est votre budget approximatif ? (en MAD)"
Étape 4 → "Dans quelle ville ou quartier cherchez-vous ?"
Étape 5 → "Quel est votre délai de projet ?" puis si pas encore fourni: "Et comment peut-on vous contacter ? (prénom + numéro)"

RÈGLES:
- Une seule question par message
- Sois chaleureux, professionnel, concis (max 2-3 phrases)
- Réponds en français. Si le visiteur écrit en darija, adapte-toi naturellement
- Ne mentionne jamais que tu es une IA — tu es simplement "l'assistant de ${agencyName}"
- Reformule les réponses pour confirmer que tu as bien compris avant de poser la question suivante

APRÈS AVOIR COLLECTÉ LES 5 INFOS, réponds UNIQUEMENT avec ce JSON (aucun texte en dehors):
{
  "done": true,
  "summary": "Message de remerciement personnalisé de 2 phrases avec les détails de leur projet",
  "lead": {
    "type": "Achat ou Location",
    "propertyType": "type de bien exact",
    "budget": "montant ou fourchette en MAD",
    "location": "ville ou quartier",
    "timeline": "délai du projet",
    "contact": "prénom et/ou téléphone",
    "score": 7,
    "label": "Hot ou Warm ou Cold",
    "reason": "Justification du score en une phrase courte"
  }
}

CRITÈRES DE SCORING:
Hot (8-10): Budget précis ≥ 1M MAD + délai ≤ 3 mois + coordonnées complètes
Warm (5-7): Budget approximatif OU délai 3-6 mois OU contact partiel
Cold (1-4): Budget très vague (< 500k ou non précisé) OU délai > 6 mois OU pas de contact`
}

export async function POST(req: NextRequest) {
  try {
    const { messages, agencyName } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: buildSystemPrompt(agencyName || 'Prestige Immobilier'),
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const text =
      response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    // Detect done JSON
    if (text.startsWith('{')) {
      try {
        const parsed = JSON.parse(text)
        if (parsed.done) {
          return NextResponse.json({
            message: parsed.summary,
            done: true,
            lead: parsed.lead,
          })
        }
      } catch {
        // fall through to plain message
      }
    }

    return NextResponse.json({ message: text, done: false })
  } catch (err) {
    console.error('qualify API error:', err)
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }
}
