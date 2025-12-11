'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, Check, Clock, Users } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import Image from 'next/image';

interface Props {
  recipe: Recipe;
  compact?: boolean;
}

export default function CookModeButton({ recipe, compact = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  // Total des étapes: 0 = ingrédients, 1+ = instructions
  const totalPages = recipe.instructions.length + 1;

  // Bloquer le scroll du body quand le mode est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  const nextStep = () => {
    if (currentStep < totalPages - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleIngredient = (id: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedIngredients(newChecked);
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setCurrentStep(0);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 bg-[#F77313] hover:bg-[#d45f0a] text-white font-medium rounded-full transition-colors ${
          compact ? 'p-2 md:px-4 md:py-2' : 'px-5 py-2.5'
        }`}
        title="Mode Cuisine"
      >
        <Maximize2 className={compact ? 'w-4 h-4 md:w-5 md:h-5' : 'w-5 h-5'} />
        <span className={compact ? 'hidden md:inline text-sm' : ''}>Mode Cuisine</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black"
          >
            {/* Conteneur principal - Layout livre */}
            <div className="h-full flex flex-col lg:flex-row">
              {/* Page gauche - Image */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative h-[35vh] lg:h-full lg:w-[40%] flex-shrink-0"
              >
                {recipe.featuredImage ? (
                  <Image
                    src={recipe.featuredImage}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-800" />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* Titre sur l'image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                  <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-4">
                    {recipe.title}
                  </h1>

                  {/* Infos rapides */}
                  <div className="flex flex-wrap gap-4 text-white/80">
                    {recipe.prepTime > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Prép: {recipe.prepTime} min</span>
                      </div>
                    )}
                    {recipe.cookTime > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Cuisson: {recipe.cookTime} min</span>
                      </div>
                    )}
                    {recipe.servings > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{recipe.servings} {recipe.servingsUnit || 'portions'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bouton fermer */}
                <button
                  onClick={resetAndClose}
                  className="absolute top-4 left-4 lg:top-6 lg:left-6 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </motion.div>

              {/* Page droite - Contenu */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 bg-white flex flex-col overflow-hidden"
              >
                {/* Header avec pagination */}
                <div className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-neutral-200 bg-neutral-50">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentStep(i)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          i === currentStep
                            ? 'bg-[#F77313] scale-125'
                            : i < currentStep
                            ? 'bg-green-500'
                            : 'bg-neutral-300 hover:bg-neutral-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-neutral-500">
                    {currentStep === 0 ? 'Ingrédients' : `Étape ${currentStep} / ${totalPages - 1}`}
                  </span>
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {currentStep === 0 ? (
                      // Page des ingrédients
                      <motion.div
                        key="ingredients"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 lg:p-10"
                      >
                        <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                          <span className="text-3xl">🥗</span>
                          Ingrédients
                        </h2>

                        <div className="space-y-6">
                          {recipe.ingredients.map((group, groupIndex) => (
                            <div key={groupIndex}>
                              {group.title && (
                                <h3 className="text-lg font-semibold text-[#F77313] mb-3 uppercase tracking-wide">
                                  {group.title}
                                </h3>
                              )}
                              <ul className="space-y-2">
                                {group.items.map((item, itemIndex) => {
                                  const id = `${groupIndex}-${itemIndex}`;
                                  const isChecked = checkedIngredients.has(id);
                                  return (
                                    <li key={itemIndex}>
                                      <button
                                        onClick={() => toggleIngredient(id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                                          isChecked
                                            ? 'bg-green-50 border-2 border-green-500'
                                            : 'bg-neutral-50 hover:bg-neutral-100 border-2 border-transparent'
                                        }`}
                                      >
                                        <div
                                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                            isChecked
                                              ? 'bg-green-500 text-white'
                                              : 'bg-white border-2 border-neutral-300'
                                          }`}
                                        >
                                          {isChecked && <Check className="w-4 h-4" />}
                                        </div>
                                        <span
                                          className={`text-lg ${
                                            isChecked ? 'text-green-700 line-through' : 'text-neutral-800'
                                          }`}
                                        >
                                          {item.quantity && <strong>{item.quantity} </strong>}
                                          {item.unit && <span>{item.unit} </span>}
                                          {item.name}
                                          {item.note && (
                                            <span className="text-neutral-500 text-base"> ({item.note})</span>
                                          )}
                                        </span>
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      // Page d'instruction
                      <motion.div
                        key={`step-${currentStep}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 lg:p-10 flex flex-col justify-center min-h-full"
                      >
                        <div className="max-w-2xl mx-auto w-full">
                          {/* Numéro de l'étape */}
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#F77313] rounded-full flex items-center justify-center text-white text-3xl lg:text-4xl font-bold shadow-lg">
                              {currentStep}
                            </div>
                            <div className="flex-1 h-1 bg-gradient-to-r from-[#F77313] to-transparent rounded" />
                          </div>

                          {/* Titre de l'étape si présent */}
                          {recipe.instructions[currentStep - 1]?.title && (
                            <h3 className="text-xl lg:text-2xl font-bold text-neutral-800 mb-4">
                              {recipe.instructions[currentStep - 1].title}
                            </h3>
                          )}

                          {/* Contenu de l'étape */}
                          <p className="text-xl lg:text-2xl text-neutral-700 leading-relaxed mb-8">
                            {recipe.instructions[currentStep - 1]?.content}
                          </p>

                          {/* Astuce si présente */}
                          {recipe.instructions[currentStep - 1]?.tip && (
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
                              <p className="text-amber-800 flex items-start gap-3">
                                <span className="text-2xl">💡</span>
                                <span className="text-lg">{recipe.instructions[currentStep - 1].tip}</span>
                              </p>
                            </div>
                          )}

                          {/* Image de l'étape si présente */}
                          {recipe.instructions[currentStep - 1]?.image && (
                            <div className="mt-8 rounded-xl overflow-hidden">
                              <Image
                                src={recipe.instructions[currentStep - 1].image!}
                                alt={`Étape ${currentStep}`}
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between px-6 lg:px-10 py-4 border-t border-neutral-200 bg-white">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                      currentStep === 0
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Précédent</span>
                  </button>

                  <span className="text-neutral-500 text-sm">
                    Utilisez ← → ou Espace pour naviguer
                  </span>

                  <button
                    onClick={nextStep}
                    disabled={currentStep === totalPages - 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                      currentStep === totalPages - 1
                        ? 'bg-green-500 text-white'
                        : 'bg-[#F77313] hover:bg-[#d45f0a] text-white'
                    }`}
                  >
                    <span className="hidden sm:inline">
                      {currentStep === totalPages - 1 ? 'Terminé!' : 'Suivant'}
                    </span>
                    {currentStep === totalPages - 1 ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
