'use client';

import { useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import ImageUpload from './ImageUpload';
import type { Database } from '@/types/database';

const TipTapEditor = lazy(() => import('./TipTapEditor'));

interface Ingredient {
  quantity?: string;
  unit?: string;
  name: string;
  note?: string;
}

interface IngredientGroup {
  title?: string;
  items: Ingredient[];
}

interface InstructionStep {
  step: number;
  title?: string;
  content: string;
  image?: string;
  tip?: string;
}

type RecipeRow = Database['public']['Tables']['recipes']['Row'];

interface Category {
  id: number;
  name: string;
  slug: string;
}

function parseIngredients(data: unknown): IngredientGroup[] {
  if (!data || !Array.isArray(data)) {
    return [{ title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] }];
  }
  return data.map((group: any) => {
    if (group.items && Array.isArray(group.items)) {
      return {
        title: group.title || group.group || '',
        items: group.items.map((item: any) => {
          if (typeof item === 'string') return { name: item, quantity: '', unit: '', note: '' };
          return { quantity: item.quantity || '', unit: item.unit || '', name: item.name || '', note: item.note || '' };
        }),
      };
    }
    if (Array.isArray(group)) {
      return { title: '', items: group.map((item: string) => ({ name: item, quantity: '', unit: '', note: '' })) };
    }
    return { title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] };
  });
}

function parseInstructions(data: unknown): InstructionStep[] {
  if (!data || !Array.isArray(data)) {
    return [{ step: 1, content: '', title: '', image: '', tip: '' }];
  }
  return data.map((item: any, index: number) => {
    if (typeof item === 'string') return { step: index + 1, content: item, title: '', image: '', tip: '' };
    return { step: item.step || index + 1, title: item.title || '', content: item.content || '', image: item.image || '', tip: item.tip || '' };
  });
}

