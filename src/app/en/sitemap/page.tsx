import { Metadata } from 'next';
import Link from 'next/link';
import { getAllRecipes, getAllEnglishRecipeSlugs, getAllCategorySlugs } from '@/lib/recipes';
import { getAllPosts } from '@/lib/posts';
import { getAllTermsEn } from '@/lib/lexiqueEn';
import { createClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Sitemap | Menucochon',
  description: 'Explore all pages of Menucochon: recipes, categories, blog, buying guide, spices, culinary lexicon and more.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryInfo {
  slug: string;
  name: string;
}

interface SpiceData {
  slug: string;
  name_en: string | null;
}

const categoryNames: Record<string, string> = {
  'entrees': 'Starters',
  'plats-principaux': 'Main Dishes',
  'desserts': 'Desserts',
  'vegetarien': 'Vegetarian',
  'soupes': 'Soups',
  'salades': 'Salads',
  'collations': 'Snacks',
  'boissons': 'Drinks',
  'petit-dejeuner': 'Breakfast',
  'accompagnements': 'Side Dishes',
  'sauces': 'Sauces',
  'pates-et-pizzas': 'Pasta & Pizza',
  'fruits-de-mer': 'Seafood',
  'viandes': 'Meat',
  'volailles': 'Poultry',
};

