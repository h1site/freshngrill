import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const OLD_SLUG = 'crepe-allemande-pfannkuchen';
const NEW_SLUG = 'crepe-soufflee-dutch-baby';
const NEW_SLUG_EN = 'dutch-baby-pancake';
const TODAY = new Date().toISOString();

// Nouveau titre FR
const NEW_TITLE_FR = 'Crêpe soufflée (Dutch Baby Pancake)';

// Nouveau excerpt FR - optimisé SEO
const NEW_EXCERPT_FR = 'Découvrez la crêpe soufflée, aussi connue sous le nom de Dutch Baby Pancake. Cette crêpe soufflée au four est spectaculaire et délicieuse. Recette facile de crêpe soufflée pour un brunch parfait!';

// Nouvelle introduction FR - optimisée SEO
const NEW_INTRODUCTION_FR = `<p>La <strong>crêpe soufflée</strong>, connue internationalement sous le nom de <strong>Dutch Baby Pancake</strong>, est une merveille culinaire qui gonfle spectaculairement au four pour créer une présentation impressionnante. Cette <strong>crêpe soufflée</strong> est originaire des États-Unis mais inspirée des pfannkuchen allemandes.</p>
<p>Notre recette de <strong>crêpe soufflée</strong> est simple à réaliser mais produit des résultats dignes d'un restaurant. Le <strong>Dutch Baby Pancake</strong> est parfait pour un brunch spécial ou un petit-déjeuner gourmand du weekend. La magie de cette <strong>crêpe soufflée</strong> réside dans la réaction de la pâte avec le beurre chaud dans le poêlon.</p>`;

// Nouvelle conclusion FR
const NEW_CONCLUSION_FR = `<p>Cette <strong>crêpe soufflée</strong> (<strong>Dutch Baby Pancake</strong>) deviendra rapidement un favori de votre famille. Servez votre <strong>crêpe soufflée</strong> immédiatement à la sortie du four pour profiter de son aspect gonflé spectaculaire. La <strong>crêpe soufflée</strong> se dégonfle naturellement après quelques minutes, mais reste tout aussi délicieuse!</p>
<p>Accompagnez votre <strong>Dutch Baby Pancake</strong> de sirop d'érable, de fruits frais, ou d'un nuage de crème fouettée. Cette <strong>crêpe soufflée</strong> est également délicieuse avec un filet de citron et du sucre à glacer.</p>`;

// Nouveau contenu/astuces FR
const NEW_CONTENT_FR = `<p><strong>Le secret d'une crêpe soufflée réussie:</strong> La clé pour obtenir une crêpe soufflée parfaitement gonflée est de préchauffer le poêlon avec le beurre au four. Le choc thermique entre la pâte froide et le beurre bouillant crée cette levée spectaculaire.</p>
<p><strong>Astuce pro pour votre Dutch Baby Pancake:</strong> Utilisez des ingrédients à température ambiante (sauf le poêlon!) pour une crêpe soufflée plus uniforme. Mélangez la pâte au blender pour une texture ultra-lisse.</p>
<p><strong>Variations de crêpe soufflée:</strong> Ajoutez de la vanille, de la cannelle, ou du zeste de citron à votre Dutch Baby Pancake pour varier les saveurs.</p>`;

// FAQ FR avec Schema.org
const FAQ_FR = `<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Pourquoi ma crêpe soufflée ne gonfle pas?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Pour une crêpe soufflée bien gonflée, assurez-vous que le four et le poêlon sont très chauds (220°C/425°F). Le beurre doit grésiller quand vous versez la pâte. Une crêpe soufflée qui ne gonfle pas peut aussi indiquer un four pas assez chaud ou un poêlon trop froid.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Quelle est la différence entre une crêpe soufflée et un Dutch Baby Pancake?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">La crêpe soufflée et le Dutch Baby Pancake sont exactement la même chose! Le Dutch Baby Pancake est simplement le nom américain de la crêpe soufflée, inspirée des pfannkuchen allemandes mais créée aux États-Unis au début du 20e siècle.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Peut-on préparer la pâte de crêpe soufflée à l'avance?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Oui, vous pouvez préparer la pâte de crêpe soufflée la veille et la conserver au réfrigérateur. Sortez-la 30 minutes avant la cuisson pour qu'elle revienne à température ambiante. Le Dutch Baby Pancake sera tout aussi spectaculaire!</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Pourquoi ma crêpe soufflée se dégonfle rapidement?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">C'est normal! Une crêpe soufflée (Dutch Baby Pancake) se dégonfle naturellement en quelques minutes après la sortie du four à cause du changement de température. Servez-la immédiatement pour impressionner vos convives avec son aspect gonflé spectaculaire.</p>
</div></div>
</div>`;

