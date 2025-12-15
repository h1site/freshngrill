'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FileJson, Check, AlertCircle, Loader2, Copy, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

interface IngredientItem {
  quantity?: string;
  unit?: string;
  name: string;
  note?: string;
}

interface IngredientGroup {
  title?: string;
  items: IngredientItem[];
}

interface InstructionStep {
  step: number;
  title?: string;
  content: string;
  tip?: string;
  image?: string;
}

interface Nutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface RecipeJSON {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  introduction?: string;
  conclusion?: string;
  prep_time: number;
  cook_time: number;
  rest_time?: number;
  total_time?: number;
  servings: number;
  servings_unit?: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  ingredients: IngredientGroup[];
  instructions: InstructionStep[];
  nutrition?: Nutrition;
  tags?: string[];
  cuisine?: string;
  author?: string;
  seo_title?: string;
  seo_description?: string;
  faq?: string;
}

interface TranslationJSON {
  locale: string;
  slug_en?: string;
  title: string;
  excerpt?: string;
  introduction?: string;
  conclusion?: string;
  content?: string;
  ingredients?: IngredientGroup[];
  instructions?: InstructionStep[];
  seo_title?: string;
  seo_description?: string;
}

interface ImportJSON {
  recipe: RecipeJSON;
  translation?: TranslationJSON;
}

