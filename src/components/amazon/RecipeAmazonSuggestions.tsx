'use client';

import { useMemo } from 'react';
import { ShoppingCart, ChefHat, Utensils, Search } from 'lucide-react';
import { AmazonSearchAffiliateLink } from '@/components/affiliate/AmazonSearchAffiliateLink';

interface RecipeAmazonSuggestionsProps {
  /** Titre de la recette */
  recipeTitle: string;
  /** Liste des ingrédients (noms seulement) */
  ingredients?: string[];
  /** Catégorie de la recette */
  category?: string;
  /** Locale */
  locale?: 'fr' | 'en';
  /** Variante d'affichage */
  variant?: 'sidebar' | 'inline' | 'full';
}

const translations = {
  fr: {
    title: 'Acheter les ingrédients',
    equipment: 'Équipement recommandé',
    searchAll: 'Rechercher tout sur Amazon',
    viewOn: 'Voir sur Amazon',
    affiliate: 'En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises.',
  },
  en: {
    title: 'Buy the ingredients',
    equipment: 'Recommended equipment',
    searchAll: 'Search all on Amazon',
    viewOn: 'View on Amazon',
    affiliate: 'As an Amazon Associate, we earn from qualifying purchases.',
  },
};

// Mapping catégorie → équipement suggéré
const CATEGORY_EQUIPMENT: Record<string, { query: string; icon: string }[]> = {
  'dessert': [
    { query: 'batteur électrique cuisine', icon: '🍰' },
    { query: 'moule à gâteau silicone', icon: '🧁' },
    { query: 'balance cuisine précision', icon: '⚖️' },
  ],
  'soupes': [
    { query: 'marmite inox grande', icon: '🍲' },
    { query: 'mixeur plongeant', icon: '🥣' },
    { query: 'louche inox', icon: '🥄' },
  ],
  'pates': [
    { query: 'casserole pâtes passoire', icon: '🍝' },
    { query: 'pince cuisine inox', icon: '🍴' },
  ],
  'bbq': [
    { query: 'thermomètre viande digital', icon: '🌡️' },
    { query: 'pince bbq longue', icon: '🔥' },
    { query: 'brosse grill', icon: '🧹' },
  ],
  'boeuf': [
    { query: 'poêle fonte', icon: '🥩' },
    { query: 'thermomètre viande', icon: '🌡️' },
  ],
  'volaille': [
    { query: 'plat four pyrex', icon: '🍗' },
    { query: 'thermomètre cuisson', icon: '🌡️' },
  ],
  'porc': [
    { query: 'cocotte fonte', icon: '🐖' },
    { query: 'couteau chef', icon: '🔪' },
  ],
  'poissons': [
    { query: 'poêle anti-adhésive poisson', icon: '🐟' },
    { query: 'spatule poisson', icon: '🐠' },
  ],
  'dejeuner': [
    { query: 'poêle crêpes', icon: '🥞' },
    { query: 'gaufrier belge', icon: '🧇' },
  ],
  'salades': [
    { query: 'essoreuse salade', icon: '🥗' },
    { query: 'mandoline cuisine', icon: '🥒' },
  ],
  'boissons': [
    { query: 'blender smoothie', icon: '🍹' },
    { query: 'shaker cocktail', icon: '🍸' },
  ],
  'poutine': [
    { query: 'friteuse air chaud', icon: '🍟' },
  ],
  'default': [
    { query: 'couteau chef professionnel', icon: '🔪' },
    { query: 'planche découper bois', icon: '🪵' },
  ],
};

// Ingrédients spéciaux qui méritent un lien de recherche
const SPECIAL_INGREDIENTS = [
  'ají', 'aji', 'chipotle', 'sriracha', 'gochujang', 'harissa',
  'miso', 'tahini', 'za\'atar', 'sumac', 'ras el hanout',
  'panko', 'nouilles ramen', 'nouilles soba', 'vermicelles',
  'lait de coco', 'crème de coco', 'huile de sésame',
  'sauce soya', 'sauce hoisin', 'sauce teriyaki',
  'pâte de curry', 'curry', 'garam masala', 'curcuma',
  'cardamome', 'safran', 'vanille', 'extrait vanille',
  'chocolat noir', 'cacao', 'matcha',
  'sirop d\'érable', 'miel', 'sirop agave',
];

/**
 * Extrait les ingrédients intéressants pour des liens Amazon
 */
function extractSearchableIngredients(ingredients: string[], limit: number = 4): string[] {
  const searchable: string[] = [];

  for (const ingredient of ingredients) {
    const lowerIng = ingredient.toLowerCase();

    // Vérifier si c'est un ingrédient spécial
    for (const special of SPECIAL_INGREDIENTS) {
      if (lowerIng.includes(special) && !searchable.includes(special)) {
        searchable.push(special);
        if (searchable.length >= limit) return searchable;
      }
    }
  }

  return searchable;
}

/**
 * Détermine l'équipement suggéré basé sur la catégorie
 */
function getEquipmentSuggestions(category?: string): { query: string; icon: string }[] {
  if (!category) return CATEGORY_EQUIPMENT['default'];

  const lowerCat = category.toLowerCase();

  for (const [key, equipment] of Object.entries(CATEGORY_EQUIPMENT)) {
    if (lowerCat.includes(key)) {
      return equipment;
    }
  }

  return CATEGORY_EQUIPMENT['default'];
}

