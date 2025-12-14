// Liste des ingrédients connus pour le pattern matching (sans AI)
// French ingredients
export const KNOWN_INGREDIENTS_FR = [
  // Viandes
  'boeuf', 'bœuf', 'poulet', 'porc', 'veau', 'agneau', 'dinde', 'canard',
  'jambon', 'bacon', 'saucisse', 'chorizo', 'prosciutto', 'pepperoni',
  'salami', 'lard', 'lardon', 'merguez', 'andouille', 'boudin',
  'côtelette', 'escalope', 'filet', 'steak', 'rôti', 'gigot',
  'cuisse', 'aile', 'poitrine', 'épaule', 'jarret',

  // Poissons et fruits de mer
  'saumon', 'thon', 'morue', 'cabillaud', 'sole', 'truite', 'bar',
  'crevette', 'homard', 'crabe', 'moule', 'huître', 'palourde',
  'calmar', 'poulpe', 'anchois', 'sardine', 'maquereau', 'dorade',
  'tilapia', 'flétan', 'espadon', 'lotte', 'merlu',

  // Produits laitiers
  'lait', 'crème', 'beurre', 'fromage', 'yaourt', 'yogourt',
  'mozzarella', 'parmesan', 'cheddar', 'gruyère', 'emmental',
  'feta', 'ricotta', 'mascarpone', 'gorgonzola', 'brie', 'camembert',
  'chèvre', 'roquefort', 'comté', 'raclette', 'reblochon',

  // Oeufs
  'oeuf', 'œuf', 'oeufs', 'œufs',

  // Légumes
  'tomate', 'oignon', 'ail', 'carotte', 'pomme de terre', 'patate',
  'poivron', 'courgette', 'aubergine', 'concombre', 'laitue', 'salade',
  'épinard', 'brocoli', 'chou-fleur', 'chou', 'céleri', 'poireau',
  'asperge', 'haricot', 'petit pois', 'pois', 'maïs', 'champignon',
  'avocat', 'betterave', 'navet', 'radis', 'fenouil', 'artichaut',
  'endive', 'roquette', 'cresson', 'mâche', 'échalote',

  // Fruits
  'pomme', 'poire', 'orange', 'citron', 'lime', 'pamplemousse',
  'banane', 'fraise', 'framboise', 'bleuet', 'myrtille', 'mûre',
  'cerise', 'pêche', 'abricot', 'prune', 'raisin', 'melon',
  'pastèque', 'ananas', 'mangue', 'papaye', 'kiwi', 'grenade',
  'figue', 'datte', 'noix de coco', 'litchi',

  // Herbes et épices
  'persil', 'coriandre', 'basilic', 'menthe', 'thym', 'romarin',
  'origan', 'estragon', 'ciboulette', 'aneth', 'laurier', 'sauge',
  'sel', 'poivre', 'paprika', 'cumin', 'curry', 'curcuma',
  'cannelle', 'muscade', 'gingembre', 'piment', 'cayenne',
  'cardamome', 'clou de girofle', 'anis', 'safran', 'vanille',

  // Céréales et féculents
  'riz', 'pâtes', 'spaghetti', 'penne', 'fusilli', 'tagliatelle',
  'nouille', 'couscous', 'quinoa', 'boulgour', 'orge', 'avoine',
  'pain', 'farine', 'semoule', 'polenta', 'tortilla', 'pita',

  // Légumineuses
  'lentille', 'pois chiche', 'haricot rouge', 'haricot noir',
  'haricot blanc', 'fève', 'soja', 'tofu', 'tempeh', 'edamame',

  // Noix et graines
  'amande', 'noix', 'noisette', 'cajou', 'pistache', 'arachide',
  'cacahuète', 'pécan', 'pignon', 'sésame', 'tournesol', 'lin',
  'chia', 'courge',

  // Condiments et sauces
  'moutarde', 'ketchup', 'mayonnaise', 'vinaigre', 'sauce soja',
  'worcestershire', 'tabasco', 'sriracha', 'harissa', 'pesto',
  'tapenade', 'aïoli', 'rémoulade', 'tzatziki',

  // Huiles
  'huile olive', 'huile végétale', 'huile tournesol', 'huile sésame',
  'huile canola', 'huile arachide', 'huile noix',

  // Sucres et édulcorants
  'sucre', 'miel', 'sirop érable', 'sirop', 'cassonade', 'mélasse',
  'stevia', 'agave',

  // Autres
  'bouillon', 'fond', 'gélatine', 'levure', 'bicarbonate',
  'poudre à pâte', 'cacao', 'chocolat', 'café', 'thé',
  'vin', 'bière', 'rhum', 'cognac', 'marsala', 'porto',
];

