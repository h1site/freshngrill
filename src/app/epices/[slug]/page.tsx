import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import { ChevronRight, Globe, Clock, Flame, Leaf, AlertTriangle, Heart, Package, ArrowLeftRight } from 'lucide-react';
import RecipeFAQ from '@/components/recipe/RecipeFAQ';

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
  taste_profile: TasteProfile | null;
  usage_tips_fr: string | null;
  usage_tips_en: string | null;
  common_mistakes_fr: string | null;
  common_mistakes_en: string | null;
  used_with: UsedWith | null;
  benefits_fr: string | null;
  benefits_en: string | null;
  storage_fr: string | null;
  storage_en: string | null;
  substitutes: string[] | null;
  seo_title_fr: string | null;
  seo_title_en: string | null;
  seo_description_fr: string | null;
  seo_description_en: string | null;
  faq: string | null;
  featured_image: string | null;
  image_alt_fr: string | null;
  categories: string[] | null;
}

interface SubstituteSpice {
  slug: string;
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
    .select('name_fr, seo_title_fr, seo_description_fr')
    .eq('slug', slug)
    .eq('is_published', true)
    .single() as { data: { name_fr: string; seo_title_fr: string | null; seo_description_fr: string | null } | null };

  if (!spice) {
    return { title: 'Épice non trouvée' };
  }

