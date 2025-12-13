// Liste des ingrédients connus pour le pattern matching (sans AI)
export const KNOWN_INGREDIENTS = [
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

export function detectKnownIngredients(text: string): string[] {
  const normalizedText = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents for matching

  const foundIngredients = new Set<string>();

  for (const ingredient of KNOWN_INGREDIENTS) {
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

export function extractIngredientsFromRecipe(ingredients: Array<{ group?: string; items: string[] }>): string[] {
  const allText = ingredients
    .flatMap(group => group.items)
    .join(' ');

  return detectKnownIngredients(allText);
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
  'ml', 'cl', 'dl', 'l', 'litre', 'litres',
  'c\\. à soupe', 'c\\.à soupe', 'cuillère à soupe', 'cuillères à soupe', 'c\\. soupe',
  'c\\. à thé', 'c\\.à thé', 'cuillère à thé', 'cuillères à thé', 'c\\. thé',
  'c\\. à café', 'cuillère à café', 'cuillères à café',
  'tasse', 'tasses', 'cup', 'cups',
  'verre', 'verres',
  // Poids
  'g', 'kg', 'gramme', 'grammes', 'kilogramme', 'kilogrammes',
  'oz', 'once', 'onces', 'lb', 'livre', 'livres',
  // Autres
  'pincée', 'pincées', 'goutte', 'gouttes',
  'tranche', 'tranches', 'morceau', 'morceaux',
  'feuille', 'feuilles', 'brin', 'brins',
  'gousse', 'gousses', 'tige', 'tiges',
  'boîte', 'boîtes', 'pot', 'pots', 'sachet', 'sachets',
  'paquet', 'paquets', 'bouteille', 'bouteilles',
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

  // Retirer "de ", "d'", "du ", "des " au début du nom (peut apparaître plusieurs fois)
  remaining = remaining.replace(/^(de\s+|d'|du\s+|des\s+)+/i, '').trim();

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
