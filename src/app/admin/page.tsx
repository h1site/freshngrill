import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

async function getStats() {
  const supabase = await createClient();

  const [recipesResult, ingredientsResult, categoriesResult] = await Promise.all([
    supabase.from('recipes').select('id, likes', { count: 'exact' }),
    supabase.from('ingredients').select('id', { count: 'exact' }),
    supabase.from('categories').select('id', { count: 'exact' }),
  ]);

  const recipes = recipesResult.data as Array<{ id: number; likes: number }> | null;
  const totalLikes = recipes?.reduce((sum, r) => sum + (r.likes || 0), 0) || 0;

  return {
    recipes: recipesResult.count || 0,
    ingredients: ingredientsResult.count || 0,
    categories: categoriesResult.count || 0,
    totalLikes,
  };
}

interface RecentRecipe {
  id: number;
  title: string;
  slug: string;
  created_at: string;
  likes: number;
}

async function getRecentRecipes(): Promise<RecentRecipe[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('recipes')
    .select('id, title, slug, created_at, likes')
    .order('created_at', { ascending: false })
    .limit(5);

  return (data as RecentRecipe[] | null) || [];
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentRecipes = await getRecentRecipes();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Recettes" value={stats.recipes} icon="book" color="bg-orange-500" />
        <StatCard title="Ingrédients" value={stats.ingredients} icon="list" color="bg-green-500" />
        <StatCard title="Catégories" value={stats.categories} icon="folder" color="bg-blue-500" />
        <StatCard title="Total Likes" value={stats.totalLikes} icon="heart" color="bg-pink-500" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/recettes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            + Nouvelle recette
          </Link>
          <Link
            href="/admin/import"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Importer des recettes
          </Link>
        </div>
      </div>

      {/* Recent Recipes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Dernières recettes</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentRecipes.map((recipe) => (
            <li key={recipe.id} className="px-6 py-4 hover:bg-gray-50">
              <Link href={`/admin/recettes/${recipe.id}`} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{recipe.title}</p>
                  <p className="text-sm text-gray-500">/{recipe.slug}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {new Date(recipe.created_at).toLocaleDateString('fr-CA')}
                  </span>
                  <span className="inline-flex items-center text-sm text-pink-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {recipe.likes}
                  </span>
                </div>
              </Link>
            </li>
          ))}
          {recentRecipes.length === 0 && (
            <li className="px-6 py-4 text-sm text-gray-500 text-center">
              Aucune recette trouvée
            </li>
          )}
        </ul>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link href="/admin/recettes" className="text-sm text-orange-600 hover:text-orange-500">
            Voir toutes les recettes &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    book: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    list: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    folder: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
    heart: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${color} rounded-full p-3 text-white`}>
          {icons[icon]}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
