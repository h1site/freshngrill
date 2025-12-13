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
 *   npx tsx scripts/translate-content.ts --type=post-categories  # Traduire catégories de posts
 *   npx tsx scripts/translate-content.ts --type=lexique      # Traduire lexique
 *   npx tsx scripts/translate-content.ts --type=all          # Tout traduire
 *
 * Options:
 *   --dry-run      Ne pas sauvegarder dans Supabase
 *   --verbose      Afficher les details
 *   --limit=N      Limiter a N items
 *   --skip=N       Sauter les N premiers items
 *   --id=N         Traduire un item specifique par ID
 *   --force        Re-traduire meme si deja traduit (pour posts avec contenu manquant)
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
const FORCE = process.argv.includes('--force');

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
    let jsonStr = jsonMatch[0];

    // Clean up common Mistral JSON issues
    jsonStr = jsonStr
      // First: convert literal \n sequences to actual newlines so we can handle them uniformly
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      // Then: convert actual newlines back to escaped sequences for JSON
      .replace(/[\x00-\x1F\x7F]/g, (char) => {
        if (char === '\n') return '\\n';
        if (char === '\r') return '\\r';
        if (char === '\t') return '\\t';
        return '';
      })
      // Fix trailing commas
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      // Fix single quotes to double quotes (but not inside strings)
      .replace(/:\s*'([^']*)'/g, ': "$1"')
      // Fix unescaped quotes inside strings
      .replace(/": "([^"]*)"([^",}\]]+)"([^"]*)",/g, '": "$1\\"$2\\"$3",')
      // Remove any BOM or invisible characters
      .replace(/^\uFEFF/, '')
      .trim();

    try {
      return JSON.parse(jsonStr);
    } catch (e1) {
      // Second attempt: more aggressive cleaning
      try {
        // Replace any remaining problematic characters
        let cleaned = jsonStr
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, ' ')
          // Fix common Mistral issues with colons in strings
          .replace(/":\s*"/g, '": "')
          // Remove extra whitespace
          .replace(/\s+/g, ' ');

        return JSON.parse(cleaned);
      } catch (e2) {
        // Third attempt: try to extract key fields manually
        try {
          const titleMatch = jsonStr.match(/"title"\s*:\s*"([^"]+)"/);
          const excerptMatch = jsonStr.match(/"excerpt"\s*:\s*"([^"]+)"/);
          const introMatch = jsonStr.match(/"introduction"\s*:\s*"([^"]+)"/);
          const conclusionMatch = jsonStr.match(/"conclusion"\s*:\s*"([^"]+)"/);
          const seoTitleMatch = jsonStr.match(/"seo_title"\s*:\s*"([^"]+)"/);
          const seoDescMatch = jsonStr.match(/"seo_description"\s*:\s*"([^"]+)"/);

          // Try to extract content field (for posts) - handle HTML content with newlines
          const contentMatch = jsonStr.match(/"content"\s*:\s*"([\s\S]*?)"\s*,\s*"seo_/);

          // Try to extract ingredients array
          const ingredientsMatch = jsonStr.match(/"ingredients"\s*:\s*(\[[\s\S]*?\])\s*,?\s*"instructions"/);
          // Try to extract instructions array
          const instructionsMatch = jsonStr.match(/"instructions"\s*:\s*(\[[\s\S]*?\])\s*}/);

          if (titleMatch) {
            const result: any = {
              title: titleMatch[1],
            };
            if (excerptMatch) result.excerpt = excerptMatch[1];
            if (introMatch) result.introduction = introMatch[1];
            if (conclusionMatch) result.conclusion = conclusionMatch[1];
            if (contentMatch) {
              // Clean up the content - unescape and restore HTML
              result.content = contentMatch[1]
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
            }
            if (seoTitleMatch) result.seo_title = seoTitleMatch[1];
            if (seoDescMatch) result.seo_description = seoDescMatch[1];

            // Try parsing arrays separately
            if (ingredientsMatch) {
              try {
                result.ingredients = JSON.parse(ingredientsMatch[1].replace(/[\x00-\x1F]/g, ' '));
              } catch { /* skip */ }
            }
            if (instructionsMatch) {
              try {
                result.instructions = JSON.parse(instructionsMatch[1].replace(/[\x00-\x1F]/g, ' '));
              } catch { /* skip */ }
            }

            return result;
          }
        } catch { /* skip */ }

        // If all else fails, throw the original error
        throw e1;
      }
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

Also generate an English URL slug from the translated title.
The slug should be lowercase, use hyphens instead of spaces, and remove special characters.
Example: "Protein Pancake Recipe" -> "protein-pancake-recipe"

