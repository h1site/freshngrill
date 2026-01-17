import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getUser } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import CommentsList from '@/components/profile/CommentsList';

export const metadata: Metadata = {
  title: 'Mes commentaires | Menucochon',
  description: 'Consultez tous vos commentaires sur les recettes.',
};

interface UserComment {
  id: number;
  content: string;
  created_at: string;
  recipes: {
    id: number;
    slug: string;
    title: string;
    featured_image: string | null;
  };
}

export default async function CommentairesPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login?redirectTo=/profil/commentaires');
  }

  const supabase = await createClient();

  // Récupérer tous les commentaires
  const { data: comments } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      recipes (
        id,
        slug,
        title,
        featured_image
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const userComments = (comments || []) as unknown as UserComment[];

  // Transformer pour le composant client
  const commentsData = userComments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.created_at,
    recipeId: comment.recipes.id,
    recipeSlug: comment.recipes.slug,
    recipeTitle: comment.recipes.title,
    recipeFeaturedImage: comment.recipes.featured_image,
  }));

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au profil
          </Link>
          <h1 className="font-display text-3xl md:text-4xl flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-500" />
            Mes commentaires
          </h1>
        </div>
      </section>

      {/* Liste des commentaires */}
      <section className="container mx-auto px-4 py-12">
        <CommentsList initialComments={commentsData} />
      </section>
    </main>
  );
}
