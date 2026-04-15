// app/api/chat/route.ts
// @ts-nocheck
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_DASHBOARD_URL = 'https://lerestau.vercel.app/admin';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

const JSON_HEADERS = {
  ...CORS_HEADERS,
  'Content-Type': 'application/json; charset=utf-8',
};

// ✅ FIX 1: v1beta is required for gemini-2.5-flash (v1 does NOT support it)
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type ChatMessage = {
  role?: string;
  content?: string;
};

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

function safeString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function extractJsonObject(text: string): any | null {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function getModelText(data: any): string {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text || '')
      .join('')
      .trim() || ''
  );
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return jsonResponse({ reply: 'Bad Request' }, 400);

    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];

    const { data: menuItems, error: menuError } = await supabase
      .from('articles')
      .select('name, price, categorie')
      .eq('is_available', true);

    if (menuError) console.error('[chat] menu query error:', menuError);

    const menuString =
      menuItems?.map((it: any) => `- ${it.name} (${it.price} DH)`).join('\n') ||
      'Menu non disponible';

    const recentMessages = messages.slice(-10);
    const conversationHistory = recentMessages
      .map((m) => `${m.role === 'user' ? 'CLIENT' : 'SERVEUR'}: ${safeString(m.content)}`)
      .join('\n');

const systemInstruction = `
You are the Maître d'Hôtel of "Restau".
Your personality: warm, elegant, natural, never robotic.
You automatically detect and match the language of each customer — French, English, Arabic, or any other language they use.

OBJECTIVE:
Make the customer feel welcomed. Help them if they want to order, or take a reservation — whichever they need. Not every customer wants to order in advance. Follow their lead.

FLOWS:

A) RESERVATION ONLY (customer just wants a table):
1. Elegant welcome
2. Ask gently for the occasion or number of guests — only if it feels natural
3. Suggest a time if they're vague — never block on it
4. Get name if offered — never insist
5. Confirm warmly

B) ORDER + RESERVATION (customer wants to pre-order):
1. Elegant welcome
2. Offer ONE suggestion from the menu to spark interest
3. Let them guide — propose courses only if they want to continue
4. Gather reservation info naturally at the end
5. Confirm everything in one elegant message

C) QUESTIONS / FAQ (customer just has a question):
1. Answer naturally and helpfully
2. Gently offer to take a reservation at the end if relevant — never force it

CRITICAL RULES:
- NEVER list the full menu
- NEVER ask multiple questions at once
- NEVER insist or repeat a question more than once if unanswered — move on gracefully
- Time is helpful but NEVER a blocker — accept vague answers like "tonight", "around 8", "this weekend"
- Name and guest count are OPTIONAL — if the customer doesn't provide them, that's fine
- If you have ENOUGH to save (at minimum: some intent to reserve OR an order), trigger the save
- NEVER sound like a form. Sound like a person.

WHAT "ENOUGH" MEANS TO SAVE:
- A reservation: you have at least a time OR a date, even vague
- An order: you have at least one dish chosen
- Name and guest count enrich the record but are never required to save

STYLE:
- Short messages, one idea at a time
- Warm and confident, never pushy
- Give the customer space to say yes or no
- Match their energy — formal if they're formal, casual if they're casual

EXAMPLES:
- "Bonsoir ! Ravi de vous accueillir. Vous souhaitez réserver une table, ou je peux aussi vous aider à composer votre commande à l'avance ?"
- "Good evening! Welcome to Restau. Can I help you with a reservation, or would you like to take a look at what we're serving tonight?"
- "No problem at all — I'll note you down for this evening. Shall I put a name on the reservation, or would you prefer to stay anonymous?"
- "Around 8 works perfectly. I'll have a table ready for you."

MENU (for inspiration and suggestions only — never display in full):
${menuString}

SAVE RULE:
Return the JSON below ONLY when you have enough information to save something useful.
All fields except action and reply are optional — fill what you have, leave others as null.

{
  "action": "SAVE_RESERVATION",
  "name": null,
  "guests": null,
  "time": null,
  "order": null,
  "notes": "",
  "reply": "your warm confirmation message here"
}

If you don't have enough yet, keep the conversation going naturally. Never return JSON mid-conversation.
`.trim();

    const apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY;

    if (!apiKey) return jsonResponse({ reply: 'Server misconfiguration' }, 500);

    const prompt = `${systemInstruction}\n\nHISTORIQUE:\n${conversationHistory}\n\nSERVEUR:`;

    // ✅ FIX 2: Use x-goog-api-key header instead of query param
    const aiResp = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
    });

    const raw = await aiResp.text();
    console.log('[chat] gemini status:', aiResp.status);

    let data: any = null;
    try {
      data = JSON.parse(raw);
    } catch {
      console.error('[chat] Gemini returned non-JSON:', raw.slice(0, 300));
    }

    if (!aiResp.ok) {
      console.error('[chat] Gemini HTTP error:', data?.error || raw.slice(0, 300));
      return jsonResponse(
        { reply: "Désolé, notre assistant est momentanément indisponible. Appelez-nous directement !" },
        200
      );
    }

    if (data?.promptFeedback?.blockReason) {
      console.error('[chat] Prompt blocked:', data.promptFeedback.blockReason);
      return jsonResponse(
        { reply: "Désolé, notre assistant est momentanément indisponible. Appelez-nous directement !" },
        200
      );
    }

    const rawText = getModelText(data);

    if (!rawText) {
      console.error('[chat] Empty Gemini response:', JSON.stringify(data).slice(0, 300));
      return jsonResponse(
        { reply: "Désolé, notre assistant est momentanément indisponible. Appelez-nous directement !" },
        200
      );
    }

    const orderData = extractJsonObject(rawText);

    if (orderData?.action === 'SAVE_RESERVATION') {
      const { error: insertError } = await supabase.from('reservations').insert([{
        name: safeString(orderData.name),
        guest_count: parseInt(orderData.guests, 10) || null,
        reservation_time: safeString(orderData.time),
        order: safeString(orderData.order),
        notes: safeString(orderData.notes),
        status: 'pending',
      }]);

      if (insertError) console.error('[chat] reservation insert error:', insertError);

      if (process.env.PIPEDREAM_URL) {
        fetch(process.env.PIPEDREAM_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...orderData, admin_link: ADMIN_DASHBOARD_URL }),
        }).catch((e) => console.error('[chat] pipedream error', e));
      }

      return jsonResponse({ ok: true, reply: safeString(orderData.reply) || rawText }, 200);
    }

    return new Response(rawText, {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (err) {
    console.error('[chat] unexpected error', err);
    return jsonResponse({ reply: 'Erreur serveur, veuillez réessayer.' }, 500);
  }
}