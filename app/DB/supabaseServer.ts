import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

// Service-role client: bypasses RLS, server-side only — never expose to browser
const supabaseServer = createClient(url, serviceKey, {
  auth: { persistSession: false },
})

export default supabaseServer