Respond with ONLY a valid JSON object in this exact format:
{
  "title": "translated title",
  "slug_en": "english-url-slug",
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

function getPostCategoryTranslationPrompt(category: any): string {
  return `Translate this French blog category name to English.
Keep it short and natural for a blog/magazine website.

French: "${category.name}"

Respond with ONLY the English translation, nothing else.`;
}

/**
 * Split HTML content into chunks, trying to break at logical points
 */
function splitContentIntoChunks(content: string, maxChunkSize: number): string[] {
  const chunks: string[] = [];

  // Try to split at major HTML elements first
  const splitPatterns = [
    /(<\/h[1-6]>)/gi,  // After headings
    /(<\/p>)/gi,        // After paragraphs
    /(<\/div>)/gi,      // After divs
    /(<\/figure>)/gi,   // After figures
  ];

  let remaining = content;

  while (remaining.length > 0) {
    if (remaining.length <= maxChunkSize) {
      chunks.push(remaining);
      break;
    }

    // Find a good split point within maxChunkSize
    let splitAt = -1;
    const searchArea = remaining.substring(0, maxChunkSize);

    for (const pattern of splitPatterns) {
      const matches = [...searchArea.matchAll(pattern)];
      if (matches.length > 0) {
        // Get the last match within the search area
        const lastMatch = matches[matches.length - 1];
        const matchEnd = lastMatch.index! + lastMatch[0].length;
        if (matchEnd > splitAt) {
          splitAt = matchEnd;
        }
      }
    }

    // If no good split point found, split at maxChunkSize
    if (splitAt <= 0) {
      splitAt = maxChunkSize;
    }

    chunks.push(remaining.substring(0, splitAt));
    remaining = remaining.substring(splitAt);
  }

  return chunks;
}

function getPostMetadataPrompt(post: any): string {
  return `Translate this French blog post metadata to English.

Title: ${post.title}
Excerpt: ${post.excerpt || ''}

Respond with ONLY a valid JSON object:
{
  "title": "English title",
  "excerpt": "English excerpt",
  "seo_title": "SEO title max 60 chars",
  "seo_description": "meta description max 160 chars"
}`;
}

function getPostContentPrompt(content: string): string {
  return `Translate this French HTML content to English.
Preserve ALL HTML tags exactly. Only translate the French text between tags.

HTML to translate:
${content}

Return ONLY the translated HTML, nothing else.`;
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
    const currentIndex = successCount + errorCount + 1;
    console.log(`\n[${currentIndex}/${recipesToTranslate.length}] Translating: ${recipe.title}`);

    let translation = null;
    let lastError: any = null;
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const prompt = getRecipeTranslationPrompt(recipe);
        const response = await askOllama(prompt, 4000);

        if (VERBOSE) {
          console.log(`  Attempt ${attempt} raw response:`, response.substring(0, 500));
        }

        translation = extractJSON(response);

        if (translation && translation.title) {
          break; // Success!
        }

        console.log(`  Attempt ${attempt}/${MAX_RETRIES}: Could not parse JSON, retrying...`);
        lastError = new Error('Could not parse JSON');

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (err) {
        lastError = err;
        console.log(`  Attempt ${attempt}/${MAX_RETRIES}: ${err instanceof Error ? err.message : 'Error'}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!translation || !translation.title) {
      console.error(`  ERROR: Failed after ${MAX_RETRIES} attempts for ${recipe.slug}:`, lastError?.message || 'Unknown error');
      errorCount++;
      continue;
    }

    if (VERBOSE) {
      console.log('  Title EN:', translation.title);
      console.log('  Excerpt EN:', translation.excerpt?.substring(0, 100));
    }

    // Generate slug_en from title if not provided by AI
    const slugEn = translation.slug_en || translation.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Spaces to hyphens
      .replace(/-+/g, '-') // Multiple hyphens to single
      .replace(/^-|-$/g, ''); // Trim hyphens

    if (!DRY_RUN) {
      const { error: insertError } = await supabase
        .from('recipe_translations')
        .upsert({
          recipe_id: recipe.id,
          locale: TARGET_LOCALE,
          title: translation.title,
          slug_en: slugEn,
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

    console.log(`  OK: ${recipe.title} -> ${translation.title} (slug: ${slugEn})`);
    successCount++;

    // Small delay to avoid overwhelming Ollama
    await new Promise(resolve => setTimeout(resolve, 500));
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
    .select('post_id, content')
    .eq('locale', TARGET_LOCALE);

  // With --force, re-translate posts that have no content or very short content
  const translatedWithContent = new Set(
    existingTranslations
      ?.filter(t => t.content && t.content.length > 100)
      .map(t => t.post_id) || []
  );
  const translatedIds = new Set(existingTranslations?.map(t => t.post_id) || []);

  let postsToTranslate = FORCE
    ? posts.filter(p => !translatedWithContent.has(p.id)) // Re-translate if missing content
    : posts.filter(p => !translatedIds.has(p.id)); // Only translate new posts

  if (SKIP > 0) postsToTranslate = postsToTranslate.slice(SKIP);
  if (LIMIT > 0) postsToTranslate = postsToTranslate.slice(0, LIMIT);

  console.log(`Found ${postsToTranslate.length} posts to translate`);

  for (const post of postsToTranslate) {
    try {
      console.log(`Translating post: ${post.title}`);

      // Step 1: Translate metadata (title, excerpt, seo)
      console.log(`  Step 1: Translating metadata...`);
      const metadataPrompt = getPostMetadataPrompt(post);
      const metadataResponse = await askOllama(metadataPrompt, 1000);
      const metadata = extractJSON(metadataResponse);

      if (!metadata || !metadata.title) {
        console.error(`  ERROR: Could not parse metadata translation`);
        continue;
      }

      if (VERBOSE) {
        console.log(`  Metadata: ${metadata.title}`);
      }

      // Step 2: Translate content in chunks if needed
      console.log(`  Step 2: Translating content...`);
      let translatedContent = '';
      const contentLength = post.content?.length || 0;

      if (contentLength > 0) {
        // For long content, split into manageable chunks
        const maxChunkSize = 6000;
        const content = post.content || '';

        if (contentLength <= maxChunkSize) {
          // Single chunk translation
          const contentPrompt = getPostContentPrompt(content);
          translatedContent = await askOllama(contentPrompt, 12000);
          translatedContent = translatedContent.trim();
        } else {
          // Multi-chunk translation - split by HTML paragraphs/sections
          console.log(`  Content is ${contentLength} chars, translating in chunks...`);
          const chunks = splitContentIntoChunks(content, maxChunkSize);
          console.log(`  Split into ${chunks.length} chunks`);

          for (let i = 0; i < chunks.length; i++) {
            console.log(`  Translating chunk ${i + 1}/${chunks.length}...`);
            const chunkPrompt = getPostContentPrompt(chunks[i]);
            const translatedChunk = await askOllama(chunkPrompt, 12000);
            translatedContent += translatedChunk.trim() + '\n\n';
            // Small delay between chunks
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }

      if (VERBOSE) {
        console.log(`  Content translated: ${translatedContent.length} chars`);
      }

      if (!DRY_RUN) {
        const { error: insertError } = await supabase
          .from('post_translations')
          .upsert({
            post_id: post.id,
            locale: TARGET_LOCALE,
            title: metadata.title,
            excerpt: metadata.excerpt,
            content: translatedContent || null,
            seo_title: metadata.seo_title,
            seo_description: metadata.seo_description,
          }, {
            onConflict: 'post_id,locale'
          });

        if (insertError) {
          console.error(`  ERROR saving:`, insertError.message);
          continue;
        }
      }

      console.log(`  OK: ${post.title} -> ${metadata.title} (${translatedContent.length} chars content)`);

      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ERROR:`, error);
    }
  }

  console.log('\n=== POSTS DONE ===');
}

