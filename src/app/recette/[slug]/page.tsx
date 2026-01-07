import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  getAllRecipeSlugs,
  getSimilarRecipes,
  getRecipeBySlugWithLocale,
  getNextRecipe,
} from '@/lib/recipes';
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
import SetLanguageSlugs from '@/components/SetLanguageSlugs';
import AmazonKitchenProducts from '@/components/amazon/AmazonKitchenProducts';
import RecipeAmazonSuggestions from '@/components/amazon/RecipeAmazonSuggestions';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import NextRecipe from '@/components/recipe/NextRecipe';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Utiliser getRecipeBySlugWithLocale pour obtenir les données FR et le slug anglais
  const recipe = await getRecipeBySlugWithLocale(slug, 'fr');

  if (!recipe) {
    return {
      title: 'Recette non trouvée',
    };
  }

  // Slug anglais pour hreflang (si disponible)
  const enSlug = recipe.slugEn || slug;

  // Meta description optimisée (155-160 caractères)
  const metaDescription = optimizeMetaDescription(
    recipe.seoDescription || recipe.excerpt,
    `Découvrez notre recette de ${recipe.title}. Instructions faciles, ingrédients simples.`
  );

  return {
    title: recipe.seoTitle || `${recipe.title} | Menucochon`,
    description: metaDescription,
    alternates: {
      canonical: `/recette/${slug}/`,
      languages: {
        'fr-CA': `/recette/${slug}/`,
        'en-CA': `/en/recipe/${enSlug}/`,
      },
    },
    openGraph: {
      title: recipe.title,
      description: recipe.excerpt,
      images: recipe.featuredImage
        ? [{ url: recipe.featuredImage, width: 1200, height: 630, alt: recipe.title }]
        : [],
      type: 'article',
      url: `/recette/${slug}/`,
      siteName: 'Menucochon',
      locale: 'fr_CA',
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

export default async function RecettePage({ params }: Props) {
  const { slug } = await params;
  // Utiliser getRecipeBySlugWithLocale pour obtenir les slugs traduits
  const recipe = await getRecipeBySlugWithLocale(slug, 'fr');

  if (!recipe) {
    notFound();
  }

  const [similarRecipes, nextRecipe] = await Promise.all([
    getSimilarRecipes(recipe, 4),
    getNextRecipe(recipe, 'fr'),
  ]);

  const breadcrumbs = [
    { name: 'Accueil', url: '/' },
    { name: 'Recettes', url: '/recette' },
    ...(recipe.categories?.[0] ? [{ name: recipe.categories[0].name, url: `/categorie/${recipe.categories[0].slug}` }] : []),
    { name: recipe.title, url: `/recette/${slug}/` },
  ];

  return (
    <>
      <SetLanguageSlugs slugFr={recipe.slugFr || recipe.slug} slugEn={recipe.slugEn} />
      <RecipeSchema recipe={recipe} />
      <BreadcrumbSchema items={breadcrumbs} />

      <main className="min-h-screen bg-white">
        <article>
        {/* Hero Image - Optimisé mobile */}
        <header className="relative h-[55vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh]">
          {recipe.featuredImage ? (
            <Image
              src={recipe.featuredImage}
              alt={recipe.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

          {/* Header superposé - padding réduit sur mobile */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-12">
            <div className="container mx-auto">
              <RecipeHeader recipe={recipe} />
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-16">
              {/* Introduction */}
              {recipe.introduction && (
                <div className="relative pl-8 border-l-4 border-[#F77313] bg-gradient-to-r from-neutral-100 to-transparent py-6 -ml-4 pl-12">
                  <div
                    className="recipe-introduction"
                    dangerouslySetInnerHTML={{ __html: recipe.introduction }}
                  />
                </div>
              )}

              {/* Description/Excerpt (si pas d'introduction et excerpt non tronqué) */}
              {!recipe.introduction && recipe.excerpt && !recipe.excerpt.endsWith('...') && (
                <div className="relative pl-8 border-l-4 border-[#F77313] bg-gradient-to-r from-neutral-100 to-transparent py-6 -ml-4 pl-12">
                  <p className="recipe-introduction">
                    {recipe.excerpt}
                  </p>
                </div>
              )}

              {/* Ad après introduction */}
              <GoogleAd slot="7610644087" className="my-8 print:hidden" />

              {/* Instructions */}
              <RecipeInstructions instructions={recipe.instructions} />

              {/* Conclusion */}
              {recipe.conclusion && (
                <div className="bg-neutral-50 p-8 md:p-10 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-[#F77313]/10 rounded-full flex items-center justify-center">
                      <span className="text-xl">✨</span>
                    </div>
                    <h2 className="font-display text-2xl tracking-wide text-black">
                      Pour conclure
                    </h2>
                    <div className="flex-1 h-px bg-neutral-300" />
                  </div>
                  <div
                    className="recipe-conclusion"
                    dangerouslySetInnerHTML={{ __html: recipe.conclusion }}
                  />
                </div>
              )}

              {/* Astuces / Tips */}
              {recipe.content && (
                <div className="bg-gradient-to-br from-neutral-900 to-black p-8 md:p-10 rounded-lg shadow-2xl">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#F77313] to-[#d45f0a] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl">💡</span>
                    </div>
                    <div>
                      <h2 className="font-display text-2xl tracking-wide text-white">
                        Nos astuces
                      </h2>
                      <p className="text-white/40 text-sm mt-1">Conseils du chef pour réussir cette recette</p>
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

              {/* Ad avant FAQ */}
              <GoogleAd slot="7610644087" className="my-8 print:hidden" />

              {/* FAQ */}
              {recipe.faq && (
                <RecipeFAQ faq={recipe.faq} />
              )}

              {/* Rating */}
              <div className="bg-neutral-50 p-8 rounded-lg text-center">
                <h3 className="font-display text-xl mb-4">Vous avez essayé cette recette?</h3>
                <RecipeRating
                  recipeId={recipe.id}
                  recipeSlug={recipe.slug}
                  locale="fr"
                />
              </div>

              {/* Commentaires */}
              <div className="mt-12">
                <RecipeComments recipeId={recipe.id} slug={recipe.slug} />
              </div>

              {/* Video */}
              {recipe.videoUrl && (
                <div className="aspect-video overflow-hidden">
                  <iframe
                    src={recipe.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                    title={`Vidéo: ${recipe.title}`}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Ingrédients + Nutrition collés ensemble */}
              <div>
                <RecipeIngredients
                  ingredients={recipe.ingredients}
                  servings={recipe.servings}
                  servingsUnit={recipe.servingsUnit}
                />
                {recipe.nutrition && (
                  <RecipeNutrition nutrition={recipe.nutrition} />
                )}
              </div>

              {/* Amazon Suggestions dynamiques basées sur la recette */}
              <div className="print:hidden">
                <RecipeAmazonSuggestions
                  recipeTitle={recipe.title}
                  ingredients={recipe.ingredients?.flatMap(g => g.items.map(i => typeof i === 'string' ? i : i.name)) || []}
                  category={recipe.categories?.[0]?.slug}
                  locale="fr"
                  variant="sidebar"
                />
              </div>

              {/* Amazon Products - Équipement générique */}
              <div className="print:hidden">
                <AmazonKitchenProducts
                  products={['thermometer', 'skillet', 'chefKnife']}
                  title="Équipement recommandé"
                  locale="fr"
                  variant="sidebar"
                />
              </div>

              {/* Ad dans sidebar */}
              <GoogleAd slot="7610644087" className="print:hidden" />
            </aside>
          </div>
        </section>
        </article>

        {/* Prochaine recette */}
        {nextRecipe && <NextRecipe recipe={nextRecipe} locale="fr" />}

        {/* Recettes similaires */}
        {similarRecipes.length > 0 && (
          <section className="bg-neutral-50 py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-[#F77313] text-xs font-medium uppercase tracking-widest">
                  À découvrir
                </span>
                <div className="w-12 h-0.5 bg-[#F77313]" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-black mb-10">
                Recettes similaires
              </h2>
              <RecipeSimilar recipes={similarRecipes} />
            </div>
          </section>
        )}
      </main>
    </>
  );
}
