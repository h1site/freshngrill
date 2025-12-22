import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const RECIPE_SLUG = 'roti-epaule-de-porc';

// FAQ FR avec Schema.org markup
const FAQ_FR = `<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Comment savoir si le rôti d'épaule de porc est cuit?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">La température interne doit atteindre 85°C (185°F) pour une viande effilochée parfaite. Utilisez un thermomètre à viande pour vérifier. La viande doit se défaire facilement à la fourchette.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Peut-on congeler le rôti d'épaule de porc?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Oui! Le rôti se congèle très bien jusqu'à 3 mois. Emballez-le hermétiquement dans un contenant ou sac de congélation et décongelez au réfrigérateur pendant 24 heures avant de réchauffer.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Quels accompagnements servir avec le rôti d'épaule de porc?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Purée de pommes de terre, légumes rôtis (carottes, navets, panais), salade de chou crémeuse ou pain croûté pour absorber le délicieux jus de cuisson.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Comment réchauffer les restes de rôti d'épaule?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Au four à 150°C (300°F) pendant 20-30 minutes recouvert de papier d'aluminium, ou à la poêle avec un peu de bouillon pour garder la viande juteuse. Évitez le micro-ondes qui assèche la viande.</p>
</div></div>
</div>`;

// Nutrition par portion (6 portions)
const NUTRITION = {
  calories: 450,
  protein: 35,
  fat: 28,
  carbs: 8,
  fiber: 1
};

// Content EN (astuces traduites)
const CONTENT_EN = `<p><strong>Why pork shoulder for slow roasting:</strong> Pork shoulder is ideal for slow cooking because its fat melts gradually, making the meat extremely tender and flavorful. The connective tissue breaks down over the long cooking time, resulting in meat that practically falls apart.</p>
<p><strong>Pro tip:</strong> Let the roast rest at room temperature for 30 minutes before cooking for more even results. After cooking, tent with foil and rest for at least 15 minutes before slicing or pulling.</p>
<p><strong>For crispy skin:</strong> If you want crispy crackling, uncover the roast for the last 30-45 minutes and increase oven temperature to 425°F (220°C).</p>`;

// FAQ EN avec Schema.org markup
const FAQ_EN = `<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">How do I know when the pork shoulder roast is done?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">The internal temperature should reach 185°F (85°C) for perfect pulled pork. Use a meat thermometer to check. The meat should easily shred with a fork when done.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Can I freeze pork shoulder roast?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Yes! The roast freezes very well for up to 3 months. Wrap it tightly in a freezer-safe container or bag and thaw in the refrigerator for 24 hours before reheating.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">What sides go well with pork shoulder roast?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Mashed potatoes, roasted root vegetables (carrots, turnips, parsnips), creamy coleslaw, or crusty bread to soak up the delicious cooking juices.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">How to reheat leftover pork shoulder?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">In the oven at 300°F (150°C) for 20-30 minutes covered with foil, or in a skillet with a splash of broth to keep the meat juicy. Avoid the microwave as it tends to dry out the meat.</p>
</div></div>
</div>`;

async function main() {
  console.log('🍖 Mise à jour de la recette "Rôti d\'épaule de porc"...\n');

  // 1. Récupérer la recette
  const { data: recipe, error: fetchError } = await supabase
    .from('recipes')
    .select('id, slug, title, faq, nutrition')
    .eq('slug', RECIPE_SLUG)
    .single();

  if (fetchError || !recipe) {
    console.error('❌ Recette non trouvée:', fetchError?.message);
    process.exit(1);
  }

  console.log(`✅ Recette trouvée: ${recipe.title} (ID: ${recipe.id})`);
  console.log(`   FAQ actuelle: ${recipe.faq ? 'Oui' : 'Non'}`);
  console.log(`   Nutrition actuelle: ${recipe.nutrition ? 'Oui' : 'Non'}\n`);

  // 2. Mettre à jour la recette FR
  console.log('📝 Mise à jour FR (FAQ + nutrition)...');
  const { error: updateFrError } = await supabase
    .from('recipes')
    .update({
      faq: FAQ_FR,
      nutrition: NUTRITION
    })
    .eq('id', recipe.id);

  if (updateFrError) {
    console.error('❌ Erreur mise à jour FR:', updateFrError.message);
  } else {
    console.log('✅ FAQ et nutrition FR ajoutées');
  }

  // 3. Vérifier si la traduction EN existe
  const { data: translation, error: translationError } = await supabase
    .from('recipe_translations')
    .select('id, faq, content')
    .eq('recipe_id', recipe.id)
    .eq('locale', 'en')
    .single();

  if (translationError || !translation) {
    console.error('❌ Traduction EN non trouvée:', translationError?.message);
    console.log('   La traduction EN doit exister pour être mise à jour.');
    process.exit(1);
  }

  console.log(`\n✅ Traduction EN trouvée (ID: ${translation.id})`);
  console.log(`   FAQ EN actuelle: ${translation.faq ? 'Oui' : 'Non'}`);
  console.log(`   Content EN actuel: ${translation.content ? 'Oui' : 'Non'}`);

  // 4. Mettre à jour la traduction EN
  console.log('\n📝 Mise à jour EN (FAQ + content)...');
  const { error: updateEnError } = await supabase
    .from('recipe_translations')
    .update({
      faq: FAQ_EN,
      content: CONTENT_EN
    })
    .eq('id', translation.id);

  if (updateEnError) {
    console.error('❌ Erreur mise à jour EN:', updateEnError.message);
  } else {
    console.log('✅ FAQ et content EN ajoutés');
  }

  // 5. Vérification finale
  console.log('\n🔍 Vérification finale...');
  const { data: finalRecipe } = await supabase
    .from('recipes')
    .select('faq, nutrition')
    .eq('id', recipe.id)
    .single();

  const { data: finalTranslation } = await supabase
    .from('recipe_translations')
    .select('faq, content')
    .eq('recipe_id', recipe.id)
    .eq('locale', 'en')
    .single();

  console.log('\n📊 Résultat:');
  console.log(`   FR - FAQ: ${finalRecipe?.faq ? '✅' : '❌'}`);
  console.log(`   FR - Nutrition: ${finalRecipe?.nutrition ? '✅' : '❌'}`);
  console.log(`   EN - FAQ: ${finalTranslation?.faq ? '✅' : '❌'}`);
  console.log(`   EN - Content: ${finalTranslation?.content ? '✅' : '❌'}`);

  console.log('\n✨ Terminé!');
  console.log('   FR: https://menucochon.com/recette/roti-epaule-de-porc/');
  console.log('   EN: https://menucochon.com/en/recipe/pork-shoulder-roast/');
}

main().catch(console.error);
