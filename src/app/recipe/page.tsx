import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PinterestGrid from '@/components/recipe/PinterestGrid';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Recipes',
  description: 'Browse our collection of BBQ recipes, grilling guides, and outdoor cooking ideas.',
};

async function getRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, title, excerpt, featured_image, pinterest_image, total_time, difficulty, tags')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return data || [];
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide text-neutral-900 mb-8">
          Recipes
        </h1>
        <PinterestGrid recipes={recipes} />
      </div>
    </main>
  );
}
