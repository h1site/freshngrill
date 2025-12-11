import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Mots-clés qui indiquent une recette plus difficile
const HARD_KEYWORDS = [
  'flamber', 'flambé', 'émulsion', 'émulsionner', 'tempérer', 'tempérage',
  'caraméliser', 'pocher', 'braiser', 'confire', 'glacer', 'sabayon',
  'meringue', 'soufflé', 'feuilletage', 'pâte feuilletée', 'croûte',
  'réduction', 'déglacer', 'monter au beurre', 'bain-marie',
  'levure', 'pétrissage', 'pétrir', 'façonner', 'abaisser'
];

const MEDIUM_KEYWORDS = [
  'marinade', 'mariner', 'mijoter', 'rissoler', 'saisir', 'gratin',
  'farce', 'farcir', 'paner', 'friture', 'rôtir', 'four',
  'sauce', 'réserver', 'incorporer', 'battre', 'fouetter'
];

type Difficulty = 'facile' | 'moyen' | 'difficile';

interface Recipe {
  id: string;
  title: string;
  difficulty: string | null;
  prep_time: number | null;
  cook_time: number | null;
  rest_time: number | null;
  instructions: { step: string }[] | null;
  ingredients: { items: unknown[] }[] | null;
}

function calculateDifficulty(recipe: Recipe): Difficulty {
  let score = 0;

  // 1. Temps total (prep + cook + rest)
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0) + (recipe.rest_time || 0);
  if (totalTime > 120) score += 3;
  else if (totalTime > 60) score += 2;
  else if (totalTime > 30) score += 1;

  // 2. Nombre d'étapes
  const stepsCount = recipe.instructions?.length || 0;
  if (stepsCount > 10) score += 3;
  else if (stepsCount > 6) score += 2;
  else if (stepsCount > 3) score += 1;

  // 3. Nombre d'ingrédients
  const ingredientsCount = recipe.ingredients?.reduce(
    (acc, group) => acc + (group.items?.length || 0), 0
  ) || 0;
  if (ingredientsCount > 15) score += 3;
  else if (ingredientsCount > 10) score += 2;
  else if (ingredientsCount > 5) score += 1;

  // 4. Mots-clés dans les instructions
  const instructionsText = recipe.instructions
    ?.map(i => i.step)
    .join(' ')
    .toLowerCase() || '';

  const hasHardKeyword = HARD_KEYWORDS.some(kw => instructionsText.includes(kw));
  const hasMediumKeyword = MEDIUM_KEYWORDS.some(kw => instructionsText.includes(kw));

  if (hasHardKeyword) score += 3;
  else if (hasMediumKeyword) score += 1;

  // Déterminer la difficulté finale
  if (score >= 8) return 'difficile';
  if (score >= 4) return 'moyen';
  return 'facile';
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('📊 Mise à jour des difficultés des recettes...\n');
  if (dryRun) console.log('🔍 Mode dry-run activé (pas de modifications)\n');

  // Récupérer toutes les recettes
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, difficulty, prep_time, cook_time, rest_time, instructions, ingredients');

  if (error) {
    console.error('Erreur:', error);
    return;
  }

  const stats = { facile: 0, moyen: 0, difficile: 0 };
  const updates: { id: string; title: string; oldDiff: string | null; newDiff: Difficulty }[] = [];

  for (const recipe of recipes as Recipe[]) {
    const newDifficulty = calculateDifficulty(recipe);
    stats[newDifficulty]++;

    if (recipe.difficulty !== newDifficulty) {
      updates.push({
        id: recipe.id,
        title: recipe.title,
        oldDiff: recipe.difficulty,
        newDiff: newDifficulty
      });
    }
  }

  // Afficher les statistiques
  console.log('📈 Distribution prévue:');
  console.log(`   🟢 Facile: ${stats.facile} recettes`);
  console.log(`   🟡 Moyen: ${stats.moyen} recettes`);
  console.log(`   🔴 Difficile: ${stats.difficile} recettes`);
  console.log(`\n📝 ${updates.length} recettes à mettre à jour\n`);

  if (updates.length > 0) {
    console.log('Changements:');
    updates.slice(0, 20).forEach(u => {
      console.log(`   ${u.title.substring(0, 40).padEnd(40)} : ${u.oldDiff || 'null'} → ${u.newDiff}`);
    });
    if (updates.length > 20) {
      console.log(`   ... et ${updates.length - 20} autres`);
    }
  }

  if (!dryRun && updates.length > 0) {
    console.log('\n⏳ Application des mises à jour...');

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ difficulty: update.newDiff })
        .eq('id', update.id);

      if (updateError) {
        console.error(`❌ Erreur pour ${update.title}:`, updateError);
      }
    }

    console.log('✅ Terminé!');
  }
}

main().catch(console.error);