export default async function SitemapPage() {
  const supabase = await createClient();

  const [englishRecipeSlugs, categorySlugs, posts, lexiqueTerms] = await Promise.all([
    getAllEnglishRecipeSlugs(),
    getAllCategorySlugs(),
    getAllPosts(),
    getAllTermsEn(),
  ]);

  const { data: spicesData } = await supabase
    .from('spices')
    .select('slug, name_en')
    .eq('is_published', true)
    .order('name_en');

  const spices = (spicesData || []) as SpiceData[];

  // Separate blog and buying guide posts
  const guideAchatPosts = posts.filter((post) =>
    post.categories?.some((cat) => cat.slug === 'guide-achat')
  );
  const blogPosts = posts.filter((post) =>
    !post.categories?.some((cat) => cat.slug === 'guide-achat')
  );

  // Group lexicon terms by letter
  const lexiqueByLetter = lexiqueTerms.reduce((acc, term) => {
    const letter = term.letter.toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {} as Record<string, typeof lexiqueTerms>);

  const categories: CategoryInfo[] = categorySlugs.map(slug => ({
    slug,
    name: categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
  }));

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-display text-center mb-4">Sitemap</h1>
      <p className="text-neutral-600 text-center mb-12">
        Explore all sections of Menucochon
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Main Pages */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">Main Pages</h2>
          <ul className="space-y-2">
            <li><Link href="/en" className="text-neutral-700 hover:text-[#F77313] transition-colors">Home</Link></li>
            <li><Link href="/en/recipe" className="text-neutral-700 hover:text-[#F77313] transition-colors">All Recipes</Link></li>
            <li><Link href="/en/blog" className="text-neutral-700 hover:text-[#F77313] transition-colors">Blog</Link></li>
            <li><Link href="/en/buying-guide" className="text-neutral-700 hover:text-[#F77313] transition-colors">Buying Guide</Link></li>
            <li><Link href="/en/spices" className="text-neutral-700 hover:text-[#F77313] transition-colors">Spice Route</Link></li>
            <li><Link href="/en/lexicon" className="text-neutral-700 hover:text-[#F77313] transition-colors">Culinary Lexicon</Link></li>
            <li><Link href="/en/videos" className="text-neutral-700 hover:text-[#F77313] transition-colors">Videos</Link></li>
            <li><Link href="/en/store" className="text-neutral-700 hover:text-[#F77313] transition-colors">Store</Link></li>
          </ul>
        </section>

        {/* Categories */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">Recipe Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/en/category/${cat.slug}`}
                  className="text-neutral-700 hover:text-[#F77313] transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Tools */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">Practical Tools</h2>
          <ul className="space-y-2">
            <li><Link href="/en/frigo" className="text-neutral-700 hover:text-[#F77313] transition-colors">Magic Fridge</Link></li>
            <li><Link href="/en/search" className="text-neutral-700 hover:text-[#F77313] transition-colors">Search</Link></li>
            <li><Link href="/en/converter" className="text-neutral-700 hover:text-[#F77313] transition-colors">Converter</Link></li>
            <li><Link href="/en/converter/celsius-fahrenheit" className="text-neutral-700 hover:text-[#F77313] transition-colors">Celsius ↔ Fahrenheit</Link></li>
            <li><Link href="/en/converter/meter-feet" className="text-neutral-700 hover:text-[#F77313] transition-colors">Meter ↔ Feet</Link></li>
            <li><Link href="/en/converter/timer" className="text-neutral-700 hover:text-[#F77313] transition-colors">Timer</Link></li>
          </ul>
        </section>

        {/* Information */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">Information</h2>
          <ul className="space-y-2">
            <li><Link href="/en/about" className="text-neutral-700 hover:text-[#F77313] transition-colors">About</Link></li>
            <li><Link href="/en/contact" className="text-neutral-700 hover:text-[#F77313] transition-colors">Contact</Link></li>
            <li><Link href="/en/privacy" className="text-neutral-700 hover:text-[#F77313] transition-colors">Privacy</Link></li>
            <li><Link href="/en/terms" className="text-neutral-700 hover:text-[#F77313] transition-colors">Terms of Use</Link></li>
            <li><Link href="/en/profile/submit-recipe" className="text-neutral-700 hover:text-[#F77313] transition-colors">Submit a Recipe</Link></li>
          </ul>
        </section>

        {/* RSS Feeds */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">RSS Feeds</h2>
          <ul className="space-y-2">
            <li><a href="/en/rss/recipes" className="text-neutral-700 hover:text-[#F77313] transition-colors">RSS Recipes</a></li>
            <li><a href="/en/rss/blog" className="text-neutral-700 hover:text-[#F77313] transition-colors">RSS Blog</a></li>
            <li><a href="/rss/guide-achat" className="text-neutral-700 hover:text-[#F77313] transition-colors">RSS Buying Guide</a></li>
            <li><a href="/rss/epices" className="text-neutral-700 hover:text-[#F77313] transition-colors">RSS Spices</a></li>
            <li><a href="/rss/lexique" className="text-neutral-700 hover:text-[#F77313] transition-colors">RSS Lexicon</a></li>
            <li><a href="/sitemap.xml" className="text-neutral-700 hover:text-[#F77313] transition-colors">Sitemap XML</a></li>
          </ul>
        </section>

        {/* French Version */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">Version française</h2>
          <ul className="space-y-2">
            <li><Link href="/" className="text-neutral-700 hover:text-[#F77313] transition-colors">Accueil</Link></li>
            <li><Link href="/recette" className="text-neutral-700 hover:text-[#F77313] transition-colors">Toutes les recettes</Link></li>
            <li><Link href="/blog" className="text-neutral-700 hover:text-[#F77313] transition-colors">Blog</Link></li>
            <li><Link href="/guide-achat" className="text-neutral-700 hover:text-[#F77313] transition-colors">Guide d&apos;achat</Link></li>
            <li><Link href="/epices" className="text-neutral-700 hover:text-[#F77313] transition-colors">La Route des Épices</Link></li>
            <li><Link href="/lexique" className="text-neutral-700 hover:text-[#F77313] transition-colors">Lexique culinaire</Link></li>
          </ul>
        </section>
      </div>

      {/* Recipes */}
      <section className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-2xl font-display text-[#F77313] mb-6">Recipes ({englishRecipeSlugs.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {englishRecipeSlugs.slice(0, 100).map((recipe) => (
            <Link
              key={recipe.slugEn}
              href={`/en/recipe/${recipe.slugEn}`}
              className="text-sm text-neutral-700 hover:text-[#F77313] transition-colors truncate"
              title={recipe.slugEn.replace(/-/g, ' ')}
            >
              {recipe.slugEn.replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
        {englishRecipeSlugs.length > 100 && (
          <p className="mt-4 text-neutral-500 text-sm">
            And {englishRecipeSlugs.length - 100} more recipes...{' '}
            <Link href="/en/recipe" className="text-[#F77313] hover:underline">View all recipes</Link>
          </p>
        )}
      </section>

      {/* Buying Guide */}
      <section className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-2xl font-display text-[#F77313] mb-6">Buying Guide ({guideAchatPosts.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {guideAchatPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/en/buying-guide/${post.slug}`}
              className="text-sm text-neutral-700 hover:text-[#F77313] transition-colors truncate"
              title={post.title}
            >
              {post.title}
            </Link>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-2xl font-display text-[#F77313] mb-6">Blog Articles ({blogPosts.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {blogPosts.slice(0, 50).map((post) => (
            <Link
              key={post.slug}
              href={`/en/blog/${post.slug}`}
              className="text-sm text-neutral-700 hover:text-[#F77313] transition-colors truncate"
              title={post.title}
            >
              {post.title}
            </Link>
          ))}
        </div>
        {blogPosts.length > 50 && (
          <p className="mt-4 text-neutral-500 text-sm">
            And {blogPosts.length - 50} more articles...{' '}
            <Link href="/en/blog" className="text-[#F77313] hover:underline">View all articles</Link>
          </p>
        )}
      </section>

      {/* Spices */}
      {spices.length > 0 && (
        <section className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-2xl font-display text-[#F77313] mb-6">Spice Route ({spices.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {spices.map((spice) => (
              <Link
                key={spice.slug}
                href={`/en/spices/${spice.slug}`}
                className="text-sm text-neutral-700 hover:text-[#F77313] transition-colors truncate"
                title={spice.name_en || spice.slug}
              >
                {spice.name_en || spice.slug}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lexicon */}
      <section className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-2xl font-display text-[#F77313] mb-6">Culinary Lexicon ({lexiqueTerms.length})</h2>
        <div className="space-y-4">
          {Object.entries(lexiqueByLetter).sort().map(([letter, terms]) => (
            <div key={letter}>
              <h3 className="font-display text-lg text-neutral-800 mb-2">{letter}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {terms.map((term) => (
                  <Link
                    key={term.slug}
                    href={`/en/lexicon/${term.slug}`}
                    className="text-sm text-neutral-700 hover:text-[#F77313] transition-colors"
                  >
                    {term.term}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
