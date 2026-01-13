/**
 * Audit Recipe Translations - Menucochon
 *
 * Vérifie et corrige les traductions anglaises des recettes.
 * Détecte les ingrédients et instructions qui sont restés en français.
 *
 * Usage:
 *   npx tsx scripts/audit-recipe-translations.ts --audit          # Liste les recettes mal traduites
 *   npx tsx scripts/audit-recipe-translations.ts --fix            # Corrige avec Ollama
 *   npx tsx scripts/audit-recipe-translations.ts --fix --id=19    # Corrige une recette spécifique
 *   npx tsx scripts/audit-recipe-translations.ts --fix --dry-run  # Test sans sauvegarder
 *
 * Options:
 *   --audit       Mode audit uniquement (liste les problèmes)
 *   --fix         Mode correction (traduit avec Ollama)
 *   --dry-run     Ne pas sauvegarder dans Supabase
 *   --verbose     Afficher les détails
 *   --id=N        Traiter une recette spécifique par ID
 *   --limit=N     Limiter à N recettes
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'mistral:latest';

// CLI options
const AUDIT_MODE = process.argv.includes('--audit');
const FIX_MODE = process.argv.includes('--fix');
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const SINGLE_ID = parseInt(process.argv.find(arg => arg.startsWith('--id='))?.split('=')[1] || '0');
const LIMIT = parseInt(process.argv.find(arg => arg.startsWith('--limit='))?.split('=')[1] || '0');

// Common French words/phrases that indicate untranslated content
// These should be specific enough to not match English text
const FRENCH_INDICATORS = [
  // French-specific cooking verbs and phrases (with accents or unique French)
  'mélanger', 'ajouter', 'incorporer', 'verser',
  'émincer', 'égoutter', 'préchauffer', 'enfourner', 'saupoudrer',
  'fouetter', 'pétrir', 'malaxer', 'badigeonner',
  'faire revenir', 'faire chauffer', 'faire cuire', 'laisser reposer',
  'répartir', 'arroser', 'napper',

  // French-specific measurement terms
  'cuillère', 'c. à soupe', 'c. à café', 'c. a soupe', 'c. a cafe',
  'pincée', 'gousse d\'', 'gousses d\'',

  // French cooking terms with accents (very specific)
  'à feu', 'feu doux', 'feu moyen', 'feu vif',
  'jusqu\'à', 'jusqu\'à ce que',
  'd\'abord', 'd\'huile', 'd\'olive', 'd\'ail',

  // French sentence starters/connectors
  'dans un bol', 'dans une', 'dans un',
  'ajoutez', 'mélangez', 'versez', 'coupez',
  'préchauffez', 'assaisonnez', 'cuisez', 'retirez',
  'laissez', 'placez', 'étalez', 'formez',

  // French ingredient names with accents
  'œuf', 'bœuf', 'crème', 'céleri', 'légumes',
  'poêle', 'casserole', 'échalote',

  // Very French specific terms
  'haché mi-maigre', 'haché maigre', 'finement haché',
  'grossièrement', 'grossierement',
];

interface IngredientGroup {
  title?: string;
  items: {
    quantity?: string;
    unit?: string;
    name: string;
    note?: string;
  }[];
}

interface InstructionStep {
  step: number;
  title?: string;
  content: string;
  tip?: string;
  image?: string;
}

interface RecipeTranslation {
  id: number;
  recipe_id: number;
  locale: string;
  title: string;
  slug_en: string;
  excerpt?: string;
  introduction?: string;
  conclusion?: string;
  ingredients: IngredientGroup[] | null;
  instructions: InstructionStep[] | null;
  seo_title?: string;
  seo_description?: string;
}

interface Recipe {
  id: number;
  slug: string;
  title: string;
  ingredients: IngredientGroup[];
  instructions: InstructionStep[];
}

function containsFrench(text: string | undefined | null): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return FRENCH_INDICATORS.some(indicator => lowerText.includes(indicator.toLowerCase()));
}

function checkIngredientsForFrench(ingredients: IngredientGroup[] | null): { hasFrench: boolean; details: string[] } {
  const details: string[] = [];
  if (!ingredients) return { hasFrench: false, details };

  for (const group of ingredients) {
    if (containsFrench(group.title)) {
      details.push(`Group title: "${group.title}"`);
    }
    for (const item of group.items || []) {
      if (containsFrench(item.name)) {
        details.push(`Ingredient: "${item.name}"`);
      }
      if (containsFrench(item.note)) {
        details.push(`Note: "${item.note}"`);
      }
      if (containsFrench(item.unit)) {
        details.push(`Unit: "${item.unit}"`);
      }
    }
  }

  return { hasFrench: details.length > 0, details };
}

function checkInstructionsForFrench(instructions: InstructionStep[] | null): { hasFrench: boolean; details: string[] } {
  const details: string[] = [];
  if (!instructions) return { hasFrench: false, details };

  for (const step of instructions) {
    if (containsFrench(step.content)) {
      details.push(`Step ${step.step}: "${step.content.substring(0, 50)}..."`);
    }
    if (containsFrench(step.title)) {
      details.push(`Step ${step.step} title: "${step.title}"`);
    }
    if (containsFrench(step.tip)) {
      details.push(`Step ${step.step} tip: "${step.tip?.substring(0, 50)}..."`);
    }
  }

  return { hasFrench: details.length > 0, details };
}

async function askOllama(prompt: string, maxTokens: number = 4000): Promise<string> {
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
          temperature: 0.3,
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
  // Try to find JSON array first (for ingredients/instructions)
  let jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    // Try to find JSON object
    jsonMatch = text.match(/\{[\s\S]*\}/);
  }

  if (jsonMatch) {
    let jsonStr = jsonMatch[0];

    // Clean up common issues
    jsonStr = jsonStr
      // Remove markdown code blocks
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      // Fix trailing commas
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      // Fix unescaped newlines in strings
      .replace(/([^\\])\\n/g, '$1\\\\n')
      .trim();

    try {
      return JSON.parse(jsonStr);
    } catch (e1) {
      if (VERBOSE) {
        console.log('    JSON parse attempt 1 failed:', (e1 as Error).message);
      }

      // Try to extract just the array content and rebuild
      try {
        // For arrays, try to extract items
        if (jsonStr.startsWith('[')) {
          // Split by objects and try to parse each
          const objectMatches = jsonStr.match(/\{[^{}]*\}/g);
          if (objectMatches) {
            const items = [];
            for (const objStr of objectMatches) {
              try {
                const obj = JSON.parse(objStr);
                items.push(obj);
              } catch {
                // Skip malformed items
              }
            }
            if (items.length > 0) {
              return items;
            }
          }
        }
      } catch {
        // Continue to next attempt
      }

      // Try more aggressive cleaning
      try {
        let cleaned = jsonStr
          .replace(/[\x00-\x1F\x7F]/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/"\s*:\s*"/g, '": "')
          .replace(/"\s*,\s*"/g, '", "')
          .trim();
        return JSON.parse(cleaned);
      } catch (e2) {
        if (VERBOSE) {
          console.log('    JSON parse attempt 2 failed:', (e2 as Error).message);
          console.log('    Raw response (first 500 chars):', text.substring(0, 500));
        }
        return null;
      }
    }
  }

  if (VERBOSE) {
    console.log('    No JSON found in response');
    console.log('    Raw response (first 500 chars):', text.substring(0, 500));
  }
  return null;
}

function getIngredientsTranslationPrompt(ingredients: IngredientGroup[]): string {
  return `You are a professional French to English translator specializing in culinary content.
Translate these recipe ingredients from French to English.

IMPORTANT RULES:
- Translate ONLY, do not add or remove any items
- Keep quantities exactly as they are
- Translate ingredient names accurately
- Translate units: "c. à soupe" = "tbsp", "c. à café" = "tsp", "tasse" = "cup", "pincée" = "pinch"
- Translate notes and group titles
- Keep the exact same JSON structure

INGREDIENTS TO TRANSLATE:
${JSON.stringify(ingredients, null, 2)}

Respond with ONLY a valid JSON array in the exact same format:
[
  {
    "title": "translated group title (if any)",
    "items": [
      {
        "quantity": "same quantity",
        "unit": "translated unit",
        "name": "translated ingredient name",
        "note": "translated note (if any)"
      }
    ]
  }
]`;
}

function getInstructionsTranslationPrompt(instructions: InstructionStep[]): string {
  return `You are a professional French to English translator specializing in culinary content.
Translate these recipe instructions from French to English.

IMPORTANT RULES:
- Translate ONLY, do not add or remove any steps
- Keep step numbers exactly as they are
- Translate cooking terms accurately (e.g., "faire revenir" = "sauté", "faire mijoter" = "simmer")
- Translate tips and titles if present
- Keep the exact same JSON structure

INSTRUCTIONS TO TRANSLATE:
${JSON.stringify(instructions, null, 2)}

Respond with ONLY a valid JSON array in the exact same format:
[
  {
    "step": 1,
    "title": "translated title (if any)",
    "content": "translated instruction",
    "tip": "translated tip (if any)"
  }
]`;
}

async function auditTranslations() {
  console.log('\n=== AUDITING RECIPE TRANSLATIONS ===\n');

  // Get all English translations with ingredients/instructions
  let query = supabase
    .from('recipe_translations')
    .select('*, recipes!inner(slug, title, ingredients, instructions)')
    .eq('locale', 'en');

  if (SINGLE_ID) {
    query = query.eq('recipe_id', SINGLE_ID);
  }

  const { data: translations, error } = await query;

  if (error || !translations) {
    console.error('Error fetching translations:', error);
    return [];
  }

  console.log(`Found ${translations.length} English translations to audit\n`);

  const problemRecipes: Array<{
    recipeId: number;
    slug: string;
    titleFr: string;
    titleEn: string;
    ingredientIssues: string[];
    instructionIssues: string[];
    missingIngredients: boolean;
    missingInstructions: boolean;
  }> = [];

  for (const trans of translations) {
    const recipe = (trans as any).recipes;

    // Check if ingredients/instructions are NULL or empty (never translated)
    const missingIngredients = trans.ingredients === null ||
      (Array.isArray(trans.ingredients) && trans.ingredients.length === 0);
    const missingInstructions = trans.instructions === null ||
      (Array.isArray(trans.instructions) && trans.instructions.length === 0);

    const ingredientCheck = checkIngredientsForFrench(trans.ingredients as IngredientGroup[] | null);
    const instructionCheck = checkInstructionsForFrench(trans.instructions as InstructionStep[] | null);

    if (missingIngredients || missingInstructions || ingredientCheck.hasFrench || instructionCheck.hasFrench) {
      problemRecipes.push({
        recipeId: trans.recipe_id,
        slug: recipe.slug,
        titleFr: recipe.title,
        titleEn: trans.title,
        ingredientIssues: missingIngredients ? ['MISSING - needs translation from French'] : ingredientCheck.details,
        instructionIssues: missingInstructions ? ['MISSING - needs translation from French'] : instructionCheck.details,
        missingIngredients,
        missingInstructions,
      });

      console.log(`❌ ${recipe.title} (ID: ${trans.recipe_id})`);
      console.log(`   Slug: ${recipe.slug}`);
      console.log(`   EN Title: ${trans.title}`);

      if (missingIngredients) {
        console.log(`   🔴 Ingredients: MISSING (NULL) - needs translation`);
      } else if (ingredientCheck.hasFrench) {
        console.log(`   Ingredients with French:`);
        ingredientCheck.details.slice(0, 3).forEach(d => console.log(`     - ${d}`));
        if (ingredientCheck.details.length > 3) {
          console.log(`     ... and ${ingredientCheck.details.length - 3} more`);
        }
      }

      if (missingInstructions) {
        console.log(`   🔴 Instructions: MISSING (NULL) - needs translation`);
      } else if (instructionCheck.hasFrench) {
        console.log(`   Instructions with French:`);
        instructionCheck.details.slice(0, 3).forEach(d => console.log(`     - ${d}`));
        if (instructionCheck.details.length > 3) {
          console.log(`     ... and ${instructionCheck.details.length - 3} more`);
        }
      }
      console.log('');
    } else if (VERBOSE) {
      console.log(`✅ ${recipe.title} - OK`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`SUMMARY: ${problemRecipes.length} recipes with untranslated content`);
  console.log('='.repeat(50));

  return problemRecipes;
}

async function fixTranslations() {
  console.log('\n=== FIXING RECIPE TRANSLATIONS ===\n');

  // First audit to get the list
  const problemRecipes = await auditTranslations();

  if (problemRecipes.length === 0) {
    console.log('\nNo recipes to fix!');
    return;
  }

  // Check Ollama connection
  try {
    const health = await fetch('http://localhost:11434/api/tags');
    if (!health.ok) throw new Error('Ollama not responding');
    console.log('\nOllama: Connected');
  } catch {
    console.error('\nERROR: Ollama is not running. Start it with: ollama serve');
    process.exit(1);
  }

  let recipesToFix = problemRecipes;
  if (LIMIT > 0) recipesToFix = recipesToFix.slice(0, LIMIT);

  console.log(`\nFixing ${recipesToFix.length} recipes...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const problem of recipesToFix) {
    console.log(`\n[${successCount + errorCount + 1}/${recipesToFix.length}] Fixing: ${problem.titleFr}`);

    // Get current translation AND the original French recipe
    const [transResult, recipeResult] = await Promise.all([
      supabase
        .from('recipe_translations')
        .select('*')
        .eq('recipe_id', problem.recipeId)
        .eq('locale', 'en')
        .single(),
      supabase
        .from('recipes')
        .select('ingredients, instructions')
        .eq('id', problem.recipeId)
        .single()
    ]);

    if (transResult.error || !transResult.data) {
      console.error(`  ERROR: Could not fetch translation`);
      errorCount++;
      continue;
    }

    if (recipeResult.error || !recipeResult.data) {
      console.error(`  ERROR: Could not fetch original recipe`);
      errorCount++;
      continue;
    }

    const currentTrans = transResult.data;
    const originalRecipe = recipeResult.data;
    const updates: any = {};

    // Fix ingredients if needed (either has French or is NULL/missing)
    if (problem.ingredientIssues.length > 0) {
      // Use original French ingredients if translation is missing
      const ingredientsToTranslate = currentTrans.ingredients || originalRecipe.ingredients;

      if (ingredientsToTranslate && Array.isArray(ingredientsToTranslate) && ingredientsToTranslate.length > 0) {
        console.log(`  Translating ingredients${problem.missingIngredients ? ' (from French original)' : ''}...`);
        try {
          const prompt = getIngredientsTranslationPrompt(ingredientsToTranslate);
          const response = await askOllama(prompt, 4000);
          const translatedIngredients = extractJSON(response);

          if (translatedIngredients && Array.isArray(translatedIngredients)) {
            updates.ingredients = translatedIngredients;
            console.log(`  ✅ Ingredients translated`);
          } else {
            console.log(`  ⚠️ Could not parse ingredients translation`);
          }
        } catch (err) {
          console.log(`  ⚠️ Error translating ingredients: ${err}`);
        }
      }
    }

    // Fix instructions if needed (either has French or is NULL/missing)
    if (problem.instructionIssues.length > 0) {
      // Use original French instructions if translation is missing
      const instructionsToTranslate = currentTrans.instructions || originalRecipe.instructions;

      if (instructionsToTranslate && Array.isArray(instructionsToTranslate) && instructionsToTranslate.length > 0) {
        console.log(`  Translating instructions${problem.missingInstructions ? ' (from French original)' : ''}...`);
        try {
          const prompt = getInstructionsTranslationPrompt(instructionsToTranslate);
          const response = await askOllama(prompt, 6000);
          const translatedInstructions = extractJSON(response);

          if (translatedInstructions && Array.isArray(translatedInstructions)) {
            updates.instructions = translatedInstructions;
            console.log(`  ✅ Instructions translated`);
          } else {
            console.log(`  ⚠️ Could not parse instructions translation`);
          }
        } catch (err) {
          console.log(`  ⚠️ Error translating instructions: ${err}`);
        }
      }
    }

    // Save updates
    if (Object.keys(updates).length > 0) {
      if (!DRY_RUN) {
        const { error: updateError } = await supabase
          .from('recipe_translations')
          .update(updates)
          .eq('recipe_id', problem.recipeId)
          .eq('locale', 'en');

        if (updateError) {
          console.error(`  ERROR saving: ${updateError.message}`);
          errorCount++;
          continue;
        }
      }
      console.log(`  ✅ Saved updates for ${problem.titleEn}`);
      successCount++;
    } else {
      console.log(`  ⚠️ No updates to save`);
    }

    // Delay between recipes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`DONE: ${successCount} fixed, ${errorCount} errors`);
  console.log('='.repeat(50));
}

async function main() {
  console.log('='.repeat(50));
  console.log('Menucochon Recipe Translation Auditor');
  console.log('='.repeat(50));
  console.log(`Mode: ${AUDIT_MODE ? 'AUDIT' : FIX_MODE ? 'FIX' : 'NONE'}`);
  if (DRY_RUN) console.log('DRY RUN: Changes will not be saved');
  if (SINGLE_ID) console.log(`Single ID: ${SINGLE_ID}`);
  if (LIMIT) console.log(`Limit: ${LIMIT}`);

  if (!AUDIT_MODE && !FIX_MODE) {
    console.log('\nUsage:');
    console.log('  npx tsx scripts/audit-recipe-translations.ts --audit   # List issues');
    console.log('  npx tsx scripts/audit-recipe-translations.ts --fix     # Fix with Ollama');
    process.exit(0);
  }

  if (AUDIT_MODE) {
    await auditTranslations();
  } else if (FIX_MODE) {
    await fixTranslations();
  }
}

main().catch(console.error);
