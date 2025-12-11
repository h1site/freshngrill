'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { extractIngredientsFromRecipe } from '@/lib/ingredient-extractor';
import type { Database } from '@/types/database';

type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];

interface IngredientGroup {
  group: string;
  items: string[];
}

interface RecipeForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  prep_time: number;
  cook_time: number;
  rest_time: number;
  servings: number;
  servings_unit: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  ingredients: IngredientGroup[];
  instructions: string[];
  tags: string[];
  cuisine: string;
  seo_title: string;
  seo_description: string;
}

const defaultForm: RecipeForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image: '',
  prep_time: 0,
  cook_time: 0,
  rest_time: 0,
  servings: 4,
  servings_unit: 'portions',
  difficulty: 'moyen',
  ingredients: [{ group: '', items: [''] }],
  instructions: [''],
  tags: [],
  cuisine: '',
  seo_title: '',
  seo_description: '',
};

export default function ImportRecipePage() {
  const router = useRouter();
  const [form, setForm] = useState<RecipeForm>(defaultForm);
  const [tagsInput, setTagsInput] = useState('');
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setForm({
      ...form,
      title,
      slug: generateSlug(title),
      seo_title: title.length <= 60 ? title : form.seo_title,
    });
  };

  const handleIngredientsChange = (groupIndex: number, itemIndex: number, value: string) => {
    const newIngredients = [...form.ingredients];
    newIngredients[groupIndex].items[itemIndex] = value;
    setForm({ ...form, ingredients: newIngredients });
    updateDetectedIngredients(newIngredients);
  };

  const addIngredientItem = (groupIndex: number) => {
    const newIngredients = [...form.ingredients];
    newIngredients[groupIndex].items.push('');
    setForm({ ...form, ingredients: newIngredients });
  };

  const removeIngredientItem = (groupIndex: number, itemIndex: number) => {
    const newIngredients = [...form.ingredients];
    newIngredients[groupIndex].items.splice(itemIndex, 1);
    if (newIngredients[groupIndex].items.length === 0) {
      newIngredients[groupIndex].items = [''];
    }
    setForm({ ...form, ingredients: newIngredients });
    updateDetectedIngredients(newIngredients);
  };

  const addIngredientGroup = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, { group: '', items: [''] }],
    });
  };

  const removeIngredientGroup = (groupIndex: number) => {
    const newIngredients = form.ingredients.filter((_, i) => i !== groupIndex);
    if (newIngredients.length === 0) {
      newIngredients.push({ group: '', items: [''] });
    }
    setForm({ ...form, ingredients: newIngredients });
    updateDetectedIngredients(newIngredients);
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...form.instructions];
    newInstructions[index] = value;
    setForm({ ...form, instructions: newInstructions });
  };

  const addInstruction = () => {
    setForm({ ...form, instructions: [...form.instructions, ''] });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = form.instructions.filter((_, i) => i !== index);
    if (newInstructions.length === 0) {
      newInstructions.push('');
    }
    setForm({ ...form, instructions: newInstructions });
  };

  const updateDetectedIngredients = (ingredients: IngredientGroup[]) => {
    const detected = extractIngredientsFromRecipe(ingredients);
    setDetectedIngredients(detected);
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value.split(',').map(t => t.trim()).filter(t => t);
    setForm({ ...form, tags });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();

      // Préparer les données
      const recipeData: RecipeInsert = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content || null,
        featured_image: form.featured_image || null,
        prep_time: form.prep_time,
        cook_time: form.cook_time,
        rest_time: form.rest_time || null,
        total_time: form.prep_time + form.cook_time + (form.rest_time || 0),
        servings: form.servings,
        servings_unit: form.servings_unit || null,
        difficulty: form.difficulty,
        ingredients: form.ingredients.filter(g => g.items.some(i => i.trim())) as unknown as Database['public']['Tables']['recipes']['Insert']['ingredients'],
        instructions: form.instructions.filter(i => i.trim()) as unknown as Database['public']['Tables']['recipes']['Insert']['instructions'],
        tags: form.tags.length > 0 ? form.tags : null,
        cuisine: form.cuisine || null,
        author: 'Menu Cochon',
        published_at: new Date().toISOString(),
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
      };

      // Insérer la recette
      const { data: recipeResult, error: recipeError } = await supabase
        .from('recipes')
        .insert(recipeData as never)
        .select('id')
        .single();

      if (recipeError) throw recipeError;

      const recipeId = (recipeResult as { id: number } | null)?.id;

      // Lier les ingrédients détectés
      if (detectedIngredients.length > 0 && recipeId) {
        for (const ingredientName of detectedIngredients) {
          // Chercher ou créer l'ingrédient
          const { data: ingredientResult } = await supabase
            .from('ingredients')
            .select('id')
            .eq('name', ingredientName)
            .single();

          let ingredientId = (ingredientResult as { id: number } | null)?.id;

          if (!ingredientId) {
            const { data: newIngredient } = await supabase
              .from('ingredients')
              .insert({
                name: ingredientName,
                slug: ingredientName.toLowerCase().replace(/\s+/g, '-'),
              } as never)
              .select('id')
              .single();
            ingredientId = (newIngredient as { id: number } | null)?.id;
          }

          if (ingredientId) {
            await supabase.from('recipe_ingredients').insert({
              recipe_id: recipeId,
              ingredient_id: ingredientId,
            } as never);
          }
        }
      }

      setSuccess('Recette importée avec succès!');
      setForm(defaultForm);
      setTagsInput('');
      setDetectedIngredients([]);

      setTimeout(() => {
        router.push('/admin/recettes');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Importer une recette</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Informations de base */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Informations de base</h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL)
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">/recette/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extrait / Description courte
              </label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenu / Introduction
              </label>
              <textarea
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image principale (URL)
              </label>
              <input
                type="url"
                value={form.featured_image}
                onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        {/* Temps et portions */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Temps et portions</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Préparation (min)
              </label>
              <input
                type="number"
                min="0"
                value={form.prep_time}
                onChange={(e) => setForm({ ...form, prep_time: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisson (min)
              </label>
              <input
                type="number"
                min="0"
                value={form.cook_time}
                onChange={(e) => setForm({ ...form, cook_time: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repos (min)
              </label>
              <input
                type="number"
                min="0"
                value={form.rest_time}
                onChange={(e) => setForm({ ...form, rest_time: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portions
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={form.servings}
                  onChange={(e) => setForm({ ...form, servings: parseInt(e.target.value) || 1 })}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                  type="text"
                  value={form.servings_unit}
                  onChange={(e) => setForm({ ...form, servings_unit: e.target.value })}
                  placeholder="portions"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulté
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value as RecipeForm['difficulty'] })}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>
        </section>

        {/* Ingrédients */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Ingrédients</h2>
            <button
              type="button"
              onClick={addIngredientGroup}
              className="text-sm text-orange-600 hover:text-orange-500"
            >
              + Ajouter un groupe
            </button>
          </div>

          {form.ingredients.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={group.group}
                  onChange={(e) => {
                    const newIngredients = [...form.ingredients];
                    newIngredients[groupIndex].group = e.target.value;
                    setForm({ ...form, ingredients: newIngredients });
                  }}
                  placeholder="Nom du groupe (optionnel, ex: Pour la sauce)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
                {form.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientGroup(groupIndex)}
                    className="px-3 py-2 text-red-600 hover:text-red-500"
                  >
                    Supprimer groupe
                  </button>
                )}
              </div>

              {group.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleIngredientsChange(groupIndex, itemIndex, e.target.value)}
                    placeholder="ex: 500g de boeuf haché"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredientItem(groupIndex, itemIndex)}
                    className="px-3 py-2 text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addIngredientItem(groupIndex)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                + Ajouter un ingrédient
              </button>
            </div>
          ))}

          {/* Ingrédients détectés */}
          {detectedIngredients.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                Ingrédients détectés automatiquement ({detectedIngredients.length}):
              </h3>
              <div className="flex flex-wrap gap-2">
                {detectedIngredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Instructions */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Instructions</h2>

          {form.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <textarea
                rows={2}
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                placeholder="Décrivez cette étape..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="px-3 py-2 text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addInstruction}
            className="text-sm text-orange-600 hover:text-orange-500"
          >
            + Ajouter une étape
          </button>
        </section>

        {/* Tags et cuisine */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Tags et cuisine</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="rapide, économique, végétarien"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine / Origine
              </label>
              <input
                type="text"
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                placeholder="Française, Italienne, Québécoise..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </section>

        {/* SEO */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">SEO</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre SEO (max 60 caractères)
              </label>
              <input
                type="text"
                maxLength={60}
                value={form.seo_title}
                onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">{form.seo_title.length}/60</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description SEO (max 160 caractères)
              </label>
              <textarea
                rows={2}
                maxLength={160}
                value={form.seo_description}
                onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">{form.seo_description.length}/160</p>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Import en cours...' : 'Importer la recette'}
          </button>
        </div>
      </form>
    </div>
  );
}
