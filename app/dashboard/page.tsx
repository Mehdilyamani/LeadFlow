import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const clientId = (user.app_metadata?.client_id as string) ?? null

  const [leadsResult, clientResult] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }),
    clientId
      ? supabase.from('clients').select('agency_name').eq('client_id', clientId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  const agencyName = clientResult.data?.agency_name ?? 'LeadFlow'

  return <DashboardClient leads={leadsResult.data ?? []} agencyName={agencyName} />
}
