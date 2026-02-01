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
  Check,
} from 'lucide-react';

interface RecipeStatus {
  id: number;
  slug: string;
  title: string;
  hasFeaturedImage: boolean;
  hasPinterestImage: boolean;
}

interface Stats {
  total: number;
  withPinterest: number;
  withoutPinterest: number;
  noFeaturedImage: number;
}

interface ProcessResult {
  success: { id: number; slug: string; url: string }[];
  failed: { id: number; slug: string; error: string }[];
}

export default function PinterestBatchPage() {
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

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/pinterest/batch');
      const data = await response.json();

      if (response.ok) {
        setRecipes(data.recipes || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
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
      (r) => r.hasFeaturedImage && (!r.hasPinterestImage || overwrite)
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

        const response = await fetch('/api/admin/pinterest/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipeIds: batch,
            overwrite,
          }),
        });

        const data = await response.json();

        if (response.ok && data.results) {
          allResults.success.push(...data.results.success);
          allResults.failed.push(...data.results.failed);
        }

        setProgress({ current: Math.min(i + batchSize, selectedRecipes.length), total: selectedRecipes.length });
      }

      setResults(allResults);
      // Reload to update status
      await loadRecipes();
      setSelectedRecipes([]);
    } catch (error) {
      console.error('Erreur génération:', error);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Images Pinterest</h1>
          <p className="text-gray-600">
            Générez automatiquement les images Pinterest (1000x1500) pour toutes vos recettes.
          </p>
        </div>
        <button
          onClick={loadRecipes}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Recettes totales</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-green-600">{stats.withPinterest}</div>
            <div className="text-sm text-gray-500">Avec image Pinterest</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-orange-600">{stats.withoutPinterest}</div>
            <div className="text-sm text-gray-500">Sans image Pinterest</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-red-600">{stats.noFeaturedImage}</div>
            <div className="text-sm text-gray-500">Sans image source</div>
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
              Tout sélectionner
            </button>
            <button
              onClick={selectNone}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Tout désélectionner
            </button>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              Écraser les images existantes
            </label>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {selectedRecipes.length} recette{selectedRecipes.length > 1 ? 's' : ''} sélectionnée{selectedRecipes.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={generateImages}
              disabled={processing || selectedRecipes.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Génération... ({progress.current}/{progress.total})
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  Générer les images
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
            <h3 className="font-semibold text-gray-900 mb-2">Résultats</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                {results.success.length} réussie{results.success.length > 1 ? 's' : ''}
              </div>
              {results.failed.length > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  {results.failed.length} échouée{results.failed.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
            {results.failed.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-red-600 mb-2">Erreurs:</h4>
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
                  checked={selectedRecipes.length === recipes.filter(r => r.hasFeaturedImage).length && recipes.filter(r => r.hasFeaturedImage).length > 0}
                  onChange={() => selectedRecipes.length > 0 ? selectNone() : selectAll()}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recette
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Image source
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Pinterest
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Aperçu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recipes.map((recipe) => (
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
                    disabled={!recipe.hasFeaturedImage}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{recipe.title}</div>
                  <div className="text-sm text-gray-500">{recipe.slug}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  {recipe.hasFeaturedImage ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {recipe.hasPinterestImage ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  ) : recipe.hasFeaturedImage ? (
                    <AlertCircle className="w-5 h-5 text-orange-500 mx-auto" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {recipe.hasFeaturedImage && (
                    <a
                      href={`/api/og/pinterest?slug=${recipe.slug}&locale=fr`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Voir
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Comment ça fonctionne</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Les images Pinterest sont générées au format 1000x1500 pixels (ratio 2:3)</li>
          <li>• Chaque image inclut le titre de la recette, la difficulté et le temps de cuisson</li>
          <li>• Les images sont stockées dans Supabase Storage et liées à chaque recette</li>
          <li>• Une fois générées, les images sont utilisées automatiquement pour le partage Pinterest</li>
        </ul>
      </div>
    </div>
  );
}
