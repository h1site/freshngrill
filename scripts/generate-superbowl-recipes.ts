/**
 * Generate 20 Super Bowl recipes + blog article using OpenAI
 *
 * Creates:
 * - 20 full recipes (FR + EN) with DALL-E images
 * - 1 blog article featuring all 20 recipes (FR + EN)
 *
 * Usage:
 *   npx tsx scripts/generate-superbowl-recipes.ts
 *   npx tsx scripts/generate-superbowl-recipes.ts --dry-run
 *   npx tsx scripts/generate-superbowl-recipes.ts --skip-images
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

const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_IMAGES = process.argv.includes('--skip-images');

// ============================================
// 20 SUPER BOWL RECIPE CONCEPTS
// ============================================

const RECIPE_CONCEPTS = [
  { slug: 'ailes-de-poulet-buffalo', theme: 'Ailes de poulet Buffalo classiques, sauce piquante et beurre', imagePrompt: 'crispy buffalo chicken wings with blue cheese dip on a wooden board, game day food photography, warm lighting' },
  { slug: 'nachos-supreme-fromage', theme: 'Nachos suprêmes gratinés au fromage, boeuf, jalapeños, crème sure et guacamole', imagePrompt: 'loaded supreme nachos with melted cheese, ground beef, jalapeños, sour cream and guacamole, overhead shot, food photography' },
  { slug: 'trempette-pizza-chaude', theme: 'Trempette pizza chaude au four avec pepperoni et fromage', imagePrompt: 'hot bubbling pizza dip in a cast iron skillet with melted cheese, pepperoni, served with bread sticks, food photography' },
  { slug: 'mini-pogos-fromage-biere', theme: 'Mini pogos maison au fromage et bière (corn dogs québécois)', imagePrompt: 'homemade mini corn dogs on a plate with mustard dip, golden crispy batter, food photography' },
  { slug: 'jalapeno-poppers-bacon', theme: 'Jalapeño poppers farcis au fromage à la crème et enveloppés de bacon', imagePrompt: 'bacon wrapped jalapeño poppers stuffed with cream cheese on a baking sheet, food photography, crispy bacon' },
  { slug: 'ailes-general-tao-erable', theme: 'Ailes de poulet Général Tao à l\'érable, fusion québécoise', imagePrompt: 'glazed General Tao chicken wings with sesame seeds and green onions, sticky maple glaze, food photography' },
  { slug: 'pelures-patates-garnies', theme: 'Pelures de patates garnies style Big Mac (bacon, fromage, laitue, sauce)', imagePrompt: 'loaded potato skins with bacon, melted cheese, lettuce and special sauce, Big Mac style, food photography' },
  { slug: 'trempette-fromage-biere', theme: 'Trempette chaude au fromage et bière avec bretzels', imagePrompt: 'warm beer cheese dip in a bowl surrounded by soft pretzels, creamy golden cheese sauce, food photography' },
  { slug: 'boulettes-viande-sauce-bbq', theme: 'Boulettes de viande glacées à la sauce BBQ et érable, en slow cooker', imagePrompt: 'BBQ glazed meatballs in a slow cooker with toothpicks, sticky shiny sauce, food photography' },
  { slug: 'mini-burgers-smash', theme: 'Mini smash burgers sur petits pains avec fromage fondant', imagePrompt: 'mini smash burgers with melted cheese on small buns, game day slider style, food photography' },
  { slug: 'fromage-en-croute-curds', theme: 'Fromage en croûte (cheese curds panés et frits) style poutine', imagePrompt: 'deep fried breaded cheese curds golden and crispy on parchment paper with dipping sauce, food photography' },
  { slug: 'guacamole-maison-chips', theme: 'Guacamole maison frais avec chips de tortilla', imagePrompt: 'fresh chunky guacamole in a stone molcajete with tortilla chips, lime wedges, cilantro, food photography' },
  { slug: 'pizza-baguette-pepperoni', theme: 'Pizza baguette au pepperoni et fromage, rapide au four', imagePrompt: 'crispy baguette pizza with pepperoni and bubbly melted cheese on a baking sheet, food photography' },
  { slug: 'saucisses-cocktail-erable-whisky', theme: 'Saucisses cocktail glacées à l\'érable et whisky, enroulées de bacon', imagePrompt: 'bacon wrapped cocktail sausages with maple whisky glaze, glossy and caramelized, food photography' },
  { slug: 'rondelles-oignon-panees', theme: 'Rondelles d\'oignon panées croustillantes avec sauce ranch', imagePrompt: 'crispy golden onion rings stacked on parchment paper with ranch dipping sauce, food photography' },
  { slug: 'tacos-poulet-bbq', theme: 'Tacos au poulet BBQ effiloché avec coleslaw croquant', imagePrompt: 'BBQ pulled chicken tacos with creamy coleslaw in soft tortillas, food photography, colorful toppings' },
  { slug: 'mac-and-cheese-bacon', theme: 'Mac and cheese crémeux au bacon et chapelure gratinée', imagePrompt: 'creamy mac and cheese with crispy bacon and golden breadcrumb topping in a baking dish, food photography' },
  { slug: 'crevettes-coco-panees', theme: 'Crevettes panées à la noix de coco avec sauce sweet chili', imagePrompt: 'coconut breaded shrimp golden and crispy on a plate with sweet chili dipping sauce, food photography' },
  { slug: 'chili-con-carne-superbowl', theme: 'Chili con carne bien épicé, garni de fromage et crème sure', imagePrompt: 'hearty chili con carne in a bowl topped with shredded cheese, sour cream and jalapeños, food photography' },
  { slug: 'cotes-levees-sauce-bbq-maison', theme: 'Côtes levées BBQ cuites lentement avec sauce maison collante', imagePrompt: 'sticky BBQ baby back ribs with caramelized glaze on a cutting board, food photography, dark background' },
];

// ============================================
// OPENAI HELPERS
// ============================================

async function generateRecipeWithGPT(concept: typeof RECIPE_CONCEPTS[0]): Promise<any> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Tu es une chroniqueuse culinaire québécoise experte. Tu génères des recettes complètes et authentiques en JSON.
Ton style est chaleureux, québécois, engageant. Tu utilises des expressions québécoises naturelles.
IMPORTANT: Toutes les recettes doivent être ORIGINALES - ne copie aucune recette existante.`
      },
      {
        role: 'user',
        content: `Génère une recette complète pour le Super Bowl sur ce thème: "${concept.theme}"

Retourne un JSON avec EXACTEMENT cette structure:
{
  "fr": {
    "title": "Titre en français (accrocheur, max 60 chars)",
    "excerpt": "Description courte (1-2 phrases, max 200 chars)",
    "content": "Astuces et conseils (2-3 phrases)",
    "introduction": "Introduction engageante (2 paragraphes séparés par \\n\\n)",
    "conclusion": "Conclusion avec suggestions de service (1-2 paragraphes séparés par \\n\\n)",
    "seo_title": "Titre SEO optimisé | Menucochon",
    "seo_description": "Meta description SEO (max 160 chars)",
    "ingredients": [{"title": "Nom du groupe", "items": [{"quantity": "2", "unit": "c. à soupe", "name": "nom", "note": "optionnel"}]}],
    "instructions": [{"step": 1, "title": "Titre étape", "content": "Description détaillée", "tip": "Astuce optionnelle"}],
    "faq": [
      {"question_fr": "Question?", "answer_fr": "Réponse.", "question_en": "Question?", "answer_en": "Answer."},
      {"question_fr": "Question?", "answer_fr": "Réponse.", "question_en": "Question?", "answer_en": "Answer."},
      {"question_fr": "Question?", "answer_fr": "Réponse.", "question_en": "Question?", "answer_en": "Answer."}
    ]
  },
  "en": {
    "title": "English title (catchy, max 60 chars)",
    "slug_en": "generate-a-relevant-english-slug-here",
    "excerpt": "Short description (1-2 sentences, max 200 chars)",
    "content": "Tips and tricks (2-3 sentences)",
    "introduction": "Engaging introduction (2 paragraphs separated by \\n\\n)",
    "conclusion": "Conclusion with serving suggestions (1-2 paragraphs separated by \\n\\n)",
    "seo_title": "SEO optimized title | Menucochon",
    "seo_description": "SEO meta description (max 160 chars)",
    "ingredients": [{"title": "Group name", "items": [{"quantity": "2", "unit": "tbsp", "name": "name", "note": "optional"}]}],
    "instructions": [{"step": 1, "title": "Step title", "content": "Detailed description", "tip": "Optional tip"}]
  },
  "meta": {
    "prep_time": 15,
    "cook_time": 25,
    "rest_time": 0,
    "total_time": 40,
    "servings": 6,
    "servings_unit": "portions",
    "difficulty": "facile",
    "tags": ["super-bowl", "finger-food", "autre-tag"],
    "cuisine": "Québécoise",
    "nutrition": {"calories": 350, "protein": 15, "carbs": 30, "fat": 18, "fiber": 2, "sugar": 5, "sodium": 600}
  }
}

IMPORTANT pour slug_en: génère un slug anglais pertinent (ex: "buffalo-chicken-wings", "loaded-nachos-supreme").
Assure-toi que les quantités, temps de cuisson et nutrition sont RÉALISTES.
Les tags doivent toujours inclure "super-bowl".`
      }
    ],
    temperature: 0.8,
    max_tokens: 3000,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('Empty response from GPT');
  return JSON.parse(content);
}

async function generateImage(prompt: string, slug: string): Promise<Buffer | null> {
  if (SKIP_IMAGES) return null;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Professional food photography: ${prompt}. Shot on Canon 5D Mark IV, 50mm lens, f/2.8, natural lighting, shallow depth of field. NO text, NO watermarks, NO labels.`,
      n: 1,
      size: '1024x1792', // Portrait format
      quality: 'standard',
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) return null;

    const imageResponse = await fetch(imageUrl);
    return Buffer.from(await imageResponse.arrayBuffer());
  } catch (error) {
    console.error(`  Image generation failed for ${slug}:`, error);
    return null;
  }
}

async function uploadImage(buffer: Buffer, slug: string): Promise<string | null> {
  const fileName = `recipes/${slug}.png`;

  const { error: uploadError } = await supabase.storage
    .from('recipe-images')
    .upload(fileName, buffer, {
      contentType: 'image/png',
      cacheControl: '31536000',
      upsert: true,
    });

  if (uploadError) {
    console.error(`  Upload error for ${slug}:`, uploadError.message);
    return null;
  }

  const { data } = supabase.storage.from('recipe-images').getPublicUrl(fileName);
  return data.publicUrl;
}

// ============================================
// ARTICLE GENERATION
// ============================================

async function generateArticle(recipes: { id: number; slug: string; title_fr: string; title_en: string; excerpt_fr: string; excerpt_en: string; imageUrl: string | null }[]): Promise<any> {
  const recipeListFr = recipes.map((r, i) => `${i + 1}. ${r.title_fr} (slug: ${r.slug})`).join('\n');
  const recipeListEn = recipes.map((r, i) => `${i + 1}. ${r.title_en} (slug: ${r.slug})`).join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Tu es une chroniqueuse culinaire québécoise passionnée. Tu écris des articles de blog engageants, drôles et chaleureux. Style conversationnel québécois.`
      },
      {
        role: 'user',
        content: `Écris un article de blog complet pour le Super Bowl présentant ces 20 recettes.

RECETTES FRANÇAISES:
${recipeListFr}

RECETTES ANGLAISES:
${recipeListEn}

L'article DOIT contenir du HTML valide pour le content. Pour CHAQUE recette, inclus:
- Un sous-titre h2 avec le nom de la recette
- Une image avec la balise: <img src="IMAGE_PLACEHOLDER_{index}" alt="titre" />
- Un paragraphe d'introduction engageant (2-3 phrases)
- Un lien CTA vers la recette: <a href="/recette/{slug}/" class="recipe-cta">Voir la recette complète →</a> (FR) ou <a href="/en/recipe/{slug_en}/" class="recipe-cta">See full recipe →</a> (EN)

Retourne un JSON:
{
  "fr": {
    "slug": "20-recettes-super-bowl-2026",
    "title": "Titre accrocheur de l'article (max 70 chars)",
    "excerpt": "Description courte (max 200 chars)",
    "content": "<article>HTML complet avec les 20 recettes...</article>",
    "seo_title": "Titre SEO | Menucochon",
    "seo_description": "Meta description (max 160 chars)",
    "tags": ["super-bowl", "recettes", "party"]
  },
  "en": {
    "slug": "20-super-bowl-recipes-2026",
    "title": "Catchy English article title (max 70 chars)",
    "excerpt": "Short description (max 200 chars)",
    "content": "<article>Full HTML with all 20 recipes...</article>",
    "seo_title": "SEO Title | Menucochon",
    "seo_description": "Meta description (max 160 chars)"
  }
}

IMPORTANT: L'article doit avoir une introduction générale fun sur le Super Bowl, puis présenter chaque recette avec enthousiasme. Termine avec une conclusion qui donne envie. Utilise des emojis avec modération (🏈🍗🧀).`
      }
    ],
    temperature: 0.8,
    max_tokens: 8000,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('Empty article response');
  return JSON.parse(content);
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('🏈 Génération Super Bowl 2026 - 20 Recettes + Article');
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN' : 'PRODUCTION'}`);
  console.log(`   Images: ${SKIP_IMAGES ? 'SKIP' : 'GENERATE'}`);
  console.log('');

  const insertedRecipes: { id: number; slug: string; title_fr: string; title_en: string; excerpt_fr: string; excerpt_en: string; slug_en: string; imageUrl: string | null }[] = [];
  let success = 0;
  let failed = 0;

  // STEP 1: Generate and insert 20 recipes
  for (let i = 0; i < RECIPE_CONCEPTS.length; i++) {
    const concept = RECIPE_CONCEPTS[i];
    console.log(`\n[${i + 1}/20] 🍗 ${concept.slug}`);

    try {
      // Check if recipe already exists
      const { data: existing } = await supabase.from('recipes').select('id').eq('slug', concept.slug).single();
      if (existing) {
        console.log('  ⏭️  Already exists, skipping');
        // Still need to track it for the article
        const { data: rec } = await supabase.from('recipes').select('id, title, excerpt').eq('slug', concept.slug).single();
        const { data: trans } = await supabase.from('recipe_translations').select('title, excerpt, slug_en').eq('recipe_id', rec?.id).eq('locale', 'en').single();
        if (rec) {
          insertedRecipes.push({
            id: rec.id,
            slug: concept.slug,
            title_fr: rec.title,
            title_en: trans?.title || rec.title,
            excerpt_fr: rec.excerpt || '',
            excerpt_en: trans?.excerpt || '',
            slug_en: trans?.slug_en || concept.slug,
            imageUrl: null,
          });
        }
        success++;
        continue;
      }

      // Generate recipe content with GPT
      console.log('  📝 Generating recipe with GPT-4o...');
      const recipe = await generateRecipeWithGPT(concept);

      // Generate image with DALL-E
      let imageUrl: string | null = null;
      if (!SKIP_IMAGES) {
        console.log('  🎨 Generating image with DALL-E...');
        const imageBuffer = await generateImage(concept.imagePrompt, concept.slug);
        if (imageBuffer && !DRY_RUN) {
          imageUrl = await uploadImage(imageBuffer, concept.slug);
          console.log('  📤 Image uploaded:', imageUrl?.substring(0, 60) + '...');
        }
      }

      if (DRY_RUN) {
        console.log('  FR:', recipe.fr.title);
        console.log('  EN:', recipe.en.title);
        insertedRecipes.push({
          id: 0,
          slug: concept.slug,
          title_fr: recipe.fr.title,
          title_en: recipe.en.title,
          excerpt_fr: recipe.fr.excerpt,
          excerpt_en: recipe.en.excerpt,
          slug_en: recipe.en.slug_en || concept.slug,
          imageUrl,
        });
        success++;
        continue;
      }

      // Insert recipe into DB
      console.log('  💾 Inserting recipe...');
      const faqData = {
        id: null,
        title_fr: `FAQ – ${recipe.fr.title}`,
        title_en: `FAQ – ${recipe.en.title}`,
        faq: recipe.fr.faq || [],
      };

      const { data: inserted, error: insertError } = await supabase.from('recipes').insert({
        slug: concept.slug,
        title: recipe.fr.title,
        excerpt: recipe.fr.excerpt,
        content: recipe.fr.content,
        introduction: recipe.fr.introduction,
        conclusion: recipe.fr.conclusion,
        featured_image: imageUrl,
        prep_time: recipe.meta.prep_time,
        cook_time: recipe.meta.cook_time,
        rest_time: recipe.meta.rest_time || 0,
        total_time: recipe.meta.total_time,
        servings: recipe.meta.servings,
        servings_unit: recipe.meta.servings_unit || 'portions',
        difficulty: recipe.meta.difficulty || 'facile',
        ingredients: recipe.fr.ingredients,
        instructions: recipe.fr.instructions,
        nutrition: recipe.meta.nutrition,
        tags: recipe.meta.tags || ['super-bowl'],
        cuisine: recipe.meta.cuisine || 'Québécoise',
        author: 'Menucochon',
        seo_title: recipe.fr.seo_title,
        seo_description: recipe.fr.seo_description,
        faq: JSON.stringify(faqData),
      }).select('id').single();

      if (insertError) {
        console.error('  ❌ Insert error:', insertError.message);
        failed++;
        continue;
      }

      console.log('  ✅ Recipe ID:', inserted.id);

      // Add categories: Soupes (10) or Amuse-gueules (27), Canada (23)
      const categoryIds = [27, 23]; // Amuse-gueules + Canada by default
      if (concept.slug.includes('chili')) categoryIds.push(10); // Soupes
      if (concept.slug.includes('poulet') || concept.slug.includes('ailes')) categoryIds.push(22); // Poulet
      if (concept.slug.includes('burger')) categoryIds.push(37); // Boeuf
      if (concept.slug.includes('cotes-levees')) categoryIds.push(4); // Porc

      await supabase.from('recipe_categories').insert(
        categoryIds.map(catId => ({ recipe_id: inserted.id, category_id: catId }))
      );

      // Add English translation
      const slugEn = recipe.en.slug_en || concept.slug;
      await supabase.from('recipe_translations').insert({
        recipe_id: inserted.id,
        locale: 'en',
        slug_en: slugEn,
        title: recipe.en.title,
        excerpt: recipe.en.excerpt,
        content: recipe.en.content,
        introduction: recipe.en.introduction,
        conclusion: recipe.en.conclusion,
        ingredients: recipe.en.ingredients,
        instructions: recipe.en.instructions,
        seo_title: recipe.en.seo_title,
        seo_description: recipe.en.seo_description,
        faq: JSON.stringify(recipe.fr.faq || []),
      });

      insertedRecipes.push({
        id: inserted.id,
        slug: concept.slug,
        title_fr: recipe.fr.title,
        title_en: recipe.en.title,
        excerpt_fr: recipe.fr.excerpt,
        excerpt_en: recipe.en.excerpt,
        slug_en: slugEn,
        imageUrl,
      });

      success++;
      console.log('  ✅ Done!');

      // Delay between API calls
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`  ❌ Error:`, error instanceof Error ? error.message : error);
      failed++;
    }
  }

  // STEP 2: Generate and insert blog article
  console.log('\n\n📰 Generating blog article...');
  try {
    const article = await generateArticle(insertedRecipes);

    // Replace image placeholders with actual URLs
    let contentFr = article.fr.content;
    let contentEn = article.en.content;

    insertedRecipes.forEach((recipe, index) => {
      const imgTag = recipe.imageUrl
        ? `<img src="${recipe.imageUrl}" alt="${recipe.title_fr}" style="width:100%;border-radius:8px;margin:16px 0;" />`
        : '';
      const imgTagEn = recipe.imageUrl
        ? `<img src="${recipe.imageUrl}" alt="${recipe.title_en}" style="width:100%;border-radius:8px;margin:16px 0;" />`
        : '';
      contentFr = contentFr.replace(`IMAGE_PLACEHOLDER_${index}`, recipe.imageUrl || '');
      contentEn = contentEn.replace(`IMAGE_PLACEHOLDER_${index}`, recipe.imageUrl || '');
    });

    // Also fix CTA links for English version to use slug_en
    insertedRecipes.forEach((recipe) => {
      contentEn = contentEn.replace(
        new RegExp(`/en/recipe/${recipe.slug}/`, 'g'),
        `/en/recipe/${recipe.slug_en}/`
      );
    });

    if (!DRY_RUN) {
      // Insert French article
      const { data: post, error: postError } = await supabase.from('posts').insert({
        slug: article.fr.slug,
        title: article.fr.title,
        excerpt: article.fr.excerpt,
        content: contentFr,
        author_id: 1,
        tags: article.fr.tags || ['super-bowl'],
        reading_time: 12,
        status: 'published',
        seo_title: article.fr.seo_title,
        seo_description: article.fr.seo_description,
      }).select('id').single();

      if (postError) {
        console.error('❌ Article insert error:', postError.message);
      } else {
        console.log('✅ Article FR inserted, ID:', post.id);

        // Add category: Recettes (8)
        await supabase.from('posts_categories').insert({ post_id: post.id, category_id: 8 });

        // Insert English translation
        const { error: transError } = await supabase.from('post_translations').insert({
          post_id: post.id,
          locale: 'en',
          title: article.en.title,
          excerpt: article.en.excerpt,
          content: contentEn,
          seo_title: article.en.seo_title,
          seo_description: article.en.seo_description,
        });

        if (transError) console.error('❌ Article EN translation error:', transError.message);
        else console.log('✅ Article EN translation inserted');
      }
    } else {
      console.log('DRY RUN - Article FR:', article.fr.title);
      console.log('DRY RUN - Article EN:', article.en.title);
    }
  } catch (error) {
    console.error('❌ Article generation error:', error instanceof Error ? error.message : error);
  }

  // Summary
  console.log('\n========================================');
  console.log('🏈 SUPER BOWL 2026 - RÉSUMÉ');
  console.log(`✅ Recettes réussies: ${success}/20`);
  console.log(`❌ Recettes échouées: ${failed}/20`);
  console.log(`📷 Images: ${SKIP_IMAGES ? 'Skipped' : 'Generated'}`);
  if (DRY_RUN) console.log('\n⚠️  Mode dry-run - rien sauvegardé');
}

main().catch(console.error);
