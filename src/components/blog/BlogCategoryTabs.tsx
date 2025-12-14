'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface PostCard {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  author: {
    name: string;
  };
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  publishedAt: string;
  readingTime: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface BlogCategoryTabsProps {
  posts: PostCard[];
  categories: Category[];
  locale?: 'fr' | 'en';
}

const translations = {
  fr: {
    all: 'Tous les articles',
    latestArticles: 'Derniers Articles',
    articles: 'articles',
    minRead: 'min de lecture',
    by: 'Par',
    previous: 'Précédent',
    next: 'Suivant',
    page: 'Page',
    of: 'de',
  },
  en: {
    all: 'All articles',
    latestArticles: 'Latest Articles',
    articles: 'articles',
    minRead: 'min read',
    by: 'By',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
  },
};

const POSTS_PER_PAGE = 12;

export default function BlogCategoryTabs({
  posts,
  categories,
  locale = 'fr',
}: BlogCategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const t = translations[locale];
  const blogPath = locale === 'en' ? '/en/blog' : '/blog';

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Filtrer les catégories pour enlever "Cuisson", "Livres", "Les Recettes Rapides" et "Guide d'achat" (a sa propre page)
  // Puis trier pour mettre "Chroniques" en premier
  const filteredCategories = categories
    .filter((cat) => !['cuisson', 'livres', 'les-recettes-rapides', 'guide-achat'].includes(cat.slug))
    .sort((a, b) => {
      if (a.slug === 'chroniques') return -1;
      if (b.slug === 'chroniques') return 1;
      return 0;
    });

  // Trouver les IDs des catégories "Chroniques" et "Les Recettes Rapides" pour la fusion
  const chroniquesCategory = categories.find((cat) => cat.slug === 'chroniques');
  const recettesRapidesCategory = categories.find((cat) => cat.slug === 'les-recettes-rapides');
  const mergedCategoryIds = [chroniquesCategory?.id, recettesRapidesCategory?.id].filter(Boolean) as number[];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'en' ? 'en-CA' : 'fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Filtrer les posts par catégorie (avec fusion Chroniques + Recettes Rapides)
  const filteredPosts = activeCategory
    ? posts.filter((post) => {
        // Si c'est la catégorie Chroniques, inclure aussi Les Recettes Rapides
        if (activeCategory === chroniquesCategory?.id) {
          return post.categories.some((cat) => mergedCategoryIds.includes(cat.id));
        }
        return post.categories.some((cat) => cat.id === activeCategory);
      })
    : posts;

  // Exclure les 3 premiers posts (déjà affichés dans le hero) pour "Tous les articles"
  const allDisplayablePosts = filteredPosts.slice(activeCategory ? 0 : 3);

  // Pagination
  const totalPages = Math.ceil(allDisplayablePosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const displayPosts = allDisplayablePosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <>
      {/* Categories Bar */}
      {categories.length > 0 && (
        <section className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 py-1 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === null
                    ? 'text-[#F77313] border-b-2 border-[#F77313]'
                    : 'text-neutral-600 hover:text-black border-b-2 border-transparent hover:border-neutral-300'
                }`}
              >
                {t.all}
              </button>
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'text-[#F77313] border-b-2 border-[#F77313]'
                      : 'text-neutral-600 hover:text-black border-b-2 border-transparent hover:border-neutral-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      {displayPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-black">
                {activeCategory
                  ? categories.find((c) => c.id === activeCategory)?.name
                  : t.latestArticles}
              </h2>
              <div className="w-16 h-1 bg-[#F77313] mt-3" />
            </div>
            <span className="text-neutral-400 text-sm">
              {allDisplayablePosts.length} {t.articles}
            </span>
          </div>

          {/* Asymmetric Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {displayPosts.map((post, index) => {
              // Every 4th post is featured (larger)
              const isFeatured = index % 4 === 0;

              return (
                <article
                  key={post.id}
                  className={`group ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}`}
                >
                  <Link href={`${blogPath}/${post.slug}`} className="block">
                    {/* Image */}
                    <div
                      className={`relative overflow-hidden bg-neutral-100 ${isFeatured ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}
                    >
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                      )}

                      {/* Category Badge */}
                      {post.categories[0] && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-white text-black text-xs font-bold uppercase tracking-wider px-3 py-1.5 shadow-lg">
                            {post.categories[0].name}
                          </span>
                        </div>
                      )}

                      {/* Read More Arrow */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-[#F77313] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-5">
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-neutral-500 uppercase tracking-wide mb-3">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        <span>
                          {post.readingTime} {t.minRead}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className={`font-display text-black group-hover:text-[#F77313] transition-colors leading-tight ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}
                      >
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p
                          className={`text-neutral-600 mt-3 line-clamp-2 ${isFeatured ? 'text-base' : 'text-sm'}`}
                        >
                          {post.excerpt}
                        </p>
                      )}

                      {/* Author */}
                      {post.author && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
                          <div className="w-8 h-8 rounded-full bg-[#F77313] flex items-center justify-center text-white text-xs font-bold">
                            {post.author.name.charAt(0)}
                          </div>
                          <span className="text-sm text-neutral-600">
                            {t.by}{' '}
                            <span className="text-black font-medium">{post.author.name}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-neutral-200">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {t.previous}
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;

                  if (!showPage) {
                    // Show ellipsis for gaps
                    if (page === 2 && currentPage > 4) {
                      return (
                        <span key={page} className="px-2 text-neutral-400">
                          ...
                        </span>
                      );
                    }
                    if (page === totalPages - 1 && currentPage < totalPages - 3) {
                      return (
                        <span key={page} className="px-2 text-neutral-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-[#F77313] text-white'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t.next}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Empty state */}
          {displayPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500">
                {locale === 'en'
                  ? 'No articles found in this category.'
                  : 'Aucun article trouvé dans cette catégorie.'}
              </p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
