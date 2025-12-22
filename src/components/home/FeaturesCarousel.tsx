'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ChefHat, Timer, Search, Heart, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeatureSlide {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  color: string;
}

interface FeaturesCarouselProps {
  locale?: 'fr' | 'en';
}

export function FeaturesCarousel({ locale = 'fr' }: FeaturesCarouselProps) {
  const isEN = locale === 'en';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const features: FeatureSlide[] = [
    {
      icon: <Radio className="w-8 h-8" />,
      title: isEN ? 'Radio while cooking' : 'Radio en cuisinant',
      description: isEN
        ? 'Listen to music from around the world while preparing your recipes. 7 stations available: Jazz, Rock, Electro, and more!'
        : 'Écoutez de la musique du monde entier pendant que vous préparez vos recettes. 7 stations disponibles: Jazz, Rock, Electro, et plus!',
      image: '/images/features/radio.webp',
      color: 'from-pink-500 to-purple-600',
    },
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: isEN ? 'Cooking Mode' : 'Mode Cuisine',
      description: isEN
        ? 'Step-by-step instructions with text-to-speech and voice control. Navigate hands-free!'
        : 'Instructions étape par étape avec lecture vocale et contrôle par la voix. Naviguez mains libres!',
      image: '/images/features/cooking-mode.webp',
      color: 'from-[#F77313] to-[#d45f0a]',
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: isEN ? 'Search by ingredients' : 'Recherche par ingrédients',
      description: isEN
        ? "Tell us what's in your fridge and we'll find recipes you can make. No more wasted food!"
        : "Dites-nous ce qu'il y a dans votre frigo et nous trouverons des recettes que vous pouvez faire!",
      image: '/images/features/search.webp',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <Timer className="w-8 h-8" />,
      title: isEN ? 'Built-in timers' : 'Minuteries intégrées',
      description: isEN
        ? "Set timers directly from recipes. Get notified when it's time to check on your dish."
        : 'Réglez des minuteries directement depuis les recettes. Soyez notifié au bon moment.',
      image: '/images/features/timer.webp',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: isEN ? 'Save your favorites' : 'Sauvegardez vos favoris',
      description: isEN
        ? 'Like recipes to save them and find them easily later. Vote for your favorites!'
        : 'Aimez les recettes pour les sauvegarder et les retrouver facilement. Votez pour vos préférées!',
      image: '/images/features/favorites.webp',
      color: 'from-red-500 to-rose-600',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: isEN ? 'Bilingual' : 'Bilingue',
      description: isEN
        ? 'All our recipes are available in French and English. Switch languages anytime!'
        : 'Toutes nos recettes sont disponibles en français et en anglais. Changez de langue à tout moment!',
      image: '/images/features/bilingual.webp',
      color: 'from-violet-500 to-purple-600',
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  }, [features.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  }, [features.length]);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const currentFeature = features[currentIndex];

  return (
    <section
      className="relative h-[70vh] min-h-[500px] max-h-[700px] bg-neutral-950 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background gradient based on current feature */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.color} opacity-20 transition-all duration-700`} />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

          {/* Left - Text Content */}
          <div className="text-white">
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                {isEN ? 'Features' : 'Fonctionnalités'}
              </span>
              <div className="w-12 h-0.5 bg-[#F77313]" />
            </motion.div>

            {/* Main Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-4">
              {isEN ? 'More than just recipes' : 'Plus que des recettes'}
            </h2>
            <p className="text-neutral-400 mb-10 max-w-lg">
              {isEN
                ? 'Menucochon is designed to make your cooking experience enjoyable and stress-free.'
                : 'Menucochon est conçu pour rendre votre expérience culinaire agréable et sans stress.'}
            </p>

            {/* Current Feature */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8"
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentFeature.color} flex items-center justify-center mb-5 shadow-lg`}>
                  {currentFeature.icon}
                </div>

                {/* Feature Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {currentFeature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-neutral-300 text-lg leading-relaxed">
                  {currentFeature.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-8">
              {/* Prev/Next Buttons */}
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label={isEN ? 'Previous feature' : 'Fonctionnalité précédente'}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label={isEN ? 'Next feature' : 'Fonctionnalité suivante'}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2 ml-4">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-[#F77313]'
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`${isEN ? 'Go to feature' : 'Aller à la fonctionnalité'} ${index + 1}`}
                  />
                ))}
              </div>

              {/* Counter */}
              <span className="text-white/50 text-sm ml-auto">
                {String(currentIndex + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Right - Visual Preview (hidden on mobile) */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Feature Icon Large */}
                <div className={`w-full aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br ${currentFeature.color} opacity-30 absolute inset-0 blur-3xl`} />
                <div className={`relative w-full aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br ${currentFeature.color} flex items-center justify-center`}>
                  <div className="text-white/90 transform scale-[4]">
                    {currentFeature.icon}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full bg-[#F77313]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          key={currentIndex}
        />
      </div>
    </section>
  );
}
