import Link from 'next/link';
import { Refrigerator, ChefHat, Sparkles, ArrowRight } from 'lucide-react';

interface FrigoMagiqueCTAProps {
  locale?: 'fr' | 'en';
}

export function FrigoMagiqueCTA({ locale = 'fr' }: FrigoMagiqueCTAProps) {
  const isEN = locale === 'en';

  const content = isEN ? {
    eyebrow: 'Smart tool',
    title: "What's in your fridge?",
    description: 'Select your ingredients and discover all the recipes you can make with what you have!',
    buttonText: 'Try Magic Fridge',
    features: [
      'Find recipes with your ingredients',
      'Reduce food waste',
      'Save time and money',
    ],
  } : {
    eyebrow: 'Outil intelligent',
    title: "Qu'y a-t-il dans votre frigo?",
    description: 'Sélectionnez vos ingrédients et découvrez toutes les recettes que vous pouvez réaliser avec ce que vous avez!',
    buttonText: 'Essayer le Frigo Magique',
    features: [
      'Trouver des recettes avec vos ingrédients',
      'Réduire le gaspillage alimentaire',
      'Économiser temps et argent',
    ],
  };

  const href = isEN ? '/en/frigo' : '/frigo';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left - Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#F77313]" />
              <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                {content.eyebrow}
              </span>
            </div>

            <h2 className="font-display text-4xl lg:text-5xl text-neutral-900 mb-4">
              {content.title}
            </h2>

            <p className="text-neutral-600 text-lg mb-6 leading-relaxed">
              {content.description}
            </p>

            <ul className="space-y-3 mb-8">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-neutral-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <ChefHat className="w-4 h-4 text-[#F77313]" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={href}
              className="inline-flex items-center justify-center gap-2 bg-[#F77313] hover:bg-[#e56610] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg group"
            >
              {content.buttonText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right - Visual */}
          <div className="bg-gradient-to-br from-[#F77313]/10 to-orange-100 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
                <Refrigerator className="w-32 h-32 text-[#F77313] mx-auto mb-4" strokeWidth={1.5} />
                <div className="flex flex-wrap gap-2 justify-center">
                  {['🥕', '🍅', '🧅', '🥔', '🧀', '🥩'].map((emoji, index) => (
                    <span
                      key={index}
                      className="text-3xl animate-bounce"
                      style={{ animationDelay: `${index * 0.1}s`, animationDuration: '2s' }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
