import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const n8nUrl =
      'http://localhost:5678/webhook/a2fc8532-43a1-45b4-bb5e-7be307c0bcbd';

    const r = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    return new NextResponse(text, { status: r.status });
  } catch (err) {
    console.error('proxy error', err);
    return NextResponse.json({ ok: false, error: 'proxy error' }, { status: 500 });
  }
}

// optional: handle preflight (CORS) if you ever call this from outside Next.js
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
