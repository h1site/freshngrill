import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getRecipeBySlugWithLocale,
  getAllEnglishRecipeSlugs,
  getAllRecipeSlugs,
  getSimilarRecipes,
  enrichRecipeCardsWithEnglishSlugs,
  getSpicesInRecipe,
  getNextRecipe,
} from '@/lib/recipes';
import { getRecentPosts } from '@/lib/posts';
import { optimizeMetaDescription } from '@/lib/utils';
import RecipeHeader from '@/components/recipe/RecipeHeader';
import RecipeIngredients from '@/components/recipe/RecipeIngredients';
import RecipeInstructions from '@/components/recipe/RecipeInstructions';
import RecipeNutrition from '@/components/recipe/RecipeNutrition';
import RecipeSimilar from '@/components/recipe/RecipeSimilar';
import RecipeSchema from '@/components/recipe/RecipeSchema';
import RecipeFAQ from '@/components/recipe/RecipeFAQ';
import RecipeComments from '@/components/recipe/RecipeComments';
import RecipeRating from '@/components/recipe/RecipeRating';
import GoogleAd from '@/components/ads/GoogleAd';
import GoogleAdInArticle from '@/components/ads/GoogleAdInArticle';
import SetLanguageSlugs from '@/components/SetLanguageSlugs';
import AmazonKitchenProducts from '@/components/amazon/AmazonKitchenProducts';
import RecipeAmazonSuggestions from '@/components/amazon/RecipeAmazonSuggestions';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import FAQSchema from '@/components/schema/FAQSchema';
import { Clock, ArrowRight } from 'lucide-react';
import RecipeSpiceLinks from '@/components/recipe/RecipeSpiceLinks';
import RecipeVideo from '@/components/recipe/RecipeVideo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Générer les routes pour les slugs anglais ET français (fallback)
  const englishSlugs = await getAllEnglishRecipeSlugs();
  const frenchSlugs = await getAllRecipeSlugs();

  // Combiner les slugs anglais avec les slugs français (pour ceux sans traduction)
  const englishSlugSet = new Set(englishSlugs.map(s => s.slugFr));
  const fallbackSlugs = frenchSlugs.filter(s => !englishSlugSet.has(s));

  return [
    ...englishSlugs.map(s => ({ slug: s.slugEn })),
    ...fallbackSlugs.map(slug => ({ slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlugWithLocale(slug, 'en');

  if (!recipe) {
    return {
      title: 'Recipe not found',
    };
  }

  // Utiliser le slug anglais si disponible, sinon le slug français
  const enSlug = recipe.slugEn || slug;
  const frSlug = recipe.slugFr || recipe.slug;

  // Meta description optimisée (155-160 caractères)
  const metaDescription = optimizeMetaDescription(
    recipe.seoDescription || recipe.excerpt,
    `Discover our ${recipe.title} recipe. Easy instructions, simple ingredients.`
  );

  return {
    title: recipe.seoTitle || recipe.title,
    description: metaDescription,
    alternates: {
      canonical: `/en/recipe/${enSlug}/`,
      languages: {
        'fr-CA': `/recette/${frSlug}/`,
        'en-CA': `/en/recipe/${enSlug}/`,
        'x-default': `/recette/${frSlug}/`,
      },
    },
    openGraph: {
      title: recipe.title,
      description: recipe.excerpt,
      images: recipe.featuredImage
        ? [{ url: recipe.featuredImage, width: 1200, height: 630, alt: recipe.title }]
        : [],
      type: 'article',
      url: `/en/recipe/${enSlug}/`,
      siteName: 'Menucochon',
      locale: 'en_CA',
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description: recipe.excerpt,
      images: recipe.featuredImage ? [recipe.featuredImage] : [],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
    authors: [{ name: recipe.author || 'Menucochon' }],
  };
}

export default async function RecipePageEN({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipeBySlugWithLocale(slug, 'en');

  if (!recipe) {
    notFound();
  }

  // Si on accède avec un slug français et qu'un slug anglais existe, rediriger
  if (recipe.slugEn && recipe.slugEn !== slug && recipe.slug === slug) {
    redirect(`/en/recipe/${recipe.slugEn}/`);
  }

  const [
    rawSimilarRecipes,
    spicesInRecipe,
    latestPosts,
    nextRecipe,
  ] = await Promise.all([
    getSimilarRecipes(recipe, 12),
    getSpicesInRecipe(recipe, 6),
    getRecentPosts(6),
    getNextRecipe(recipe, 'en'),
  ]);
  // Convert to RecipeCard format and enrich with English slugs
  const similarRecipeCards = rawSimilarRecipes.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    featuredImage: r.featuredImage,
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    totalTime: r.totalTime,
    difficulty: r.difficulty,
    categories: r.categories,
    likes: r.likes,
  }));
  const similarRecipes = await enrichRecipeCardsWithEnglishSlugs(similarRecipeCards);

  const breadcrumbs = [
    { name: 'Home', url: '/en' },
    { name: 'Recipes', url: '/en/recipe' },
    ...(recipe.categories?.[0] ? [{ name: recipe.categories[0].name, url: `/en/category/${recipe.categories[0].slug}` }] : []),
    { name: recipe.title, url: `/en/recipe/${slug}/` },
  ];

  return (
    <>
      <SetLanguageSlugs slugFr={recipe.slugFr || recipe.slug} slugEn={recipe.slugEn || slug} />
      <RecipeSchema recipe={recipe} locale="en" />
      {recipe.faq && <FAQSchema faq={recipe.faq} recipeTitle={recipe.title} locale="en" />}
      <BreadcrumbSchema items={breadcrumbs} />

      <main className="min-h-screen bg-white">
        <article>
        {/* Hero - Image portrait à droite sur desktop */}
        <header className="relative bg-black">
          {/* Mobile: image en background classique */}
          <div className="lg:hidden relative h-[55vh] sm:h-[50vh]">
            {recipe.featuredImage ? (
              <Image
                src={recipe.featuredImage}
                alt={recipe.title}
                fill
                quality={100}
                className="object-cover object-center"
                priority
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <div className="container mx-auto">
                <RecipeHeader recipe={recipe} locale="en" />
              </div>
            </div>
          </div>

          {/* Desktop: hero split diagonal */}
          <div className="hidden lg:flex relative min-h-[55vh]">
            {/* Côté gauche - texte sur fond sombre */}
            <div className="relative flex-1 bg-neutral-950 flex items-center">
              <div className="relative z-10 pl-[max(2rem,calc((100vw-1280px)/2+1rem))] pr-12 py-12">
                <RecipeHeader recipe={recipe} locale="en" />
              </div>
            </div>
            {/* Côté droit - image avec dégradé */}
            {recipe.featuredImage && (
              <div className="relative w-[45%]">
                <Image
                  src={recipe.featuredImage}
                  alt={recipe.title}
                  fill
                  quality={100}
                  className="object-cover"
                  priority
                  sizes="45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />
              </div>
            )}
          </div>
        </header>

        {/* Introduction full width */}
        <section className="container mx-auto px-4 pt-8 md:pt-20">
          {/* Introduction */}
          {recipe.introduction && (
            <div className="relative py-4 lg:py-6 lg:border-l-4 lg:border-[#F77313] lg:bg-gradient-to-r lg:from-neutral-100 lg:to-transparent lg:pl-12">
              <div
                className="recipe-introduction"
                dangerouslySetInnerHTML={{ __html: recipe.introduction }}
              />
            </div>
          )}

          {/* Description/Excerpt (if no introduction and excerpt not truncated) */}
          {!recipe.introduction && recipe.excerpt && !recipe.excerpt.endsWith('...') && (
            <div className="relative py-4 lg:py-6 lg:border-l-4 lg:border-[#F77313] lg:bg-gradient-to-r lg:from-neutral-100 lg:to-transparent lg:pl-12">
              <p className="recipe-introduction">
                {recipe.excerpt}
              </p>
            </div>
          )}

          {/* 📍 1. Responsive display ad after intro */}
          <GoogleAd className="my-6 print:hidden" />
        </section>

        {/* Main content */}
        <section className="container mx-auto px-4 pb-8 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Ingredients inline - mobile only */}
              <div className="lg:hidden -mx-4 [&>:first-child]:px-4 [&>:first-child]:py-6 [&>:first-child]:rounded-none">
                <RecipeIngredients
                  ingredients={recipe.ingredients}
                  servings={recipe.servings}
                  servingsUnit={recipe.servingsUnit}
                  locale="en"
                />
                {recipe.nutrition && (
                  <div className="bg-neutral-900 px-4 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
                    {recipe.nutrition.calories !== undefined && (
                      <span className="text-white font-bold">{recipe.nutrition.calories} kcal</span>
                    )}
                    {recipe.nutrition.protein !== undefined && (
                      <span className="text-white/70">{recipe.nutrition.protein}g protein</span>
                    )}
                    {recipe.nutrition.fat !== undefined && (
                      <span className="text-white/70">{recipe.nutrition.fat}g fat</span>
                    )}
                    {recipe.nutrition.carbs !== undefined && (
                      <span className="text-white/70">{recipe.nutrition.carbs}g carbs</span>
                    )}
                  </div>
                )}
              </div>

              {/* H2 - Complete steps */}
              <RecipeInstructions instructions={recipe.instructions} locale="en" />

              {/* Partnership CTA - mobile only */}
              <div className="lg:hidden bg-neutral-900 text-white p-5 rounded-xl print:hidden">
                <div className="text-center">
                  <span className="text-[#F77313] text-xs font-medium uppercase tracking-widest">
                    Partnership
                  </span>
                  <h3 className="font-display text-lg mt-2 mb-3">
                    Advertise on Menucochon?
                  </h3>
                  <p className="text-neutral-400 text-sm mb-4">
                    Reach thousands of Quebec cuisine enthusiasts.
                  </p>
                  <Link
                    href="/en/advertising"
                    className="inline-flex items-center gap-2 bg-[#F77313] text-white px-4 py-2 text-sm font-medium hover:bg-[#e56610] transition-colors rounded-lg"
                  >
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Recipe video (placed after instructions) */}
              {recipe.videoUrl && (
                <div className="mt-8">
                  <RecipeVideo
                    videoUrl={recipe.videoUrl}
                    title={recipe.title}
                    locale="en"
                  />
                </div>
              )}

              {/* 📍 2. In-article ad (1 per page only - best CTR) */}
              <GoogleAdInArticle className="my-6 print:hidden" />

              {/* Tips / Chef's advice */}
              {recipe.content && (
                <div className="bg-gradient-to-br from-neutral-900 to-black p-8 md:p-10 rounded-lg shadow-2xl">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#F77313] to-[#d45f0a] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl">💡</span>
                    </div>
                    <div>
                      <h2 className="font-display text-2xl tracking-wide text-white">
                        Our Tips
                      </h2>
                      <p className="text-white/40 text-sm mt-1">Chef&apos;s tips for making this recipe</p>
                    </div>
                  </div>
                  <div
                    className="recipe-astuces text-white/90"
                    dangerouslySetInnerHTML={{
                      __html: recipe.content
                        .replace(/\*\*([^*]+)\*\*\s*:?\s*/g, '<strong>$1:</strong> ')
                    }}
                  />
                </div>
              )}

              {/* 📍 3. Responsive display ad before conclusion */}
              <GoogleAd className="my-6 print:hidden" />

              {/* Conclusion / Serving suggestions */}
              {recipe.conclusion && (
                <div className="bg-neutral-50 p-8 md:p-10 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-[#F77313]/10 rounded-full flex items-center justify-center">
                      <span className="text-xl">✨</span>
                    </div>
                    <h2 className="font-display text-2xl tracking-wide text-black">
                      Serving Suggestions
                    </h2>
                    <div className="flex-1 h-px bg-neutral-300" />
                  </div>
                  <div
                    className="recipe-conclusion"
                    dangerouslySetInnerHTML={{ __html: recipe.conclusion }}
                  />
                </div>
              )}

              {/* FAQ */}
              {recipe.faq && (
                <RecipeFAQ faq={recipe.faq} locale="en" />
              )}

              {/* Rating */}
              <div className="bg-neutral-50 p-8 rounded-lg text-center">
                <h3 className="font-display text-xl mb-4">Have you tried this recipe?</h3>
                <RecipeRating
                  recipeId={recipe.id}
                  recipeSlug={recipe.slug}
                  locale="en"
                />
              </div>

              {/* Comments */}
              <div className="mt-12">
                <RecipeComments recipeId={recipe.id} slug={recipe.slug} locale="en" />
              </div>

              {/* Spices used in this recipe */}
              {spicesInRecipe.length > 0 && (
                <RecipeSpiceLinks spices={spicesInRecipe} locale="en" />
              )}

            </div>

            {/* Sidebar */}
            <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
              {/* Recipe card - Ingredients (desktop only, mobile version is inline) */}
              <div className="hidden lg:block bg-white border-2 border-neutral-200 rounded-xl p-6 shadow-sm">
                <RecipeIngredients
                  ingredients={recipe.ingredients}
                  servings={recipe.servings}
                  servingsUnit={recipe.servingsUnit}
                  locale="en"
                />
                {recipe.nutrition && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <RecipeNutrition nutrition={recipe.nutrition} locale="en" />
                  </div>
                )}
              </div>

              {/* Recipe suggestion (desktop only) */}
              {nextRecipe && (
                <div className="hidden lg:block bg-white border-2 border-neutral-200 rounded-xl overflow-hidden shadow-sm print:hidden">
                  <div className="px-5 pt-5 pb-3">
                    <span className="text-[#F77313] text-xs font-medium uppercase tracking-widest">
                      Want to try?
                    </span>
                    <h3 className="font-display text-base mt-1 text-neutral-900">
                      Another recipe for you
                    </h3>
                  </div>
                  <Link href={`/en/recipe/${nextRecipe.slugEn || nextRecipe.slug}/`} className="group block">
                    {nextRecipe.featuredImage && (
                      <div className="relative aspect-[16/10] mx-5 rounded-lg overflow-hidden">
                        <Image
                          src={nextRecipe.featuredImage}
                          alt={nextRecipe.title}
                          fill
                          quality={85}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(min-width: 1024px) 350px, 300px"
                        />
                      </div>
                    )}
                    <div className="px-5 py-4">
                      <p className="text-sm font-semibold text-neutral-900 group-hover:text-[#F77313] transition-colors line-clamp-2">
                        {nextRecipe.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                        {nextRecipe.totalTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {nextRecipe.totalTime} min
                          </span>
                        )}
                        {nextRecipe.difficulty && (
                          <span className="capitalize">{nextRecipe.difficulty}</span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-[#F77313]">
                        View recipe
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Advertising CTA (desktop only, mobile version is after instructions) */}
              <div className="hidden lg:block bg-neutral-900 text-white p-5 rounded-xl print:hidden">
                <div className="text-center">
                  <span className="text-[#F77313] text-xs font-medium uppercase tracking-widest">
                    Partnership
                  </span>
                  <h3 className="font-display text-lg mt-2 mb-3">
                    Advertise on Menucochon?
                  </h3>
                  <p className="text-neutral-400 text-sm mb-4">
                    Reach thousands of Quebec cuisine enthusiasts.
                  </p>
                  <Link
                    href="/en/advertising"
                    className="inline-flex items-center gap-2 bg-[#F77313] text-white px-4 py-2 text-sm font-medium hover:bg-[#e56610] transition-colors rounded-lg"
                  >
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Amazon Suggestions based on recipe */}
              <div className="print:hidden">
                <RecipeAmazonSuggestions
                  recipeTitle={recipe.title}
                  ingredients={recipe.ingredients?.flatMap(g => g.items.map(i => typeof i === 'string' ? i : i.name)) || []}
                  category={recipe.categories?.[0]?.slug}
                  locale="en"
                  variant="sidebar"
                />
              </div>

              {/* 📍 4. Ad in sidebar (desktop only) */}
              <GoogleAd className="hidden lg:block print:hidden" />

              {/* Amazon Products - Generic Equipment */}
              <div className="print:hidden">
                <AmazonKitchenProducts
                  products={['thermometer', 'skillet', 'chefKnife']}
                  title="Recommended Equipment"
                  locale="en"
                  variant="sidebar"
                />
              </div>
            </aside>
          </div>
        </section>
        </article>

        {/* Similar recipes */}
        {similarRecipes.length > 0 && (
          <section className="bg-neutral-50 py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-[#F77313] text-xs font-medium uppercase tracking-widest">
                  Discover
                </span>
                <div className="w-12 h-0.5 bg-[#F77313]" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-black mb-10">
                Similar Recipes
              </h2>
              <RecipeSimilar recipes={similarRecipes} locale="en" />
            </div>
          </section>
        )}

        {/* Our Latest Articles */}
        {latestPosts.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-[#F77313] text-xs font-medium uppercase tracking-widest">
                  Blog
                </span>
                <div className="w-12 h-0.5 bg-[#F77313]" />
              </div>
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-display text-3xl md:text-4xl text-black">
                  Our Latest Articles
                </h2>
                <Link
                  href="/en/blog"
                  className="hidden md:flex items-center gap-1 text-sm text-[#F77313] hover:text-[#d45f0a] transition-colors"
                >
                  View all articles
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/en/blog/${post.slug}/`}
                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {post.featuredImage && (
                      <div className="relative aspect-video">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {post.categories.length > 0 && (
                        <span className="text-xs font-medium text-[#F77313] uppercase tracking-wider">
                          {post.categories[0].name}
                        </span>
                      )}
                      <h3 className="font-medium text-black group-hover:text-[#F77313] transition-colors line-clamp-2 mt-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-3 text-xs text-neutral-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/en/blog"
                className="md:hidden flex items-center justify-center gap-1 mt-6 text-sm text-[#F77313] hover:text-[#d45f0a] transition-colors"
              >
                View all articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
