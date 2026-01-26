import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Fonction pour normaliser les accents (retirer les accents)
function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Mots à ignorer dans le scoring (stop words)
const STOP_WORDS = new Set([
  'de', 'du', 'des', 'la', 'le', 'les', 'un', 'une', 'et', 'ou', 'a', 'au', 'aux',
  'en', 'pour', 'avec', 'sans', 'sur', 'dans', 'par', 'ce', 'cette', 'ces',
  'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
  'qui', 'que', 'quoi', 'dont', 'où',
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'for', 'with', 'on',
]);

// Synonymes pour améliorer la recherche
const SYNONYMS: Record<string, string[]> = {
  'crepe': ['crêpe', 'crepes', 'crêpes', 'pancake', 'pancakes'],
  'gateau': ['gâteau', 'gateaux', 'gâteaux', 'cake', 'cakes'],
  'poulet': ['chicken', 'volaille'],
  'boeuf': ['bœuf', 'beef', 'viande'],
  'porc': ['pork', 'cochon'],
  'poisson': ['fish', 'seafood'],
  'legume': ['légume', 'legumes', 'légumes', 'vegetable', 'vegetables'],
  'dessert': ['desserts', 'sucre', 'sucrerie'],
  'soupe': ['potage', 'veloute', 'velouté', 'soup'],
  'salade': ['salades', 'salad', 'salads'],
  'pate': ['pâte', 'pates', 'pâtes', 'pasta'],
  'riz': ['rice'],
  'pain': ['bread'],
  'tarte': ['tartes', 'pie', 'pies'],
  'facile': ['faciles', 'simple', 'simples', 'easy', 'rapide', 'rapides', 'quick'],
  'traditionnel': ['traditionnelle', 'traditionnels', 'traditionnelles', 'classique', 'authentique'],
  'maison': ['homemade', 'fait maison'],
  'quebec': ['québec', 'quebecois', 'québécois', 'canadien', 'canadienne'],
  'base': ['basique', 'basic', 'fondamental'],
  'dejeuner': ['déjeuner', 'breakfast', 'brunch'],
  'diner': ['dîner', 'dinner', 'souper', 'supper'],
};

// Fonction pour obtenir les synonymes d'un mot
function getSynonyms(word: string): string[] {
  const wordLower = removeAccents(word.toLowerCase());
  const synonyms = new Set<string>([word.toLowerCase()]);

  // Chercher si le mot a des synonymes directs
  if (SYNONYMS[wordLower]) {
    SYNONYMS[wordLower].forEach(s => synonyms.add(s));
  }

  // Chercher si le mot est un synonyme d'un autre mot
  for (const [key, values] of Object.entries(SYNONYMS)) {
    if (values.some(v => removeAccents(v) === wordLower)) {
      synonyms.add(key);
      values.forEach(v => synonyms.add(v));
    }
  }

  return Array.from(synonyms);
}

