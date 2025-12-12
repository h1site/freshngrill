// Category name translations (FR -> EN)
// This mapping is based on the category_translations table
export const categoryTranslations: Record<string, string> = {
  // Main meal types
  'Déjeuner': 'Breakfast',
  'Diner': 'Dinner',
  'Souper': 'Supper',
  'Dessert': 'Dessert',
  'Desserts': 'Desserts',
  'Collation': 'Snack',
  'Collations': 'Snacks',
  'Brunch': 'Brunch',

  // Course types
  'Entrées': 'Appetizers',
  'Entrée': 'Appetizer',
  'Plats principaux': 'Main Dishes',
  'Plat principal': 'Main Dish',
  'Plats principaux Boeuf': 'Beef Main Dishes',
  'Plats principaux Porc': 'Pork Main Dishes',
  'Plat principaux Poissons': 'Fish Main Dishes',
  'Plats principaux Volaille': 'Poultry Main Dishes',
  'Plats principaux Végétariens': 'Vegetarian Main Dishes',
  "Plats d'accompagnement": 'Side Dishes',
  "Plats d'accompagnement Légumes": 'Vegetable Side Dishes',
  'Accompagnements': 'Side Dishes',

  // Food categories
  'Salades': 'Salads',
  'Salade': 'Salad',
  'Soupes': 'Soups',
  'Soupe': 'Soup',
  'Pâtes': 'Pasta',
  'Riz': 'Rice',
  'Pain': 'Bread',
  'Pains': 'Breads',
  'Pizza': 'Pizza',
  'Pizzas': 'Pizzas',
  'Sandwich': 'Sandwich',
  'Sandwichs': 'Sandwiches',
  'Boissons': 'Drinks',
  'Boisson': 'Drink',
  'Biscuits': 'Cookies',
  'Gâteaux': 'Cakes',
  'Tartes': 'Pies',
  'Crêpes': 'Crepes',

  // Proteins
  'Boeuf': 'Beef',
  'Bœuf': 'Beef',
  'Porc': 'Pork',
  'Poulet': 'Chicken',
  'Volaille': 'Poultry',
  'Poisson': 'Fish',
  'Poissons': 'Fish',
  'Fruits de mer': 'Seafood',
  'Agneau': 'Lamb',
  'Veau': 'Veal',
  'Végétarien': 'Vegetarian',
  'Végétariens': 'Vegetarian',
  'Végétalien': 'Vegan',

  // Ingredients
  'Champignons': 'Mushrooms',
  'Champignon': 'Mushroom',
  'Ail': 'Garlic',
  'Oignon': 'Onion',
  'Oignons': 'Onions',
  'Tomates': 'Tomatoes',
  'Tomate': 'Tomato',
  'Pommes de terre': 'Potatoes',
  'Patates': 'Potatoes',
  'Légumes': 'Vegetables',
  'Fromage': 'Cheese',
  'Fromage râpé': 'Grated Cheese',
  'Œufs': 'Eggs',
  'Oeufs': 'Eggs',
  'Farine': 'Flour',
  'Beurre': 'Butter',
  'Crème': 'Cream',
  'Lait': 'Milk',
  'Sucre': 'Sugar',
  'Chocolat': 'Chocolate',
  'Fruits': 'Fruits',
  'Noix': 'Nuts',

  // Origins / Countries
  'Québec': 'Quebec',
  'Canada': 'Canada',
  'France': 'France',
  'Italie': 'Italy',
  'Mexique': 'Mexico',
  'Japon': 'Japan',
  'Chine': 'China',
  'Inde': 'India',
  'États-Unis': 'United States',
  'Ukraine': 'Ukraine',
  'Grèce': 'Greece',
  'Espagne': 'Spain',
  'Thaïlande': 'Thailand',
  'Vietnam': 'Vietnam',

  // Cooking methods
  'Grillé': 'Grilled',
  'Rôti': 'Roasted',
  'Frit': 'Fried',
  'Cuit au four': 'Baked',
  'Mijoté': 'Simmered',
  'Vapeur': 'Steamed',
  'BBQ': 'BBQ',
  'Air Fryer': 'Air Fryer',

  // Occasions
  'Fêtes': 'Holidays',
  'Noël': 'Christmas',
  'Pâques': 'Easter',
  'Action de grâce': 'Thanksgiving',
  'Halloween': 'Halloween',
  'Été': 'Summer',
  'Hiver': 'Winter',

  // Diet types
  'Sans gluten': 'Gluten-Free',
  'Sans lactose': 'Lactose-Free',
  'Faible en calories': 'Low Calorie',
  'Riche en protéines': 'High Protein',
};

/**
 * Get translated category name based on locale
 */
export function getCategoryName(frenchName: string, locale: 'fr' | 'en'): string {
  if (locale === 'fr') {
    return frenchName;
  }
  return categoryTranslations[frenchName] || frenchName;
}
