import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import { Flame, Leaf, Search, Globe, ChevronRight } from 'lucide-react';

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
  { slug: 'boeuf', label: 'Bœuf', emoji: '🥩', key: 'meat' as const, match: 'bœuf' },
  { slug: 'poulet', label: 'Poulet', emoji: '🍗', key: 'meat' as const, match: 'poulet' },
  { slug: 'porc', label: 'Porc', emoji: '🐷', key: 'meat' as const, match: 'porc' },
  { slug: 'agneau', label: 'Agneau', emoji: '🐑', key: 'meat' as const, match: 'agneau' },
  { slug: 'poisson', label: 'Poisson', emoji: '🐟', key: 'fish' as const, match: '' },
  { slug: 'legumes', label: 'Légumes', emoji: '🥕', key: 'vegetables' as const, match: '' },
  { slug: 'desserts', label: 'Desserts', emoji: '🍰', key: 'desserts' as const, match: '' },
];

// Filtres par origine
const ORIGIN_FILTERS = [
  { slug: 'inde', label: 'Inde', flag: '🇮🇳' },
  { slug: 'mediterranee', label: 'Méditerranée', flag: '🌊' },
  { slug: 'asie', label: 'Asie', flag: '🌏' },
  { slug: 'afrique', label: 'Afrique', flag: '🌍' },
  { slug: 'amerique', label: 'Amérique', flag: '🌎' },
  { slug: 'moyen-orient', label: 'Moyen-Orient', flag: '🕌' },
];

