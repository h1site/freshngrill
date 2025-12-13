'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Clock, ChefHat, FileText, Loader2, ChevronDown, Utensils, Globe, Cake, Soup, Coffee, Salad, Fish, Beef, Drumstick, Refrigerator, Plus, Percent, Play, Pause, Square } from 'lucide-react';
import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import UserMenu from '@/components/auth/UserMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { KracRadioModal, KracRadioNowPlaying, useKracRadio } from '@/components/KracRadio/KracRadio';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';

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

interface IngredientRecipeResult {
  id: number;
  slug: string;
  title: string;
  featured_image: string | null;
  total_time: number;
  difficulty: string;
  matchScore: number;
  matchedCount: number;
  totalIngredients: number;
}

// Function to get localized mega menu data
function getMegaMenuData(locale: 'fr' | 'en', t: any) {
  const basePath = locale === 'en' ? '/en/recipe' : '/recette';
  const categoryParam = locale === 'en' ? 'category' : 'categorie';
  const originParam = locale === 'en' ? 'origin' : 'origine';
  const menu = t.header?.menu || {};

  return {
    recettes: {
      title: t.nav?.recipes || 'Recipes',
      href: basePath,
      sections: [
        {
          title: menu.mainDishes || 'Main Dishes',
          icon: Utensils,
          links: [
            { name: menu.beef || 'Beef', href: `${basePath}?${categoryParam}=plats-principaux-boeuf`, slug: 'plats-principaux-boeuf' },
            { name: menu.poultry || 'Poultry', href: `${basePath}?${categoryParam}=plats-principaux-volaille`, slug: 'plats-principaux-volaille' },
            { name: menu.pork || 'Pork', href: `${basePath}?${categoryParam}=plats-principaux-porc`, slug: 'plats-principaux-porc' },
            { name: menu.fish || 'Fish', href: `${basePath}?${categoryParam}=plat-principaux-poissons`, slug: 'plat-principaux-poissons' },
            { name: menu.seafood || 'Seafood', href: `${basePath}?${categoryParam}=plats-principaux-fruits-de-mer`, slug: 'plats-principaux-fruits-de-mer' },
            { name: menu.vegetarian || 'Vegetarian', href: `${basePath}?${categoryParam}=plats-principaux-vegetariens`, slug: 'plats-principaux-vegetariens' },
          ],
        },
        {
          title: menu.sides || 'Side Dishes',
          icon: Salad,
          links: [
            { name: menu.vegetables || 'Vegetables', href: `${basePath}?${categoryParam}=plats-daccompagnement-legumes`, slug: 'plats-daccompagnement-legumes' },
            { name: menu.salads || 'Salads', href: `${basePath}?${categoryParam}=salades`, slug: 'salades' },
            { name: menu.pasta || 'Pasta', href: `${basePath}?${categoryParam}=pates`, slug: 'pates' },
            { name: menu.rice || 'Rice', href: `${basePath}?${categoryParam}=riz`, slug: 'riz' },
            { name: menu.sauces || 'Sauces', href: `${basePath}?${categoryParam}=sauces`, slug: 'sauces' },
            { name: menu.other || 'Other', href: `${basePath}?${categoryParam}=plats-daccompagnement-autres`, slug: 'plats-daccompagnement-autres' },
          ],
        },
        {
          title: menu.meals || 'Meals',
          icon: Coffee,
          links: [
            { name: menu.breakfast || 'Breakfast', href: `${basePath}?${categoryParam}=dejeuner`, slug: 'dejeuner' },
            { name: menu.soups || 'Soups', href: `${basePath}?${categoryParam}=soupes`, slug: 'soupes' },
            { name: menu.snacks || 'Snacks', href: `${basePath}?${categoryParam}=snacks`, slug: 'snacks' },
            { name: menu.appetizers || 'Appetizers', href: `${basePath}?${categoryParam}=amuse-gueules`, slug: 'amuse-gueules' },
            { name: menu.pizza || 'Pizza', href: `${basePath}?${categoryParam}=pizza`, slug: 'pizza' },
            { name: menu.poutine || 'Poutine', href: `${basePath}?${categoryParam}=poutine`, slug: 'poutine' },
          ],
        },
        {
          title: menu.sweet || 'Sweet',
          icon: Cake,
          links: [
            { name: menu.desserts || 'Desserts', href: `${basePath}?${categoryParam}=dessert`, slug: 'dessert' },
            { name: menu.pastries || 'Pastries', href: `${basePath}?${categoryParam}=patisseries`, slug: 'patisseries' },
            { name: menu.pies || 'Pies', href: `${basePath}?${categoryParam}=tartes`, slug: 'tartes' },
            { name: menu.breads || 'Breads', href: `${basePath}?${categoryParam}=pains`, slug: 'pains' },
            { name: menu.drinks || 'Drinks', href: `${basePath}?${categoryParam}=boissons`, slug: 'boissons' },
          ],
        },
      ],
      featured: {
        title: menu.worldCuisines || 'World Cuisines',
        icon: Globe,
        links: [
          { name: 'Canada', href: `${basePath}?${originParam}=Canada`, flag: '🇨🇦' },
          { name: 'France', href: `${basePath}?${originParam}=France`, flag: '🇫🇷' },
          { name: locale === 'en' ? 'Italy' : 'Italie', href: `${basePath}?${originParam}=${locale === 'en' ? 'Italy' : 'Italie'}`, flag: '🇮🇹' },
          { name: locale === 'en' ? 'Mexico' : 'Mexique', href: `${basePath}?${originParam}=${locale === 'en' ? 'Mexico' : 'Mexique'}`, flag: '🇲🇽' },
          { name: locale === 'en' ? 'United States' : 'États-Unis', href: `${basePath}?${originParam}=${locale === 'en' ? 'United States' : 'États-Unis'}`, flag: '🇺🇸' },
          { name: locale === 'en' ? 'Greece' : 'Grèce', href: `${basePath}?${originParam}=${locale === 'en' ? 'Greece' : 'Grèce'}`, flag: '🇬🇷' },
          { name: locale === 'en' ? 'India' : 'Inde', href: `${basePath}?${originParam}=${locale === 'en' ? 'India' : 'Inde'}`, flag: '🇮🇳' },
          { name: locale === 'en' ? 'Japan' : 'Japon', href: `${basePath}?${originParam}=${locale === 'en' ? 'Japan' : 'Japon'}`, flag: '🇯🇵' },
          { name: locale === 'en' ? 'China' : 'Chine', href: `${basePath}?${originParam}=${locale === 'en' ? 'China' : 'Chine'}`, flag: '🇨🇳' },
        ],
      },
    },
  };
}

