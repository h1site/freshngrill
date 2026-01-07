/**
 * Script d'ajout de la recette "Soupe à l'orge et au bacon à la mijoteuse"
 * Avec traduction anglaise
 *
 * Usage: npx tsx scripts/add-barley-bacon-soup.ts
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
  slug: 'soupe-orge-bacon-mijoteuse',
  title: 'Soupe à l\'orge et au bacon à la mijoteuse',
  excerpt: 'Une soupe réconfortante à l\'orge et au bacon, préparée à la mijoteuse pour des saveurs riches et profondes. Parfaite pour les journées froides.',
  introduction: `<p>Cette soupe à l'orge et au bacon est le repas réconfortant par excellence pour les journées d'hiver. La mijoteuse fait tout le travail pendant que les saveurs se développent lentement. L'orge perlé gonfle et devient tendre, absorbant les arômes du bacon croustillant et des herbes aromatiques.</p>
<p>Accompagnée d'un bon pain croûté, cette soupe constitue un repas complet et nourrissant pour toute la famille.</p>`,
  content: `<p><strong>Le secret d'une bonne soupe à l'orge:</strong> L'orge perlé est la clé de cette recette. Il devient crémeux tout en gardant une légère texture qui ajoute du corps à la soupe. Brassez régulièrement pour éviter qu'il ne colle au fond.</p>
<p><strong>Astuce bacon:</strong> Cuire le bacon avec un peu d'eau au fond de la poêle permet d'obtenir un bacon parfaitement croustillant sans éclaboussures. L'eau s'évapore pendant que le gras fond lentement.</p>
<p><strong>Conservation:</strong> Cette soupe se conserve 4-5 jours au réfrigérateur et se congèle très bien jusqu'à 3 mois. L'orge épaissira la soupe au repos - ajoutez un peu de bouillon lors du réchauffage.</p>`,
  conclusion: `<p>Cette soupe réconfortante est parfaite pour les repas de semaine. Préparez-la le matin et rentrez à une maison qui sent divinement bon!</p>`,
  prep_time: 20,
  cook_time: 360, // 6 heures
  total_time: 380,
  servings: 8,
  servings_unit: 'portions',
  difficulty: 'facile',
  ingredients: [
    {
      title: null,
      items: [
        { quantity: '1', unit: 'paquet', name: 'bacon' },
        { quantity: '2', unit: 'boîtes', name: 'tomates en dés aux herbes et épices' },
        { quantity: '900', unit: 'ml', name: 'bouillon de boeuf et poulet' },
        { quantity: '540', unit: 'ml', name: 'pois chiches', note: 'rincés et égouttés' },
        { quantity: '540', unit: 'ml', name: 'maïs', note: 'égoutté' },
        { quantity: '1', unit: 'tasse', name: 'orge perlé' },
        { quantity: '1', unit: 'c. à soupe', name: 'ail émincé' },
        { quantity: '1', unit: 'c. à soupe', name: 'persil séché' },
        { quantity: '1', unit: 'c. à soupe', name: 'basilic séché' },
        { name: 'sel et poivre', note: 'au goût' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Cuire le bacon',
      content: 'Couper le bacon en petits morceaux. Dans une poêle avec un peu d\'eau au fond, cuire le bacon jusqu\'à ce qu\'il soit croustillant. Égoutter sur du papier absorbant.'
    },
    {
      step: 2,
      title: 'Assembler la soupe',
      content: 'Ajouter tous les ingrédients dans la mijoteuse: le bacon croustillant, les tomates en dés, le bouillon, les pois chiches, le maïs, l\'orge, l\'ail, le persil, le basilic, le sel et le poivre. Bien mélanger.'
    },
    {
      step: 3,
      title: 'Cuisson lente',
      content: 'Régler la mijoteuse à température moyenne (medium) et cuire pendant 6 heures. Brasser toutes les heures pour éviter que l\'orge ne colle.'
    },
    {
      step: 4,
      title: 'Terminer la cuisson',
      content: 'Une fois que l\'orge a gonflé et est devenu tendre, réduire la température de la mijoteuse à basse (low) pour garder au chaud jusqu\'au service. Ajuster l\'assaisonnement si nécessaire.'
    }
  ],
  nutrition: {
    calories: 320,
    protein: 14,
    carbs: 38,
    fat: 12,
    fiber: 7
  },
  faq: `<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Peut-on faire cette soupe sans bacon?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Absolument! Cette soupe est également délicieuse sans bacon si vous n'êtes pas amateur. Vous pouvez aussi ajouter un peu d'huile d'olive pour la richesse.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Comment rendre cette soupe végétarienne?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Omettez simplement le bacon et remplacez le bouillon de boeuf et poulet par du bouillon de légumes. Vous obtiendrez une soupe tout aussi savoureuse et nourrissante.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Pourquoi brasser la soupe toutes les heures?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">L'orge a tendance à coller au fond de la mijoteuse et à absorber beaucoup de liquide. Brasser régulièrement assure une cuisson uniforme et empêche l'orge de brûler.</p>
</div></div>
</div>`,
  author: 'Menucochon',
  seo_title: 'Soupe à l\'orge et au bacon à la mijoteuse | Recette réconfortante',
  seo_description: 'Recette facile de soupe à l\'orge et au bacon à la mijoteuse. Pois chiches, maïs, herbes et bacon croustillant pour une soupe réconfortante parfaite en hiver.'
};

// =============================================
// TRADUCTION ANGLAISE
// =============================================

const RECIPE_EN = {
  slug_en: 'slow-cooker-barley-bacon-soup',
  title: 'Slow Cooker Barley and Bacon Soup',
  excerpt: 'A comforting barley and bacon soup, prepared in the slow cooker for rich and deep flavors. Perfect for cold days.',
  introduction: `<p>This barley and bacon soup is the ultimate comfort food for winter days. The slow cooker does all the work while the flavors develop slowly. Pearl barley swells and becomes tender, absorbing the aromas of crispy bacon and aromatic herbs.</p>
<p>Served with crusty bread, this soup makes a complete and nourishing meal for the whole family.</p>`,
  content: `<p><strong>The secret to great barley soup:</strong> Pearl barley is the key to this recipe. It becomes creamy while maintaining a slight texture that adds body to the soup. Stir regularly to prevent it from sticking to the bottom.</p>
<p><strong>Bacon tip:</strong> Cooking bacon with a little water in the bottom of the pan produces perfectly crispy bacon without splattering. The water evaporates while the fat slowly renders.</p>
<p><strong>Storage:</strong> This soup keeps 4-5 days in the refrigerator and freezes very well for up to 3 months. The barley will thicken the soup as it sits - add a little broth when reheating.</p>`,
  conclusion: `<p>This comforting soup is perfect for weeknight meals. Start it in the morning and come home to a house that smells amazing!</p>`,
  ingredients: [
    {
      title: null,
      items: [
        { quantity: '1', unit: 'package', name: 'bacon' },
        { quantity: '2', unit: 'cans', name: 'diced tomatoes with herbs and spices' },
        { quantity: '900', unit: 'ml', name: 'beef and chicken broth' },
        { quantity: '540', unit: 'ml', name: 'chickpeas', note: 'rinsed and drained' },
        { quantity: '540', unit: 'ml', name: 'corn', note: 'drained' },
        { quantity: '1', unit: 'cup', name: 'pearl barley' },
        { quantity: '1', unit: 'tablespoon', name: 'minced garlic' },
        { quantity: '1', unit: 'tablespoon', name: 'dried parsley' },
        { quantity: '1', unit: 'tablespoon', name: 'dried basil' },
        { name: 'salt and pepper', note: 'to taste' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Cook the bacon',
      content: 'Cut the bacon into small pieces. In a skillet with a little water at the bottom, cook the bacon until crispy. Drain on paper towels.'
    },
    {
      step: 2,
      title: 'Assemble the soup',
      content: 'Add all ingredients to the slow cooker: crispy bacon, diced tomatoes, broth, chickpeas, corn, barley, garlic, parsley, basil, salt and pepper. Mix well.'
    },
    {
      step: 3,
      title: 'Slow cook',
      content: 'Set the slow cooker to medium heat and cook for 6 hours. Stir every hour to prevent the barley from sticking.'
    },
    {
      step: 4,
      title: 'Finish cooking',
      content: 'Once the barley has swelled and softened, reduce the slow cooker temperature to low to keep warm until serving. Adjust seasoning if needed.'
    }
  ],
  faq: `<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Can I make this soup without bacon?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Absolutely! This soup is also delicious without bacon if you're not a fan. You can add a little olive oil for richness.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">How do I make this soup vegetarian?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Simply omit the bacon and replace the beef and chicken broth with vegetable broth. You'll get an equally tasty and nourishing soup.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Why stir the soup every hour?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Barley tends to stick to the bottom of the slow cooker and absorbs a lot of liquid. Stirring regularly ensures even cooking and prevents the barley from burning.</p>
</div></div>
</div>`,
  seo_title: 'Slow Cooker Barley and Bacon Soup | Comforting Recipe',
  seo_description: 'Easy slow cooker barley and bacon soup recipe. Chickpeas, corn, herbs and crispy bacon for a comforting soup perfect for winter.'
};

// =============================================
// CATÉGORIES À ASSOCIER
// =============================================

const CATEGORY_SLUGS = ['soupes', 'mijoteuse'];

async function main() {
  console.log('🍲 Ajout de la recette "Soupe à l\'orge et au bacon à la mijoteuse"...\n');

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

  // Récupérer les IDs des catégories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, name')
    .in('slug', CATEGORY_SLUGS);

  if (categories && categories.length > 0) {
    // Supprimer les anciennes associations
    await supabase.from('recipe_categories').delete().eq('recipe_id', recipe.id);

    // Créer les nouvelles associations
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
    console.log('⚠️ Catégories non trouvées, assurez-vous que "soupes" et "mijoteuse" existent');
  }

  // 4. Ajouter la traduction anglaise
  console.log('\n🌐 Ajout de la traduction anglaise...');

  const { data: existingTranslation } = await supabase
    .from('recipe_translations')
    .select('id')
    .eq('recipe_id', recipe.id)
    .eq('locale', 'en')
    .single();

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
  console.log(`   Catégories: ${finalRecipe?.categories?.map((c: { name: string }) => c.name).join(', ') || '❌'}`);
  console.log(`   Ingrédients: ${finalRecipe?.ingredients?.[0]?.items?.length || 0} items`);
  console.log(`   Instructions: ${finalRecipe?.instructions?.length || 0} étapes`);
  console.log(`   FAQ FR: ${finalRecipe?.faq ? '✅' : '❌'}`);
  console.log(`   FAQ EN: ${finalTranslation?.faq ? '✅' : '❌'}`);

  console.log('\n✨ Terminé!');
  console.log(`   FR: https://menucochon.com/recette/${RECIPE_FR.slug}/`);
  console.log(`   EN: https://menucochon.com/en/recipe/${RECIPE_EN.slug_en}/`);
}

main().catch(console.error);
