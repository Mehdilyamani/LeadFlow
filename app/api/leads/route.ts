import { NextRequest, NextResponse } from 'next/server'
import supabaseServer from '../../DB/supabaseServer'

export async function GET(req: NextRequest) {
  const password = req.headers.get('x-dashboard-password')
  const expected = process.env.DASHBOARD_PASSWORD

  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseServer
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ leads: data })
}
