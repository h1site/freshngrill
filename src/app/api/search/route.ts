import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Fonction pour normaliser les accents (retirer les accents)
function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Fonction pour générer les variantes avec accents communs français
function generateAccentVariants(query: string): string[] {
  const variants = new Set<string>();
  variants.add(query.toLowerCase());
  variants.add(removeAccents(query.toLowerCase()));

  // Mapping des caractères sans accent vers leurs variantes avec accents
  const accentMap: Record<string, string[]> = {
    'a': ['a', 'à', 'â', 'ä'],
    'e': ['e', 'é', 'è', 'ê', 'ë'],
    'i': ['i', 'î', 'ï'],
    'o': ['o', 'ô', 'ö'],
    'u': ['u', 'ù', 'û', 'ü'],
    'c': ['c', 'ç'],
    'n': ['n', 'ñ'],
  };

  // Générer des variantes communes
  // Par exemple: "crepe" -> essayer "crêpe"
  const commonReplacements: Record<string, string> = {
    'crepe': 'crêpe',
    'creme': 'crème',
    'pate': 'pâte',
    'gateau': 'gâteau',
    'puree': 'purée',
    'salade': 'salade',
    'cafe': 'café',
    'the': 'thé',
    'ble': 'blé',
    'mais': 'maïs',
    'noel': 'noël',
    'diner': 'dîner',
    'dejeuner': 'déjeuner',
    'souper': 'souper',
    'legume': 'légume',
    'legumes': 'légumes',
    'epice': 'épice',
    'epices': 'épices',
    'herbe': 'herbe',
    'boeuf': 'bœuf',
    'oeuf': 'œuf',
    'oeufs': 'œufs',
    'coeur': 'cœur',
    'soeur': 'sœur',
    'peche': 'pêche',
    'peches': 'pêches',
    'fraiche': 'fraîche',
    'frais': 'frais',
    'grille': 'grillé',
    'rotie': 'rôtie',
    'roti': 'rôti',
    'poele': 'poêle',
    'brule': 'brûlé',
    'brulee': 'brûlée',
    'entree': 'entrée',
    'entrees': 'entrées',
  };

  const queryLower = query.toLowerCase();

  // Vérifier les remplacements communs
  if (commonReplacements[queryLower]) {
    variants.add(commonReplacements[queryLower]);
  }

  // Vérifier aussi si la query avec accents a un équivalent sans accent
  const queryNoAccents = removeAccents(queryLower);
  if (commonReplacements[queryNoAccents]) {
    variants.add(commonReplacements[queryNoAccents]);
  }

  // Ajouter la version inverse (avec accents -> sans accents)
  for (const [noAccent, withAccent] of Object.entries(commonReplacements)) {
    if (queryLower === withAccent || queryNoAccents === noAccent) {
      variants.add(noAccent);
      variants.add(withAccent);
    }
  }

  return Array.from(variants);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  if (!query || query.length < 2) {
    return NextResponse.json({ recipes: [], posts: [] });
  }

  const actualLimit = Math.min(limit, 50);

  // Séparer la requête en mots individuels pour recherche multi-termes
  const queryWords = query.trim().split(/\s+/).filter(word => word.length >= 2);

  // Générer les variantes de recherche pour chaque mot (avec et sans accents)
  const allVariants: string[] = [];
  for (const word of queryWords) {
    const variants = generateAccentVariants(word);
    allVariants.push(...variants);
  }
  // Ajouter aussi la query complète si elle a plusieurs mots
  if (queryWords.length > 1) {
    allVariants.push(...generateAccentVariants(query));
  }
  const searchVariants = Array.from(new Set(allVariants));

  // Construire la condition OR pour toutes les variantes
  // Pour les recettes: chercher dans title, excerpt, introduction, content, conclusion
  const recipeConditions = searchVariants
    .map(variant => `title.ilike.%${variant}%,excerpt.ilike.%${variant}%,introduction.ilike.%${variant}%,content.ilike.%${variant}%,conclusion.ilike.%${variant}%`)
    .join(',');

  // Pour les posts: chercher dans title, excerpt, content
  const postConditions = searchVariants
    .map(variant => `title.ilike.%${variant}%,excerpt.ilike.%${variant}%,content.ilike.%${variant}%`)
    .join(',');

  // Rechercher dans les recettes (chercher plus de résultats pour pouvoir les scorer)
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, slug, title, featured_image, total_time, difficulty, excerpt')
    .or(recipeConditions)
    .limit(actualLimit * 3);

  if (recipesError) {
    console.error('Erreur recherche recettes:', recipesError);
  }

  // Rechercher dans les posts/blog
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('id, slug, title, featured_image, excerpt')
    .or(postConditions)
    .eq('status', 'publish')
    .limit(actualLimit * 3);

  if (postsError) {
    console.error('Erreur recherche posts:', postsError);
  }

  // Types pour les résultats
  type RecipeResult = { id: number; slug: string; title: string; featured_image: string | null; total_time: number | null; difficulty: string | null; excerpt: string | null };
  type PostResult = { id: number; slug: string; title: string; featured_image: string | null; excerpt: string | null };

  // Fonction pour calculer le score de pertinence
  const calculateRelevanceScore = (item: { title: string; excerpt?: string | null }, searchWords: string[]): number => {
    let score = 0;
    const titleLower = removeAccents(item.title.toLowerCase());
    const excerptLower = removeAccents((item.excerpt || '').toLowerCase());

    for (const word of searchWords) {
      const wordLower = removeAccents(word.toLowerCase());

      // Score très élevé si le mot est dans le titre
      if (titleLower.includes(wordLower)) {
        score += 100;
        // Bonus si le titre commence par ce mot
        if (titleLower.startsWith(wordLower)) {
          score += 50;
        }
      }

      // Score moyen si dans l'excerpt
      if (excerptLower.includes(wordLower)) {
        score += 20;
      }
    }

    // Bonus si tous les mots de la recherche sont dans le titre
    const allWordsInTitle = searchWords.every(word =>
      titleLower.includes(removeAccents(word.toLowerCase()))
    );
    if (allWordsInTitle) {
      score += 200;
    }

    return score;
  };

  // Dédupliquer et scorer les résultats
  const typedRecipes = (recipes || []) as RecipeResult[];
  const typedPosts = (posts || []) as PostResult[];

  const uniqueRecipes = Array.from(new Map(typedRecipes.map(r => [r.id, r])).values());
  const uniquePosts = Array.from(new Map(typedPosts.map(p => [p.id, p])).values());

  // Trier par pertinence
  const scoredRecipes = uniqueRecipes
    .map(recipe => ({ ...recipe, score: calculateRelevanceScore(recipe, queryWords) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, actualLimit)
    .map(({ score, ...recipe }) => recipe);

  const scoredPosts = uniquePosts
    .map(post => ({ ...post, score: calculateRelevanceScore(post, queryWords) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, actualLimit)
    .map(({ score, ...post }) => post);

  return NextResponse.json({
    recipes: scoredRecipes,
    posts: scoredPosts,
  });
}
