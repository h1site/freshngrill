import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPostCards, getAllPostCategories } from '@/lib/posts';
import { Calendar, Clock, Newspaper, ShoppingCart, ArrowRight } from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';
import BlogCategoryTabs from '@/components/blog/BlogCategoryTabs';

export const metadata: Metadata = {
  title: 'Blog | Menu Cochon',
  description: 'Découvrez nos articles, conseils et astuces culinaires pour devenir un chef en cuisine.',
  alternates: {
    canonical: '/blog/',
  },
};

export default async function BlogPage() {
  const [allPosts, categories] = await Promise.all([
    getPostCards(),
    getAllPostCategories(),
  ]);

  // Exclure les posts guide-achat du blog (ils ont leur propre page)
  const posts = allPosts.filter((post) =>
    !post.categories.some((cat) => cat.slug === 'guide-achat')
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Filtrer les posts de la catégorie "Chroniques" pour le hero
  const chroniquePosts = posts.filter((post) =>
    post.categories.some((cat) => cat.slug === 'chroniques' || cat.slug === 'les-recettes-rapides')
  );
  const featuredPost = chroniquePosts[0] || posts[0];
  const secondaryPosts = chroniquePosts.slice(1, 5); // 4 blocs à droite

  return (
    <main className="min-h-screen bg-white">
      {/* Magazine-Style Hero */}
      <section className="relative bg-black">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="py-8 md:py-12 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Newspaper className="w-5 h-5 text-[#F77313]" />
                  <span className="text-[#F77313] text-sm font-medium uppercase tracking-[0.2em]">
                    Le Journal
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white">
                  Blog
                </h1>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-neutral-500 text-sm uppercase tracking-wider">
                  Édition
                </p>
                <p className="text-white font-display text-2xl">
                  {new Date().toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Chroniques Section */}
          {featuredPost && (
            <div className="py-8 md:py-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-[0.15em]">
                  Chroniques
                </span>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Main Featured */}
                <div className="lg:col-span-7">
                  <Link href={`/blog/${featuredPost.slug}`} className="group block relative">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {featuredPost.featuredImage ? (
                        <Image
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        {featuredPost.categories[0] && (
                          <span className="inline-block bg-[#F77313] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 mb-4">
                            {featuredPost.categories[0].name}
                          </span>
                        )}
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight group-hover:text-[#F77313] transition-colors">
                          {featuredPost.title}
                        </h2>
                        {featuredPost.excerpt && (
                          <p className="text-white/70 text-lg mt-4 line-clamp-2 max-w-2xl">
                            {featuredPost.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-6 text-white/60 text-sm">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(featuredPost.publishedAt)}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-white/40" />
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readingTime} min
                          </span>
                          {featuredPost.author && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-white/40" />
                              <span>Par {featuredPost.author.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Secondary Posts - 4 blocs qui remplissent la hauteur */}
                <div className="lg:col-span-5 grid grid-rows-4 gap-2 h-full">
                  {secondaryPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex gap-4 items-center bg-white/5 hover:bg-white/10 transition-colors p-2 rounded"
                    >
                      <div className="relative w-20 h-full aspect-square flex-shrink-0 overflow-hidden rounded">
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {post.categories[0] && (
                          <span className="text-[#F77313] text-[10px] font-medium uppercase tracking-wider">
                            {post.categories[0].name}
                          </span>
                        )}
                        <h3 className="font-display text-sm lg:text-base text-white group-hover:text-[#F77313] transition-colors leading-tight mt-1 line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Category Tabs + Filtered Articles Grid */}
      <BlogCategoryTabs posts={posts} categories={categories} locale="fr" />

      {/* Ad after articles */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Section 3: Guide d'achat CTA Banner */}
      <section className="bg-gradient-to-r from-black via-neutral-900 to-black py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative w-full lg:w-1/2 aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
                alt="Ustensiles de cuisine"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:hidden" />
            </div>

            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#F77313] text-white text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-6">
                <ShoppingCart className="w-4 h-4" />
                Guide d&apos;achat
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
                Équipez Votre Cuisine Comme un Chef
              </h2>
              <p className="text-neutral-400 text-lg mt-4 max-w-xl">
                Découvrez notre sélection des meilleurs ustensiles, électroménagers et livres
                pour transformer votre cuisine en un véritable atelier culinaire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <Link
                  href="/guide-achat"
                  className="inline-flex items-center justify-center gap-2 bg-[#F77313] text-white px-8 py-4 font-medium uppercase tracking-wide hover:bg-[#d45f0a] transition-colors"
                >
                  Voir le guide
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
