'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Refrigerator, ChefHat, X, Check, ArrowRight, Clock, Flame } from 'lucide-react';

interface Ingredient {
  id: number;
  slug: string;
  name: string;
}

interface RecipeMatch {
  id: number;
  slug: string;
  title: string;
  featuredImage: string | null;
  totalTime: number | null;
  difficulty: string | null;
  matchingIngredients: number;
  totalIngredients: number;
  matchPercentage: number;
}

export default function FrigoPageEN() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<RecipeMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingIngredients, setLoadingIngredients] = useState(true);
  const [showIngredientPanel, setShowIngredientPanel] = useState(false);

  // Load ingredients on mount
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await fetch('/api/ingredients');
        const data = await response.json();
        setIngredients(data);

        // Check if ingredients are passed in URL
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const ingredientsParam = params.get('ingredients');

          if (ingredientsParam) {
            const ingredientNames = ingredientsParam.split(',').map(i => i.trim().toLowerCase());
            const matchedIds: number[] = [];

            for (const ing of data) {
              if (ingredientNames.some(name => ing.name.toLowerCase().includes(name) || name.includes(ing.name.toLowerCase()))) {
                matchedIds.push(ing.id);
              }
            }

            if (matchedIds.length > 0) {
              setSelectedIngredients(matchedIds);
            }
          }
        }
      } catch (error) {
        console.error('Error loading ingredients:', error);
      } finally {
        setLoadingIngredients(false);
      }
    }
    fetchIngredients();
  }, []);

  // Search recipes when ingredients change
  useEffect(() => {
    if (selectedIngredients.length === 0) {
      setRecipes([]);
      return;
    }

    async function searchRecipes() {
      setLoading(true);
      try {
        const response = await fetch('/api/recipes/by-ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredientIds: selectedIngredients, locale: 'en' }),
        });
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error searching recipes:', error);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(searchRecipes, 300);
    return () => clearTimeout(debounce);
  }, [selectedIngredients]);

  const toggleIngredient = (id: number) => {
    setSelectedIngredients(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const clearAll = () => {
    setSelectedIngredients([]);
    setSearchTerm('');
  };

  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by first letter
  const groupedIngredients = filteredIngredients.reduce((acc, ing) => {
    const letter = ing.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black py-6 md:py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Refrigerator className="w-4 h-4 md:w-5 md:h-5 text-[#F77313]" />
              <span className="text-[#F77313] text-[10px] md:text-xs font-medium uppercase tracking-widest">
                In my fridge
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-3 md:mb-4">
              What can I cook?
            </h1>
            <p className="text-neutral-400 text-sm md:text-base lg:text-lg leading-relaxed">
              Select the ingredients you have on hand and discover
              the recipes you can prepare.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Ingredients */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20 bg-neutral-50 border border-neutral-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-black">
                  My ingredients
                </h2>
                {selectedIngredients.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-neutral-500 hover:text-[#F77313] transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Current selection */}
              {selectedIngredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-neutral-200">
                  {selectedIngredients.map(id => {
                    const ing = ingredients.find(i => i.id === id);
                    return ing ? (
                      <button
                        key={id}
                        onClick={() => toggleIngredient(id)}
                        className="inline-flex items-center gap-1 bg-[#F77313] text-white text-sm px-3 py-1"
                      >
                        {ing.name}
                        <X className="w-3 h-3" />
                      </button>
                    ) : null;
                  })}
                </div>
              )}

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search an ingredient..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 focus:border-[#F77313] focus:ring-1 focus:ring-[#F77313] outline-none text-sm"
                />
              </div>

              {/* Ingredients list */}
              <div className="max-h-[60vh] overflow-y-auto">
                {loadingIngredients ? (
                  <div className="text-center py-8 text-neutral-500">
                    Loading...
                  </div>
                ) : Object.keys(groupedIngredients).length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    {ingredients.length === 0
                      ? 'No ingredients available. Run Job 3 to index ingredients.'
                      : 'No ingredient found'}
                  </div>
                ) : (
                  Object.entries(groupedIngredients)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([letter, ings]) => (
                      <div key={letter} className="mb-4">
                        <div className="text-xs font-bold text-neutral-400 uppercase mb-2">
                          {letter}
                        </div>
                        <div className="space-y-1">
                          {ings.map(ing => (
                            <button
                              key={ing.id}
                              onClick={() => toggleIngredient(ing.id)}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                                selectedIngredients.includes(ing.id)
                                  ? 'bg-[#F77313]/10 text-[#F77313]'
                                  : 'hover:bg-neutral-100'
                              }`}
                            >
                              {ing.name}
                              {selectedIngredients.includes(ing.id) && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </aside>

          {/* Results */}
          <section className="lg:col-span-2">
            {selectedIngredients.length === 0 ? (
              <div className="text-center py-12 md:py-16 bg-neutral-50 border border-neutral-200 rounded-xl">
                <ChefHat className="w-12 h-12 md:w-16 md:h-16 text-neutral-300 mx-auto mb-3 md:mb-4" />
                <h3 className="font-display text-xl md:text-2xl text-neutral-400 mb-2 px-4">
                  Select your ingredients
                </h3>
                <p className="text-sm md:text-base text-neutral-500 px-4">
                  <span className="md:hidden">Use the button below to choose your ingredients</span>
                  <span className="hidden md:inline">Choose at least one ingredient from the list on the left</span>
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-12 md:py-16">
                <div className="animate-spin w-8 h-8 border-2 border-[#F77313] border-t-transparent rounded-full mx-auto mb-3 md:mb-4" />
                <p className="text-sm md:text-base text-neutral-500">Searching...</p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12 md:py-16 bg-neutral-50 border border-neutral-200 rounded-xl">
                <ChefHat className="w-12 h-12 md:w-16 md:h-16 text-neutral-300 mx-auto mb-3 md:mb-4" />
                <h3 className="font-display text-xl md:text-2xl text-neutral-400 mb-2 px-4">
                  No recipes found
                </h3>
                <p className="text-sm md:text-base text-neutral-500 px-4">
                  Try adding more ingredients
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 md:mb-6">
                  <h2 className="font-display text-xl md:text-2xl text-black">
                    {recipes.length} possible recipe{recipes.length > 1 ? 's' : ''}
                  </h2>
                  <span className="text-xs md:text-sm text-neutral-500">
                    Sorted by match
                  </span>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {recipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={`/en/recipe/${recipe.slug}`}
                      className="group flex gap-3 md:gap-4 p-3 md:p-4 border border-neutral-200 hover:border-[#F77313] transition-colors rounded-lg md:rounded-none"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 md:w-32 md:h-32 flex-shrink-0 bg-neutral-100 rounded-lg md:rounded-none overflow-hidden">
                        {recipe.featuredImage ? (
                          <Image
                            src={recipe.featuredImage}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-neutral-300" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 py-0.5 md:py-1">
                        <h3 className="font-display text-base md:text-xl text-black group-hover:text-[#F77313] transition-colors mb-1.5 md:mb-2 line-clamp-2">
                          {recipe.title}
                        </h3>

                        {/* Match indicator */}
                        <div className="mb-2 md:mb-3">
                          <div className="flex items-center gap-2 text-xs md:text-sm">
                            <div className="flex-1 h-1.5 md:h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#F77313] rounded-full"
                                style={{ width: `${recipe.matchPercentage}%` }}
                              />
                            </div>
                            <span className={`font-bold text-xs md:text-sm ${
                              recipe.matchPercentage >= 80
                                ? 'text-green-600'
                                : recipe.matchPercentage >= 50
                                ? 'text-[#F77313]'
                                : 'text-neutral-500'
                            }`}>
                              {recipe.matchPercentage}%
                            </span>
                          </div>
                          <p className="text-[10px] md:text-xs text-neutral-500 mt-1">
                            {recipe.matchingIngredients}/{recipe.totalIngredients} ingredients
                          </p>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-neutral-500">
                          {recipe.totalTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 md:w-4 md:h-4" />
                              {recipe.totalTime} min
                            </span>
                          )}
                          {recipe.difficulty && (
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 md:w-4 md:h-4" />
                              {recipe.difficulty}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="hidden md:flex items-center flex-shrink-0">
                        <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-[#F77313] group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Ingredient Panel */}
      {showIngredientPanel && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowIngredientPanel(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel Header */}
            <div className="flex-shrink-0 px-4 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl text-black">
                  My ingredients
                </h2>
                <p className="text-sm text-neutral-500">
                  {selectedIngredients.length} selected
                </p>
              </div>
              <button
                onClick={() => setShowIngredientPanel(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Ingredients */}
            {selectedIngredients.length > 0 && (
              <div className="flex-shrink-0 px-4 py-3 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-neutral-500 uppercase">Selection</span>
                  <button
                    onClick={clearAll}
                    className="text-xs text-[#F77313] font-medium"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredients.map(id => {
                    const ing = ingredients.find(i => i.id === id);
                    return ing ? (
                      <button
                        key={id}
                        onClick={() => toggleIngredient(id)}
                        className="inline-flex items-center gap-1 bg-[#F77313] text-white text-sm px-3 py-1.5 rounded-full"
                      >
                        {ing.name}
                        <X className="w-3 h-3" />
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Search */}
            <div className="flex-shrink-0 px-4 py-3 border-b border-neutral-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search an ingredient..."
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-full focus:border-[#F77313] focus:ring-2 focus:ring-[#F77313]/20 outline-none text-sm"
                />
              </div>
            </div>

            {/* Ingredient List */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {loadingIngredients ? (
                <div className="text-center py-8 text-neutral-500">
                  Loading...
                </div>
              ) : Object.keys(groupedIngredients).length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  {ingredients.length === 0
                    ? 'No ingredients available'
                    : 'No ingredient found'}
                </div>
              ) : (
                Object.entries(groupedIngredients)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([letter, ings]) => (
                    <div key={letter} className="mb-4">
                      <div className="text-xs font-bold text-neutral-400 uppercase mb-2 sticky top-0 bg-white py-1">
                        {letter}
                      </div>
                      <div className="space-y-1">
                        {ings.map(ing => (
                          <button
                            key={ing.id}
                            onClick={() => toggleIngredient(ing.id)}
                            className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors flex items-center justify-between ${
                              selectedIngredients.includes(ing.id)
                                ? 'bg-[#F77313]/10 text-[#F77313] font-medium'
                                : 'hover:bg-neutral-50 active:bg-neutral-100'
                            }`}
                          >
                            {ing.name}
                            {selectedIngredients.includes(ing.id) && (
                              <Check className="w-5 h-5" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Apply Button */}
            <div className="flex-shrink-0 px-4 py-4 border-t border-neutral-200 bg-neutral-50">
              <button
                onClick={() => setShowIngredientPanel(false)}
                className="w-full py-3 bg-[#F77313] hover:bg-[#e56610] text-white font-semibold rounded-full transition-colors"
              >
                View {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Button */}
      <button
        onClick={() => setShowIngredientPanel(true)}
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 hover:bg-neutral-900 transition-all"
      >
        <Refrigerator className="w-5 h-5" />
        <span className="font-medium">
          {selectedIngredients.length > 0
            ? `${selectedIngredients.length} ingredient${selectedIngredients.length > 1 ? 's' : ''}`
            : 'Choose my ingredients'}
        </span>
        {selectedIngredients.length > 0 && (
          <span className="bg-[#F77313] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {recipes.length}
          </span>
        )}
      </button>
    </main>
  );
}
