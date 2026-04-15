// lib/getArticleById.ts
// SERVER ONLY: don't import this file from a 'use client' file
import  supabaseAdmin  from './admin'; // your server admin client
import type { ArticleType } from './types';

export async function getArticleById(id: string): Promise<ArticleType | null> {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('id', id)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('getArticleById error', error);
    throw error;
  }
  return (data as ArticleType) ?? null;
}
