// app/api/good-articles/route.ts
import { NextResponse } from 'next/server';
import supabaseAdmin from '../../lib/admin'; // adjust if your lib path differs
import type { ArticleType } from '../../lib/types';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('is_good', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error /api/good-articles:', error);
      return NextResponse.json([], { status: 500 });
    }

    return NextResponse.json((data ?? []) as ArticleType[]);
  } catch (err) {
    console.error('Unexpected error /api/good-articles:', err);
    return NextResponse.json([], { status: 500 });
  }
}
