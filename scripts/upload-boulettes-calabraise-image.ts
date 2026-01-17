/**
 * Script pour uploader l'image de la recette Riz aux boulettes calabraises
 * et l'associer à la recette
 *
 * Usage: npx tsx scripts/upload-boulettes-calabraise-image.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const RECIPE_SLUG = 'riz-boulettes-calabraise-stefano';
const IMAGE_PATH = path.join(process.cwd(), 'ChatGPT Image Jan 14, 2026, 06_49_53 PM.png');
const BUCKET_NAME = 'recipe-images';

async function main() {
  console.log('Upload de l\'image des boulettes calabraises...\n');

  // 1. Vérifier que l'image existe
  if (!fs.existsSync(IMAGE_PATH)) {
    console.error('Image non trouvée:', IMAGE_PATH);
    process.exit(1);
  }

  // 2. Lire l'image
  const imageBuffer = fs.readFileSync(IMAGE_PATH);
  const fileName = `riz-boulettes-calabraise-stefano-${Date.now()}.png`;

  console.log(`Fichier: ${IMAGE_PATH}`);
  console.log(`Taille: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
  console.log(`Destination: ${BUCKET_NAME}/${fileName}`);

  // 3. Upload vers Supabase Storage
  console.log('\nUpload vers Supabase Storage...');
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, imageBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error('Erreur upload:', uploadError.message);
    process.exit(1);
  }

  console.log('Upload réussi!');

  // 4. Obtenir l'URL publique
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  const imageUrl = urlData.publicUrl;
  console.log(`URL publique: ${imageUrl}`);

  // 5. Mettre à jour la recette avec l'image
  console.log('\nMise à jour de la recette...');
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .update({
      featured_image: imageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', RECIPE_SLUG)
    .select()
    .single();

  if (recipeError) {
    console.error('Erreur mise à jour recette:', recipeError.message);
    process.exit(1);
  }

  console.log(`Recette mise à jour (ID: ${recipe.id})`);

  // 6. Vérification finale
  console.log('\nVérification finale...');
  const { data: finalRecipe } = await supabase
    .from('recipes')
    .select('id, slug, title, featured_image')
    .eq('slug', RECIPE_SLUG)
    .single();

  console.log('\nRésultat:');
  console.log(`   ID: ${finalRecipe?.id}`);
  console.log(`   Titre: ${finalRecipe?.title}`);
  console.log(`   Image: ${finalRecipe?.featured_image}`);

  console.log('\nTerminé!');
  console.log(`   FR: https://menucochon.com/recette/${RECIPE_SLUG}/`);
  console.log(`   EN: https://menucochon.com/en/recipe/stefano-calabrian-meatball-rice-bowl/`);
}

main().catch(console.error);
