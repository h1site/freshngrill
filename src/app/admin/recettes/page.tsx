import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import DeleteRecipeButton from '@/components/admin/DeleteRecipeButton';

interface RecipeListItem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  likes: number;
  created_at: string;
  featured_image: string | null;
}

const PAGE_SIZE = 50;

async function getRecipes(search?: string, page: number = 1): Promise<{ recipes: RecipeListItem[], total: number }> {
  const supabase = await createClient();

  // Get total count
  let countQuery = supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true });

  if (search) {
    countQuery = countQuery.ilike('title', `%${search}%`);
  }

  const { count } = await countQuery;

  // Get paginated data
  let query = supabase
    .from('recipes')
    .select('id, title, slug, difficulty, likes, created_at, featured_image')
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching recipes:', error);
    return { recipes: [], total: 0 };
  }

  return { recipes: (data as RecipeListItem[] | null) || [], total: count || 0 };
}

export default async function RecipesListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const { recipes, total } = await getRecipes(params.search, currentPage);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Recettes</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/recettes/import-json"
            className="inline-flex items-center px-4 py-2 border border-orange-600 text-sm font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Import JSON
          </Link>
          <Link
            href="/admin/recettes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            + Nouvelle recette
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form method="GET" className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={params.search}
            placeholder="Rechercher une recette..."
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Rechercher
          </button>
          {params.search && (
            <Link
              href="/admin/recettes"
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Effacer
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recette
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulté
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Likes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipes.map((recipe) => (
              <tr key={recipe.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {recipe.featured_image && (
                      <img
                        src={recipe.featured_image}
                        alt={recipe.title}
                        className="w-12 h-12 rounded object-cover mr-4"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {recipe.title}
                      </div>
                      <div className="text-sm text-gray-500">/{recipe.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DifficultyBadge difficulty={recipe.difficulty} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center text-sm text-pink-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {recipe.likes}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(recipe.created_at).toLocaleDateString('fr-CA')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/recette/${recipe.slug}`}
                      target="_blank"
                      className="text-gray-400 hover:text-gray-600"
                      title="Voir"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/admin/recettes/${recipe.id}`}
                      className="text-orange-600 hover:text-orange-900"
                      title="Éditer"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </Link>
                    <DeleteRecipeButton recipeId={recipe.id} recipeTitle={recipe.title} />
                  </div>
                </td>
              </tr>
            ))}
            {recipes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Aucune recette trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {total} recette{total > 1 ? 's' : ''} au total
          {totalPages > 1 && ` • Page ${currentPage} sur ${totalPages}`}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/recettes?page=${currentPage - 1}${params.search ? `&search=${params.search}` : ''}`}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                ← Précédent
              </Link>
            )}

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first, last, current, and pages around current
                  return page === 1 ||
                         page === totalPages ||
                         Math.abs(page - currentPage) <= 2;
                })
                .map((page, index, arr) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore = index > 0 && page - arr[index - 1] > 1;
                  return (
                    <span key={page} className="flex items-center">
                      {showEllipsisBefore && <span className="px-2 text-gray-400">...</span>}
                      <Link
                        href={`/admin/recettes?page=${page}${params.search ? `&search=${params.search}` : ''}`}
                        className={`px-3 py-1 text-sm rounded ${
                          page === currentPage
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </Link>
                    </span>
                  );
                })}
            </div>

            {currentPage < totalPages && (
              <Link
                href={`/admin/recettes?page=${currentPage + 1}${params.search ? `&search=${params.search}` : ''}`}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Suivant →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    facile: 'bg-green-100 text-green-800',
    moyen: 'bg-yellow-100 text-yellow-800',
    difficile: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {difficulty}
    </span>
  );
}
