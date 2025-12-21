import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import { Flame, Leaf, Search, Globe, ChevronRight, Sparkles } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import SpicePronounceButton from '@/components/spice/SpicePronounceButton';

export const metadata: Metadata = {
  title: 'La Route des Épices | Guide Complet - Menucochon',
  description: 'La Route des Épices: découvrez l\'origine, le goût et les utilisations de chaque épice. Guide complet pour cuisiner avec les épices.',
  alternates: {
    canonical: '/epices/',
    languages: {
      'fr-CA': '/epices/',
      'en-CA': '/en/spices/',
    },
  },
  openGraph: {
    title: 'La Route des Épices | Guide Complet',
    description: 'Guide complet des épices: origine, goût, utilisations. Apprenez à cuisiner avec les épices comme un chef!',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'La Route des Épices - Marché aux épices coloré',
      },
    ],
  },
};

interface UsedWith {
  meat?: string[];
  fish?: string[];
  vegetables?: string[];
  grains?: string[];
  bread?: string[];
  desserts?: string[];
  cheese?: string[];
  soups?: string[];
  eggs?: string[];
  sauces?: string[];
  drinks?: string[];
}

interface Spice {
  id: number;
  slug: string;
  name_fr: string;
  name_en: string | null;
  definition_fr: string | null;
  featured_image: string | null;
  categories: string[] | null;
  origin: string[] | null;
  taste_profile: {
    intensity?: number;
    spicy?: number;
  } | null;
  used_with: UsedWith | null;
}

// Filtres par type d'aliment
const FOOD_FILTERS = [
  { slug: 'viandes', label: 'Viandes', emoji: '🥩', key: 'meat' as const, match: '' },
  { slug: 'poissons', label: 'Poissons', emoji: '🐟', key: 'fish' as const, match: '' },
  { slug: 'legumes', label: 'Légumes', emoji: '🥕', key: 'vegetables' as const, match: '' },
  { slug: 'soupes', label: 'Soupes & Mijotés', emoji: '🍲', key: 'soups' as const, match: '' },
  { slug: 'desserts', label: 'Desserts', emoji: '🍰', key: 'desserts' as const, match: '' },
  { slug: 'sauces', label: 'Sauces', emoji: '🥫', key: 'sauces' as const, match: '' },
  { slug: 'boissons', label: 'Boissons', emoji: '☕', key: 'drinks' as const, match: '' },
  { slug: 'grains', label: 'Riz & Pâtes', emoji: '🍚', key: 'grains' as const, match: '' },
];

// Filtres par origine
const ORIGIN_FILTERS = [
  { slug: 'asie', label: 'Asie', flag: '🌏' },
  { slug: 'mediterranee', label: 'Méditerranée', flag: '🌊' },
  { slug: 'inde', label: 'Inde', flag: '🇮🇳' },
  { slug: 'amerique', label: 'Amérique', flag: '🌎' },
  { slug: 'moyen-orient', label: 'Moyen-Orient', flag: '🕌' },
  { slug: 'asie-sud-est', label: 'Asie du Sud-Est', flag: '🌴' },
  { slug: 'afrique', label: 'Afrique', flag: '🌍' },
  { slug: 'europe', label: 'Europe', flag: '🇪🇺' },
  { slug: 'caraibes', label: 'Caraïbes', flag: '🏝️' },
];

// Catégories par goût
const TASTE_FILTERS = [
  { slug: 'doux', label: 'Douces', icon: Leaf },
  { slug: 'piquant', label: 'Piquantes', icon: Flame },
  { slug: 'fume', label: 'Fumées', icon: Sparkles },
];

function IntensityIndicator({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= level ? 'bg-[#F77313]' : 'bg-neutral-200'
          }`}
        />
      ))}
    </div>
  );
}

function SpicyIndicator({ level }: { level: number }) {
  if (level === 0) return null;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-xs ${i <= level ? 'opacity-100' : 'opacity-20'}`}
        >
          🌶️
        </span>
      ))}
    </div>
  );
}

