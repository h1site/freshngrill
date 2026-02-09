import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import CreateCategoryForm from '@/components/admin/CreateCategoryForm';

interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  recipe_count: number;
  name_en: string | null;
}

async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const supabase = await createClient();

  const { data: categoriesData, error } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id')
    .order('name');

  const categories = (categoriesData as { id: number; name: string; slug: string; parent_id: number | null }[] | null) || [];
  if (error || categories.length === 0) return [];

  const { data: recipeCountsData } = await supabase
    .from('recipe_categories')
    .select('category_id');

  const countMap = new Map<number, number>();
  ((recipeCountsData as { category_id: number }[] | null) || []).forEach((rc) => {
    countMap.set(rc.category_id, (countMap.get(rc.category_id) || 0) + 1);
  });

  const { data: translationsData } = await supabase
    .from('category_translations')
    .select('category_id, name')
    .eq('locale', 'en');

  const transMap = new Map<number, string>();
  ((translationsData as { category_id: number; name: string }[] | null) || []).forEach((t) => {
    transMap.set(t.category_id, t.name);
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    parent_id: cat.parent_id,
    recipe_count: countMap.get(cat.id) || 0,
    name_en: transMap.get(cat.id) || null,
  }));
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
      </div>

      <CreateCategoryForm />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom (FR)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom (EN)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recettes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cat.name_en || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">/{cat.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cat.recipe_count}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/categories/${cat.id}`}
                    className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                  >
                    Gérer les recettes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        {categories.length} catégorie{categories.length > 1 ? 's' : ''} au total
      </div>
    </div>
  );
}
