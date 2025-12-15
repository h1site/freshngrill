'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import ImageUpload from './ImageUpload';
import type { Database } from '@/types/database';

// Types pour les ingrédients et instructions
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

interface TranslationData {
  id?: number;
  slug_en: string;
  title: string;
  excerpt: string;
  introduction: string;
  conclusion: string;
  content: string;
  ingredients: IngredientGroup[];
  instructions: InstructionStep[];
  faq: string;
  seo_title: string;
  seo_description: string;
}

// Parser les ingrédients depuis JSON
function parseIngredients(data: unknown): IngredientGroup[] {
  if (!data || !Array.isArray(data)) {
    return [{ title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] }];
  }

  return data.map((group: any) => {
    // Si c'est le nouveau format avec items comme objets
    if (group.items && Array.isArray(group.items)) {
      return {
        title: group.title || group.group || '',
        items: group.items.map((item: any) => {
          // Si l'item est une string (ancien format)
          if (typeof item === 'string') {
            return { name: item, quantity: '', unit: '', note: '' };
          }
          // Nouveau format avec objet
          return {
            quantity: item.quantity || '',
            unit: item.unit || '',
            name: item.name || '',
            note: item.note || '',
          };
        }),
      };
    }
    // Format avec juste un tableau de strings
    if (Array.isArray(group)) {
      return {
        title: '',
        items: group.map((item: string) => ({ name: item, quantity: '', unit: '', note: '' })),
      };
    }
    return { title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] };
  });
}