  const title = spice.seo_title_fr || `${spice.name_fr} | Dictionnaire des Épices`;
  const description = spice.seo_description_fr || `Tout sur ${spice.name_fr}: origine, goût, utilisations en cuisine et recettes. Guide complet.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/epices/${slug}/`,
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
    { key: 'meat' as const, label: 'Viandes', emoji: '🥩' },
    { key: 'fish' as const, label: 'Poissons & Fruits de mer', emoji: '🐟' },
    { key: 'vegetables' as const, label: 'Légumes', emoji: '🥕' },
    { key: 'grains' as const, label: 'Riz, Pâtes, Légumineuses', emoji: '🍚' },
    { key: 'bread' as const, label: 'Pains & Pâtisseries', emoji: '🥖' },
    { key: 'desserts' as const, label: 'Desserts', emoji: '🍰' },
    { key: 'cheese' as const, label: 'Fromages', emoji: '🧀' },
    { key: 'soups' as const, label: 'Soupes & Sauces', emoji: '🥣' },
  ];

  const hasContent = categories.some(cat => usedWith[cat.key]?.length);
  if (!hasContent) return null;

  return (
    <section className="border border-neutral-200 p-6 md:p-8">
      <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
        <span className="text-2xl">🍽️</span>
        Avec quels aliments utiliser cette épice?
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

  // Fetch substitute spices
  let substituteSpices: SubstituteSpice[] = [];
  if (spice.substitutes?.length) {
    const { data: subs } = await supabase
      .from('spices')
      .select('slug, name_fr')
      .in('slug', spice.substitutes)
      .eq('is_published', true);
    substituteSpices = (subs || []) as SubstituteSpice[];
  }

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: spice.name_fr,
    description: spice.definition_fr,
    image: spice.featured_image,
    author: {
      '@type': 'Organization',
      name: 'Menucochon',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-neutral-50 border-b border-neutral-200">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
              <Link href="/" className="hover:text-[#F77313]">Accueil</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/epices/" className="hover:text-[#F77313]">Épices</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black">{spice.name_fr}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-black text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                  Dictionnaire des épices
                </span>
                <h1 className="text-5xl md:text-6xl font-display mt-3 mb-4">
                  {spice.name_fr}
                </h1>

                {spice.name_en && spice.name_en !== spice.name_fr && (
                  <p className="text-neutral-400 text-lg mb-2">
                    English: <span className="text-white">{spice.name_en}</span>
                  </p>
                )}

                {spice.other_names?.length ? (
                  <p className="text-neutral-400 text-sm mb-6">
                    Aussi appelé: {spice.other_names.join(', ')}
                  </p>
                ) : null}

                {spice.definition_fr && (
                  <p className="text-neutral-300 text-lg leading-relaxed">
                    {spice.definition_fr}
                  </p>
                )}

                {/* Taste profile summary */}
                <div className="flex flex-wrap gap-6 mt-8">
                  {tasteProfile.intensity && (
                    <div>
                      <span className="text-neutral-500 text-sm block mb-1">Intensité</span>
                      <RatingStars value={tasteProfile.intensity} />
                    </div>
                  )}
                  {tasteProfile.spicy && tasteProfile.spicy > 0 && (
                    <div>
                      <span className="text-neutral-500 text-sm block mb-1">Piquant</span>
                      <RatingStars value={tasteProfile.spicy} icon="🌶️" emptyIcon="🌶️" />
                    </div>
                  )}
                </div>

                {/* Categories */}
                {spice.categories?.length ? (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {spice.categories.map(cat => (
                      <Link
                        key={cat}
                        href={`/epices/?categorie=${cat}`}
                        className="px-3 py-1 bg-white/10 text-white text-sm hover:bg-[#F77313] transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Image */}
              <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                {spice.featured_image ? (
                  <Image
                    src={spice.featured_image}
                    alt={spice.image_alt_fr || spice.name_fr}
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

        {/* Main Content */}
        <article className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Origine & Histoire */}
            {(spice.origin?.length || spice.history_fr) && (
              <section className="border border-neutral-200 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-[#F77313]" />
                  Origine & Histoire
                </h2>

                {spice.origin?.length ? (
                  <div className="mb-4">
                    <span className="text-sm text-neutral-500">Origine:</span>
                    <p className="text-black font-medium">{spice.origin.join(', ')}</p>
                  </div>
                ) : null}

                {spice.history_fr && (
                  <div
                    className="prose prose-neutral max-w-none"
                    dangerouslySetInnerHTML={{ __html: spice.history_fr }}
                  />
                )}
              </section>
            )}

            {/* Profil gustatif détaillé */}
            {tasteProfile.notes_fr?.length ? (
              <section className="border border-neutral-200 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <Leaf className="w-6 h-6 text-[#F77313]" />
                  Profil Gustatif
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-neutral-50 p-4 text-center">
                    <span className="text-sm text-neutral-500 block mb-1">Intensité</span>
                    <RatingStars value={tasteProfile.intensity || 0} />
                  </div>
                  <div className="bg-neutral-50 p-4 text-center">
                    <span className="text-sm text-neutral-500 block mb-1">Piquant</span>
                    <RatingStars value={tasteProfile.spicy || 0} icon="🌶️" emptyIcon="🌶️" />
                  </div>
                  <div className="bg-neutral-50 p-4 text-center">
                    <span className="text-sm text-neutral-500 block mb-1">Amertume</span>
                    <RatingStars value={tasteProfile.bitterness || 0} />
                  </div>
                  <div className="bg-neutral-50 p-4 text-center">
                    <span className="text-sm text-neutral-500 block mb-1">Douceur</span>
                    <RatingStars value={tasteProfile.sweetness || 0} />
                  </div>
                </div>

                <div>
                  <span className="text-sm text-neutral-500">Notes dominantes:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tasteProfile.notes_fr.map(note => (
                      <span key={note} className="px-3 py-1 bg-[#F77313]/10 text-[#F77313] text-sm">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {/* Utilisation */}
            {spice.usage_tips_fr && (
              <section className="border border-neutral-200 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#F77313]" />
                  Comment utiliser cette épice
                </h2>
                <div
                  className="prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: spice.usage_tips_fr }}
                />
              </section>
            )}

            {/* Erreurs fréquentes */}
            {spice.common_mistakes_fr && (
              <section className="border border-red-200 bg-red-50 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  Erreurs à éviter
                </h2>
                <div
                  className="prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: spice.common_mistakes_fr }}
                />
              </section>
            )}

            {/* Avec quels aliments */}
            <UsedWithSection usedWith={usedWith} />

            {/* Bienfaits */}
            {spice.benefits_fr && (
              <section className="border border-green-200 bg-green-50 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <Heart className="w-6 h-6 text-green-600" />
                  Bienfaits
                </h2>
                <div
                  className="prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: spice.benefits_fr }}
                />
                <p className="text-xs text-neutral-500 mt-4 italic">
                  Information à titre indicatif uniquement. Ne constitue pas un avis médical.
                </p>
              </section>
            )}

            {/* Conservation */}
            {spice.storage_fr && (
              <section className="border border-neutral-200 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <Package className="w-6 h-6 text-[#F77313]" />
                  Conservation
                </h2>
                <div
                  className="prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: spice.storage_fr }}
                />
              </section>
            )}

            {/* Substitutions */}
            {substituteSpices.length > 0 && (
              <section className="border border-neutral-200 p-6 md:p-8">
                <h2 className="font-display text-2xl text-black mb-6 flex items-center gap-3">
                  <ArrowLeftRight className="w-6 h-6 text-[#F77313]" />
                  Substitutions possibles
                </h2>
                <p className="text-neutral-600 mb-4">
                  Si vous n&apos;avez pas de {spice.name_fr}, vous pouvez utiliser:
                </p>
                <div className="flex flex-wrap gap-3">
                  {substituteSpices.map(sub => (
                    <Link
                      key={sub.slug}
                      href={`/epices/${sub.slug}/`}
                      className="px-4 py-2 bg-neutral-100 text-black hover:bg-[#F77313] hover:text-white transition-colors"
                    >
                      {sub.name_fr}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {spice.faq && (
              <RecipeFAQ faq={typeof spice.faq === 'string' ? spice.faq : JSON.stringify(spice.faq)} />
            )}
          </div>
        </article>

        {/* Back to list */}
        <section className="bg-neutral-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <Link
              href="/epices/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium hover:bg-[#F77313] transition-colors"
            >
              ← Retour au dictionnaire des épices
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
