import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import RecipeEditForm from '@/components/admin/RecipeEditForm';
import type { Database } from '@/types/database';

type Recipe = Database['public']['Tables']['recipes']['Row'];
type Category = { id: number; name: string; slug: string };

async function getRecipe(id: string): Promise<Recipe | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Recipe;
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('id, name, slug');
  return (data as Category[] | null) || [];
}

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [recipe, categories] = await Promise.all([
    getRecipe(id),
    getCategories(),
  ]);

  if (!recipe) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Éditer: {recipe.title}
      </h1>
      <RecipeEditForm recipe={recipe} categories={categories} />
    </div>
  );
}
