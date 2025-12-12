import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Unit translations
const unitTranslations: Record<string, string> = {
  'c. à soupe': 'tbsp',
  'c. a soupe': 'tbsp',
  'cuillère à soupe': 'tbsp',
  'cuillère à café': 'tsp',
  'c. à thé': 'tsp',
  'c. à café': 'tsp',
  'c. a the': 'tsp',
  'tasse': 'cup',
  'Tasse': 'cup',
};

// Words to find and replace in content
const contentReplacements: [RegExp, string][] = [
  [/\bminute\b/gi, 'minute'],
  [/\bminutes\b/gi, 'minutes'],
  [/\bPour\b/g, 'For'],
  [/\bpour\b/g, 'for'],
  [/\bpoulet\b/gi, 'chicken'],
  [/\bporc\b/gi, 'pork'],
  [/\bboeuf\b/gi, 'beef'],
  [/\bBoeuf\b/g, 'Beef'],
  [/\bbœuf\b/gi, 'beef'],
  [/\blégumes\b/gi, 'vegetables'],
  [/\blégume\b/gi, 'vegetable'],
  [/\bfromage\b/gi, 'cheese'],
  [/\bcrème\b/gi, 'cream'],
  [/\bCrème\b/g, 'Cream'],
  [/\blait\b/gi, 'milk'],
  [/\bfarine\b/gi, 'flour'],
  [/\bsucre\b/gi, 'sugar'],
  [/\bsel\b/gi, 'salt'],
  [/\bpoivre\b/gi, 'pepper'],
  [/\bhuile\b/gi, 'oil'],
  [/\bbeurre\b/gi, 'butter'],
  [/\bvin\b/gi, 'wine'],
  [/\bvinaigrette\b/gi, 'dressing'],
  [/\bVinaigrette\b/g, 'Dressing'],
  [/\btasse\b/gi, 'cup'],
  [/\bau\b/g, 'with'],
  [/\bet\b/g, 'and'],
  [/\bdu\b/g, 'of the'],
  [/\bdes\b/g, 'of the'],
  [/\bles\b/g, 'the'],
  [/\bune\b/g, 'a'],
  [/\bdans\b/g, 'in'],
  [/\bsur\b/g, 'on'],
  [/\bavec\b/g, 'with'],
  [/\bÉtape\b/g, 'Step'],
  [/\bétape\b/g, 'step'],
];

async function fixAllRecipes() {
  // Get all English translations
  const { data: translations } = await supabase
    .from('recipe_translations')
    .select('recipe_id, title, ingredients, instructions')
    .eq('locale', 'en');

  let fixedCount = 0;

  for (const t of translations || []) {
    let needsUpdate = false;
    const ingredients = JSON.parse(JSON.stringify(t.ingredients || []));
    const instructions = JSON.parse(JSON.stringify(t.instructions || []));

    // Fix ingredients
    for (const group of ingredients) {
      if (!group.items) continue;
      for (const item of group.items) {
        // Fix unit
        if (item.unit && unitTranslations[item.unit]) {
          item.unit = unitTranslations[item.unit];
          needsUpdate = true;
        }
        // Fix name
        if (item.name) {
          let newName = item.name;
          for (const [pattern, replacement] of contentReplacements) {
            newName = newName.replace(pattern, replacement);
          }
          if (newName !== item.name) {
            item.name = newName;
            needsUpdate = true;
          }
        }
      }
    }

    // Fix instructions
    for (const step of instructions) {
      // Fix title
      if (step.title) {
        let newTitle = step.title;
        for (const [pattern, replacement] of contentReplacements) {
          newTitle = newTitle.replace(pattern, replacement);
        }
        if (newTitle !== step.title) {
          step.title = newTitle;
          needsUpdate = true;
        }
      }
      // Fix content
      if (step.content) {
        let newContent = step.content;
        for (const [pattern, replacement] of contentReplacements) {
          newContent = newContent.replace(pattern, replacement);
        }
        if (newContent !== step.content) {
          step.content = newContent;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      const { error } = await supabase
        .from('recipe_translations')
        .update({ ingredients, instructions })
        .eq('recipe_id', t.recipe_id)
        .eq('locale', 'en');

      if (!error) {
        console.log('Fixed recipe ' + t.recipe_id + ': ' + t.title);
        fixedCount++;
      }
    }
  }

  console.log('\nTotal fixed: ' + fixedCount + ' recipes');
}

fixAllRecipes();
