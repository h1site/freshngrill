/**
 * AI Content Translator - Menu Cochon
 *
 * Utilise Ollama localement pour traduire le contenu FR -> EN
 * - Traduction fidele sans invention de contenu
 * - Support: recettes, categories, posts, lexique
 *
 * Usage:
 *   npx tsx scripts/translate-content.ts --type=recipes      # Traduire recettes
 *   npx tsx scripts/translate-content.ts --type=categories   # Traduire categories
 *   npx tsx scripts/translate-content.ts --type=posts        # Traduire posts
 *   npx tsx scripts/translate-content.ts --type=lexique      # Traduire lexique
 *   npx tsx scripts/translate-content.ts --type=all          # Tout traduire
 *
 * Options:
 *   --dry-run      Ne pas sauvegarder dans Supabase
 *   --verbose      Afficher les details
 *   --limit=N      Limiter a N items
 *   --skip=N       Sauter les N premiers items
 *   --id=N         Traduire un item specifique par ID
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'mistral:latest';
const TARGET_LOCALE = 'en';

// Configuration from CLI
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const CONTENT_TYPE = process.argv.find(arg => arg.startsWith('--type='))?.split('=')[1] || 'recipes';
const LIMIT = parseInt(process.argv.find(arg => arg.startsWith('--limit='))?.split('=')[1] || '0');
const SKIP = parseInt(process.argv.find(arg => arg.startsWith('--skip='))?.split('=')[1] || '0');
const SINGLE_ID = parseInt(process.argv.find(arg => arg.startsWith('--id='))?.split('=')[1] || '0');

// ============================================
// OLLAMA HELPER
// ============================================

async function askOllama(prompt: string, maxTokens: number = 3000): Promise<string> {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: {
          num_predict: maxTokens,
          temperature: 0.3, // Lower temperature for more accurate translations
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.response?.trim() || '';
  } catch (error) {
    console.error('Ollama error:', error);
    throw error;
  }
}

function extractJSON(text: string): any {
  // Try to extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // Try fixing common issues
      let fixed = jsonMatch[0]
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/'/g, '"');
      return JSON.parse(fixed);
    }
  }
  return null;
}

// ============================================
// TRANSLATION PROMPTS
// ============================================

function getRecipeTranslationPrompt(recipe: any): string {
  return `You are a professional French to English translator specializing in culinary content.
Translate the following recipe from French to English.

IMPORTANT RULES:
- Translate ONLY, do not invent or add any new content
- Keep ingredient quantities and measurements exactly as they are
- Translate cooking terms accurately (e.g., "faire revenir" = "saute", "faire mijoter" = "simmer")
- Keep proper nouns (brand names, regional names) unchanged
- Translate units: "c. a soupe" = "tbsp", "c. a cafe" = "tsp", "tasse" = "cup"
- If a term has no direct English equivalent, provide the closest translation with the French term in parentheses

RECIPE TO TRANSLATE:
Title: ${recipe.title}
Excerpt: ${recipe.excerpt || ''}
Introduction: ${recipe.introduction || ''}
Conclusion: ${recipe.conclusion || ''}
SEO Title: ${recipe.seo_title || recipe.title}
SEO Description: ${recipe.seo_description || recipe.excerpt || ''}

Ingredients (JSON array):
${JSON.stringify(recipe.ingredients, null, 2)}

Instructions (JSON array):
${JSON.stringify(recipe.instructions, null, 2)}

Respond with ONLY a valid JSON object in this exact format:
{
  "title": "translated title",
  "excerpt": "translated excerpt",
  "introduction": "translated introduction",
  "conclusion": "translated conclusion",
  "seo_title": "translated SEO title (max 60 chars)",
  "seo_description": "translated SEO description (max 160 chars)",
  "ingredients": [translated ingredients array, same structure],
  "instructions": [translated instructions array, same structure]
}`;
}

function getCategoryTranslationPrompt(category: any): string {
  return `Translate this French recipe category name to English.
Keep it short and natural for a recipe website.

French: "${category.name}"

Respond with ONLY the English translation, nothing else.`;
}

function getPostTranslationPrompt(post: any): string {
  return `You are a professional French to English translator.
Translate this blog post from French to English.

IMPORTANT: Translate ONLY, do not invent or add content.

POST TO TRANSLATE:
Title: ${post.title}
Excerpt: ${post.excerpt || ''}
Content:
${post.content?.substring(0, 8000) || ''}

Respond with ONLY a valid JSON object:
{
  "title": "translated title",
  "excerpt": "translated excerpt",
  "content": "translated content (full HTML preserved)",
  "seo_title": "translated SEO title (max 60 chars)",
  "seo_description": "translated meta description (max 160 chars)"
}`;
}

function getLexiqueTranslationPrompt(item: any): string {
  return `Translate this French culinary term and definition to English.

Term: ${item.term}
Definition: ${item.definition || ''}

Respond with ONLY a valid JSON object:
{
  "term": "English term",
  "definition": "English definition"
}`;
}

// ============================================
// TRANSLATION FUNCTIONS
// ============================================

async function translateRecipes() {
  console.log('\n=== TRANSLATING RECIPES ===\n');

  // Get recipes that don't have English translations yet
  let query = supabase
    .from('recipes')
    .select('id, slug, title, excerpt, introduction, conclusion, seo_title, seo_description, ingredients, instructions')
    .order('id', { ascending: true });

  if (SINGLE_ID) {
    query = query.eq('id', SINGLE_ID);
  }

  const { data: recipes, error } = await query;

  if (error || !recipes) {
    console.error('Error fetching recipes:', error);
    return;
  }

  // Get existing translations to skip
  const { data: existingTranslations } = await supabase
    .from('recipe_translations')
    .select('recipe_id')
    .eq('locale', TARGET_LOCALE);

  const translatedIds = new Set(existingTranslations?.map(t => t.recipe_id) || []);

  let recipesToTranslate = recipes.filter(r => !translatedIds.has(r.id));

  if (SKIP > 0) recipesToTranslate = recipesToTranslate.slice(SKIP);
  if (LIMIT > 0) recipesToTranslate = recipesToTranslate.slice(0, LIMIT);

  console.log(`Found ${recipesToTranslate.length} recipes to translate (${recipes.length} total, ${translatedIds.size} already translated)`);

  let successCount = 0;
  let errorCount = 0;

  for (const recipe of recipesToTranslate) {
    try {
      console.log(`\n[${successCount + errorCount + 1}/${recipesToTranslate.length}] Translating: ${recipe.title}`);

      const prompt = getRecipeTranslationPrompt(recipe);
      const response = await askOllama(prompt, 4000);

      if (VERBOSE) {
        console.log('Raw response:', response.substring(0, 500));
      }

      const translation = extractJSON(response);

      if (!translation || !translation.title) {
        console.error(`  ERROR: Could not parse translation for ${recipe.slug}`);
        errorCount++;
        continue;
      }

      if (VERBOSE) {
        console.log('  Title EN:', translation.title);
        console.log('  Excerpt EN:', translation.excerpt?.substring(0, 100));
      }

      if (!DRY_RUN) {
        const { error: insertError } = await supabase
          .from('recipe_translations')
          .upsert({
            recipe_id: recipe.id,
            locale: TARGET_LOCALE,
            title: translation.title,
            excerpt: translation.excerpt,
            introduction: translation.introduction,
            conclusion: translation.conclusion,
            seo_title: translation.seo_title,
            seo_description: translation.seo_description,
            ingredients: translation.ingredients,
            instructions: translation.instructions,
          }, {
            onConflict: 'recipe_id,locale'
          });

        if (insertError) {
          console.error(`  ERROR saving translation:`, insertError.message);
          errorCount++;
          continue;
        }
      }

      console.log(`  OK: ${recipe.title} -> ${translation.title}`);
      successCount++;

      // Small delay to avoid overwhelming Ollama
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`  ERROR translating ${recipe.slug}:`, error);
      errorCount++;
    }
  }

  console.log(`\n=== RECIPES DONE: ${successCount} success, ${errorCount} errors ===`);
}

async function translateCategories() {
  console.log('\n=== TRANSLATING CATEGORIES ===\n');

  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, slug, name')
    .order('name');

  if (error || !categories) {
    console.error('Error fetching categories:', error);
    return;
  }

  // Get existing translations
  const { data: existingTranslations } = await supabase
    .from('category_translations')
    .select('category_id')
    .eq('locale', TARGET_LOCALE);

  const translatedIds = new Set(existingTranslations?.map(t => t.category_id) || []);

  let categoriesToTranslate = categories.filter(c => !translatedIds.has(c.id));

  console.log(`Found ${categoriesToTranslate.length} categories to translate`);

  for (const category of categoriesToTranslate) {
    try {
      console.log(`Translating category: ${category.name}`);

      const prompt = getCategoryTranslationPrompt(category);
      const translation = await askOllama(prompt, 100);

      const translatedName = translation.trim().replace(/^["']|["']$/g, '');

      if (!translatedName) {
        console.error(`  ERROR: Empty translation for ${category.name}`);
        continue;
      }

      if (!DRY_RUN) {
        const { error: insertError } = await supabase
          .from('category_translations')
          .upsert({
            category_id: category.id,
            locale: TARGET_LOCALE,
            name: translatedName,
          }, {
            onConflict: 'category_id,locale'
          });

        if (insertError) {
          console.error(`  ERROR saving:`, insertError.message);
          continue;
        }
      }

      console.log(`  OK: ${category.name} -> ${translatedName}`);

    } catch (error) {
      console.error(`  ERROR:`, error);
    }
  }

  console.log('\n=== CATEGORIES DONE ===');
}

async function translatePosts() {
  console.log('\n=== TRANSLATING POSTS ===\n');

  let query = supabase
    .from('posts')
    .select('id, slug, title, excerpt, content, seo_title, seo_description')
    .eq('status', 'published')
    .order('id');

  if (SINGLE_ID) {
    query = query.eq('id', SINGLE_ID);
  }

  const { data: posts, error } = await query;

  if (error || !posts) {
    console.error('Error fetching posts:', error);
    return;
  }

  // Get existing translations
  const { data: existingTranslations } = await supabase
    .from('post_translations')
    .select('post_id')
    .eq('locale', TARGET_LOCALE);

  const translatedIds = new Set(existingTranslations?.map(t => t.post_id) || []);

  let postsToTranslate = posts.filter(p => !translatedIds.has(p.id));

  if (SKIP > 0) postsToTranslate = postsToTranslate.slice(SKIP);
  if (LIMIT > 0) postsToTranslate = postsToTranslate.slice(0, LIMIT);

  console.log(`Found ${postsToTranslate.length} posts to translate`);

  for (const post of postsToTranslate) {
    try {
      console.log(`Translating post: ${post.title}`);

      const prompt = getPostTranslationPrompt(post);
      const response = await askOllama(prompt, 8000);

      const translation = extractJSON(response);

      if (!translation || !translation.title) {
        console.error(`  ERROR: Could not parse translation`);
        continue;
      }

      if (!DRY_RUN) {
        const { error: insertError } = await supabase
          .from('post_translations')
          .upsert({
            post_id: post.id,
            locale: TARGET_LOCALE,
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content,
            seo_title: translation.seo_title,
            seo_description: translation.seo_description,
          }, {
            onConflict: 'post_id,locale'
          });

        if (insertError) {
          console.error(`  ERROR saving:`, insertError.message);
          continue;
        }
      }

      console.log(`  OK: ${post.title} -> ${translation.title}`);

      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ERROR:`, error);
    }
  }

  console.log('\n=== POSTS DONE ===');
}

async function translateLexique() {
  console.log('\n=== TRANSLATING LEXIQUE ===\n');

  const { data: items, error } = await supabase
    .from('lexique')
    .select('id, slug, term, definition')
    .order('term');

  if (error || !items) {
    console.error('Error fetching lexique:', error);
    return;
  }

  // Get existing translations
  const { data: existingTranslations } = await supabase
    .from('lexique_translations')
    .select('lexique_id')
    .eq('locale', TARGET_LOCALE);

  const translatedIds = new Set(existingTranslations?.map(t => t.lexique_id) || []);

  let itemsToTranslate = items.filter(i => !translatedIds.has(i.id));

  if (LIMIT > 0) itemsToTranslate = itemsToTranslate.slice(0, LIMIT);

  console.log(`Found ${itemsToTranslate.length} lexique items to translate`);

  for (const item of itemsToTranslate) {
    try {
      console.log(`Translating: ${item.term}`);

      const prompt = getLexiqueTranslationPrompt(item);
      const response = await askOllama(prompt, 500);

      const translation = extractJSON(response);

      if (!translation || !translation.term) {
        console.error(`  ERROR: Could not parse translation`);
        continue;
      }

      if (!DRY_RUN) {
        const { error: insertError } = await supabase
          .from('lexique_translations')
          .upsert({
            lexique_id: item.id,
            locale: TARGET_LOCALE,
            term: translation.term,
            definition: translation.definition,
          }, {
            onConflict: 'lexique_id,locale'
          });

        if (insertError) {
          console.error(`  ERROR saving:`, insertError.message);
          continue;
        }
      }

      console.log(`  OK: ${item.term} -> ${translation.term}`);

    } catch (error) {
      console.error(`  ERROR:`, error);
    }
  }

  console.log('\n=== LEXIQUE DONE ===');
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('='.repeat(50));
  console.log('Menu Cochon Content Translator');
  console.log('='.repeat(50));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Target locale: ${TARGET_LOCALE}`);
  console.log(`Content type: ${CONTENT_TYPE}`);
  console.log(`Model: ${MODEL}`);
  if (LIMIT) console.log(`Limit: ${LIMIT}`);
  if (SKIP) console.log(`Skip: ${SKIP}`);
  if (SINGLE_ID) console.log(`Single ID: ${SINGLE_ID}`);

  // Check Ollama connection
  try {
    const health = await fetch('http://localhost:11434/api/tags');
    if (!health.ok) throw new Error('Ollama not responding');
    console.log('Ollama: Connected');
  } catch {
    console.error('\nERROR: Ollama is not running. Start it with: ollama serve');
    process.exit(1);
  }

  switch (CONTENT_TYPE) {
    case 'recipes':
      await translateRecipes();
      break;
    case 'categories':
      await translateCategories();
      break;
    case 'posts':
      await translatePosts();
      break;
    case 'lexique':
      await translateLexique();
      break;
    case 'all':
      await translateCategories();
      await translateRecipes();
      await translatePosts();
      await translateLexique();
      break;
    default:
      console.error(`Unknown content type: ${CONTENT_TYPE}`);
      console.log('Valid types: recipes, categories, posts, lexique, all');
  }

  console.log('\nDone!');
}

main().catch(console.error);
