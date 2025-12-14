import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getUser } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { Heart, ArrowLeft } from 'lucide-react';
import FavoritesList from '@/components/profile/FavoritesList';

export const metadata: Metadata = {
  title: 'Mes favoris | Menu Cochon',
  description: 'Consultez toutes vos recettes favorites.',
};

interface LikedRecipe {
  recipe_id: number;
  created_at: string;
  note: string | null;
  recipes: {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    featured_image: string | null;
    prep_time: number | null;
    cook_time: number | null;
    difficulty: string | null;
  };
}

export default async function FavorisPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login?redirectTo=/profil/favoris');
  }

  const supabase = await createClient();

  // Récupérer toutes les recettes aimées avec les notes
  const { data: likedRecipes } = await supabase
    .from('user_likes')
    .select(
      `
      recipe_id,
      created_at,
      note,
      recipes (
        id,
        slug,
        title,
        excerpt,
        featured_image,
        prep_time,
        cook_time,
        difficulty
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const userLikes = (likedRecipes || []) as unknown as LikedRecipe[];

  // Transformer pour le composant client
  const favorites = userLikes.map((like) => ({
    recipeId: like.recipe_id,
    slug: like.recipes.slug,
    title: like.recipes.title,
    excerpt: like.recipes.excerpt,
    featuredImage: like.recipes.featured_image,
    prepTime: like.recipes.prep_time,
    cookTime: like.recipes.cook_time,
    difficulty: like.recipes.difficulty,
    createdAt: like.created_at,
    note: like.note,
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
            <Heart className="w-8 h-8 text-red-500" />
            Mes recettes favorites
          </h1>
        </div>
      </section>

      {/* Liste des favoris */}
      <section className="container mx-auto px-4 py-12">
        <FavoritesList initialFavorites={favorites} />
      </section>
    </main>
  );
}
