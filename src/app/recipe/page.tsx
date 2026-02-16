import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import RecipePageClient from '@/components/recipe/RecipePageClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Recipes',
  description: 'Browse our collection of BBQ recipes, grilling guides, and outdoor cooking ideas.',
  alternates: {
    canonical: '/recipe/',
  },
  openGraph: {
    title: "Recipes | Fresh N' Grill",
    description: 'Browse our collection of BBQ recipes, grilling guides, and outdoor cooking ideas.',
    url: '/recipe/',
    siteName: "Fresh N' Grill",
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Recipes | Fresh N' Grill",
    description: 'Browse our collection of BBQ recipes, grilling guides, and outdoor cooking ideas.',
  },
};

async function getRecipes() {
  const { data, error } = await supabase
    .from('recipes_with_categories')
    .select('id, slug, title, excerpt, featured_image, pinterest_image, total_time, difficulty, tags, categories')
    .not('featured_image', 'is', null)
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
        <RecipePageClient recipes={recipes} />
      </div>
    </main>
  );
}
