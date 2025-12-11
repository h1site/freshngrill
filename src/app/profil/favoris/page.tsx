import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getUser } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { Heart, ArrowLeft, Clock, ChefHat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mes favoris | Menu Cochon',
  description: 'Consultez toutes vos recettes favorites.',
};

interface LikedRecipe {
  recipe_id: number;
  created_at: string;
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

  // Récupérer toutes les recettes aimées
  const { data: likedRecipes } = await supabase
    .from('user_likes')
    .select(`
      recipe_id,
      created_at,
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
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const userLikes = (likedRecipes || []) as unknown as LikedRecipe[];

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
          <p className="text-neutral-400 mt-2">
            {userLikes.length} recette{userLikes.length !== 1 ? 's' : ''} dans vos favoris
          </p>
        </div>
      </section>

      {/* Liste des favoris */}
      <section className="container mx-auto px-4 py-12">
        {userLikes.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
            <h2 className="text-xl font-medium text-neutral-600 mb-2">
              Aucune recette favorite
            </h2>
            <p className="text-neutral-400 mb-6">
              Explorez nos recettes et cliquez sur le coeur pour les ajouter à vos favoris!
            </p>
            <Link
              href="/recette"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F77313] text-white rounded-lg hover:bg-[#e56610] transition-colors"
            >
              Découvrir les recettes
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userLikes.map((like) => (
              <Link
                key={like.recipe_id}
                href={`/recette/${like.recipes.slug}`}
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[4/3]">
                  {like.recipes.featured_image ? (
                    <Image
                      src={like.recipes.featured_image}
                      alt={like.recipes.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                      <ChefHat className="w-12 h-12 text-neutral-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-neutral-900 group-hover:text-[#F77313] transition-colors line-clamp-2">
                    {like.recipes.title}
                  </h3>
                  {like.recipes.excerpt && (
                    <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                      {like.recipes.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
                    {(like.recipes.prep_time || like.recipes.cook_time) && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(like.recipes.prep_time || 0) + (like.recipes.cook_time || 0)} min
                      </span>
                    )}
                    {like.recipes.difficulty && (
                      <span className="capitalize">{like.recipes.difficulty}</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-2">
                    Ajouté le {new Date(like.created_at).toLocaleDateString('fr-CA')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
