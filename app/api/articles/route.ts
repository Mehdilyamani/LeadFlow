// app/api/articles/route.ts
import { NextResponse } from 'next/server';
// <-- adjust the import path below if your file is somewhere else.
// From app/api/articles/route.ts -> lib/admin at project root is usually '../../../lib/admin'
import supabaseAdmin from '../../lib/admin';
import type { ArticleType } from '../../lib/types';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*');

    if (error) {
      console.error('Supabase error fetching articles:', error);
      // return a 500 with an empty array so client can handle gracefully
      return NextResponse.json([], { status: 500 });
    }

    // Ensure we always return JSON array
    return NextResponse.json((data ?? []) as ArticleType[]);
  } catch (err) {
    console.error('Unexpected error in /api/articles GET:', err);
    return NextResponse.json([], { status: 500 });
  }
}