function SpiceCard({ spice }: { spice: Spice }) {
  const intensity = (spice.taste_profile as { intensity?: number })?.intensity || 0;
  const spicy = (spice.taste_profile as { spicy?: number })?.spicy || 0;
  const usedWith = spice.used_with || {};

  // Collecter les aliments associés (max 4)
  const foodItems: string[] = [];
  if (usedWith.meat?.length) foodItems.push(...usedWith.meat.slice(0, 2));
  if (usedWith.fish?.length) foodItems.push(...usedWith.fish.slice(0, 1));
  if (usedWith.vegetables?.length) foodItems.push(...usedWith.vegetables.slice(0, 1));
  const displayFoods = foodItems.slice(0, 4);

  return (
    <div className="flex items-start gap-4 p-4 border border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50 transition-all group">
      {/* Image */}
      <Link href={`/epices/${spice.slug}/`} className="w-16 h-16 flex-shrink-0 relative bg-neutral-100 overflow-hidden">
        {spice.featured_image ? (
          <Image
            src={spice.featured_image}
            alt={spice.name_fr}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl bg-neutral-100">
            🌿
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <Link href={`/epices/${spice.slug}/`}>
                <h3 className="font-display text-base text-black group-hover:text-[#F77313] transition-colors">
                  {spice.name_fr}
                </h3>
              </Link>
              <SpicePronounceButton text={spice.name_fr} description={spice.definition_fr || undefined} lang="fr" />
            </div>
            {spice.name_en && spice.name_en !== spice.name_fr && (
              <p className="text-xs text-neutral-500">{spice.name_en}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <IntensityIndicator level={intensity} />
            {spicy > 0 && <SpicyIndicator level={spicy} />}
          </div>
        </div>

        {spice.definition_fr && (
          <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
            {spice.definition_fr}
          </p>
        )}

        {/* Origin + Foods */}
        <div className="flex items-center gap-3 mt-2">
          {spice.origin && spice.origin.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <Globe className="w-3 h-3" />
              <span>{spice.origin.slice(0, 2).join(', ')}</span>
            </div>
          )}
          {displayFoods.length > 0 && (
            <div className="flex gap-1">
              {displayFoods.slice(0, 2).map((food) => (
                <span
                  key={food}
                  className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded"
                >
                  {food}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Link href={`/epices/${spice.slug}/`}>
        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#F77313] transition-colors flex-shrink-0 mt-1" />
      </Link>
    </div>
  );
}

export default async function EpicesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; origine?: string; aliment?: string; q?: string; lettre?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('spices')
    .select('id, slug, name_fr, name_en, definition_fr, featured_image, categories, origin, taste_profile, used_with')
    .eq('is_published', true)
    .order('name_fr');

  // Filter by category (taste)
  if (params.categorie) {
    query = query.contains('categories', [params.categorie]);
  }

  // Filter by origin - map slug to actual DB values
  if (params.origine) {
    const originMap: Record<string, string[]> = {
      'asie': ['Asie'],
      'mediterranee': ['Méditerranée'],
      'inde': ['Inde'],
      'amerique': ['Amérique', 'Amérique centrale'],
      'moyen-orient': ['Moyen-Orient'],
      'asie-sud-est': ['Asie du Sud-Est'],
      'afrique': ['Afrique'],
      'europe': ['Europe du Nord', 'France', 'Espagne', 'Hongrie'],
      'caraibes': ['Caraïbes'],
    };
    const dbOrigins = originMap[params.origine] || [params.origine];
    const originConditions = dbOrigins.map(o => `origin.cs.{${o}}`).join(',');
    query = query.or(originConditions);
  }

  // Search by name
  if (params.q) {
    query = query.or(`name_fr.ilike.%${params.q}%,name_en.ilike.%${params.q}%`);
  }

  const { data: spices } = await query;

  let spicesList = (spices || []) as Spice[];

  // Filter by food type (client-side since it's JSONB)
  if (params.aliment) {
    const filter = FOOD_FILTERS.find(f => f.slug === params.aliment);
    if (filter) {
      spicesList = spicesList.filter(spice => {
        const usedWith = spice.used_with || {};
        const items = usedWith[filter.key] || [];
        if (filter.match) {
          return items.some(item => item.toLowerCase().includes(filter.match.toLowerCase()));
        }
        return items.length > 0;
      });
    }
  }

  const activeFilters = [params.categorie, params.origine, params.aliment, params.q].filter(Boolean).length;
  const selectedLetter = params.lettre?.toUpperCase();

  // Group spices by first letter for A-Z navigation
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const spicesByLetter = spicesList.reduce((acc, spice) => {
    const firstLetter = spice.name_fr.charAt(0).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const letter = alphabet.includes(firstLetter) ? firstLetter : '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(spice);
    return acc;
  }, {} as Record<string, Spice[]>);

  const availableLetters = Object.keys(spicesByLetter).filter(l => l !== '#');

  // Schema JSON-LD pour la page de liste
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'La Route des Épices',
    description: 'Guide complet des épices: origine, goût, utilisations culinaires.',
    url: `${siteConfig.url}/epices/`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: spicesList.length,
      itemListElement: spicesList.slice(0, 20).map((spice, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: spice.name_fr,
          description: spice.definition_fr,
          url: `${siteConfig.url}/epices/${spice.slug}/`,
          image: spice.featured_image,
          category: 'Épices et aromates',
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: 'La Route des Épices', item: `${siteConfig.url}/epices/` },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero - Black like lexique */}
        <section className="bg-black py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🌶️</span>
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                  Guide culinaire
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                La Route des Épices
              </h1>
              <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
                Explorez notre collection de{' '}
                <span className="text-white font-semibold">{spicesList.length} épices</span>{' '}
                du monde entier. Découvrez leurs origines, saveurs et utilisations culinaires.
              </p>
            </div>
          </div>
        </section>

        {/* SEO Content - AVANT les filtres */}
        <section className="bg-neutral-50 py-8 border-b border-neutral-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h2 className="font-display text-xl md:text-2xl text-black mb-4">
                Comment utiliser La Route des Épices?
              </h2>
              <p className="text-neutral-600 mb-4">
                La Route des Épices est votre guide complet pour maîtriser l&apos;art des épices en cuisine.
                Chaque fiche détaillée vous donne:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-neutral-600">
                <li className="flex items-center gap-2">
                  <span className="text-[#F77313]">✓</span>
                  <strong>Origine géographique</strong> et histoire
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F77313]">✓</span>
                  <strong>Profil gustatif</strong> avec intensité
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F77313]">✓</span>
                  <strong>Accords parfaits</strong> avec aliments
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F77313]">✓</span>
                  <strong>Conseils d&apos;utilisation</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F77313]">✓</span>
                  <strong>Erreurs à éviter</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#F77313]">✓</span>
                  <strong>Substitutions</strong> possibles
                </li>
              </ul>

              {/* Link to pairing guide */}
              <div className="mt-6 inline-flex items-center gap-3 bg-white border border-neutral-200 rounded-lg px-4 py-3">
                <span className="text-2xl">🍽️</span>
                <div>
                  <p className="font-medium text-black">Guide des accords épices-aliments</p>
                  <Link
                    href="/epices/route-des-epices/"
                    className="text-sm text-[#F77313] hover:text-[#e56200] font-medium inline-flex items-center gap-1"
                  >
                    Explorer le guide <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation alphabétique - sticky */}
        <section className="sticky top-16 md:top-20 z-40 bg-neutral-50 border-b border-neutral-200 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {/* Bouton "Tous" */}
              <Link
                href="/epices/"
                scroll={false}
                className={`px-3 h-9 flex items-center justify-center font-display text-sm transition-all ${
                  !selectedLetter
                    ? 'bg-[#F77313] text-white'
                    : 'text-black hover:bg-[#F77313] hover:text-white'
                }`}
              >
                Tous
              </Link>
              {alphabet.map((letter) => {
                const isAvailable = availableLetters.includes(letter);
                const isSelected = selectedLetter === letter;
                return (
                  <Link
                    key={letter}
                    scroll={false}
                    href={isAvailable ? `/epices/?lettre=${letter.toLowerCase()}` : '/epices/'}
                    className={`w-9 h-9 flex items-center justify-center font-display text-lg transition-all ${
                      isSelected
                        ? 'bg-[#F77313] text-white'
                        : isAvailable
                        ? 'text-black hover:bg-[#F77313] hover:text-white'
                        : 'text-neutral-300 cursor-not-allowed'
                    }`}
                  >
                    {letter}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main content with sidebar */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Search */}
                <div>
                  <form>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        name="q"
                        defaultValue={params.q || ''}
                        placeholder="Rechercher..."
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-[#F77313] rounded-lg"
                      />
                    </div>
                  </form>
                </div>

                {activeFilters > 0 && (
                  <Link
                    href="/epices/"
                    className="block text-sm text-[#F77313] hover:text-[#e56200] font-medium"
                  >
                    × Réinitialiser les filtres ({activeFilters})
                  </Link>
                )}

                {/* Par aliment */}
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                    Par aliment
                  </h3>
                  <div className="space-y-1">
                    {FOOD_FILTERS.map((filter) => {
                      const isActive = params.aliment === filter.slug;
                      return (
                        <Link
                          key={filter.slug}
                          href={isActive ? '/epices/' : `/epices/?aliment=${filter.slug}`}
                          className="flex items-center gap-3 px-2 py-1.5 text-sm text-neutral-600 hover:text-black transition-all"
                        >
                          <span className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                            isActive ? 'bg-[#F77313] border-[#F77313]' : 'border-neutral-300'
                          }`}>
                            {isActive && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          {filter.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Par origine */}
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                    Par origine
                  </h3>
                  <div className="space-y-1">
                    {ORIGIN_FILTERS.map((filter) => {
                      const isActive = params.origine === filter.slug;
                      return (
                        <Link
                          key={filter.slug}
                          href={isActive ? '/epices/' : `/epices/?origine=${filter.slug}`}
                          className="flex items-center gap-3 px-2 py-1.5 text-sm text-neutral-600 hover:text-black transition-all"
                        >
                          <span className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                            isActive ? 'bg-[#F77313] border-[#F77313]' : 'border-neutral-300'
                          }`}>
                            {isActive && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          {filter.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Par goût */}
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                    Par goût
                  </h3>
                  <div className="space-y-1">
                    {TASTE_FILTERS.map((filter) => {
                      const isActive = params.categorie === filter.slug;
                      return (
                        <Link
                          key={filter.slug}
                          href={isActive ? '/epices/' : `/epices/?categorie=${filter.slug}`}
                          className="flex items-center gap-3 px-2 py-1.5 text-sm text-neutral-600 hover:text-black transition-all"
                        >
                          <span className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                            isActive ? 'bg-[#F77313] border-[#F77313]' : 'border-neutral-300'
                          }`}>
                            {isActive && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          {filter.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content - Results */}
            <div className="flex-1 min-w-0">
              {spicesList.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-6xl mb-4">🔍</p>
                  <h2 className="text-2xl font-display text-black mb-2">
                    Aucune épice trouvée
                  </h2>
                  <p className="text-neutral-600 mb-6">
                    {params.q
                      ? `Aucun résultat pour "${params.q}"`
                      : 'Essayez de modifier vos filtres.'}
                  </p>
                  <Link
                    href="/epices/"
                    className="inline-block px-6 py-3 bg-[#F77313] text-white font-medium hover:bg-[#e56200] transition-colors"
                  >
                    Voir toutes les épices
                  </Link>
                </div>
              ) : (
                <>
                  {/* Results count */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-neutral-600">
                      <span className="font-semibold text-black">
                        {selectedLetter
                          ? (spicesByLetter[selectedLetter] || []).length
                          : spicesList.length}
                      </span> épice{(selectedLetter ? (spicesByLetter[selectedLetter] || []).length : spicesList.length) > 1 ? 's' : ''}
                      {(activeFilters > 0 || selectedLetter) && ' trouvées'}
                    </p>
                  </div>

                  {/* List - filtered by letter or grouped */}
                  <div className="space-y-8">
                    {selectedLetter ? (
                      // Afficher seulement la lettre sélectionnée
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="w-12 h-12 bg-[#F77313] text-white font-display text-2xl flex items-center justify-center">
                            {selectedLetter}
                          </span>
                          <div className="flex-1 h-px bg-neutral-200" />
                          <span className="text-sm text-neutral-500">
                            {(spicesByLetter[selectedLetter] || []).length} épice{(spicesByLetter[selectedLetter] || []).length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {(spicesByLetter[selectedLetter] || []).map((spice) => (
                            <SpiceCard key={spice.id} spice={spice} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Afficher toutes les lettres
                      alphabet.map((letter) => {
                        const spices = spicesByLetter[letter];
                        if (!spices || spices.length === 0) return null;

                        return (
                          <div key={letter} id={`lettre-${letter}`} className="scroll-mt-40">
                            <div className="flex items-center gap-4 mb-4">
                              <span className="w-12 h-12 bg-[#F77313] text-white font-display text-2xl flex items-center justify-center">
                                {letter}
                              </span>
                              <div className="flex-1 h-px bg-neutral-200" />
                              <span className="text-sm text-neutral-500">
                                {spices.length} épice{spices.length > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {spices.map((spice) => (
                                <SpiceCard key={spice.id} spice={spice} />
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
