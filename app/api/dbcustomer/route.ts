// @ts-nocheck
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: `Tu es l'assistant du restaurant Le Gourmet. 
               Ton but est de prendre des réservations.
               Sois court, poli et professionnel.`,
    });

    // --- LE FIX EST ICI ---
    // On renvoie le flux de texte BRUT directement.
    // Pas de protocoles compliqués. Juste les mots.
    return new Response(result.textStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error("Erreur API:", error);
    return new Response("Désolé, je suis fatigué.", { status: 500 });
  }
}