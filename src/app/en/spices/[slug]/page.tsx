import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import { ChevronRight, Globe, Clock, Flame, Leaf, AlertTriangle, Heart, Package, ArrowLeftRight, ShoppingCart } from 'lucide-react';
import RecipeFAQ from '@/components/recipe/RecipeFAQ';
import SpicePronounceButton from '@/components/spice/SpicePronounceButton';
import { siteConfig } from '@/lib/config';

const AMAZON_STORE_ID = 'h1site0d-20';

interface TasteProfile {
  intensity?: number;
  spicy?: number;
  bitterness?: number;
  sweetness?: number;
  notes_fr?: string[];
  notes_en?: string[];
}

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
  other_names: string[] | null;
  definition_fr: string | null;
  definition_en: string | null;
  origin: string[] | null;
  history_fr: string | null;
  history_en: string | null;
  origine_histoire_fr: string | null;
  origine_histoire_en: string | null;
  taste_profile: TasteProfile | null;
  usage_tips_fr: string | null;
  usage_tips_en: string | null;
  utilisation_aliments_fr: string[] | null;
  utilisation_aliments_en: string[] | null;
  common_mistakes_fr: string | null;
  common_mistakes_en: string | null;
  used_with: UsedWith | null;
  benefits_fr: string | null;
  benefits_en: string | null;
  bienfaits_fr: string[] | null;
  bienfaits_en: string[] | null;
  storage_fr: string | null;
  storage_en: string | null;
  conservation_fr: string | null;
  conservation_en: string | null;
  substitutes: string[] | null;
  substitutions: string[] | null;
  seo_title_fr: string | null;
  seo_title_en: string | null;
  seo_description_fr: string | null;
  seo_description_en: string | null;
  faq: string | null;
  faq_fr: Array<{ question: string; reponse: string }> | null;
  faq_en: Array<{ question: string; reponse: string }> | null;
  featured_image: string | null;
  image_alt_en: string | null;
  categories: string[] | null;
}

interface SubstituteSpice {
  slug: string;
  name_en: string | null;
  name_fr: string;
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: spice } = await supabase
    .from('spices')
    .select('name_en, name_fr, seo_title_en, seo_description_en')
    .eq('slug', slug)
    .eq('is_published', true)
    .single() as { data: { name_en: string | null; name_fr: string; seo_title_en: string | null; seo_description_en: string | null } | null };

  if (!spice) {
    return { title: 'Spice not found' };
  }

  const name = spice.name_en || spice.name_fr;
  const title = spice.seo_title_en || `${name} | The Spice Route`;
  const description = spice.seo_description_en || `Everything about ${name}: origin, taste, culinary uses and recipes. Complete guide.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/en/spices/${slug}/`,
      languages: {
        'fr-CA': `/epices/${slug}/`,
        'en-CA': `/en/spices/${slug}/`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

function RatingStars({ value, max = 5, icon = '⭐', emptyIcon = '☆' }: { value: number; max?: number; icon?: string; emptyIcon?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < value ? 'opacity-100' : 'opacity-30'}>
          {i < value ? icon : emptyIcon}
        </span>
      ))}
    </div>
  );
}

