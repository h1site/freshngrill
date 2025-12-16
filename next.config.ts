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
    ];
  },
};

export default nextConfig;
