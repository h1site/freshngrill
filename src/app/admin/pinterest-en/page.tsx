'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  PlayCircle,
} from 'lucide-react';

interface RecipeStatus {
  id: number;
  slug: string;
  slugEn: string;
  title: string;
  titleEn: string;
  hasFeaturedImage: boolean;
  hasPinterestImageEn: boolean;
  pinterestImageEnUrl: string | null;
}

interface Stats {
  total: number;
  withPinterestEn: number;
  withoutPinterestEn: number;
  noFeaturedImage: number;
  noEnglishTranslation: number;
}

interface ProcessResult {
  success: { id: number; slug: string; url: string }[];
  failed: { id: number; slug: string; error: string }[];
}

export default function PinterestEnBatchPage() {
  const [recipes, setRecipes] = useState<RecipeStatus[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [overwrite, setOverwrite] = useState(false);
  const [results, setResults] = useState<ProcessResult | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    loadRecipes();
  }, []);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadRecipes = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch('/api/admin/pinterest-en/batch');
      const data = await response.json();
      console.log('Load response:', data);

      if (response.ok) {
        setRecipes(data.recipes || []);
        setStats(data.stats || null);
      } else {
        setLoadError(data.error || `HTTP Error ${response.status}`);
      }
    } catch (error) {
      console.error('Load error:', error);
      setLoadError(error instanceof Error ? error.message : 'Connection error');
    }
    setLoading(false);
  };

  const toggleRecipe = (id: number) => {
    setSelectedRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const eligibleRecipes = recipes.filter(
      (r) => r.hasFeaturedImage && r.titleEn && (!r.hasPinterestImageEn || overwrite)
    );
    setSelectedRecipes(eligibleRecipes.map((r) => r.id));
  };

  const selectNone = () => {
    setSelectedRecipes([]);
  };

  const generateImages = async () => {
    if (selectedRecipes.length === 0) return;

    setProcessing(true);
    setResults(null);
    setProgress({ current: 0, total: selectedRecipes.length });

    try {
      // Process in batches of 5 to avoid timeout
      const batchSize = 5;
      const allResults: ProcessResult = { success: [], failed: [] };

      for (let i = 0; i < selectedRecipes.length; i += batchSize) {
        const batch = selectedRecipes.slice(i, i + batchSize);

        const response = await fetch('/api/admin/pinterest-en/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipeIds: batch,
            overwrite,
          }),
        });

        const data = await response.json();
        console.log('API Response for batch:', batch, data);

        if (!response.ok) {
          // API returned an error
          console.error('API Error:', data.error);
          allResults.failed.push(...batch.map(id => ({
            id,
            slug: recipes.find(r => r.id === id)?.slug || 'unknown',
            error: data.error || `HTTP ${response.status}`,
          })));
        } else if (data.results) {
          console.log('Batch processed:', data.processed, 'success:', data.success, 'failed:', data.failed);
          allResults.success.push(...data.results.success);
          allResults.failed.push(...data.results.failed);

          // Handle case where recipes were filtered out (already have Pinterest image)
          if (data.processed === 0 && batch.length > 0) {
            allResults.failed.push(...batch.map(id => ({
              id,
              slug: recipes.find(r => r.id === id)?.slug || 'unknown',
              error: 'Recipe already processed (check "Overwrite" to regenerate)',
            })));
          }
        } else {
          console.warn('Unexpected response format:', data);
        }

        setProgress({ current: Math.min(i + batchSize, selectedRecipes.length), total: selectedRecipes.length });
      }

      setResults(allResults);
      // Reload to update status
      await loadRecipes();
      setSelectedRecipes([]);
    } catch (error) {
      console.error('Generation error:', error);
      setResults({
        success: [],
        failed: selectedRecipes.map(id => ({
          id,
          slug: recipes.find(r => r.id === id)?.slug || 'unknown',
          error: error instanceof Error ? error.message : 'Network error',
        })),
      });
    }

    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Loading Error</h2>
        <p className="text-red-600 mb-4">{loadError}</p>
        <button
          onClick={loadRecipes}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pinterest Images (English)</h1>
          <p className="text-gray-600">
            Automatically generate Pinterest images (1000x1500) for all your recipes with English titles.
          </p>
        </div>
        <button
          onClick={loadRecipes}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total recipes</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-green-600">{stats.withPinterestEn}</div>
            <div className="text-sm text-gray-500">With English Pinterest</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-orange-600">{stats.withoutPinterestEn}</div>
            <div className="text-sm text-gray-500">Without English Pinterest</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-red-600">{stats.noFeaturedImage}</div>
            <div className="text-sm text-gray-500">No source image</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-purple-600">{stats.noEnglishTranslation}</div>
            <div className="text-sm text-gray-500">No English translation</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={selectAll}
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Select all
            </button>
            <button
              onClick={selectNone}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Deselect all
            </button>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              Overwrite existing images
            </label>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {selectedRecipes.length} recipe{selectedRecipes.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={generateImages}
              disabled={processing || selectedRecipes.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating... ({progress.current}/{progress.total})
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  Generate images
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {processing && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Results</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                {results.success.length} succeeded
              </div>
              {results.failed.length > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  {results.failed.length} failed
                </div>
              )}
            </div>
            {results.failed.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-red-600 mb-2">Errors:</h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {results.failed.map((f) => (
                    <li key={f.id}>
                      • {f.slug}: {f.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recipe list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  checked={selectedRecipes.length === recipes.filter(r => r.hasFeaturedImage && r.titleEn).length && recipes.filter(r => r.hasFeaturedImage && r.titleEn).length > 0}
                  onChange={() => selectedRecipes.length > 0 ? selectNone() : selectAll()}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipe (English)
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Source image
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Pinterest EN
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Preview
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...recipes].sort((a, b) => {
              // Without Pinterest image first
              if (!a.hasPinterestImageEn && b.hasPinterestImageEn) return -1;
              if (a.hasPinterestImageEn && !b.hasPinterestImageEn) return 1;
              return 0;
            }).map((recipe) => (
              <tr
                key={recipe.id}
                className={`hover:bg-gray-50 ${
                  selectedRecipes.includes(recipe.id) ? 'bg-orange-50' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRecipes.includes(recipe.id)}
                    onChange={() => toggleRecipe(recipe.id)}
                    disabled={!recipe.hasFeaturedImage || !recipe.titleEn}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{recipe.titleEn || <span className="text-gray-400 italic">No English translation</span>}</div>
                  <div className="text-sm text-gray-500">{recipe.slugEn || recipe.slug}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  {recipe.hasFeaturedImage ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {recipe.hasPinterestImageEn ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  ) : recipe.hasFeaturedImage && recipe.titleEn ? (
                    <AlertCircle className="w-5 h-5 text-orange-500 mx-auto" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {recipe.pinterestImageEnUrl ? (
                    <a
                      href={recipe.pinterestImageEnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative w-12 h-18 mx-auto rounded overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all"
                    >
                      <Image
                        src={recipe.pinterestImageEnUrl}
                        alt={recipe.titleEn || recipe.title}
                        width={48}
                        height={72}
                        className="object-cover"
                        unoptimized
                      />
                    </a>
                  ) : (
                    <div className="w-12 h-18 mx-auto bg-gray-200 rounded flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How it works</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Pinterest images are generated at 1000x1500 pixels (2:3 ratio)</li>
          <li>• Each image uses the English title from recipe_translations</li>
          <li>• Images are stored in Supabase Storage and linked to each recipe</li>
          <li>• Once generated, images are used automatically for English Pinterest sharing</li>
        </ul>
      </div>
    </div>
  );
}
