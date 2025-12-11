/**
 * Script pour mettre à jour les URLs d'images dans la DB
 * Les images sont déjà dans le bucket Supabase, il faut juste mapper les URLs
 *
 * Usage:
 *   npx tsx scripts/migrate-images-to-supabase.ts [--dry-run] [--limit=N]
 *
 * Options:
 *   --dry-run   Ne pas effectuer de modifications, juste afficher ce qui serait fait
 *   --limit=N   Limiter le traitement à N recettes
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BUCKET_NAME = 'recipe-images';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Parse des arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const limitArg = args.find(arg => arg.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;

// Cache des fichiers dans le bucket (nom de fichier WordPress -> nom dans bucket)
let bucketFilesCache: Map<string, string> = new Map();

/**
 * Charge tous les fichiers du bucket dans le cache
 */
async function loadBucketFiles(): Promise<void> {
  console.log('Chargement des fichiers du bucket...');

  let offset = 0;
  const limit = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { limit, offset });

    if (error) {
      console.error('Erreur listing bucket:', error);
      break;
    }

    if (!data || data.length === 0) {
      hasMore = false;
      break;
    }

    for (const file of data) {
      // Le fichier a un préfixe timestamp comme "1765312117134-close-up-of-roll..."
      // On veut mapper le nom original "close-up-of-roll..." vers ce fichier
      const match = file.name.match(/^\d+-(.+)$/);
      if (match) {
        const originalName = match[1].toLowerCase();
        bucketFilesCache.set(originalName, file.name);
      } else {
        // Si pas de préfixe timestamp, utiliser le nom tel quel
        bucketFilesCache.set(file.name.toLowerCase(), file.name);
      }
    }

    offset += data.length;
    if (data.length < limit) {
      hasMore = false;
    }
  }

  console.log(`${bucketFilesCache.size} fichiers trouvés dans le bucket`);
}

/**
 * Extrait le nom de fichier d'une URL WordPress
 */
function getFileNameFromWpUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1].toLowerCase();
  } catch {
    return '';
  }
}

/**
 * Trouve le fichier correspondant dans le bucket
 */
function findBucketFile(wpUrl: string): string | null {
  const fileName = getFileNameFromWpUrl(wpUrl);
  if (!fileName) return null;

  // Chercher directement
  if (bucketFilesCache.has(fileName)) {
    return bucketFilesCache.get(fileName)!;
  }

  // Chercher avec variations (sans extension, etc.)
  const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  for (const [key, value] of bucketFilesCache.entries()) {
    if (key.includes(fileNameWithoutExt) || fileNameWithoutExt.includes(key.replace(/\.[^/.]+$/, ''))) {
      return value;
    }
  }

  return null;
}

/**
 * Génère l'URL publique Supabase
 */
function getSupabaseUrl(fileName: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;
}

async function migrateRecipeImages(): Promise<void> {
  console.log('=== Migration des URLs d\'images vers Supabase ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN (aucune modification)' : 'PRODUCTION'}`);
  if (LIMIT) console.log(`Limite: ${LIMIT} recettes`);
  console.log('');

  // Charger les fichiers du bucket
  await loadBucketFiles();
  console.log('');

  // Récupérer les recettes avec des images WordPress
  let query = supabase
    .from('recipes')
    .select('id, slug, featured_image, images')
    .or('featured_image.ilike.%menucochon.com%,featured_image.ilike.%wp-content%');

  if (LIMIT) {
    query = query.limit(LIMIT);
  }

  const { data: recipes, error } = await query;

  if (error) {
    console.error('Erreur récupération recettes:', error);
    return;
  }

  console.log(`Recettes à traiter: ${recipes?.length || 0}`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;
  let notFoundCount = 0;

  for (const recipe of recipes || []) {
    console.log(`\n[${recipe.id}] ${recipe.slug}`);

    let needsUpdate = false;
    let newFeaturedImage = recipe.featured_image;

    // Traiter featured_image
    if (recipe.featured_image &&
        (recipe.featured_image.includes('menucochon.com') || recipe.featured_image.includes('wp-content'))) {

      const bucketFileName = findBucketFile(recipe.featured_image);

      if (bucketFileName) {
        newFeaturedImage = getSupabaseUrl(bucketFileName);
        needsUpdate = true;
        console.log(`  WP: ${getFileNameFromWpUrl(recipe.featured_image)}`);
        console.log(`  -> ${bucketFileName}`);
        successCount++;
      } else {
        console.log(`  PAS TROUVÉ: ${getFileNameFromWpUrl(recipe.featured_image)}`);
        notFoundCount++;
      }
    }

    // Mettre à jour la DB si nécessaire
    if (needsUpdate && !DRY_RUN) {
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ featured_image: newFeaturedImage })
        .eq('id', recipe.id);

      if (updateError) {
        console.error(`  Erreur DB:`, updateError.message);
        errorCount++;
      }
    }
  }

  console.log('\n=== Résumé ===');
  console.log(`Correspondances trouvées: ${successCount}`);
  console.log(`Non trouvés: ${notFoundCount}`);
  console.log(`Erreurs DB: ${errorCount}`);

  if (DRY_RUN) {
    console.log('\n[DRY-RUN] Aucune modification effectuée.');
    console.log('Relancez sans --dry-run pour effectuer la migration.');
  }

  // Afficher les fichiers non trouvés pour debug
  if (notFoundCount > 0) {
    console.log('\n=== Images non trouvées ===');
    console.log('Vérifiez que ces images sont bien dans le bucket.');
  }
}

migrateRecipeImages().catch(console.error);
