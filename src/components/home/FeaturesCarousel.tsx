'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ChefHat, Search, ChevronLeft, ChevronRight, ShoppingBag, Leaf, BookOpen, ArrowRight } from 'lucide-react';

interface FeatureSlide {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  color: string;
  href?: string;
  cta?: string;
}

interface FeaturesCarouselProps {
  locale?: 'fr' | 'en';
}

export function FeaturesCarousel({ locale = 'fr' }: FeaturesCarouselProps) {
  const isEN = locale === 'en';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const features: FeatureSlide[] = [
    // Banner slides first
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: isEN ? 'Buying Guide' : 'Guide d\'achat',
      description: isEN
        ? 'Find the best kitchen equipment recommended by our chefs. Quality tools for perfect results.'
        : 'Trouvez les meilleurs équipements de cuisine recommandés par nos chefs. Des outils de qualité pour des résultats parfaits.',
      image: '/images/banners/guide-achat.webp',
      color: 'from-amber-500 to-orange-600',
      href: isEN ? '/en/buying-guide' : '/guide-achat',
      cta: isEN ? 'Explore guides' : 'Explorer les guides',
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: isEN ? 'Spice Route' : 'Route des épices',
      description: isEN
        ? 'Discover spices from around the world. Origins, pairings, and tips to elevate your dishes.'
        : 'Découvrez les épices du monde entier. Origines, accords et astuces pour sublimer vos plats.',
      image: '/images/banners/route-epices.webp',
      color: 'from-emerald-500 to-teal-600',
      href: isEN ? '/en/spices/spice-pairing' : '/epices/route-des-epices',
      cta: isEN ? 'Discover spices' : 'Découvrir les épices',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: isEN ? 'Culinary Glossary' : 'Lexique culinaire',
      description: isEN
        ? 'Master cooking vocabulary. Definitions, techniques, and tips for every skill level.'
        : 'Maîtrisez le vocabulaire culinaire. Définitions, techniques et astuces pour tous les niveaux.',
      image: '/images/banners/lexique.webp',
      color: 'from-indigo-500 to-purple-600',
      href: isEN ? '/en/glossary' : '/lexique',
      cta: isEN ? 'Browse glossary' : 'Parcourir le lexique',
    },
    // Feature slides
    {
      icon: <Radio className="w-8 h-8" />,
      title: isEN ? 'Radio while cooking' : 'Radio en cuisinant',
      description: isEN
        ? 'Listen to music from around the world while preparing your recipes. 7 stations available!'
        : 'Écoutez de la musique du monde entier pendant que vous préparez vos recettes. 7 stations disponibles!',
      image: '/images/banners/radio.webp',
      color: 'from-pink-500 to-purple-600',
    },
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: isEN ? 'Cooking Mode' : 'Mode Cuisine',
      description: isEN
        ? 'Step-by-step instructions with text-to-speech and voice control. Navigate hands-free!'
        : 'Instructions étape par étape avec lecture vocale et contrôle par la voix. Naviguez mains libres!',
      image: '/images/banners/cooking-mode.webp',
      color: 'from-[#F77313] to-[#d45f0a]',
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: isEN ? 'Search by ingredients' : 'Recherche par ingrédients',
      description: isEN
        ? "Tell us what's in your fridge and we'll find recipes you can make!"
        : "Dites-nous ce qu'il y a dans votre frigo et nous trouverons des recettes!",
      image: '/images/banners/frigo.webp',
      color: 'from-cyan-500 to-blue-600',
      href: isEN ? '/en/fridge' : '/frigo',
      cta: isEN ? 'Try it now' : 'Essayer maintenant',
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
      className="relative h-[60vh] min-h-[450px] max-h-[600px] bg-neutral-950 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image or Gradient Fallback */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Gradient background as base/fallback */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.color}`} />

          {/* Image if available */}
          {currentFeature.image && (
            <Image
              src={currentFeature.image}
              alt={currentFeature.title}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              sizes="100vw"
              onError={(e) => {
                // Hide image on error, showing gradient fallback
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-white"
            >
              {/* Icon Badge */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentFeature.color} flex items-center justify-center mb-6 shadow-2xl`}>
                {currentFeature.icon}
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display mb-4 leading-tight">
                {currentFeature.title}
              </h2>

              {/* Description */}
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-xl leading-relaxed">
                {currentFeature.description}
              </p>

              {/* CTA Button */}
              {currentFeature.href && currentFeature.cta && (
                <Link
                  href={currentFeature.href}
                  className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 font-medium uppercase tracking-wide text-sm hover:bg-[#F77313] hover:text-white transition-all duration-300 shadow-lg"
                >
                  {currentFeature.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-10">
            {/* Prev/Next Buttons */}
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
              aria-label={isEN ? 'Previous' : 'Précédent'}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
              aria-label={isEN ? 'Next' : 'Suivant'}
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
                  aria-label={`${isEN ? 'Go to slide' : 'Aller au slide'} ${index + 1}`}
                />
              ))}
            </div>

            {/* Counter */}
            <span className="text-white/50 text-sm ml-auto">
              {String(currentIndex + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
            </span>
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
