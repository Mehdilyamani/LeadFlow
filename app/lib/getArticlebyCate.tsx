// lib/getArticlesByCategory.ts
import supabaseAdmin from './admin'; // adjust path if your admin client is elsewhere
import type { ArticleType } from './types'; // adjust path if necessary

/**
 * Fetch all articles for a given category (server-side).
 */
export async function getArticlesByCategory(category: string): Promise<ArticleType[]> {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('categorie', category)
    .order('created_at', { ascending: false }); // newest first

  if (error) {
    console.error('getArticlesByCategory error', error);
    throw error;
  }

  // Ensure we return an array typed as ArticleType[]
  return (data ?? []) as ArticleType[];
}
