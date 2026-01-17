/**
 * Script d'ajout de la recette "Soupe à l'orge et jambon"
 * Avec traduction anglaise et upload d'image
 *
 * Usage: npx tsx scripts/add-soupe-orge-jambon.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =============================================
// RECETTE FRANÇAISE
// =============================================

const RECIPE_FR = {
  slug: 'soupe-orge-jambon',
  title: "Soupe à l'orge et jambon",
  excerpt: 'Soupe réconfortante à l\'orge et au jambon, riche en légumes et en saveur, parfaite pour un repas nourrissant et simple.',
  content: '<p>Cette soupe est idéale pour passer des restes de jambon ou utiliser un mélange de légumes congelés. Plus elle mijote, plus les saveurs se développent.</p>',
  introduction: `<p>La soupe à l'orge et au jambon est un grand classique réconfortant, surtout quand les journées sont fraîches. Elle rappelle les recettes simples et nourrissantes qu'on laissait mijoter doucement sur le poêle.</p>
<p>Avec peu d'ingrédients et beaucoup de flexibilité, cette recette permet d'utiliser les légumes que vous avez sous la main tout en obtenant une soupe consistante et savoureuse.</p>`,
  conclusion: `<p>Servez cette soupe bien chaude avec du pain frais ou des craquelins. Elle se conserve très bien et est encore meilleure réchauffée le lendemain.</p>
<p>C'est aussi une excellente soupe à congeler pour les semaines occupées.</p>`,
  prep_time: 15,
  cook_time: 45,
  rest_time: 0,
  total_time: 60,
  servings: 6,
  servings_unit: 'bols',
  difficulty: 'facile',
  ingredients: [
    {
      title: 'Ingrédients',
      items: [
        { quantity: '1800', unit: 'ml', name: 'bouillon de poulet', note: '' },
        { quantity: '450', unit: 'ml', name: 'bouillon de bœuf', note: '' },
        { quantity: '1', unit: 'c. à soupe', name: 'ail', note: 'haché' },
        { quantity: '1/2', unit: 'tasse', name: 'orge perlé', note: '' },
        { quantity: '750', unit: 'g', name: 'légumes au choix', note: 'frais ou congelés' },
        { quantity: '', unit: '', name: 'jambon', note: 'coupé en cubes ou en petits morceaux' },
        { quantity: '', unit: '', name: 'sel', note: 'au goût' },
        { quantity: '', unit: '', name: 'poivre', note: 'au goût' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Préparer les ingrédients',
      content: 'Coupez tous les légumes ainsi que le jambon en morceaux de taille uniforme. Cela assure une cuisson égale et une meilleure texture dans la soupe.',
      tip: 'Des morceaux trop gros allongeront le temps de cuisson.'
    },
    {
      step: 2,
      title: 'Assembler la soupe',
      content: "Dans une grande casserole ou un wok profond, ajoutez les bouillons, l'ail, l'orge, les légumes et le jambon. Mélangez bien pour répartir les ingrédients.",
      tip: ''
    },
    {
      step: 3,
      title: 'Porter à ébullition',
      content: "Portez le tout à ébullition à feu vif. Cette étape permet de démarrer la cuisson de l'orge et d'extraire les saveurs.",
      tip: ''
    },
    {
      step: 4,
      title: 'Mijoter',
      content: "Réduisez à feu moyen et laissez mijoter jusqu'à ce que l'orge soit tendre et que la soupe épaississe légèrement.",
      tip: "Remuez de temps en temps pour éviter que l'orge colle."
    },
    {
      step: 5,
      title: 'Assaisonner',
      content: 'Goûtez et ajustez avec du sel et du poivre au besoin avant de servir bien chaud.',
      tip: ''
    }
  ],
  nutrition: {
    calories: 310,
    protein: 18,
    carbs: 32,
    fat: 8,
    fiber: 6,
    sugar: 4,
    sodium: 720
  },
  faq: JSON.stringify({
    id: null,
    title_fr: 'FAQ',
    title_en: 'FAQ',
    faq: [
      {
        question_fr: 'Peut-on congeler cette soupe?',
        answer_fr: 'Oui, elle se congèle très bien jusqu\'à 3 mois.',
        question_en: 'Can this soup be frozen?',
        answer_en: 'Yes, it freezes very well for up to 3 months.'
      },
      {
        question_fr: "Quel type d'orge utiliser?",
        answer_fr: "L'orge perlé est recommandé pour une cuisson plus rapide.",
        question_en: 'What type of barley should I use?',
        answer_en: 'Pearled barley is recommended for quicker cooking.'
      },
      {
        question_fr: "Comment savoir si l'orge est prêt?",
        answer_fr: "L'orge doit être tendre mais encore légèrement ferme.",
        question_en: 'How do you know when barley is cooked?',
        answer_en: 'The barley should be tender but still slightly firm.'
      }
    ]
  }),
  author: 'Menucochon',
  seo_title: "Soupe à l'orge et jambon | Recette simple et nourrissante",
  seo_description: "Découvrez cette soupe à l'orge et jambon facile à préparer, parfaite pour un repas chaud, nourrissant et économique."
};

// =============================================
// TRADUCTION ANGLAISE
// =============================================

const RECIPE_EN = {
  slug_en: 'barley-ham-soup',
  title: 'Barley and Ham Soup',
  excerpt: 'Comforting barley and ham soup packed with vegetables and rich flavor, perfect for a hearty meal.',
  content: '<p>This soup is perfect for using leftover ham or frozen vegetables. The longer it simmers, the better the flavor becomes.</p>',
  introduction: `<p>Barley and ham soup is a comforting classic, especially on cooler days. It's a simple, hearty recipe that slowly simmers to develop deep flavors.</p>
<p>With minimal prep and flexible ingredients, it's an easy way to create a filling meal using what you already have on hand.</p>`,
  conclusion: `<p>Serve this soup hot with fresh bread or crackers. It stores well and tastes even better the next day.</p>
<p>It's also an excellent soup to freeze for busy weeks.</p>`,
  ingredients: [
    {
      title: 'Ingredients',
      items: [
        { quantity: '1800', unit: 'ml', name: 'chicken broth', note: '' },
        { quantity: '450', unit: 'ml', name: 'beef broth', note: '' },
        { quantity: '1', unit: 'tbsp', name: 'garlic', note: 'minced' },
        { quantity: '1/2', unit: 'cup', name: 'pearl barley', note: '' },
        { quantity: '750', unit: 'g', name: 'vegetables of choice', note: 'fresh or frozen' },
        { quantity: '', unit: '', name: 'ham', note: 'diced or chopped' },
        { quantity: '', unit: '', name: 'salt', note: 'to taste' },
        { quantity: '', unit: '', name: 'pepper', note: 'to taste' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Prepare ingredients',
      content: 'Chop all vegetables and dice the ham into even-sized pieces to ensure even cooking throughout the soup.',
      tip: 'Uniform pieces help maintain consistent texture.'
    },
    {
      step: 2,
      title: 'Combine ingredients',
      content: 'In a large pot or deep wok, add broths, garlic, barley, vegetables and ham. Stir well to combine.',
      tip: ''
    },
    {
      step: 3,
      title: 'Bring to a boil',
      content: 'Bring the soup to a boil over high heat to start cooking the barley and release flavors.',
      tip: ''
    },
    {
      step: 4,
      title: 'Simmer',
      content: 'Reduce heat to medium and simmer until the barley is tender and the soup slightly thickened.',
      tip: 'Stir occasionally to prevent sticking.'
    },
    {
      step: 5,
      title: 'Season and serve',
      content: 'Season with salt and pepper to taste, then serve hot.',
      tip: ''
    }
  ],
  faq: JSON.stringify({
    id: null,
    title_fr: 'FAQ',
    title_en: 'FAQ',
    faq: [
      {
        question_fr: 'Peut-on congeler cette soupe?',
        answer_fr: 'Oui, elle se congèle très bien jusqu\'à 3 mois.',
        question_en: 'Can this soup be frozen?',
        answer_en: 'Yes, it freezes very well for up to 3 months.'
      },
      {
        question_fr: "Quel type d'orge utiliser?",
        answer_fr: "L'orge perlé est idéal pour cette recette.",
        question_en: 'What type of barley should I use?',
        answer_en: 'Pearl barley works best for this recipe.'
      },
      {
        question_fr: "Comment savoir si l'orge est prêt?",
        answer_fr: 'Il doit être tendre mais encore légèrement ferme.',
        question_en: 'How do you know when barley is cooked?',
        answer_en: 'It should be tender but still slightly firm.'
      }
    ]
  }),
  seo_title: 'Barley and Ham Soup | Easy Comfort Recipe',
  seo_description: 'Try this easy barley and ham soup recipe, hearty, comforting and perfect for cold days.'
};

// =============================================
// IMAGE
// =============================================

const IMAGE_PATH = path.join(process.cwd(), 'ChatGPT Image Jan 16, 2026, 07_07_05 PM.png');
const BUCKET_NAME = 'recipe-images';

// =============================================
// CATÉGORIES
// =============================================

const CATEGORY_SLUGS = ['soupes'];

async function main() {
  console.log('Ajout de la recette "Soupe à l\'orge et jambon"...\n');

  // 1. Vérifier si la recette existe déjà
  const { data: existingRecipe } = await supabase
    .from('recipes')
    .select('id, slug')
    .eq('slug', RECIPE_FR.slug)
    .single();

  if (existingRecipe) {
    console.log(`La recette existe déjà (ID: ${existingRecipe.id}). Mise à jour...`);
  }

  // 2. Upload image if exists
  let imageUrl: string | null = null;
  if (fs.existsSync(IMAGE_PATH)) {
    console.log('Upload de l\'image...');
    const imageBuffer = fs.readFileSync(IMAGE_PATH);
    const fileName = `soupe-orge-jambon-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Erreur upload image:', uploadError.message);
    } else {
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
      console.log(`Image uploadée: ${imageUrl}`);
    }
  } else {
    console.log('Image non trouvée, recette créée sans image');
  }

  // 3. Insérer ou mettre à jour la recette française
  console.log('\nInsertion de la recette française...');
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
      featured_image: imageUrl,
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

  // 4. Associer les catégories
  console.log('\nAssociation des catégories...');

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
      console.warn('Erreur association catégories:', catError.message);
    } else {
      console.log(`Catégories associées: ${categories.map((c: { name: string }) => c.name).join(', ')}`);
    }
  }

  // 5. Ajouter la traduction anglaise
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

  // 6. Vérification finale
  console.log('\n========== RÉSULTAT ==========');
  console.log(`ID: ${recipe.id}`);
  console.log(`Slug FR: ${RECIPE_FR.slug}`);
  console.log(`Slug EN: ${RECIPE_EN.slug_en}`);
  console.log(`Titre FR: ${RECIPE_FR.title}`);
  console.log(`Titre EN: ${RECIPE_EN.title}`);
  console.log(`Image: ${imageUrl ? '✓' : '✗'}`);

  console.log('\n========== LIENS ==========');
  console.log(`FR: https://menucochon.com/recette/${RECIPE_FR.slug}/`);
  console.log(`EN: https://menucochon.com/en/recipe/${RECIPE_EN.slug_en}/`);
}

main().catch(console.error);
