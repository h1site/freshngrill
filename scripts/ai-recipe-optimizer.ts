/**
 * AI Recipe Optimizer - Menu Cochon
 *
 * Utilise Ollama localement pour:
 * - JOB 1: Réviser les textes des recettes + SEO
 * - JOB 2: Catégoriser et assigner l'origine/pays
 * - JOB 3: Extraire et normaliser les ingrédients
 *
 * Usage:
 *   npx tsx scripts/ai-recipe-optimizer.ts --job=1  # Révision textes
 *   npx tsx scripts/ai-recipe-optimizer.ts --job=2  # Catégories/origines
 *   npx tsx scripts/ai-recipe-optimizer.ts --job=3  # Inventaire ingrédients
 *   npx tsx scripts/ai-recipe-optimizer.ts --job=all # Tout faire
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'mistral:latest';

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const SINGLE_RECIPE = process.argv.find(arg => arg.startsWith('--recipe='))?.split('=')[1];

interface Recipe {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null; // astuces
  introduction: string | null;
  conclusion: string | null;
  faq: string | null;
  ingredients: any;
  instructions: any;
  seo_title: string | null;
  seo_description: string | null;
  cuisine: string | null;
  tags: string[] | null;
}

// Patterns de contenu garbage à supprimer
const GARBAGE_PATTERNS = [
  // Navigation et menu
  /Plan du Site\s*MENU/gi,
  /Accueil\s+Recettes\s+/gi,
  /<nav[\s\S]*?<\/nav>/gi,
  /class="[^"]*menu[^"]*"/gi,
  /class="[^"]*nav[^"]*"/gi,

  // Cookies et privacy
  /Webmarketing and SEO agency H1Site\.com/gi,
  /We value your privacy[\s\S]*?No cookies to display\./gi,
  /We use cookies[\s\S]*?consent[\s\S]*?browsing experience/gi,
  /Necessary cookies[\s\S]*?No cookies to display\./gi,
  /Functional cookies[\s\S]*?No cookies to display\./gi,
  /Analytical cookies[\s\S]*?No cookies to display\./gi,
  /Performance cookies[\s\S]*?No cookies to display\./gi,
  /Advertisement cookies[\s\S]*?No cookies to display\./gi,
  /Accept All[\s\S]*?consent/gi,
  /cookies[\s\S]{0,500}?personnally identifiable/gi,
  /cookies[\s\S]{0,200}?stored[\s\S]{0,200}?browser/gi,
  /<script[\s\S]*?<\/script>/gi,
  /class="[^"]*cookie[^"]*"/gi,
  /id="cookie[^"]*"/gi,

  // Footer et éléments de page
  /<footer[\s\S]*?<\/footer>/gi,
  /id="comments"[\s\S]*$/gi,
  /class="comment[\s\S]*$/gi,

  // Breadcrumb et liens internes
  /Accueil\s*[>›»]\s*Recettes/gi,
  /breadcrumb[\s\S]*?<\/[^>]+>/gi,
];

// ============================================
// OLLAMA HELPER
// ============================================

async function askOllama(prompt: string, maxTokens: number = 2000): Promise<string> {
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
        }
      })
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

function extractJSON(text: string): any {
  // Chercher un bloc JSON dans la réponse
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }

  // Essayer de parser directement
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ============================================
// JOB 1: NETTOYAGE TEXTES (introduction, conclusion, content/astuces, faq)
// ============================================

// Nettoie le garbage sans AI
function cleanGarbage(text: string | null): string | null {
  if (!text) return null;

  let cleaned = text;
  for (const pattern of GARBAGE_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Nettoyer les espaces multiples et lignes vides
  cleaned = cleaned
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  return cleaned || null;
}

// Vérifie si un texte contient du garbage
function hasGarbage(text: string | null): boolean {
  if (!text) return false;
  return GARBAGE_PATTERNS.some(pattern => pattern.test(text));
}

async function job1_cleanRecipeText(recipe: Recipe): Promise<Partial<Recipe> | null> {
  console.log(`\n🧹 Nettoyage: ${recipe.title}`);

  const updates: Partial<Recipe> = {};
  let needsUpdate = false;

  // Vérifier et nettoyer chaque champ
  const fieldsToClean: (keyof Recipe)[] = ['introduction', 'conclusion', 'content', 'faq'];

  for (const field of fieldsToClean) {
    const value = recipe[field] as string | null;
    if (hasGarbage(value)) {
      const cleaned = cleanGarbage(value);
      console.log(`  🗑️  ${field}: garbage détecté et nettoyé`);
      if (VERBOSE && value) {
        console.log(`     Avant: ${value.substring(0, 100)}...`);
        console.log(`     Après: ${cleaned?.substring(0, 100) || '(vide)'}...`);
      }
      (updates as any)[field] = cleaned;
      needsUpdate = true;
    }
  }

  // Si du garbage a été trouvé, utiliser l'AI pour polir le texte restant
  if (needsUpdate) {
    // Polir avec AI seulement si nécessaire
    const textToPolish = updates.content || recipe.content;
    if (textToPolish && textToPolish.length > 10) {
      const prompt = `Tu es un éditeur. Ce texte contient peut-être des résidus de scraping web.
Nettoie-le en gardant UNIQUEMENT le contenu utile sur la recette (astuces de cuisine, conseils).
SUPPRIME tout ce qui ressemble à: navigation, cookies, mentions légales, publicités, liens externes.
NE RÉÉCRIS PAS le contenu - garde le texte original s'il est correct.
Si le texte est déjà propre, retourne-le tel quel.
Si le texte est 100% garbage, retourne "null".

TEXTE À NETTOYER:
${textToPolish.substring(0, 2000)}

Réponds UNIQUEMENT avec le texte nettoyé (pas de JSON, pas d'explication).`;

      const response = await askOllama(prompt, 1500);
      if (response && response !== 'null' && response.length > 10) {
        updates.content = response.trim();
      } else if (response === 'null') {
        updates.content = null;
      }
    }
  } else {
    console.log(`  ✓ Aucun garbage détecté`);
    return null;
  }

  return updates;
}

async function runJob1() {
  console.log('\n🚀 JOB 1: Nettoyage des textes (garbage removal)');
  console.log('='.repeat(50));

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, slug, title, excerpt, content, introduction, conclusion, faq, ingredients, instructions, seo_title, seo_description, cuisine, tags')
    .order('id');

  if (error || !recipes) {
    console.error('Erreur fetch recettes:', error);
    return;
  }

  const toProcess = SINGLE_RECIPE
    ? recipes.filter(r => r.slug === SINGLE_RECIPE)
    : recipes;

  console.log(`📊 ${toProcess.length} recettes à traiter`);

  let processed = 0;
  let updated = 0;

  for (const recipe of toProcess) {
    const updates = await job1_cleanRecipeText(recipe as Recipe);

    if (updates && !DRY_RUN) {
      const { error: updateError } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', recipe.id);

      if (updateError) {
        console.log(`  ❌ Erreur update: ${updateError.message}`);
      } else {
        console.log(`  ✅ Mis à jour!`);
        updated++;
      }
    } else if (updates && DRY_RUN) {
      console.log(`  🔍 [DRY RUN] Aurait mis à jour`);
      updated++;
    }

    processed++;
    console.log(`  📈 Progression: ${processed}/${toProcess.length}`);

    // Pause entre les requêtes pour ne pas surcharger Ollama
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n✨ JOB 1 terminé: ${updated}/${processed} recettes mises à jour`);
}

// ============================================
// JOB 2: CATÉGORISATION + ORIGINE
// ============================================

async function job2_categorizeRecipe(recipe: Recipe): Promise<{ origine: string; cuisine: string; categories: string[] } | null> {
  console.log(`\n🌍 Catégorisation: ${recipe.title}`);

  // Extraire les noms d'ingrédients
  const ingredientNames: string[] = [];
  if (Array.isArray(recipe.ingredients)) {
    for (const group of recipe.ingredients) {
      if (group.items) {
        for (const item of group.items) {
          ingredientNames.push(item.name);
        }
      }
    }
  }

  const prompt = `Tu es un expert en cuisine internationale. Analyse cette recette et détermine son origine.

RECETTE:
- Titre: ${recipe.title}
- Ingrédients: ${ingredientNames.join(', ')}
- Tags actuels: ${recipe.tags?.join(', ') || 'aucun'}

ORIGINES POSSIBLES (choisis UNE):
- Québécois (poutine, tourtière, pâté chinois, cipaille, etc.)
- Français (coq au vin, ratatouille, crêpes, etc.)
- Italien (pasta, pizza, risotto, etc.)
- Mexicain (tacos, burritos, enchiladas, etc.)
- Asiatique (sauté, wok, sushi, curry, etc.)
- Américain (burger, BBQ, cheesecake, etc.)
- Méditerranéen (grec, libanais, etc.)
- Autre

CATÉGORIES POSSIBLES (choisis 1-3):
- Entrées
- Plats principaux
- Desserts
- Soupes et potages
- Salades
- Accompagnements
- Petit-déjeuner
- Collations
- Boissons
- Végétarien
- Sans gluten
- Rapide (moins de 30 min)

Réponds UNIQUEMENT en JSON:
{
  "origine": "nom du pays/région",
  "cuisine": "type de cuisine",
  "categories": ["catégorie1", "catégorie2"]
}`;

  const response = await askOllama(prompt, 500);
  const result = extractJSON(response);

  if (!result) {
    console.log('  ❌ Impossible de parser');
    return null;
  }

  if (VERBOSE) {
    console.log('  Origine:', result.origine);
    console.log('  Cuisine:', result.cuisine);
    console.log('  Catégories:', result.categories);
  }

  return result;
}

async function runJob2() {
  console.log('\n🚀 JOB 2: Catégorisation et origines');
  console.log('='.repeat(50));

  // Récupérer les origines existantes
  const { data: origines } = await supabase
    .from('origines')
    .select('id, slug, name');

  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, name');

  console.log(`📊 Origines existantes: ${origines?.length || 0}`);
  console.log(`📊 Catégories existantes: ${categories?.length || 0}`);

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, slug, title, ingredients, tags, cuisine')
    .order('id');

  if (error || !recipes) {
    console.error('Erreur:', error);
    return;
  }

  const toProcess = SINGLE_RECIPE
    ? recipes.filter(r => r.slug === SINGLE_RECIPE)
    : recipes;

  console.log(`📊 ${toProcess.length} recettes à traiter`);

  const origineMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  // Créer les maps pour lookup rapide
  origines?.forEach(o => origineMap.set(o.name.toLowerCase(), o.id));
  categories?.forEach(c => categoryMap.set(c.name.toLowerCase(), c.id));

  let processed = 0;

  for (const recipe of toProcess) {
    const result = await job2_categorizeRecipe(recipe as Recipe);

    if (result && !DRY_RUN) {
      // Mettre à jour le champ cuisine
      await supabase
        .from('recipes')
        .update({ cuisine: result.cuisine })
        .eq('id', recipe.id);

      // Ajouter l'origine si elle existe
      const origineSlug = result.origine.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      let origineId = origineMap.get(result.origine.toLowerCase());

      if (!origineId) {
        // Créer la nouvelle origine
        const { data: newOrigine } = await supabase
          .from('origines')
          .insert({ slug: origineSlug, name: result.origine })
          .select('id')
          .single();

        if (newOrigine && newOrigine.id) {
          origineId = newOrigine.id;
          origineMap.set(result.origine.toLowerCase(), newOrigine.id);
        }
      }

      if (origineId) {
        await supabase
          .from('recipe_origines')
          .upsert({ recipe_id: recipe.id, origine_id: origineId });
      }

      // Ajouter les catégories
      for (const catName of result.categories || []) {
        const catId = categoryMap.get(catName.toLowerCase());
        if (catId) {
          await supabase
            .from('recipe_categories')
            .upsert({ recipe_id: recipe.id, category_id: catId });
        }
      }

      console.log(`  ✅ Mis à jour: ${result.origine} / ${result.categories?.join(', ')}`);
    } else if (result && DRY_RUN) {
      console.log(`  🔍 [DRY RUN] ${result.origine} / ${result.categories?.join(', ')}`);
    }

    processed++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n✨ JOB 2 terminé: ${processed} recettes traitées`);
}

// ============================================
// JOB 3: INVENTAIRE INGRÉDIENTS (Pattern Matching - Sans AI)
// ============================================

// Liste fixe d'ingrédients de base connus (pour le composant "frigo")
const KNOWN_INGREDIENTS = [
  // Viandes
  'boeuf', 'bœuf', 'poulet', 'porc', 'veau', 'agneau', 'dinde', 'canard',
  'jambon', 'bacon', 'saucisse', 'chorizo', 'prosciutto', 'pepperoni',
  // Poissons et fruits de mer
  'saumon', 'thon', 'morue', 'crevette', 'homard', 'crabe', 'pétoncle',
  'tilapia', 'truite', 'sole', 'aiglefin', 'calmar',
  // Produits laitiers
  'lait', 'beurre', 'crème', 'fromage', 'yogourt', 'yogurt', 'mozzarella',
  'parmesan', 'cheddar', 'ricotta', 'mascarpone', 'feta',
  // Oeufs
  'oeuf', 'œuf', 'oeufs', 'œufs',
  // Légumes
  'oignon', 'ail', 'tomate', 'carotte', 'pomme de terre', 'patate',
  'poivron', 'céleri', 'brocoli', 'chou', 'épinard', 'laitue',
  'concombre', 'courgette', 'aubergine', 'champignon', 'avocat',
  'haricot', 'pois', 'lentille', 'maïs', 'asperge', 'poireau',
  'betterave', 'navet', 'radis', 'chou-fleur', 'kale',
  // Fruits
  'pomme', 'banane', 'orange', 'citron', 'lime', 'fraise', 'framboise',
  'bleuet', 'myrtille', 'raisin', 'poire', 'pêche', 'mangue', 'ananas',
  'canneberge', 'cerise',
  // Céréales et féculents
  'riz', 'pâte', 'nouille', 'farine', 'pain', 'quinoa', 'couscous',
  'avoine', 'orge', 'semoule', 'macaroni', 'spaghetti',
  // Légumineuses
  'pois chiche', 'haricot rouge', 'haricot noir', 'lentille',
  // Noix et graines
  'amande', 'noix', 'arachide', 'noisette', 'pacane', 'pistache',
  'graine de sésame', 'graine de tournesol',
  // Condiments et sauces
  'ketchup', 'moutarde', 'mayonnaise', 'vinaigre', 'sauce soya',
  'huile d\'olive', 'huile', 'miel', 'sirop d\'érable', 'sirop',
  // Épices et herbes
  'sel', 'poivre', 'paprika', 'cumin', 'curry', 'cannelle', 'vanille',
  'basilic', 'persil', 'coriandre', 'thym', 'romarin', 'origan',
  'gingembre', 'curcuma', 'muscade',
  // Sucré
  'sucre', 'cassonade', 'chocolat', 'cacao',
  // Autres
  'bouillon', 'tofu', 'tahini', 'lait de coco',
];

// Fonction pour détecter les ingrédients connus dans un texte
function detectKnownIngredients(text: string): string[] {
  const lowerText = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Enlever les accents pour la comparaison

  const found: string[] = [];

  for (const ingredient of KNOWN_INGREDIENTS) {
    const normalizedIngredient = ingredient
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (lowerText.includes(normalizedIngredient)) {
      // Garder le nom avec accents
      found.push(ingredient);
    }
  }

  return [...new Set(found)]; // Dédupliquer
}

async function runJob3() {
  console.log('\n🚀 JOB 3: Inventaire des ingrédients (Pattern Matching)');
  console.log('='.repeat(50));
  console.log(`📋 ${KNOWN_INGREDIENTS.length} ingrédients connus dans la liste`);

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, slug, title, ingredients')
    .order('id');

  if (error || !recipes) {
    console.error('Erreur:', error);
    return;
  }

  // Map pour stocker ingrédient -> recettes
  const ingredientToRecipes = new Map<string, Set<number>>();

  console.log(`\n📊 Analyse de ${recipes.length} recettes...`);

  for (const recipe of recipes) {
    if (!Array.isArray(recipe.ingredients)) continue;

    for (const group of recipe.ingredients) {
      if (!group.items) continue;

      for (const item of group.items) {
        const itemText = item.name || '';
        const detected = detectKnownIngredients(itemText);

        for (const ing of detected) {
          if (!ingredientToRecipes.has(ing)) {
            ingredientToRecipes.set(ing, new Set());
          }
          ingredientToRecipes.get(ing)!.add(recipe.id);
        }
      }
    }
  }

  // Trier par nombre de recettes
  const sortedIngredients = Array.from(ingredientToRecipes.entries())
    .map(([name, recipeIds]) => ({ name, count: recipeIds.size, recipeIds: Array.from(recipeIds) }))
    .sort((a, b) => b.count - a.count);

  console.log(`\n✅ ${sortedIngredients.length} ingrédients détectés dans les recettes`);

  console.log('\n🔝 Top 30 ingrédients les plus utilisés:');
  sortedIngredients.slice(0, 30).forEach((ing, i) => {
    console.log(`  ${i + 1}. ${ing.name} (${ing.count} recettes)`);
  });

  // Insérer dans la base de données
  if (!DRY_RUN) {
    console.log('\n📥 Insertion des ingrédients dans la BD...');

    // D'abord, insérer tous les ingrédients
    for (const ing of sortedIngredients) {
      const slug = ing.name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const { data: existing } = await supabase
        .from('ingredients')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!existing) {
        await supabase
          .from('ingredients')
          .insert({ slug, name: ing.name });
        if (VERBOSE) console.log(`  + Ajouté: ${ing.name}`);
      }
    }

    // Récupérer tous les IDs
    const { data: dbIngredients } = await supabase
      .from('ingredients')
      .select('id, slug, name');

    const ingredientIdMap = new Map<string, number>();
    dbIngredients?.forEach(dbIng => {
      ingredientIdMap.set(dbIng.name.toLowerCase(), dbIng.id);
    });

    // Lier aux recettes
    console.log('📎 Création des liens ingrédients ↔ recettes...');

    let linksCreated = 0;
    for (const ing of sortedIngredients) {
      const ingredientId = ingredientIdMap.get(ing.name.toLowerCase());
      if (!ingredientId) continue;

      for (const recipeId of ing.recipeIds) {
        await supabase
          .from('recipe_ingredients')
          .upsert({ recipe_id: recipeId, ingredient_id: ingredientId });
        linksCreated++;
      }
    }

    console.log(`✅ ${linksCreated} liens créés!`);
  } else {
    console.log('\n🔍 [DRY RUN] Aucune modification effectuée');
  }

  console.log(`\n✨ JOB 3 terminé`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  const jobArg = process.argv.find(arg => arg.startsWith('--job='));
  const job = jobArg?.split('=')[1] || 'help';

  console.log('🍳 AI Recipe Optimizer - Menu Cochon');
  console.log('====================================');
  console.log(`Model: ${MODEL}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (pas de modifications)' : 'LIVE'}`);
  if (SINGLE_RECIPE) console.log(`Recette: ${SINGLE_RECIPE}`);

  switch (job) {
    case '1':
      await runJob1();
      break;
    case '2':
      await runJob2();
      break;
    case '3':
      await runJob3();
      break;
    case 'all':
      await runJob1();
      await runJob2();
      await runJob3();
      break;
    default:
      console.log(`
Usage:
  npx tsx scripts/ai-recipe-optimizer.ts --job=1          # Révision textes + SEO
  npx tsx scripts/ai-recipe-optimizer.ts --job=2          # Catégories + origines
  npx tsx scripts/ai-recipe-optimizer.ts --job=3          # Inventaire ingrédients
  npx tsx scripts/ai-recipe-optimizer.ts --job=all        # Tout faire

Options:
  --dry-run              Ne pas modifier la base de données
  --verbose              Afficher plus de détails
  --recipe=slug          Traiter une seule recette
      `);
  }
}

main().catch(console.error);
