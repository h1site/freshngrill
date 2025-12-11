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

export default function FrigoPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<RecipeMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  // Charger les ingrédients au mount
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await fetch('/api/ingredients');
        const data = await response.json();
        setIngredients(data);
      } catch (error) {
        console.error('Erreur chargement ingrédients:', error);
      } finally {
        setLoadingIngredients(false);
      }
    }
    fetchIngredients();
  }, []);

  // Chercher les recettes quand les ingrédients changent
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
          body: JSON.stringify({ ingredientIds: selectedIngredients }),
        });
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Erreur recherche recettes:', error);
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

  // Grouper par première lettre
  const groupedIngredients = filteredIngredients.reduce((acc, ing) => {
    const letter = ing.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Refrigerator className="w-6 h-6 text-[#F77313]" />
              <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                Dans mon frigo
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Qu'est-ce que je peux cuisiner?
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Sélectionnez les ingrédients que vous avez sous la main et découvrez
              les recettes que vous pouvez préparer.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Ingrédients */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 bg-neutral-50 border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-black">
                  Mes ingrédients
                </h2>
                {selectedIngredients.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-neutral-500 hover:text-[#F77313] transition-colors"
                  >
                    Tout effacer
                  </button>
                )}
              </div>

              {/* Sélection actuelle */}
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

              {/* Recherche */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un ingrédient..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 focus:border-[#F77313] focus:ring-1 focus:ring-[#F77313] outline-none text-sm"
                />
              </div>

              {/* Liste des ingrédients */}
              <div className="max-h-[60vh] overflow-y-auto">
                {loadingIngredients ? (
                  <div className="text-center py-8 text-neutral-500">
                    Chargement...
                  </div>
                ) : Object.keys(groupedIngredients).length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    {ingredients.length === 0
                      ? 'Aucun ingrédient disponible. Lancez le Job 3 pour indexer les ingrédients.'
                      : 'Aucun ingrédient trouvé'}
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

          {/* Résultats */}
          <section className="lg:col-span-2">
            {selectedIngredients.length === 0 ? (
              <div className="text-center py-16 bg-neutral-50 border border-neutral-200">
                <ChefHat className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-display text-2xl text-neutral-400 mb-2">
                  Sélectionnez vos ingrédients
                </h3>
                <p className="text-neutral-500">
                  Choisissez au moins un ingrédient dans la liste à gauche
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-2 border-[#F77313] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-neutral-500">Recherche en cours...</p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-16 bg-neutral-50 border border-neutral-200">
                <ChefHat className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-display text-2xl text-neutral-400 mb-2">
                  Aucune recette trouvée
                </h3>
                <p className="text-neutral-500">
                  Essayez d'ajouter plus d'ingrédients
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-black">
                    {recipes.length} recette{recipes.length > 1 ? 's' : ''} possible{recipes.length > 1 ? 's' : ''}
                  </h2>
                  <span className="text-sm text-neutral-500">
                    Triées par correspondance
                  </span>
                </div>

                <div className="space-y-4">
                  {recipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={`/recette/${recipe.slug}`}
                      className="group flex gap-4 p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
                    >
                      {/* Image */}
                      <div className="relative w-32 h-32 flex-shrink-0 bg-neutral-100">
                        {recipe.featuredImage ? (
                          <Image
                            src={recipe.featuredImage}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ChefHat className="w-8 h-8 text-neutral-300" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 py-1">
                        <h3 className="font-display text-xl text-black group-hover:text-[#F77313] transition-colors mb-2">
                          {recipe.title}
                        </h3>

                        {/* Match indicator */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex-1 h-2 bg-neutral-200 overflow-hidden">
                              <div
                                className="h-full bg-[#F77313]"
                                style={{ width: `${recipe.matchPercentage}%` }}
                              />
                            </div>
                            <span className={`font-medium ${
                              recipe.matchPercentage >= 80
                                ? 'text-green-600'
                                : recipe.matchPercentage >= 50
                                ? 'text-[#F77313]'
                                : 'text-neutral-500'
                            }`}>
                              {recipe.matchPercentage}%
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">
                            {recipe.matchingIngredients}/{recipe.totalIngredients} ingrédients
                          </p>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                          {recipe.totalTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {recipe.totalTime} min
                            </span>
                          )}
                          {recipe.difficulty && (
                            <span className="flex items-center gap-1">
                              <Flame className="w-4 h-4" />
                              {recipe.difficulty}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center">
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
    </main>
  );
}
