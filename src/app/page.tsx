import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Clock, Flame, ArrowRight, ChefHat, BookOpen } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Fresh N' Grill | BBQ Recipes & Grilling Tips",
  description: 'Discover our collection of BBQ recipes, grilling tips, and outdoor cooking ideas. Fire up the grill!',
};

const difficultyColor: Record<string, string> = {
  easy: 'bg-[#00bf63]',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
};

interface Recipe {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  total_time: number;
  difficulty: string;
}

async function getLatestRecipes(): Promise<Recipe[]> {
  const { data } = await supabase
    .from('recipes')
    .select('id, slug, title, excerpt, featured_image, total_time, difficulty')
    .order('published_at', { ascending: false })
    .limit(10) as { data: Recipe[] | null };

  return data || [];
}

export default async function HomePage() {
  const recipes = await getLatestRecipes();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80"
          alt="BBQ grill with flames"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <p className="text-[#00bf63] font-bold uppercase tracking-[0.3em] text-sm md:text-base mb-4">
            Fire Up The Grill
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wide text-white mb-6">
            For BBQ Lovers
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Master the art of grilling with our curated collection of BBQ recipes,
            from smoky ribs to perfectly seared steaks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recipe"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00bf63] text-white font-bold uppercase tracking-wider rounded-lg hover:bg-[#00a855] transition-colors text-sm"
            >
              <ChefHat className="w-5 h-5" />
              Browse Recipes
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold uppercase tracking-wider rounded-lg hover:bg-white/20 transition-colors border border-white/20 text-sm"
            >
              <BookOpen className="w-5 h-5" />
              Read the Blog
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Latest Recipes */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#00bf63] font-bold uppercase tracking-wider text-sm mb-2">Fresh Off The Grill</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-neutral-900">
              Latest Recipes
            </h2>
          </div>
          <Link
            href="/recipe"
            className="hidden sm:inline-flex items-center gap-2 text-[#00bf63] font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipe/${recipe.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                {recipe.featured_image ? (
                  <Image
                    src={recipe.featured_image}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {recipe.difficulty && (
                    <span className={`${difficultyColor[recipe.difficulty] || 'bg-neutral-500'} text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded`}>
                      {recipe.difficulty}
                    </span>
                  )}
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-3 left-3 right-3">
                  {recipe.total_time > 0 && (
                    <span className="inline-flex items-center gap-1 text-white/80 text-xs mb-2">
                      <Clock className="w-3 h-3" /> {recipe.total_time} min
                    </span>
                  )}
                  <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-[#00bf63] transition-colors">
                    {recipe.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/recipe"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-neutral-800 transition-colors"
          >
            View All Recipes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950" />
        <Image
          src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1920&q=60"
          alt="Smoky BBQ"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-[#00bf63] font-bold uppercase tracking-wider text-sm mb-4">
            From Our Kitchen
          </p>
          <h2 className="font-display text-3xl md:text-5xl tracking-wide text-white mb-6">
            Tips, Tricks & Stories
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Dive into our blog for in-depth grilling guides, meat selection tips,
            sauce recipes, and stories from the pit.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#00bf63] text-white font-bold uppercase tracking-wider rounded-lg hover:bg-[#00a855] transition-colors text-sm"
          >
            <BookOpen className="w-5 h-5" />
            Explore the Blog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
