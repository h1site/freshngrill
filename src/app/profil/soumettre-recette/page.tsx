import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getUser } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { ChefHat, ArrowLeft } from 'lucide-react';
import SubmitRecipeForm from '@/components/profile/SubmitRecipeForm';

export const metadata: Metadata = {
  title: 'Soumettre une recette | Menucochon',
  description: 'Partagez votre recette avec la communauté Menucochon.',
};

interface UserProfile {
  display_name: string | null;
  avatar_url: string | null;
}

export default async function SoumettreRecettePage() {
  const user = await getUser();

  if (!user) {
    redirect('/login?redirectTo=/profil/soumettre-recette');
  }

  const supabase = await createClient();

  // Récupérer le profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .single();

  const userProfile = profile as UserProfile | null;
  const displayName = userProfile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '';
  const avatarUrl = userProfile?.avatar_url || user.user_metadata?.avatar_url || '';

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-black text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au profil
          </Link>
          <h1 className="font-display text-2xl md:text-4xl flex items-center gap-3">
            <ChefHat className="w-7 h-7 md:w-8 md:h-8 text-[#F77313]" />
            Soumettre une recette
          </h1>
          <p className="text-neutral-400 mt-2 text-sm md:text-base">
            Partagez votre création culinaire avec notre communauté!
          </p>
        </div>
      </section>

      {/* Formulaire */}
      <section className="container mx-auto px-4 py-6 md:py-12">
        <SubmitRecipeForm
          userName={displayName}
          userEmail={user.email || ''}
          userAvatar={avatarUrl}
        />
      </section>
    </main>
  );
}
