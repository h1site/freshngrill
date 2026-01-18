'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Rss, Youtube } from 'lucide-react';
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
    shop: '/en/store',
  } : {
    recipe: '/recette',
    blog: '/blog',
    about: '/a-propos',
    contact: '/contact',
    privacy: '/confidentialite',
    shop: '/boutique',
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
      quebecRecipes: 'Recettes québécoises',
      seasonalRecipes: 'Recettes de saison',
      budgetRecipes: 'Recettes économiques',
      categories: 'Catégories',
      starters: 'Entrées',
      mainDishes: 'Plats principaux',
      desserts: 'Desserts',
      vegetarian: 'Végétarien',
      soups: 'Soupes et potages',
      salads: 'Salades',
      snacks: 'Collations',
      drinks: 'Boissons',
      blog: 'Blog',
      allArticles: 'Tous les articles',
      cookingTips: 'Conseils cuisine',
      news: 'Actualités',
      buyingGuide: "Guide d'achat",
      spices: 'La Route des Épices',
      lexicon: 'Lexique culinaire',
      techniques: 'Techniques de cuisine',
      ingredients: 'Ingrédients',
      info: 'Informations',
      about: 'À propos',
      contact: 'Contact',
      privacy: 'Confidentialité',
      shop: 'Boutique',
      videos: 'Vidéos',
      sitemap: 'Plan du site',
      submitRecipe: 'Soumettre une recette',
      terms: 'Conditions d\'utilisation',
      magicFridge: 'Frigo magique',
      copyright: '© {year} Menucochon. Tous droits réservés.',
      madeWith: 'Fait avec',
      inQuebec: 'au Québec',
      createdBy: 'Création de l\'agence Web',
      h1site: 'H1site.com'
    },
    en: {
      tagline: 'Delicious and easy-to-make recipes for every day. Discover our collection of tasty dishes.',
      recipes: 'Recipes',
      allRecipes: 'All Recipes',
      popularRecipes: 'Popular Recipes',
      quickRecipes: 'Quick Recipes',
      easyRecipes: 'Easy Recipes',
      quebecRecipes: 'Quebec Recipes',
      seasonalRecipes: 'Seasonal Recipes',
      budgetRecipes: 'Budget Recipes',
      categories: 'Categories',
      starters: 'Starters',
      mainDishes: 'Main Dishes',
      desserts: 'Desserts',
      vegetarian: 'Vegetarian',
      soups: 'Soups',
      salads: 'Salads',
      snacks: 'Snacks',
      drinks: 'Drinks',
      blog: 'Blog',
      allArticles: 'All Articles',
      cookingTips: 'Cooking Tips',
      news: 'News',
      buyingGuide: 'Buying Guide',
      spices: 'Spice Route',
      lexicon: 'Culinary Lexicon',
      techniques: 'Cooking Techniques',
      ingredients: 'Ingredients',
      info: 'Information',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy',
      shop: 'Shop',
      videos: 'Videos',
      sitemap: 'Sitemap',
      submitRecipe: 'Submit a Recipe',
      terms: 'Terms of Use',
      magicFridge: 'Magic Fridge',
      copyright: '© {year} Menucochon. All rights reserved.',
      madeWith: 'Made with',
      inQuebec: 'in Quebec',
      createdBy: 'Created by Web Agency',
      h1site: 'H1site.com'
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
      { name: t.quebecRecipes, href: `${routes.recipe}?origine=quebec` },
      { name: t.seasonalRecipes, href: `${routes.recipe}?saison=actuelle` },
      { name: t.budgetRecipes, href: `${routes.recipe}?budget=economique` },
      { name: t.submitRecipe, href: locale === 'en' ? '/en/profile/submit-recipe' : '/profil/soumettre-recette' },
    ],
    categories: [
      { name: t.starters, href: `${routes.recipe}?categorie=entrees` },
      { name: t.mainDishes, href: `${routes.recipe}?categorie=plats-principaux` },
      { name: t.desserts, href: `${routes.recipe}?categorie=desserts` },
      { name: t.vegetarian, href: `${routes.recipe}?categorie=vegetarien` },
      { name: t.soups, href: `${routes.recipe}?categorie=soupes` },
      { name: t.salads, href: `${routes.recipe}?categorie=salades` },
      { name: t.snacks, href: `${routes.recipe}?categorie=collations` },
      { name: t.drinks, href: `${routes.recipe}?categorie=boissons` },
    ],
    blog: [
      { name: t.allArticles, href: routes.blog },
      { name: t.cookingTips, href: `${routes.blog}?categorie=conseils` },
      { name: t.news, href: `${routes.blog}?categorie=actualites` },
      { name: t.buyingGuide, href: locale === 'en' ? '/en/buying-guide' : '/guide-achat' },
      { name: t.spices, href: locale === 'en' ? '/en/spices' : '/epices' },
      { name: t.lexicon, href: locale === 'en' ? '/en/lexicon' : '/lexique' },
      { name: t.techniques, href: `${routes.blog}?categorie=techniques` },
      { name: t.ingredients, href: `${routes.blog}?categorie=ingredients` },
    ],
    info: [
      { name: t.shop, href: routes.shop },
      { name: t.videos, href: locale === 'en' ? '/en/videos' : '/videos' },
      { name: t.magicFridge, href: locale === 'en' ? '/en/frigo' : '/frigo' },
      { name: t.about, href: routes.about },
      { name: t.contact, href: routes.contact },
      { name: t.privacy, href: routes.privacy },
      { name: t.terms, href: locale === 'en' ? '/en/terms' : '/conditions-utilisation' },
      { name: t.sitemap, href: locale === 'en' ? '/en/sitemap' : '/plan-du-site' },
    ],
    rss: locale === 'en' ? [
      { name: 'Recipes', href: '/en/rss/recipes' },
      { name: 'Blog', href: '/en/rss/blog' },
      { name: 'Buying Guide', href: '/rss/guide-achat' },
      { name: 'Spices', href: '/rss/epices' },
      { name: 'Lexicon', href: '/rss/lexique' },
    ] : [
      { name: 'Recettes', href: '/rss/recettes' },
      { name: 'Blog', href: '/rss/blog' },
      { name: 'Guide d\'achat', href: '/rss/guide-achat' },
      { name: 'Épices', href: '/rss/epices' },
      { name: 'Lexique', href: '/rss/lexique' },
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
                alt="Menucochon"
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
                href="https://www.youtube.com/@menucochon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://ca.pinterest.com/menucochon/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-[#E60023] rounded-full flex items-center justify-center transition-colors"
                aria-label="Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
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
            {/* RSS Feeds */}
            <h4 className="font-display text-lg tracking-wide mt-8 mb-4 text-[#F77313] flex items-center gap-2">
              <Rss className="w-4 h-4" />
              RSS
            </h4>
            <ul className="space-y-2">
              {links.rss.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <Rss className="w-3 h-3" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-400 text-sm">
            {t.copyright.replace('{year}', currentYear.toString())}
          </p>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-neutral-400 text-sm">
            <div className="flex items-center gap-2">
              <span>{t.madeWith}</span>
              <span className="text-[#F77313]">♥</span>
              <span>{t.inQuebec}</span>
            </div>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center gap-1">
              <span>{t.createdBy}</span>
              <a
                href="https://h1site.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F77313] hover:text-white transition-colors"
              >
                {t.h1site}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
