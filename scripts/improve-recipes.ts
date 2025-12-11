/**
 * Script pour améliorer les textes des recettes avec Ollama
 * Usage: npx tsx scripts/improve-recipes.ts [--dry-run] [--limit=10]
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = 'llama3.2';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 10;

async function generate(prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 500,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  return data.response.trim();
}

async function improveDescription(title: string, current: string): Promise<string> {
  const prompt = `Tu es un rédacteur culinaire québécois expert. Améliore cette description de recette en la rendant plus appétissante et engageante. Garde un ton chaleureux et québécois. Maximum 2-3 phrases courtes.

Titre: ${title}
Description actuelle: ${current}

Nouvelle description (directement, sans préambule):`;

  return generate(prompt);
}

async function generateIntro(title: string, ingredients: string[]): Promise<string> {
  const prompt = `Tu es un rédacteur culinaire québécois. Écris une introduction engageante pour cette recette. Maximum 2-3 phrases, ton chaleureux et invitant.

Recette: ${title}
Ingrédients principaux: ${ingredients.slice(0, 4).join(', ')}

Introduction (directement, sans préambule):`;

  return generate(prompt);
}

async function main() {
  console.log('🍳 Amélioration des textes de recettes avec Ollama');
  console.log('='.repeat(50));
  console.log(`Mode: ${dryRun ? 'DRY RUN (pas de modification)' : 'PRODUCTION'}`);
  console.log(`Limite: ${limit} recettes`);
  console.log('');

  // Vérifier Ollama
  try {
    const check = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!check.ok) throw new Error('Ollama non accessible');
    console.log('✅ Ollama disponible');
  } catch {
    console.error('❌ Ollama non disponible. Lancez: ollama serve');
    process.exit(1);
  }

  // Récupérer les recettes sans introduction ou avec description courte
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, excerpt, introduction, ingredients')
    .or('introduction.is.null,introduction.eq.')
    .limit(limit);

  if (error) {
    console.error('❌ Erreur Supabase:', error.message);
    process.exit(1);
  }

  if (!recipes || recipes.length === 0) {
    console.log('✅ Toutes les recettes ont déjà une introduction!');
    return;
  }

  console.log(`\n📝 ${recipes.length} recettes à traiter\n`);

  let improved = 0;
  let failed = 0;

  for (const recipe of recipes) {
    console.log(`\n📖 ${recipe.title}`);

    try {
      // Extraire les noms d'ingrédients
      const ingredientNames: string[] = [];
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach((group: { items?: { name?: string }[] }) => {
          if (group.items) {
            group.items.forEach((item: { name?: string }) => {
              if (item.name) ingredientNames.push(item.name);
            });
          }
        });
      }

      // Générer l'introduction
      console.log('   Génération de l\'introduction...');
      const intro = await generateIntro(recipe.title, ingredientNames);
      console.log(`   → ${intro.substring(0, 80)}...`);

      // Améliorer la description si courte
      let newExcerpt = recipe.excerpt;
      if (!recipe.excerpt || recipe.excerpt.length < 50) {
        console.log('   Amélioration de la description...');
        newExcerpt = await improveDescription(recipe.title, recipe.excerpt || '');
        console.log(`   → ${newExcerpt.substring(0, 80)}...`);
      }

      if (!dryRun) {
        const { error: updateError } = await supabase
          .from('recipes')
          .update({
            introduction: intro,
            excerpt: newExcerpt,
          })
          .eq('id', recipe.id);

        if (updateError) {
          console.error(`   ❌ Erreur update:`, updateError.message);
          failed++;
        } else {
          console.log('   ✅ Mis à jour');
          improved++;
        }
      } else {
        console.log('   ⏭️  DRY RUN - pas de modification');
        improved++;
      }

      // Pause pour ne pas surcharger Ollama
      await new Promise(r => setTimeout(r, 1000));

    } catch (err) {
      console.error(`   ❌ Erreur:`, err);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Terminé!`);
  console.log(`   ${improved} recettes améliorées`);
  if (failed > 0) console.log(`   ${failed} erreurs`);
}

main();