interface HeaderProps {
  locale?: Locale;
  dictionary?: Dictionary;
}

export default function Header({ locale = 'fr', dictionary }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // KracRadio
  const {
    musicEnabled,
    selectedChannel,
    showChannelSelector,
    setShowChannelSelector,
    nowPlaying,
    showNowPlaying,
    setShowNowPlaying,
    isPlaying,
    toggleMusic,
    togglePlayPause,
    changeChannel
  } = useKracRadio('francophonie');

  // Mode recherche par ingrédients
  const [isIngredientMode, setIsIngredientMode] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientSuggestions, setIngredientSuggestions] = useState<string[]>([]);
  const [ingredientResults, setIngredientResults] = useState<IngredientRecipeResult[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);

  // Préfixe URL pour la locale
  const urlPrefix = locale === 'en' ? '/en' : '';

  // Traductions avec fallback FR
  const t = dictionary || {
    nav: { home: 'Accueil', recipes: 'Recettes', lexicon: 'Lexique', converter: 'Convertisseur', blog: 'Blog' },
    header: {
      search: 'Rechercher',
      searchPlaceholder: 'Rechercher une recette, un article...',
      ingredientMode: 'Dans mon frigo',
      ingredientPlaceholder: 'Tapez un ingrédient (ex: poulet, tomate...)',
      clearAll: 'Tout effacer',
      noResults: 'Aucun résultat pour "{query}"',
      noIngredientResults: 'Aucune recette trouvée avec ces ingrédients.',
      tryMoreIngredients: "Essayez d'ajouter d'autres ingrédients!",
      viewAllResults: 'Voir tous les résultats',
      articles: 'Articles',
      mobileCategories: 'Catégories populaires',
      menu: {
        mainDishes: 'Plats principaux', beef: 'Boeuf', poultry: 'Volaille', pork: 'Porc',
        fish: 'Poissons', seafood: 'Fruits de mer', vegetarian: 'Végétariens',
        sides: 'Accompagnements', vegetables: 'Légumes', salads: 'Salades', pasta: 'Pâtes',
        rice: 'Riz', sauces: 'Sauces', other: 'Autres',
        meals: 'Repas', breakfast: 'Déjeuner', soups: 'Soupes', snacks: 'Snacks',
        appetizers: 'Amuse-gueules', pizza: 'Pizza', poutine: 'Poutine',
        sweet: 'Sucré', desserts: 'Desserts', pastries: 'Pâtisseries', pies: 'Tartes',
        breads: 'Pains', drinks: 'Boissons', worldCuisines: 'Cuisines du monde',
        seeAllRecipes: 'Voir toutes les recettes', culinaryLexicon: 'Lexique culinaire',
        holidayRecipes: 'Recettes des fêtes', canning: 'Mise en conserve'
      }
    },
    recipes: { difficulty: { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' } }
  };

  // Get localized mega menu data
  const megaMenuData = getMegaMenuData(locale, t);

  // Route paths based on locale
  const routes = locale === 'en' ? {
    recipe: '/en/recipe',
    lexicon: '/en/lexicon',
    converter: '/en/converter',
    blog: '/en/blog',
    search: '/en/search',
  } : {
    recipe: '/recette',
    lexicon: '/lexique',
    converter: '/convertisseur',
    blog: '/blog',
    search: '/recherche',
  };

  const navigation = [
    { name: t.nav.home, href: `${urlPrefix}/`, hasMegaMenu: false },
    { name: t.nav.recipes, href: routes.recipe, hasMegaMenu: true },
    { name: t.nav.lexicon, href: routes.lexicon, hasMegaMenu: false },
    { name: t.nav.converter, href: routes.converter, hasMegaMenu: false },
    { name: t.nav.blog, href: routes.blog, hasMegaMenu: false },
  ];

  // Fermer la recherche quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Ignorer le clic sur le bouton search lui-même
      if (searchButtonRef.current && searchButtonRef.current.contains(event.target as Node)) {
        return;
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchResults(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus sur l'input quand on ouvre la recherche
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Recherche avec debounce (mode normal)
  useEffect(() => {
    if (isIngredientMode || searchQuery.length < 2) {
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
        console.error('Erreur recherche:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isIngredientMode]);

  // Suggestions d'ingrédients
  useEffect(() => {
    if (!isIngredientMode || searchQuery.length < 2) {
      setIngredientSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/ingredients?suggest=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        // Filtrer les ingrédients déjà sélectionnés
        const filtered = (data.suggestions || []).filter(
          (s: string) => !selectedIngredients.includes(s)
        );
        setIngredientSuggestions(filtered.slice(0, 6));
      } catch (error) {
        console.error('Erreur suggestions:', error);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, isIngredientMode, selectedIngredients]);

  // Recherche par ingrédients
  useEffect(() => {
    if (!isIngredientMode || selectedIngredients.length === 0) {
      setIngredientResults([]);
      return;
    }

    const searchByIngredients = async () => {
      setIsLoadingIngredients(true);
      try {
        const response = await fetch(
          `/api/search/ingredients?ingredients=${encodeURIComponent(selectedIngredients.join(','))}`
        );
        const data = await response.json();
        setIngredientResults(data.recipes || []);
      } catch (error) {
        console.error('Erreur recherche ingrédients:', error);
      } finally {
        setIsLoadingIngredients(false);
      }
    };

    searchByIngredients();
  }, [selectedIngredients, isIngredientMode]);

  // Ajouter un ingrédient
  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    setSearchQuery('');
    setIngredientSuggestions([]);
    inputRef.current?.focus();
  };

  // Supprimer un ingrédient
  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i !== ingredient));
  };

  // Toggle mode
  const toggleSearchMode = () => {
    setIsIngredientMode(!isIngredientMode);
    setSearchQuery('');
    setSearchResults(null);
    setIngredientSuggestions([]);
    if (!isIngredientMode) {
      // Switch to ingredient mode - keep selected ingredients
    } else {
      // Switch to normal mode - clear ingredients
      setSelectedIngredients([]);
      setIngredientResults([]);
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults(null);
    setIsIngredientMode(false);
    setSelectedIngredients([]);
    setIngredientSuggestions([]);
    setIngredientResults([]);
  };

  // Gérer Enter en mode ingrédient
  const handleIngredientKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.length >= 2) {
      const toAdd = ingredientSuggestions[0] || searchQuery.toLowerCase().trim();
      if (toAdd) {
        addIngredient(toAdd);
      }
    }
  };

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };

  const difficultyLabel = (diff: string) => {
    const labels: Record<string, string> = {
      facile: 'Facile',
      moyen: 'Moyen',
      difficile: 'Difficile',
    };
    return labels[diff] || diff;
  };

  const hasResults = searchResults && (searchResults.recipes.length > 0 || searchResults.posts.length > 0);
  const noResults = searchResults && searchResults.recipes.length === 0 && searchResults.posts.length === 0;

  return (
    <>
      {/* KracRadio Now Playing Popup */}
      <KracRadioNowPlaying
        nowPlaying={nowPlaying}
        show={showNowPlaying}
        onClose={() => setShowNowPlaying(false)}
      />

      <header className="sticky top-0 z-50 bg-black border-b border-neutral-800 overflow-x-hidden">
        <div className="container mx-auto px-4">
        <div className="flex items-center h-16 md:h-20">
          {/* Logo */}
          <Link href={`${urlPrefix}/`} className="flex items-center group">
            <Image
              src="/images/logos/menucochon-blanc.svg"
              alt="Menu Cochon"
              width={250}
              height={56}
              className="h-10 md:h-14 w-auto"
              priority
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1 ml-10">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={item.hasMegaMenu ? handleMegaMenuEnter : undefined}
                onMouseLeave={item.hasMegaMenu ? handleMegaMenuLeave : undefined}
              >
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wide group ${
                    item.hasMegaMenu && isMegaMenuOpen ? 'text-white' : ''
                  }`}
                >
                  {item.name}
                  {item.hasMegaMenu && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                  )}
                  <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-[#F77313] transition-all duration-300 ${
                    item.hasMegaMenu && isMegaMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} />
                </Link>
              </div>
            ))}
          </nav>

          {/* Spacer pour pousser les actions à droite */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* KracRadio Controls */}
            <div className="flex items-center">
              {/* Radio Button - opens modal */}
              <button
                onClick={() => setShowChannelSelector(true)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 transition-all text-sm font-medium ${
                  musicEnabled
                    ? 'text-pink-400 hover:text-pink-300 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-l-full border-r-0'
                    : 'text-neutral-400 hover:text-white bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 rounded-full'
                }`}
                title={locale === 'en' ? 'Choose a station' : 'Choisir une station'}
              >
                {musicEnabled ? <SpeakerHigh weight="fill" className="w-4 h-4" /> : <SpeakerSlash weight="regular" className="w-4 h-4" />}
                <span className="hidden sm:inline">{locale === 'en' ? 'Radio' : 'Radio'}</span>
              </button>

              {/* Play/Pause and Stop Buttons - shows when music has been started */}
              {musicEnabled && (
                <>
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlayPause}
                    className="flex items-center justify-center w-8 h-8 text-pink-400 hover:text-pink-300 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 border-l-0 transition-all"
                    title={isPlaying
                      ? (locale === 'en' ? 'Pause' : 'Pause')
                      : (locale === 'en' ? 'Play' : 'Lecture')
                    }
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  {/* Stop Button */}
                  <button
                    onClick={toggleMusic}
                    className="flex items-center justify-center w-8 h-8 text-pink-400 hover:text-pink-300 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 border-l-0 rounded-r-full transition-all"
                    title={locale === 'en' ? 'Stop' : 'Arrêter'}
                  >
                    <Square className="w-3 h-3 fill-current" />
                  </button>
                </>
              )}
            </div>

            {/* KracRadio Modal */}
            <KracRadioModal
              isOpen={showChannelSelector}
              onClose={() => setShowChannelSelector(false)}
              selectedChannel={selectedChannel}
              onChannelChange={changeChannel}
              musicEnabled={musicEnabled}
              isPlaying={isPlaying}
              onToggleMusic={toggleMusic}
              onTogglePlayPause={togglePlayPause}
              locale={locale}
            />

            <button
              ref={searchButtonRef}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-all"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <UserMenu />

            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher locale={locale} />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-all"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block absolute left-0 right-0 top-full bg-neutral-900 border-t border-neutral-800 shadow-2xl"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-5 gap-8">
                  {/* Sections principales */}
                  {megaMenuData.recettes.sections.map((section) => (
                    <div key={section.title}>
                      <div className="flex items-center gap-2 mb-4">
                        <section.icon className="w-5 h-5 text-[#F77313]" />
                        <h3 className="text-white font-display text-lg">{section.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {section.links.map((link) => (
                          <li key={link.name}>
                            <Link
                              href={link.href}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="text-neutral-400 hover:text-white hover:pl-2 transition-all text-sm block py-1"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Cuisines du monde */}
                  <div className="bg-neutral-800/50 rounded-lg p-6 -my-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-5 h-5 text-[#F77313]" />
                      <h3 className="text-white font-display text-lg">{megaMenuData.recettes.featured.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {megaMenuData.recettes.featured.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="text-neutral-400 hover:text-white transition-all text-sm flex items-center gap-2 py-1 group"
                          >
                            <span className="text-base">{link.flag}</span>
                            <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer du mega menu */}
                <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
                  <Link
                    href={routes.recipe}
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="text-[#F77313] hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <ChefHat className="w-4 h-4" />
                    {t.header?.menu?.seeAllRecipes || 'See all recipes'}
                  </Link>
                  <div className="flex items-center gap-6">
                    <Link
                      href={routes.lexicon}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                    >
                      <span className="text-base">📖</span>
                      {t.header?.menu?.culinaryLexicon || 'Culinary lexicon'}
                    </Link>
                    <Link
                      href={`${routes.recipe}?${locale === 'en' ? 'category' : 'categorie'}=fetes`}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                    >
                      <span className="text-base">🎄</span>
                      {t.header?.menu?.holidayRecipes || 'Holiday recipes'}
                    </Link>
                    <Link
                      href={`${routes.recipe}?${locale === 'en' ? 'category' : 'categorie'}=mise-en-conserve-congelation`}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                    >
                      <span className="text-base">🫙</span>
                      {t.header?.menu?.canning || 'Canning'}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              ref={searchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-visible border-t border-neutral-800"
            >
              <div className="py-4 px-2 md:px-0 relative">
                {/* Mode Toggle */}
                <div className="flex justify-center gap-2 mb-4 max-w-2xl mx-auto">
                  <button
                    onClick={() => !isIngredientMode && toggleSearchMode()}
                    className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                      !isIngredientMode
                        ? 'bg-[#F77313] text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.header.search}</span>
                    <span className="sm:hidden">{t.header.search}</span>
                  </button>
                  <button
                    onClick={() => isIngredientMode || toggleSearchMode()}
                    className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                      isIngredientMode
                        ? 'bg-[#F77313] text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Refrigerator className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.header.ingredientMode}</span>
                    <span className="sm:hidden">{locale === 'en' ? 'Fridge' : 'Frigo'}</span>
                    {selectedIngredients.length > 0 && (
                      <span className="bg-white text-[#F77313] text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {selectedIngredients.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative max-w-2xl mx-auto">
                  {isIngredientMode ? (
                    <Refrigerator className="absolute left-4 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  ) : (
                    <Search className="absolute left-4 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={isIngredientMode ? handleIngredientKeyDown : undefined}
                    placeholder={
                      isIngredientMode
                        ? (locale === 'en' ? 'Ingredient (e.g., chicken...)' : 'Ingrédient (ex: poulet...)')
                        : (locale === 'en' ? 'Search...' : 'Rechercher...')
                    }
                    className="w-full pl-11 md:pl-12 pr-11 md:pr-12 py-3 bg-neutral-900 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#F77313] transition-all placeholder:text-neutral-500"
                  />
                  {(isSearching || isLoadingIngredients) && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F77313] animate-spin" />
                  )}
                  {searchQuery && !isSearching && !isLoadingIngredients && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Selected Ingredients Tags */}
                {isIngredientMode && selectedIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-3 max-w-2xl mx-auto px-2 md:px-0">
                    {selectedIngredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="inline-flex items-center gap-1.5 bg-neutral-800 text-white px-3 py-1.5 text-sm rounded-full"
                      >
                        {ingredient}
                        <button
                          onClick={() => removeIngredient(ingredient)}
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedIngredients([]);
                        setIngredientResults([]);
                      }}
                      className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-1 px-2"
                    >
                      <X className="w-3 h-3" />
                      {t.header.clearAll}
                    </button>
                  </div>
                )}

                {/* Ingredient Suggestions Dropdown */}
                <AnimatePresence>
                  {isIngredientMode && ingredientSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-2 right-2 md:left-0 md:right-0 top-full mt-2 max-w-2xl mx-auto bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {ingredientSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => addIngredient(suggestion)}
                            className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 rounded-xl flex items-center gap-2 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#F77313]" />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ingredient Results */}
                <AnimatePresence>
                  {isIngredientMode && selectedIngredients.length > 0 && !ingredientSuggestions.length && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-2 right-2 md:left-0 md:right-0 top-full mt-2 max-w-2xl mx-auto bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden z-50"
                    >
                      {isLoadingIngredients ? (
                        <div className="p-6 flex justify-center">
                          <Loader2 className="w-6 h-6 text-[#F77313] animate-spin" />
                        </div>
                      ) : ingredientResults.length === 0 ? (
                        <div className="p-6 text-center text-neutral-400">
                          <Refrigerator className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          <p>{t.header.noIngredientResults}</p>
                          <p className="text-sm">{t.header.tryMoreIngredients}</p>
                        </div>
                      ) : (
                        <div className="max-h-[70vh] overflow-y-auto">
                          <div className="p-4">
                            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <ChefHat className="w-4 h-4" />
                              {locale === 'en'
                                ? `${ingredientResults.length} recipe${ingredientResults.length > 1 ? 's' : ''} found`
                                : `${ingredientResults.length} recette${ingredientResults.length > 1 ? 's' : ''} trouvée${ingredientResults.length > 1 ? 's' : ''}`}
                            </h3>
                            <div className="space-y-2">
                              {ingredientResults.slice(0, 8).map((recipe) => (
                                <Link
                                  key={recipe.id}
                                  href={`${routes.recipe}/${recipe.slug}`}
                                  onClick={handleSearchClose}
                                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-800 transition-colors group"
                                >
                                  {recipe.featured_image ? (
                                    <Image
                                      src={recipe.featured_image}
                                      alt={recipe.title}
                                      width={60}
                                      height={60}
                                      className="w-14 h-14 object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="w-14 h-14 bg-neutral-800 rounded-lg flex items-center justify-center">
                                      <ChefHat className="w-6 h-6 text-neutral-600" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate group-hover:text-[#F77313] transition-colors">
                                      {recipe.title}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {recipe.total_time} min
                                      </span>
                                      <span className="px-2 py-0.5 bg-neutral-800 rounded-full">
                                        {recipe.matchedCount}/{recipe.totalIngredients} ing.
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 bg-white text-neutral-700 text-xs font-bold px-2 py-1 rounded-full border border-neutral-200">
                                    <Percent className="w-3 h-3" />
                                    {recipe.matchScore}%
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                          {ingredientResults.length > 8 && (
                            <div className="p-4 border-t border-neutral-800 text-center text-sm text-neutral-500">
                              {locale === 'en'
                                ? `And ${ingredientResults.length - 8} more recipes...`
                                : `Et ${ingredientResults.length - 8} autres recettes...`}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Normal Search Results */}
                <AnimatePresence>
                  {!isIngredientMode && (hasResults || noResults) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-2 right-2 md:left-0 md:right-0 top-full mt-2 max-w-2xl mx-auto bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden z-50"
                    >
                      {noResults && (
                        <div className="p-6 text-center text-neutral-400">
                          <p>{locale === 'en' ? `No results for "${searchQuery}"` : `Aucun résultat pour "${searchQuery}"`}</p>
                        </div>
                      )}

                      {hasResults && (
                        <div className="max-h-[70vh] overflow-y-auto">
                          {/* Recettes */}
                          {searchResults.recipes.length > 0 && (
                            <div className="p-4">
                              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <ChefHat className="w-4 h-4" />
                                {t.nav.recipes}
                              </h3>
                              <div className="space-y-2">
                                {searchResults.recipes.map((recipe) => (
                                  <Link
                                    key={recipe.id}
                                    href={`${routes.recipe}/${recipe.slug}`}
                                    onClick={handleSearchClose}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-800 transition-colors group"
                                  >
                                    {recipe.featured_image ? (
                                      <Image
                                        src={recipe.featured_image}
                                        alt={recipe.title}
                                        width={60}
                                        height={60}
                                        className="w-14 h-14 object-cover rounded-lg"
                                      />
                                    ) : (
                                      <div className="w-14 h-14 bg-neutral-800 rounded-lg flex items-center justify-center">
                                        <ChefHat className="w-6 h-6 text-neutral-600" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white font-medium truncate group-hover:text-[#F77313] transition-colors">
                                        {recipe.title}
                                      </p>
                                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {recipe.total_time} min
                                        </span>
                                        <span className="px-2 py-0.5 bg-neutral-800 rounded-full">
                                          {difficultyLabel(recipe.difficulty)}
                                        </span>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Articles */}
                          {searchResults.posts.length > 0 && (
                            <div className="p-4 border-t border-neutral-800">
                              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {t.header.articles}
                              </h3>
                              <div className="space-y-2">
                                {searchResults.posts.map((post) => (
                                  <Link
                                    key={post.id}
                                    href={`${routes.blog}/${post.slug}`}
                                    onClick={handleSearchClose}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-800 transition-colors group"
                                  >
                                    {post.featured_image ? (
                                      <Image
                                        src={post.featured_image}
                                        alt={post.title}
                                        width={60}
                                        height={60}
                                        className="w-14 h-14 object-cover rounded-lg"
                                      />
                                    ) : (
                                      <div className="w-14 h-14 bg-neutral-800 rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-neutral-600" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white font-medium truncate group-hover:text-[#F77313] transition-colors">
                                        {post.title}
                                      </p>
                                      {post.excerpt && (
                                        <p className="text-xs text-neutral-500 truncate mt-1">
                                          {post.excerpt}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Voir tous les résultats */}
                          <div className="p-4 border-t border-neutral-800">
                            <Link
                              href={`${routes.search}?q=${encodeURIComponent(searchQuery)}`}
                              onClick={handleSearchClose}
                              className="block w-full py-3 text-center text-sm font-medium text-[#F77313] hover:bg-neutral-800 rounded-xl transition-colors"
                            >
                              {t.header.viewAllResults}
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
              className="lg:hidden overflow-hidden border-t border-neutral-800"
            >
              <div className="py-4">
                {/* Navigation principale */}
                <div className="space-y-1">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 font-medium uppercase tracking-wide text-sm transition-all"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Catégories populaires mobile */}
                <div className="mt-6 pt-6 border-t border-neutral-800">
                  <h3 className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                    {t.header.mobileCategories}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 px-4">
                    {[
                      { name: t.header.menu.beef, href: `${routes.recipe}?categorie=plats-principaux-boeuf`, icon: '🥩' },
                      { name: t.header.menu.poultry, href: `${routes.recipe}?categorie=plats-principaux-volaille`, icon: '🍗' },
                      { name: t.header.menu.desserts, href: `${routes.recipe}?categorie=dessert`, icon: '🍰' },
                      { name: t.header.menu.soups, href: `${routes.recipe}?categorie=soupes`, icon: '🍲' },
                      { name: t.header.menu.pasta, href: `${routes.recipe}?categorie=pates`, icon: '🍝' },
                      { name: t.header.menu.salads, href: `${routes.recipe}?categorie=salades`, icon: '🥗' },
                    ].map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all text-sm"
                      >
                        <span>{cat.icon}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Cuisines mobile */}
                <div className="mt-6 pt-6 border-t border-neutral-800">
                  <h3 className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                    {t.header.menu.worldCuisines}
                  </h3>
                  <div className="flex flex-wrap gap-2 px-4">
                    {megaMenuData.recettes.featured.links.map((country) => (
                      <Link
                        key={country.name}
                        href={country.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800/50 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-all text-xs"
                      >
                        <span>{country.flag}</span>
                        {country.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Language Switcher Mobile */}
                <div className="mt-6 pt-6 border-t border-neutral-800 px-4 pb-4">
                  <div className="flex items-center justify-center gap-3">
                    <Globe className="w-5 h-5 text-[#F77313]" />
                    <span className="text-neutral-500 text-sm">{locale === 'en' ? 'Language' : 'Langue'}</span>
                  </div>
                  <div className="flex justify-center gap-4 mt-3">
                    <LanguageSwitcher locale={locale} className="justify-center" />
                  </div>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
    </>
  );
}
