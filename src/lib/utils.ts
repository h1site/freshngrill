import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimise une meta description pour SEO (155-160 caractères)
 * - Tronque au dernier mot complet si trop long
 * - Ajoute "..." si tronqué
 */
export function optimizeMetaDescription(
  text: string | undefined | null,
  fallback: string = ''
): string {
  const content = text?.trim() || fallback;
  if (!content) return '';

  // Nettoyer le HTML si présent
  const cleaned = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

  // Si déjà dans la bonne plage, retourner tel quel
  if (cleaned.length >= 150 && cleaned.length <= 160) {
    return cleaned;
  }

  // Si trop court, retourner tel quel (pas grand chose à faire)
  if (cleaned.length < 150) {
    return cleaned;
  }

  // Trop long: tronquer au dernier espace avant 157 caractères (pour "...")
  const maxLength = 157;
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 100) {
    return truncated.substring(0, lastSpace) + '...';
  }

  // Pas d'espace trouvé après 100 chars, couper net
  return truncated + '...';
}