async function translatePostCategories() {
  console.log('\n=== TRANSLATING POST CATEGORIES ===\n');

  const { data: categories, error } = await supabase
    .from('post_categories')
    .select('id, slug, name')
    .order('name');

  if (error || !categories) {
    console.error('Error fetching post categories:', error);
    return;
  }

  // Get existing translations
  const { data: existingTranslations } = await supabase
    .from('post_category_translations')
    .select('category_id')
    .eq('locale', TARGET_LOCALE);

  const translatedIds = new Set(existingTranslations?.map(t => t.category_id) || []);

  let categoriesToTranslate = categories.filter(c => !translatedIds.has(c.id));

  console.log(`Found ${categoriesToTranslate.length} post categories to translate (${categories.length} total, ${translatedIds.size} already translated)`);

  for (const category of categoriesToTranslate) {
    try {
      console.log(`Translating post category: ${category.name}`);

      const prompt = getPostCategoryTranslationPrompt(category);
      const translation = await askOllama(prompt, 100);

      const translatedName = translation.trim().replace(/^["']|["']$/g, '');

      if (!translatedName) {
        console.error(`  ERROR: Empty translation for ${category.name}`);
        continue;
      }

      if (!DRY_RUN) {
        const { error: insertError } = await supabase
          .from('post_category_translations')
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

  console.log('\n=== POST CATEGORIES DONE ===');
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
  if (FORCE) console.log(`Force: Re-translate posts with missing content`);

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
    case 'post-categories':
      await translatePostCategories();
      break;
    case 'lexique':
      await translateLexique();
      break;
    case 'all':
      await translateCategories();
      await translatePostCategories();
      await translateRecipes();
      await translatePosts();
      await translateLexique();
      break;
    default:
      console.error(`Unknown content type: ${CONTENT_TYPE}`);
      console.log('Valid types: recipes, categories, posts, post-categories, lexique, all');
  }

  console.log('\nDone!');
}

main().catch(console.error);
