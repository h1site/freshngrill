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