export default function ImportJSONPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jsonInput, setJsonInput] = useState('');
  const [parsedData, setParsedData] = useState<ImportJSON | null>(null);
  const [parseError, setParseError] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; recipeId?: number } | null>(null);

  // Parse JSON input
  const handleParse = () => {
    setParseError('');
    setParsedData(null);
    setResult(null);

    if (!jsonInput.trim()) {
      setParseError('Veuillez coller du JSON');
      return;
    }

    try {
      const data = JSON.parse(jsonInput) as ImportJSON;

      // Validate required fields
      if (!data.recipe) {
        setParseError('Le JSON doit contenir un objet "recipe"');
        return;
      }

      if (!data.recipe.slug || !data.recipe.title) {
        setParseError('La recette doit avoir un "slug" et un "title"');
        return;
      }

      if (!data.recipe.ingredients || !Array.isArray(data.recipe.ingredients)) {
        setParseError('La recette doit avoir des "ingredients"');
        return;
      }

      if (!data.recipe.instructions || !Array.isArray(data.recipe.instructions)) {
        setParseError('La recette doit avoir des "instructions"');
        return;
      }

      setParsedData(data);
    } catch (err) {
      setParseError(`JSON invalide: ${err instanceof Error ? err.message : 'Erreur de syntaxe'}`);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      setJsonInput(text);

      // Auto-parse after loading file
      try {
        const data = JSON.parse(text) as ImportJSON;
        if (data.recipe && data.recipe.slug && data.recipe.title) {
          setParsedData(data);
          setParseError('');
        }
      } catch {
        // Let user click parse button
      }
    } catch (err) {
      setParseError('Erreur lors de la lecture du fichier');
    }
  };

  // Import recipe to Supabase
  const handleImport = async () => {
    if (!parsedData) return;

    setImporting(true);
    setResult(null);

    try {
      const supabase = createClient();
      const { recipe, translation } = parsedData;

      // Prepare recipe data
      const recipeData = {
        slug: recipe.slug,
        title: recipe.title,
        excerpt: recipe.excerpt || null,
        content: recipe.content || null,
        introduction: recipe.introduction || null,
        conclusion: recipe.conclusion || null,
        prep_time: recipe.prep_time || 0,
        cook_time: recipe.cook_time || 0,
        rest_time: recipe.rest_time || null,
        total_time: recipe.total_time || (recipe.prep_time || 0) + (recipe.cook_time || 0) + (recipe.rest_time || 0),
        servings: recipe.servings || 4,
        servings_unit: recipe.servings_unit || 'portions',
        difficulty: recipe.difficulty || 'facile',
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition || null,
        tags: recipe.tags || null,
        cuisine: recipe.cuisine || null,
        author: recipe.author || 'Menucochon',
        seo_title: recipe.seo_title || null,
        seo_description: recipe.seo_description || null,
        faq: recipe.faq || null,
        status: 'draft',
        likes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Insert recipe
      const { data: insertedRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert(recipeData as never)
        .select('id')
        .single();

      if (recipeError) {
        throw new Error(`Erreur création recette: ${recipeError.message}`);
      }

      const newRecipeId = (insertedRecipe as { id: number }).id;

      // Insert translation if provided
      if (translation && translation.title) {
        const translationData = {
          recipe_id: newRecipeId,
          locale: 'en',
          slug_en: translation.slug_en || null,
          title: translation.title,
          excerpt: translation.excerpt || null,
          introduction: translation.introduction || null,
          conclusion: translation.conclusion || null,
          content: translation.content || null,
          ingredients: translation.ingredients || null,
          instructions: translation.instructions || null,
          seo_title: translation.seo_title || null,
          seo_description: translation.seo_description || null,
          translated_at: new Date().toISOString(),
        };

        const { error: translationError } = await supabase
          .from('recipe_translations')
          .insert(translationData as never);

        if (translationError) {
          console.error('Translation error:', translationError);
          // Don't fail the whole import if translation fails
        }
      }

      setResult({
        success: true,
        message: `Recette "${recipe.title}" créée avec succès!`,
        recipeId: newRecipeId,
      });

    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : 'Erreur inconnue',
      });
    } finally {
      setImporting(false);
    }
  };

  // Clear form
  const handleClear = () => {
    setJsonInput('');
    setParsedData(null);
    setParseError('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import JSON (ChatGPT)</h1>
          <p className="text-gray-600 mt-1">
            Collez le JSON généré par ChatGPT pour créer une recette
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/recettes')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Retour aux recettes
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <FileJson className="w-5 h-5" />
          Format attendu
        </h3>
        <p className="text-sm text-blue-700 mb-2">
          Le JSON doit contenir un objet <code className="bg-blue-100 px-1 rounded">recipe</code> avec les champs requis,
          et optionnellement un objet <code className="bg-blue-100 px-1 rounded">translation</code> pour l&apos;anglais.
        </p>
        <details className="text-sm text-blue-600">
          <summary className="cursor-pointer hover:text-blue-800">Voir le format complet</summary>
          <pre className="mt-2 bg-white p-3 rounded border border-blue-200 overflow-x-auto text-xs">
{`{
  "recipe": {
    "slug": "pate-chinois",
    "title": "Pâté Chinois",
    "excerpt": "Description courte...",
    "introduction": "Introduction...",
    "conclusion": "Conclusion...",
    "prep_time": 30,
    "cook_time": 45,
    "rest_time": 5,
    "servings": 6,
    "servings_unit": "portions",
    "difficulty": "facile",
    "ingredients": [
      {
        "title": "Pour la viande",
        "items": [
          { "quantity": "750", "unit": "g", "name": "boeuf haché", "note": "" }
        ]
      }
    ],
    "instructions": [
      { "step": 1, "title": "Titre", "content": "Description...", "tip": "" }
    ],
    "nutrition": { "calories": 485, "protein": 28, ... },
    "tags": ["classique", "québécois"],
    "cuisine": "Québécoise",
    "seo_title": "Titre SEO",
    "seo_description": "Description SEO",
    "faq": "{\\"faq\\":[...]}"
  },
  "translation": {
    "locale": "en",
    "slug_en": "shepherds-pie",
    "title": "Shepherd's Pie",
    ...
  }
}`}
          </pre>
        </details>
      </div>

      {/* File Upload */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800">
          <Upload className="w-4 h-4" />
          <span>Ou importer un fichier JSON</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>

      {/* JSON Input */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="font-medium text-gray-700">JSON de la recette</label>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Effacer
            </button>
          </div>
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            setParsedData(null);
            setParseError('');
          }}
          placeholder='Collez le JSON ici... { "recipe": { ... }, "translation": { ... } }'
          rows={16}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />

        {parseError && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {parseError}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleParse}
            disabled={!jsonInput.trim()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Valider le JSON
          </button>
        </div>
      </div>

      {/* Parsed Preview */}
      {parsedData && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Aperçu de la recette
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Français</h4>
              <p className="font-semibold text-lg">{parsedData.recipe.title}</p>
              <p className="text-sm text-gray-600">/{parsedData.recipe.slug}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                  {parsedData.recipe.difficulty}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {parsedData.recipe.prep_time + parsedData.recipe.cook_time + (parsedData.recipe.rest_time || 0)} min
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  {parsedData.recipe.servings} {parsedData.recipe.servings_unit || 'portions'}
                </span>
              </div>
            </div>

            {parsedData.translation?.title && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">English</h4>
                <p className="font-semibold text-lg">{parsedData.translation.title}</p>
                <p className="text-sm text-gray-600">/{parsedData.translation.slug_en || parsedData.recipe.slug}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Ingrédients:</span>
              <span className="ml-2 font-medium">
                {parsedData.recipe.ingredients.reduce((acc, g) => acc + g.items.length, 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Étapes:</span>
              <span className="ml-2 font-medium">{parsedData.recipe.instructions.length}</span>
            </div>
            <div>
              <span className="text-gray-500">FAQ:</span>
              <span className="ml-2 font-medium">
                {parsedData.recipe.faq ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-lg p-4 mb-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-3">
            {result.success ? (
              <Check className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500" />
            )}
            <div>
              <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                {result.message}
              </p>
              {result.success && result.recipeId && (
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => router.push(`/admin/recettes/${result.recipeId}`)}
                    className="text-sm text-green-600 hover:text-green-800 underline"
                  >
                    Éditer la recette
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Importer une autre recette
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Import Button */}
      {parsedData && !result?.success && (
        <div className="flex justify-end gap-4">
          <button
            onClick={handleClear}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleImport}
            disabled={importing}
            className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
          >
            {importing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Import en cours...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Créer la recette
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
