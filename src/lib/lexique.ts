import { supabase } from './supabase';

export interface LexiqueTerm {
  id: number;
  slug: string;
  term: string;
  definition: string;
  termEn?: string;
  definitionEn?: string;
  letter: string;
  relatedTerms?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LexiqueByLetter {
  letter: string;
  terms: LexiqueTerm[];
}

/**
 * Transformer les données Supabase en LexiqueTerm
 */
function transformTerm(data: any, locale: 'fr' | 'en' = 'fr'): LexiqueTerm {
  const isEN = locale === 'en';
  return {
    id: data.id,
    slug: data.slug,
    term: isEN && data.term_en ? data.term_en : data.term,
    definition: isEN && data.definition_en ? data.definition_en : data.definition,
    termEn: data.term_en,
    definitionEn: data.definition_en,
    letter: data.letter,
    relatedTerms: data.related_terms || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Obtenir tous les termes du lexique
 */
export async function getAllTerms(locale: 'fr' | 'en' = 'fr'): Promise<LexiqueTerm[]> {
  const { data, error } = await supabase
    .from('lexique')
    .select('*')
    .order('term');

  if (error) {
    console.error('Erreur getAllTerms:', error);
    return [];
  }

  return (data || []).map(d => transformTerm(d, locale));
}

/**
 * Obtenir les termes groupés par lettre
 */
export async function getTermsByLetter(locale: 'fr' | 'en' = 'fr'): Promise<LexiqueByLetter[]> {
  const terms = await getAllTerms(locale);

  const grouped: Record<string, LexiqueTerm[]> = {};

  terms.forEach((term) => {
    const letter = term.letter.toUpperCase();
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(term);
  });

  return Object.keys(grouped)
    .sort()
    .map((letter) => ({
      letter,
      terms: grouped[letter],
    }));
}

/**
 * Obtenir un terme par son slug
 */
export async function getTermBySlug(slug: string, locale: 'fr' | 'en' = 'fr'): Promise<LexiqueTerm | null> {
  const { data, error } = await supabase
    .from('lexique')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Erreur getTermBySlug:', error);
    return null;
  }

  return data ? transformTerm(data, locale) : null;
}

/**
 * Obtenir tous les slugs (pour generateStaticParams)
 */
export async function getAllTermSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('lexique')
    .select('slug');

  if (error) {
    console.error('Erreur getAllTermSlugs:', error);
    return [];
  }

  return (data || []).map((t: any) => t.slug);
}

/**
 * Obtenir les termes d'une lettre spécifique
 */
export async function getTermsForLetter(letter: string, locale: 'fr' | 'en' = 'fr'): Promise<LexiqueTerm[]> {
  const { data, error } = await supabase
    .from('lexique')
    .select('*')
    .eq('letter', letter.toUpperCase())
    .order('term');

  if (error) {
    console.error('Erreur getTermsForLetter:', error);
    return [];
  }

  return (data || []).map(d => transformTerm(d, locale));
}

/**
 * Rechercher des termes
 */
export async function searchTerms(query: string, locale: 'fr' | 'en' = 'fr'): Promise<LexiqueTerm[]> {
  const isEN = locale === 'en';
  const searchFields = isEN
    ? `term.ilike.%${query}%,definition.ilike.%${query}%,term_en.ilike.%${query}%,definition_en.ilike.%${query}%`
    : `term.ilike.%${query}%,definition.ilike.%${query}%`;

  const { data, error } = await supabase
    .from('lexique')
    .select('*')
    .or(searchFields)
    .order('term')
    .limit(20);

  if (error) {
    console.error('Erreur searchTerms:', error);
    return [];
  }

  return (data || []).map(d => transformTerm(d, locale));
}

/**
 * Obtenir les lettres disponibles
 */
export async function getAvailableLetters(): Promise<string[]> {
  const { data, error } = await supabase
    .from('lexique')
    .select('letter')
    .order('letter');

  if (error) {
    console.error('Erreur getAvailableLetters:', error);
    return [];
  }

  const letters = [...new Set((data || []).map((t: any) => t.letter))];
  return letters.sort();
}

/**
 * Obtenir le terme précédent et suivant (pour la navigation)
 */
export async function getAdjacentTerms(
  currentSlug: string
): Promise<{ prev: LexiqueTerm | null; next: LexiqueTerm | null }> {
  const allTerms = await getAllTerms();
  const currentIndex = allTerms.findIndex((t) => t.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? allTerms[currentIndex - 1] : null,
    next: currentIndex < allTerms.length - 1 ? allTerms[currentIndex + 1] : null,
  };
}

/**
 * Compter le nombre total de termes
 */
export async function countTerms(): Promise<number> {
  const { count, error } = await supabase
    .from('lexique')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Erreur countTerms:', error);
    return 0;
  }

  return count || 0;
}