// English ingredients
export const KNOWN_INGREDIENTS_EN = [
  // Meats
  'beef', 'chicken', 'pork', 'veal', 'lamb', 'turkey', 'duck',
  'ham', 'bacon', 'sausage', 'chorizo', 'prosciutto', 'pepperoni',
  'salami', 'lard', 'andouille', 'blood sausage',
  'chop', 'cutlet', 'fillet', 'filet', 'steak', 'roast', 'leg',
  'thigh', 'wing', 'breast', 'shoulder', 'shank',

  // Fish and seafood
  'salmon', 'tuna', 'cod', 'sole', 'trout', 'bass', 'sea bass',
  'shrimp', 'prawn', 'lobster', 'crab', 'mussel', 'oyster', 'clam',
  'squid', 'calamari', 'octopus', 'anchovy', 'sardine', 'mackerel', 'bream',
  'tilapia', 'halibut', 'swordfish', 'monkfish', 'hake',

  // Dairy
  'milk', 'cream', 'butter', 'cheese', 'yogurt', 'yoghurt',
  'mozzarella', 'parmesan', 'cheddar', 'gruyere', 'emmental',
  'feta', 'ricotta', 'mascarpone', 'gorgonzola', 'brie', 'camembert',
  'goat cheese', 'roquefort', 'comte', 'raclette', 'reblochon',

  // Eggs
  'egg', 'eggs',

  // Vegetables
  'tomato', 'onion', 'garlic', 'carrot', 'potato', 'potatoes',
  'bell pepper', 'pepper', 'zucchini', 'eggplant', 'aubergine', 'cucumber', 'lettuce', 'salad',
  'spinach', 'broccoli', 'cauliflower', 'cabbage', 'celery', 'leek',
  'asparagus', 'green bean', 'pea', 'peas', 'corn', 'mushroom',
  'avocado', 'beet', 'beetroot', 'turnip', 'radish', 'fennel', 'artichoke',
  'endive', 'arugula', 'rocket', 'watercress', 'shallot',

  // Fruits
  'apple', 'pear', 'orange', 'lemon', 'lime', 'grapefruit',
  'banana', 'strawberry', 'raspberry', 'blueberry', 'blackberry',
  'cherry', 'peach', 'apricot', 'plum', 'grape', 'melon',
  'watermelon', 'pineapple', 'mango', 'papaya', 'kiwi', 'pomegranate',
  'fig', 'date', 'coconut', 'lychee',

  // Herbs and spices
  'parsley', 'cilantro', 'coriander', 'basil', 'mint', 'thyme', 'rosemary',
  'oregano', 'tarragon', 'chives', 'dill', 'bay leaf', 'sage',
  'salt', 'pepper', 'paprika', 'cumin', 'curry', 'turmeric',
  'cinnamon', 'nutmeg', 'ginger', 'chili', 'cayenne',
  'cardamom', 'clove', 'anise', 'saffron', 'vanilla',

  // Grains and starches
  'rice', 'pasta', 'spaghetti', 'penne', 'fusilli', 'tagliatelle',
  'noodle', 'noodles', 'couscous', 'quinoa', 'bulgur', 'barley', 'oat', 'oats',
  'bread', 'flour', 'semolina', 'polenta', 'tortilla', 'pita',

  // Legumes
  'lentil', 'lentils', 'chickpea', 'chickpeas', 'red bean', 'black bean',
  'white bean', 'fava bean', 'soy', 'soybean', 'tofu', 'tempeh', 'edamame',

  // Nuts and seeds
  'almond', 'walnut', 'hazelnut', 'cashew', 'pistachio', 'peanut',
  'pecan', 'pine nut', 'sesame', 'sunflower', 'flax', 'flaxseed',
  'chia', 'pumpkin seed',

  // Condiments and sauces
  'mustard', 'ketchup', 'mayonnaise', 'mayo', 'vinegar', 'soy sauce',
  'worcestershire', 'tabasco', 'sriracha', 'harissa', 'pesto',
  'tapenade', 'aioli', 'remoulade', 'tzatziki',

  // Oils
  'olive oil', 'vegetable oil', 'sunflower oil', 'sesame oil',
  'canola oil', 'peanut oil', 'walnut oil',

  // Sugars and sweeteners
  'sugar', 'honey', 'maple syrup', 'syrup', 'brown sugar', 'molasses',
  'stevia', 'agave',

  // Others
  'broth', 'stock', 'gelatin', 'yeast', 'baking soda',
  'baking powder', 'cocoa', 'chocolate', 'coffee', 'tea',
  'wine', 'beer', 'rum', 'cognac', 'marsala', 'port',
];

// Legacy export for backwards compatibility
export const KNOWN_INGREDIENTS = KNOWN_INGREDIENTS_FR;

export function detectKnownIngredients(text: string, locale: 'fr' | 'en' = 'fr'): string[] {
  const normalizedText = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents for matching

  const foundIngredients = new Set<string>();
  const ingredientList = locale === 'en' ? KNOWN_INGREDIENTS_EN : KNOWN_INGREDIENTS_FR;

  for (const ingredient of ingredientList) {
    const normalizedIngredient = ingredient
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Word boundary matching
    const regex = new RegExp(`\\b${normalizedIngredient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`, 'i');

    if (regex.test(normalizedText)) {
      // Return the original (with accents) version
      foundIngredients.add(ingredient);
    }
  }

  return Array.from(foundIngredients).sort();
}

