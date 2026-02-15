import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// CATEGORIES
// ============================================================
const CATEGORIES = [
  { name: 'Chicken', slug: 'chicken' },
  { name: 'Beef', slug: 'beef' },
  { name: 'Pork', slug: 'pork' },
  { name: 'Seafood', slug: 'seafood' },
  { name: 'Burgers', slug: 'burgers' },
  { name: 'Ribs', slug: 'ribs' },
  { name: 'Sides & Veggies', slug: 'sides-veggies' },
];

// ============================================================
// 49 RECIPES (beer-can chicken already exists)
// ============================================================
const RECIPES = [
  // RIBS
  { name: 'BBQ Ribs with Homemade Sauce', slug: 'bbq-ribs-homemade-sauce', category: 'ribs', imageHint: 'rack of BBQ ribs with shiny glaze sauce on a grill' },
  { name: 'Dry Rub Spareribs', slug: 'dry-rub-spareribs', category: 'ribs', imageHint: 'spareribs with dry spice rub crust on a smoker' },

  // CHICKEN
  { name: 'BBQ Chicken Wings - Honey Garlic, Buffalo & Sweet Spicy', slug: 'bbq-chicken-wings', category: 'chicken', imageHint: 'platter of BBQ chicken wings with three different sauces' },
  { name: 'Grilled Chicken Thighs - Lemon Garlic Herb', slug: 'grilled-chicken-thighs-lemon-garlic', category: 'chicken', imageHint: 'grilled chicken thighs with lemon slices and fresh herbs' },
  { name: 'Chicken Skewers with Peppers, Onions & Pineapple', slug: 'chicken-skewers-peppers-pineapple', category: 'chicken', imageHint: 'colorful chicken skewers with grilled peppers onions and pineapple' },
  { name: 'Jamaican Jerk Chicken', slug: 'jamaican-jerk-chicken', category: 'chicken', imageHint: 'jerk chicken with Caribbean spices on a charcoal grill' },
  { name: 'Mustard Maple BBQ Chicken', slug: 'mustard-maple-bbq-chicken', category: 'chicken', imageHint: 'BBQ chicken glazed with mustard and maple syrup' },
  { name: 'Peri-Peri Chicken', slug: 'peri-peri-chicken', category: 'chicken', imageHint: 'spicy peri-peri chicken with chili peppers on a grill' },

  // SAUSAGES & HOT DOGS
  { name: 'Grilled Sausages - Italian, Chorizo & Merguez', slug: 'grilled-sausages-italian-chorizo-merguez', category: 'pork', imageHint: 'assorted grilled sausages italian chorizo merguez on a grill' },
  { name: 'BBQ Hot Dogs with Caramelized Onions', slug: 'bbq-hot-dogs-caramelized-onions', category: 'pork', imageHint: 'loaded BBQ hot dogs with caramelized onions relish and mustard' },

  // BURGERS
  { name: 'Classic Beef Burgers', slug: 'classic-beef-burgers', category: 'burgers', imageHint: 'juicy classic beef burger with lettuce tomato on a bun' },
  { name: 'Bacon Cheeseburgers', slug: 'bacon-cheeseburgers', category: 'burgers', imageHint: 'bacon cheeseburger with melted cheddar and crispy bacon' },
  { name: 'Smash Burgers on the Griddle', slug: 'smash-burgers-griddle', category: 'burgers', imageHint: 'smash burger being pressed on a flat griddle with crispy edges' },
  { name: 'Turkey Burgers', slug: 'turkey-burgers', category: 'burgers', imageHint: 'healthy turkey burger with avocado and fresh toppings' },
  { name: 'Salmon Burgers', slug: 'salmon-burgers', category: 'burgers', imageHint: 'grilled salmon burger with dill sauce and greens' },
  { name: 'Veggie Burgers - Black Bean & Chickpea', slug: 'veggie-burgers-black-bean-chickpea', category: 'burgers', imageHint: 'veggie burger made with black beans and chickpeas' },
  { name: 'Poutine Burgers with Cheese Curds & Gravy', slug: 'poutine-burgers', category: 'burgers', imageHint: 'burger topped with cheese curds and gravy poutine style' },
  { name: 'BBQ Sliders - Mini Burgers', slug: 'bbq-sliders', category: 'burgers', imageHint: 'row of mini BBQ slider burgers on a wooden board' },

  // PULLED PORK
  { name: 'Pulled Pork', slug: 'pulled-pork', category: 'pork', imageHint: 'slow smoked pulled pork being shredded with forks' },
  { name: 'Pulled Pork Sandwich with Coleslaw', slug: 'pulled-pork-sandwich-coleslaw', category: 'pork', imageHint: 'pulled pork sandwich piled high with creamy coleslaw' },

  // BEEF
  { name: 'Grilled Ribeye Steak', slug: 'grilled-ribeye-steak', category: 'beef', imageHint: 'perfectly grilled ribeye steak with grill marks' },
  { name: 'Marinated Flank Steak - Soy Garlic Lime', slug: 'marinated-flank-steak-soy-garlic-lime', category: 'beef', imageHint: 'sliced marinated flank steak with lime wedges' },
  { name: 'Beef Shish Kebab Skewers', slug: 'beef-shish-kebab', category: 'beef', imageHint: 'beef shish kebab skewers with peppers and onions on a grill' },
  { name: 'Cajun Spiced Beef Burgers', slug: 'cajun-beef-burgers', category: 'burgers', imageHint: 'spicy cajun seasoned beef burger with pepper jack cheese' },
  { name: 'Smoked Beef Brisket', slug: 'smoked-beef-brisket', category: 'beef', imageHint: 'sliced smoked beef brisket with smoke ring' },
  { name: 'Grilled Tri-Tip', slug: 'grilled-tri-tip', category: 'beef', imageHint: 'grilled tri-tip roast sliced on a cutting board' },
  { name: 'Tomahawk Steak', slug: 'tomahawk-steak', category: 'beef', imageHint: 'massive tomahawk steak on a grill with flames' },
  { name: 'Steak with Chimichurri Sauce', slug: 'steak-chimichurri', category: 'beef', imageHint: 'grilled steak topped with green chimichurri herb sauce' },
  { name: 'Grilled Beef Tacos - Carne Asada', slug: 'carne-asada-tacos', category: 'beef', imageHint: 'carne asada tacos with grilled beef cilantro and lime' },

  // PORK
  { name: 'BBQ Pork Chops', slug: 'bbq-pork-chops', category: 'pork', imageHint: 'thick BBQ pork chops with char marks on a grill' },
  { name: 'Grilled Pork Tenderloin - Mustard Maple', slug: 'grilled-pork-tenderloin-mustard-maple', category: 'pork', imageHint: 'sliced grilled pork tenderloin with mustard maple glaze' },
  { name: 'Pork & Pineapple Skewers', slug: 'pork-pineapple-skewers', category: 'pork', imageHint: 'sweet and savory pork and pineapple skewers on a grill' },
  { name: 'Maple Pulled Pork', slug: 'maple-pulled-pork', category: 'pork', imageHint: 'maple glazed pulled pork with caramelized edges' },
  { name: 'Pork Sausage Patty Burgers', slug: 'pork-sausage-patty-burgers', category: 'pork', imageHint: 'pork sausage patty burger with apple slaw' },
  { name: 'Mediterranean Pork Kebabs', slug: 'mediterranean-pork-kebabs', category: 'pork', imageHint: 'Mediterranean style pork kebabs with herbs and vegetables' },
  { name: 'BBQ Tonkatsu - Grilled Breaded Pork', slug: 'bbq-tonkatsu', category: 'pork', imageHint: 'Japanese tonkatsu breaded pork cutlet on a grill' },
  { name: 'Korean BBQ Pork - Gochujang', slug: 'korean-bbq-pork-gochujang', category: 'pork', imageHint: 'Korean BBQ pork with gochujang glaze and sesame seeds' },
  { name: 'Pork Souvlaki', slug: 'pork-souvlaki', category: 'pork', imageHint: 'Greek pork souvlaki skewers with tzatziki' },
  { name: 'Char Siu BBQ Pork', slug: 'char-siu-bbq-pork', category: 'pork', imageHint: 'Chinese char siu BBQ pork with red glaze' },

  // SEAFOOD
  { name: 'Cedar Plank Salmon', slug: 'cedar-plank-salmon', category: 'seafood', imageHint: 'salmon fillet on a cedar plank on a grill with smoke' },
  { name: 'Grilled Trout with Lemon', slug: 'grilled-trout-lemon', category: 'seafood', imageHint: 'whole grilled trout with lemon slices and fresh herbs' },
  { name: 'Garlic Lemon Grilled Shrimp', slug: 'garlic-lemon-grilled-shrimp', category: 'seafood', imageHint: 'jumbo grilled shrimp with garlic and lemon on skewers' },
  { name: 'BBQ Lobster with Garlic Butter', slug: 'bbq-lobster-garlic-butter', category: 'seafood', imageHint: 'BBQ lobster tails with melted garlic butter' },
  { name: 'Grilled Fish en Papillote', slug: 'grilled-fish-en-papillote', category: 'seafood', imageHint: 'fish fillet in foil packet with vegetables and herbs on a grill' },
  { name: 'Shrimp & Pineapple Skewers', slug: 'shrimp-pineapple-skewers', category: 'seafood', imageHint: 'shrimp and pineapple skewers with sweet glaze on a grill' },
  { name: 'Grilled Fish Tacos', slug: 'grilled-fish-tacos', category: 'seafood', imageHint: 'grilled fish tacos with cabbage slaw and lime crema' },

  // SIDES & VEGGIES
  { name: 'Grilled Corn with Paprika Lime Butter', slug: 'grilled-corn-paprika-lime-butter', category: 'sides-veggies', imageHint: 'grilled corn on the cob with butter paprika and lime' },
  { name: 'Grilled Vegetables - Zucchini, Eggplant & Peppers', slug: 'grilled-vegetables', category: 'sides-veggies', imageHint: 'colorful grilled vegetables zucchini eggplant and peppers' },
  { name: 'Grilled Pineapple with Brown Sugar & Cinnamon', slug: 'grilled-pineapple-brown-sugar-cinnamon', category: 'sides-veggies', imageHint: 'caramelized grilled pineapple rings with cinnamon' },
];

