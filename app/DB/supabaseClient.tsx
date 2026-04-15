// src/DBs/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Helpful runtime check so the error is clear
if (!supabaseUrl || !supabaseKey ) {
  throw new Error('Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY to .env.local and restart dev server.');
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase client created');
export default supabase;
