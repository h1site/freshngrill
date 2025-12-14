'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Rss } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';

interface FooterProps {
  locale?: Locale;
  dictionary?: Dictionary;
}

export default function Footer({ locale: localeProp = 'fr', dictionary }: FooterProps) {
  const pathname = usePathname();

  // Detect actual locale from pathname (client-side, always up-to-date)
  const locale: Locale = useMemo(() => {
    return pathname?.startsWith('/en') ? 'en' : 'fr';
  }, [pathname]);

  const currentYear = new Date().getFullYear();

  // Préfixe URL pour la locale
  const urlPrefix = locale === 'en' ? '/en' : '';

  // Route paths based on locale
  const routes = locale === 'en' ? {
    recipe: '/en/recipe',
    blog: '/en/blog',
    about: '/en/about',
    contact: '/en/contact',
    privacy: '/en/privacy',
  } : {
    recipe: '/recette',
    blog: '/blog',
    about: '/a-propos',
    contact: '/contact',
    privacy: '/confidentialite',
  };

  // Traductions inline pour chaque locale (client-side, always up-to-date)
  const translations = {
    fr: {
      tagline: 'Des recettes gourmandes et faciles à réaliser pour tous les jours. Découvrez notre collection de plats délicieux.',
      recipes: 'Recettes',
      allRecipes: 'Toutes les recettes',
      popularRecipes: 'Recettes populaires',
      quickRecipes: 'Recettes rapides',
      easyRecipes: 'Recettes faciles',
      categories: 'Catégories',
      starters: 'Entrées',
      mainDishes: 'Plats principaux',
      desserts: 'Desserts',
      vegetarian: 'Végétarien',
      blog: 'Blog',
      allArticles: 'Tous les articles',
      cookingTips: 'Conseils cuisine',
      news: 'Actualités',
      buyingGuide: "Guide d'achat",
      info: 'Informations',
      about: 'À propos',
      contact: 'Contact',
      privacy: 'Confidentialité',
      copyright: '© {year} Menu Cochon. Tous droits réservés.',
      madeWith: 'Fait avec',
      inQuebec: 'au Québec'
    },
    en: {
      tagline: 'Delicious and easy-to-make recipes for every day. Discover our collection of tasty dishes.',
      recipes: 'Recipes',
      allRecipes: 'All Recipes',
      popularRecipes: 'Popular Recipes',
      quickRecipes: 'Quick Recipes',
      easyRecipes: 'Easy Recipes',
      categories: 'Categories',
      starters: 'Starters',
      mainDishes: 'Main Dishes',
      desserts: 'Desserts',
      vegetarian: 'Vegetarian',
      blog: 'Blog',
      allArticles: 'All Articles',
      cookingTips: 'Cooking Tips',
      news: 'News',
      buyingGuide: 'Buying Guide',
      info: 'Information',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy',
      copyright: '© {year} Menu Cochon. All rights reserved.',
      madeWith: 'Made with',
      inQuebec: 'in Quebec'
    }
  };

  // Use the correct translations based on detected locale
  const t = translations[locale];

  const links = {
    recettes: [
      { name: t.allRecipes, href: routes.recipe },
      { name: t.popularRecipes, href: `${routes.recipe}?tri=populaire` },
      { name: t.quickRecipes, href: `${routes.recipe}?temps=30` },
      { name: t.easyRecipes, href: `${routes.recipe}?difficulte=facile` },
    ],
    categories: [
      { name: t.starters, href: `${routes.recipe}?categorie=entrees` },
      { name: t.mainDishes, href: `${routes.recipe}?categorie=plats-principaux` },
      { name: t.desserts, href: `${routes.recipe}?categorie=desserts` },
      { name: t.vegetarian, href: `${routes.recipe}?categorie=vegetarien` },
    ],
    blog: [
      { name: t.allArticles, href: routes.blog },
      { name: t.cookingTips, href: `${routes.blog}?categorie=conseils` },
      { name: t.news, href: `${routes.blog}?categorie=actualites` },
      { name: t.buyingGuide, href: locale === 'en' ? '/en/buying-guide' : '/guide-achat' },
    ],
    info: [
      { name: t.about, href: routes.about },
      { name: t.contact, href: routes.contact },
      { name: t.privacy, href: routes.privacy },
    ],
  };

  return (
    <footer className="bg-black text-white pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`${urlPrefix}/`} className="inline-block mb-6">
              <Image
                src="/images/logos/menucochon-blanc.svg"
                alt="Menu Cochon"
                width={250}
                height={56}
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {t.tagline}
            </p>
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.facebook.com/menucochon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-[#F77313] rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/menucochon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-[#F77313] rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={locale === 'en' ? '/en/rss/recipes' : '/rss/recettes'}
                className="w-10 h-10 bg-neutral-800 hover:bg-[#F77313] rounded-full flex items-center justify-center transition-colors"
                aria-label={locale === 'en' ? 'RSS Feed' : 'Flux RSS'}
              >
                <Rss className="w-5 h-5" />
              </a>
            </div>
            {/* Language Switcher Mobile */}
            <div className="mt-6 md:hidden">
              <LanguageSwitcher locale={locale} />
            </div>
          </div>

          {/* Recettes */}
          <div>
            <h3 className="font-display text-xl tracking-wide mb-6 text-[#F77313]">
              {t.recipes}
            </h3>
            <ul className="space-y-3">
              {links.recettes.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="font-display text-xl tracking-wide mb-6 text-[#F77313]">
              {t.categories}
            </h3>
            <ul className="space-y-3">
              {links.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="font-display text-xl tracking-wide mb-6 text-[#F77313]">
              {t.blog}
            </h3>
            <ul className="space-y-3">
              {links.blog.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="font-display text-xl tracking-wide mb-6 text-[#F77313]">
              {t.info}
            </h3>
            <ul className="space-y-3">
              {links.info.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            {t.copyright.replace('{year}', currentYear.toString())}
          </p>
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <span>{t.madeWith}</span>
            <span className="text-[#F77313]">♥</span>
            <span>{t.inQuebec}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