// ============================================================
// HELPERS
// ============================================================
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ensureCategories(): Promise<Record<string, number>> {
  console.log('Setting up categories...');
  const categoryMap: Record<string, number> = {};

  for (const cat of CATEGORIES) {
    // Check if exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', cat.slug)
      .single();

    if (existing) {
      categoryMap[cat.slug] = existing.id;
      console.log(`  Category "${cat.name}" already exists (ID: ${existing.id})`);
    } else {
      const { data: created, error } = await supabase
        .from('categories')
        .insert({ name: cat.name, slug: cat.slug })
        .select('id')
        .single();

      if (error) {
        console.error(`  Error creating category "${cat.name}":`, error);
        continue;
      }
      categoryMap[cat.slug] = created.id;
      console.log(`  Created category "${cat.name}" (ID: ${created.id})`);
    }
  }

  return categoryMap;
}

async function generateRecipeContent(recipeName: string): Promise<any> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a BBQ recipe expert for "Fresh N' Grill", a BBQ recipe website. Generate a detailed recipe in English. Return JSON:

{
  "title": "Recipe title (max 60 chars)",
  "slug": "url-slug",
  "excerpt": "Appetizing description (max 200 chars)",
  "content": "2-3 practical tips & tricks",
  "introduction": "2-3 engaging paragraphs about this dish separated by \\n\\n",
  "conclusion": "1-2 paragraphs about serving suggestions separated by \\n\\n",
  "seo_title": "SEO title (max 60 chars)",
  "seo_description": "Meta description (max 160 chars)",
  "prep_time": number,
  "cook_time": number,
  "rest_time": number,
  "total_time": number,
  "servings": number,
  "servings_unit": "servings",
  "difficulty": "easy"|"medium"|"hard",
  "cuisine": "American"|"Jamaican"|"Korean"|"Japanese"|"Greek"|"Mexican"|"Mediterranean"|"Chinese",
  "tags": ["bbq", "grilling", ...max 5],
  "ingredients": [{"title":"Group","items":[{"quantity":"2","unit":"tbsp","name":"name","note":"optional"}]}],
  "instructions": [{"step":1,"title":"Step","content":"Description","tip":"Optional pro tip"}],
  "nutrition": {"calories":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"sodium":number}
}

