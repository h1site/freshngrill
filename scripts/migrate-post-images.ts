/**
 * Script pour mettre à jour les URLs d'images des posts dans la DB
 * Les images sont déjà dans le bucket Supabase post-images
 *
 * Usage:
 *   npx tsx scripts/migrate-post-images.ts [--dry-run] [--limit=N]
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BUCKET_NAME = 'post-images';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Parse des arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ANALYZE_ONLY = args.includes('--analyze');
const limitArg = args.find(arg => arg.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;

// Cache des fichiers dans le bucket
let bucketFilesCache: Map<string, string> = new Map();

async function loadBucketFiles(): Promise<void> {
  console.log('Chargement des fichiers du bucket post-images...');

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
      // Le fichier a un préfixe timestamp comme "1765312117134-nom-fichier..."
      const match = file.name.match(/^\d+-(.+)$/);
      if (match) {
        const originalName = match[1].toLowerCase();
        bucketFilesCache.set(originalName, file.name);
      } else {
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

function getFileNameFromWpUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1].toLowerCase();
  } catch {
    return '';
  }
}

function findBucketFile(wpUrl: string): string | null {
  const fileName = getFileNameFromWpUrl(wpUrl);
  if (!fileName) return null;

  // Chercher directement
  if (bucketFilesCache.has(fileName)) {
    return bucketFilesCache.get(fileName)!;
  }

  // Chercher avec variations
  const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  for (const [key, value] of bucketFilesCache.entries()) {
    if (key.includes(fileNameWithoutExt) || fileNameWithoutExt.includes(key.replace(/\.[^/.]+$/, ''))) {
      return value;
    }
  }

  return null;
}

function getSupabaseUrl(fileName: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;
}

async function analyzePostImages(): Promise<void> {
  console.log('=== Analyse des images des posts ===\n');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, slug, featured_image');

  if (error) {
    console.error('Erreur:', error);
    return;
  }

  let wpCount = 0;
  let supabaseCount = 0;
  let otherCount = 0;
  let nullCount = 0;

  for (const post of posts || []) {
    if (!post.featured_image) {
      nullCount++;
    } else if (post.featured_image.includes('menucochon.com') || post.featured_image.includes('wp-content')) {
      wpCount++;
    } else if (post.featured_image.includes('supabase')) {
      supabaseCount++;
    } else {
      otherCount++;
    }
  }

  console.log(`Total posts: ${posts?.length}`);
  console.log(`Sans image: ${nullCount}`);
  console.log(`Images WordPress: ${wpCount}`);
  console.log(`Images Supabase: ${supabaseCount}`);
  console.log(`Autres: ${otherCount}`);
}

async function migratePostImages(): Promise<void> {
  console.log('=== Migration des URLs d\'images des posts vers Supabase ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN' : 'PRODUCTION'}`);
  if (LIMIT) console.log(`Limite: ${LIMIT} posts`);
  console.log('');

  await loadBucketFiles();
  console.log('');

  // Récupérer les posts avec des images WordPress
  let query = supabase
    .from('posts')
    .select('id, slug, featured_image')
    .or('featured_image.ilike.%menucochon.com%,featured_image.ilike.%wp-content%');

  if (LIMIT) {
    query = query.limit(LIMIT);
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error('Erreur récupération posts:', error);
    return;
  }

  console.log(`Posts à traiter: ${posts?.length || 0}`);
  console.log('');

  let successCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;
  const notFoundList: string[] = [];

  for (const post of posts || []) {
    console.log(`\n[${post.id}] ${post.slug}`);

    if (post.featured_image) {
      const bucketFileName = findBucketFile(post.featured_image);

      if (bucketFileName) {
        const newUrl = getSupabaseUrl(bucketFileName);
        console.log(`  WP: ${getFileNameFromWpUrl(post.featured_image)}`);
        console.log(`  -> ${bucketFileName}`);

        if (!DRY_RUN) {
          const { error: updateError } = await supabase
            .from('posts')
            .update({ featured_image: newUrl })
            .eq('id', post.id);

          if (updateError) {
            console.error(`  Erreur DB:`, updateError.message);
            errorCount++;
          } else {
            successCount++;
          }
        } else {
          successCount++;
        }
      } else {
        console.log(`  PAS TROUVÉ: ${getFileNameFromWpUrl(post.featured_image)}`);
        notFoundList.push(post.featured_image);
        notFoundCount++;
      }
    }
  }

  console.log('\n=== Résumé ===');
  console.log(`Correspondances trouvées: ${successCount}`);
  console.log(`Non trouvés: ${notFoundCount}`);
  console.log(`Erreurs DB: ${errorCount}`);

  if (DRY_RUN) {
    console.log('\n[DRY-RUN] Aucune modification effectuée.');
  }

  if (notFoundList.length > 0) {
    console.log('\n=== Images non trouvées ===');
    notFoundList.forEach(url => console.log(`  - ${getFileNameFromWpUrl(url)}`));
  }
}

// Exécuter
if (ANALYZE_ONLY) {
  analyzePostImages().catch(console.error);
} else {
  migratePostImages().catch(console.error);
}
