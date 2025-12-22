import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  console.log('🔍 Vérification de la recette "Rôti d\'épaule de porc"...\n');

  // Récupérer la recette avec sa traduction
  const { data: recipe, error: fetchError } = await supabase
    .from('recipes')
    .select(`
      id, slug, title, faq, nutrition,
      recipe_translations!inner (
        id, locale, faq, content
      )
    `)
    .eq('slug', 'roti-epaule-de-porc')
    .eq('recipe_translations.locale', 'en')
    .single();

  if (fetchError) {
    console.error('❌ Erreur:', fetchError.message);

    // Essayer sans la colonne content
    console.log('\n🔄 Tentative sans la colonne content...');
    const { data: recipe2, error: fetchError2 } = await supabase
      .from('recipes')
      .select(`
        id, slug, title, faq, nutrition,
        recipe_translations!inner (
          id, locale, faq
        )
      `)
      .eq('slug', 'roti-epaule-de-porc')
      .eq('recipe_translations.locale', 'en')
      .single();

    if (fetchError2) {
      console.error('❌ Erreur:', fetchError2.message);
    } else {
      console.log('✅ Recette trouvée (sans colonne content)');
      console.log(JSON.stringify(recipe2, null, 2));
      console.log('\n⚠️ La colonne "content" n\'existe pas dans recipe_translations');
      console.log('   Il faut l\'ajouter via Supabase Dashboard ou SQL');
    }
    return;
  }

  console.log('✅ Recette trouvée avec colonne content!');
  console.log('\n📊 Données FR:');
  console.log(`   FAQ: ${recipe.faq ? `${recipe.faq.substring(0, 100)}...` : 'null'}`);
  console.log(`   Nutrition: ${JSON.stringify(recipe.nutrition)}`);

  const translation = (recipe.recipe_translations as unknown[])[0] as { faq: string | null; content: string | null };
  console.log('\n📊 Données EN:');
  console.log(`   FAQ: ${translation?.faq ? `${translation.faq.substring(0, 100)}...` : 'null'}`);
  console.log(`   Content: ${translation?.content ? `${translation.content.substring(0, 100)}...` : 'null'}`);
}

main().catch(console.error);
