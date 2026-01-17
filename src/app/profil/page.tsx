import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getUser } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { Heart, MessageSquare, Calendar, Settings, LogOut } from 'lucide-react';
import LogoutButton from '@/components/auth/LogoutButton';

export const metadata: Metadata = {
  title: 'Mon profil | Menucochon',
  description: 'Gérez votre profil et consultez vos recettes favorites.',
};

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface LikedRecipe {
  recipe_id: number;
  created_at: string;
  recipes: {
    id: number;
    slug: string;
    title: string;
    featured_image: string | null;
  };
}

interface UserComment {
  id: number;
  content: string;
  created_at: string;
  recipes: {
    id: number;
    slug: string;
    title: string;
  };
}

export default async function ProfilPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login?redirectTo=/profil');
  }

  const supabase = await createClient();

  // Récupérer le profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Récupérer les recettes aimées
  const { data: likedRecipes } = await supabase
    .from('user_likes')
    .select(`
      recipe_id,
      created_at,
      recipes (
        id,
        slug,
        title,
        featured_image
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Récupérer les commentaires
  const { data: comments } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      recipes (
        id,
        slug,
        title
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const userProfile = profile as UserProfile | null;
  const userLikes = (likedRecipes || []) as unknown as LikedRecipe[];
  const userComments = (comments || []) as unknown as UserComment[];

  const displayName = userProfile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur';
  const avatarUrl = userProfile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header du profil */}
      <section className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#F77313]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#F77313] flex items-center justify-center text-3xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-display text-3xl md:text-4xl">{displayName}</h1>
              <p className="text-neutral-400 mt-1">{user.email}</p>
              <p className="text-neutral-500 text-sm mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Membre depuis {new Date(userProfile?.created_at || user.created_at).toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/profil/modifier"
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Modifier
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-[#F77313]">{userLikes.length}</div>
            <div className="text-neutral-500 text-sm mt-1">Recettes aimées</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-[#F77313]">{userComments.length}</div>
            <div className="text-neutral-500 text-sm mt-1">Commentaires</div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recettes aimées */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-display text-xl flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Mes recettes favorites
              </h2>
              <Link href="/profil/favoris" className="text-[#F77313] text-sm hover:underline">
                Voir tout
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {userLikes.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  <Heart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Aucune recette aimée pour le moment</p>
                  <Link href="/recette" className="text-[#F77313] hover:underline mt-2 inline-block">
                    Découvrir les recettes
                  </Link>
                </div>
              ) : (
                userLikes.slice(0, 5).map((like) => (
                  <Link
                    key={like.recipe_id}
                    href={`/recette/${like.recipes.slug}`}
                    className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors"
                  >
                    {like.recipes.featured_image ? (
                      <Image
                        src={like.recipes.featured_image}
                        alt={like.recipes.title}
                        width={60}
                        height={60}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-neutral-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">{like.recipes.title}</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Aimé le {new Date(like.created_at).toLocaleDateString('fr-CA')}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Commentaires */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-display text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Mes commentaires
              </h2>
              <Link href="/profil/commentaires" className="text-[#F77313] text-sm hover:underline">
                Voir tout
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {userComments.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Aucun commentaire pour le moment</p>
                  <p className="text-sm mt-1">Partagez votre avis sur les recettes!</p>
                </div>
              ) : (
                userComments.slice(0, 5).map((comment) => (
                  <Link
                    key={comment.id}
                    href={`/recette/${comment.recipes.slug}`}
                    className="block p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-neutral-900">{comment.recipes.title}</p>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{comment.content}</p>
                    <p className="text-xs text-neutral-400 mt-2">
                      {new Date(comment.created_at).toLocaleDateString('fr-CA')}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
