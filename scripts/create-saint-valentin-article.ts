/**
 * Generate Saint-Valentin article with 14 recipe showcases using OpenAI
 * Creates FR + EN versions with recipe images, descriptions and CTAs
 *
 * Usage: npx tsx scripts/create-saint-valentin-article.ts
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const RECIPE_SLUGS = [
  'filet-de-porc-aux-canneberges',
  'poulet-au-beurre-indien',
  'soupe-a-loignon-gratinee',
  'poulet-mole',
  'bortsch',
  'poulet-chorizo-cremeux',
  'salade-cesar-poulet-bbq',
  'pouding-aux-bleuets',
  'roti-de-palette',
  'croustade-aux-pommes',
  'poitrine-poulet-mijoteuse',
  'boeuf-wellington',
  'brownies',
  'soupe-a-loignon-francaise',
];

interface RecipeData {
  slug: string;
  title: string;
  featured_image: string | null;
  excerpt: string | null;
  difficulty: string | null;
  total_time: number | null;
}

async function fetchRecipes(): Promise<RecipeData[]> {
  console.log('Fetching 14 Saint-Valentin recipes...');

  const { data, error } = await supabase
    .from('recipes')
    .select('slug, title, featured_image, excerpt, difficulty, total_time')
    .in('slug', RECIPE_SLUGS);

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  // Order by the RECIPE_SLUGS array order
  const ordered = RECIPE_SLUGS.map(slug => data.find(r => r.slug === slug)).filter(Boolean) as RecipeData[];
  console.log(`Found ${ordered.length} recipes`);
  return ordered;
}

async function fetchEnglishSlugs(): Promise<Map<string, string>> {
  const { data } = await supabase
    .from('recipe_translations')
    .select('recipe_id, slug_en');

  if (!data) return new Map();

  // Get recipe IDs for our slugs
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, slug')
    .in('slug', RECIPE_SLUGS);

  const slugMap = new Map<string, string>();
  if (recipes) {
    for (const recipe of recipes) {
      const trans = data.find(t => t.recipe_id === recipe.id);
      if (trans?.slug_en) {
        slugMap.set(recipe.slug, trans.slug_en);
      }
    }
  }
  return slugMap;
}

async function generateArticle(recipes: RecipeData[]): Promise<{ fr: string; en: string; excerptFr: string; excerptEn: string }> {
  console.log('Generating FR article with OpenAI...');

  const recipesInfo = recipes.map((r, i) => {
    const time = r.total_time ? `${r.total_time} min` : 'N/A';
    const diff = r.difficulty || 'N/A';
    return `${i + 1}. "${r.title}" (slug: ${r.slug}, image: ${r.featured_image || 'none'}, temps: ${time}, difficulté: ${diff}, excerpt: ${r.excerpt || ''})`;
  }).join('\n');

  const promptFR = `Tu es un rédacteur web pour Menucochon.com, un site de recettes québécoises. Écris un article de blog en français québécois au style chaleureux et romantique pour la Saint-Valentin.

TITRE DE L'ARTICLE: 14 Recettes Irrésistibles pour la Saint-Valentin

CONSIGNES:
- Article HTML (pas de markdown, pas de code block)
- Commence par une belle introduction romantique (2-3 paragraphes) sur la Saint-Valentin et le plaisir de cuisiner pour l'être aimé
- Ensuite, présente CHACUNE des 14 recettes dans l'ordre ci-dessous
- Pour chaque recette, utilise EXACTEMENT ce format HTML:

<h2>{numéro}. {titre de la recette}</h2>
<img src="{URL de l'image}" alt="{titre}" style="width:100%;border-radius:12px;margin:1rem 0" />
<p>{Description appétissante de 2-3 phrases qui donne envie, en lien avec la Saint-Valentin. Mentionne pourquoi c'est un bon choix pour un souper romantique.}</p>
<p><strong>⏱️ {temps total}</strong> · <strong>Difficulté : {difficulté}</strong></p>
<p><a href="/recette/{slug}" style="display:inline-block;background:#ea580c;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600">👉 Voir la recette</a></p>

- Si une recette n'a pas d'image (image: none), OMETS la balise <img>
- Termine par une conclusion qui invite à explorer toute la catégorie Saint-Valentin
- Style québécois naturel et chaleureux
- NE PAS ajouter de balise <h1> (le titre est géré par le site)

VOICI LES 14 RECETTES:
${recipesInfo}

Retourne UNIQUEMENT le HTML.`;

  const responseFR = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: promptFR }],
    temperature: 0.7,
    max_tokens: 6000,
  });

  const frContent = responseFR.choices[0].message.content?.trim() || '';
  console.log('FR article generated:', frContent.length, 'chars');

  // Wait a bit before the next API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('Generating EN article with OpenAI...');

  const promptEN = `You are a web writer for Menucochon.com, a Quebec recipe website. Translate and adapt this French Valentine's Day article into natural English. Keep the same structure but make all recipe links point to /en/recipe/{slug} instead of /recette/{slug}.

TITLE: 14 Irresistible Recipes for Valentine's Day

INSTRUCTIONS:
- Keep the exact same HTML structure
- Translate all text naturally (not literally)
- Change all recipe links from /recette/{slug} to /en/recipe/{slug_en} using these mappings (if no English slug, keep the French slug):
${recipes.map(r => `  ${r.slug} → will be replaced later`).join('\n')}
- Keep the same images, same styling
- Keep the CTA button style but change text to "👉 View Recipe"
- NE PAS ajouter de balise <h1>

FRENCH ARTICLE TO ADAPT:
${frContent}

Return ONLY the HTML.`;

  const responseEN = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: promptEN }],
    temperature: 0.7,
    max_tokens: 6000,
  });

  let enContent = responseEN.choices[0].message.content?.trim() || '';
  console.log('EN article generated:', enContent.length, 'chars');

  // Fix English recipe links
  const enSlugs = await fetchEnglishSlugs();
  for (const [frSlug, enSlug] of enSlugs) {
    enContent = enContent.replace(
      new RegExp(`/en/recipe/${frSlug}`, 'g'),
      `/en/recipe/${enSlug}`
    );
    // Also fix if GPT kept the French links
    enContent = enContent.replace(
      new RegExp(`/recette/${frSlug}`, 'g'),
      `/en/recipe/${enSlug}`
    );
  }

  const excerptFr = 'Découvrez nos 14 recettes coup de cœur pour la Saint-Valentin! Du Boeuf Wellington au Poulet au Beurre, des idées gourmandes pour un souper romantique inoubliable.';
  const excerptEn = 'Discover our 14 favorite recipes for Valentine\'s Day! From Beef Wellington to Butter Chicken, delicious ideas for an unforgettable romantic dinner.';

  return { fr: frContent, en: enContent, excerptFr, excerptEn };
}

async function insertArticle(article: { fr: string; en: string; excerptFr: string; excerptEn: string }) {
  const slug = '14-recettes-saint-valentin';

  // 1. Get or create category
  const { data: categories } = await supabase
    .from('post_categories')
    .select('id')
    .eq('slug', 'recettes');

  let categoryId: number;

  if (!categories || categories.length === 0) {
    // Fallback to 'actualites'
    const { data: actualites } = await supabase
      .from('post_categories')
      .select('id')
      .eq('slug', 'actualites');

    if (!actualites || actualites.length === 0) {
      console.log('Creating "recettes" post category...');
      const { data: newCat, error: catError } = await supabase
        .from('post_categories')
        .insert({ name: 'Recettes', slug: 'recettes' })
        .select('id')
        .single();

      if (catError) { console.error('Error creating category:', catError); return; }
      categoryId = newCat.id;
    } else {
      categoryId = actualites[0].id;
    }
  } else {
    categoryId = categories[0].id;
  }

  // 2. Get author
  const { data: authors } = await supabase.from('authors').select('id').limit(1);
  const authorId = authors?.[0]?.id || 1;

  // 3. Check if post exists
  const { data: existingPost } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .single();

  const postData = {
    title: '14 Recettes Irrésistibles pour la Saint-Valentin',
    excerpt: article.excerptFr,
    content: article.fr,
    reading_time: 8,
    seo_title: '14 Recettes pour la Saint-Valentin | Souper Romantique | Menucochon',
    seo_description: article.excerptFr,
    tags: ['saint-valentin', 'souper romantique', 'recettes couple', 'valentine'],
  };

  const translationData = {
    locale: 'en',
    title: '14 Irresistible Recipes for Valentine\'s Day',
    slug_en: '14-valentines-day-recipes',
    excerpt: article.excerptEn,
    content: article.en,
    seo_title: '14 Valentine\'s Day Recipes | Romantic Dinner | Menucochon',
    seo_description: article.excerptEn,
  };

  if (existingPost) {
    console.log('Post exists (ID:', existingPost.id, '), updating...');
    await supabase
      .from('posts')
      .update({ ...postData, updated_at: new Date().toISOString() })
      .eq('id', existingPost.id);

    await supabase
      .from('post_translations')
      .upsert(
        { post_id: existingPost.id, ...translationData },
        { onConflict: 'post_id,locale' }
      );

    console.log('Post updated!');
    return;
  }

  // 4. Create post
  const { data: newPost, error: postError } = await supabase
    .from('posts')
    .insert({
      slug,
      ...postData,
      author_id: authorId,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'published',
    })
    .select('id')
    .single();

  if (postError) { console.error('Error creating post:', postError); return; }
  console.log('Post created with ID:', newPost.id);

  // 5. Link category
  await supabase.from('posts_categories').insert({ post_id: newPost.id, category_id: categoryId });

  // 6. English translation
  const { error: transError } = await supabase.from('post_translations').insert({
    post_id: newPost.id,
    ...translationData,
  });

  if (transError) console.error('Error creating translation:', transError);

  console.log('\n✅ Article Saint-Valentin créé!');
  console.log(`FR: /blog/${slug}`);
  console.log(`EN: /en/blog/${translationData.slug_en}`);
}

async function main() {
  const recipes = await fetchRecipes();
  if (recipes.length === 0) {
    console.error('No recipes found!');
    return;
  }

  console.log('Recipes found:');
  recipes.forEach((r, i) => console.log(`  ${i + 1}. ${r.title} (${r.slug})`));
  console.log('');

  const article = await generateArticle(recipes);
  await insertArticle(article);
}

main().catch(console.error);
