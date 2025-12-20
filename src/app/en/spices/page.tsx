import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import { Flame, Leaf, Search, Globe, ChevronRight } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import SpicePronounceButton from '@/components/spice/SpicePronounceButton';

export const metadata: Metadata = {
  title: 'The Spice Route | Complete Guide - Menucochon',
  description: 'The Spice Route: discover the origin, taste and culinary uses of each spice. Complete guide for cooking with spices.',
  alternates: {
    canonical: '/en/spices/',
    languages: {
      'fr-CA': '/epices/',
      'en-CA': '/en/spices/',
    },
  },
  openGraph: {
    title: 'The Spice Route | Complete Guide',
    description: 'Complete guide to spices: origin, taste, uses. Learn to cook with spices like a chef!',
    type: 'website',
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
  definition_en: string | null;
  featured_image: string | null;
  categories: string[] | null;
  origin: string[] | null;
  taste_profile: {
    intensity?: number;
    spicy?: number;
  } | null;
  used_with: UsedWith | null;
}

// Food type filters
const FOOD_FILTERS = [
  { slug: 'beef', label: 'Beef', emoji: '🥩', key: 'meat' as const, match: 'beef' },
  { slug: 'chicken', label: 'Chicken', emoji: '🍗', key: 'meat' as const, match: 'chicken' },
  { slug: 'pork', label: 'Pork', emoji: '🐷', key: 'meat' as const, match: 'pork' },
  { slug: 'lamb', label: 'Lamb', emoji: '🐑', key: 'meat' as const, match: 'lamb' },
  { slug: 'fish', label: 'Fish', emoji: '🐟', key: 'fish' as const, match: '' },
  { slug: 'vegetables', label: 'Vegetables', emoji: '🥕', key: 'vegetables' as const, match: '' },
  { slug: 'desserts', label: 'Desserts', emoji: '🍰', key: 'desserts' as const, match: '' },
];

// Origin filters
const ORIGIN_FILTERS = [
  { slug: 'india', label: 'India', flag: '🇮🇳' },
  { slug: 'mediterranean', label: 'Mediterranean', flag: '🌊' },
  { slug: 'asia', label: 'Asia', flag: '🌏' },
  { slug: 'africa', label: 'Africa', flag: '🌍' },
  { slug: 'america', label: 'Americas', flag: '🌎' },
  { slug: 'middle-east', label: 'Middle East', flag: '🕌' },
];

// Taste filters
const TASTE_FILTERS = [
  { slug: 'doux', label: 'Mild Spices', icon: Leaf },
  { slug: 'piquant', label: 'Hot Spices', icon: Flame },
  { slug: 'fume', label: 'Smoky Spices', icon: Flame },
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
  const name = spice.name_en || spice.name_fr;

  // Collect associated foods (max 4)
  const foodItems: string[] = [];
  if (usedWith.meat?.length) foodItems.push(...usedWith.meat.slice(0, 2));
  if (usedWith.fish?.length) foodItems.push(...usedWith.fish.slice(0, 1));
  if (usedWith.vegetables?.length) foodItems.push(...usedWith.vegetables.slice(0, 1));
  const displayFoods = foodItems.slice(0, 4);

  return (
    <div className="flex items-start gap-4 p-4 border border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50 transition-all group">
      {/* Image */}
      <Link href={`/en/spices/${spice.slug}/`} className="w-16 h-16 flex-shrink-0 relative bg-neutral-100 overflow-hidden">
        {spice.featured_image ? (
          <Image
            src={spice.featured_image}
            alt={name}
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
              <Link href={`/en/spices/${spice.slug}/`}>
                <h3 className="font-display text-base text-black group-hover:text-[#F77313] transition-colors">
                  {name}
                </h3>
              </Link>
              <SpicePronounceButton text={name} lang="en" />
            </div>
            {spice.name_en && spice.name_fr !== spice.name_en && (
              <p className="text-xs text-neutral-500">{spice.name_fr}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <IntensityIndicator level={intensity} />
            {spicy > 0 && <SpicyIndicator level={spicy} />}
          </div>
        </div>

        {spice.definition_en && (
          <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
            {spice.definition_en}
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

      <Link href={`/en/spices/${spice.slug}/`}>
        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#F77313] transition-colors flex-shrink-0 mt-1" />
      </Link>
    </div>
  );
}

export default async function SpicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; origin?: string; food?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('spices')
    .select('id, slug, name_fr, name_en, definition_en, featured_image, categories, origin, taste_profile, used_with')
    .eq('is_published', true)
    .order('name_en');

  // Filter by category (taste)
  if (params.category) {
    query = query.contains('categories', [params.category]);
  }

  // Filter by origin
  if (params.origin) {
    query = query.or(`origin.cs.{${params.origin}},origin.cs.{${params.origin.charAt(0).toUpperCase() + params.origin.slice(1)}}`);
  }

  // Search by name
  if (params.q) {
    query = query.or(`name_fr.ilike.%${params.q}%,name_en.ilike.%${params.q}%`);
  }

  const { data: spices } = await query;

  let spicesList = (spices || []) as Spice[];

  // JSON-LD Schema for the collection page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The Spice Route',
    description: 'Complete guide to spices: origin, taste, culinary uses.',
    url: `${siteConfig.url}/en/spices/`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: spicesList.length,
      itemListElement: spicesList.slice(0, 20).map((spice, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: spice.name_en || spice.name_fr,
          description: spice.definition_en,
          url: `${siteConfig.url}/en/spices/${spice.slug}/`,
          image: spice.featured_image,
          category: 'Spices and seasonings',
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteConfig.url}/en/` },
        { '@type': 'ListItem', position: 2, name: 'The Spice Route', item: `${siteConfig.url}/en/spices/` },
      ],
    },
  };

  // Filter by food type (client-side since it's JSONB)
  if (params.food) {
    const filter = FOOD_FILTERS.find(f => f.slug === params.food);
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

  // Count active filters
  const activeFilters = [params.category, params.origin, params.food, params.q].filter(Boolean).length;

  // Group spices by first letter for A-Z navigation
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const spicesByLetter = spicesList.reduce((acc, spice) => {
    const name = spice.name_en || spice.name_fr;
    const firstLetter = name.charAt(0).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const letter = alphabet.includes(firstLetter) ? firstLetter : '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(spice);
    return acc;
  }, {} as Record<string, Spice[]>);

  const availableLetters = Object.keys(spicesByLetter).filter(l => l !== '#');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero - Black like lexicon */}
        <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🌶️</span>
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                  Culinary Guide
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                The Spice Route
              </h1>
              <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
                Explore our collection of{' '}
                <span className="text-white font-semibold">{spicesList.length} spices</span>{' '}
                from around the world. Discover their origins, flavors and culinary uses.
              </p>
            </div>
            <Link
              href="/epices/"
              className="hidden md:flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Globe className="w-5 h-5" />
              Français
            </Link>
          </div>
        </div>
      </section>

        {/* SEO Content - At top */}
        <section className="bg-neutral-50 border-b border-neutral-200 py-10 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl text-black mb-6">
                How to use The Spice Route?
              </h2>
              <div className="prose prose-neutral">
                <p>
                  The Spice Route is your complete guide to mastering
                  the art of spices in cooking. Each detailed entry gives you:
                </p>
                <ul>
                  <li><strong>Geographic origin</strong> and history of the spice</li>
                  <li><strong>Taste profile</strong> with intensity and heat level</li>
                  <li><strong>Perfect pairings</strong> with meats, fish and vegetables</li>
                  <li><strong>Usage tips</strong> and mistakes to avoid</li>
                  <li><strong>Substitutions</strong> if you don&apos;t have the spice</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Alphabetical navigation - sticky */}
        <section className="sticky top-16 md:top-20 z-40 bg-neutral-50 border-b border-neutral-200 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {alphabet.map((letter) => {
                const isAvailable = availableLetters.includes(letter);
                return (
                  <a
                    key={letter}
                    href={isAvailable ? `#letter-${letter}` : undefined}
                    className={`w-9 h-9 flex items-center justify-center font-display text-lg transition-all ${
                      isAvailable
                        ? 'text-black hover:bg-[#F77313] hover:text-white'
                        : 'text-neutral-300 cursor-not-allowed'
                    }`}
                  >
                    {letter}
                  </a>
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
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-[#F77313] rounded-lg"
                    />
                  </div>
                </form>
              </div>

              {activeFilters > 0 && (
                <Link
                  href="/en/spices/"
                  className="block text-sm text-[#F77313] hover:text-[#e56200] font-medium"
                >
                  × Reset filters ({activeFilters})
                </Link>
              )}

              {/* By food */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  By food
                </h3>
                <div className="space-y-1">
                  {FOOD_FILTERS.map((filter) => {
                    const isActive = params.food === filter.slug;
                    return (
                      <Link
                        key={filter.slug}
                        href={isActive ? '/en/spices/' : `/en/spices/?food=${filter.slug}`}
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

              {/* By origin */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  By origin
                </h3>
                <div className="space-y-1">
                  {ORIGIN_FILTERS.map((filter) => {
                    const isActive = params.origin === filter.slug;
                    return (
                      <Link
                        key={filter.slug}
                        href={isActive ? '/en/spices/' : `/en/spices/?origin=${filter.slug}`}
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

              {/* By taste */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  By taste
                </h3>
                <div className="space-y-1">
                  {TASTE_FILTERS.map((filter) => {
                    const isActive = params.category === filter.slug;
                    return (
                      <Link
                        key={filter.slug}
                        href={isActive ? '/en/spices/' : `/en/spices/?category=${filter.slug}`}
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
                  No spices found
                </h2>
                <p className="text-neutral-600 mb-6">
                  {params.q
                    ? `No results for "${params.q}"`
                    : 'Try adjusting your filters.'}
                </p>
                <Link
                  href="/en/spices/"
                  className="inline-block px-6 py-3 bg-[#F77313] text-white font-medium hover:bg-[#e56200] transition-colors"
                >
                  View all spices
                </Link>
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-neutral-600">
                    <span className="font-semibold text-black">{spicesList.length}</span> spice{spicesList.length > 1 ? 's' : ''}
                    {activeFilters > 0 && ' found'}
                  </p>
                </div>

                {/* List grouped by letter */}
                <div className="space-y-8">
                  {alphabet.map((letter) => {
                    const spices = spicesByLetter[letter];
                    if (!spices || spices.length === 0) return null;

                    return (
                      <div key={letter} id={`letter-${letter}`} className="scroll-mt-40">
                        {/* Letter */}
                        <div className="flex items-center gap-4 mb-4">
                          <span className="w-12 h-12 bg-[#F77313] text-white font-display text-2xl flex items-center justify-center">
                            {letter}
                          </span>
                          <div className="flex-1 h-px bg-neutral-200" />
                          <span className="text-sm text-neutral-500">
                            {spices.length} spice{spices.length > 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Spices for this letter */}
                        <div className="space-y-2">
                          {spices.map((spice) => (
                            <SpiceCard key={spice.id} spice={spice} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
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
