'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import type { Locale } from '@/i18n/config';

interface MagazineCTAProps {
  recipe?: Recipe;
  locale?: Locale;
}

const translations = {
  fr: {
    explore: 'Explorez',
    readyTo: 'Prêt à',
    cook: 'Cuisiner?',
    description: "Découvrez notre collection complète de recettes gourmandes et trouvez l'inspiration pour vos prochains repas.",
    exploreRecipes: 'Explorer les recettes',
    readBlog: 'Lire le blog',
  },
  en: {
    explore: 'Explore',
    readyTo: 'Ready to',
    cook: 'Cook?',
    description: 'Discover our complete collection of delicious recipes and find inspiration for your next meals.',
    exploreRecipes: 'Explore Recipes',
    readBlog: 'Read the Blog',
  },
};

export function MagazineCTA({ recipe, locale = 'fr' }: MagazineCTAProps) {
  const t = translations[locale];
  const recipeBasePath = locale === 'en' ? '/en/recipe' : '/recette';
  const blogBasePath = locale === 'en' ? '/en/blog' : '/blog';

  return (
    <section className="relative py-[100px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-neutral-950">
        {recipe?.featuredImage && (
          <>
            <Image
              src={recipe.featuredImage}
              alt={recipe.title || 'Image de fond'}
              fill
              className="object-cover opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
          </>
        )}

        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-[#F77313]/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#F77313]/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(247,115,19,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(247,115,19,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 text-[#F77313] text-sm font-semibold uppercase tracking-[0.2em] mb-6">
              <Sparkles className="w-4 h-4" />
              {t.explore}
              <Sparkles className="w-4 h-4" />
            </span>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-white leading-[0.9] mb-8">
              {t.readyTo}
              <br />
              <span className="text-[#F77313]">{t.cook}</span>
            </h2>

            {/* Description */}
            <p className="text-neutral-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              {t.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={recipeBasePath}
                  className="group inline-flex items-center gap-3 bg-[#F77313] text-white px-10 py-5 font-medium uppercase tracking-wide text-sm hover:bg-white hover:text-black transition-all duration-300"
                >
                  {t.exploreRecipes}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={blogBasePath}
                  className="group inline-flex items-center gap-3 bg-transparent text-white px-10 py-5 font-medium uppercase tracking-wide text-sm border border-white/30 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  {t.readBlog}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F77313] to-transparent" />
    </section>
  );
}
