'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-browser';
import {
  Facebook,
  Instagram,
  Copy,
  Check,
  Download,
  Search,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface Recipe {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  categories: { id: number; name: string }[];
}

type PublishStatus = 'idle' | 'loading' | 'success' | 'error';

export default function SocialPostsPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Publishing states
  const [fbStatus, setFbStatus] = useState<PublishStatus>('idle');
  const [igStatus, setIgStatus] = useState<PublishStatus>('idle');
  const [fbMessage, setFbMessage] = useState('');
  const [igMessage, setIgMessage] = useState('');

  const supabase = createClient();
  const siteUrl = 'https://menucochon.com';

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(recipes);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRecipes(
        recipes.filter(
          (r) =>
            r.title.toLowerCase().includes(query) ||
            r.categories.some((c) => c.name.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, recipes]);

  // Reset publish status when recipe changes
  useEffect(() => {
    setFbStatus('idle');
    setIgStatus('idle');
    setFbMessage('');
    setIgMessage('');
  }, [selectedRecipe]);

  const loadRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes_with_categories')
      .select('id, title, slug, excerpt, featured_image, categories')
      .order('published_at', { ascending: false });

    if (!error && data) {
      setRecipes(data as Recipe[]);
      setFilteredRecipes(data as Recipe[]);
    }
    setLoading(false);
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadImage = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  // Générer les textes pour les réseaux sociaux
  const generateSocialTexts = (recipe: Recipe) => {
    const recipeUrl = `${siteUrl}/recette/${recipe.slug}/`;
    const hashtags = recipe.categories.map((c) => `#${c.name.replace(/\s+/g, '')}`).join(' ');
    const baseHashtags = '#recette #cuisine #menucochon #quebec #foodie';

    // Facebook - peut inclure le lien directement
    const facebookText = `🍴 ${recipe.title}

${recipe.excerpt || 'Découvrez cette délicieuse recette!'}

👉 Voir la recette complète: ${recipeUrl}

${hashtags} ${baseHashtags}`;

    // Instagram - lien dans la bio
    const instagramText = `🍴 ${recipe.title}

${recipe.excerpt || 'Découvrez cette délicieuse recette!'}

👉 Lien dans la bio pour la recette complète!

${hashtags} ${baseHashtags}`;

    return { facebookText, instagramText, recipeUrl };
  };

  // Publier sur Facebook
  const publishToFacebook = async () => {
    if (!selectedRecipe) return;

    setFbStatus('loading');
    setFbMessage('');

    const { facebookText, recipeUrl } = generateSocialTexts(selectedRecipe);

    try {
      const response = await fetch('/api/social/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: facebookText,
          imageUrl: selectedRecipe.featured_image,
          link: recipeUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFbStatus('success');
        setFbMessage(data.message);
      } else {
        setFbStatus('error');
        setFbMessage(data.error || 'Erreur lors de la publication');
      }
    } catch (error) {
      setFbStatus('error');
      setFbMessage('Erreur de connexion');
    }
  };

  // Publier sur Instagram
  const publishToInstagram = async () => {
    if (!selectedRecipe || !selectedRecipe.featured_image) return;

    setIgStatus('loading');
    setIgMessage('');

    const { instagramText } = generateSocialTexts(selectedRecipe);

    try {
      const response = await fetch('/api/social/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: instagramText,
          imageUrl: selectedRecipe.featured_image,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIgStatus('success');
        setIgMessage(data.message);
      } else {
        setIgStatus('error');
        setIgMessage(data.error || 'Erreur lors de la publication');
      }
    } catch (error) {
      setIgStatus('error');
      setIgMessage('Erreur de connexion');
    }
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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Publications Réseaux Sociaux</h1>
      <p className="text-gray-600 mb-8">
        Sélectionnez une recette pour publier directement sur Facebook et Instagram.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Liste des recettes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-4 ${
                  selectedRecipe?.id === recipe.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                }`}
              >
                {recipe.featured_image ? (
                  <Image
                    src={recipe.featured_image}
                    alt={recipe.title}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-15 h-15 rounded-lg bg-gray-200 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{recipe.title}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {recipe.categories.map((c) => c.name).join(', ')}
                  </p>
                </div>
              </button>
            ))}
            {filteredRecipes.length === 0 && (
              <p className="p-4 text-center text-gray-500">Aucune recette trouvée</p>
            )}
          </div>
        </div>

        {/* Contenu généré */}
        <div className="space-y-6">
          {selectedRecipe ? (
            <>
              {/* Aperçu de l'image */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  📸 Image de la recette
                </h2>
                {selectedRecipe.featured_image ? (
                  <div className="space-y-4">
                    <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden">
                      <Image
                        src={selectedRecipe.featured_image}
                        alt={selectedRecipe.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={() =>
                        downloadImage(selectedRecipe.featured_image!, selectedRecipe.title)
                      }
                      className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger l'image
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune image disponible</p>
                )}
              </div>

              {/* Facebook */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  Facebook
                </h2>
                <div className="relative">
                  <textarea
                    readOnly
                    value={generateSocialTexts(selectedRecipe).facebookText}
                    className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(generateSocialTexts(selectedRecipe).facebookText, 'facebook')
                    }
                    className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
                    title="Copier"
                  >
                    {copiedField === 'facebook' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Publish button */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={publishToFacebook}
                    disabled={fbStatus === 'loading'}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    {fbStatus === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Publication en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Publier sur Facebook
                      </>
                    )}
                  </button>

                  {fbStatus === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      {fbMessage}
                    </div>
                  )}
                  {fbStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {fbMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Instagram */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  Instagram
                </h2>
                <div className="relative">
                  <textarea
                    readOnly
                    value={generateSocialTexts(selectedRecipe).instagramText}
                    className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(generateSocialTexts(selectedRecipe).instagramText, 'instagram')
                    }
                    className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
                    title="Copier"
                  >
                    {copiedField === 'instagram' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Publish button */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={publishToInstagram}
                    disabled={igStatus === 'loading' || !selectedRecipe.featured_image}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    {igStatus === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Publication en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Publier sur Instagram
                      </>
                    )}
                  </button>

                  {!selectedRecipe.featured_image && (
                    <p className="text-sm text-amber-600">
                      Une image est requise pour publier sur Instagram
                    </p>
                  )}

                  {igStatus === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      {igMessage}
                    </div>
                  )}
                  {igStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {igMessage}
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-pink-50 rounded-lg">
                  <p className="text-sm text-pink-800">
                    <strong>Rappel:</strong> Mettez le lien dans votre bio Instagram:
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="flex-1 p-2 bg-white rounded text-xs break-all">
                      {generateSocialTexts(selectedRecipe).recipeUrl}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(generateSocialTexts(selectedRecipe).recipeUrl, 'url')
                      }
                      className="p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors flex-shrink-0"
                      title="Copier le lien"
                    >
                      {copiedField === 'url' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">👈</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sélectionnez une recette</h2>
              <p className="text-gray-500">
                Choisissez une recette dans la liste pour publier sur les réseaux sociaux.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Configuration notice */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="font-semibold text-amber-800 mb-2">Configuration requise</h3>
        <p className="text-sm text-amber-700 mb-2">
          Pour publier directement, ajoutez ces variables dans votre fichier <code>.env.local</code>:
        </p>
        <pre className="text-xs bg-white p-3 rounded border border-amber-200 overflow-x-auto">
{`FACEBOOK_PAGE_ID=votre_page_id
FACEBOOK_PAGE_ACCESS_TOKEN=votre_page_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=votre_ig_account_id`}
        </pre>
        <p className="text-xs text-amber-600 mt-2">
          Pour obtenir le Page Access Token: developers.facebook.com/tools/explorer → Get Page Access Token
        </p>
      </div>
    </div>
  );
}
