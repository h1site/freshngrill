'use client';

import { Radio, ChefHat, Timer, Search, Heart, Globe } from 'lucide-react';

interface FeaturesSectionProps {
  locale?: 'fr' | 'en';
}

export function FeaturesSection({ locale = 'fr' }: FeaturesSectionProps) {
  const isEN = locale === 'en';

  const features = [
    {
      icon: <Radio className="w-6 h-6" />,
      title: isEN ? 'Radio while cooking' : 'Radio en cuisinant',
      description: isEN
        ? 'Listen to music from around the world while preparing your recipes. 7 stations available: Jazz, Rock, Electro, and more!'
        : 'Écoutez de la musique du monde entier pendant que vous préparez vos recettes. 7 stations disponibles: Jazz, Rock, Electro, et plus!',
      color: 'from-pink-500 to-purple-600',
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: isEN ? 'Cooking Mode' : 'Mode Cuisine',
      description: isEN
        ? 'Step-by-step instructions with text-to-speech and voice control. Navigate hands-free by saying "next step" or "read ingredients"!'
        : 'Instructions étape par étape avec lecture vocale et contrôle par la voix. Naviguez mains libres en disant "suivant" ou "ingrédients"!',
      color: 'from-[#F77313] to-[#d45f0a]',
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: isEN ? 'Search by ingredients' : 'Recherche par ingrédients',
      description: isEN
        ? 'Tell us what\'s in your fridge and we\'ll find recipes you can make. No more wasted food!'
        : 'Dites-nous ce qu\'il y a dans votre frigo et nous trouverons des recettes que vous pouvez faire. Fini le gaspillage!',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <Timer className="w-6 h-6" />,
      title: isEN ? 'Built-in timers' : 'Minuteries intégrées',
      description: isEN
        ? 'Set timers directly from recipes. Get notified when it\'s time to check on your dish.'
        : 'Réglez des minuteries directement depuis les recettes. Soyez notifié quand c\'est le moment de vérifier votre plat.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: isEN ? 'Save your favorites' : 'Sauvegardez vos favoris',
      description: isEN
        ? 'Like recipes to save them and find them easily later. Vote for your favorites!'
        : 'Aimez les recettes pour les sauvegarder et les retrouver facilement. Votez pour vos préférées!',
      color: 'from-red-500 to-rose-600',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: isEN ? 'Bilingual' : 'Bilingue',
      description: isEN
        ? 'All our recipes are available in French and English. Switch languages anytime!'
        : 'Toutes nos recettes sont disponibles en français et en anglais. Changez de langue à tout moment!',
      color: 'from-violet-500 to-purple-600',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
            {isEN ? 'Features' : 'Fonctionnalités'}
          </span>
          <h2 className="text-4xl md:text-5xl font-display mt-2">
            {isEN ? 'More than just recipes' : 'Plus que des recettes'}
          </h2>
          <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
            {isEN
              ? 'Menucochon is designed to make your cooking experience enjoyable and stress-free.'
              : 'Menucochon est conçu pour rendre votre expérience culinaire agréable et sans stress.'}
          </p>
          <div className="w-16 h-1 bg-[#F77313] mx-auto mt-6" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 md:p-8 hover:border-neutral-600 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-neutral-500 text-sm">
            {isEN
              ? 'Click the Radio button in the header to start listening!'
              : 'Cliquez sur le bouton Radio dans l\'en-tête pour commencer à écouter!'}
          </p>
        </div>
      </div>
    </section>
  );
}