// Fonction pour générer le singulier/pluriel
function getSingularPlural(word: string): string[] {
  const variants = [word];
  const wordLower = word.toLowerCase();

  // Si finit par 's', ajouter version sans 's'
  if (wordLower.endsWith('s') && wordLower.length > 2) {
    variants.push(wordLower.slice(0, -1));
  } else {
    // Ajouter version avec 's'
    variants.push(wordLower + 's');
  }

  // Cas spéciaux français
  if (wordLower.endsWith('eau')) {
    variants.push(wordLower + 'x'); // gateau -> gateaux
  }
  if (wordLower.endsWith('eaux')) {
    variants.push(wordLower.slice(0, -1)); // gateaux -> gateau
  }

  return variants;
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

  // Filtrer les stop words pour le scoring (mais garder pour la recherche)
  const significantWords = queryWords.filter(word => !STOP_WORDS.has(word.toLowerCase()));

  // Générer les variantes de recherche pour chaque mot
  const allVariants: string[] = [];
  for (const word of queryWords) {
    // Variantes d'accents
    const accentVariants = generateAccentVariants(word);
    allVariants.push(...accentVariants);

    // Synonymes
    const synonyms = getSynonyms(word);
    for (const syn of synonyms) {
      allVariants.push(...generateAccentVariants(syn));
    }

    // Singulier/Pluriel
    const singPlur = getSingularPlural(word);
    for (const sp of singPlur) {
      allVariants.push(...generateAccentVariants(sp));
    }
  }

  // Ajouter aussi la query complète si elle a plusieurs mots
  if (queryWords.length > 1) {
    allVariants.push(...generateAccentVariants(query));
  }
  const searchVariants = Array.from(new Set(allVariants));

  // Construire la condition OR pour toutes les variantes
  // Pour les recettes: chercher dans title, slug, excerpt, introduction, content, conclusion
  const recipeConditions = searchVariants
    .map(variant => `title.ilike.%${variant}%,slug.ilike.%${variant}%,excerpt.ilike.%${variant}%,introduction.ilike.%${variant}%,content.ilike.%${variant}%,conclusion.ilike.%${variant}%`)
    .join(',');

  // Pour les posts: chercher dans title, slug, excerpt, content
  const postConditions = searchVariants
    .map(variant => `title.ilike.%${variant}%,slug.ilike.%${variant}%,excerpt.ilike.%${variant}%,content.ilike.%${variant}%`)
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
  const calculateRelevanceScore = (item: { title: string; slug: string; excerpt?: string | null }, searchWords: string[], significantSearchWords: string[]): number => {
    let score = 0;
    const titleLower = removeAccents(item.title.toLowerCase());
    const slugLower = removeAccents(item.slug.toLowerCase().replace(/-/g, ' '));
    const excerptLower = removeAccents((item.excerpt || '').toLowerCase());

    // Utiliser les mots significatifs pour le scoring principal
    const wordsToScore = significantSearchWords.length > 0 ? significantSearchWords : searchWords;

    for (const word of wordsToScore) {
      const wordLower = removeAccents(word.toLowerCase());

      // Ignorer les stop words dans le scoring
      if (STOP_WORDS.has(wordLower)) continue;

      // Score très élevé si le mot est dans le titre
      if (titleLower.includes(wordLower)) {
        score += 100;
        // Bonus si le titre commence par ce mot
        if (titleLower.startsWith(wordLower)) {
          score += 50;
        }
        // Bonus si le mot est un mot complet dans le titre (pas juste une partie)
        const titleWords = titleLower.split(/\s+/);
        if (titleWords.some(tw => tw === wordLower || removeAccents(tw) === wordLower)) {
          score += 30;
        }
      }

      // Score élevé si dans le slug (souvent les mots-clés importants)
      if (slugLower.includes(wordLower)) {
        score += 80;
      }

      // Score moyen si dans l'excerpt
      if (excerptLower.includes(wordLower)) {
        score += 20;
      }

      // Vérifier les synonymes
      const synonyms = getSynonyms(word);
      for (const syn of synonyms) {
        const synLower = removeAccents(syn.toLowerCase());
        if (synLower !== wordLower) {
          if (titleLower.includes(synLower)) score += 40;
          if (slugLower.includes(synLower)) score += 30;
        }
      }
    }

    // Gros bonus si tous les mots significatifs sont dans le titre
    const allSignificantInTitle = wordsToScore.every(word => {
      if (STOP_WORDS.has(word.toLowerCase())) return true;
      return titleLower.includes(removeAccents(word.toLowerCase()));
    });
    if (allSignificantInTitle && wordsToScore.length > 0) {
      score += 300;
    }

    // Bonus si tous les mots sont dans le slug
    const allInSlug = wordsToScore.every(word => {
      if (STOP_WORDS.has(word.toLowerCase())) return true;
      return slugLower.includes(removeAccents(word.toLowerCase()));
    });
    if (allInSlug && wordsToScore.length > 0) {
      score += 150;
    }

    // Bonus pour exact match du titre (sans accents)
    const queryNormalized = removeAccents(query.toLowerCase().trim());
    if (titleLower === queryNormalized || titleLower.startsWith(queryNormalized + ' ') || titleLower.includes(' ' + queryNormalized)) {
      score += 500;
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
    .map(recipe => ({ ...recipe, score: calculateRelevanceScore(recipe, queryWords, significantWords) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, actualLimit)
    .map(({ score, ...recipe }) => recipe);

  const scoredPosts = uniquePosts
    .map(post => ({ ...post, score: calculateRelevanceScore(post, queryWords, significantWords) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, actualLimit)
    .map(({ score, ...post }) => post);

  return NextResponse.json({
    recipes: scoredRecipes,
    posts: scoredPosts,
  });
}
