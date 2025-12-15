/**
 * Regenerate English Slugs - Menucochon
 *
 * Ce script traduit les slugs français en slugs anglais courts et directs.
 * Exemple: "crepe-proteinee" -> "protein-pancake"
 *
 * Usage:
 *   npx tsx scripts/regenerate-english-slugs.ts
 *   npx tsx scripts/regenerate-english-slugs.ts --dry-run
 *   npx tsx scripts/regenerate-english-slugs.ts --limit=10
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
const LIMIT = parseInt(process.argv.find(arg => arg.startsWith('--limit='))?.split('=')[1] || '0');

async function askOllama(prompt: string): Promise<string> {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      options: {
        num_predict: 100,
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  return data.response?.trim() || '';
}

function cleanSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim();
}

async function translateSlug(frenchSlug: string, frenchTitle: string): Promise<string> {
  const prompt = `Translate this French recipe slug to English. Direct word-by-word translation.

French slug: "${frenchSlug}"

RULES:
1. Translate each French word to English
2. Keep natural English word order
3. Check spelling carefully - NO TYPOS
4. Use hyphens between words
5. Keep it short (2-5 words max)

EXAMPLES:
- "chili-con-carne-traditionnel" -> "traditional-chili-con-carne"
- "champignons-balsamique" -> "balsamic-mushrooms"
- "poulet-grille-citron" -> "lemon-grilled-chicken"
- "gateau-chocolat" -> "chocolate-cake"
- "soupe-oignon" -> "onion-soup"
- "salade-cesar" -> "caesar-salad"
- "pate-carbonara" -> "carbonara-pasta"
- "boeuf-bourguignon" -> "beef-bourguignon"
- "tarte-aux-pommes" -> "apple-pie"
- "creme-brulee" -> "creme-brulee"

Output ONLY the English slug, nothing else:`;

  const response = await askOllama(prompt);
  const slug = cleanSlug(response.split('\n')[0]);

  // Fallback: if response is too long or weird, create from french slug
  if (!slug || slug.length > 50 || slug.includes(' ')) {
    // Basic translation of common French cooking terms
    const translations: Record<string, string> = {
      // Proteins
      'poulet': 'chicken', 'boeuf': 'beef', 'porc': 'pork', 'agneau': 'lamb',
      'veau': 'veal', 'canard': 'duck', 'dinde': 'turkey', 'lapin': 'rabbit',
      'poisson': 'fish', 'saumon': 'salmon', 'thon': 'tuna', 'crevettes': 'shrimp',
      'moules': 'mussels', 'fruits-de-mer': 'seafood', 'oeuf': 'egg', 'oeufs': 'eggs',
      // Vegetables
      'legumes': 'vegetables', 'champignons': 'mushrooms', 'champignon': 'mushroom',
      'oignon': 'onion', 'oignons': 'onions', 'ail': 'garlic', 'tomate': 'tomato',
      'tomates': 'tomatoes', 'pomme-de-terre': 'potato', 'pommes-de-terre': 'potatoes',
      'carotte': 'carrot', 'carottes': 'carrots', 'courgette': 'zucchini',
      'aubergine': 'eggplant', 'poivron': 'pepper', 'epinards': 'spinach',
      'haricots': 'beans', 'petits-pois': 'peas', 'mais': 'corn', 'chou': 'cabbage',
      // Fruits
      'pommes': 'apples', 'pomme': 'apple', 'citron': 'lemon', 'orange': 'orange',
      'fraise': 'strawberry', 'fraises': 'strawberries', 'banane': 'banana',
      'peche': 'peach', 'poire': 'pear', 'cerise': 'cherry', 'cerises': 'cherries',
      'framboise': 'raspberry', 'framboises': 'raspberries', 'bleuets': 'blueberries',
      // Baked goods
      'gateau': 'cake', 'tarte': 'pie', 'pain': 'bread', 'brioche': 'brioche',
      'croissant': 'croissant', 'biscuit': 'cookie', 'biscuits': 'cookies',
      'muffin': 'muffin', 'muffins': 'muffins', 'crepe': 'crepe', 'crepes': 'crepes',
      'galette': 'galette', 'quiche': 'quiche', 'pizza': 'pizza',
      // Dishes
      'soupe': 'soup', 'salade': 'salad', 'sauce': 'sauce', 'bouillon': 'broth',
      'ragout': 'stew', 'gratin': 'gratin', 'casserole': 'casserole',
      'pate': 'pasta', 'pates': 'pasta', 'riz': 'rice', 'risotto': 'risotto',
      'chili': 'chili', 'curry': 'curry', 'tajine': 'tagine',
      // Dairy
      'fromage': 'cheese', 'creme': 'cream', 'beurre': 'butter', 'lait': 'milk',
      'yaourt': 'yogurt', 'yogourt': 'yogurt',
      // Cooking methods
      'grille': 'grilled', 'roti': 'roasted', 'frit': 'fried', 'cuit': 'cooked',
      'braise': 'braised', 'poche': 'poached', 'saute': 'sauteed', 'marine': 'marinated',
      'farci': 'stuffed', 'farcis': 'stuffed', 'glace': 'glazed',
      // Adjectives
      'traditionnel': 'traditional', 'traditionnelle': 'traditional',
      'classique': 'classic', 'maison': 'homemade', 'facile': 'easy',
      'rapide': 'quick', 'simple': 'simple', 'cremeux': 'creamy', 'cremeuse': 'creamy',
      'epice': 'spicy', 'epicee': 'spicy', 'sucre': 'sweet', 'sale': 'savory',
      // Seasonings
      'balsamique': 'balsamic', 'miel': 'honey', 'moutarde': 'mustard',
      'herbes': 'herbs', 'epices': 'spices', 'sel': 'salt', 'poivre': 'pepper',
      'vinaigre': 'vinegar', 'huile': 'oil',
      // Articles (to remove)
      'aux': '', 'au': '', 'de': '', 'du': '', 'la': '', 'le': '', 'les': '',
      'a-la': '', 'a-l': '', 'et': 'and', 'avec': 'with', 'sans': 'without',
    };

    let result = frenchSlug;
    for (const [fr, en] of Object.entries(translations)) {
      result = result.replace(new RegExp(`\\b${fr}\\b`, 'gi'), en);
    }
    return cleanSlug(result);
  }

  return slug;
}

async function main() {
  console.log('='.repeat(50));
  console.log('Regenerate English Slugs');
  console.log('='.repeat(50));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  if (LIMIT) console.log(`Limit: ${LIMIT}`);

  // Check Ollama
  try {
    const health = await fetch('http://localhost:11434/api/tags');
    if (!health.ok) throw new Error('Ollama not responding');
    console.log('Ollama: Connected\n');
  } catch {
    console.error('\nERROR: Ollama is not running. Start it with: ollama serve');
    process.exit(1);
  }

  // Get all recipes with their translations
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, slug, title')
    .order('id');

  if (recipesError || !recipes) {
    console.error('Error fetching recipes:', recipesError);
    return;
  }

  // Get existing translations
  const { data: translations, error: transError } = await supabase
    .from('recipe_translations')
    .select('recipe_id, slug_en, title')
    .eq('locale', 'en');

  if (transError) {
    console.error('Error fetching translations:', transError);
    return;
  }

  const translationMap = new Map(translations?.map(t => [t.recipe_id, t]) || []);

  let toProcess = recipes.filter(r => translationMap.has(r.id));
  if (LIMIT > 0) toProcess = toProcess.slice(0, LIMIT);

  console.log(`Processing ${toProcess.length} recipes...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const recipe of toProcess) {
    const translation = translationMap.get(recipe.id);
    const currentSlugEn = translation?.slug_en;

    console.log(`[${successCount + errorCount + 1}/${toProcess.length}] ${recipe.slug}`);
    console.log(`  Current EN slug: ${currentSlugEn || '(none)'}`);

    try {
      const newSlugEn = await translateSlug(recipe.slug, recipe.title);
      console.log(`  New EN slug: ${newSlugEn}`);

      if (newSlugEn === currentSlugEn) {
        console.log(`  SKIP: Same slug`);
        successCount++;
        continue;
      }

      if (!DRY_RUN) {
        const { error: updateError } = await supabase
          .from('recipe_translations')
          .update({ slug_en: newSlugEn })
          .eq('recipe_id', recipe.id)
          .eq('locale', 'en');

        if (updateError) {
          console.error(`  ERROR: ${updateError.message}`);
          errorCount++;
          continue;
        }
      }

      console.log(`  OK: ${recipe.slug} -> ${newSlugEn}`);
      successCount++;

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error) {
      console.error(`  ERROR:`, error);
      errorCount++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Done: ${successCount} success, ${errorCount} errors`);
}

main().catch(console.error);