export function extractIngredientsFromRecipe(
  ingredients: Array<{ group?: string; items: string[] }>,
  locale: 'fr' | 'en' = 'fr'
): string[] {
  const allText = ingredients
    .flatMap(group => group.items)
    .join(' ');

  return detectKnownIngredients(allText, locale);
}

// Interface pour les ingrédients structurés
export interface ParsedIngredient {
  quantity?: string;
  unit?: string;
  name: string;
  note?: string;
}

// Unités de mesure françaises et anglaises
const UNITS = [
  // Volume
  'ml', 'cl', 'dl', 'l', 'litre', 'litres', 'liter', 'liters',
  'c\\. à soupe', 'c\\.à soupe', 'cuillère à soupe', 'cuillères à soupe', 'c\\. soupe',
  'c\\. à thé', 'c\\.à thé', 'cuillère à thé', 'cuillères à thé', 'c\\. thé',
  'c\\. à café', 'cuillère à café', 'cuillères à café',
  'tbsp', 'tablespoon', 'tablespoons', 'tsp', 'teaspoon', 'teaspoons',
  'tasse', 'tasses', 'cup', 'cups',
  'verre', 'verres', 'glass', 'glasses',
  // Poids
  'g', 'kg', 'gramme', 'grammes', 'gram', 'grams', 'kilogramme', 'kilogrammes', 'kilogram', 'kilograms',
  'oz', 'ounce', 'ounces', 'once', 'onces', 'lb', 'lbs', 'pound', 'pounds', 'livre', 'livres',
  // Autres
  'pincée', 'pincées', 'pinch', 'pinches', 'goutte', 'gouttes', 'drop', 'drops',
  'tranche', 'tranches', 'slice', 'slices', 'morceau', 'morceaux', 'piece', 'pieces',
  'feuille', 'feuilles', 'leaf', 'leaves', 'brin', 'brins', 'sprig', 'sprigs',
  'gousse', 'gousses', 'clove', 'cloves', 'tige', 'tiges', 'stalk', 'stalks',
  'boîte', 'boîtes', 'can', 'cans', 'pot', 'pots', 'jar', 'jars', 'sachet', 'sachets', 'packet', 'packets',
  'paquet', 'paquets', 'package', 'packages', 'bouteille', 'bouteilles', 'bottle', 'bottles',
];

/**
 * Parse une string d'ingrédient en objet structuré
 * Ex: "250 g de farine tout usage" -> { quantity: "250", unit: "g", name: "farine tout usage" }
 * Ex: "3 œufs" -> { quantity: "3", name: "œufs" }
 * Ex: "30 g de beurre fondu (tiède)" -> { quantity: "30", unit: "g", name: "beurre fondu", note: "tiède" }
 */
export function parseIngredientString(ingredientStr: string): ParsedIngredient {
  let str = ingredientStr.trim();
  let note: string | undefined;

  // Extraire les notes entre parenthèses à la fin
  const noteMatch = str.match(/\(([^)]+)\)\s*$/);
  if (noteMatch) {
    note = noteMatch[1].trim();
    str = str.replace(/\(([^)]+)\)\s*$/, '').trim();
  }

  // Pattern pour quantité (nombres, fractions, décimaux)
  const quantityPattern = /^([\d.,\/]+(?:\s*[-à]\s*[\d.,\/]+)?)\s*/;
  const quantityMatch = str.match(quantityPattern);

  let quantity: string | undefined;
  let remaining = str;

  if (quantityMatch) {
    quantity = quantityMatch[1].trim();
    remaining = str.slice(quantityMatch[0].length).trim();
  }

  // Chercher l'unité au début du reste
  let unit: string | undefined;
  const unitsPattern = new RegExp(`^(${UNITS.join('|')})\\s+`, 'i');
  const unitMatch = remaining.match(unitsPattern);

  if (unitMatch) {
    unit = unitMatch[1].trim();
    remaining = remaining.slice(unitMatch[0].length).trim();
  }

  // Retirer "de ", "d'", "du ", "des ", "of " au début du nom (peut apparaître plusieurs fois)
  remaining = remaining.replace(/^(de\s+|d'|du\s+|des\s+|of\s+)+/i, '').trim();

  return {
    ...(quantity && { quantity }),
    ...(unit && { unit }),
    name: remaining || ingredientStr,
    ...(note && { note }),
  };
}

/**
 * Transforme un groupe d'ingrédients avec des strings en objets structurés
 */
export function parseIngredientGroup(group: { group?: string; items: string[] }): {
  title?: string;
  items: ParsedIngredient[];
} {
  return {
    ...(group.group && { title: group.group }),
    items: group.items.map(item => parseIngredientString(item)),
  };
}

/**
 * Transforme tous les groupes d'ingrédients
 */
export function parseAllIngredients(ingredients: Array<{ group?: string; items: string[] }>): Array<{
  title?: string;
  items: ParsedIngredient[];
}> {
  return ingredients.map(parseIngredientGroup);
}
