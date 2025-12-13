'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, FileJson, FileText, X, Check, AlertCircle, Loader2, Download } from 'lucide-react';

interface RecipeFr {
  index: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  introduction?: string;
  conclusion?: string;
  prep_time: number;
  cook_time: number;
  rest_time?: number;
  servings: number;
  servings_unit?: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  cuisine?: string;
  tags?: string[];
  ingredients: { group?: string; items: string[] }[];
  instructions: string[];
  nutrition?: Record<string, number>;
  seo_title?: string;
  seo_description?: string;
}

interface RecipeEn {
  index: number;
  slug_en: string;
  title: string;
  excerpt?: string;
  introduction?: string;
  conclusion?: string;
  ingredients: { group?: string; items: string[] }[];
  instructions: string[];
  seo_title?: string;
  seo_description?: string;
}

interface ImageUpload {
  index: number;
  file: File;
  preview: string;
  url?: string;
  uploading?: boolean;
  error?: string;
}

type Step = 'files' | 'images' | 'review' | 'importing';

export default function ImportPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('files');

  // Files state
  const [fileFr, setFileFr] = useState<File | null>(null);
  const [fileEn, setFileEn] = useState<File | null>(null);
  const [recipesFr, setRecipesFr] = useState<RecipeFr[]>([]);
  const [recipesEn, setRecipesEn] = useState<RecipeEn[]>([]);
  const [parseError, setParseError] = useState('');

  // Images state
  const [images, setImages] = useState<ImageUpload[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Import state
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: number;
    errors: { index: number; error: string }[];
  } | null>(null);

  // Parse JSON or CSV file
  const parseFile = async (file: File, type: 'fr' | 'en'): Promise<RecipeFr[] | RecipeEn[]> => {
    const text = await file.text();
    const isJson = file.name.endsWith('.json');

    if (isJson) {
      const data = JSON.parse(text);
      return type === 'fr' ? data.recettes : data.recipes;
    } else {
      // CSV parsing
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

      const parsed = lines.slice(1).map((line, idx) => {
        const values = parseCSVLine(line);
        const obj: Record<string, unknown> = { index: idx + 1 };

        headers.forEach((header, i) => {
          const value = values[i]?.replace(/^"|"$/g, '') || '';

          // Parse JSON fields
          if (['ingredients', 'instructions', 'nutrition', 'tags'].includes(header) && value) {
            try {
              obj[header] = JSON.parse(value);
            } catch {
              obj[header] = value;
            }
          } else if (['prep_time', 'cook_time', 'rest_time', 'servings'].includes(header)) {
            obj[header] = parseInt(value) || 0;
          } else {
            obj[header] = value;
          }
        });

        return obj;
      });

      return type === 'fr' ? parsed as unknown as RecipeFr[] : parsed as unknown as RecipeEn[];
    }
  };

  // Simple CSV line parser
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);

    return result;
  };

  // Handle file upload
  const handleFileChange = async (file: File, type: 'fr' | 'en') => {
    setParseError('');

    try {
      const recipes = await parseFile(file, type);

      if (type === 'fr') {
        setFileFr(file);
        setRecipesFr(recipes as RecipeFr[]);
      } else {
        setFileEn(file);
        setRecipesEn(recipes as RecipeEn[]);
      }
    } catch (err) {
      setParseError(`Erreur parsing ${type.toUpperCase()}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

  // Handle image drop
  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addImages(files);
  }, []);

  const addImages = (files: File[]) => {
    const newImages: ImageUpload[] = files.map((file, idx) => ({
      index: images.length + idx + 1,
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter(img => img.index !== index).map((img, idx) => ({
      ...img,
      index: idx + 1,
    })));
  };

  const reorderImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    setImages(newImages.map((img, idx) => ({ ...img, index: idx + 1 })));
  };

  // Upload all images to get URLs
  const uploadImages = async (): Promise<boolean> => {
    const updatedImages = [...images];
    let hasError = false;

    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      if (img.url) continue; // Already uploaded

      updatedImages[i] = { ...img, uploading: true };
      setImages([...updatedImages]);

      try {
        const formData = new FormData();
        formData.append('file', img.file);
        formData.append('index', String(img.index));
        // Ajouter le titre de la recette pour nommer le fichier
        const recipeTitle = recipesFr[i]?.title || `recette-${img.index}`;
        formData.append('title', recipeTitle);

        const response = await fetch('/api/upload/webp', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(`Image ${img.index} upload response:`, response.status, data);

        if (!response.ok) {
          throw new Error(data.error || `Erreur upload (${response.status})`);
        }

        updatedImages[i] = { ...img, uploading: false, url: data.url };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
        console.error(`Image ${img.index} upload error:`, errorMsg);
        updatedImages[i] = {
          ...img,
          uploading: false,
          error: errorMsg
        };
        hasError = true;
      }

      setImages([...updatedImages]);
    }

    return !hasError;
  };

  // Import recipes
  const handleImport = async () => {
    setImporting(true);
    setStep('importing');

    try {
      // First upload all images
      const uploadSuccess = await uploadImages();
      if (!uploadSuccess) {
        throw new Error('Certaines images n\'ont pas pu être uploadées');
      }

      // Then import recipes
      const response = await fetch('/api/import/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipesFr,
          recipesEn,
          images: images.map(img => ({ index: img.index, url: img.url })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur import');
      }

      setImportResult(result);
    } catch (err) {
      setImportResult({
        success: 0,
        errors: [{ index: 0, error: err instanceof Error ? err.message : 'Erreur inconnue' }],
      });
    } finally {
      setImporting(false);
    }
  };

  // Validation
  const canProceedToImages = fileFr && fileEn &&
    recipesFr.length > 0 && recipesEn.length > 0 &&
    recipesFr.length === recipesEn.length;

  const canProceedToReview = images.length === recipesFr.length;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Import de recettes</h1>
      <p className="text-gray-600 mb-8">
        Importez des recettes en français et anglais avec leurs images
      </p>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['files', 'images', 'review', 'importing'].map((s, idx) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step === s ? 'bg-orange-600 text-white' :
              ['files', 'images', 'review', 'importing'].indexOf(step) > idx ? 'bg-green-500 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {['files', 'images', 'review', 'importing'].indexOf(step) > idx ? <Check className="w-5 h-5" /> : idx + 1}
            </div>
            {idx < 3 && <div className="w-16 md:w-24 h-1 bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1: Files */}
      {step === 'files' && (
        <div className="space-y-6">
          {/* Download Templates */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Télécharger les templates</h3>
            <div className="flex flex-wrap gap-3">
              <a href="/api/templates/recettes-fr-template.json" download="recettes-fr-template.json" className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-blue-300 rounded text-sm text-blue-700 hover:bg-blue-50">
                <FileJson className="w-4 h-4" /> Template FR (JSON)
              </a>
              <a href="/api/templates/recipes-en-template.json" download="recipes-en-template.json" className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-blue-300 rounded text-sm text-blue-700 hover:bg-blue-50">
                <FileJson className="w-4 h-4" /> Template EN (JSON)
              </a>
              <a href="/api/templates/recettes-fr-template.csv" download="recettes-fr-template.csv" className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-blue-300 rounded text-sm text-blue-700 hover:bg-blue-50">
                <FileText className="w-4 h-4" /> Template FR (CSV)
              </a>
              <a href="/api/templates/recipes-en-template.csv" download="recipes-en-template.csv" className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-blue-300 rounded text-sm text-blue-700 hover:bg-blue-50">
                <FileText className="w-4 h-4" /> Template EN (CSV)
              </a>
            </div>
          </div>

          {parseError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {parseError}
            </div>
          )}

          {/* French File */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">FR</span>
              Fichier recettes françaises
            </h3>
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 transition-colors">
              <input
                type="file"
                accept=".json,.csv"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0], 'fr')}
                className="hidden"
              />
              {fileFr ? (
                <div className="flex items-center justify-center gap-3">
                  <Check className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">{fileFr.name}</span>
                  <span className="text-green-600 font-medium">({recipesFr.length} recettes)</span>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Cliquez ou glissez un fichier JSON/CSV</p>
                </div>
              )}
            </label>
          </div>

          {/* English File */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">EN</span>
              Fichier recettes anglaises
            </h3>
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 transition-colors">
              <input
                type="file"
                accept=".json,.csv"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0], 'en')}
                className="hidden"
              />
              {fileEn ? (
                <div className="flex items-center justify-center gap-3">
                  <Check className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">{fileEn.name}</span>
                  <span className="text-green-600 font-medium">({recipesEn.length} recettes)</span>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Cliquez ou glissez un fichier JSON/CSV</p>
                </div>
              )}
            </label>
          </div>

          {/* Validation */}
          {fileFr && fileEn && recipesFr.length !== recipesEn.length && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              Le nombre de recettes ne correspond pas: {recipesFr.length} FR vs {recipesEn.length} EN
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setStep('images')}
              disabled={!canProceedToImages}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuer vers les images
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Images */}
      {step === 'images' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-2">Images des recettes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Uploadez {recipesFr.length} images dans l&apos;ordre des recettes. Les images seront automatiquement converties en WebP.
            </p>

            {/* Drop zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageDrop}
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 transition-colors mb-6"
            >
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && addImages(Array.from(e.target.files))}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Cliquez ou glissez les images ici</p>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG, WebP (max 10MB par image)</p>
            </div>

            {/* Image grid */}
            {images.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    {images.length} / {recipesFr.length} images
                  </span>
                  {images.length !== recipesFr.length && (
                    <span className="text-sm text-yellow-600">
                      Il manque {recipesFr.length - images.length} image(s)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={img.index} className="relative group">
                      <div className="aspect-[4/3] relative rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={img.preview}
                          alt={`Image ${img.index}`}
                          fill
                          className="object-cover"
                        />
                        {img.uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                        {img.error && (
                          <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center p-2">
                            <span className="text-white text-xs text-center">{img.error}</span>
                          </div>
                        )}
                        {img.url && (
                          <div className="absolute top-2 right-2">
                            <Check className="w-6 h-6 text-green-500 bg-white rounded-full p-1" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 left-2 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {img.index}
                      </div>
                      <button
                        onClick={() => removeImage(img.index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{recipesFr[idx]?.title || `Recette ${idx + 1}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep('files')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Retour
            </button>
            <button
              onClick={() => setStep('review')}
              disabled={!canProceedToReview}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Vérifier et importer
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 'review' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Résumé de l&apos;import</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{recipesFr.length}</p>
                <p className="text-sm text-gray-600">Recettes FR</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">{recipesEn.length}</p>
                <p className="text-sm text-gray-600">Recettes EN</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{images.length}</p>
                <p className="text-sm text-gray-600">Images</p>
              </div>
            </div>

            <h4 className="font-medium mb-3">Aperçu des recettes:</h4>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Français</th>
                    <th className="px-4 py-2 text-left">Anglais</th>
                  </tr>
                </thead>
                <tbody>
                  {recipesFr.map((recipe, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{recipe.index}</td>
                      <td className="px-4 py-2">{recipe.title}</td>
                      <td className="px-4 py-2">{recipesEn[idx]?.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep('images')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Retour
            </button>
            <button
              onClick={handleImport}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Lancer l&apos;import
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Importing / Results */}
      {step === 'importing' && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          {importing ? (
            <>
              <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Import en cours...</h3>
              <p className="text-gray-600">Conversion des images et création des recettes</p>
            </>
          ) : importResult ? (
            <>
              {importResult.success > 0 ? (
                <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              ) : (
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              )}
              <h3 className="text-xl font-semibold mb-2">
                {importResult.success} recette(s) importée(s)
              </h3>

              {importResult.errors.length > 0 && (
                <div className="mt-4 text-left max-w-md mx-auto">
                  <h4 className="font-medium text-red-600 mb-2">Erreurs:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {importResult.errors.map((err, idx) => (
                      <li key={idx}>• {err.index > 0 ? `Recette ${err.index}: ` : ''}{err.error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => router.push('/admin/recettes')}
                  className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  Voir les recettes
                </button>
                <button
                  onClick={() => {
                    setStep('files');
                    setFileFr(null);
                    setFileEn(null);
                    setRecipesFr([]);
                    setRecipesEn([]);
                    setImages([]);
                    setImportResult(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Nouvel import
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
