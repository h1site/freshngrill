/**
 * Pinterest Board definitions for dynamic RSS feeds.
 *
 * Each board maps to one or more category slugs from the database.
 * The RSS routes at /rss/pinterest/[category] and /en/rss/pinterest/[category]
 * use this config to filter recipes and generate board-specific feeds.
 *
 * To add a new board:
 * 1. Add an entry here with the category slug(s) it should include
 * 2. The RSS feed is automatically available at /rss/pinterest/{slug}
 */

export interface PinterestBoard {
  /** URL slug used in /rss/pinterest/{slug} */
  slug: string;
  /** Category slugs from the DB to include in this board */
  categorySlugs: string[];
  /** French board name (used in RSS title + Pinterest board name) */
  nameFr: string;
  /** English board name */
  nameEn: string;
  /** French RSS description */
  descriptionFr: string;
  /** English RSS description */
  descriptionEn: string;
  /** Suggested Pinterest board name FR */
  boardNameFr: string;
  /** Suggested Pinterest board name EN */
  boardNameEn: string;
}

export const PINTEREST_BOARDS: PinterestBoard[] = [
  // === PLATS PRINCIPAUX PAR PROTÉINE ===
  {
    slug: 'plats-principaux-boeuf',
    categorySlugs: ['plats-principaux-boeuf'],
    nameFr: 'Recettes de Boeuf',
    nameEn: 'Beef Recipes',
    descriptionFr: 'Recettes de boeuf québécoises : rôtis, steaks, braisés, mijotés et plus.',
    descriptionEn: 'Quebec beef recipes: roasts, steaks, braised dishes, stews and more.',
    boardNameFr: 'Recettes de Boeuf | Menucochon',
    boardNameEn: 'Beef Recipes | Menucochon',
  },
  {
    slug: 'plats-principaux-poulet',
    categorySlugs: ['plats-principaux-volaille'],
    nameFr: 'Recettes de Poulet & Volaille',
    nameEn: 'Chicken & Poultry Recipes',
    descriptionFr: 'Recettes de poulet et volaille : grillé, rôti, mijoté, sauté et plus.',
    descriptionEn: 'Chicken and poultry recipes: grilled, roasted, slow-cooked, stir-fried and more.',
    boardNameFr: 'Recettes de Poulet & Volaille | Menucochon',
    boardNameEn: 'Chicken & Poultry Recipes | Menucochon',
  },
  {
    slug: 'plats-principaux-porc',
    categorySlugs: ['plats-principaux-porc'],
    nameFr: 'Recettes de Porc',
    nameEn: 'Pork Recipes',
    descriptionFr: 'Recettes de porc québécoises : rôti, côtelettes, mijoteuse, BBQ et plus.',
    descriptionEn: 'Quebec pork recipes: roasts, chops, slow-cooker, BBQ and more.',
    boardNameFr: 'Recettes de Porc | Menucochon',
    boardNameEn: 'Pork Recipes | Menucochon',
  },
  {
    slug: 'plats-principaux-poisson',
    categorySlugs: ['plat-principaux-poissons'],
    nameFr: 'Recettes de Poisson',
    nameEn: 'Fish Recipes',
    descriptionFr: 'Recettes de poisson : saumon, truite, morue, tilapia et plus.',
    descriptionEn: 'Fish recipes: salmon, trout, cod, tilapia and more.',
    boardNameFr: 'Recettes de Poisson | Menucochon',
    boardNameEn: 'Fish Recipes | Menucochon',
  },
  {
    slug: 'plats-principaux-fruits-de-mer',
    categorySlugs: ['plats-principaux-fruits-de-mer'],
    nameFr: 'Recettes de Fruits de Mer',
    nameEn: 'Seafood Recipes',
    descriptionFr: 'Recettes de fruits de mer : crevettes, homard, pétoncles, moules et plus.',
    descriptionEn: 'Seafood recipes: shrimp, lobster, scallops, mussels and more.',
    boardNameFr: 'Recettes de Fruits de Mer | Menucochon',
    boardNameEn: 'Seafood Recipes | Menucochon',
  },
  {
    slug: 'plats-principaux-vegetariens',
    categorySlugs: ['plats-principaux-vegetariens'],
    nameFr: 'Recettes Végétariennes',
    nameEn: 'Vegetarian Recipes',
    descriptionFr: 'Recettes végétariennes savoureuses : légumes, tofu, légumineuses et plus.',
    descriptionEn: 'Delicious vegetarian recipes: vegetables, tofu, legumes and more.',
    boardNameFr: 'Recettes Végétariennes | Menucochon',
    boardNameEn: 'Vegetarian Recipes | Menucochon',
  },

  // === TYPES DE REPAS ===
  {
    slug: 'dejeuner',
    categorySlugs: ['dejeuner'],
    nameFr: 'Recettes de Déjeuner',
    nameEn: 'Breakfast Recipes',
    descriptionFr: 'Recettes de déjeuner québécois : oeufs, crêpes, pain doré, gruau et plus.',
    descriptionEn: 'Quebec breakfast recipes: eggs, pancakes, French toast, oatmeal and more.',
    boardNameFr: 'Recettes de Déjeuner | Menucochon',
    boardNameEn: 'Breakfast Recipes | Menucochon',
  },
  {
    slug: 'soupes',
    categorySlugs: ['soupes'],
    nameFr: 'Recettes de Soupes',
    nameEn: 'Soup Recipes',
    descriptionFr: 'Recettes de soupes réconfortantes : soupe aux pois, crème de légumes, potage et plus.',
    descriptionEn: 'Comforting soup recipes: pea soup, cream of vegetables, potage and more.',
    boardNameFr: 'Recettes de Soupes | Menucochon',
    boardNameEn: 'Soup Recipes | Menucochon',
  },
  {
    slug: 'salades',
    categorySlugs: ['salades'],
    nameFr: 'Recettes de Salades',
    nameEn: 'Salad Recipes',
    descriptionFr: 'Recettes de salades fraîches et savoureuses pour toutes les saisons.',
    descriptionEn: 'Fresh and delicious salad recipes for every season.',
    boardNameFr: 'Recettes de Salades | Menucochon',
    boardNameEn: 'Salad Recipes | Menucochon',
  },
  {
    slug: 'desserts',
    categorySlugs: ['dessert'],
    nameFr: 'Recettes de Desserts',
    nameEn: 'Dessert Recipes',
    descriptionFr: 'Recettes de desserts québécois : gâteaux, tartes, pouding chômeur, sucre à la crème et plus.',
    descriptionEn: 'Quebec dessert recipes: cakes, pies, pouding chômeur, maple fudge and more.',
    boardNameFr: 'Recettes de Desserts | Menucochon',
    boardNameEn: 'Dessert Recipes | Menucochon',
  },
  {
    slug: 'pates',
    categorySlugs: ['pates'],
    nameFr: 'Recettes de Pâtes',
    nameEn: 'Pasta Recipes',
    descriptionFr: 'Recettes de pâtes : spaghetti, macaroni, lasagne, penne et plus.',
    descriptionEn: 'Pasta recipes: spaghetti, macaroni, lasagna, penne and more.',
    boardNameFr: 'Recettes de Pâtes | Menucochon',
    boardNameEn: 'Pasta Recipes | Menucochon',
  },
  {
    slug: 'pizza',
    categorySlugs: ['pizza'],
    nameFr: 'Recettes de Pizza',
    nameEn: 'Pizza Recipes',
    descriptionFr: 'Recettes de pizza maison : classique, garnie, calzone et plus.',
    descriptionEn: 'Homemade pizza recipes: classic, loaded, calzone and more.',
    boardNameFr: 'Recettes de Pizza | Menucochon',
    boardNameEn: 'Pizza Recipes | Menucochon',
  },

  // === SNACKS & APÉRO ===
  {
    slug: 'snacks',
    categorySlugs: ['snacks', 'amuse-gueules'],
    nameFr: 'Snacks & Amuse-Gueules',
    nameEn: 'Snacks & Appetizers',
    descriptionFr: 'Recettes de snacks et amuse-gueules : trempettes, bouchées, nachos et plus.',
    descriptionEn: 'Snack and appetizer recipes: dips, bites, nachos and more.',
    boardNameFr: 'Snacks & Amuse-Gueules | Menucochon',
    boardNameEn: 'Snacks & Appetizers | Menucochon',
  },

  // === PÂTISSERIES & BOISSONS ===
  {
    slug: 'patisseries',
    categorySlugs: ['patisseries'],
    nameFr: 'Recettes de Pâtisseries',
    nameEn: 'Pastry Recipes',
    descriptionFr: 'Recettes de pâtisseries : biscuits, muffins, scones, brioches et plus.',
    descriptionEn: 'Pastry recipes: cookies, muffins, scones, brioche and more.',
    boardNameFr: 'Recettes de Pâtisseries | Menucochon',
    boardNameEn: 'Pastry Recipes | Menucochon',
  },
  {
    slug: 'boissons',
    categorySlugs: ['boissons'],
    nameFr: 'Recettes de Boissons',
    nameEn: 'Drink Recipes',
    descriptionFr: 'Recettes de boissons : smoothies, cocktails, jus, limonade et plus.',
    descriptionEn: 'Drink recipes: smoothies, cocktails, juices, lemonade and more.',
    boardNameFr: 'Recettes de Boissons | Menucochon',
    boardNameEn: 'Drink Recipes | Menucochon',
  },
];
