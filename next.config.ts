import type { NextConfig } from 'next';

// Slugs des articles de blog (anciennes URLs WordPress à la racine)
const blogSlugs = [
  'recette-citrouille',
  'recette-halloween',
  'convertisseur-mesures-liquide',
  'recette-du-quebec',
  'aliments-rances',
  'ble-dinde-les-methodes',
  'balance-de-cuisine',
  'master-chef-junior-quebec',
  'saint-jean-baptiste',
  'ninja-slushi',
  'recette-dairy-queen',
  'appgratuit',
  'gouters-maison',
  'pizza-au-quebec',
  'fete-des-peres',
  'trois-fois-par-jours-dessert-tome3',
  'coup-de-grace',
  '10-recettes-de-salades',
  'four-a-pizza',
  'le-fit-cook-livre',
  '5-ingredients-15-minutes',
  'salut-bonjour-dans-votre-assiette',
  'haut-de-cuisse-de-poulet',
  'cabane-a-sucre',
  'festivals-gastronomiques',
  'produits-canadiens',
  'rennai',
  'cabane-a-sucre-constantin',
  'comment-preparer-un-roux',
  'idees-de-repas-entre-amis',
  'meilleurs-cours-de-cuisine-au-quebec',
  'grands-chefs-cuisiniers-du-quebec',
  'idees-de-brunch',
  'sorbet-maison',
  'canadiens-de-montreal',
  'guide-apprentit-cuisinier',
  'ricardo-cuisine',
  'pain-perdu',
  'tim-horton',
  'dairy-queen',
  'guacamole-recette-facile',
  'mcdonnald',
  'top-activites',
  'espresso-martini-maison',
  'recette-de-nachos',
  'coupes-de-boeuf',
  'cuire-le-poulet',
  'recette-croque-monsieur',
  '5-recettes-omelette',
  'activites-famille-monteregie',
  'recette-de-fish-and-chip',
  'biscuits-maison',
  'recette-polenta',
  'air-fryer',
  'big-mac',
  'ramen-authentique',
  'queue-de-castor',
  'cuisine-vegane',
  'soupe-minestrone-aux-legumes',
  'steak-frites-au-quebec',
  'steak-a-la-perfection',
  'repas-saint-valentin',
  'potage-a-la-carotte',
  'gateau-carottes-moelleux',
  'asperges-grillees',
  '10-recettes-tacos',
  'recette-de-crepe-rapide',
  'poke-bowls',
  'chocolats-rose-elisabeth',
  'la-maison-des-dimsums',
  'mckibbins-irish-pub',
  'nouvel-an',
  'recette-de-noel',
  'recettes-a-la-citrouille',
  '10-recettes-a-la-mijoteuse',
  'tequilla',
  'jambon-au-four',
  '10-recettes-de-pates',
  'patates-pommes-de-terre',
  'muffins-a-la-rhubarbe',
  'les-recettes-estivales',
  'cuisine-faciles-pour-debutants',
  'top-restaurants-montreal',
  'exploration-du-monde-a-travers-la-cuisine',
  'film-plastique-a-la-feuille-daluminium',
];