export default function RecipeEditForm({
  recipe,
  categories,
}: {
  recipe: RecipeRow;
  categories: Category[];
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: recipe.title,
    slug: recipe.slug,
    excerpt: recipe.excerpt || '',
    content: recipe.content || '',
    introduction: recipe.introduction || '',
    conclusion: recipe.conclusion || '',
    featured_image: recipe.featured_image || '',
    pinterest_image: (recipe as any).pinterest_image || '',
    video_url: recipe.video_url || '',
    prep_time: recipe.prep_time,
    cook_time: recipe.cook_time,
    rest_time: recipe.rest_time || 0,
    servings: recipe.servings,
    servings_unit: recipe.servings_unit || 'servings',
    difficulty: recipe.difficulty,
    ingredients: parseIngredients(recipe.ingredients),
    instructions: parseInstructions(recipe.instructions),
    tags: recipe.tags || [],
    cuisine: recipe.cuisine || '',
    seo_title: recipe.seo_title || '',
    seo_description: recipe.seo_description || '',
  });

  const [tagsInput, setTagsInput] = useState((recipe.tags || []).join(', '));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Ingredient handlers
  const handleIngredientChange = (groupIndex: number, itemIndex: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...form.ingredients];
    newIngredients[groupIndex].items[itemIndex] = { ...newIngredients[groupIndex].items[itemIndex], [field]: value };
    setForm({ ...form, ingredients: newIngredients });
  };

  const addIngredientItem = (groupIndex: number) => {
    const newIngredients = [...form.ingredients];
    newIngredients[groupIndex].items.push({ name: '', quantity: '', unit: '', note: '' });
    setForm({ ...form, ingredients: newIngredients });
  };

  const removeIngredientItem = (groupIndex: number, itemIndex: number) => {
    const newIngredients = [...form.ingredients];
    newIngredients[groupIndex].items.splice(itemIndex, 1);
    if (newIngredients[groupIndex].items.length === 0) {
      newIngredients[groupIndex].items = [{ name: '', quantity: '', unit: '', note: '' }];
    }
    setForm({ ...form, ingredients: newIngredients });
  };

  const addIngredientGroup = () => {
    setForm({ ...form, ingredients: [...form.ingredients, { title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] }] });
  };

  const removeIngredientGroup = (groupIndex: number) => {
    const newIngredients = form.ingredients.filter((_, i) => i !== groupIndex);
    if (newIngredients.length === 0) newIngredients.push({ title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] });
    setForm({ ...form, ingredients: newIngredients });
  };

  // Instruction handlers
  const handleInstructionChange = (index: number, field: keyof InstructionStep, value: string | number) => {
    const newInstructions = [...form.instructions];
    newInstructions[index] = { ...newInstructions[index], [field]: value };
    setForm({ ...form, instructions: newInstructions });
  };

  const addInstruction = () => {
    setForm({ ...form, instructions: [...form.instructions, { step: form.instructions.length + 1, content: '', title: '', image: '', tip: '' }] });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = form.instructions.filter((_, i) => i !== index);
    newInstructions.forEach((inst, i) => (inst.step = i + 1));
    if (newInstructions.length === 0) newInstructions.push({ step: 1, content: '', title: '', image: '', tip: '' });
    setForm({ ...form, instructions: newInstructions });
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

      const cleanIngredients = form.ingredients
        .map(group => ({ title: group.title, items: group.items.filter(item => item.name.trim()) }))
        .filter(group => group.items.length > 0);

      const cleanInstructions = form.instructions
        .filter(inst => inst.content.trim())
        .map((inst, i) => ({ ...inst, step: i + 1 }));

      const recipeData = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content || null,
        introduction: form.introduction || null,
        conclusion: form.conclusion || null,
        featured_image: form.featured_image || null,
        pinterest_image: form.pinterest_image || null,
        video_url: form.video_url || null,
        prep_time: form.prep_time,
        cook_time: form.cook_time,
        rest_time: form.rest_time || null,
        total_time: form.prep_time + form.cook_time + (form.rest_time || 0),
        servings: form.servings,
        servings_unit: form.servings_unit || null,
        difficulty: form.difficulty,
        ingredients: cleanIngredients,
        instructions: cleanInstructions,
        tags: form.tags.length > 0 ? form.tags : null,
        cuisine: form.cuisine || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        updated_at: new Date().toISOString(),
      };

      const response = await fetch(`/api/admin/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeData }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error updating recipe');

      setSuccess('Recipe updated!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

      {/* Top Save Button */}
      <div className="flex justify-end gap-4 bg-white p-4 rounded-lg shadow border">
        <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-[#00bf63] text-white rounded-md hover:bg-[#00a855] disabled:opacity-50">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Basic Info */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">/recipe/</span>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
            <Suspense fallback={<div className="h-32 bg-gray-100 rounded-md animate-pulse" />}>
              <TipTapEditor content={form.introduction} onChange={(value) => setForm({ ...form, introduction: value })} placeholder="Introduction text..." minHeight="120px" />
            </Suspense>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tips / Additional Content</label>
            <Suspense fallback={<div className="h-32 bg-gray-100 rounded-md animate-pulse" />}>
              <TipTapEditor content={form.content} onChange={(value) => setForm({ ...form, content: value })} placeholder="Tips and advice..." minHeight="120px" />
            </Suspense>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
            <Suspense fallback={<div className="h-24 bg-gray-100 rounded-md animate-pulse" />}>
              <TipTapEditor content={form.conclusion} onChange={(value) => setForm({ ...form, conclusion: value })} placeholder="Conclusion text..." minHeight="80px" />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            <ImageUpload value={form.featured_image} onChange={(url) => setForm({ ...form, featured_image: url })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pinterest Image (vertical 2:3)
              <span className="text-gray-400 font-normal ml-2">1000x1500px recommended</span>
            </label>
            <ImageUpload value={form.pinterest_image} onChange={(url) => setForm({ ...form, pinterest_image: url })} pinterest />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL</label>
          <input type="url" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
      </section>

      {/* Time & Servings */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Time & Servings</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prep (min)</label>
            <input type="number" min="0" value={form.prep_time} onChange={(e) => setForm({ ...form, prep_time: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cook (min)</label>
            <input type="number" min="0" value={form.cook_time} onChange={(e) => setForm({ ...form, cook_time: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rest (min)</label>
            <input type="number" min="0" value={form.rest_time} onChange={(e) => setForm({ ...form, rest_time: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
            <div className="flex gap-2">
              <input type="number" min="1" value={form.servings} onChange={(e) => setForm({ ...form, servings: parseInt(e.target.value) || 1 })} className="w-16 px-3 py-2 border border-gray-300 rounded-md" />
              <input type="text" value={form.servings_unit} onChange={(e) => setForm({ ...form, servings_unit: e.target.value })} className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as RecipeRow['difficulty'] })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Ingredients</h2>
        <div className="space-y-4">
          {form.ingredients.map((group, groupIndex) => (
            <div key={groupIndex} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2 mb-3">
                <input type="text" value={group.title || ''} onChange={(e) => { const n = [...form.ingredients]; n[groupIndex].title = e.target.value; setForm({ ...form, ingredients: n }); }} placeholder="Group name (optional, e.g. For the sauce)" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                {form.ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredientGroup(groupIndex)} className="px-3 py-2 text-red-600 hover:text-red-500 text-sm">Remove group</button>
                )}
              </div>
              {group.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2 mb-2">
                  <input type="text" value={item.quantity || ''} onChange={(e) => handleIngredientChange(groupIndex, itemIndex, 'quantity', e.target.value)} placeholder="Qty" className="w-16 px-2 py-2 border border-gray-300 rounded-md text-sm" />
                  <input type="text" value={item.unit || ''} onChange={(e) => handleIngredientChange(groupIndex, itemIndex, 'unit', e.target.value)} placeholder="Unit" className="w-20 px-2 py-2 border border-gray-300 rounded-md text-sm" />
                  <input type="text" value={item.name} onChange={(e) => handleIngredientChange(groupIndex, itemIndex, 'name', e.target.value)} placeholder="Ingredient (e.g. ground beef)" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                  <input type="text" value={item.note || ''} onChange={(e) => handleIngredientChange(groupIndex, itemIndex, 'note', e.target.value)} placeholder="Note" className="w-32 px-2 py-2 border border-gray-300 rounded-md text-sm" />
                  <button type="button" onClick={() => removeIngredientItem(groupIndex, itemIndex)} className="px-2 py-2 text-gray-400 hover:text-red-500">x</button>
                </div>
              ))}
              <button type="button" onClick={() => addIngredientItem(groupIndex)} className="text-sm text-[#00bf63] hover:text-[#00a855]">+ Add ingredient</button>
            </div>
          ))}
          <button type="button" onClick={addIngredientGroup} className="text-sm text-gray-600 hover:text-gray-800">+ Add ingredient group</button>
        </div>
      </section>

      {/* Instructions */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Instructions</h2>
        <div className="space-y-4">
          {form.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-[#00bf63] rounded-full flex items-center justify-center text-sm font-medium">{instruction.step}</span>
              <div className="flex-1 space-y-2">
                <input type="text" value={instruction.title || ''} onChange={(e) => handleInstructionChange(index, 'title', e.target.value)} placeholder="Step title (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                <textarea rows={2} value={instruction.content} onChange={(e) => handleInstructionChange(index, 'content', e.target.value)} placeholder="Step description..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={instruction.image || ''} onChange={(e) => handleInstructionChange(index, 'image', e.target.value)} placeholder="Image URL (optional)" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
                  <input type="text" value={instruction.tip || ''} onChange={(e) => handleInstructionChange(index, 'tip', e.target.value)} placeholder="Pro tip (optional)" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
              </div>
              <button type="button" onClick={() => removeInstruction(index)} className="px-2 py-2 text-gray-400 hover:text-red-500">x</button>
            </div>
          ))}
          <button type="button" onClick={addInstruction} className="text-sm text-[#00bf63] hover:text-[#00a855]">+ Add step</button>
        </div>
      </section>

      {/* Tags & SEO */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Tags & SEO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input type="text" value={tagsInput} onChange={(e) => handleTagsChange(e.target.value)} placeholder="quick, budget, vegetarian" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
            <input type="text" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input type="text" maxLength={60} value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            <p className="text-xs text-gray-500 mt-1">{form.seo_title.length}/60</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
            <textarea rows={2} maxLength={160} value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            <p className="text-xs text-gray-500 mt-1">{form.seo_description.length}/160</p>
          </div>
        </div>
      </section>

      {/* Bottom Save */}
      <div className="flex justify-end gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
        <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-[#00bf63] text-white rounded-md hover:bg-[#00a855] disabled:opacity-50">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
