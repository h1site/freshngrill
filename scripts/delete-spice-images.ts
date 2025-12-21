/**
 * Script pour supprimer toutes les images d'épices de Supabase Storage
 * et réinitialiser les champs featured_image dans la base de données
 *
 * Usage: npx tsx scripts/delete-spice-images.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  console.log('🗑️  Suppression des images d\'épices\n');

  // 1. List all files in spices folder
  console.log('📋 Liste des fichiers dans recipe-images/spices/...');
  const { data: files, error: listError } = await supabase.storage
    .from('recipe-images')
    .list('spices');

  if (listError) {
    console.error('❌ Erreur de listing:', listError.message);
    process.exit(1);
  }

  if (!files || files.length === 0) {
    console.log('✅ Aucune image à supprimer dans le dossier spices/');
  } else {
    console.log(`📁 ${files.length} fichiers trouvés`);

    // 2. Delete all files
    const filePaths = files.map(f => `spices/${f.name}`);
    console.log('\n🗑️  Suppression des fichiers...');

    const { error: deleteError } = await supabase.storage
      .from('recipe-images')
      .remove(filePaths);

    if (deleteError) {
      console.error('❌ Erreur de suppression:', deleteError.message);
    } else {
      console.log(`✅ ${files.length} fichiers supprimés du storage`);
    }
  }

  // 3. Reset featured_image in database
  console.log('\n🔄 Réinitialisation des champs featured_image dans la base de données...');

  const { data: updatedSpices, error: updateError } = await supabase
    .from('spices')
    .update({
      featured_image: null,
      image_alt_fr: null,
      image_alt_en: null,
    })
    .not('featured_image', 'is', null)
    .select('slug');

  if (updateError) {
    console.error('❌ Erreur de mise à jour DB:', updateError.message);
    process.exit(1);
  }

  console.log(`✅ ${updatedSpices?.length || 0} épices mises à jour (featured_image = null)`);
  console.log('\n🏁 Terminé!');
}

main().catch(console.error);