// Parser les instructions depuis JSON
function parseInstructions(data: unknown): InstructionStep[] {
  if (!data || !Array.isArray(data)) {
    return [{ step: 1, content: '', title: '', image: '', tip: '' }];
  }

  return data.map((item: any, index: number) => {
    // Si c'est une string (ancien format simple)
    if (typeof item === 'string') {
      return { step: index + 1, content: item, title: '', image: '', tip: '' };
    }
    // Nouveau format avec objet
    return {
      step: item.step || index + 1,
      title: item.title || '',
      content: item.content || '',
      image: item.image || '',
      tip: item.tip || '',
    };
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
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');

  // Form state - Français (données principales)
  const [form, setForm] = useState({
    title: recipe.title,
    slug: recipe.slug,
    excerpt: recipe.excerpt || '',
    content: recipe.content || '',
    introduction: recipe.introduction || '',
    conclusion: recipe.conclusion || '',
    faq: recipe.faq || '',
    featured_image: recipe.featured_image || '',
    pinterest_image: (recipe as any).pinterest_image || '',
    video_url: recipe.video_url || '',
    prep_time: recipe.prep_time,
    cook_time: recipe.cook_time,
    rest_time: recipe.rest_time || 0,
    servings: recipe.servings,
    servings_unit: recipe.servings_unit || 'portions',
    difficulty: recipe.difficulty,
    ingredients: parseIngredients(recipe.ingredients),
    instructions: parseInstructions(recipe.instructions),
    tags: recipe.tags || [],
    cuisine: recipe.cuisine || '',
    seo_title: recipe.seo_title || '',
    seo_description: recipe.seo_description || '',
  });

  // English translation state
  const [enTranslation, setEnTranslation] = useState<TranslationData>({
    slug_en: '',
    title: '',
    excerpt: '',
    introduction: '',
    conclusion: '',
    content: '',
    ingredients: [{ title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] }],
    instructions: [{ step: 1, content: '', title: '', image: '', tip: '' }],
    faq: '',
    seo_title: '',
    seo_description: '',
  });
  const [hasEnTranslation, setHasEnTranslation] = useState(false);

  const [tagsInput, setTagsInput] = useState((recipe.tags || []).join(', '));
  const [loading, setLoading] = useState(false);
  const [loadingTranslation, setLoadingTranslation] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Charger la traduction anglaise
  useEffect(() => {
    async function loadTranslation() {
      const supabase = createClient();
      const { data } = await supabase
        .from('recipe_translations')
        .select('*')
        .eq('recipe_id', recipe.id)
        .eq('locale', 'en')
        .single();

      if (data) {
        // Cast explicite car les types Supabase ne sont pas définis pour cette table
        const translationData = data as any;
        setHasEnTranslation(true);
        setEnTranslation({
          id: translationData.id,
          slug_en: translationData.slug_en || '',
          title: translationData.title || '',
          excerpt: translationData.excerpt || '',
          introduction: translationData.introduction || '',
          conclusion: translationData.conclusion || '',
          content: translationData.content || '',
          ingredients: parseIngredients(translationData.ingredients),
          instructions: parseInstructions(translationData.instructions),
          faq: translationData.faq || '',
          seo_title: translationData.seo_title || '',
          seo_description: translationData.seo_description || '',
        });
      }
      setLoadingTranslation(false);
    }
    loadTranslation();
  }, [recipe.id]);

  // Handlers pour ingrédients FR
  const handleIngredientChange = (groupIndex: number, itemIndex: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...form.ingredients];
    newIngredients[groupIndex].items[itemIndex] = {
      ...newIngredients[groupIndex].items[itemIndex],
      [field]: value,
    };
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
    setForm({
      ...form,
      ingredients: [...form.ingredients, { title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] }],
    });
  };

  const removeIngredientGroup = (groupIndex: number) => {
    const newIngredients = form.ingredients.filter((_, i) => i !== groupIndex);
    if (newIngredients.length === 0) {
      newIngredients.push({ title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] });
    }
    setForm({ ...form, ingredients: newIngredients });
  };

  // Handlers pour instructions FR
  const handleInstructionChange = (index: number, field: keyof InstructionStep, value: string | number) => {
    const newInstructions = [...form.instructions];
    newInstructions[index] = { ...newInstructions[index], [field]: value };
    setForm({ ...form, instructions: newInstructions });
  };

  const addInstruction = () => {
    setForm({
      ...form,
      instructions: [...form.instructions, { step: form.instructions.length + 1, content: '', title: '', image: '', tip: '' }],
    });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = form.instructions.filter((_, i) => i !== index);
    newInstructions.forEach((inst, i) => (inst.step = i + 1));
    if (newInstructions.length === 0) {
      newInstructions.push({ step: 1, content: '', title: '', image: '', tip: '' });
    }
    setForm({ ...form, instructions: newInstructions });
  };

  // Handlers pour traduction EN - Ingrédients
  const handleEnIngredientChange = (groupIndex: number, itemIndex: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...enTranslation.ingredients];
    newIngredients[groupIndex].items[itemIndex] = {
      ...newIngredients[groupIndex].items[itemIndex],
      [field]: value,
    };
    setEnTranslation({ ...enTranslation, ingredients: newIngredients });
  };

  const addEnIngredientItem = (groupIndex: number) => {
    const newIngredients = [...enTranslation.ingredients];
    newIngredients[groupIndex].items.push({ name: '', quantity: '', unit: '', note: '' });
    setEnTranslation({ ...enTranslation, ingredients: newIngredients });
  };

  const removeEnIngredientItem = (groupIndex: number, itemIndex: number) => {
    const newIngredients = [...enTranslation.ingredients];
    newIngredients[groupIndex].items.splice(itemIndex, 1);
    if (newIngredients[groupIndex].items.length === 0) {
      newIngredients[groupIndex].items = [{ name: '', quantity: '', unit: '', note: '' }];
    }
    setEnTranslation({ ...enTranslation, ingredients: newIngredients });
  };

  const addEnIngredientGroup = () => {
    setEnTranslation({
      ...enTranslation,
      ingredients: [...enTranslation.ingredients, { title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] }],
    });
  };

  const removeEnIngredientGroup = (groupIndex: number) => {
    const newIngredients = enTranslation.ingredients.filter((_, i) => i !== groupIndex);
    if (newIngredients.length === 0) {
      newIngredients.push({ title: '', items: [{ name: '', quantity: '', unit: '', note: '' }] });
    }
    setEnTranslation({ ...enTranslation, ingredients: newIngredients });
  };

  // Handlers pour traduction EN - Instructions
  const handleEnInstructionChange = (index: number, field: keyof InstructionStep, value: string | number) => {
    const newInstructions = [...enTranslation.instructions];
    newInstructions[index] = { ...newInstructions[index], [field]: value };
    setEnTranslation({ ...enTranslation, instructions: newInstructions });
  };

  const addEnInstruction = () => {
    setEnTranslation({
      ...enTranslation,
      instructions: [...enTranslation.instructions, { step: enTranslation.instructions.length + 1, content: '', title: '', image: '', tip: '' }],
    });
  };

  const removeEnInstruction = (index: number) => {
    const newInstructions = enTranslation.instructions.filter((_, i) => i !== index);
    newInstructions.forEach((inst, i) => (inst.step = i + 1));
    if (newInstructions.length === 0) {
      newInstructions.push({ step: 1, content: '', title: '', image: '', tip: '' });
    }
    setEnTranslation({ ...enTranslation, instructions: newInstructions });
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value.split(',').map(t => t.trim()).filter(t => t);
    setForm({ ...form, tags });
  };

  // Copier la structure FR vers EN
  const copyFrToEn = () => {
    setEnTranslation({
      ...enTranslation,
      ingredients: JSON.parse(JSON.stringify(form.ingredients)),
      instructions: JSON.parse(JSON.stringify(form.instructions)),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();

      // Filtrer les ingrédients vides
      const cleanIngredients = form.ingredients
        .map(group => ({
          title: group.title,
          items: group.items.filter(item => item.name.trim()),
        }))
        .filter(group => group.items.length > 0);

      // Filtrer les instructions vides
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
        faq: form.faq || null,
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

      const { error: updateError } = await supabase
        .from('recipes')
        .update(recipeData as never)
        .eq('id', recipe.id);

      if (updateError) throw updateError;

      // Sauvegarder/mettre à jour la traduction anglaise si titre rempli
      if (enTranslation.title.trim()) {
        const cleanEnIngredients = enTranslation.ingredients
          .map(group => ({
            title: group.title,
            items: group.items.filter(item => item.name.trim()),
          }))
          .filter(group => group.items.length > 0);

        const cleanEnInstructions = enTranslation.instructions
          .filter(inst => inst.content.trim())
          .map((inst, i) => ({ ...inst, step: i + 1 }));

        const translationData = {
          recipe_id: recipe.id,
          locale: 'en',
          slug_en: enTranslation.slug_en || null,
          title: enTranslation.title,
          excerpt: enTranslation.excerpt || null,
          introduction: enTranslation.introduction || null,
          conclusion: enTranslation.conclusion || null,
          content: enTranslation.content || null,
          ingredients: cleanEnIngredients.length > 0 ? cleanEnIngredients : null,
          instructions: cleanEnInstructions.length > 0 ? cleanEnInstructions : null,
          faq: enTranslation.faq || null,
          seo_title: enTranslation.seo_title || null,
          seo_description: enTranslation.seo_description || null,
          translated_at: new Date().toISOString(),
        };

        if (hasEnTranslation && enTranslation.id) {
          await supabase
            .from('recipe_translations')
            .update(translationData as never)
            .eq('id', enTranslation.id);
        } else {
          await supabase
            .from('recipe_translations')
            .insert(translationData as never);
          setHasEnTranslation(true);
        }
      }

      setSuccess('Recette mise à jour!');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  // Rendu du formulaire d'ingrédients
  const renderIngredientsForm = (
    ingredients: IngredientGroup[],
    handlers: {
      onChange: (groupIndex: number, itemIndex: number, field: keyof Ingredient, value: string) => void;
      onGroupTitleChange: (groupIndex: number, value: string) => void;
      addItem: (groupIndex: number) => void;
      removeItem: (groupIndex: number, itemIndex: number) => void;
      addGroup: () => void;
      removeGroup: (groupIndex: number) => void;
    }
  ) => (
    <div className="space-y-4">
      {ingredients.map((group, groupIndex) => (
        <div key={groupIndex} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={group.title || ''}
              onChange={(e) => handlers.onGroupTitleChange(groupIndex, e.target.value)}
              placeholder="Nom du groupe (optionnel, ex: Pour la sauce)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            {ingredients.length > 1 && (
              <button type="button" onClick={() => handlers.removeGroup(groupIndex)} className="px-3 py-2 text-red-600 hover:text-red-500 text-sm">
                Supprimer groupe
              </button>
            )}
          </div>

          {group.items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.quantity || ''}
                onChange={(e) => handlers.onChange(groupIndex, itemIndex, 'quantity', e.target.value)}
                placeholder="Qté"
                className="w-16 px-2 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                value={item.unit || ''}
                onChange={(e) => handlers.onChange(groupIndex, itemIndex, 'unit', e.target.value)}
                placeholder="Unité"
                className="w-20 px-2 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                value={item.name}
                onChange={(e) => handlers.onChange(groupIndex, itemIndex, 'name', e.target.value)}
                placeholder="Ingrédient (ex: boeuf haché)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                value={item.note || ''}
                onChange={(e) => handlers.onChange(groupIndex, itemIndex, 'note', e.target.value)}
                placeholder="Note"
                className="w-32 px-2 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button type="button" onClick={() => handlers.removeItem(groupIndex, itemIndex)} className="px-2 py-2 text-gray-400 hover:text-red-500">
                ×
              </button>
            </div>
          ))}

          <button type="button" onClick={() => handlers.addItem(groupIndex)} className="text-sm text-orange-600 hover:text-orange-500">
            + Ajouter un ingrédient
          </button>
        </div>
      ))}

      <button type="button" onClick={handlers.addGroup} className="text-sm text-gray-600 hover:text-gray-800">
        + Ajouter un groupe d&apos;ingrédients
      </button>
    </div>
  );

  // Rendu du formulaire d'instructions
  const renderInstructionsForm = (
    instructions: InstructionStep[],
    handlers: {
      onChange: (index: number, field: keyof InstructionStep, value: string | number) => void;
      add: () => void;
      remove: (index: number) => void;
    }
  ) => (
    <div className="space-y-4">
      {instructions.map((instruction, index) => (
        <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
          <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
            {instruction.step}
          </span>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={instruction.title || ''}
              onChange={(e) => handlers.onChange(index, 'title', e.target.value)}
              placeholder="Titre de l'étape (optionnel)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <textarea
              rows={2}
              value={instruction.content}
              onChange={(e) => handlers.onChange(index, 'content', e.target.value)}
              placeholder="Description de l'étape..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={instruction.image || ''}
                onChange={(e) => handlers.onChange(index, 'image', e.target.value)}
                placeholder="URL image (optionnel)"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                value={instruction.tip || ''}
                onChange={(e) => handlers.onChange(index, 'tip', e.target.value)}
                placeholder="Astuce (optionnel)"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <button type="button" onClick={() => handlers.remove(index)} className="px-2 py-2 text-gray-400 hover:text-red-500">
            ×
          </button>
        </div>
      ))}

      <button type="button" onClick={handlers.add} className="text-sm text-orange-600 hover:text-orange-500">
        + Ajouter une étape
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
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

      {/* Tabs FR/EN */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('fr')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'fr'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Français
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('en')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'en'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          English {hasEnTranslation && '✓'}
        </button>
      </div>

      {loadingTranslation ? (
        <div className="text-center py-8">Chargement...</div>
      ) : activeTab === 'fr' ? (
        <>
          {/* FRANÇAIS - Informations de base */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Informations de base</h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">/recette/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extrait</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
                <textarea
                  rows={3}
                  value={form.introduction}
                  onChange={(e) => setForm({ ...form, introduction: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Texte d'introduction affiché en haut de la recette..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Astuces / Contenu additionnel</label>
                <textarea
                  rows={3}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Astuces et conseils pour réussir la recette..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
                <textarea
                  rows={2}
                  value={form.conclusion}
                  onChange={(e) => setForm({ ...form, conclusion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

            </div>
          </section>

          {/* FAQ - Rich Snippets */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">FAQ (Rich Snippets)</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Format JSON pour les rich snippets Google
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const template = JSON.stringify({
                    id: recipe.id,
                    title_fr: form.title,
                    title_en: enTranslation.title || '',
                    faq: [
                      {
                        question_fr: "Question en français?",
                        answer_fr: "Réponse en français.",
                        question_en: "Question in English?",
                        answer_en: "Answer in English."
                      }
                    ]
                  }, null, 2);
                  setForm({ ...form, faq: template });
                }}
                className="text-sm text-orange-600 hover:text-orange-500"
              >
                Générer template
              </button>
            </div>
            <textarea
              rows={12}
              value={form.faq}
              onChange={(e) => setForm({ ...form, faq: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              placeholder={`{
  "id": ${recipe.id},
  "title_fr": "${form.title}",
  "title_en": "",
  "faq": [
    {
      "question_fr": "Question?",
      "answer_fr": "Réponse.",
      "question_en": "Question?",
      "answer_en": "Answer."
    }
  ]
}`}
            />
            {form.faq && (() => {
              try {
                const parsed = JSON.parse(form.faq);
                const count = parsed.faq?.length || 0;
                return (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ JSON valide - {count} question{count > 1 ? 's' : ''}
                  </p>
                );
              } catch {
                return (
                  <p className="text-xs text-red-600 mt-2">
                    ✗ JSON invalide - vérifiez la syntaxe
                  </p>
                );
              }
            })()}
          </section>

          {/* Images */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Images</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image principale</label>
                <ImageUpload
                  value={form.featured_image}
                  onChange={(url) => setForm({ ...form, featured_image: url })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Pinterest (verticale 2:3)
                  <span className="text-gray-400 font-normal ml-2">1000×1500px recommandé</span>
                </label>
                <ImageUpload
                  value={form.pinterest_image}
                  onChange={(url) => setForm({ ...form, pinterest_image: url })}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Vidéo YouTube</label>
              <input
                type="url"
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </section>

          {/* Temps et portions */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Temps et portions</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Préparation (min)</label>
                <input
                  type="number"
                  min="0"
                  value={form.prep_time}
                  onChange={(e) => setForm({ ...form, prep_time: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisson (min)</label>
                <input
                  type="number"
                  min="0"
                  value={form.cook_time}
                  onChange={(e) => setForm({ ...form, cook_time: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Repos (min)</label>
                <input
                  type="number"
                  min="0"
                  value={form.rest_time}
                  onChange={(e) => setForm({ ...form, rest_time: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portions</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={form.servings}
                    onChange={(e) => setForm({ ...form, servings: parseInt(e.target.value) || 1 })}
                    className="w-16 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={form.servings_unit}
                    onChange={(e) => setForm({ ...form, servings_unit: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value as RecipeRow['difficulty'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="facile">Facile</option>
                  <option value="moyen">Moyen</option>
                  <option value="difficile">Difficile</option>
                </select>
              </div>
            </div>
          </section>

          {/* Ingrédients FR */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Ingrédients</h2>
            {renderIngredientsForm(form.ingredients, {
              onChange: handleIngredientChange,
              onGroupTitleChange: (groupIndex, value) => {
                const newIngredients = [...form.ingredients];
                newIngredients[groupIndex].title = value;
                setForm({ ...form, ingredients: newIngredients });
              },
              addItem: addIngredientItem,
              removeItem: removeIngredientItem,
              addGroup: addIngredientGroup,
              removeGroup: removeIngredientGroup,
            })}
          </section>

          {/* Instructions FR */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Instructions</h2>
            {renderInstructionsForm(form.instructions, {
              onChange: handleInstructionChange,
              add: addInstruction,
              remove: removeInstruction,
            })}
          </section>

          {/* Tags et SEO */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Tags et SEO</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="rapide, économique, végétarien"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                <input
                  type="text"
                  value={form.cuisine}
                  onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre SEO</label>
                <input
                  type="text"
                  maxLength={60}
                  value={form.seo_title}
                  onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">{form.seo_title.length}/60</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description SEO</label>
                <textarea
                  rows={2}
                  maxLength={160}
                  value={form.seo_description}
                  onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">{form.seo_description.length}/160</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* ENGLISH TAB */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
            <strong>Traduction anglaise</strong> - Les champs vides utiliseront la version française.
          </div>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information (EN)</h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Slug</label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">/en/recipe/</span>
                  <input
                    type="text"
                    value={enTranslation.slug_en}
                    onChange={(e) => setEnTranslation({ ...enTranslation, slug_en: e.target.value })}
                    placeholder={form.slug}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={enTranslation.title}
                  onChange={(e) => setEnTranslation({ ...enTranslation, title: e.target.value })}
                  placeholder={form.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  rows={2}
                  value={enTranslation.excerpt}
                  onChange={(e) => setEnTranslation({ ...enTranslation, excerpt: e.target.value })}
                  placeholder={form.excerpt}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
                <textarea
                  rows={3}
                  value={enTranslation.introduction}
                  onChange={(e) => setEnTranslation({ ...enTranslation, introduction: e.target.value })}
                  placeholder={form.introduction}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tips / Additional content</label>
                <textarea
                  rows={3}
                  value={enTranslation.content}
                  onChange={(e) => setEnTranslation({ ...enTranslation, content: e.target.value })}
                  placeholder={form.content}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
                <textarea
                  rows={2}
                  value={enTranslation.conclusion}
                  onChange={(e) => setEnTranslation({ ...enTranslation, conclusion: e.target.value })}
                  placeholder={form.conclusion}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FAQ (HTML)</label>
                <textarea
                  rows={3}
                  value={enTranslation.faq}
                  onChange={(e) => setEnTranslation({ ...enTranslation, faq: e.target.value })}
                  placeholder={form.faq}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                />
              </div>
            </div>
          </section>

          {/* Ingrédients EN */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Ingredients (EN)</h2>
              <button
                type="button"
                onClick={copyFrToEn}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Copier structure FR → EN
              </button>
            </div>
            {renderIngredientsForm(enTranslation.ingredients, {
              onChange: handleEnIngredientChange,
              onGroupTitleChange: (groupIndex, value) => {
                const newIngredients = [...enTranslation.ingredients];
                newIngredients[groupIndex].title = value;
                setEnTranslation({ ...enTranslation, ingredients: newIngredients });
              },
              addItem: addEnIngredientItem,
              removeItem: removeEnIngredientItem,
              addGroup: addEnIngredientGroup,
              removeGroup: removeEnIngredientGroup,
            })}
          </section>

          {/* Instructions EN */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Instructions (EN)</h2>
            {renderInstructionsForm(enTranslation.instructions, {
              onChange: handleEnInstructionChange,
              add: addEnInstruction,
              remove: removeEnInstruction,
            })}
          </section>

          {/* SEO EN */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">SEO (EN)</h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <input
                  type="text"
                  maxLength={60}
                  value={enTranslation.seo_title}
                  onChange={(e) => setEnTranslation({ ...enTranslation, seo_title: e.target.value })}
                  placeholder={form.seo_title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">{enTranslation.seo_title.length}/60</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <textarea
                  rows={2}
                  maxLength={160}
                  value={enTranslation.seo_description}
                  onChange={(e) => setEnTranslation({ ...enTranslation, seo_description: e.target.value })}
                  placeholder={form.seo_description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">{enTranslation.seo_description.length}/160</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Submit */}
      <div className="flex justify-end gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
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
          {loading ? 'Enregistrement...' : 'Enregistrer (FR + EN)'}
        </button>
      </div>
    </form>
  );
}