// SEO FR
const SEO_TITLE_FR = 'Crêpe soufflée (Dutch Baby Pancake) - Recette facile | Menucochon';
const SEO_DESCRIPTION_FR = 'Recette de crêpe soufflée facile et spectaculaire! Découvrez comment faire un Dutch Baby Pancake parfait. Cette crêpe soufflée au four impressionnera tous vos invités.';

// ===== ENGLISH VERSION =====

const NEW_TITLE_EN = 'Dutch Baby Pancake (Puffy Oven Pancake)';

const NEW_EXCERPT_EN = 'Learn how to make the perfect Dutch Baby Pancake! This spectacular puffy oven pancake is easy to make and impressive to serve. The ultimate Dutch Baby Pancake recipe for a special brunch!';

const NEW_INTRODUCTION_EN = `<p>The <strong>Dutch Baby Pancake</strong>, also called a puffy oven pancake or German pancake, is a spectacular breakfast treat that puffs up dramatically in the oven. This <strong>Dutch Baby Pancake</strong> recipe creates a showstopping centerpiece for any brunch.</p>
<p>Our <strong>Dutch Baby Pancake</strong> is simple to make but delivers restaurant-worthy results. The magic of this <strong>Dutch Baby Pancake</strong> lies in the reaction between the batter and the sizzling butter in a hot skillet. Watch your <strong>Dutch Baby Pancake</strong> rise and marvel at the crispy edges and custardy center!</p>`;

const NEW_CONCLUSION_EN = `<p>This <strong>Dutch Baby Pancake</strong> will quickly become a family favorite! Serve your <strong>Dutch Baby Pancake</strong> immediately out of the oven to showcase its impressive puff. The <strong>Dutch Baby Pancake</strong> naturally deflates after a few minutes but remains just as delicious!</p>
<p>Top your <strong>Dutch Baby Pancake</strong> with maple syrup, fresh berries, or a dusting of powdered sugar. This puffy oven pancake is also amazing with a squeeze of lemon and a sprinkle of sugar.</p>`;

const NEW_CONTENT_EN = `<p><strong>The secret to a perfect Dutch Baby Pancake:</strong> The key to achieving a perfectly puffed Dutch Baby Pancake is preheating your skillet with butter in the oven. The thermal shock between the cold batter and sizzling butter creates that spectacular rise.</p>
<p><strong>Pro tip for your Dutch Baby Pancake:</strong> Use room temperature eggs for the best Dutch Baby Pancake results. Blend the batter for an ultra-smooth texture that puffs beautifully.</p>
<p><strong>Dutch Baby Pancake variations:</strong> Add vanilla extract, cinnamon, or lemon zest to customize your Dutch Baby Pancake. Some love topping their Dutch Baby Pancake with fresh fruit before baking!</p>`;

const FAQ_EN = `<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Why won't my Dutch Baby Pancake puff up?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">For a well-puffed Dutch Baby Pancake, make sure your oven and skillet are very hot (425°F/220°C). The butter should sizzle when you pour in the batter. A Dutch Baby Pancake that doesn't puff may indicate an oven that's not hot enough or a cold skillet.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">What's the difference between a Dutch Baby Pancake and a German Pancake?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Dutch Baby Pancake and German Pancake are essentially the same thing! The Dutch Baby Pancake was actually created in the United States in the early 1900s, inspired by German pfannkuchen but adapted with American techniques and ingredients.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Can I make Dutch Baby Pancake batter ahead of time?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Yes! You can prepare your Dutch Baby Pancake batter the night before and refrigerate it. Take it out 30 minutes before baking to come to room temperature. Your Dutch Baby Pancake will puff up just as spectacularly!</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Why does my Dutch Baby Pancake deflate so quickly?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">This is completely normal! A Dutch Baby Pancake naturally deflates within a few minutes after coming out of the oven due to the temperature change. Serve your Dutch Baby Pancake immediately to impress your guests with its spectacular puffed appearance.</p>
</div></div>
</div>`;

const SEO_TITLE_EN = 'Dutch Baby Pancake - Easy Recipe for Puffy Oven Pancake | Menucochon';
const SEO_DESCRIPTION_EN = 'Perfect Dutch Baby Pancake recipe! Learn how to make this spectacular puffy oven pancake. Our easy Dutch Baby Pancake will impress everyone at your brunch table.';

