import supabaseAdmin from './admin';
import type { ArticleType } from './types';

async function getArticles(): Promise<ArticleType[]> {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*');

  if (error) {
    console.log('Error fetching articles:', error);
    return [];
  }

  // supabase returns data | null, normalize to array
  console.log('Fetched articles:', data);
  return (data ?? []) as ArticleType[];
}

export default getArticles;
