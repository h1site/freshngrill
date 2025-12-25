'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, Camera, ChefHat, Clock, Users,
  Send, CheckCircle, AlertCircle, ShieldCheck, Loader2,
  FileText, ListOrdered, Tag
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SubmitRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: 'fr' | 'en';
}

// Generate a simple math captcha
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { num1, num2, answer: num1 + num2 };
}

const translations = {
  fr: {
    title: 'Soumettre votre recette',
    subtitle: 'Partagez votre création culinaire avec notre communauté! Si sélectionnée, elle sera publiée dans la section "Recettes de la communauté".',
    yourInfo: 'Vos informations',
    yourRecipe: 'Votre recette',
    name: 'Nom complet',
    namePlaceholder: 'Votre nom',
    email: 'Courriel',
    emailPlaceholder: 'votre@email.com',
    profilePhoto: 'Photo de profil (optionnel)',
    recipeName: 'Nom de la recette',
    recipeNamePlaceholder: 'Ex: Tourtière du Lac-Saint-Jean',
    description: 'Description courte',
    descriptionPlaceholder: 'Décrivez votre recette en quelques phrases...',
    ingredients: 'Ingrédients',
    ingredientsPlaceholder: 'Un ingrédient par ligne...\nEx:\n2 tasses de farine\n1 c. à thé de sel\n1/2 tasse de beurre',
    instructions: 'Instructions',
    instructionsPlaceholder: 'Décrivez les étapes de préparation...\nEx:\n1. Préchauffer le four à 350°F\n2. Mélanger les ingrédients secs\n3. Ajouter le beurre...',
    prepTime: 'Préparation',
    prepTimePlaceholder: 'min',
    cookTime: 'Cuisson',
    cookTimePlaceholder: 'min',
    servings: 'Portions',
    servingsPlaceholder: 'Ex: 4-6',
    category: 'Catégorie',
    selectCategory: 'Sélectionner une catégorie',
    recipePhoto: 'Photo de la recette (optionnel)',
    options: 'Options',
    newsletterOptIn: "M'inscrire à l'infolettre pour recevoir de nouvelles recettes",
    memberOptIn: 'Créer un compte membre pour sauvegarder mes recettes favorites',
    captchaLabel: 'Vérification anti-spam',
    captchaQuestion: 'Combien font',
    submit: 'Soumettre ma recette',
    submitting: 'Envoi en cours...',
    successTitle: 'Recette soumise!',
    successMessage: 'Merci pour votre soumission! Notre équipe examinera votre recette et vous contactera si elle est sélectionnée pour publication.',
    errorTitle: "Erreur d'envoi",
    errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
    captchaError: 'Réponse incorrecte. Veuillez réessayer.',
    required: 'Champs requis',
    uploadPhoto: 'Cliquez pour téléverser',
    categories: {
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
    },
  },
  en: {
    title: 'Submit Your Recipe',
    subtitle: 'Share your culinary creation with our community! If selected, it will be published in the "Community Recipes" section.',
    yourInfo: 'Your Information',
    yourRecipe: 'Your Recipe',
    name: 'Full Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    profilePhoto: 'Profile Photo (optional)',
    recipeName: 'Recipe Name',
    recipeNamePlaceholder: 'Ex: Classic Beef Stew',
    description: 'Short Description',
    descriptionPlaceholder: 'Describe your recipe in a few sentences...',
    ingredients: 'Ingredients',
    ingredientsPlaceholder: 'One ingredient per line...\nEx:\n2 cups flour\n1 tsp salt\n1/2 cup butter',
    instructions: 'Instructions',
    instructionsPlaceholder: 'Describe the preparation steps...\nEx:\n1. Preheat oven to 350°F\n2. Mix dry ingredients\n3. Add butter...',
    prepTime: 'Prep Time',
    prepTimePlaceholder: 'min',
    cookTime: 'Cook Time',
    cookTimePlaceholder: 'min',
    servings: 'Servings',
    servingsPlaceholder: 'Ex: 4-6',
    category: 'Category',
    selectCategory: 'Select a category',
    recipePhoto: 'Recipe Photo (optional)',
    options: 'Options',
    newsletterOptIn: 'Subscribe to our newsletter to receive new recipes',
    memberOptIn: 'Create a member account to save my favorite recipes',
    captchaLabel: 'Anti-spam verification',
    captchaQuestion: 'What is',
    submit: 'Submit My Recipe',
    submitting: 'Submitting...',
    successTitle: 'Recipe Submitted!',
    successMessage: 'Thank you for your submission! Our team will review your recipe and contact you if it is selected for publication.',
    errorTitle: 'Submission Error',
    errorMessage: 'An error occurred. Please try again.',
    captchaError: 'Incorrect answer. Please try again.',
    required: 'Required fields',
    uploadPhoto: 'Click to upload',
    categories: {
      'plats-principaux': 'Main Dishes',
      'accompagnements': 'Side Dishes',
      'entrees': 'Appetizers',
      'soupes': 'Soups',
      'salades': 'Salads',
      'desserts': 'Desserts',
      'patisseries': 'Pastries',
      'boissons': 'Beverages',
      'dejeuners': 'Breakfast',
      'collations': 'Snacks',
    },
  },
};

