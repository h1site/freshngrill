import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  if (!query || query.length < 2) {
    return NextResponse.json({ recipes: [], posts: [] });
  }

  const searchTerm = `%${query}%`;
  const actualLimit = Math.min(limit, 50);

  // Rechercher dans les recettes
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, slug, title, featured_image, total_time, difficulty, excerpt')
    .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
    .order('likes', { ascending: false })
    .limit(actualLimit);

  if (recipesError) {
    console.error('Erreur recherche recettes:', recipesError);
  }

  // Rechercher dans les posts/blog
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('id, slug, title, featured_image, excerpt')
    .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
    .eq('status', 'publish')
    .order('published_at', { ascending: false })
    .limit(actualLimit);

  if (postsError) {
    console.error('Erreur recherche posts:', postsError);
  }

  return NextResponse.json({
    recipes: recipes || [],
    posts: posts || [],
  });
}
