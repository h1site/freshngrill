/**
 * Generate Pinterest SEO titles & descriptions using Ollama
 *
 * Generates optimized pinterest_title, pinterest_description (FR)
 * and pinterest_title_en, pinterest_description_en (EN) for all recipes.
 * Does NOT touch original title/excerpt/seo fields.
 *
 * Usage:
 *   npx tsx scripts/generate-pinterest-seo.ts              # All recipes missing Pinterest SEO
 *   npx tsx scripts/generate-pinterest-seo.ts --overwrite   # Regenerate all
 *   npx tsx scripts/generate-pinterest-seo.ts --recipe=poutine  # Single recipe by slug
 *   npx tsx scripts/generate-pinterest-seo.ts --dry-run     # Preview without saving
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'mistral:latest';

const DRY_RUN = process.argv.includes('--dry-run');
const OVERWRITE = process.argv.includes('--overwrite');
const SINGLE_RECIPE = process.argv.find(arg => arg.startsWith('--recipe='))?.split('=')[1];

interface Recipe {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  seo_description: string | null;
  categories: string | null;
  pinterest_title: string | null;
  pinterest_description: string | null;
  pinterest_title_en: string | null;
  pinterest_description_en: string | null;
}

interface PinterestSEO {
  pinterest_title: string;
  pinterest_description: string;
  pinterest_title_en: string;
  pinterest_description_en: string;
}

// ============================================
// OLLAMA
// ============================================

async function askOllama(prompt: string, maxTokens: number = 500): Promise<string> {
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
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.response?.trim() || '';
  } catch (error) {
    console.error('Erreur Ollama:', error);
    return '';
  }
}

function extractJSON(text: string): PinterestSEO | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
}

// ============================================
// GENERATION
// ============================================

async function generatePinterestSEO(recipe: Recipe): Promise<PinterestSEO | null> {
  const prompt = `Tu es un expert SEO Pinterest pour un site de recettes québécoises (menucochon.com).

Génère un titre et une description Pinterest optimisés pour cette recette, en FRANÇAIS et en ANGLAIS.

RÈGLES IMPORTANTES:
- Le titre Pinterest doit être accrocheur, avec des mots-clés SEO (ex: "Recette Facile", "Meilleure", "Rapide")
- Le titre doit donner envie de cliquer (max 100 caractères)
- La description Pinterest doit inclure des mots-clés, hashtags pertinents, et un call-to-action
- La description doit faire 2-3 phrases (max 500 caractères)
- Ton chaleureux et québécois pour le français
- NE PAS copier le titre original tel quel, le RÉÉCRIRE pour Pinterest

Recette: ${recipe.title}
${recipe.excerpt ? `Description actuelle: ${recipe.excerpt}` : ''}
${recipe.seo_description ? `SEO: ${recipe.seo_description}` : ''}

Retourne UNIQUEMENT un JSON valide avec ce format exact:
{
  "pinterest_title": "Titre Pinterest en français",
  "pinterest_description": "Description Pinterest en français avec #hashtags",
  "pinterest_title_en": "Pinterest title in English",
  "pinterest_description_en": "Pinterest description in English with #hashtags"
}`;

  const response = await askOllama(prompt, 500);
  const result = extractJSON(response);

  if (!result) {
    console.error(`  ❌ Impossible de parser la réponse pour ${recipe.slug}`);
    return null;
  }

  // Validate fields exist
  if (!result.pinterest_title || !result.pinterest_description ||
      !result.pinterest_title_en || !result.pinterest_description_en) {
    console.error(`  ❌ Champs manquants pour ${recipe.slug}`);
    return null;
  }

  return result;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('🎯 Génération Pinterest SEO avec Ollama');
  console.log(`   Modèle: ${MODEL}`);
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (pas de sauvegarde)' : 'PRODUCTION'}`);
  console.log(`   Écraser existants: ${OVERWRITE ? 'OUI' : 'NON'}`);
  if (SINGLE_RECIPE) console.log(`   Recette: ${SINGLE_RECIPE}`);
  console.log('');

  // Check Ollama
  try {
    const check = await fetch('http://localhost:11434/api/tags');
    if (!check.ok) throw new Error();
    console.log('✅ Ollama disponible\n');
  } catch {
    console.error('❌ Ollama non disponible. Lance-le avec: ollama serve');
    process.exit(1);
  }

  // Fetch recipes
  let query = supabase
    .from('recipes')
    .select('id, slug, title, excerpt, seo_description, pinterest_title, pinterest_description, pinterest_title_en, pinterest_description_en')
    .order('title');

  if (SINGLE_RECIPE) {
    query = query.eq('slug', SINGLE_RECIPE);
  }

  const { data: recipes, error } = await query;

  if (error) {
    console.error('Erreur Supabase:', error.message);
    process.exit(1);
  }

  if (!recipes || recipes.length === 0) {
    console.log('Aucune recette trouvée.');
    process.exit(0);
  }

  // Filter recipes needing processing
  const toProcess = OVERWRITE
    ? recipes
    : recipes.filter(r => !r.pinterest_title || !r.pinterest_title_en);

  console.log(`📊 ${recipes.length} recettes totales, ${toProcess.length} à traiter\n`);

  if (toProcess.length === 0) {
    console.log('✅ Toutes les recettes ont déjà un titre Pinterest. Utilisez --overwrite pour régénérer.');
    process.exit(0);
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const recipe = toProcess[i];
    console.log(`[${i + 1}/${toProcess.length}] ${recipe.title} (${recipe.slug})`);

    const seo = await generatePinterestSEO(recipe as Recipe);

    if (!seo) {
      failed++;
      continue;
    }

    console.log(`  FR: ${seo.pinterest_title}`);
    console.log(`      ${seo.pinterest_description.substring(0, 80)}...`);
    console.log(`  EN: ${seo.pinterest_title_en}`);
    console.log(`      ${seo.pinterest_description_en.substring(0, 80)}...`);

    if (!DRY_RUN) {
      const { error: updateError } = await supabase
        .from('recipes')
        .update({
          pinterest_title: seo.pinterest_title,
          pinterest_description: seo.pinterest_description,
          pinterest_title_en: seo.pinterest_title_en,
          pinterest_description_en: seo.pinterest_description_en,
        })
        .eq('id', recipe.id);

      if (updateError) {
        console.error(`  ❌ Erreur sauvegarde: ${updateError.message}`);
        failed++;
        continue;
      }
      console.log(`  ✅ Sauvegardé`);
    } else {
      console.log(`  ⏭️  Dry run - pas de sauvegarde`);
    }

    success++;

    // Small delay between requests
    if (i < toProcess.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n========================================');
  console.log(`✅ Succès: ${success}`);
  console.log(`❌ Échoué: ${failed}`);
  console.log(`📊 Total: ${toProcess.length}`);
  if (DRY_RUN) console.log('\n⚠️  Mode dry-run - rien n\'a été sauvegardé');
}

main().catch(console.error);