export default function RecipeAmazonSuggestions({
  recipeTitle,
  ingredients = [],
  category,
  locale = 'fr',
  variant = 'sidebar',
}: RecipeAmazonSuggestionsProps) {
  const t = translations[locale];

  // Extraire les ingrédients recherchables
  const searchableIngredients = useMemo(
    () => extractSearchableIngredients(ingredients),
    [ingredients]
  );

  // Obtenir les suggestions d'équipement
  const equipmentSuggestions = useMemo(
    () => getEquipmentSuggestions(category),
    [category]
  );

  // Générer une requête de recherche globale pour la recette
  const globalSearchQuery = useMemo(() => {
    // Simplifier le titre pour la recherche
    const simplifiedTitle = recipeTitle
      .replace(/recette/gi, '')
      .replace(/maison/gi, '')
      .replace(/facile/gi, '')
      .replace(/traditionnelle?/gi, '')
      .trim();

    return `${simplifiedTitle} ingrédients`;
  }, [recipeTitle]);

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2 my-4">
        <AmazonSearchAffiliateLink
          query={globalSearchQuery}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF9900] hover:bg-[#FF9900]/90 text-black text-sm font-medium rounded-full transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {t.searchAll}
        </AmazonSearchAffiliateLink>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-[#FF9900]" />
          {t.title}
        </h3>

        <div className="space-y-2">
          {/* Lien de recherche global */}
          <AmazonSearchAffiliateLink
            query={globalSearchQuery}
            className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-100 hover:border-[#FF9900] hover:shadow-sm transition-all group text-sm"
          >
            <span className="flex items-center gap-2 text-neutral-700 group-hover:text-[#FF9900]">
              <Search className="w-4 h-4" />
              {recipeTitle.length > 25 ? recipeTitle.substring(0, 25) + '...' : recipeTitle}
            </span>
            <span className="text-[#FF9900] text-xs font-medium">→</span>
          </AmazonSearchAffiliateLink>

          {/* Ingrédients spéciaux */}
          {searchableIngredients.slice(0, 2).map((ingredient) => (
            <AmazonSearchAffiliateLink
              key={ingredient}
              query={ingredient}
              className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-100 hover:border-[#FF9900] hover:shadow-sm transition-all group text-sm"
            >
              <span className="flex items-center gap-2 text-neutral-700 group-hover:text-[#FF9900]">
                <Utensils className="w-4 h-4" />
                {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
              </span>
              <span className="text-[#FF9900] text-xs font-medium">→</span>
            </AmazonSearchAffiliateLink>
          ))}

          {/* Équipement suggéré */}
          {equipmentSuggestions.slice(0, 2).map((eq) => (
            <AmazonSearchAffiliateLink
              key={eq.query}
              query={eq.query}
              className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-100 hover:border-[#FF9900] hover:shadow-sm transition-all group text-sm"
            >
              <span className="flex items-center gap-2 text-neutral-700 group-hover:text-[#FF9900]">
                <span>{eq.icon}</span>
                {eq.query.charAt(0).toUpperCase() + eq.query.slice(1)}
              </span>
              <span className="text-[#FF9900] text-xs font-medium">→</span>
            </AmazonSearchAffiliateLink>
          ))}
        </div>

        <p className="text-[9px] text-neutral-400 mt-3 text-center">{t.affiliate}</p>
      </div>
    );
  }

  // Variant 'full'
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 my-8">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-[#FF9900]" />
        {t.title}
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Recherche globale */}
        <AmazonSearchAffiliateLink
          query={globalSearchQuery}
          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-100 hover:border-[#FF9900] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 bg-[#FF9900]/10 rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-[#FF9900]" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800 group-hover:text-[#FF9900]">
              Tous les ingrédients
            </p>
            <p className="text-xs text-neutral-500">{t.viewOn}</p>
          </div>
        </AmazonSearchAffiliateLink>

        {/* Ingrédients spéciaux */}
        {searchableIngredients.map((ingredient) => (
          <AmazonSearchAffiliateLink
            key={ingredient}
            query={ingredient}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-100 hover:border-[#FF9900] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Utensils className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800 group-hover:text-[#FF9900]">
                {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
              </p>
              <p className="text-xs text-neutral-500">{t.viewOn}</p>
            </div>
          </AmazonSearchAffiliateLink>
        ))}

        {/* Équipement */}
        {equipmentSuggestions.map((eq) => (
          <AmazonSearchAffiliateLink
            key={eq.query}
            query={eq.query}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-100 hover:border-[#FF9900] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-xl">
              {eq.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800 group-hover:text-[#FF9900]">
                {eq.query.charAt(0).toUpperCase() + eq.query.slice(1)}
              </p>
              <p className="text-xs text-neutral-500">{t.viewOn}</p>
            </div>
          </AmazonSearchAffiliateLink>
        ))}
      </div>

      <p className="text-[10px] text-neutral-400 mt-4 text-center">{t.affiliate}</p>
    </div>
  );
}

// Export du composant pour usage direct dans les ingrédients
export function IngredientAmazonLink({
  ingredient,
  locale = 'fr',
}: {
  ingredient: string;
  locale?: 'fr' | 'en';
}) {
  const t = translations[locale];

  // Ne montrer le lien que pour les ingrédients spéciaux
  const lowerIng = ingredient.toLowerCase();
  const isSpecial = SPECIAL_INGREDIENTS.some((s) => lowerIng.includes(s));

  if (!isSpecial) return null;

  return (
    <AmazonSearchAffiliateLink
      query={ingredient}
      className="ml-2 inline-flex items-center text-[#FF9900] hover:text-[#FF9900]/80 text-xs"
      title={`${t.viewOn}: ${ingredient}`}
    >
      <ShoppingCart className="w-3 h-3" />
    </AmazonSearchAffiliateLink>
  );
}
