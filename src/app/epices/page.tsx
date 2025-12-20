import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import { Flame, Leaf, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dictionnaire des Épices | Guide Complet - Menucochon',
  description: 'Découvrez notre dictionnaire complet des épices: origine, goût, utilisations en cuisine et recettes. Guide pratique pour cuisiner avec les épices.',
  alternates: {
    canonical: '/epices/',
    languages: {
      'fr-CA': '/epices/',
      'en-CA': '/en/spices/',
    },
  },
  openGraph: {
    title: 'Dictionnaire des Épices | Guide Complet',
    description: 'Guide complet des épices: origine, goût, utilisations. Apprenez à cuisiner avec les épices comme un chef!',
    type: 'website',
  },
};

interface Spice {
  id: number;
  slug: string;
  name_fr: string;
  name_en: string | null;
  definition_fr: string | null;
  featured_image: string | null;
  categories: string[] | null;
  taste_profile: {
    intensity?: number;
    spicy?: number;
  } | null;
}

// Catégories pour le filtrage
const SPICE_CATEGORIES = [
  { slug: 'doux', label: 'Épices douces', icon: Leaf },
  { slug: 'piquant', label: 'Épices piquantes', icon: Flame },
  { slug: 'fume', label: 'Épices fumées', icon: Flame },
  { slug: 'mediterraneen', label: 'Méditerranéennes', icon: Leaf },
  { slug: 'indien', label: 'Indiennes', icon: Flame },
  { slug: 'asiatique', label: 'Asiatiques', icon: Leaf },
];

function SpiceCard({ spice }: { spice: Spice }) {
  const intensity = (spice.taste_profile as { intensity?: number })?.intensity || 0;
  const spicy = (spice.taste_profile as { spicy?: number })?.spicy || 0;

  return (
    <Link
      href={`/epices/${spice.slug}/`}
      className="group block bg-white border border-neutral-200 hover:border-[#F77313] transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[4/3] relative bg-neutral-100 overflow-hidden">
        {spice.featured_image ? (
          <Image
            src={spice.featured_image}
            alt={spice.name_fr}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🌶️
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="font-display text-xl text-black group-hover:text-[#F77313] transition-colors">
          {spice.name_fr}
        </h2>

        {spice.name_en && spice.name_en !== spice.name_fr && (
          <p className="text-sm text-neutral-500 mt-1">{spice.name_en}</p>
        )}

        {/* Intensité */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-neutral-500">Intensité:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`text-xs ${i <= intensity ? 'text-[#F77313]' : 'text-neutral-300'}`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
          {spicy > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-500">Piquant:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`text-xs ${i <= spicy ? 'text-red-500' : 'text-neutral-300'}`}
                  >
                    🌶️
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Short description */}
        {spice.definition_fr && (
          <p className="text-sm text-neutral-600 mt-3 line-clamp-2">
            {spice.definition_fr}
          </p>
        )}

        {/* Categories */}
        {spice.categories && spice.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {spice.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default async function EpicesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('spices')
    .select('id, slug, name_fr, name_en, definition_fr, featured_image, categories, taste_profile')
    .eq('is_published', true)
    .order('name_fr');

  // Filter by category
  if (params.categorie) {
    query = query.contains('categories', [params.categorie]);
  }

  // Search by name
  if (params.q) {
    query = query.or(`name_fr.ilike.%${params.q}%,name_en.ilike.%${params.q}%`);
  }

  const { data: spices } = await query;

  const spicesList = (spices || []) as Spice[];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              Guide culinaire
            </span>
            <h1 className="text-5xl md:text-7xl font-display mt-3 mb-6">
              Dictionnaire des Épices
            </h1>
            <p className="text-neutral-400 text-lg max-w-xl">
              Découvrez l&apos;origine, le goût et les utilisations de chaque épice.
              Un guide complet pour maîtriser l&apos;art des épices en cuisine.
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-neutral-200 sticky top-0 bg-white z-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-4 overflow-x-auto">
            {/* Search */}
            <form className="flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  name="q"
                  defaultValue={params.q || ''}
                  placeholder="Rechercher..."
                  className="pl-9 pr-4 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-[#F77313] w-40"
                />
              </div>
            </form>

            {/* Category filters */}
            <Link
              href="/epices/"
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors ${
                !params.categorie
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Toutes
            </Link>
            {SPICE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/epices/?categorie=${cat.slug}`}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                  params.categorie === cat.slug
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {spicesList.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🌶️</p>
            <h2 className="text-2xl font-display text-black mb-2">
              Aucune épice trouvée
            </h2>
            <p className="text-neutral-600">
              {params.q
                ? `Aucun résultat pour "${params.q}"`
                : 'Le dictionnaire des épices est en cours de construction.'}
            </p>
            <Link
              href="/epices/"
              className="inline-block mt-6 px-6 py-3 bg-[#F77313] text-white font-medium hover:bg-[#e56200] transition-colors"
            >
              Voir toutes les épices
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-neutral-600">
                {spicesList.length} épice{spicesList.length > 1 ? 's' : ''}
                {params.categorie && ` dans la catégorie "${params.categorie}"`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {spicesList.map((spice) => (
                <SpiceCard key={spice.id} spice={spice} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* SEO Content */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-neutral">
            <h2 className="font-display text-3xl text-black">
              À propos de notre dictionnaire des épices
            </h2>
            <p>
              Notre dictionnaire des épices est un guide complet pour tous les
              amateurs de cuisine. Chaque épice est présentée avec son origine,
              son profil gustatif, ses utilisations culinaires et les aliments
              avec lesquels elle se marie le mieux.
            </p>
            <p>
              Que vous soyez débutant ou chef expérimenté, ce guide vous aidera
              à mieux comprendre et utiliser les épices dans vos recettes
              quotidiennes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