async function main() {
  console.log('🥞 Mise à jour de la recette "Crêpe soufflée (Dutch Baby Pancake)"...\n');

  // 1. Récupérer la recette actuelle
  const { data: recipe, error: fetchError } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', OLD_SLUG)
    .single();

  if (fetchError || !recipe) {
    console.error('❌ Recette non trouvée avec le slug:', OLD_SLUG);
    console.error('   Erreur:', fetchError?.message);
    process.exit(1);
  }

  console.log(`✅ Recette trouvée: ${recipe.title} (ID: ${recipe.id})`);
  console.log(`   Slug actuel: ${recipe.slug}`);
  console.log(`   Date publication: ${recipe.published_at}\n`);

  // 2. Mettre à jour la recette FR
  console.log('📝 Mise à jour FR...');
  const { error: updateFrError } = await supabase
    .from('recipes')
    .update({
      slug: NEW_SLUG,
      title: NEW_TITLE_FR,
      excerpt: NEW_EXCERPT_FR,
      introduction: NEW_INTRODUCTION_FR,
      conclusion: NEW_CONCLUSION_FR,
      content: NEW_CONTENT_FR,
      faq: FAQ_FR,
      seo_title: SEO_TITLE_FR,
      seo_description: SEO_DESCRIPTION_FR,
      published_at: TODAY,
      updated_at: TODAY
    })
    .eq('id', recipe.id);

  if (updateFrError) {
    console.error('❌ Erreur mise à jour FR:', updateFrError.message);
    process.exit(1);
  }
  console.log('✅ Recette FR mise à jour avec succès');

  // 3. Vérifier/mettre à jour la traduction EN
  console.log('\n📝 Mise à jour EN...');
  const { data: translation, error: translationError } = await supabase
    .from('recipe_translations')
    .select('*')
    .eq('recipe_id', recipe.id)
    .eq('locale', 'en')
    .single();

  if (translationError || !translation) {
    console.log('   Traduction EN non trouvée, création...');
    const { error: createError } = await supabase
      .from('recipe_translations')
      .insert({
        recipe_id: recipe.id,
        locale: 'en',
        slug_en: NEW_SLUG_EN,
        title: NEW_TITLE_EN,
        excerpt: NEW_EXCERPT_EN,
        introduction: NEW_INTRODUCTION_EN,
        conclusion: NEW_CONCLUSION_EN,
        content: NEW_CONTENT_EN,
        faq: FAQ_EN,
        seo_title: SEO_TITLE_EN,
        seo_description: SEO_DESCRIPTION_EN,
        translated_at: TODAY
      });

    if (createError) {
      console.error('❌ Erreur création traduction EN:', createError.message);
    } else {
      console.log('✅ Traduction EN créée avec succès');
    }
  } else {
    console.log(`   Traduction EN trouvée (ID: ${translation.id}), mise à jour...`);
    const { error: updateEnError } = await supabase
      .from('recipe_translations')
      .update({
        slug_en: NEW_SLUG_EN,
        title: NEW_TITLE_EN,
        excerpt: NEW_EXCERPT_EN,
        introduction: NEW_INTRODUCTION_EN,
        conclusion: NEW_CONCLUSION_EN,
        content: NEW_CONTENT_EN,
        faq: FAQ_EN,
        seo_title: SEO_TITLE_EN,
        seo_description: SEO_DESCRIPTION_EN,
        translated_at: TODAY
      })
      .eq('id', translation.id);

    if (updateEnError) {
      console.error('❌ Erreur mise à jour EN:', updateEnError.message);
    } else {
      console.log('✅ Traduction EN mise à jour avec succès');
    }
  }

  // 4. Vérification finale
  console.log('\n🔍 Vérification finale...');
  const { data: finalRecipe } = await supabase
    .from('recipes')
    .select('slug, title, published_at')
    .eq('id', recipe.id)
    .single();

  const { data: finalTranslation } = await supabase
    .from('recipe_translations')
    .select('slug_en, title')
    .eq('recipe_id', recipe.id)
    .eq('locale', 'en')
    .single();

  console.log('\n📊 Résultat:');
  console.log(`   FR - Titre: ${finalRecipe?.title}`);
  console.log(`   FR - Slug: ${finalRecipe?.slug}`);
  console.log(`   FR - Date: ${finalRecipe?.published_at}`);
  console.log(`   EN - Titre: ${finalTranslation?.title}`);
  console.log(`   EN - Slug: ${finalTranslation?.slug_en}`);

  console.log('\n✨ Terminé!');
  console.log('\n⚠️  N\'oubliez pas d\'ajouter la redirection 301 dans next.config.ts:');
  console.log(`   { source: '/recette/${OLD_SLUG}/', destination: '/recette/${NEW_SLUG}/', permanent: true },`);
  console.log(`   { source: '/en/recipe/german-pancake-pfannkuchen/', destination: '/en/recipe/${NEW_SLUG_EN}/', permanent: true },`);
  console.log('\n🔗 Nouvelles URLs:');
  console.log(`   FR: https://menucochon.com/recette/${NEW_SLUG}/`);
  console.log(`   EN: https://menucochon.com/en/recipe/${NEW_SLUG_EN}/`);
}

main().catch(console.error);
