import { NextResponse } from 'next/server'
import supabaseServer from '../../DB/supabaseServer'

export async function GET() {
  const { data, error } = await supabaseServer
    .from('leads')
    .select('id')
    .limit(1)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, message: 'leads table reachable', rows: data })
}
