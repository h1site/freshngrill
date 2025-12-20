import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const images = [
  {
    url: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/banana-bread-and-bananas-on-a-dark-background-top-2025-03-25-17-19-04-utc.jpg',
    slug: 'pain-aux-bananes-moelleux',
  },
  {
    url: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/chicken-tikka-masala-2025-03-06-04-51-00-utc.jpg',
    slug: 'poulet-au-beurre-indien',
  },
  {
    url: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/chickpea-sauce-with-fresh-lemon-juice-sesame-seed-2025-02-18-12-45-53-utc.jpg',
    slug: 'soupe-aux-pois-traditionnelle',
  },
  {
    url: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/french-onion-soup-with-cheesy-bread-2024-09-13-22-12-03-utc.jpg',
    slug: 'soupe-a-loignon-gratinee',
  },
  {
    url: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/fresh-beef-tartar-with-tasty-vegetables-2024-12-05-18-48-04-utc.jpg',
    slug: 'tartare-de-boeuf-classique',
  },
  {
    url: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/pork-baked-with-vegetables-on-a-tray-2024-10-11-06-09-24-utc.JPG',
    slug: 'filets-de-porc-glaces-erable',
  },
  {
    url: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/spiced-carrot-cake-with-walnuts-and-cinnamon-2025-03-24-07-37-24-utc.jpg',
    slug: 'gateau-aux-carottes-meilleur',
  },
];

async function compressImages() {
  console.log('🚀 Compression des images en WebP...\n');

  for (const img of images) {
    try {
      console.log(`📥 Téléchargement: ${img.slug}`);

      // Télécharger l'image
      const response = await fetch(img.url);
      if (!response.ok) {
        throw new Error(`Erreur téléchargement: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);
      const originalSize = inputBuffer.length;

      console.log(`   Taille originale: ${(originalSize / 1024).toFixed(1)} KB`);

      // Convertir en WebP
      const webpBuffer = await sharp(inputBuffer)
        .rotate()
        .webp({
          quality: 85,
          effort: 4,
        })
        .resize({
          width: 1200,
          height: 800,
          fit: 'cover',
          position: 'center',
          withoutEnlargement: true,
        })
        .toBuffer();

      const newSize = webpBuffer.length;
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
      console.log(`   Taille WebP: ${(newSize / 1024).toFixed(1)} KB (${savings}% de réduction)`);

      // Upload vers Supabase
      const fileName = `recipes/${img.slug}.webp`;

      // Supprimer l'ancien fichier s'il existe
      await supabase.storage.from('recipe-images').remove([fileName]);

      const { data, error } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, webpBuffer, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true,
        });

      if (error) {
        throw new Error(`Erreur upload: ${error.message}`);
      }

      // Obtenir l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName);

      console.log(`✅ Uploadé: ${publicUrlData.publicUrl}`);

      // Mettre à jour la recette
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ featured_image: publicUrlData.publicUrl })
        .eq('slug', img.slug);

      if (updateError) {
        console.log(`⚠️ Erreur mise à jour recette: ${updateError.message}`);
      } else {
        console.log(`✅ Recette mise à jour: ${img.slug}`);
      }

      console.log('');

    } catch (error) {
      console.error(`❌ Erreur pour ${img.slug}:`, error);
      console.log('');
    }
  }

  console.log('🎉 Terminé!');
}

compressImages();
