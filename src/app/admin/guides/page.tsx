import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

interface GuideListItem {
  id: number;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
  featured_image: string | null;
}

async function getGuides(search?: string): Promise<GuideListItem[]> {
  const supabase = await createClient();

  // First get the guide-achat category ID
  const { data: category } = await supabase
    .from('post_categories')
    .select('id')
    .eq('slug', 'guide-achat')
    .single();

  if (!category) {
    console.error('Category guide-achat not found');
    return [];
  }

  // Get post IDs that belong to guide-achat category
  const { data: postCategories } = await supabase
    .from('posts_categories')
    .select('post_id')
    .eq('category_id', (category as any).id);

  if (!postCategories || postCategories.length === 0) {
    return [];
  }

  const postIds = (postCategories as any[]).map(pc => pc.post_id);

  // Get posts
  let query = supabase
    .from('posts')
    .select('id, title, slug, status, published_at, created_at, featured_image')
    .in('id', postIds)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query.limit(100);

  if (error) {
    console.error('Error fetching guides:', error);
    return [];
  }

  return (data as GuideListItem[] | null) || [];
}

export default async function GuidesListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const guides = await getGuides(params.search);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Guides d&apos;achat</h1>
        <Link
          href="/admin/guides/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
        >
          + Nouveau guide
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form method="GET" className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={params.search}
            placeholder="Rechercher un guide..."
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
              href="/admin/guides"
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
                Guide
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publié le
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guides.map((guide) => (
              <tr key={guide.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {guide.featured_image && (
                      <img
                        src={guide.featured_image}
                        alt={guide.title}
                        className="w-12 h-12 rounded object-cover mr-4"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {guide.title}
                      </div>
                      <div className="text-sm text-gray-500">/{guide.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={guide.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {guide.published_at
                    ? new Date(guide.published_at).toLocaleDateString('fr-CA')
                    : '-'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/guide-achat/${guide.slug}`}
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
                      href={`/admin/guides/${guide.id}`}
                      className="text-orange-600 hover:text-orange-900"
                      title="Éditer"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {guides.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Aucun guide trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {guides.length} guide{guides.length > 1 ? 's' : ''}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    publish: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const labels: Record<string, string> = {
    publish: 'Publié',
    draft: 'Brouillon',
    pending: 'En attente',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  );
}
