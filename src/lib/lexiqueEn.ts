import { supabase } from './supabase';

export interface LexiqueEnTerm {
  id: number;
  slug: string;
  term: string;
  definition: string;
  letter: string;
  createdAt: string;
  updatedAt: string;
}

export interface LexiqueEnByLetter {
  letter: string;
  terms: LexiqueEnTerm[];
}

/**
 * Transformer les données Supabase en LexiqueEnTerm
 */
function transformTerm(data: any): LexiqueEnTerm {
  return {
    id: data.id,
    slug: data.slug,
    term: data.term,
    definition: data.definition,
    letter: data.letter,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Obtenir tous les termes du lexique anglais
 */
export async function getAllTermsEn(): Promise<LexiqueEnTerm[]> {
  const { data, error } = await supabase
    .from('lexique_en')
    .select('*')
    .order('term');

  if (error) {
    console.error('Erreur getAllTermsEn:', error);
    return [];
  }

  return (data || []).map(d => transformTerm(d));
}

/**
 * Obtenir les termes groupés par lettre
 */
export async function getTermsByLetterEn(): Promise<LexiqueEnByLetter[]> {
  const terms = await getAllTermsEn();

  const grouped: Record<string, LexiqueEnTerm[]> = {};

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
export async function getTermBySlugEn(slug: string): Promise<LexiqueEnTerm | null> {
  const { data, error } = await supabase
    .from('lexique_en')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Erreur getTermBySlugEn:', error);
    return null;
  }

  return data ? transformTerm(data) : null;
}

/**
 * Obtenir tous les slugs (pour generateStaticParams)
 */
export async function getAllTermSlugsEn(): Promise<string[]> {
  const { data, error } = await supabase
    .from('lexique_en')
    .select('slug');

  if (error) {
    console.error('Erreur getAllTermSlugsEn:', error);
    return [];
  }

  return (data || []).map((t: any) => t.slug);
}

/**
 * Obtenir les termes d'une lettre spécifique
 */
export async function getTermsForLetterEn(letter: string): Promise<LexiqueEnTerm[]> {
  const { data, error } = await supabase
    .from('lexique_en')
    .select('*')
    .eq('letter', letter.toUpperCase())
    .order('term');

  if (error) {
    console.error('Erreur getTermsForLetterEn:', error);
    return [];
  }

  return (data || []).map(d => transformTerm(d));
}

/**
 * Rechercher des termes
 */
export async function searchTermsEn(query: string): Promise<LexiqueEnTerm[]> {
  const { data, error } = await supabase
    .from('lexique_en')
    .select('*')
    .or(`term.ilike.%${query}%,definition.ilike.%${query}%`)
    .order('term')
    .limit(20);

  if (error) {
    console.error('Erreur searchTermsEn:', error);
    return [];
  }

  return (data || []).map(d => transformTerm(d));
}

/**
 * Obtenir les lettres disponibles
 */
export async function getAvailableLettersEn(): Promise<string[]> {
  const { data, error } = await supabase
    .from('lexique_en')
    .select('letter')
    .order('letter');

  if (error) {
    console.error('Erreur getAvailableLettersEn:', error);
    return [];
  }

  const letters = [...new Set((data || []).map((t: any) => t.letter))];
  return letters.sort();
}

/**
 * Obtenir le terme précédent et suivant (pour la navigation)
 */
export async function getAdjacentTermsEn(
  currentSlug: string
): Promise<{ prev: LexiqueEnTerm | null; next: LexiqueEnTerm | null }> {
  const allTerms = await getAllTermsEn();
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
export async function countTermsEn(): Promise<number> {
  const { count, error } = await supabase
    .from('lexique_en')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Erreur countTermsEn:', error);
    return 0;
  }

  return count || 0;
}