// Catégories par goût
const TASTE_FILTERS = [
  { slug: 'doux', label: 'Épices douces', icon: Leaf },
  { slug: 'piquant', label: 'Épices piquantes', icon: Flame },
  { slug: 'fume', label: 'Épices fumées', icon: Flame },
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
    <Link
      href={`/epices/${spice.slug}/`}
      className="group flex flex-col sm:flex-row bg-white border border-neutral-200 hover:border-[#F77313] transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="sm:w-48 md:w-56 flex-shrink-0 aspect-[4/3] sm:aspect-square relative bg-neutral-100 overflow-hidden">
        {spice.featured_image ? (
          <Image
            src={spice.featured_image}
            alt={spice.name_fr}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 224px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-orange-50 to-orange-100">
            🌶️
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl md:text-2xl text-black group-hover:text-[#F77313] transition-colors">
                {spice.name_fr}
              </h2>
              {spice.name_en && spice.name_en !== spice.name_fr && (
                <p className="text-sm text-neutral-500">{spice.name_en}</p>
              )}
            </div>

            {/* Intensity indicators */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Intensité</span>
                <IntensityIndicator level={intensity} />
              </div>
              {spicy > 0 && (
                <SpicyIndicator level={spicy} />
              )}
            </div>
          </div>

          {/* Description */}
          {spice.definition_fr && (
            <p className="text-sm text-neutral-600 mt-3 line-clamp-2">
              {spice.definition_fr}
            </p>
          )}

          {/* Origin */}
          {spice.origin && spice.origin.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-neutral-500">
              <Globe className="w-3.5 h-3.5" />
              {spice.origin.slice(0, 3).join(', ')}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          {/* Aliments associés */}
          <div className="flex flex-wrap gap-1.5">
            {displayFoods.length > 0 ? (
              displayFoods.map((food) => (
                <span
                  key={food}
                  className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded"
                >
                  {food}
                </span>
              ))
            ) : (
              spice.categories?.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded"
                >
                  {cat}
                </span>
              ))
            )}
          </div>

          {/* CTA */}
          <span className="text-[#F77313] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Voir
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function EpicesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; origine?: string; aliment?: string; q?: string }>;
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

  // Filter by origin
  if (params.origine) {
    // Cherche dans le tableau origin
    query = query.or(`origin.cs.{${params.origine}},origin.cs.{${params.origine.charAt(0).toUpperCase() + params.origine.slice(1)}}`);
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
          // Recherche spécifique (ex: "bœuf" dans meat)
          return items.some(item => item.toLowerCase().includes(filter.match.toLowerCase()));
        }
        // Catégorie générique (ex: tous les poissons)
        return items.length > 0;
      });
    }
  }

  // Compter les filtres actifs
  const activeFilters = [params.categorie, params.origine, params.aliment, params.q].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-[#F77313]">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">La Route des Épices</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-black text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              Guide culinaire
            </span>
            <h1 className="text-4xl md:text-6xl font-display mt-3 mb-6">
              La Route des Épices
            </h1>
            <p className="text-neutral-400 text-lg max-w-xl">
              Découvrez l&apos;origine, le goût et les utilisations de chaque épice.
              Filtrez par type de viande, origine géographique ou profil gustatif.
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />

            {/* Quick link to pairing guide */}
            <Link
              href="/epices/route-des-epices/"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#F77313] text-white font-medium hover:bg-[#e56200] transition-colors"
            >
              🍽️ Guide des accords épices-aliments
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-neutral-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Search + Reset */}
          <div className="flex items-center gap-4 mb-4">
            <form className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  name="q"
                  defaultValue={params.q || ''}
                  placeholder="Rechercher une épice..."
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-[#F77313] rounded-lg"
                />
              </div>
            </form>

            {activeFilters > 0 && (
              <Link
                href="/epices/"
                className="text-sm text-[#F77313] hover:text-[#e56200] font-medium"
              >
                Réinitialiser ({activeFilters})
              </Link>
            )}
          </div>

          {/* Filter Groups */}
          <div className="space-y-3">
            {/* Par aliment */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-neutral-500 font-medium flex-shrink-0 w-20">Aliment:</span>
              <div className="flex gap-2">
                {FOOD_FILTERS.map((filter) => (
                  <Link
                    key={filter.slug}
                    href={params.aliment === filter.slug ? '/epices/' : `/epices/?aliment=${filter.slug}`}
                    className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium transition-colors rounded-full flex items-center gap-1.5 ${
                      params.aliment === filter.slug
                        ? 'bg-[#F77313] text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <span>{filter.emoji}</span>
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Par origine */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-neutral-500 font-medium flex-shrink-0 w-20">Origine:</span>
              <div className="flex gap-2">
                {ORIGIN_FILTERS.map((filter) => (
                  <Link
                    key={filter.slug}
                    href={params.origine === filter.slug ? '/epices/' : `/epices/?origine=${filter.slug}`}
                    className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium transition-colors rounded-full flex items-center gap-1.5 ${
                      params.origine === filter.slug
                        ? 'bg-[#F77313] text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <span>{filter.flag}</span>
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Par goût */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-neutral-500 font-medium flex-shrink-0 w-20">Profil:</span>
              <div className="flex gap-2">
                {TASTE_FILTERS.map((filter) => (
                  <Link
                    key={filter.slug}
                    href={params.categorie === filter.slug ? '/epices/' : `/epices/?categorie=${filter.slug}`}
                    className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium transition-colors rounded-full flex items-center gap-1.5 ${
                      params.categorie === filter.slug
                        ? 'bg-[#F77313] text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <filter.icon className="w-3.5 h-3.5" />
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        {spicesList.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🌶️</p>
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
            <div className="flex items-center justify-between mb-6">
              <p className="text-neutral-600">
                <span className="font-medium text-black">{spicesList.length}</span> épice{spicesList.length > 1 ? 's' : ''}
                {activeFilters > 0 && ' trouvées'}
              </p>
            </div>

            {/* Grid - horizontal cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {spicesList.map((spice) => (
                <SpiceCard key={spice.id} spice={spice} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* SEO Content */}
      <section className="bg-neutral-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl text-black mb-6">
              Comment utiliser La Route des Épices?
            </h2>
            <div className="prose prose-neutral">
              <p>
                La Route des Épices est votre guide complet pour maîtriser
                l&apos;art des épices en cuisine. Chaque fiche détaillée vous donne:
              </p>
              <ul>
                <li><strong>Origine géographique</strong> et histoire de l&apos;épice</li>
                <li><strong>Profil gustatif</strong> avec intensité et niveau de piquant</li>
                <li><strong>Accords parfaits</strong> avec viandes, poissons et légumes</li>
                <li><strong>Conseils d&apos;utilisation</strong> et erreurs à éviter</li>
                <li><strong>Substitutions</strong> possibles si vous n&apos;avez pas l&apos;épice</li>
              </ul>
              <p>
                Utilisez les filtres ci-dessus pour trouver rapidement les épices
                adaptées à votre plat: filtrez par type de viande (bœuf, poulet, porc...),
                par origine (Inde, Méditerranée...) ou par profil gustatif (doux, piquant...).
              </p>
            </div>

            {/* Link to pairing guide */}
            <div className="mt-8 p-6 bg-white border border-neutral-200 rounded-lg">
              <h3 className="font-display text-xl text-black mb-2">
                🍽️ Guide des accords épices-aliments
              </h3>
              <p className="text-neutral-600 mb-4">
                Notre guide interactif pour trouver les meilleures épices selon l&apos;aliment
                que vous cuisinez. Sélectionnez bœuf, poulet, poisson ou légumes et découvrez
                les accords parfaits!
              </p>
              <Link
                href="/epices/route-des-epices/"
                className="inline-flex items-center gap-2 text-[#F77313] font-medium hover:text-[#e56200]"
              >
                Explorer le guide
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
