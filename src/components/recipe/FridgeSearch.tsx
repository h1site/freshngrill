'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Refrigerator, X, Plus, Search, Percent } from 'lucide-react';
import { searchByIngredients, RecipeWithMatchScore } from '@/lib/recipes';
import RecipeCard from './RecipeCard';

interface FridgeSearchProps {
  allIngredients: string[];
  onResultsChange?: (hasResults: boolean) => void;
}

export default function FridgeSearch({ allIngredients, onResultsChange }: FridgeSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<RecipeWithMatchScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrer les suggestions basées sur l'input
  useEffect(() => {
    if (searchInput.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = allIngredients
      .filter(ing =>
        ing.includes(searchInput.toLowerCase()) &&
        !selectedIngredients.includes(ing)
      )
      .slice(0, 8);

    setSuggestions(filtered);
  }, [searchInput, allIngredients, selectedIngredients]);

  // Chercher les recettes quand les ingrédients changent
  const searchRecipes = useCallback(async () => {
    if (selectedIngredients.length === 0) {
      setResults([]);
      onResultsChange?.(false);
      return;
    }

    setIsLoading(true);
    try {
      const recipes = await searchByIngredients(selectedIngredients);
      setResults(recipes);
      onResultsChange?.(recipes.length > 0);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedIngredients, onResultsChange]);

  useEffect(() => {
    searchRecipes();
  }, [searchRecipes]);

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    setSearchInput('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchInput.length >= 2) {
      // Ajouter le premier suggestion ou l'input lui-même
      const toAdd = suggestions[0] || searchInput.toLowerCase().trim();
      if (toAdd && !selectedIngredients.includes(toAdd)) {
        addIngredient(toAdd);
      }
    }
  };

  const clearAll = () => {
    setSelectedIngredients([]);
    setResults([]);
    setSearchInput('');
    onResultsChange?.(false);
  };

  return (
    <div className="mb-8">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-6 py-4 w-full md:w-auto font-medium text-sm uppercase tracking-wide transition-all border-2 ${
          isOpen || selectedIngredients.length > 0
            ? 'bg-[#F77313] text-white border-[#F77313]'
            : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#F77313]'
        }`}
      >
        <Refrigerator className="w-5 h-5" />
        Qu&apos;est-ce que j&apos;ai dans le frigo?
        {selectedIngredients.length > 0 && (
          <span className="bg-white text-[#F77313] text-xs font-bold px-2 py-0.5 rounded-full ml-2">
            {selectedIngredients.length}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-neutral-50 border border-neutral-200 p-6 mt-4">
              {/* Instructions */}
              <p className="text-neutral-600 text-sm mb-4">
                Ajoutez les ingrédients que vous avez. Plus vous en ajoutez, plus les résultats seront précis!
              </p>

              {/* Input avec suggestions */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tapez un ingrédient (ex: poulet, tomate, fromage...)"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-neutral-200 focus:border-[#F77313] focus:outline-none text-sm rounded-lg"
                />

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => addIngredient(suggestion)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[#F77313]/10 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4 text-[#F77313]" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected ingredients */}
              {selectedIngredients.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                      Vos ingrédients ({selectedIngredients.length})
                    </span>
                    <button
                      onClick={clearAll}
                      className="text-xs text-neutral-500 hover:text-red-500 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Tout effacer
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="inline-flex items-center gap-1.5 bg-[#F77313] text-white px-3 py-1.5 text-sm rounded-full"
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
                  </div>
                </div>
              )}

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F77313]" />
                </div>
              )}

              {/* Results */}
              {!isLoading && results.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-neutral-200">
                    <span className="text-sm font-medium text-neutral-700">
                      {results.length} recette{results.length > 1 ? 's' : ''} trouvée{results.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.slice(0, 9).map((recipe, index) => (
                      <div key={recipe.id} className="relative">
                        {/* Badge de match */}
                        <div className="absolute top-2 right-2 z-10 bg-white text-neutral-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md border border-neutral-200">
                          <Percent className="w-3 h-3" />
                          {recipe.matchScore}%
                        </div>
                        <RecipeCard
                          recipe={{
                            id: recipe.id,
                            slug: recipe.slug,
                            title: recipe.title,
                            featuredImage: recipe.featuredImage,
                            prepTime: recipe.prepTime,
                            cookTime: recipe.cookTime,
                            totalTime: recipe.totalTime,
                            difficulty: recipe.difficulty,
                            categories: recipe.categories,
                            likes: recipe.likes,
                          }}
                          index={index}
                        />
                        {/* Ingrédients matchés */}
                        <div className="mt-2 text-xs text-neutral-500">
                          <span className="font-medium text-neutral-700">
                            {recipe.matchedIngredients.length}/{recipe.totalIngredients}
                          </span>
                          {' '}ingrédients disponibles
                        </div>
                      </div>
                    ))}
                  </div>

                  {results.length > 9 && (
                    <p className="text-center text-sm text-neutral-500 mt-4">
                      Et {results.length - 9} autres recettes...
                    </p>
                  )}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && selectedIngredients.length > 0 && results.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <Refrigerator className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Aucune recette trouvée avec ces ingrédients.</p>
                  <p className="text-sm">Essayez d&apos;ajouter d&apos;autres ingrédients!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
