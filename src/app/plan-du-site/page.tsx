import { Metadata } from 'next';
import Link from 'next/link';
import { getAllRecipes, getAllCategorySlugs } from '@/lib/recipes';
import { getAllPosts } from '@/lib/posts';
import { getAllTerms } from '@/lib/lexique';
import { createClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Plan du site | Menucochon',
  description: 'Explorez toutes les pages de Menucochon: recettes, catégories, blog, guide d\'achat, épices, lexique culinaire et plus encore.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryInfo {
  slug: string;
  name: string;
}

interface SpiceData {
  slug: string;
  name_fr: string | null;
}

const categoryNames: Record<string, string> = {
  'entrees': 'Entrées',
  'plats-principaux': 'Plats principaux',
  'desserts': 'Desserts',
  'vegetarien': 'Végétarien',
  'soupes': 'Soupes et potages',
  'salades': 'Salades',
  'collations': 'Collations',
  'boissons': 'Boissons',
  'petit-dejeuner': 'Petit-déjeuner',
  'accompagnements': 'Accompagnements',
  'sauces': 'Sauces',
  'pates-et-pizzas': 'Pâtes et pizzas',
  'fruits-de-mer': 'Fruits de mer',
  'viandes': 'Viandes',
  'volailles': 'Volailles',
};