const nextConfig: NextConfig = {
  // Augmenter la limite de body pour les uploads (50MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  trailingSlash: true,
  // Mode export statique - activer une fois les recettes importées
  // output: 'export',

  // Redirections pour conserver le SEO (URLs WordPress)
  async redirects() {
    // Redirections des articles de blog (anciennes URLs à la racine vers /blog/)
    const blogRedirects = blogSlugs.map(slug => ({
      source: `/${slug}`,
      destination: `/blog/${slug}`,
      permanent: true,
    }));

    return [
      // Redirections des articles de blog
      ...blogRedirects,
      // Redirection /recettes/ vers /recette/ (ancien pluriel vers singulier comme WP)
      {
        source: '/recettes',
        destination: '/recette',
        permanent: true,
      },
      {
        source: '/recettes/:slug*',
        destination: '/recette/:slug*',
        permanent: true,
      },
      // Redirection convertisseur-de-mesures (ancien WordPress) vers /convertisseur/
      {
        source: '/convertisseur-de-mesures',
        destination: '/convertisseur',
        permanent: true,
      },
      {
        source: '/convertisseur-de-mesures/:path*',
        destination: '/convertisseur/:path*',
        permanent: true,
      },
      // English redirects - French paths to English paths
      {
        source: '/en/guide-achat',
        destination: '/en/buying-guide',
        permanent: true,
      },
      {
        source: '/en/guide-achat/:slug*',
        destination: '/en/buying-guide/:slug*',
        permanent: true,
      },
      {
        source: '/en/convertisseur-de-mesures',
        destination: '/en/converter',
        permanent: true,
      },
      {
        source: '/en/convertisseur-de-mesures/:path*',
        destination: '/en/converter/:path*',
        permanent: true,
      },
      {
        source: '/en/convertisseur',
        destination: '/en/converter',
        permanent: true,
      },
      {
        source: '/en/convertisseur/:path*',
        destination: '/en/converter/:path*',
        permanent: true,
      },
      // Redirect type-de-cuisine to categorie
      {
        source: '/type-de-cuisine/:slug*',
        destination: '/categorie/:slug*',
        permanent: true,
      },
      // English rennai redirect (someone is searching for this in English)
      {
        source: '/en/rennai',
        destination: '/en/blog/rennai',
        permanent: true,
      },
      // Common 404 redirects
      {
        source: '/en/dairy-queen-recipe',
        destination: '/en/blog/dairy-queen',
        permanent: true,
      },
      {
        source: '/conversion-pouce-en-pied',
        destination: '/convertisseur/pouce-pied',
        permanent: true,
      },
      {
        source: '/conversion-centimetre-en-pied',
        destination: '/convertisseur/centimetre-pied',
        permanent: true,
      },
      {
        source: '/en/homemade-sorbet',
        destination: '/en/blog/sorbet-maison',
        permanent: true,
      },
      {
        source: '/en/steak-a-la-perfection',
        destination: '/en/blog/steak-a-la-perfection',
        permanent: true,
      },
      // English blog posts without /blog/ prefix
      {
        source: '/en/:slug(dairy-queen|sorbet-maison|steak-a-la-perfection|ramen-authentique|air-fryer|big-mac)',
        destination: '/en/blog/:slug',
        permanent: true,
      },
      // English type-de-cuisine to category
      {
        source: '/en/type-de-cuisine/:slug*',
        destination: '/en/category/:slug*',
        permanent: true,
      },
      // English type-of-kitchen to category
      {
        source: '/en/type-of-kitchen/:slug*',
        destination: '/en/category/:slug*',
        permanent: true,
      },
      // English recipe_categories to category
      {
        source: '/en/recipe_categories/:slug*',
        destination: '/en/category/:slug*',
        permanent: true,
      },
      // English recipes (plural) to recipe (singular)
      {
        source: '/en/recipes',
        destination: '/en/recipe',
        permanent: true,
      },
      // Remove /feed/ from recipe URLs (WordPress RSS)
      {
        source: '/recette/:slug/feed',
        destination: '/recette/:slug',
        permanent: true,
      },
      {
        source: '/en/recipe/:slug/feed',
        destination: '/en/recipe/:slug',
        permanent: true,
      },
      // English blog redirects for common searches
      {
        source: '/en/fish-and-chip-recipe',
        destination: '/en/blog/recette-de-fish-and-chip',
        permanent: true,
      },
      {
        source: '/en/quick-and-easy-homemade-fish-and-chip-recipe',
        destination: '/en/blog/recette-de-fish-and-chip',
        permanent: true,
      },
      {
        source: '/en/pizza-oven',
        destination: '/en/blog/four-a-pizza',
        permanent: true,
      },
      {
        source: '/en/easy-recipe-for-homemade-beavertail',
        destination: '/en/blog/queue-de-castor',
        permanent: true,
      },
      {
        source: '/en/beaver-tail',
        destination: '/en/blog/queue-de-castor',
        permanent: true,
      },
      {
        source: '/en/ricardo-cuisine',
        destination: '/en/blog/ricardo-cuisine',
        permanent: true,
      },
      {
        source: '/en/meal-ideas-with-friends',
        destination: '/en/blog/idees-de-repas-entre-amis',
        permanent: true,
      },
      // French blog redirect
      {
        source: '/crepes-recette-facile',
        destination: '/blog/recette-de-crepe-rapide',
        permanent: true,
      },
      // About page redirect (old WordPress)
      {
        source: '/en-savoir-plus-sur-menucochon',
        destination: '/a-propos',
        permanent: true,
      },
      // Old origine section redirect to homepage
      {
        source: '/origine/:slug*',
        destination: '/',
        permanent: true,
      },
      // English recette path to recipe path
      {
        source: '/en/recette/:slug*',
        destination: '/en/recipe/:slug*',
        permanent: true,
      },
      // Old lexicon paths (don't exist anymore)
      {
        source: '/en/culinary-lexicon/:path*',
        destination: '/en/',
        permanent: true,
      },
      {
        source: '/en/culinary-lexicon',
        destination: '/en/',
        permanent: true,
      },
      {
        source: '/en/lexicon/:path*',
        destination: '/en/',
        permanent: true,
      },
      {
        source: '/en/lexicon',
        destination: '/en/',
        permanent: true,
      },
      // Crepe slug change for SEO (recette crêpe traditionnelle)
      {
        source: '/recette/crepe',
        destination: '/recette/crepe-traditionnelle',
        permanent: true,
      },
      {
        source: '/en/recipe/crepe',
        destination: '/en/recipe/traditional-crepe',
        permanent: true,
      },
      // Crêpe soufflée (Dutch Baby) - renamed from pfannkuchen for SEO - Dec 30, 2025
      {
        source: '/recette/crepe-allemande-pfannkuchen',
        destination: '/recette/crepe-soufflee-dutch-baby',
        permanent: true,
      },
      {
        source: '/recette/crepe-allemande-pfannkuchen/',
        destination: '/recette/crepe-soufflee-dutch-baby/',
        permanent: true,
      },
      {
        source: '/en/recipe/german-pancake-pfannkuchen',
        destination: '/en/recipe/dutch-baby-pancake',
        permanent: true,
      },
      {
        source: '/en/recipe/german-pancake-pfannkuchen/',
        destination: '/en/recipe/dutch-baby-pancake/',
        permanent: true,
      },
      // 404 fixes from error log - Dec 18, 2025
      {
        source: '/en/recipe/chinese-macaroni',
        destination: '/en/recipe/homemade-chinese-macaroni',
        permanent: true,
      },
      {
        source: '/recette/beef-naan-bread',
        destination: '/recette/pain-naan-au-boeuf',
        permanent: true,
      },
      {
        source: '/en/festivals-gastronomiques',
        destination: '/en/blog/festivals-gastronomiques',
        permanent: true,
      },
      {
        source: '/category/:slug*',
        destination: '/categorie/:slug*',
        permanent: true,
      },
      {
        source: '/saint-jean-baptist',
        destination: '/blog/saint-jean-baptiste',
        permanent: true,
      },
      {
        source: '/en/recipe/kale-and-grape-salad',
        destination: '/en/recipe/kale-grape-salad',
        permanent: true,
      },
      {
        source: '/en/exploring-the-world-through-cuisine',
        destination: '/en/blog/exploration-du-monde-a-travers-la-cuisine',
        permanent: true,
      },
      {
        source: '/en/recipe/scallops',
        destination: '/en/recipe',
        permanent: true,
      },
      // 404 fixes from error log - Dec 20, 2025
      {
        source: '/homemade-sorbet',
        destination: '/blog/sorbet-maison',
        permanent: true,
      },
      {
        source: '/lexique/firmly-packed',
        destination: '/en/lexicon/firmly-packed',
        permanent: true,
      },
      {
        source: '/en/epices/:slug*',
        destination: '/en/spices/:slug*',
        permanent: true,
      },
      {
        source: '/en/decouvrez-lhistoire-ricardo-cuisine-patrimoine-culinaire',
        destination: '/blog/ricardo-cuisine',
        permanent: true,
      },
      {
        source: '/recette/epices',
        destination: '/epices',
        permanent: true,
      },
      {
        source: '/en/hello-hello-in-your-plate',
        destination: '/en/blog/salut-bonjour-dans-votre-assiette',
        permanent: true,
      },
      {
        source: '/blog/10-recettes-incontournables-noel',
        destination: '/blog/recette-de-noel',
        permanent: true,
      },
      // 404 fixes from error log - Dec 21, 2025
      {
        source: '/en/pizza-in-quebec',
        destination: '/en/blog/pizza-au-quebec',
        permanent: true,
      },
      {
        source: '/pizza-oven',
        destination: '/blog/four-a-pizza',
        permanent: true,
      },
      {
        source: '/spices/:slug*',
        destination: '/epices/:slug*',
        permanent: true,
      },
      {
        source: '/en/register',
        destination: '/register',
        permanent: false,
      },
      {
        source: '/en/login',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/recette/omelette-cabane-a-sucre',
        destination: '/recette/omelette-au-four',
        permanent: true,
      },
      {
        source: '/en/recipe/chicken-pate',
        destination: '/en/recipe/chicken-pot-pie',
        permanent: true,
      },
      // French slugs in EN path -> proper EN slugs
      {
        source: '/en/recipe/soupe-aux-pois-traditionnelle',
        destination: '/en/recipe/traditional-pea-soup',
        permanent: true,
      },
      {
        source: '/en/recipe/soupe-a-loignon-gratinee',
        destination: '/en/recipe/french-onion-soup',
        permanent: true,
      },
      {
        source: '/en/recipe/gateau-aux-carottes-meilleur',
        destination: '/en/recipe/best-carrot-cake',
        permanent: true,
      },
      {
        source: '/en/recipe/poulet-au-beurre-indien',
        destination: '/en/recipe/indian-butter-chicken',
        permanent: true,
      },
      {
        source: '/en/recipe/filets-de-porc-glaces-erable',
        destination: '/en/recipe/maple-glazed-pork-tenderloin',
        permanent: true,
      },
      {
        source: '/en/recipe/tartare-de-boeuf-classique',
        destination: '/en/recipe/classic-beef-tartare',
        permanent: true,
      },
      {
        source: '/en/recipe/pain-aux-bananes-moelleux',
        destination: '/en/recipe/moist-banana-bread',
        permanent: true,
      },
      {
        source: '/en/recipe/kutia-traditionnelle',
        destination: '/en/recipe/traditional-kutia',
        permanent: true,
      },
      {
        source: '/en/recipe/jambon-glace-a-lerable',
        destination: '/en/recipe/maple-glazed-ham',
        permanent: true,
      },
      // 404 fixes from error log - Dec 30, 2025
      {
        source: '/en/recipe/bilodeau-family-molasses-galette-1971',
        destination: '/en/recipe/molasses-cookie-of-the-bilodeau-family-1971',
        permanent: true,
      },
      {
        source: '/en/saint-jean-baptist',
        destination: '/en/blog/saint-jean-baptiste',
        permanent: true,
      },
      {
        source: '/author/:slug*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/en/conversion-inch-to-foot',
        destination: '/en/converter/inch-foot',
        permanent: true,
      },
      {
        source: '/en/recipe/simple-and-delicious-recipe-for-carrot-cake',
        destination: '/en/recipe/best-carrot-cake',
        permanent: true,
      },
      {
        source: '/en/recipe/cake-in-a-cup',
        destination: '/en/recipe/mug-cake',
        permanent: true,
      },
      // Crêpes maison SEO rename - Jan 26, 2025
      {
        source: '/recette/crepes-maison-recette-de-base',
        destination: '/recette/crepe-de-base',
        permanent: true,
      },
      {
        source: '/recette/crepes-maison-recette-de-base/',
        destination: '/recette/crepe-de-base/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
