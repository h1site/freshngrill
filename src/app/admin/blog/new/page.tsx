import { createClient } from '@/lib/supabase-server';
import PostEditForm from '@/components/admin/PostEditForm';

async function getPostCategories() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('post_categories')
    .select('id, name, slug')
    .order('name');

  return data || [];
}

export default async function NewPostPage() {
  const categories = await getPostCategories();

  // Create empty post object for the form
  const emptyPost = {
    id: 0,
    slug: '',
    title: '',
    excerpt: null,
    content: null,
    featured_image: null,
    pinterest_image: null,
    status: 'draft',
    author_id: null,
    reading_time: 5,
    seo_title: null,
    seo_description: null,
    published_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: null,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nouvel article</h1>
        <p className="text-gray-500 mt-1">Créer un nouvel article de blog</p>
      </div>

      <PostEditForm post={emptyPost} categories={categories} isNew />
    </div>
  );
}
