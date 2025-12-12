/**
 * Translate FAQ and Tips (content) for recipes
 *
 * Prerequisites:
 * 1. Run in Supabase SQL Editor:
 *    ALTER TABLE recipe_translations ADD COLUMN IF NOT EXISTS faq TEXT;
 *    ALTER TABLE recipe_translations ADD COLUMN IF NOT EXISTS content TEXT;
 *
 * 2. Start Ollama: ollama serve
 *
 * Usage:
 *   npx tsx scripts/translate-faq-tips.ts
 *   npx tsx scripts/translate-faq-tips.ts --dry-run
 *   npx tsx scripts/translate-faq-tips.ts --limit=10
 *   npx tsx scripts/translate-faq-tips.ts --id=123
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'mistral:latest';

const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const LIMIT = parseInt(process.argv.find(arg => arg.startsWith('--limit='))?.split('=')[1] || '0');
const SINGLE_ID = parseInt(process.argv.find(arg => arg.startsWith('--id='))?.split('=')[1] || '0');

async function askOllama(prompt: string, maxTokens: number = 4000): Promise<string> {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      options: {
        num_predict: maxTokens,
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  return data.response?.trim() || '';
}

function getTranslationPrompt(content: string, type: 'faq' | 'tips'): string {
  const typeLabel = type === 'faq' ? 'FAQ (Frequently Asked Questions)' : 'Tips/Tricks';

  return `You are a professional French to English translator specializing in culinary content.
Translate the following ${typeLabel} section from French to English.

IMPORTANT RULES:
- Translate ONLY, do not invent or add any new content
- Preserve ALL HTML tags exactly as they are (<p>, <h2>, <h3>, <ul>, <li>, <strong>, etc.)
- Translate cooking terms accurately
- Keep measurements and quantities unchanged
- Keep the same structure and formatting

CONTENT TO TRANSLATE:
${content}

Respond with ONLY the translated HTML content, nothing else. Do not wrap in JSON or add any explanation.`;
}

async function main() {
  console.log('='.repeat(50));
  console.log('Translate FAQ and Tips for Recipes');
  console.log('='.repeat(50));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  if (LIMIT) console.log(`Limit: ${LIMIT}`);
  if (SINGLE_ID) console.log(`Single ID: ${SINGLE_ID}`);

  // Check Ollama
  try {
    const health = await fetch('http://localhost:11434/api/tags');
    if (!health.ok) throw new Error('Ollama not responding');
    console.log('Ollama: Connected');
  } catch {
    console.error('\nERROR: Ollama is not running. Start it with: ollama serve');
    process.exit(1);
  }

  // Get recipes with FAQ or content that need translation
  let query = supabase
    .from('recipes')
    .select('id, slug, title, faq, content')
    .or('faq.neq.,content.neq.')
    .order('id', { ascending: true });

  if (SINGLE_ID) {
    query = supabase
      .from('recipes')
      .select('id, slug, title, faq, content')
      .eq('id', SINGLE_ID);
  }

  const { data: recipes, error } = await query;

  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }

  if (!recipes || recipes.length === 0) {
    console.log('No recipes with FAQ or content found');
    return;
  }

  // Get existing translations
  const { data: translations } = await supabase
    .from('recipe_translations')
    .select('recipe_id, faq, content')
    .eq('locale', 'en');

  const translationMap = new Map(translations?.map(t => [t.recipe_id, t]) || []);

  // Filter recipes that need translation
  let recipesToTranslate = recipes.filter(r => {
    const existing = translationMap.get(r.id);
    const needsFaq = r.faq && (!existing || !existing.faq);
    const needsContent = r.content && (!existing || !existing.content);
    return needsFaq || needsContent;
  });

  if (LIMIT > 0) {
    recipesToTranslate = recipesToTranslate.slice(0, LIMIT);
  }

  console.log(`\nFound ${recipesToTranslate.length} recipes needing FAQ/Tips translation\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const recipe of recipesToTranslate) {
    const currentIndex = successCount + errorCount + 1;
    console.log(`\n[${currentIndex}/${recipesToTranslate.length}] ${recipe.title}`);

    const existing = translationMap.get(recipe.id);
    const updates: { faq?: string; content?: string } = {};

    // Translate FAQ if needed
    if (recipe.faq && (!existing || !existing.faq)) {
      console.log('  Translating FAQ...');
      try {
        const translatedFaq = await askOllama(getTranslationPrompt(recipe.faq, 'faq'));
        if (translatedFaq && translatedFaq.length > 20) {
          updates.faq = translatedFaq;
          console.log('  FAQ translated');
        } else {
          console.log('  FAQ translation too short, skipping');
        }
      } catch (err) {
        console.error('  FAQ translation error:', err);
      }
    }

    // Translate content/tips if needed
    if (recipe.content && (!existing || !existing.content)) {
      console.log('  Translating Tips...');
      try {
        const translatedContent = await askOllama(getTranslationPrompt(recipe.content, 'tips'));
        if (translatedContent && translatedContent.length > 20) {
          updates.content = translatedContent;
          console.log('  Tips translated');
        } else {
          console.log('  Tips translation too short, skipping');
        }
      } catch (err) {
        console.error('  Tips translation error:', err);
      }
    }

    if (Object.keys(updates).length === 0) {
      console.log('  Nothing to update');
      continue;
    }

    if (VERBOSE) {
      if (updates.faq) console.log('  FAQ EN:', updates.faq.substring(0, 100) + '...');
      if (updates.content) console.log('  Content EN:', updates.content.substring(0, 100) + '...');
    }

    if (!DRY_RUN) {
      // Check if translation record exists
      const { data: existingRecord } = await supabase
        .from('recipe_translations')
        .select('id')
        .eq('recipe_id', recipe.id)
        .eq('locale', 'en')
        .single();

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('recipe_translations')
          .update(updates)
          .eq('recipe_id', recipe.id)
          .eq('locale', 'en');

        if (updateError) {
          console.error('  Update error:', updateError.message);
          errorCount++;
          continue;
        }
      } else {
        // Create new record with minimal data
        const { error: insertError } = await supabase
          .from('recipe_translations')
          .insert({
            recipe_id: recipe.id,
            locale: 'en',
            title: recipe.title, // Will be overwritten by full translation later
            ...updates,
          });

        if (insertError) {
          console.error('  Insert error:', insertError.message);
          errorCount++;
          continue;
        }
      }
    }

    console.log('  OK');
    successCount++;

    // Delay to avoid overwhelming Ollama
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Done: ${successCount} success, ${errorCount} errors`);
}

main().catch(console.error);
