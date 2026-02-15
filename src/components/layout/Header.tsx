'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Loader2, ChefHat, FileText, Clock } from 'lucide-react';

interface SearchResult {
  recipes: Array<{
    id: number;
    slug: string;
    title: string;
    featured_image: string | null;
    total_time: number;
    difficulty: string;
  }>;
  posts: Array<{
    id: number;
    slug: string;
    title: string;
    featured_image: string | null;
    excerpt: string | null;
  }>;
}

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Recipes', href: '/recipe' },
    { name: 'Blog', href: '/blog' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchButtonRef.current?.contains(event.target as Node)) return;
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchResults(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input on search open
  useEffect(() => {
    if (isSearchOpen && inputRef.current) inputRef.current.focus();
  }, [isSearchOpen]);

  // Search with debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults(null);
  };

  const difficultyLabel = (diff: string) => {
    const labels: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
    return labels[diff] || diff;
  };

  const hasResults = searchResults && (searchResults.recipes.length > 0 || searchResults.posts.length > 0);
  const noResults = searchResults && searchResults.recipes.length === 0 && searchResults.posts.length === 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo - Big, left */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logos/logo.svg"
              alt="Fresh N' Grill"
              width={220}
              height={60}
              className="h-14 sm:h-16 md:h-20 w-auto"
              priority
            />
          </Link>

          {/* Navigation + Search - Right */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-5 py-2.5 text-base font-bold uppercase tracking-widest transition-colors ${
                  isActive(item.href)
                    ? 'text-[#00bf63]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Search button */}
            <button
              ref={searchButtonRef}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="ml-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile: Search + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              ref={searchButtonRef}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-white/70 hover:text-white"
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white/70 hover:text-white"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              ref={searchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-neutral-800 overflow-hidden"
            >
              <div className="py-4 relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recipes, articles..."
                  className="w-full pl-12 pr-12 py-3 bg-neutral-900 text-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#00bf63] placeholder:text-neutral-500"
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00bf63] animate-spin" />
                )}
                {searchQuery && !isSearching && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {/* Results */}
                {(hasResults || noResults) && (
                  <div className="mt-2 bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden max-h-[60vh] overflow-y-auto">
                    {noResults && (
                      <p className="p-6 text-center text-neutral-400">No results for &quot;{searchQuery}&quot;</p>
                    )}
                    {hasResults && (
                      <>
                        {searchResults.recipes.length > 0 && (
                          <div className="p-4">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <ChefHat className="w-4 h-4" /> Recipes
                            </h3>
                            {searchResults.recipes.map((recipe) => (
                              <Link
                                key={recipe.id}
                                href={`/recipe/${recipe.slug}`}
                                onClick={handleSearchClose}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-800 transition-colors group"
                              >
                                {recipe.featured_image ? (
                                  <Image src={recipe.featured_image} alt={recipe.title} width={56} height={56} className="w-14 h-14 object-cover rounded" />
                                ) : (
                                  <div className="w-14 h-14 bg-neutral-800 rounded flex items-center justify-center"><ChefHat className="w-6 h-6 text-neutral-600" /></div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium truncate group-hover:text-[#00bf63]">{recipe.title}</p>
                                  <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.total_time} min</span>
                                    <span>{difficultyLabel(recipe.difficulty)}</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                        {searchResults.posts.length > 0 && (
                          <div className="p-4 border-t border-neutral-800">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> Articles
                            </h3>
                            {searchResults.posts.map((post) => (
                              <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                onClick={handleSearchClose}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-800 transition-colors group"
                              >
                                {post.featured_image ? (
                                  <Image src={post.featured_image} alt={post.title} width={56} height={56} className="w-14 h-14 object-cover rounded" />
                                ) : (
                                  <div className="w-14 h-14 bg-neutral-800 rounded flex items-center justify-center"><FileText className="w-6 h-6 text-neutral-600" /></div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium truncate group-hover:text-[#00bf63]">{post.title}</p>
                                  {post.excerpt && <p className="text-xs text-neutral-500 truncate mt-1">{post.excerpt}</p>}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                        <div className="p-4 border-t border-neutral-800">
                          <Link
                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                            onClick={handleSearchClose}
                            className="block w-full py-2 text-center text-sm font-bold text-[#00bf63] hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            View all results
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-neutral-800"
            >
              <div className="py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-4 text-lg font-bold uppercase tracking-widest transition-colors ${
                      isActive(item.href)
                        ? 'text-[#00bf63]'
                        : 'text-white/70 hover:text-white hover:bg-neutral-800/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
