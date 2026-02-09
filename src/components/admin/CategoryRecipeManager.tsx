'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

interface SimpleRecipe {
  id: number;
  title: string;
  slug: string;
  featured_image: string | null;
}

export default function CategoryRecipeManager({
  categoryId,
  initialRecipes,
}: {
  categoryId: number;
  initialRecipes: SimpleRecipe[];
}) {
  const [assigned, setAssigned] = useState<SimpleRecipe[]>(initialRecipes);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SimpleRecipe[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState<number | null>(null);

  const assignedIds = new Set(assigned.map((r) => r.id));

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('recipes')
        .select('id, title, slug, featured_image')
        .ilike('title', `%${searchQuery}%`)
        .order('title')
        .limit(20);
      setSearchResults((data as SimpleRecipe[]) || []);
    } catch {
      // ignore
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (recipe: SimpleRecipe) => {
    setLoading(recipe.id);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: recipe.id }),
      });
      if (!res.ok) throw new Error('Failed');
      setAssigned((prev) => [...prev, recipe]);
    } catch {
      alert('Erreur lors de l\'ajout');
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async (recipeId: number) => {
    if (!confirm('Retirer cette recette de la catégorie?')) return;
    setLoading(recipeId);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}/recipes`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });
      if (!res.ok) throw new Error('Failed');
      setAssigned((prev) => prev.filter((r) => r.id !== recipeId));
    } catch {
      alert('Erreur lors du retrait');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      {/* Assigned Recipes */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Recettes assignées ({assigned.length})
          </h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {assigned.map((recipe) => (
            <li
              key={recipe.id}
              className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center">
                {recipe.featured_image && (
                  <img
                    src={recipe.featured_image}
                    alt=""
                    className="w-10 h-10 rounded object-cover mr-3"
                  />
                )}
                <div>
                  <span className="text-sm font-medium text-gray-900">{recipe.title}</span>
                  <span className="text-xs text-gray-400 ml-2">/{recipe.slug}</span>
                </div>
              </div>
              <button
                onClick={() => handleRemove(recipe.id)}
                disabled={loading === recipe.id}
                className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50"
              >
                {loading === recipe.id ? '...' : 'Retirer'}
              </button>
            </li>
          ))}
          {assigned.length === 0 && (
            <li className="px-6 py-8 text-center text-gray-500 text-sm">
              Aucune recette assignée à cette catégorie
            </li>
          )}
        </ul>
      </div>

      {/* Search and Add */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Ajouter des recettes</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2 mb-4"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une recette par titre..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {searching ? '...' : 'Rechercher'}
          </button>
        </form>

        {searchResults.length > 0 && (
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
            {searchResults.map((recipe) => (
              <li
                key={recipe.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center">
                  {recipe.featured_image && (
                    <img
                      src={recipe.featured_image}
                      alt=""
                      className="w-8 h-8 rounded object-cover mr-3"
                    />
                  )}
                  <span className="text-sm text-gray-900">{recipe.title}</span>
                </div>
                {assignedIds.has(recipe.id) ? (
                  <span className="text-xs text-green-600 font-medium">Déjà assignée</span>
                ) : (
                  <button
                    onClick={() => handleAdd(recipe)}
                    disabled={loading === recipe.id}
                    className="px-3 py-1 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                  >
                    {loading === recipe.id ? '...' : 'Ajouter'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
