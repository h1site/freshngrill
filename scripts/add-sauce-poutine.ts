/**
 * Script d'ajout de la recette "Sauce Poutine Maison « À la Cochon »"
 * Avec traduction anglaise
 *
 * Usage: npx tsx scripts/add-sauce-poutine.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =============================================
// RECETTE FRANÇAISE
// =============================================

const RECIPE_FR = {
  slug: 'sauce-poutine-maison-a-la-cochon',
  title: 'Sauce Poutine Maison « À la Cochon »',
  excerpt: 'Une sauce poutine maison riche et savoureuse, parfaite pour accompagner vos frites et fromage en grains. La vraie sauce brune québécoise!',
  introduction: `<p>La poutine, c'est sacré au Québec! Et une bonne poutine commence par une excellente sauce. Cette recette de sauce poutine maison « À la Cochon » vous donnera une sauce brune riche, onctueuse et parfaitement assaisonnée.</p>
<p>Oubliez les sachets de sauce en poudre - cette version maison est incomparable et prête en quelques minutes seulement.</p>`,
  content: `<p><strong>Astuce « À la cochon »:</strong> Pour une sauce encore plus foncée et intense, laisse le roux cuire légèrement plus longtemps (sans le brûler). La couleur du roux détermine la couleur finale de ta sauce.</p>
<p><strong>Consistance parfaite:</strong> Si la sauce devient trop épaisse, ajoute un peu de bouillon chaud pour l'éclaircir. Elle épaissira encore en refroidissant.</p>
<p><strong>Conservation:</strong> Cette sauce se conserve 4-5 jours au réfrigérateur. Réchauffez à feu doux en ajoutant un peu de bouillon si nécessaire.</p>`,
  conclusion: `<p>Verse cette sauce généreusement sur tes frites et ton fromage en grains pour une poutine digne de ce nom. C'est ça, la vraie affaire!</p>`,
  prep_time: 5,
  cook_time: 15,
  total_time: 20,
  servings: 4,
  servings_unit: 'portions',
  difficulty: 'facile',
  ingredients: [
    {
      title: null,
      items: [
        { quantity: '2', unit: 'c. à soupe', name: 'beurre' },
        { quantity: '1', name: 'gousse d\'ail', note: 'finement hachée' },
        { quantity: '2', unit: 'c. à soupe', name: 'farine' },
        { quantity: '1', name: 'oignon vert', note: 'finement tranché' },
        { quantity: '1', unit: 'tasse', name: 'bouillon de poulet' },
        { quantity: '1', unit: 'tasse', name: 'bouillon de bœuf' },
        { quantity: '1', unit: 'c. à soupe', name: 'ketchup' },
        { quantity: '1', unit: 'c. à thé', name: 'poivre' },
        { quantity: '1', unit: 'c. à thé', name: 'sauce Worcestershire' },
        { name: 'épices à steak de Montréal', note: 'au goût' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Faire fondre le beurre',
      content: 'Dans une casserole, faire fondre le beurre à feu doux.'
    },
    {
      step: 2,
      title: 'Cuire l\'ail',
      content: 'Ajouter l\'ail et cuire doucement 1 à 2 minutes, sans coloration.'
    },
    {
      step: 3,
      title: 'Préparer le roux',
      content: 'Incorporer la farine et bien mélanger pour former un roux. Cuire le roux à feu doux pendant 2 à 3 minutes en remuant constamment.'
    },
    {
      step: 4,
      title: 'Ajouter les bouillons',
      content: 'Ajouter graduellement le bouillon de poulet et le bouillon de bœuf en fouettant pour éviter les grumeaux.'
    },
    {
      step: 5,
      title: 'Épaissir la sauce',
      content: 'Monter à feu moyen et cuire jusqu\'à ce que la sauce épaississe, en remuant régulièrement.'
    },
    {
      step: 6,
      title: 'Assaisonner',
      content: 'Retirer du feu pour éviter que la sauce ne brûle. Ajouter le ketchup, le poivre, la sauce Worcestershire, les épices à steak de Montréal et l\'oignon vert. Bien mélanger et ajuster l\'assaisonnement au goût.'
    }
  ],
  nutrition: {
    calories: 85,
    protein: 2,
    carbs: 6,
    fat: 6,
    sodium: 450
  },
  faq: `<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Comment rendre la sauce plus foncée?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Pour une sauce plus foncée et intense, laissez le roux cuire plus longtemps (sans le brûler). Vous pouvez aussi ajouter une touche de sauce soya ou de colorant caramel.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Peut-on congeler cette sauce poutine?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Oui! La sauce se congèle très bien jusqu'à 3 mois. Décongelez au réfrigérateur et réchauffez à feu doux en ajoutant un peu de bouillon si elle a épaissi.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Que faire si ma sauce est trop épaisse?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Ajoutez simplement un peu de bouillon chaud et fouettez jusqu'à obtenir la consistance désirée. La sauce épaissit en refroidissant, donc préparez-la légèrement plus liquide.</p>
</div></div>
</div>`,
  author: 'Menucochon',
  seo_title: 'Sauce Poutine Maison « À la Cochon » | Recette Québécoise',
  seo_description: 'Recette authentique de sauce poutine maison. Sauce brune riche et savoureuse avec bouillon de poulet et bœuf, épices à steak de Montréal. Prête en 20 minutes!'
};

// =============================================
// TRADUCTION ANGLAISE
// =============================================

const RECIPE_EN = {
  slug_en: 'homemade-poutine-gravy-a-la-cochon',
  title: 'Homemade Poutine Gravy "À la Cochon"',
  excerpt: 'A rich and flavorful homemade poutine gravy, perfect for topping your fries and cheese curds. The real Quebec brown gravy!',
  introduction: `<p>Poutine is sacred in Quebec! And a great poutine starts with an excellent gravy. This homemade poutine gravy recipe "À la Cochon" will give you a rich, smooth, and perfectly seasoned brown gravy.</p>
<p>Forget those powdered gravy packets - this homemade version is incomparable and ready in just a few minutes.</p>`,
  content: `<p><strong>"À la cochon" tip:</strong> For an even darker and more intense gravy, let the roux cook a bit longer (without burning it). The color of the roux determines the final color of your gravy.</p>
<p><strong>Perfect consistency:</strong> If the gravy becomes too thick, add a little hot broth to thin it out. It will thicken more as it cools.</p>
<p><strong>Storage:</strong> This gravy keeps 4-5 days in the refrigerator. Reheat over low heat, adding a little broth if needed.</p>`,
  conclusion: `<p>Pour this gravy generously over your fries and cheese curds for a poutine worthy of the name. That's the real deal!</p>`,
  ingredients: [
    {
      title: null,
      items: [
        { quantity: '2', unit: 'tablespoons', name: 'butter' },
        { quantity: '1', name: 'garlic clove', note: 'finely minced' },
        { quantity: '2', unit: 'tablespoons', name: 'flour' },
        { quantity: '1', name: 'green onion', note: 'thinly sliced' },
        { quantity: '1', unit: 'cup', name: 'chicken broth' },
        { quantity: '1', unit: 'cup', name: 'beef broth' },
        { quantity: '1', unit: 'tablespoon', name: 'ketchup' },
        { quantity: '1', unit: 'teaspoon', name: 'pepper' },
        { quantity: '1', unit: 'teaspoon', name: 'Worcestershire sauce' },
        { name: 'Montreal steak spice', note: 'to taste' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Melt the butter',
      content: 'In a saucepan, melt the butter over low heat.'
    },
    {
      step: 2,
      title: 'Cook the garlic',
      content: 'Add the garlic and cook gently for 1 to 2 minutes, without browning.'
    },
    {
      step: 3,
      title: 'Make the roux',
      content: 'Stir in the flour and mix well to form a roux. Cook the roux over low heat for 2 to 3 minutes, stirring constantly.'
    },
    {
      step: 4,
      title: 'Add the broths',
      content: 'Gradually add the chicken broth and beef broth while whisking to prevent lumps.'
    },
    {
      step: 5,
      title: 'Thicken the gravy',
      content: 'Increase to medium heat and cook until the gravy thickens, stirring regularly.'
    },
    {
      step: 6,
      title: 'Season',
      content: 'Remove from heat to prevent the gravy from burning. Add the ketchup, pepper, Worcestershire sauce, Montreal steak spice, and green onion. Mix well and adjust seasoning to taste.'
    }
  ],
  faq: `<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">How do I make the gravy darker?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">For a darker and more intense gravy, let the roux cook longer (without burning it). You can also add a touch of soy sauce or caramel coloring.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Can I freeze this poutine gravy?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Yes! The gravy freezes very well for up to 3 months. Thaw in the refrigerator and reheat over low heat, adding a little broth if it has thickened.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">What if my gravy is too thick?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Simply add a little hot broth and whisk until you reach the desired consistency. The gravy thickens as it cools, so make it slightly thinner than you want.</p>
</div></div>
</div>`,
  seo_title: 'Homemade Poutine Gravy "À la Cochon" | Quebec Recipe',
  seo_description: 'Authentic homemade poutine gravy recipe. Rich and flavorful brown gravy with chicken and beef broth, Montreal steak spice. Ready in 20 minutes!'
};

// =============================================
// CATÉGORIES À ASSOCIER
// =============================================

const CATEGORY_SLUGS = ['sauces', 'accompagnements'];

async function main() {
  console.log('🍟 Ajout de la recette "Sauce Poutine Maison « À la Cochon »"...\n');

  // 1. Vérifier si la recette existe déjà
  const { data: existingRecipe } = await supabase
    .from('recipes')
    .select('id, slug')
    .eq('slug', RECIPE_FR.slug)
    .single();

  if (existingRecipe) {
    console.log(`⚠️ La recette existe déjà (ID: ${existingRecipe.id}). Mise à jour...`);
  }

  // 2. Insérer ou mettre à jour la recette française
  console.log('📝 Insertion de la recette française...');
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .upsert({
      slug: RECIPE_FR.slug,
      title: RECIPE_FR.title,
      excerpt: RECIPE_FR.excerpt,
      introduction: RECIPE_FR.introduction,
      content: RECIPE_FR.content,
      conclusion: RECIPE_FR.conclusion,
      prep_time: RECIPE_FR.prep_time,
      cook_time: RECIPE_FR.cook_time,
      total_time: RECIPE_FR.total_time,
      servings: RECIPE_FR.servings,
      servings_unit: RECIPE_FR.servings_unit,
      difficulty: RECIPE_FR.difficulty,
      ingredients: RECIPE_FR.ingredients,
      instructions: RECIPE_FR.instructions,
      nutrition: RECIPE_FR.nutrition,
      faq: RECIPE_FR.faq,
      author: RECIPE_FR.author,
      seo_title: RECIPE_FR.seo_title,
      seo_description: RECIPE_FR.seo_description,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes: 0,
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (recipeError) {
    console.error('❌ Erreur insertion recette:', recipeError.message);
    process.exit(1);
  }

  console.log(`✅ Recette insérée/mise à jour (ID: ${recipe.id})`);

  // 3. Associer les catégories
  console.log('\n📁 Association des catégories...');

  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, name')
    .in('slug', CATEGORY_SLUGS);

  if (categories && categories.length > 0) {
    await supabase.from('recipe_categories').delete().eq('recipe_id', recipe.id);

    const categoryLinks = categories.map((cat: { id: number }) => ({
      recipe_id: recipe.id,
      category_id: cat.id,
    }));

    const { error: catError } = await supabase
      .from('recipe_categories')
      .insert(categoryLinks);

    if (catError) {
      console.warn('⚠️ Erreur association catégories:', catError.message);
    } else {
      console.log(`✅ Catégories associées: ${categories.map((c: { name: string }) => c.name).join(', ')}`);
    }
  } else {
    console.log('⚠️ Catégories non trouvées');
  }

  // 4. Ajouter la traduction anglaise
  console.log('\n🌐 Ajout de la traduction anglaise...');

  const { error: translationError } = await supabase
    .from('recipe_translations')
    .upsert({
      recipe_id: recipe.id,
      locale: 'en',
      slug_en: RECIPE_EN.slug_en,
      title: RECIPE_EN.title,
      excerpt: RECIPE_EN.excerpt,
      introduction: RECIPE_EN.introduction,
      content: RECIPE_EN.content,
      conclusion: RECIPE_EN.conclusion,
      ingredients: RECIPE_EN.ingredients,
      instructions: RECIPE_EN.instructions,
      faq: RECIPE_EN.faq,
      seo_title: RECIPE_EN.seo_title,
      seo_description: RECIPE_EN.seo_description,
    }, {
      onConflict: 'recipe_id,locale'
    });

  if (translationError) {
    console.error('❌ Erreur traduction:', translationError.message);
  } else {
    console.log('✅ Traduction anglaise ajoutée');
  }

  // 5. Vérification finale
  console.log('\n🔍 Vérification finale...');

  const { data: finalRecipe } = await supabase
    .from('recipes_with_categories')
    .select('*')
    .eq('id', recipe.id)
    .single();

  const { data: finalTranslation } = await supabase
    .from('recipe_translations')
    .select('*')
    .eq('recipe_id', recipe.id)
    .eq('locale', 'en')
    .single();

  console.log('\n📊 Résultat:');
  console.log(`   ID: ${recipe.id}`);
  console.log(`   Slug FR: ${finalRecipe?.slug || '❌'}`);
  console.log(`   Slug EN: ${finalTranslation?.slug_en || '❌'}`);
  console.log(`   Titre FR: ${finalRecipe?.title || '❌'}`);
  console.log(`   Titre EN: ${finalTranslation?.title || '❌'}`);
  console.log(`   Catégories: ${finalRecipe?.categories?.map((c: { name: string }) => c.name).join(', ') || 'Aucune'}`);
  console.log(`   Ingrédients: ${finalRecipe?.ingredients?.[0]?.items?.length || 0} items`);
  console.log(`   Instructions: ${finalRecipe?.instructions?.length || 0} étapes`);

  console.log('\n✨ Terminé!');
  console.log(`   FR: https://menucochon.com/recette/${RECIPE_FR.slug}/`);
  console.log(`   EN: https://menucochon.com/en/recipe/${RECIPE_EN.slug_en}/`);
}

main().catch(console.error);