export default async function SitemapPage() {
  const supabase = await createClient();

  const [recipes, categorySlugs, posts, lexiqueTerms] = await Promise.all([
    getAllRecipes(),
    getAllCategorySlugs(),
    getAllPosts(),
    getAllTerms('fr'),
  ]);

  const { data: spicesData } = await supabase
    .from('spices')
    .select('slug, name_fr')
    .eq('is_published', true)
    .order('name_fr');

  const spices = (spicesData || []) as SpiceData[];

  // Séparer les posts blog et guide d'achat
  const guideAchatPosts = posts.filter((post) =>
    post.categories?.some((cat) => cat.slug === 'guide-achat')
  );
  const blogPosts = posts.filter((post) =>
    !post.categories?.some((cat) => cat.slug === 'guide-achat')
  );

  // Grouper les termes du lexique par lettre
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
      <h1 className="text-4xl font-display text-center mb-4">Plan du site</h1>
      <p className="text-neutral-600 text-center mb-12">
        Explorez toutes les sections de Menucochon
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Pages principales */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">Pages principales</h2>
          <ul className="space-y-2">
            <li><Link href="/" className="text-neutral-700 hover:text-[#F77313] transition-colors">Accueil</Link></li>
            <li><Link href="/recette" className="text-neutral-700 hover:text-[#F77313] transition-colors">Toutes les recettes</Link></li>
            <li><Link href="/blog" className="text-neutral-700 hover:text-[#F77313] transition-colors">Blog</Link></li>
            <li><Link href="/guide-achat" className="text-neutral-700 hover:text-[#F77313] transition-colors">Guide d&apos;achat</Link></li>
            <li><Link href="/epices" className="text-neutral-700 hover:text-[#F77313] transition-colors">La Route des Épices</Link></li>
            <li><Link href="/lexique" className="text-neutral-700 hover:text-[#F77313] transition-colors">Lexique culinaire</Link></li>
            <li><Link href="/videos" className="text-neutral-700 hover:text-[#F77313] transition-colors">Vidéos</Link></li>
            <li><Link href="/boutique" className="text-neutral-700 hover:text-[#F77313] transition-colors">Boutique</Link></li>
          </ul>
        </section>

        {/* Catégories */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">Catégories de recettes</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/categorie/${cat.slug}`}
                  className="text-neutral-700 hover:text-[#F77313] transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Outils */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">Outils pratiques</h2>
          <ul className="space-y-2">
            <li><Link href="/frigo" className="text-neutral-700 hover:text-[#F77313] transition-colors">Frigo magique</Link></li>
            <li><Link href="/recherche" className="text-neutral-700 hover:text-[#F77313] transition-colors">Recherche</Link></li>
            <li><Link href="/convertisseur" className="text-neutral-700 hover:text-[#F77313] transition-colors">Convertisseur</Link></li>
            <li><Link href="/convertisseur/celsius-fahrenheit" className="text-neutral-700 hover:text-[#F77313] transition-colors">Celsius ↔ Fahrenheit</Link></li>
            <li><Link href="/convertisseur/metre-pied" className="text-neutral-700 hover:text-[#F77313] transition-colors">Mètre ↔ Pied</Link></li>
            <li><Link href="/convertisseur/minuterie" className="text-neutral-700 hover:text-[#F77313] transition-colors">Minuterie</Link></li>
          </ul>
        </section>

        {/* Informations */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">Informations</h2>
          <ul className="space-y-2">
            <li><Link href="/a-propos" className="text-neutral-700 hover:text-[#F77313] transition-colors">À propos</Link></li>
            <li><Link href="/contact" className="text-neutral-700 hover:text-[#F77313] transition-colors">Contact</Link></li>
            <li><Link href="/confidentialite" className="text-neutral-700 hover:text-[#F77313] transition-colors">Confidentialité</Link></li>
            <li><Link href="/conditions-utilisation" className="text-neutral-700 hover:text-[#F77313] transition-colors">Conditions d&apos;utilisation</Link></li>
            <li><Link href="/profil/soumettre-recette" className="text-neutral-700 hover:text-[#F77313] transition-colors">Soumettre une recette</Link></li>
          </ul>
        </section>

        {/* Flux RSS */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">Flux RSS</h2>
          <ul className="space-y-2">
            <li><a href="/rss/recettes" className="text-neutral-700 hover:text-[#F77313] transition-colors">RSS Recettes</a></li>
            <li><a href="/rss/blog" className="text-neutral-700 hover:text-[#F77313] transition-colors">RSS Blog</a></li>
            <li><a href="/rss/guide-achat" className="text-neutral-700 hover:text-[#F77313] transition-colors">RSS Guide d&apos;achat</a></li>
            <li><a href="/rss/epices" className="text-neutral-700 hover:text-[#F77313] transition-colors">RSS Épices</a></li>
            <li><a href="/rss/lexique" className="text-neutral-700 hover:text-[#F77313] transition-colors">RSS Lexique</a></li>
            <li><a href="/sitemap.xml" className="text-neutral-700 hover:text-[#F77313] transition-colors">Sitemap XML</a></li>
          </ul>
        </section>

        {/* English Version */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-xl font-display text-[#F77313] mb-4">English Version</h2>
          <ul className="space-y-2">
            <li><Link href="/en" className="text-neutral-700 hover:text-[#F77313] transition-colors">Home</Link></li>
            <li><Link href="/en/recipe" className="text-neutral-700 hover:text-[#F77313] transition-colors">All Recipes</Link></li>
            <li><Link href="/en/blog" className="text-neutral-700 hover:text-[#F77313] transition-colors">Blog</Link></li>
            <li><Link href="/en/buying-guide" className="text-neutral-700 hover:text-[#F77313] transition-colors">Buying Guide</Link></li>
            <li><Link href="/en/spices" className="text-neutral-700 hover:text-[#F77313] transition-colors">Spice Route</Link></li>
            <li><Link href="/en/lexicon" className="text-neutral-700 hover:text-[#F77313] transition-colors">Culinary Lexicon</Link></li>
          </ul>
        </section>
      </div>

      {/* Recettes récentes */}
      <section className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-2xl font-display text-[#F77313] mb-6">Recettes ({recipes.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {recipes.slice(0, 100).map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/recette/${recipe.slug}`}
              className="text-sm text-neutral-700 hover:text-[#F77313] transition-colors truncate"
              title={recipe.title}
            >
              {recipe.title}
            </Link>
          ))}
        </div>
        {recipes.length > 100 && (
          <p className="mt-4 text-neutral-500 text-sm">
            Et {recipes.length - 100} autres recettes...{' '}
            <Link href="/recette" className="text-[#F77313] hover:underline">Voir toutes les recettes</Link>
          </p>
        )}
      </section>

      {/* Guide d'achat */}
      <section className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-2xl font-display text-[#F77313] mb-6">Guide d&apos;achat ({guideAchatPosts.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {guideAchatPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/guide-achat/${post.slug}`}
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
        <h2 className="text-2xl font-display text-[#F77313] mb-6">Articles de blog ({blogPosts.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {blogPosts.slice(0, 50).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="text-sm text-neutral-700 hover:text-[#F77313] transition-colors truncate"
              title={post.title}
            >
              {post.title}
            </Link>
          ))}
        </div>
        {blogPosts.length > 50 && (
          <p className="mt-4 text-neutral-500 text-sm">
            Et {blogPosts.length - 50} autres articles...{' '}
            <Link href="/blog" className="text-[#F77313] hover:underline">Voir tous les articles</Link>
          </p>
        )}
      </section>

      {/* Épices */}
      {spices.length > 0 && (
        <section className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h2 className="text-2xl font-display text-[#F77313] mb-6">La Route des Épices ({spices.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {spices.map((spice) => (
              <Link
                key={spice.slug}
                href={`/epices/${spice.slug}`}
                className="text-sm text-neutral-700 hover:text-[#F77313] transition-colors truncate"
                title={spice.name_fr || spice.slug}
              >
                {spice.name_fr || spice.slug}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lexique */}
      <section className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h2 className="text-2xl font-display text-[#F77313] mb-6">Lexique culinaire ({lexiqueTerms.length})</h2>
        <div className="space-y-4">
          {Object.entries(lexiqueByLetter).sort().map(([letter, terms]) => (
            <div key={letter}>
              <h3 className="font-display text-lg text-neutral-800 mb-2">{letter}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {terms.map((term) => (
                  <Link
                    key={term.slug}
                    href={`/lexique/${term.slug}`}
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
