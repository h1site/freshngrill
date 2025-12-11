'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Clock, ChefHat, FileText, X } from 'lucide-react';

interface Recipe {
  id: number;
  slug: string;
  title: string;
  featured_image: string | null;
  total_time: number;
  difficulty: string;
  excerpt: string | null;
}

interface Post {
  id: number;
  slug: string;
  title: string;
  featured_image: string | null;
  excerpt: string | null;
}

interface SearchResultsProps {
  query: string;
}

export default function SearchResultsEN({ query: initialQuery }: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recipes' | 'posts'>('all');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (query.length < 2) {
      setRecipes([]);
      setPosts([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=50`);
      const data = await response.json();
      setRecipes(data.recipes || []);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/en/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const difficultyLabel = (diff: string) => {
    const labels: Record<string, string> = {
      facile: 'Easy',
      moyen: 'Medium',
      difficile: 'Hard',
    };
    return labels[diff] || diff;
  };

  const totalResults = recipes.length + posts.length;
  const filteredRecipes = activeTab === 'posts' ? [] : recipes;
  const filteredPosts = activeTab === 'recipes' ? [] : posts;

  return (
    <div>
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="font-display text-4xl md:text-5xl text-center text-gray-900 mb-8">
          Search
        </h1>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search a recipe, an article..."
            className="w-full pl-14 pr-14 py-4 bg-white text-gray-900 rounded-full text-lg border-2 border-gray-200 focus:outline-none focus:border-[#F77313] transition-colors placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </form>
      </div>

      {/* Results */}
      {initialQuery && (
        <>
          {/* Results Count & Tabs */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <p className="text-gray-600">
              {isLoading ? (
                'Searching...'
              ) : totalResults > 0 ? (
                <>
                  <span className="font-semibold text-gray-900">{totalResults}</span> result{totalResults > 1 ? 's' : ''} for &quot;{initialQuery}&quot;
                </>
              ) : (
                <>No results for &quot;{initialQuery}&quot;</>
              )}
            </p>

            {totalResults > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-[#F77313] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({totalResults})
                </button>
                {recipes.length > 0 && (
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTab === 'recipes'
                        ? 'bg-[#F77313] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Recipes ({recipes.length})
                  </button>
                )}
                {posts.length > 0 && (
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTab === 'posts'
                        ? 'bg-[#F77313] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Articles ({posts.length})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-2xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* Recipe Results */}
          {!isLoading && filteredRecipes.length > 0 && (
            <section className="mb-12">
              {activeTab === 'all' && (
                <h2 className="font-display text-2xl text-gray-900 mb-6 flex items-center gap-3">
                  <ChefHat className="w-6 h-6 text-[#F77313]" />
                  Recipes
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe, index) => (
                  <motion.article
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group"
                  >
                    <Link href={`/en/recipe/${recipe.slug}`} className="block">
                      <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4] rounded-2xl">
                        {recipe.featured_image ? (
                          <Image
                            src={recipe.featured_image}
                            alt={recipe.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                            <ChefHat className="w-16 h-16 text-neutral-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>

                      <div className="pt-4">
                        <div className="flex items-center gap-3 text-xs text-neutral-500 uppercase tracking-wide mb-2">
                          {recipe.total_time > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {recipe.total_time} min
                            </span>
                          )}
                          <span className="w-1 h-1 rounded-full bg-neutral-300" />
                          <span>{difficultyLabel(recipe.difficulty)}</span>
                        </div>

                        <h3 className="font-display text-xl md:text-2xl text-black group-hover:text-[#F77313] transition-colors leading-tight">
                          {recipe.title}
                        </h3>

                        {recipe.excerpt && (
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                            {recipe.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </section>
          )}

          {/* Post Results */}
          {!isLoading && filteredPosts.length > 0 && (
            <section>
              {activeTab === 'all' && (
                <h2 className="font-display text-2xl text-gray-900 mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#F77313]" />
                  Articles
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group"
                  >
                    <Link href={`/en/blog/${post.slug}`} className="block">
                      <div className="relative overflow-hidden bg-neutral-100 aspect-[16/10] rounded-2xl">
                        {post.featured_image ? (
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                            <FileText className="w-16 h-16 text-neutral-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>

                      <div className="pt-4">
                        <h3 className="font-display text-xl md:text-2xl text-black group-hover:text-[#F77313] transition-colors leading-tight">
                          {post.title}
                        </h3>

                        {post.excerpt && (
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {!isLoading && totalResults === 0 && initialQuery && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="font-display text-2xl text-gray-900 mb-4">
                No results found
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We couldn&apos;t find any results for &quot;{initialQuery}&quot;.
                Try other keywords or explore our categories.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/en/recipe"
                  className="px-6 py-3 bg-[#F77313] text-white rounded-full font-medium hover:bg-[#e56a10] transition-colors"
                >
                  View all recipes
                </Link>
                <Link
                  href="/en/blog"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  View blog
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* Initial State (no query) */}
      {!initialQuery && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-[#F77313]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-[#F77313]" />
          </div>
          <h2 className="font-display text-2xl text-gray-900 mb-4">
            What are you looking for?
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Enter a keyword to search through our recipes and blog articles.
          </p>
        </div>
      )}
    </div>
  );
}
