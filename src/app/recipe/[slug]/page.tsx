import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Clock, Users, Flame, ChefHat, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

interface IngredientItem {
  quantity: string;
  unit: string;
  name: string;
  note?: string;
}

interface IngredientGroup {
  title: string;
  items: IngredientItem[];
}

interface InstructionStep {
  step: number;
  title: string;
  content: string;
  tip?: string;
}

interface Nutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface Recipe {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  introduction: string | null;
  conclusion: string | null;
  featured_image: string | null;
  prep_time: number;
  cook_time: number;
  rest_time: number | null;
  total_time: number;
  servings: number;
  servings_unit: string | null;
  difficulty: string;
  cuisine: string | null;
  ingredients: IngredientGroup[];
  instructions: InstructionStep[];
  nutrition: Nutrition | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  author: string;
}

async function getRecipe(slug: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as unknown as Recipe;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    return { title: 'Recipe not found' };
  }

  return {
    title: recipe.seo_title || recipe.title,
    description: recipe.seo_description || recipe.excerpt,
    openGraph: {
      title: recipe.title,
      description: recipe.excerpt,
      images: recipe.featured_image ? [{ url: recipe.featured_image }] : [],
      type: 'article',
    },
  };
}

const difficultyColor: Record<string, string> = {
  easy: 'text-[#00bf63]',
  medium: 'text-yellow-500',
  hard: 'text-red-500',
};

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    notFound();
  }

  const ingredients = (recipe.ingredients || []) as IngredientGroup[];
  const instructions = (recipe.instructions || []) as InstructionStep[];
  const nutrition = recipe.nutrition as Nutrition | null;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <header className="relative bg-black">
        {/* Mobile */}
        <div className="lg:hidden relative h-[50vh]">
          {recipe.featured_image ? (
            <Image
              src={recipe.featured_image}
              alt={recipe.title}
              fill
              quality={100}
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <Link href="/recipe" className="inline-flex items-center gap-1.5 text-white/60 text-sm mb-3 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Recipes
            </Link>
            <h1 className="font-display text-3xl tracking-wide text-white mb-3">
              {recipe.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              {recipe.total_time > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {recipe.total_time} min
                </span>
              )}
              {recipe.servings > 0 && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {recipe.servings} {recipe.servings_unit || 'servings'}
                </span>
              )}
              {recipe.difficulty && (
                <span className={`flex items-center gap-1.5 font-bold uppercase tracking-wider ${difficultyColor[recipe.difficulty] || 'text-white/70'}`}>
                  <Flame className="w-4 h-4" /> {recipe.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop: split layout */}
        <div className="hidden lg:flex relative min-h-[50vh]">
          <div className="relative flex-1 bg-neutral-950 flex items-center">
            <div className="relative z-10 pl-[max(2rem,calc((100vw-1280px)/2+1rem))] pr-16 py-16">
              <Link href="/recipe" className="inline-flex items-center gap-1.5 text-white/50 text-sm mb-4 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> All Recipes
              </Link>
              <h1 className="font-display text-4xl xl:text-5xl tracking-wide text-white mb-6">
                {recipe.title}
              </h1>
              {recipe.excerpt && (
                <p className="text-white/60 text-lg max-w-lg leading-relaxed mb-6">
                  {recipe.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                {recipe.prep_time > 0 && (
                  <div className="text-center">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Prep</p>
                    <p className="text-white font-bold text-lg">{recipe.prep_time}<span className="text-sm font-normal text-white/50"> min</span></p>
                  </div>
                )}
                {recipe.cook_time > 0 && (
                  <div className="text-center">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Cook</p>
                    <p className="text-white font-bold text-lg">{recipe.cook_time}<span className="text-sm font-normal text-white/50"> min</span></p>
                  </div>
                )}
                {recipe.total_time > 0 && (
                  <div className="text-center">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Total</p>
                    <p className="text-[#00bf63] font-bold text-lg">{recipe.total_time}<span className="text-sm font-normal text-[#00bf63]/60"> min</span></p>
                  </div>
                )}
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Servings</p>
                  <p className="text-white font-bold text-lg">{recipe.servings}</p>
                </div>
                <div className="text-center">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Difficulty</p>
                  <p className={`font-bold text-lg uppercase ${difficultyColor[recipe.difficulty] || 'text-white'}`}>{recipe.difficulty}</p>
                </div>
              </div>
            </div>
          </div>
          {recipe.featured_image && (
            <div className="relative w-[45%]">
              <Image
                src={recipe.featured_image}
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

      {/* Introduction */}
      {recipe.introduction && (
        <section className="container mx-auto px-4 pt-10 md:pt-16">
          <div className="max-w-3xl mx-auto lg:mx-0 border-l-4 border-[#00bf63] pl-6 py-2">
            <div className="text-neutral-600 text-lg leading-relaxed whitespace-pre-line">
              {recipe.introduction}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left: Instructions */}
          <div className="lg:col-span-2 space-y-12">
            {/* Ingredients - mobile only */}
            <div className="lg:hidden bg-neutral-900 text-white rounded-xl p-6">
              <h2 className="font-display text-2xl tracking-wide mb-6 flex items-center gap-3">
                <ChefHat className="w-6 h-6 text-[#00bf63]" /> Ingredients
              </h2>
              {ingredients.map((group, gi) => (
                <div key={gi} className="mb-6 last:mb-0">
                  {group.title && (
                    <h3 className="text-[#00bf63] text-sm font-bold uppercase tracking-wider mb-3">{group.title}</h3>
                  )}
                  <ul className="space-y-2">
                    {group.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-2 text-white/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00bf63] mt-2 flex-shrink-0" />
                        <span>
                          <strong className="text-white">{item.quantity} {item.unit}</strong> {item.name}
                          {item.note && <span className="text-white/50 text-sm"> ({item.note})</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div>
              <h2 className="font-display text-3xl tracking-wide text-neutral-900 mb-8">
                Instructions
              </h2>
              <div className="space-y-8">
                {instructions.map((step) => (
                  <div key={step.step} className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00bf63] text-white font-bold flex items-center justify-center text-lg">
                      {step.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-bold text-lg text-neutral-900 mb-2">{step.title}</h3>
                      <p className="text-neutral-600 leading-relaxed">{step.content}</p>
                      {step.tip && (
                        <div className="mt-3 bg-[#00bf63]/10 border-l-3 border-[#00bf63] px-4 py-3 rounded-r-lg">
                          <p className="text-sm text-neutral-700"><strong className="text-[#00bf63]">Pro tip:</strong> {step.tip}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {recipe.content && (
              <div className="bg-neutral-900 text-white p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">💡</span>
                  <h2 className="font-display text-2xl tracking-wide">Tips & Tricks</h2>
                </div>
                <div className="text-white/80 leading-relaxed whitespace-pre-line">
                  {recipe.content}
                </div>
              </div>
            )}

            {/* Conclusion */}
            {recipe.conclusion && (
              <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200">
                <h2 className="font-display text-2xl tracking-wide text-neutral-900 mb-4">
                  Serving Suggestions
                </h2>
                <div className="text-neutral-600 leading-relaxed whitespace-pre-line">
                  {recipe.conclusion}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            {/* Ingredients - desktop */}
            <div className="hidden lg:block bg-white border-2 border-neutral-200 rounded-xl p-6">
              <h2 className="font-display text-xl tracking-wide mb-6 flex items-center gap-3">
                <ChefHat className="w-5 h-5 text-[#00bf63]" /> Ingredients
              </h2>
              <p className="text-sm text-neutral-500 mb-4 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {recipe.servings} {recipe.servings_unit || 'servings'}
              </p>
              {ingredients.map((group, gi) => (
                <div key={gi} className="mb-5 last:mb-0">
                  {group.title && (
                    <h3 className="text-[#00bf63] text-xs font-bold uppercase tracking-wider mb-2">{group.title}</h3>
                  )}
                  <ul className="space-y-2">
                    {group.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-2 text-neutral-600 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00bf63] mt-1.5 flex-shrink-0" />
                        <span>
                          <strong className="text-neutral-900">{item.quantity} {item.unit}</strong> {item.name}
                          {item.note && <span className="text-neutral-400"> ({item.note})</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Nutrition */}
              {nutrition && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Nutrition per serving</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {nutrition.calories !== undefined && (
                      <div className="bg-neutral-50 p-2.5 rounded-lg text-center">
                        <p className="text-lg font-bold text-neutral-900">{nutrition.calories}</p>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400">Calories</p>
                      </div>
                    )}
                    {nutrition.protein !== undefined && (
                      <div className="bg-neutral-50 p-2.5 rounded-lg text-center">
                        <p className="text-lg font-bold text-neutral-900">{nutrition.protein}g</p>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400">Protein</p>
                      </div>
                    )}
                    {nutrition.fat !== undefined && (
                      <div className="bg-neutral-50 p-2.5 rounded-lg text-center">
                        <p className="text-lg font-bold text-neutral-900">{nutrition.fat}g</p>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400">Fat</p>
                      </div>
                    )}
                    {nutrition.carbs !== undefined && (
                      <div className="bg-neutral-50 p-2.5 rounded-lg text-center">
                        <p className="text-lg font-bold text-neutral-900">{nutrition.carbs}g</p>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400">Carbs</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
