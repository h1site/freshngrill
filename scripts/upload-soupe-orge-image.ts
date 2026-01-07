/**
 * Script pour uploader l'image de la soupe à l'orge et mettre à jour la recette
 *
 * Usage: npx tsx scripts/upload-soupe-orge-image.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const RECIPE_SLUG = 'soupe-orge-bacon-mijoteuse';
const IMAGE_PATH = path.join(process.cwd(), 'soupe-orge.jpg');

async function main() {
  console.log('🖼️ Upload de l\'image pour la soupe à l\'orge...\n');

  // 1. Vérifier que le fichier existe
  if (!fs.existsSync(IMAGE_PATH)) {
    console.error('❌ Fichier non trouvé:', IMAGE_PATH);
    process.exit(1);
  }

  const fileStats = fs.statSync(IMAGE_PATH);
  console.log(`📁 Fichier trouvé: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);

  // 2. Lire le fichier
  const fileBuffer = fs.readFileSync(IMAGE_PATH);
  const fileName = `soupe-orge-bacon-${Date.now()}.jpg`;

  // 3. Upload vers Supabase Storage
  console.log('⬆️ Upload vers Supabase Storage...');

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('recipe-images')
    .upload(fileName, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (uploadError) {
    console.error('❌ Erreur upload:', uploadError.message);
    process.exit(1);
  }

  console.log('✅ Image uploadée:', uploadData.path);

  // 4. Obtenir l'URL publique
  const { data: publicUrlData } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(uploadData.path);

  const imageUrl = publicUrlData.publicUrl;
  console.log('🔗 URL publique:', imageUrl);

  // 5. Mettre à jour la recette
  console.log('\n📝 Mise à jour de la recette...');

  const { data: recipe, error: updateError } = await supabase
    .from('recipes')
    .update({ featured_image: imageUrl })
    .eq('slug', RECIPE_SLUG)
    .select('id, slug, title, featured_image')
    .single();

  if (updateError) {
    console.error('❌ Erreur mise à jour:', updateError.message);
    process.exit(1);
  }

  console.log('✅ Recette mise à jour');
  console.log(`   ID: ${recipe.id}`);
  console.log(`   Titre: ${recipe.title}`);
  console.log(`   Image: ${recipe.featured_image}`);

  console.log('\n✨ Terminé!');
  console.log(`   FR: https://menucochon.com/recette/${RECIPE_SLUG}/`);
  console.log(`   EN: https://menucochon.com/en/recipe/slow-cooker-barley-bacon-soup/`);
}

main().catch(console.error);
