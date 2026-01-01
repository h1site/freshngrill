/**
 * Script d'ajout de la recette "Hot Chicken Poutine (style québécois)"
 * Avec traduction anglaise
 *
 * Usage: npx tsx scripts/add-hot-chicken-poutine.ts
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
  slug: 'hot-chicken-poutine',
  title: 'Hot Chicken Poutine (style québécois)',
  excerpt: 'Un classique ultra réconfortant qui marie le hot chicken traditionnel et la poutine bien gourmande. Sauce onctueuse, poulet tendre, frites croustillantes et fromage en grains qui fait squick-squick!',
  introduction: `<p>Un classique ultra réconfortant qui marie le hot chicken traditionnel et la poutine bien gourmande. Sauce onctueuse, poulet tendre, frites croustillantes et fromage en grains qui fait squick-squick!</p>
<p>Ce plat emblématique du Québec combine deux favoris de la cuisine québécoise en un seul repas copieux et satisfaisant. Parfait pour les soirées d'hiver ou quand vous avez besoin d'un bon comfort food.</p>`,
  content: `<h2>Astuces gourmandes</h2>
<ul>
<li>Pour une sauce encore plus riche, ajoute un peu de jus de poulet rôti.</li>
<li>Tu peux griller légèrement la miche de pain pour plus de texture.</li>
<li>Envie d'un twist ? Ajoute une pincée de paprika ou de poivre blanc à la sauce.</li>
</ul>
<p><strong>Le secret d'une bonne sauce hot chicken:</strong> Le roux doit être bien cuit pour éviter le goût de farine crue. Incorporez le bouillon graduellement en fouettant constamment pour une sauce parfaitement lisse.</p>
<p><strong>Le fromage en grains:</strong> Utilisez du fromage en grains frais du jour pour obtenir ce fameux "squick-squick" caractéristique. Le fromage doit être à température ambiante avant de l'ajouter.</p>`,
  conclusion: `<p>Un plat copieux, réconfortant et 100% québécois, parfait pour impressionner... ou simplement se faire plaisir.</p>
<p>Ça va avoir l'air délicieux — et ça va l'être encore plus!</p>`,
  prep_time: 15,
  cook_time: 20,
  total_time: 35,
  servings: 4,
  servings_unit: 'portions',
  difficulty: 'facile',
  ingredients: [
    {
      title: 'Pour la sauce hot chicken',
      items: [
        { quantity: '4', unit: 'c. à soupe', name: 'beurre' },
        { quantity: '4', unit: 'c. à soupe', name: 'farine' },
        { quantity: '1/2', unit: 'tasse', name: 'oignons verts hachés' },
        { quantity: '1 à 2', unit: 'gousses', name: 'ail haché' },
        { quantity: '1 1/2', unit: 'tasse', name: 'bouillon', note: 'mélange boeuf et poulet' },
        { quantity: '1', unit: 'canne', name: 'petits pois', note: 'égouttée' },
        { name: 'sel et poivre', note: 'au goût' }
      ]
    },
    {
      title: 'Pour le montage',
      items: [
        { name: 'poulet cuit', note: 'rôti ou poché, effiloché ou tranché' },
        { quantity: '4', unit: 'tranches', name: 'miche de pain' },
        { name: 'frites', note: 'maison ou du commerce' },
        { name: 'fromage en grains' },
        { name: 'persil frais haché', note: 'pour garnir' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Préparer la base de la sauce',
      content: 'Dans une casserole à feu moyen, faire fondre le beurre. Ajouter les oignons verts et l\'ail, puis faire revenir 1 à 2 minutes sans coloration.'
    },
    {
      step: 2,
      title: 'Faire le roux',
      content: 'Ajouter la farine et bien mélanger pour former un roux. Cuire environ 1 minute en remuant constamment.'
    },
    {
      step: 3,
      title: 'Incorporer le bouillon',
      content: 'Verser le bouillon graduellement en fouettant pour éviter les grumeaux. Porter doucement à ébullition.'
    },
    {
      step: 4,
      title: 'Ajouter les petits pois',
      content: 'Incorporer les petits pois, réduire le feu et laisser mijoter doucement jusqu\'à obtention d\'une sauce épaisse et lisse. Saler et poivrer au goût.'
    },
    {
      step: 5,
      title: 'Réchauffer le poulet',
      content: 'Chauffer légèrement le poulet dans un peu de sauce ou au micro-ondes.'
    },
    {
      step: 6,
      title: 'Assembler le hot chicken poutine',
      content: 'Déposer une tranche de miche de pain dans l\'assiette. Étendre le poulet chaud sur le pain. Napper généreusement de sauce. Ajouter les frites par-dessus. Parsemer de fromage en grains.'
    },
    {
      step: 7,
      title: 'Finition',
      content: 'Saupoudrer de persil frais. Servir immédiatement pendant que le fromage commence à fondre.'
    }
  ],
  nutrition: {
    calories: 650,
    protein: 35,
    carbs: 55,
    fat: 32,
    fiber: 5
  },
  faq: `<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Quel type de poulet utiliser pour le hot chicken poutine?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Vous pouvez utiliser du poulet rôti du commerce (très pratique!), des restes de poulet rôti maison, ou du poulet poché. L'important est que le poulet soit bien tendre et juteux.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Peut-on préparer la sauce à l'avance?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Oui! La sauce se conserve 3-4 jours au réfrigérateur. Réchauffez-la doucement en ajoutant un peu de bouillon si elle a trop épaissi.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Où trouver du fromage en grains frais?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Le fromage en grains frais se trouve dans la plupart des épiceries québécoises, souvent près des comptoirs de charcuterie ou dans la section des fromages. Pour le fameux "squick-squick", assurez-vous qu'il est du jour!</p>
</div></div>
</div>`,
  author: 'Menucochon',
  seo_title: 'Hot Chicken Poutine québécoise | Recette traditionnelle',
  seo_description: 'Recette authentique de Hot Chicken Poutine style québécois. Sauce onctueuse aux petits pois, poulet tendre, frites et fromage en grains. Le comfort food ultime!'
};

// =============================================
// TRADUCTION ANGLAISE
// =============================================

const RECIPE_EN = {
  slug_en: 'quebec-style-hot-chicken-poutine',
  title: 'Quebec-Style Hot Chicken Poutine',
  excerpt: 'An ultra-comforting classic that combines traditional hot chicken with delicious poutine. Creamy sauce, tender chicken, crispy fries and squeaky cheese curds!',
  introduction: `<p>An ultra-comforting classic that combines traditional hot chicken with delicious poutine. Creamy sauce, tender chicken, crispy fries and squeaky cheese curds!</p>
<p>This iconic Quebec dish combines two favorites of Quebec cuisine into one hearty and satisfying meal. Perfect for winter evenings or when you need some good comfort food.</p>`,
  content: `<h2>Gourmet Tips</h2>
<ul>
<li>For an even richer sauce, add some roast chicken drippings.</li>
<li>You can lightly toast the bread for more texture.</li>
<li>Want a twist? Add a pinch of paprika or white pepper to the sauce.</li>
</ul>
<p><strong>The secret to great hot chicken sauce:</strong> The roux must be well cooked to avoid a raw flour taste. Add the broth gradually while whisking constantly for a perfectly smooth sauce.</p>
<p><strong>Cheese curds:</strong> Use fresh cheese curds for that famous characteristic "squeak". The cheese should be at room temperature before adding.</p>`,
  conclusion: `<p>A hearty, comforting and 100% Quebec dish, perfect for impressing... or simply treating yourself.</p>
<p>It's going to look delicious — and taste even better!</p>`,
  ingredients: [
    {
      title: 'For the hot chicken sauce',
      items: [
        { quantity: '4', unit: 'tablespoons', name: 'butter' },
        { quantity: '4', unit: 'tablespoons', name: 'flour' },
        { quantity: '1/2', unit: 'cup', name: 'chopped green onions' },
        { quantity: '1 to 2', unit: 'cloves', name: 'minced garlic' },
        { quantity: '1 1/2', unit: 'cups', name: 'broth', note: 'beef and chicken mix' },
        { quantity: '1', unit: 'can', name: 'green peas', note: 'drained' },
        { name: 'salt and pepper', note: 'to taste' }
      ]
    },
    {
      title: 'For assembly',
      items: [
        { name: 'cooked chicken', note: 'roasted or poached, shredded or sliced' },
        { quantity: '4', unit: 'slices', name: 'white bread' },
        { name: 'french fries', note: 'homemade or store-bought' },
        { name: 'cheese curds' },
        { name: 'fresh chopped parsley', note: 'for garnish' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Prepare the sauce base',
      content: 'In a saucepan over medium heat, melt the butter. Add the green onions and garlic, then sauté for 1 to 2 minutes without browning.'
    },
    {
      step: 2,
      title: 'Make the roux',
      content: 'Add the flour and mix well to form a roux. Cook for about 1 minute, stirring constantly.'
    },
    {
      step: 3,
      title: 'Add the broth',
      content: 'Gradually pour in the broth while whisking to prevent lumps. Bring gently to a boil.'
    },
    {
      step: 4,
      title: 'Add the peas',
      content: 'Stir in the peas, reduce heat and simmer gently until you get a thick, smooth sauce. Season with salt and pepper to taste.'
    },
    {
      step: 5,
      title: 'Reheat the chicken',
      content: 'Gently warm the chicken in some sauce or in the microwave.'
    },
    {
      step: 6,
      title: 'Assemble the hot chicken poutine',
      content: 'Place a slice of bread on the plate. Spread the warm chicken over the bread. Generously cover with sauce. Add fries on top. Sprinkle with cheese curds.'
    },
    {
      step: 7,
      title: 'Finish',
      content: 'Sprinkle with fresh parsley. Serve immediately while the cheese starts to melt.'
    }
  ],
  faq: `<div itemscope itemtype="https://schema.org/FAQPage">
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">What type of chicken should I use for hot chicken poutine?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">You can use store-bought rotisserie chicken (very convenient!), leftover homemade roast chicken, or poached chicken. The important thing is that the chicken is tender and juicy.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Can the sauce be made ahead of time?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Yes! The sauce keeps for 3-4 days in the refrigerator. Reheat gently, adding a little broth if it has thickened too much.</p>
</div></div>
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">Where can I find fresh cheese curds?</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">Fresh cheese curds can be found in most grocery stores, often near the deli counters or in the cheese section. For that famous "squeak", make sure they're fresh from that day!</p>
</div></div>
</div>`,
  seo_title: 'Quebec Hot Chicken Poutine | Traditional Recipe',
  seo_description: 'Authentic Quebec-style Hot Chicken Poutine recipe. Creamy sauce with green peas, tender chicken, fries and cheese curds. The ultimate comfort food!'
};

// =============================================
// CATÉGORIES À ASSOCIER
// =============================================

const CATEGORY_SLUGS = ['plats-principaux', 'poulet'];

async function main() {
  console.log('Ajout de la recette "Hot Chicken Poutine"...\n');

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
