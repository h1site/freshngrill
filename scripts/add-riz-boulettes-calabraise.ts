/**
 * Script d'ajout de la recette "Riz aux boulettes calabraises de Stefano"
 * Avec traduction anglaise
 *
 * Usage: npx tsx scripts/add-riz-boulettes-calabraise.ts
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
  slug: 'riz-boulettes-calabraise-stefano',
  title: 'Riz aux boulettes calabraises de Stefano prêtes à cuire',
  excerpt: 'Bol repas rapide et savoureux à base de riz basmati, légumes sautés et boulettes calabraises de Stefano, parfait pour les soirs pressés.',
  introduction: `<p>J'avais vu au supermarché les boulettes de viande prêtes à cuire de Stefano. Il existe plusieurs versions, mais j'ai choisi celles à la calabraise pour leur côté épicé et savoureux.</p>
<p>Comme souvent quand je suis pressé, je me suis imaginé une recette simple et différente, en bol repas. Pendant que j'écris ces lignes, les boulettes cuisent et je suis certain que ce sera une explosion de goût.</p>`,
  content: `<p>Cette recette transforme des boulettes prêtes à cuire en un repas complet et équilibré. Ajustez le piquant selon votre goût ou remplacez les boulettes par une version maison.</p>`,
  conclusion: `<p>Servez ce bol bien chaud pour profiter pleinement des saveurs. C'est une recette parfaite pour la semaine, rapide mais réconfortante.</p>
<p>N'hésitez pas à préparer vos propres boulettes maison pour une version encore plus personnalisée.</p>`,
  prep_time: 10,
  cook_time: 25,
  rest_time: 5,
  total_time: 40,
  servings: 4,
  servings_unit: 'bols',
  difficulty: 'facile',
  ingredients: [
    {
      title: 'Pour le riz',
      items: [
        { quantity: '3', unit: 'tasses', name: 'riz basmati', note: '' },
        { quantity: '1', unit: 'c. à soupe', name: 'beurre', note: '' }
      ]
    },
    {
      title: 'Pour les légumes sautés',
      items: [
        { quantity: '2', unit: 'c. à soupe', name: 'huile de sésame', note: '' },
        { quantity: '1', unit: 'c. à soupe', name: 'ail', note: 'haché' },
        { quantity: '3', unit: 'tasses', name: 'légumes mélangés surgelés', note: '' },
        { quantity: '1/3', unit: 'tasse', name: 'ketchup', note: '' },
        { quantity: '1/3', unit: 'tasse', name: 'sauce soya', note: '' },
        { quantity: '1/3', unit: 'tasse', name: 'bouillon de poulet', note: '' }
      ]
    },
    {
      title: 'Garniture',
      items: [
        { quantity: '', unit: '', name: 'boulettes de viande calabraises prêtes à cuire de Stefano', note: '' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Cuire le riz',
      content: 'Cuisez le riz basmati selon les indications du fabricant. Ajoutez le beurre en fin de cuisson pour enrichir la saveur et détacher les grains.',
      tip: 'Laissez reposer le riz 5 minutes à couvert.'
    },
    {
      step: 2,
      title: 'Chauffer le wok',
      content: 'Chauffez un wok à feu vif avec l\'huile de sésame afin de bien développer ses arômes.',
      tip: ''
    },
    {
      step: 3,
      title: 'Sauter les légumes',
      content: 'Ajoutez l\'ail puis les légumes surgelés. Faites sauter à feu vif jusqu\'à ce qu\'ils soient légèrement croustillants mais encore tendres.',
      tip: 'Évitez de trop remuer pour obtenir une belle coloration.'
    },
    {
      step: 4,
      title: 'Ajouter les sauces',
      content: 'Incorporez le ketchup, la sauce soya et le bouillon de poulet. Laissez réduire légèrement pour enrober les légumes.',
      tip: ''
    },
    {
      step: 5,
      title: 'Cuire les boulettes',
      content: 'Faites cuire les boulettes de Stefano selon les instructions de l\'emballage afin qu\'elles restent juteuses et bien dorées.',
      tip: ''
    },
    {
      step: 6,
      title: 'Assembler le bol',
      content: 'Déposez le riz au fond d\'un bol, ajoutez les légumes sautés puis les boulettes sur le dessus avant de servir.',
      tip: 'Ajoutez des graines de sésame pour la finition.'
    }
  ],
  nutrition: {
    calories: 520,
    protein: 26,
    carbs: 62,
    fat: 18,
    fiber: 5,
    sugar: 12,
    sodium: 820
  },
  faq: JSON.stringify({
    id: null,
    title_fr: 'FAQ',
    title_en: 'FAQ',
    faq: [
      {
        question_fr: 'Peut-on congeler ce plat?',
        answer_fr: 'Oui, le riz et les boulettes se congèlent séparément jusqu\'à 2 mois.',
        question_en: 'Can this dish be frozen?',
        answer_en: 'Yes, rice and meatballs can be frozen separately for up to 2 months.'
      },
      {
        question_fr: 'Puis-je remplacer les boulettes?',
        answer_fr: 'Oui, par des boulettes maison ou végétariennes.',
        question_en: 'Can I replace the meatballs?',
        answer_en: 'Yes, with homemade or vegetarian meatballs.'
      },
      {
        question_fr: 'Comment savoir si les légumes sont prêts?',
        answer_fr: 'Ils doivent être légèrement dorés mais encore croquants.',
        question_en: 'How do you know when vegetables are ready?',
        answer_en: 'They should be lightly browned yet still crisp.'
      }
    ]
  }),
  author: 'Menucochon',
  seo_title: 'Riz aux boulettes calabraises de Stefano | Recette rapide',
  seo_description: 'Bol de riz aux boulettes calabraises de Stefano, une recette rapide et savoureuse parfaite pour les soirs pressés.'
};

// =============================================
// TRADUCTION ANGLAISE
// =============================================

const RECIPE_EN = {
  slug_en: 'stefano-calabrian-meatball-rice-bowl',
  title: 'Stefano Calabrian Meatball Rice Bowl',
  excerpt: 'Quick and flavorful rice bowl made with basmati rice, stir-fried vegetables and spicy Calabrian Stefano meatballs.',
  introduction: `<p>I noticed Stefano's ready-to-cook meatballs at the grocery store. They come in several varieties, and I chose the Calabrian version for its bold, spicy flavor.</p>
<p>Being short on time, I imagined a simple rice bowl to make something different. As I write this, the meatballs are cooking, and I'm sure it will be a real explosion of flavor.</p>`,
  content: `<p>This recipe turns ready-to-cook meatballs into a complete and satisfying meal. Adjust the spice level or use homemade meatballs if preferred.</p>`,
  conclusion: `<p>Serve this bowl hot to fully enjoy the flavors. It's perfect for busy weeknights while still feeling comforting and hearty.</p>
<p>Feel free to make your own homemade meatballs for a personalized touch.</p>`,
  ingredients: [
    {
      title: 'For the rice',
      items: [
        { quantity: '3', unit: 'cups', name: 'basmati rice', note: '' },
        { quantity: '1', unit: 'tbsp', name: 'butter', note: '' }
      ]
    },
    {
      title: 'For the stir-fried vegetables',
      items: [
        { quantity: '2', unit: 'tbsp', name: 'sesame oil', note: '' },
        { quantity: '1', unit: 'tbsp', name: 'garlic', note: 'minced' },
        { quantity: '3', unit: 'cups', name: 'frozen mixed vegetables', note: '' },
        { quantity: '1/3', unit: 'cup', name: 'ketchup', note: '' },
        { quantity: '1/3', unit: 'cup', name: 'soy sauce', note: '' },
        { quantity: '1/3', unit: 'cup', name: 'chicken broth', note: '' }
      ]
    },
    {
      title: 'Topping',
      items: [
        { quantity: '', unit: '', name: 'Stefano ready-to-cook Calabrian meatballs', note: '' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Cook the rice',
      content: 'Cook the basmati rice according to package directions. Stir in the butter at the end for extra flavor and fluffy grains.',
      tip: 'Let the rice rest covered for 5 minutes.'
    },
    {
      step: 2,
      title: 'Heat the wok',
      content: 'Heat a wok over high heat with sesame oil to release its nutty aroma.',
      tip: ''
    },
    {
      step: 3,
      title: 'Stir-fry the vegetables',
      content: 'Add garlic, then frozen vegetables. Stir-fry over high heat until slightly crispy yet tender.',
      tip: 'Avoid overcrowding the pan.'
    },
    {
      step: 4,
      title: 'Add the sauces',
      content: 'Pour in ketchup, soy sauce and chicken broth. Let the sauce reduce slightly to coat the vegetables.',
      tip: ''
    },
    {
      step: 5,
      title: 'Cook the meatballs',
      content: 'Cook Stefano meatballs following the package instructions until fully cooked and golden.',
      tip: ''
    },
    {
      step: 6,
      title: 'Assemble the bowl',
      content: 'Place rice in a bowl, top with vegetables and finish with the meatballs before serving.',
      tip: 'Sprinkle sesame seeds if desired.'
    }
  ],
  faq: JSON.stringify({
    id: null,
    title_fr: 'FAQ',
    title_en: 'FAQ',
    faq: [
      {
        question_fr: 'Peut-on congeler ce plat?',
        answer_fr: 'Oui, le riz et les boulettes se congèlent séparément.',
        question_en: 'Can this dish be frozen?',
        answer_en: 'Yes, rice and meatballs can be frozen separately.'
      },
      {
        question_fr: 'Puis-je remplacer les boulettes?',
        answer_fr: 'Oui, par des boulettes maison ou végétariennes.',
        question_en: 'Can I replace the meatballs?',
        answer_en: 'Yes, with homemade or vegetarian meatballs.'
      },
      {
        question_fr: 'Comment savoir si les légumes sont prêts?',
        answer_fr: 'Ils doivent être légèrement dorés mais encore croquants.',
        question_en: 'How do you know when vegetables are ready?',
        answer_en: 'They should be lightly browned yet still crisp.'
      }
    ]
  }),
  seo_title: 'Stefano Calabrian Meatball Rice Bowl | Easy Recipe',
  seo_description: 'Discover this easy Stefano Calabrian meatball rice bowl, a quick and flavorful meal for busy weeknights.'
};

// =============================================
// CATÉGORIES À ASSOCIER
// =============================================

const CATEGORY_SLUGS = ['plats-principaux', 'riz'];

async function main() {
  console.log('Ajout de la recette "Riz aux boulettes calabraises de Stefano"...\n');

  // 1. Vérifier si la recette existe déjà
  const { data: existingRecipe } = await supabase
    .from('recipes')
    .select('id, slug')
    .eq('slug', RECIPE_FR.slug)
    .single();

  if (existingRecipe) {
    console.log(`La recette existe déjà (ID: ${existingRecipe.id}). Mise à jour...`);
  }

  // 2. Insérer ou mettre à jour la recette française
  console.log('Insertion de la recette française...');
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
      rest_time: RECIPE_FR.rest_time,
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
    console.error('Erreur insertion recette:', recipeError.message);
    process.exit(1);
  }

  console.log(`Recette insérée/mise à jour (ID: ${recipe.id})`);

  // 3. Associer les catégories
  console.log('\nAssociation des catégories...');

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
      console.warn('Erreur association catégories:', catError.message);
    } else {
      console.log(`Catégories associées: ${categories.map((c: { name: string }) => c.name).join(', ')}`);
    }
  } else {
    console.log('Catégories non trouvées');
  }

  // 4. Ajouter la traduction anglaise
  console.log('\nAjout de la traduction anglaise...');

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
    console.error('Erreur traduction:', translationError.message);
  } else {
    console.log('Traduction anglaise ajoutée');
  }

  // 5. Vérification finale
  console.log('\nVérification finale...');

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

  console.log('\nRésultat:');
  console.log(`   ID: ${recipe.id}`);
  console.log(`   Slug FR: ${finalRecipe?.slug || 'N/A'}`);
  console.log(`   Slug EN: ${finalTranslation?.slug_en || 'N/A'}`);
  console.log(`   Titre FR: ${finalRecipe?.title || 'N/A'}`);
  console.log(`   Titre EN: ${finalTranslation?.title || 'N/A'}`);
  console.log(`   Catégories: ${finalRecipe?.categories?.map((c: { name: string }) => c.name).join(', ') || 'N/A'}`);
  console.log(`   Ingrédients: ${finalRecipe?.ingredients?.reduce((acc: number, g: { items: any[] }) => acc + g.items.length, 0) || 0} items`);
  console.log(`   Instructions: ${finalRecipe?.instructions?.length || 0} étapes`);

  console.log('\nTerminé!');
  console.log(`   FR: https://menucochon.com/recette/${RECIPE_FR.slug}/`);
  console.log(`   EN: https://menucochon.com/en/recipe/${RECIPE_EN.slug_en}/`);
}

main().catch(console.error);
