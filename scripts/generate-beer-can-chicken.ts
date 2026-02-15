import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateBeerCanChicken() {
  console.log('Generating Beer-Can Chicken recipe with GPT-4o...\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a BBQ recipe expert. Generate a detailed, authentic Beer-Can Chicken recipe in English. Return a JSON object with this exact structure:

{
  "title": "Recipe title (max 60 chars)",
  "slug": "beer-can-chicken",
  "excerpt": "Short description (max 200 chars)",
  "content": "Tips and tricks paragraph",
  "introduction": "2-3 paragraphs about the recipe separated by \\n\\n",
  "conclusion": "1-2 paragraphs wrapping up, separated by \\n\\n",
  "seo_title": "SEO optimized title (max 60 chars)",
  "seo_description": "Meta description (max 160 chars)",
  "prep_time": number (minutes),
  "cook_time": number (minutes),
  "rest_time": number (minutes),
  "total_time": number (minutes),
  "servings": number,
  "servings_unit": "servings",
  "difficulty": "easy" | "medium" | "hard",
  "cuisine": "American",
  "tags": ["bbq", "chicken", "grilling", ...],
  "ingredients": [
    {
      "title": "Group name (e.g. 'Dry Rub', 'Chicken')",
      "items": [
        { "quantity": "2", "unit": "tbsp", "name": "ingredient name", "note": "optional note" }
      ]
    }
  ],
  "instructions": [
    { "step": 1, "title": "Step title", "content": "Detailed step description", "tip": "Optional pro tip" }
  ],
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number,
    "sodium": number
  },
  "faq": [
    { "question": "Question?", "answer": "Answer" }
  ]
}

Make the recipe authentic, detailed, and suitable for a BBQ enthusiast. Include a flavorful dry rub, proper beer can technique, and grilling instructions. The introduction should be engaging and talk about why beer-can chicken is a BBQ classic.`
      },
      {
        role: 'user',
        content: 'Generate a complete Beer-Can Chicken recipe for a BBQ recipe website called Fresh N\' Grill.'
      }
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const recipe = JSON.parse(response.choices[0].message.content!);
  console.log(`Recipe generated: ${recipe.title}`);
  console.log(`Prep: ${recipe.prep_time}min | Cook: ${recipe.cook_time}min | Total: ${recipe.total_time}min`);
  console.log(`Difficulty: ${recipe.difficulty} | Servings: ${recipe.servings}`);
  console.log(`Ingredients groups: ${recipe.ingredients.length}`);
  console.log(`Steps: ${recipe.instructions.length}`);
  console.log(`FAQ: ${recipe.faq?.length || 0} questions\n`);

  // Insert into database
  console.log('Inserting into database...');

  const faqHtml = recipe.faq?.map((f: any) =>
    `<h3>${f.question}</h3>\n<p>${f.answer}</p>`
  ).join('\n\n') || null;

  const { data, error } = await supabase
    .from('recipes')
    .insert({
      slug: recipe.slug,
      title: recipe.title,
      excerpt: recipe.excerpt,
      content: recipe.content,
      introduction: recipe.introduction,
      conclusion: recipe.conclusion,
      prep_time: recipe.prep_time,
      cook_time: recipe.cook_time,
      rest_time: recipe.rest_time || 0,
      total_time: recipe.total_time,
      servings: recipe.servings,
      servings_unit: recipe.servings_unit,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      nutrition: recipe.nutrition,
      tags: recipe.tags,
      faq: faqHtml,
      seo_title: recipe.seo_title,
      seo_description: recipe.seo_description,
      author: "Fresh N' Grill",
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Database error:', error);
    return;
  }

  console.log(`\nRecipe inserted! ID: ${data.id}`);
  console.log(`Slug: ${data.slug}`);
  console.log(`URL: /recipe/${data.slug}`);
  console.log('\nDone!');
}

generateBeerCanChicken().catch(console.error);
