/**
 * Script pour mettre à jour les titres de la recette boulettes calabraises
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  console.log('Mise à jour des titres...\n');

  // Mise à jour du titre français
  const { error: frError } = await supabase
    .from('recipes')
    .update({
      title: 'Riz et sauté de légumes avec les boulettes calabraises de Stefano',
      seo_title: 'Riz et sauté de légumes avec boulettes calabraises | Recette rapide',
      updated_at: new Date().toISOString(),
    })
    .eq('slug', 'riz-boulettes-calabraise-stefano');

  if (frError) {
    console.error('Erreur FR:', frError.message);
  } else {
    console.log('✅ Titre FR mis à jour');
  }

  // Mise à jour du titre anglais
  const { error: enError } = await supabase
    .from('recipe_translations')
    .update({
      title: 'Rice and Stir-Fried Vegetables with Stefano Calabrian Meatballs',
      seo_title: 'Rice and Stir-Fried Vegetables with Calabrian Meatballs | Quick Recipe',
    })
    .eq('slug_en', 'stefano-calabrian-meatball-rice-bowl');

  if (enError) {
    console.error('Erreur EN:', enError.message);
  } else {
    console.log('✅ Titre EN mis à jour');
  }

  // Vérification
  const { data: recipe } = await supabase
    .from('recipes')
    .select('title, seo_title')
    .eq('slug', 'riz-boulettes-calabraise-stefano')
    .single();

  const { data: trans } = await supabase
    .from('recipe_translations')
    .select('title, seo_title')
    .eq('slug_en', 'stefano-calabrian-meatball-rice-bowl')
    .single();

  console.log('\nRésultat:');
  console.log('FR:', recipe?.title);
  console.log('EN:', trans?.title);
}

main().catch(console.error);
