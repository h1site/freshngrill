import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import PostEditForm from '@/components/admin/PostEditForm';

interface Props {
  params: Promise<{ id: string }>;
}

async function getPost(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as any;
}

async function getPostCategories() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('post_categories')
    .select('id, name, slug')
    .order('name');

  return data || [];
}

export default async function PostEditPage({ params }: Props) {
  const { id } = await params;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    notFound();
  }

  const [post, categories] = await Promise.all([
    getPost(postId),
    getPostCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Éditer l&apos;article</h1>
        <p className="text-gray-500 mt-1">{post.title}</p>
      </div>

      <PostEditForm post={post} categories={categories} />
    </div>
  );
}
