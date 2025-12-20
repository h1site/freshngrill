import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import { Flame, Leaf, Search, Globe, ChevronRight } from 'lucide-react';

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
    <Link
      href={`/en/spices/${spice.slug}/`}
      className="group flex flex-col sm:flex-row bg-white border border-neutral-200 hover:border-[#F77313] transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="sm:w-48 md:w-56 flex-shrink-0 aspect-[4/3] sm:aspect-square relative bg-neutral-100 overflow-hidden">
        {spice.featured_image ? (
          <Image
            src={spice.featured_image}
            alt={name}
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
                {name}
              </h2>
              {spice.name_en && spice.name_fr !== spice.name_en && (
                <p className="text-sm text-neutral-500">{spice.name_fr}</p>
              )}
            </div>

            {/* Intensity indicators */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Intensity</span>
                <IntensityIndicator level={intensity} />
              </div>
              {spicy > 0 && (
                <SpicyIndicator level={spicy} />
              )}
            </div>
          </div>

          {/* Description */}
          {spice.definition_en && (
            <p className="text-sm text-neutral-600 mt-3 line-clamp-2">
              {spice.definition_en}
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
          {/* Associated foods */}
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
            View
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
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

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/en/" className="hover:text-[#F77313]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">The Spice Route</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-black text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              Culinary Guide
            </span>
            <h1 className="text-4xl md:text-6xl font-display mt-3 mb-6">
              The Spice Route
            </h1>
            <p className="text-neutral-400 text-lg max-w-xl">
              Discover the origin, taste and uses of each spice.
              Filter by meat type, geographic origin or taste profile.
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />

            {/* Quick link to pairing guide */}
            <Link
              href="/en/spices/spice-pairing/"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#F77313] text-white font-medium hover:bg-[#e56200] transition-colors"
            >
              🍽️ Spice-Food Pairing Guide
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
                  placeholder="Search for a spice..."
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-[#F77313] rounded-lg"
                />
              </div>
            </form>

            {activeFilters > 0 && (
              <Link
                href="/en/spices/"
                className="text-sm text-[#F77313] hover:text-[#e56200] font-medium"
              >
                Reset ({activeFilters})
              </Link>
            )}
          </div>

          {/* Filter Groups */}
          <div className="space-y-3">
            {/* By food */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-neutral-500 font-medium flex-shrink-0 w-20">Food:</span>
              <div className="flex gap-2">
                {FOOD_FILTERS.map((filter) => (
                  <Link
                    key={filter.slug}
                    href={params.food === filter.slug ? '/en/spices/' : `/en/spices/?food=${filter.slug}`}
                    className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium transition-colors rounded-full flex items-center gap-1.5 ${
                      params.food === filter.slug
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

            {/* By origin */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-neutral-500 font-medium flex-shrink-0 w-20">Origin:</span>
              <div className="flex gap-2">
                {ORIGIN_FILTERS.map((filter) => (
                  <Link
                    key={filter.slug}
                    href={params.origin === filter.slug ? '/en/spices/' : `/en/spices/?origin=${filter.slug}`}
                    className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium transition-colors rounded-full flex items-center gap-1.5 ${
                      params.origin === filter.slug
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

            {/* By taste */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-neutral-500 font-medium flex-shrink-0 w-20">Profile:</span>
              <div className="flex gap-2">
                {TASTE_FILTERS.map((filter) => (
                  <Link
                    key={filter.slug}
                    href={params.category === filter.slug ? '/en/spices/' : `/en/spices/?category=${filter.slug}`}
                    className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium transition-colors rounded-full flex items-center gap-1.5 ${
                      params.category === filter.slug
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
            <div className="flex items-center justify-between mb-6">
              <p className="text-neutral-600">
                <span className="font-medium text-black">{spicesList.length}</span> spice{spicesList.length > 1 ? 's' : ''}
                {activeFilters > 0 && ' found'}
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
              <p>
                Use the filters above to quickly find spices suited to your dish:
                filter by meat type (beef, chicken, pork...), by origin
                (India, Mediterranean...) or by taste profile (mild, hot...).
              </p>
            </div>

            {/* Link to pairing guide */}
            <div className="mt-8 p-6 bg-white border border-neutral-200 rounded-lg">
              <h3 className="font-display text-xl text-black mb-2">
                🍽️ Spice-Food Pairing Guide
              </h3>
              <p className="text-neutral-600 mb-4">
                Our interactive guide to find the best spices based on what
                you&apos;re cooking. Select beef, chicken, fish or vegetables and discover
                perfect pairings!
              </p>
              <Link
                href="/en/spices/spice-pairing/"
                className="inline-flex items-center gap-2 text-[#F77313] font-medium hover:text-[#e56200]"
              >
                Explore the guide
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
