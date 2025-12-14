'use client';

import AmazonProductBox, { AmazonSidebarBox } from './AmazonProductBox';

// Produits de cuisine populaires sur Amazon.ca
// Images via Unsplash (les images Amazon CDN peuvent être bloquées par Next.js)
const KITCHEN_PRODUCTS = {
  // Ustensiles essentiels
  spatula: {
    asin: 'B00004OCNS',
    title: 'OXO Good Grips Spatule en Silicone',
    image: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=200&h=200&fit=crop',
  },
  whisk: {
    asin: 'B00004OCJM',
    title: 'OXO Good Grips Fouet 11 pouces',
    image: 'https://images.unsplash.com/photo-1591208333405-e5d3fe798e89?w=200&h=200&fit=crop',
  },
  tongs: {
    asin: 'B00004OCKA',
    title: 'OXO Good Grips Pinces de Cuisine',
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=200&h=200&fit=crop',
  },

  // Casseroles et poêles
  skillet: {
    asin: 'B00006JSUA',
    title: 'Lodge Poêle en Fonte 10.25 pouces',
    image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=200&h=200&fit=crop',
  },
  dutchOven: {
    asin: 'B000N501BK',
    title: 'Lodge Cocotte en Fonte 6 Quarts',
    image: 'https://images.unsplash.com/photo-1585442245498-98da81d5dd1a?w=200&h=200&fit=crop',
  },

  // Électroménagers
  instantPot: {
    asin: 'B06Y1YD5W7',
    title: 'Instant Pot Duo 7-en-1 Autocuiseur',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=200&h=200&fit=crop',
  },
  airFryer: {
    asin: 'B0936FGLQS',
    title: 'Ninja Air Fryer Max XL',
    image: 'https://images.unsplash.com/photo-1626509653291-18d9a934b9db?w=200&h=200&fit=crop',
  },
  blender: {
    asin: 'B008H4SLV6',
    title: 'Ninja Blender Professionnel',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&h=200&fit=crop',
  },
  mixer: {
    asin: 'B00005UP2K',
    title: 'KitchenAid Artisan Batteur sur Socle',
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=200&h=200&fit=crop',
  },

  // Couteaux
  chefKnife: {
    asin: 'B0061SWV8Y',
    title: 'Victorinox Couteau de Chef 8 pouces',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=200&h=200&fit=crop',
  },
  knifeSet: {
    asin: 'B00GIBKC3K',
    title: 'Chicago Cutlery Ensemble de Couteaux 15 pièces',
    image: 'https://images.unsplash.com/photo-1566454419290-57a64afe1e5b?w=200&h=200&fit=crop',
  },

  // Planches à découper
  cuttingBoard: {
    asin: 'B00063QQ3K',
    title: 'OXO Good Grips Planche à Découper',
    image: 'https://images.unsplash.com/photo-1605478952964-77d07087ba70?w=200&h=200&fit=crop',
  },

  // Thermomètre
  thermometer: {
    asin: 'B00GRFHXVQ',
    title: 'ThermoPro Thermomètre de Cuisine Digital',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200&h=200&fit=crop',
  },

  // BBQ
  grillTools: {
    asin: 'B00DQJMIAY',
    title: "Weber Ensemble d'outils BBQ 3 pièces",
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
  },

  // Pâtisserie
  bakingMat: {
    asin: 'B00629K4YK',
    title: 'Silpat Tapis de Cuisson en Silicone',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
  },
  mixingBowls: {
    asin: 'B00LGLHUA0',
    title: 'FineDine Ensemble de Bols à Mélanger en Inox',
    image: 'https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=200&h=200&fit=crop',
  },
};

type ProductKey = keyof typeof KITCHEN_PRODUCTS;

interface AmazonKitchenProductsProps {
  products?: ProductKey[];
  title?: string;
  locale?: 'fr' | 'en';
  variant?: 'box' | 'sidebar';
}

// Sélection par défaut basée sur le contexte
const DEFAULT_PRODUCTS: ProductKey[] = ['instantPot', 'chefKnife', 'skillet'];

export default function AmazonKitchenProducts({
  products = DEFAULT_PRODUCTS,
  title,
  locale = 'fr',
  variant = 'box',
}: AmazonKitchenProductsProps) {
  const selectedProducts = products.map((key) => KITCHEN_PRODUCTS[key]).filter(Boolean);

  if (variant === 'sidebar') {
    return <AmazonSidebarBox products={selectedProducts} title={title} locale={locale} />;
  }

  return <AmazonProductBox products={selectedProducts} title={title} locale={locale} />;
}

// Export des clés de produits pour référence
export const PRODUCT_KEYS = Object.keys(KITCHEN_PRODUCTS) as ProductKey[];
export type { ProductKey };
