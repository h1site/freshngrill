/**
 * Script d'ajout de la recette "Sauce Big Mac maison"
 * Avec traduction anglaise et upload d'image
 *
 * Usage: npx tsx scripts/add-sauce-big-mac.ts
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
  slug: 'sauce-big-mac-maison',
  title: 'Sauce Big Mac maison',
  excerpt: 'Recette facile de sauce Big Mac maison, crémeuse, légèrement sucrée et acidulée, parfaite pour burgers, frites et sandwichs.',
  content: '<p>Cette sauce s\'améliore après quelques heures au frigo. Elle se conserve très bien et remplace avantageusement les sauces commerciales.</p>',
  introduction: `<p>La sauce Big Mac est devenue mythique grâce à son équilibre parfait entre le crémeux, l'acidité et une légère touche sucrée. Bonne nouvelle : elle est très facile à reproduire à la maison avec des ingrédients simples.</p>
<p>Cette version maison est idéale pour vos burgers, wraps ou même comme trempette pour les frites. En plus, vous contrôlez les ingrédients et le goût selon vos préférences.</p>`,
  conclusion: `<p>Laissez reposer la sauce au réfrigérateur avant de servir pour obtenir une saveur optimale. Elle accompagnera parfaitement vos hamburgers maison.</p>
<p>N'hésitez pas à ajuster l'acidité ou le sucre selon votre goût.</p>`,
  prep_time: 10,
  cook_time: 0,
  rest_time: 60,
  total_time: 70,
  servings: 8,
  servings_unit: 'portions',
  difficulty: 'facile',
  ingredients: [
    {
      title: 'Ingrédients',
      items: [
        { quantity: '1/2', unit: 'tasse', name: 'mayonnaise', note: '' },
        { quantity: '2', unit: 'c. à soupe', name: 'ketchup', note: '' },
        { quantity: '1', unit: 'c. à soupe', name: 'moutarde jaune', note: '' },
        { quantity: '1', unit: 'c. à soupe', name: 'vinaigre blanc', note: '' },
        { quantity: '1', unit: 'c. à soupe', name: "cornichons à l'aneth", note: 'finement hachés' },
        { quantity: '1', unit: 'c. à thé', name: 'sucre', note: '' },
        { quantity: '1', unit: 'c. à thé', name: 'paprika', note: '' },
        { quantity: '1/2', unit: 'c. à thé', name: "poudre d'oignon", note: '' },
        { quantity: '1/2', unit: 'c. à thé', name: "poudre d'ail", note: '' },
        { quantity: '', unit: '', name: 'sel', note: 'au goût' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Mélanger la base',
      content: "Dans un bol, mélangez la mayonnaise, le ketchup et la moutarde jusqu'à obtenir une texture lisse. Cette base crémeuse est essentielle pour l'équilibre de la sauce.",
      tip: ''
    },
    {
      step: 2,
      title: 'Ajouter les saveurs',
      content: 'Incorporez le vinaigre, les cornichons hachés et le sucre. Ces ingrédients apportent l\'acidité et la légère touche sucrée typique de la sauce Big Mac.',
      tip: 'Hachez les cornichons très finement pour une texture homogène.'
    },
    {
      step: 3,
      title: 'Assaisonner',
      content: "Ajoutez le paprika, la poudre d'oignon, la poudre d'ail et une pincée de sel. Mélangez bien pour répartir les épices uniformément.",
      tip: ''
    },
    {
      step: 4,
      title: 'Repos au froid',
      content: 'Couvrez et réfrigérez la sauce au moins 1 heure. Le repos permet aux saveurs de se développer pleinement.',
      tip: 'Idéalement, préparez-la la veille.'
    },
    {
      step: 5,
      title: 'Servir',
      content: 'Mélangez une dernière fois avant de servir sur vos burgers, sandwiches ou comme sauce à tremper.',
      tip: ''
    }
  ],
  nutrition: {
    calories: 120,
    protein: 1,
    carbs: 4,
    fat: 11,
    fiber: 0,
    sugar: 3,
    sodium: 180
  },
  faq: JSON.stringify({
    id: null,
    title_fr: 'FAQ',
    title_en: 'FAQ',
    faq: [
      {
        question_fr: 'Combien de temps se conserve la sauce?',
        answer_fr: "Elle se conserve jusqu'à 7 jours au réfrigérateur dans un contenant hermétique.",
        question_en: 'How long does the sauce keep?',
        answer_en: 'It keeps up to 7 days refrigerated in an airtight container.'
      },
      {
        question_fr: 'Peut-on congeler la sauce?',
        answer_fr: 'Non, la mayonnaise ne supporte pas bien la congélation.',
        question_en: 'Can this sauce be frozen?',
        answer_en: 'No, mayonnaise-based sauces do not freeze well.'
      },
      {
        question_fr: 'Peut-on la rendre plus légère?',
        answer_fr: 'Oui, remplacez une partie de la mayonnaise par du yogourt nature.',
        question_en: 'Can it be made lighter?',
        answer_en: 'Yes, replace part of the mayo with plain yogurt.'
      },
      {
        question_fr: 'Quel cornichon utiliser?',
        answer_fr: "Les cornichons à l'aneth sont idéals pour le goût authentique.",
        question_en: 'Which pickles should be used?',
        answer_en: 'Dill pickles are best for authentic flavor.'
      }
    ]
  }),
  author: 'Menucochon',
  seo_title: 'Sauce Big Mac maison | Recette facile et rapide',
  seo_description: 'Apprenez à faire une sauce Big Mac maison simple et rapide, parfaite pour burgers, frites et sandwichs.'
};

// =============================================
// TRADUCTION ANGLAISE
// =============================================

const RECIPE_EN = {
  slug_en: 'homemade-big-mac-sauce',
  title: 'Homemade Big Mac Sauce',
  excerpt: 'Easy homemade Big Mac sauce recipe, creamy with a sweet and tangy kick, perfect for burgers, fries and sandwiches.',
  content: '<p>This sauce improves after a few hours in the fridge. It keeps well and is a great replacement for store-bought sauces.</p>',
  introduction: `<p>Big Mac sauce has become legendary thanks to its perfect balance of creamy, tangy and slightly sweet flavors. The good news is it's very easy to make at home with simple ingredients.</p>
<p>This homemade version is ideal for burgers, wraps or even as a dipping sauce for fries. Plus, you control the ingredients and taste to your preference.</p>`,
  conclusion: `<p>Let the sauce rest in the refrigerator before serving for optimal flavor. It pairs perfectly with homemade burgers.</p>
<p>Feel free to adjust the acidity or sweetness to your taste.</p>`,
  ingredients: [
    {
      title: 'Ingredients',
      items: [
        { quantity: '1/2', unit: 'cup', name: 'mayonnaise', note: '' },
        { quantity: '2', unit: 'tbsp', name: 'ketchup', note: '' },
        { quantity: '1', unit: 'tbsp', name: 'yellow mustard', note: '' },
        { quantity: '1', unit: 'tbsp', name: 'white vinegar', note: '' },
        { quantity: '1', unit: 'tbsp', name: 'dill pickles', note: 'finely chopped' },
        { quantity: '1', unit: 'tsp', name: 'sugar', note: '' },
        { quantity: '1', unit: 'tsp', name: 'paprika', note: '' },
        { quantity: '1/2', unit: 'tsp', name: 'onion powder', note: '' },
        { quantity: '1/2', unit: 'tsp', name: 'garlic powder', note: '' },
        { quantity: '', unit: '', name: 'salt', note: 'to taste' }
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Mix the base',
      content: 'In a bowl, mix mayonnaise, ketchup and mustard until smooth. This creamy base is essential for the sauce\'s balance.',
      tip: ''
    },
    {
      step: 2,
      title: 'Add flavors',
      content: 'Stir in the vinegar, chopped pickles and sugar. These ingredients provide the tangy and slightly sweet taste typical of Big Mac sauce.',
      tip: 'Chop the pickles very finely for a smooth texture.'
    },
    {
      step: 3,
      title: 'Season',
      content: 'Add paprika, onion powder, garlic powder and a pinch of salt. Mix well to distribute the spices evenly.',
      tip: ''
    },
    {
      step: 4,
      title: 'Chill',
      content: 'Cover and refrigerate for at least 1 hour. Resting allows the flavors to develop fully.',
      tip: 'Ideally, prepare it the day before.'
    },
    {
      step: 5,
      title: 'Serve',
      content: 'Give it a final stir before serving on burgers, sandwiches or as a dipping sauce.',
      tip: ''
    }
  ],
  faq: JSON.stringify({
    id: null,
    title_fr: 'FAQ',
    title_en: 'FAQ',
    faq: [
      {
        question_fr: 'Combien de temps se conserve la sauce?',
        answer_fr: "Elle se conserve jusqu'à 7 jours au réfrigérateur.",
        question_en: 'How long does the sauce keep?',
        answer_en: 'It keeps up to 7 days refrigerated in an airtight container.'
      },
      {
        question_fr: 'Peut-on congeler la sauce?',
        answer_fr: 'Non, la mayonnaise ne supporte pas bien la congélation.',
        question_en: 'Can this sauce be frozen?',
        answer_en: 'No, mayonnaise-based sauces do not freeze well.'
      },
      {
        question_fr: 'Peut-on la rendre plus légère?',
        answer_fr: 'Oui, remplacez une partie de la mayonnaise par du yogourt nature.',
        question_en: 'Can it be made lighter?',
        answer_en: 'Yes, replace part of the mayo with plain yogurt.'
      },
      {
        question_fr: 'Quel cornichon utiliser?',
        answer_fr: "Les cornichons à l'aneth sont idéals.",
        question_en: 'Which pickles should be used?',
        answer_en: 'Dill pickles are best for authentic flavor.'
      }
    ]
  }),
  seo_title: 'Homemade Big Mac Sauce | Easy Recipe',
  seo_description: 'Learn how to make easy homemade Big Mac sauce, perfect for burgers, fries and sandwiches.'
};

// =============================================
// IMAGE
// =============================================

const IMAGE_PATH = path.join(process.cwd(), 'ChatGPT Image Jan 16, 2026, 08_07_57 PM.png');
const BUCKET_NAME = 'recipe-images';

// =============================================
// CATÉGORIES
// =============================================

const CATEGORY_SLUGS = ['sauces'];

async function main() {
  console.log('Ajout de la recette "Sauce Big Mac maison"...\n');

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
    const fileName = `sauce-big-mac-maison-${Date.now()}.png`;

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