export function SubmitRecipeModal({ isOpen, onClose, locale = 'fr' }: SubmitRecipeModalProps) {
  const router = useRouter();
  const t = translations[locale];
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: '',
    recipeName: '',
    description: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    category: '',
    recipeImage: '',
    newsletterOptIn: false,
    memberOptIn: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  // Profile image upload
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [recipeImagePreview, setRecipeImagePreview] = useState<string | null>(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingRecipe, setUploadingRecipe] = useState(false);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleImageUpload = async (file: File, type: 'profile' | 'recipe') => {
    const setUploading = type === 'profile' ? setUploadingProfile : setUploadingRecipe;
    const setPreview = type === 'profile' ? setProfileImagePreview : setRecipeImagePreview;

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', `recipe-submissions/${type}s`);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setPreview(data.url);
        setFormData(prev => ({
          ...prev,
          [type === 'profile' ? 'profileImage' : 'recipeImage']: data.url,
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError(false);

    // Validate captcha
    if (parseInt(captchaInput) !== captcha.answer) {
      setCaptchaError(true);
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

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
          ...formData,
          locale,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');

        // If member opt-in, redirect to register after a delay
        if (formData.memberOptIn) {
          setTimeout(() => {
            const registerUrl = locale === 'en'
              ? `/en/register?email=${encodeURIComponent(formData.email)}&from=recipe-submission`
              : `/register?email=${encodeURIComponent(formData.email)}&from=recipe-submission`;
            router.push(registerUrl);
            onClose();
          }, 2000);
        }
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || t.errorMessage);
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage(t.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      profileImage: '',
      recipeName: '',
      description: '',
      ingredients: '',
      instructions: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      category: '',
      recipeImage: '',
      newsletterOptIn: false,
      memberOptIn: false,
    });
    setProfileImagePreview(null);
    setRecipeImagePreview(null);
    setCaptchaInput('');
    setCaptcha(generateCaptcha());
    setSubmitStatus('idle');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-neutral-900 to-black px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F77313] rounded-full flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-display text-xl md:text-2xl text-white tracking-wide">
                  {t.title}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {submitStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl text-black mb-3">{t.successTitle}</h3>
                  <p className="text-neutral-600 max-w-md">{t.successMessage}</p>
                  {formData.memberOptIn && (
                    <p className="text-[#F77313] mt-4 text-sm">
                      {locale === 'fr' ? 'Redirection vers la page d\'inscription...' : 'Redirecting to registration page...'}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-neutral-600 mb-8">{t.subtitle}</p>

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800">{t.errorTitle}</h4>
                        <p className="text-red-700 text-sm">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section: Your Information */}
                    <div>
                      <h3 className="font-display text-lg text-black mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#F77313]" />
                        {t.yourInfo}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {t.name} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder={t.namePlaceholder}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {t.email} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder={t.emailPlaceholder}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          {t.profilePhoto}
                        </label>
                        <div className="flex items-center gap-4">
                          {profileImagePreview ? (
                            <img
                              src={profileImagePreview}
                              alt="Profile"
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
                              <User className="w-8 h-8 text-neutral-400" />
                            </div>
                          )}
                          <label className="cursor-pointer px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors flex items-center gap-2">
                            {uploadingProfile ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Camera className="w-4 h-4" />
                            )}
                            {t.uploadPhoto}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, 'profile');
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Section: Your Recipe */}
                    <div>
                      <h3 className="font-display text-lg text-black mb-4 flex items-center gap-2">
                        <ChefHat className="w-5 h-5 text-[#F77313]" />
                        {t.yourRecipe}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {t.recipeName} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="recipeName"
                            value={formData.recipeName}
                            onChange={handleChange}
                            required
                            placeholder={t.recipeNamePlaceholder}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {t.description} <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={2}
                            placeholder={t.descriptionPlaceholder}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {t.ingredients} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="ingredients"
                              value={formData.ingredients}
                              onChange={handleChange}
                              required
                              rows={6}
                              placeholder={t.ingredientsPlaceholder}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all resize-none font-mono text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                              <ListOrdered className="w-4 h-4" />
                              {t.instructions} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="instructions"
                              value={formData.instructions}
                              onChange={handleChange}
                              required
                              rows={6}
                              placeholder={t.instructionsPlaceholder}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all resize-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {t.prepTime}
                            </label>
                            <input
                              type="number"
                              name="prepTime"
                              value={formData.prepTime}
                              onChange={handleChange}
                              placeholder={t.prepTimePlaceholder}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {t.cookTime}
                            </label>
                            <input
                              type="number"
                              name="cookTime"
                              value={formData.cookTime}
                              onChange={handleChange}
                              placeholder={t.cookTimePlaceholder}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {t.servings}
                            </label>
                            <input
                              type="text"
                              name="servings"
                              value={formData.servings}
                              onChange={handleChange}
                              placeholder={t.servingsPlaceholder}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              {t.category}
                            </label>
                            <select
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all bg-white"
                            >
                              <option value="">{t.selectCategory}</option>
                              {Object.entries(t.categories).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {t.recipePhoto}
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
                              {t.uploadPhoto}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file, 'recipe');
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section: Options */}
                    <div className="bg-neutral-50 rounded-xl p-6">
                      <h3 className="font-display text-lg text-black mb-4">{t.options}</h3>
                      <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="newsletterOptIn"
                            checked={formData.newsletterOptIn}
                            onChange={handleChange}
                            className="w-5 h-5 mt-0.5 rounded border-neutral-300 text-[#F77313] focus:ring-[#F77313]"
                          />
                          <span className="text-neutral-700">{t.newsletterOptIn}</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="memberOptIn"
                            checked={formData.memberOptIn}
                            onChange={handleChange}
                            className="w-5 h-5 mt-0.5 rounded border-neutral-300 text-[#F77313] focus:ring-[#F77313]"
                          />
                          <span className="text-neutral-700">{t.memberOptIn}</span>
                        </label>
                      </div>
                    </div>

                    {/* Captcha */}
                    <div className="bg-neutral-100 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-[#F77313]" />
                        <span className="font-medium text-neutral-700">{t.captchaLabel}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-medium">
                          {t.captchaQuestion} {captcha.num1} + {captcha.num2} ?
                        </span>
                        <input
                          type="number"
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          required
                          className={`w-20 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all ${
                            captchaError ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                          }`}
                        />
                      </div>
                      {captchaError && (
                        <p className="text-red-600 text-sm mt-2">{t.captchaError}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 bg-[#F77313] hover:bg-[#d45f0a] text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t.submitting}
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {t.submit}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
