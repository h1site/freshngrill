'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ChefHat, Clock, Users, Send, CheckCircle, AlertCircle,
  Loader2, Camera, Tag
} from 'lucide-react';

interface SubmitRecipeFormProps {
  userName: string;
  userEmail: string;
  userAvatar: string;
}

const categories = {
  'plats-principaux': 'Plats principaux',
  'accompagnements': 'Accompagnements',
  'entrees': 'Entrées',
  'soupes': 'Soupes',
  'salades': 'Salades',
  'desserts': 'Desserts',
  'patisseries': 'Pâtisseries',
  'boissons': 'Boissons',
  'dejeuners': 'Déjeuners',
  'collations': 'Collations',
};

export default function SubmitRecipeForm({ userName, userEmail, userAvatar }: SubmitRecipeFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    recipeName: '',
    description: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    category: '',
    recipeImage: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Recipe image upload
  const [recipeImagePreview, setRecipeImagePreview] = useState<string | null>(null);
  const [uploadingRecipe, setUploadingRecipe] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploadingRecipe(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'recipe-submissions/recipes');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setRecipeImagePreview(data.url);
        setFormData(prev => ({ ...prev, recipeImage: data.url }));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploadingRecipe(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/recipes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          profileImage: userAvatar,
          ...formData,
          locale: 'fr',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-display text-2xl text-black mb-3">Recette soumise!</h2>
        <p className="text-neutral-600 mb-8">
          Merci pour votre soumission! Notre équipe examinera votre recette et vous contactera si elle est sélectionnée pour publication.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              setSubmitStatus('idle');
              setFormData({
                recipeName: '',
                description: '',
                ingredients: '',
                instructions: '',
                prepTime: '',
                cookTime: '',
                servings: '',
                category: '',
                recipeImage: '',
              });
              setRecipeImagePreview(null);
            }}
            className="px-6 py-3 bg-[#F77313] text-white rounded-lg hover:bg-[#e56610] transition-colors"
          >
            Soumettre une autre recette
          </button>
          <button
            onClick={() => router.push('/profil')}
            className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Retour au profil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Info utilisateur */}
      <div className="bg-white rounded-xl p-4 mb-6 flex items-center gap-4 shadow-sm">
        {userAvatar ? (
          <Image
            src={userAvatar}
            alt={userName}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#F77313] flex items-center justify-center text-white font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-medium text-neutral-900">{userName}</p>
          <p className="text-sm text-neutral-500">{userEmail}</p>
        </div>
      </div>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800">Erreur d'envoi</h4>
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de la recette */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Nom de la recette <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="recipeName"
            value={formData.recipeName}
            onChange={handleChange}
            required
            placeholder="Ex: Tourtière du Lac-Saint-Jean"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description courte <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2}
            placeholder="Décrivez votre recette en quelques phrases..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Ingrédients */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Ingrédients <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-neutral-500 mb-2">Un ingrédient par ligne</p>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            required
            rows={6}
            placeholder="2 tasses de farine&#10;1 c. à thé de sel&#10;1/2 tasse de beurre&#10;..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all resize-none font-mono text-sm"
          />
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Instructions <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-neutral-500 mb-2">Décrivez les étapes de préparation</p>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
            rows={8}
            placeholder="1. Préchauffer le four à 350°F&#10;2. Mélanger les ingrédients secs&#10;3. Ajouter le beurre...&#10;..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Temps et portions */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h3 className="font-medium text-neutral-900 mb-4">Informations supplémentaires</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Préparation
              </label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                placeholder="min"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Cuisson
              </label>
              <input
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                placeholder="min"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                <Users className="w-4 h-4" />
                Portions
              </label>
              <input
                type="text"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                placeholder="Ex: 4-6"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all bg-white"
              >
                <option value="">Sélectionner</option>
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Photo de la recette */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Photo de la recette (optionnel)
          </label>
          <div className="flex items-center gap-4">
            {recipeImagePreview ? (
              <img
                src={recipeImagePreview}
                alt="Recipe"
                className="w-24 h-24 rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-neutral-100 flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-neutral-400" />
              </div>
            )}
            <label className="cursor-pointer px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors flex items-center gap-2">
              {uploadingRecipe ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              Téléverser
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#F77313] hover:bg-[#e56610] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Soumettre ma recette
            </>
          )}
        </button>
      </form>
    </div>
  );
}
