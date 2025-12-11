'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { ArrowLeft, Save, User, Loader2 } from 'lucide-react';

export default function ModifierProfilPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login?redirectTo=/profil/modifier');
      return;
    }

    setEmail(user.email || '');

    // Charger le profil depuis la table profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      setDisplayName((profile as { display_name?: string }).display_name || '');
      setAvatarUrl((profile as { avatar_url?: string }).avatar_url || '');
    } else {
      // Utiliser les métadonnées de l'utilisateur
      setDisplayName(user.user_metadata?.full_name || user.user_metadata?.name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Vous devez être connecté');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        display_name: displayName.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        updated_at: new Date().toISOString(),
      } as never);

    if (error) {
      setError('Erreur lors de la sauvegarde: ' + error.message);
    } else {
      setSuccess('Profil mis à jour avec succès!');
      setTimeout(() => {
        router.push('/profil');
      }, 1500);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F77313]" />
      </main>
    );
  }

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
          <h1 className="font-display text-3xl md:text-4xl">Modifier mon profil</h1>
        </div>
      </section>

      {/* Formulaire */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Avatar preview */}
            <div className="flex justify-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#F77313]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#F77313] flex items-center justify-center text-white text-3xl font-bold">
                  {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                </div>
              )}
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500 cursor-not-allowed"
              />
              <p className="text-xs text-neutral-400 mt-1">L'email ne peut pas être modifié</p>
            </div>

            {/* Nom d'affichage */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-1">
                Nom d'affichage
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Votre nom"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F77313]"
              />
            </div>

            {/* URL de l'avatar */}
            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-neutral-700 mb-1">
                URL de la photo de profil
              </label>
              <input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F77313]"
              />
              <p className="text-xs text-neutral-400 mt-1">
                Entrez l'URL d'une image (laissez vide pour utiliser vos initiales)
              </p>
            </div>

            {/* Bouton de sauvegarde */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#F77313] text-white rounded-lg hover:bg-[#e56610] disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
