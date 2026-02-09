import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import CategoryRecipeManager from '@/components/admin/CategoryRecipeManager';
import DeleteCategoryButton from '@/components/admin/DeleteCategoryButton';

async function getCategoryWithRecipes(id: string) {
  const supabase = await createClient();
  const categoryId = parseInt(id, 10);
  if (isNaN(categoryId)) return null;

  const { data: categoryData, error } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id')
    .eq('id', categoryId)
    .single();

  const category = categoryData as { id: number; name: string; slug: string; parent_id: number | null } | null;
  if (error || !category) return null;

  const { data: assignmentsData } = await supabase
    .from('recipe_categories')
    .select('recipe_id')
    .eq('category_id', categoryId);

  const assignments = (assignmentsData as { recipe_id: number }[] | null) || [];
  const recipeIds = assignments.map((a) => a.recipe_id);

  let assignedRecipes: { id: number; title: string; slug: string; featured_image: string | null }[] = [];
  if (recipeIds.length > 0) {
    const { data } = await supabase
      .from('recipes')
      .select('id, title, slug, featured_image')
      .in('id', recipeIds)
      .order('title');
    assignedRecipes = (data as typeof assignedRecipes | null) || [];
  }

  return { category, assignedRecipes };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCategoryWithRecipes(id);

  if (!result) notFound();

  const { category, assignedRecipes } = result;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="text-orange-600 hover:text-orange-700 text-sm"
        >
          &larr; Retour aux catégories
        </Link>
      </div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
      </div>
      <p className="text-sm text-gray-500 mb-8 font-mono">/{category.slug}</p>

      <CategoryRecipeManager
        categoryId={category.id}
        initialRecipes={assignedRecipes}
      />
    </div>
  );
}