function UsedWithSection({ usedWith }: { usedWith: UsedWith }) {
  const categories = [
    { key: 'meat' as const, label: 'Meats', emoji: '🥩' },
    { key: 'fish' as const, label: 'Fish & Seafood', emoji: '🐟' },
    { key: 'vegetables' as const, label: 'Vegetables', emoji: '🥕' },
    { key: 'grains' as const, label: 'Rice, Pasta, Legumes', emoji: '🍚' },
    { key: 'bread' as const, label: 'Breads & Pastries', emoji: '🥖' },
    { key: 'desserts' as const, label: 'Desserts', emoji: '🍰' },
    { key: 'cheese' as const, label: 'Cheeses', emoji: '🧀' },
    { key: 'soups' as const, label: 'Soups & Sauces', emoji: '🥣' },
  ];

  const hasContent = categories.some(cat => usedWith[cat.key]?.length);
  if (!hasContent) return null;

  return (
    <section className="border border-neutral-200 p-6 md:p-8">
      <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
        <span className="text-2xl">🍽️</span>
        What foods to use this spice with?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => {
          const items = usedWith[cat.key];
          if (!items?.length) return null;

          return (
            <div key={cat.key} className="bg-neutral-50 p-4">
              <h3 className="font-medium text-black flex items-center gap-2 mb-2">
                <span>{cat.emoji}</span>
                {cat.label}
              </h3>
              <p className="text-neutral-600 text-sm">
                {items.join(', ')}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default async function SpicePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: spice } = await supabase
    .from('spices')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single() as { data: Spice | null };

  if (!spice) {
    notFound();
  }

  const tasteProfile = spice.taste_profile || {};
  const usedWith = spice.used_with || {};
  const name = spice.name_en || spice.name_fr;

  // Fetch substitute spices (check both substitutes and substitutions arrays)
  const substitutesList = spice.substitutes?.length ? spice.substitutes : spice.substitutions;
  let substituteSpices: SubstituteSpice[] = [];
  if (substitutesList?.length) {
    const { data: subs } = await supabase
      .from('spices')
      .select('slug, name_fr, name_en')
      .in('slug', substitutesList)
      .eq('is_published', true);
    substituteSpices = (subs || []) as SubstituteSpice[];
  }

  // Fetch similar spices (same category, excluding current)
  const { data: similarSpices } = await supabase
    .from('spices')
    .select('slug, name_fr, name_en, featured_image, categories')
    .eq('is_published', true)
    .neq('slug', slug)
    .limit(6);

  // Filter to find spices with matching categories
  const currentCategories = spice.categories || [];
  const suggestedSpices = ((similarSpices || []) as Array<{slug: string; name_fr: string; name_en: string | null; featured_image: string | null; categories: string[] | null}>)
    .filter(s => {
      const cats = s.categories || [];
      return cats.some((c: string) => currentCategories.includes(c));
    })
    .slice(0, 4);

  // JSON-LD Schema - Product schema for spices
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: spice.definition_en || `Complete guide to ${name}: origin, taste, culinary uses.`,
    image: spice.featured_image || `${siteConfig.url}/images/spice-placeholder.jpg`,
    url: `${siteConfig.url}/en/spices/${slug}/`,
    category: 'Spices and seasonings',
    brand: {
      '@type': 'Brand',
      name: 'The Spice Route',
    },
    aggregateRating: tasteProfile.intensity ? {
      '@type': 'AggregateRating',
      ratingValue: tasteProfile.intensity,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 1,
    } : undefined,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'CAD',
      availability: 'https://schema.org/InStock',
      url: `https://www.amazon.ca/s?k=${encodeURIComponent(name + ' spice')}&tag=${AMAZON_STORE_ID}`,
    },
  };

  // Amazon search URL for this spice
  const amazonSearchUrl = `https://www.amazon.ca/s?k=${encodeURIComponent(name + ' spice')}&tag=${AMAZON_STORE_ID}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">

        <section className="bg-black text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                  The Spice Route
                </span>
                <div className="flex items-center gap-3 mt-3 mb-4">
                  <h1 className="text-5xl md:text-6xl font-display">
                    {name}
                  </h1>
                  <SpicePronounceButton
                    text={name}
                    description={spice.definition_en || undefined}
                    lang="en"
                    className="!p-2 !text-white hover:!bg-white/20"
                  />
                </div>

                {spice.other_names?.length ? (
                  <p className="text-neutral-400 text-sm mb-6">
                    Also known as: {spice.other_names.join(', ')}
                  </p>
                ) : null}

                {spice.definition_en && (
                  <p className="text-neutral-300 text-lg leading-relaxed">
                    {spice.definition_en}
                  </p>
                )}

                <div className="flex flex-wrap gap-6 mt-8">
                  {tasteProfile.intensity && (
                    <div>
                      <span className="text-neutral-500 text-sm block mb-1">Intensity</span>
                      <RatingStars value={tasteProfile.intensity} />
                    </div>
                  )}
                  {tasteProfile.spicy && tasteProfile.spicy > 0 && (
                    <div>
                      <span className="text-neutral-500 text-sm block mb-1">Heat</span>
                      <RatingStars value={tasteProfile.spicy} icon="🌶️" emptyIcon="🌶️" />
                    </div>
                  )}
                </div>

                {spice.categories?.length ? (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {spice.categories.map(cat => (
                      <Link
                        key={cat}
                        href={`/en/spices/?category=${cat}`}
                        className="px-3 py-1 bg-white/10 text-white text-sm hover:bg-[#F77313] transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                {spice.featured_image ? (
                  <Image
                    src={spice.featured_image}
                    alt={spice.image_alt_en || name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-9xl">
                    🌶️
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <article className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {(spice.origin?.length || spice.history_en || spice.origine_histoire_en) && (
              <section className="border border-neutral-200 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-[#F77313]" />
                  Origin & History
                </h2>

                {spice.origin?.length ? (
                  <div className="mb-4">
                    <span className="text-sm text-neutral-500">Origin:</span>
                    <p className="text-black font-medium">{spice.origin.join(', ')}</p>
                  </div>
                ) : null}

                {(spice.history_en || spice.origine_histoire_en) && (
                  <div
                    className="prose prose-neutral max-w-none"
                    dangerouslySetInnerHTML={{ __html: spice.history_en || spice.origine_histoire_en || '' }}
                  />
                )}
              </section>
            )}

            {tasteProfile.notes_en?.length ? (
              <section className="border border-neutral-200 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <Leaf className="w-6 h-6 text-[#F77313]" />
                  Taste Profile
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-neutral-50 p-4 text-center">
                    <span className="text-sm text-neutral-500 block mb-1">Intensity</span>
                    <RatingStars value={tasteProfile.intensity || 0} />
                  </div>
                  <div className="bg-neutral-50 p-4 text-center">
                    <span className="text-sm text-neutral-500 block mb-1">Heat</span>
                    <RatingStars value={tasteProfile.spicy || 0} icon="🌶️" emptyIcon="🌶️" />
                  </div>
                  <div className="bg-neutral-50 p-4 text-center">
                    <span className="text-sm text-neutral-500 block mb-1">Bitterness</span>
                    <RatingStars value={tasteProfile.bitterness || 0} />
                  </div>
                  <div className="bg-neutral-50 p-4 text-center">
                    <span className="text-sm text-neutral-500 block mb-1">Sweetness</span>
                    <RatingStars value={tasteProfile.sweetness || 0} />
                  </div>
                </div>

                <div>
                  <span className="text-sm text-neutral-500">Dominant notes:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tasteProfile.notes_en.map(note => (
                      <span key={note} className="px-3 py-1 bg-[#F77313]/10 text-[#F77313] text-sm">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {(spice.usage_tips_en || spice.utilisation_aliments_en?.length) && (
              <section className="border border-neutral-200 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#F77313]" />
                  How to use this spice
                </h2>
                {spice.usage_tips_en && (
                  <div
                    className="prose prose-neutral max-w-none mb-4"
                    dangerouslySetInnerHTML={{ __html: spice.usage_tips_en }}
                  />
                )}
                {spice.utilisation_aliments_en?.length ? (
                  <div>
                    <span className="text-sm text-neutral-500 block mb-2">Pairs well with:</span>
                    <div className="flex flex-wrap gap-2">
                      {spice.utilisation_aliments_en.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            )}

            {spice.common_mistakes_en && (
              <section className="border border-red-200 bg-red-50 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  Common mistakes to avoid
                </h2>
                <div
                  className="prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: spice.common_mistakes_en }}
                />
              </section>
            )}

            <UsedWithSection usedWith={usedWith} />

            {(spice.benefits_en || spice.bienfaits_en?.length) && (
              <section className="border border-green-200 bg-green-50 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <Heart className="w-6 h-6 text-green-600" />
                  Benefits
                </h2>
                {spice.benefits_en && (
                  <div
                    className="prose prose-neutral max-w-none mb-4"
                    dangerouslySetInnerHTML={{ __html: spice.benefits_en }}
                  />
                )}
                {spice.bienfaits_en?.length ? (
                  <ul className="space-y-2">
                    {spice.bienfaits_en.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="text-neutral-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="text-xs text-neutral-500 mt-4 italic">
                  For informational purposes only. Does not constitute medical advice.
                </p>
              </section>
            )}

            {(spice.storage_en || spice.conservation_en) && (
              <section className="border border-neutral-200 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <Package className="w-6 h-6 text-[#F77313]" />
                  Storage
                </h2>
                {spice.storage_en ? (
                  <div
                    className="prose prose-neutral max-w-none"
                    dangerouslySetInnerHTML={{ __html: spice.storage_en }}
                  />
                ) : spice.conservation_en ? (
                  <p className="text-neutral-700">{spice.conservation_en}</p>
                ) : null}
              </section>
            )}

            {/* Amazon Buy Link */}
            <section className="border-2 border-[#F77313] bg-neutral-100 p-6 md:p-8">
              <h2 className="font-display text-2xl text-black mb-4 flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-[#F77313]" />
                Buy {name}
              </h2>
              <p className="text-neutral-600 mb-6">
                Find this quality spice on Amazon.ca and start cooking!
              </p>
              <a
                href={amazonSearchUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#FF9900] text-black font-semibold hover:bg-[#FF9900]/90 transition-colors rounded"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.544.41-3.063.615-4.56.615-4.622 0-8.648-1.244-12.08-3.73-.116-.082-.147-.173-.104-.287.043-.116.133-.174.257-.174z"/>
                </svg>
                View on Amazon.ca
                <ChevronRight className="w-4 h-4" />
              </a>
              <p className="text-xs text-neutral-500 mt-4">
                Amazon affiliate link - we may earn a commission on eligible purchases.
              </p>
            </section>

            {(substituteSpices.length > 0 || substitutesList?.length) && (
              <section className="border border-neutral-200 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <ArrowLeftRight className="w-6 h-6 text-[#F77313]" />
                  Possible substitutions
                </h2>
                <p className="text-neutral-600 mb-4">
                  If you don&apos;t have {name}, you can use:
                </p>
                <div className="flex flex-wrap gap-3">
                  {substituteSpices.length > 0 ? (
                    substituteSpices.map(sub => (
                      <Link
                        key={sub.slug}
                        href={`/en/spices/${sub.slug}/`}
                        className="px-4 py-2 bg-neutral-100 text-black hover:bg-[#F77313] hover:text-white transition-colors"
                      >
                        {sub.name_en || sub.name_fr}
                      </Link>
                    ))
                  ) : (
                    substitutesList?.map((sub, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-neutral-100 text-black"
                      >
                        {sub}
                      </span>
                    ))
                  )}
                </div>
              </section>
            )}

            {(spice.faq || spice.faq_en?.length) && (
              spice.faq ? (
                <RecipeFAQ faq={typeof spice.faq === 'string' ? spice.faq : JSON.stringify(spice.faq)} locale="en" />
              ) : spice.faq_en?.length ? (
                <section className="border border-neutral-200 p-6 md:p-8">
                  <h2 className="font-display text-2xl text-black mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {spice.faq_en.map((item, i) => (
                      <details key={i} className="group bg-neutral-50 p-4">
                        <summary className="font-medium text-black cursor-pointer list-none flex items-center justify-between">
                          {item.question}
                          <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-3 text-neutral-600">{item.reponse}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null
            )}
          </div>
        </article>

        {/* Suggested spices */}
        {suggestedSpices.length > 0 && (
          <section className="bg-neutral-50 py-12 border-t border-neutral-200">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl md:text-3xl text-black mb-8 text-center">
                Discover more spices
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {suggestedSpices.map(s => (
                  <Link
                    key={s.slug}
                    href={`/en/spices/${s.slug}/`}
                    className="group bg-white border border-neutral-200 hover:border-[#F77313] transition-all overflow-hidden"
                  >
                    <div className="aspect-square relative bg-neutral-100">
                      {s.featured_image ? (
                        <Image
                          src={s.featured_image}
                          alt={s.name_en || s.name_fr}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🌿
                        </div>
                      )}
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-display text-sm text-black group-hover:text-[#F77313] transition-colors line-clamp-2">
                        {s.name_en || s.name_fr}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to list */}
        <section className="bg-neutral-100 py-8">
          <div className="container mx-auto px-4 text-center">
            <Link
              href="/en/spices/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium hover:bg-[#F77313] transition-colors"
            >
              ← Back to The Spice Route
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
