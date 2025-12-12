export interface Recipe {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  images: string[];

  // Contenu ACF
  introduction?: string;
  conclusion?: string;
  faq?: string;
  videoUrl?: string;

  // Temps
  prepTime: number;
  cookTime: number;
  restTime?: number;
  totalTime: number;

  // Portions
  servings: number;
  servingsUnit?: string;

  // Difficulté
  difficulty: 'facile' | 'moyen' | 'difficile';

  // Ingrédients
  ingredients: IngredientGroup[];

  // Instructions
  instructions: InstructionStep[];

  // Nutrition
  nutrition?: NutritionInfo;

  // Taxonomies
  categories: Category[];
  tags: string[];
  cuisine?: string;
  ingredientTags?: Tag[];
  origineTags?: Tag[];
  cuisineTypeTags?: Tag[];

  // Meta
  author: string;
  publishedAt: string;
  updatedAt: string;

  // Engagement
  likes: number;

  // SEO
  seoTitle?: string;
  seoDescription?: string;
}

export interface Tag {
  id: number;
  slug: string;
  name: string;
}

export interface IngredientGroup {
  title?: string;
  items: Ingredient[];
}

export interface Ingredient {
  quantity?: string;
  unit?: string;
  name: string;
  note?: string;
}

export interface InstructionStep {
  step: number;
  title?: string;
  content: string;
  image?: string;
  tip?: string;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  parent?: number;
}

export interface RecipeCard {
  id: number;
  slug: string;
  slugEn?: string;
  title: string;
  featuredImage: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  difficulty: string;
  categories: Category[];
  likes: number;
}