Be authentic and detailed. Include proper BBQ techniques, temperatures, and timing.`
      },
      {
        role: 'user',
        content: `Generate a complete BBQ recipe for: ${recipeName}`
      }
    ],
    temperature: 0.7,
    max_tokens: 3500,
  });

  return JSON.parse(response.choices[0].message.content!);
}

async function generateCartoonImage(imageHint: string): Promise<string | null> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `A stunning, mouth-watering food photography shot of ${imageHint}. The food fills the entire frame edge to edge with no borders or empty space. Shot from a slightly elevated angle. Rustic wooden table or grill in the background. Warm, natural golden lighting. Professional food photography style, extreme detail, appetizing, vibrant colors. No text, no watermarks. The image must fill the entire canvas completely with no black bars, no borders, no letterboxing.`,
      n: 1,
      size: '1024x1792',
      quality: 'hd',
    });
    return response.data?.[0]?.url ?? null;
  } catch (error: any) {
    console.error(`    Image generation failed: ${error.message}`);
    return null;
  }
}

async function uploadImage(imageUrl: string, slug: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    const filePath = `${slug}/${slug}-pinterest.png`;
    const { error } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, buffer, { contentType: 'image/png', upsert: true });

    if (error) {
      console.error(`    Upload failed:`, error);
      return null;
    }

    const { data } = supabase.storage.from('recipe-images').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error: any) {
    console.error(`    Upload error: ${error.message}`);
    return null;
  }
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('==============================================');
  console.log("  FRESH N' GRILL - 49 BBQ Recipe Generator");
  console.log('==============================================\n');

  // 1. Setup categories
  const categoryMap = await ensureCategories();
  console.log(`\nCategories ready: ${Object.keys(categoryMap).length}\n`);

  // 2. Check which recipes already exist
  const { data: existingRecipes } = await supabase
    .from('recipes')
    .select('slug');
  const existingSlugs = new Set((existingRecipes || []).map(r => r.slug));

  const recipesToCreate = RECIPES.filter(r => !existingSlugs.has(r.slug));
  console.log(`Recipes to create: ${recipesToCreate.length} (${existingSlugs.size} already exist)\n`);

  if (recipesToCreate.length === 0) {
    console.log('All recipes already exist!');
    return;
  }

  // 3. Process recipes
  let success = 0;
  let failed = 0;

  for (let i = 0; i < recipesToCreate.length; i++) {
    const recipe = recipesToCreate[i];
    const progress = `[${i + 1}/${recipesToCreate.length}]`;

    console.log(`${progress} ${recipe.name}`);

    try {
      // Generate recipe content
      console.log(`  Generating content...`);
      const content = await generateRecipeContent(recipe.name);

      // Generate cartoon image
      console.log(`  Generating cartoon image...`);
      const imageUrl = await generateCartoonImage(recipe.imageHint);

      let publicImageUrl: string | null = null;
      if (imageUrl) {
        console.log(`  Uploading image...`);
        publicImageUrl = await uploadImage(imageUrl, recipe.slug);
      }

      // Build FAQ HTML
      const faqHtml = content.faq?.map((f: any) =>
        `<h3>${f.question}</h3>\n<p>${f.answer}</p>`
      ).join('\n\n') || null;

      // Insert recipe
      const { data: inserted, error } = await supabase
        .from('recipes')
        .insert({
          slug: recipe.slug,
          title: content.title || recipe.name,
          excerpt: content.excerpt,
          content: content.content,
          introduction: content.introduction,
          conclusion: content.conclusion,
          featured_image: publicImageUrl,
          pinterest_image: publicImageUrl,
          pinterest_title: `${content.title || recipe.name} | Fresh N' Grill`,
          pinterest_description: content.seo_description,
          prep_time: content.prep_time || 0,
          cook_time: content.cook_time || 0,
          rest_time: content.rest_time || 0,
          total_time: content.total_time || 0,
          servings: content.servings || 4,
          servings_unit: content.servings_unit || 'servings',
          difficulty: content.difficulty || 'medium',
          cuisine: content.cuisine || 'American',
          ingredients: content.ingredients || [],
          instructions: content.instructions || [],
          nutrition: content.nutrition || null,
          tags: content.tags || [],
          faq: faqHtml,
          seo_title: content.seo_title,
          seo_description: content.seo_description,
          author: "Fresh N' Grill",
          published_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) {
        console.error(`  DB Error:`, error);
        failed++;
        continue;
      }

      // Link category
      const categoryId = categoryMap[recipe.category];
      if (categoryId && inserted) {
        await supabase
          .from('recipe_categories')
          .insert({ recipe_id: inserted.id, category_id: categoryId });
      }

      console.log(`  Done! ID: ${inserted?.id} | Image: ${publicImageUrl ? 'Yes' : 'No'}`);
      success++;

      // Rate limit delay: wait between recipes to avoid DALL-E rate limits
      if (i < recipesToCreate.length - 1) {
        console.log(`  Waiting 12s (rate limit)...\n`);
        await sleep(12000);
      }

    } catch (error: any) {
      console.error(`  FAILED: ${error.message}`);
      failed++;
      await sleep(5000); // wait on error too
    }
  }

  console.log('\n==============================================');
  console.log(`  DONE! ${success} created, ${failed} failed`);
  console.log('==============================================');
}

main().catch(console.error);
