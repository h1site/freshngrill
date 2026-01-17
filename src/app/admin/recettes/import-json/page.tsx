'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FileJson, Check, AlertCircle, Loader2, Upload, X } from 'lucide-react';
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
  difficulty: 'facile' | 'moyen' | 'difficile' | 'easy' | 'medium' | 'hard';
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
  locale?: string;
  slug_en?: string;
  slug?: string;
  title: string;
  excerpt?: string;
  introduction?: string;
  conclusion?: string;
  content?: string;
  ingredients?: IngredientGroup[];
  instructions?: InstructionStep[];
  seo_title?: string;
  seo_description?: string;
  faq?: string;
}

interface ImportJSON {
  recipe: RecipeJSON;
  translation?: TranslationJSON;
}

type ImportMode = 'combined' | 'separate';

export default function ImportJSONPage() {
  const router = useRouter();
  const fileInputFrRef = useRef<HTMLInputElement>(null);
  const fileInputEnRef = useRef<HTMLInputElement>(null);
  const fileInputCombinedRef = useRef<HTMLInputElement>(null);

  const [importMode, setImportMode] = useState<ImportMode>('separate');

  // Combined mode state
  const [jsonInput, setJsonInput] = useState('');

  // Separate mode state
  const [jsonInputFr, setJsonInputFr] = useState('');
  const [jsonInputEn, setJsonInputEn] = useState('');

  const [parsedData, setParsedData] = useState<ImportJSON | null>(null);
  const [parseError, setParseError] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; recipeId?: number } | null>(null);

  // Parse JSON from separate inputs
  const handleParseSeparate = () => {
    setParseError('');
    setParsedData(null);
    setResult(null);

    if (!jsonInputFr.trim()) {
      setParseError('Veuillez coller le JSON français');
      return;
    }

    try {
      // Parse French JSON
      let frData: { recipe: RecipeJSON };
      const frParsed = JSON.parse(jsonInputFr);

      // Handle both formats: { recipe: {...} } or just {...}
      if (frParsed.recipe) {
        frData = frParsed;
      } else if (frParsed.slug && frParsed.title) {
        frData = { recipe: frParsed };
      } else {
        setParseError('Le JSON français doit contenir un objet "recipe" ou être une recette directement');
        return;
      }

      // Validate required fields
      if (!frData.recipe.slug || !frData.recipe.title) {
        setParseError('La recette française doit avoir un "slug" et un "title"');
        return;
      }

      if (!frData.recipe.ingredients || !Array.isArray(frData.recipe.ingredients)) {
        setParseError('La recette française doit avoir des "ingredients"');
        return;
      }

      if (!frData.recipe.instructions || !Array.isArray(frData.recipe.instructions)) {
        setParseError('La recette française doit avoir des "instructions"');
        return;
      }

      // Parse English JSON if provided
      let enData: TranslationJSON | undefined;
      if (jsonInputEn.trim()) {
        try {
          const enParsed = JSON.parse(jsonInputEn);

          // Handle both formats: { recipe: {...} } or just {...}
          if (enParsed.recipe) {
            enData = {
              ...enParsed.recipe,
              slug_en: enParsed.recipe.slug,
              locale: 'en'
            };
          } else if (enParsed.slug && enParsed.title) {
            enData = {
              ...enParsed,
              slug_en: enParsed.slug,
              locale: 'en'
            };
          } else {
            setParseError('Le JSON anglais doit contenir un objet "recipe" ou être une recette directement');
            return;
          }

          if (!enData?.title) {
            setParseError('La traduction anglaise doit avoir un "title"');
            return;
          }
        } catch (err) {
          setParseError(`JSON anglais invalide: ${err instanceof Error ? err.message : 'Erreur de syntaxe'}`);
          return;
        }
      }

      setParsedData({
        recipe: frData.recipe,
        translation: enData
      });
    } catch (err) {
      setParseError(`JSON français invalide: ${err instanceof Error ? err.message : 'Erreur de syntaxe'}`);
    }
  };

  // Parse JSON from combined input
  const handleParseCombined = () => {
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
  const handleFileUpload = async (file: File, target: 'fr' | 'en' | 'combined') => {
    try {
      const text = await file.text();

      if (target === 'combined') {
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
      } else if (target === 'fr') {
        setJsonInputFr(text);
      } else {
        setJsonInputEn(text);
      }
    } catch {
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

      // Map difficulty if English
      let difficulty = recipe.difficulty;
      if (difficulty === 'easy') difficulty = 'facile';
      if (difficulty === 'medium') difficulty = 'moyen';
      if (difficulty === 'hard') difficulty = 'difficile';

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
        difficulty: difficulty,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition || null,
        tags: recipe.tags || null,
        cuisine: recipe.cuisine || null,
        author: recipe.author || 'Menucochon',
        seo_title: recipe.seo_title || null,
        seo_description: recipe.seo_description || null,
        faq: recipe.faq || null,
        published_at: new Date().toISOString(),
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
          slug_en: translation.slug_en || translation.slug || null,
          title: translation.title,
          excerpt: translation.excerpt || null,
          introduction: translation.introduction || null,
          conclusion: translation.conclusion || null,
          content: translation.content || null,
          ingredients: translation.ingredients || null,
          instructions: translation.instructions || null,
          seo_title: translation.seo_title || null,
          seo_description: translation.seo_description || null,
          faq: translation.faq || null,
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
        message: `Recette "${recipe.title}" créée avec succès!${translation?.title ? ' (avec traduction anglaise)' : ''}`,
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
    setJsonInputFr('');
    setJsonInputEn('');
    setParsedData(null);
    setParseError('');
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import JSON</h1>
          <p className="text-gray-600 mt-1">
            Importez une recette depuis un fichier JSON ou en copiant-collant le contenu
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/recettes')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Retour aux recettes
        </button>
      </div>

      {/* Mode Selection */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => { setImportMode('separate'); handleClear(); }}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              importMode === 'separate'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">Fichiers séparés</div>
            <div className="text-sm text-gray-500 mt-1">
              Un fichier/JSON pour le français, un pour l&apos;anglais
            </div>
          </button>
          <button
            onClick={() => { setImportMode('combined'); handleClear(); }}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              importMode === 'combined'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">Fichier combiné</div>
            <div className="text-sm text-gray-500 mt-1">
              Un seul JSON avec recipe + translation
            </div>
          </button>
        </div>
      </div>

      {/* Separate Mode */}
      {importMode === 'separate' && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* French JSON */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-700 flex items-center gap-2">
                <span className="text-lg">🇫🇷</span> JSON Français
                <span className="text-red-500">*</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                <Upload className="w-4 h-4" />
                <span>Fichier</span>
                <input
                  ref={fileInputFrRef}
                  type="file"
                  accept=".json"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'fr')}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={jsonInputFr}
              onChange={(e) => {
                setJsonInputFr(e.target.value);
                setParsedData(null);
                setParseError('');
              }}
              placeholder='{ "recipe": { "slug": "...", "title": "...", ... } }'
              rows={14}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {jsonInputFr && (
              <button
                onClick={() => setJsonInputFr('')}
                className="mt-2 text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Effacer
              </button>
            )}
          </div>

          {/* English JSON */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-700 flex items-center gap-2">
                <span className="text-lg">🇬🇧</span> JSON Anglais
                <span className="text-gray-400 text-sm">(optionnel)</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                <Upload className="w-4 h-4" />
                <span>Fichier</span>
                <input
                  ref={fileInputEnRef}
                  type="file"
                  accept=".json"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'en')}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={jsonInputEn}
              onChange={(e) => {
                setJsonInputEn(e.target.value);
                setParsedData(null);
                setParseError('');
              }}
              placeholder='{ "recipe": { "slug": "...", "title": "...", ... } }'
              rows={14}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {jsonInputEn && (
              <button
                onClick={() => setJsonInputEn('')}
                className="mt-2 text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Effacer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Combined Mode */}
      {importMode === 'combined' && (
        <>
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
    "prep_time": 30,
    "cook_time": 45,
    "servings": 6,
    "difficulty": "facile",
    "ingredients": [...],
    "instructions": [...]
  },
  "translation": {
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
              <span>Importer un fichier JSON</span>
              <input
                ref={fileInputCombinedRef}
                type="file"
                accept=".json"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'combined')}
                className="hidden"
              />
            </label>
          </div>

          {/* JSON Input */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-700">JSON de la recette</label>
              <button
                onClick={handleClear}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Effacer
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setParsedData(null);
                setParseError('');
              }}
              placeholder='{ "recipe": { ... }, "translation": { ... } }'
              rows={16}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </>
      )}

      {/* Error */}
      {parseError && (
        <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {parseError}
        </div>
      )}

      {/* Parse Button */}
      {!parsedData && (
        <div className="flex justify-end mb-6">
          <button
            onClick={importMode === 'separate' ? handleParseSeparate : handleParseCombined}
            disabled={importMode === 'separate' ? !jsonInputFr.trim() : !jsonInput.trim()}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Valider le JSON
          </button>
        </div>
      )}

      {/* Parsed Preview */}
      {parsedData && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Aperçu de la recette
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <span>🇫🇷</span> Français
              </h4>
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

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <span>🇬🇧</span> English
              </h4>
              {parsedData.translation?.title ? (
                <>
                  <p className="font-semibold text-lg">{parsedData.translation.title}</p>
                  <p className="text-sm text-gray-600">/{parsedData.translation.slug_en || parsedData.translation.slug || parsedData.recipe.slug}</p>
                </>
              ) : (
                <p className="text-gray-400 italic">Pas de traduction anglaise</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Ingrédients FR:</span>
              <span className="ml-2 font-medium">
                {parsedData.recipe.ingredients.reduce((acc, g) => acc + g.items.length, 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Étapes FR:</span>
              <span className="ml-2 font-medium">{parsedData.recipe.instructions.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Ingrédients EN:</span>
              <span className="ml-2 font-medium">
                {parsedData.translation?.ingredients
                  ? parsedData.translation.ingredients.reduce((acc, g) => acc + g.items.length, 0)
                  : '—'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Étapes EN:</span>
              <span className="ml-2 font-medium">
                {parsedData.translation?.instructions?.length || '—'}
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
                  <a
                    href={`/recette/${parsedData?.recipe.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Voir la recette
                  </a>
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
