// lib/getOrderByRef.ts
import { createClient } from '@supabase/supabase-js';
import supabaseAdmin from './admin';

export async function getOrderByRef(ref: string | undefined) {
  if (!ref) return null;

  // Select full row from orders table
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('order_ref', ref)
    .maybeSingle(); // returns null if not found

  if (error) {
    console.error('Supabase error in getOrderByRef:', error);
    return null;
  }
  return data;
}
