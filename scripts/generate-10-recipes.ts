/**
 * Generate 10 new recipes (FR + EN) using OpenAI - No images
 * Usage: npx tsx scripts/generate-10-recipes.ts
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Category IDs (from DB)
// 4=Porc, 10=Soupes, 22=Volaille, 23=Canada, 27=Amuse-gueules
// 3=Desserts, 5=Déjeuner, 37=Boeuf
// Check: plats-principaux-porc, dessert, dejeuner, etc.

interface RecipeConcept {
  slug: string;
  theme: string;
  categoryIds: number[];
  tags: string[];
}

const RECIPES: RecipeConcept[] = [
  {
    slug: 'filet-de-porc-aux-canneberges',
    theme: 'Filet de porc aux canneberges, sauce sucrée-salée avec canneberges fraîches ou séchées. Plat principal élégant et savoureux.',
    categoryIds: [4, 23], // Porc + Canada
    tags: ['porc', 'canneberges', 'plat-principal', 'comfort-food'],
  },
  {
    slug: 'pain-dore-a-lancienne',
    theme: "Pain doré à l'ancienne (French toast classique québécois), trempé dans un mélange d'oeufs, lait, vanille et cannelle. Déjeuner réconfortant.",
    categoryIds: [5, 23], // Déjeuner + Canada
    tags: ['dejeuner', 'brunch', 'pain-dore', 'classique'],
  },
  {
    slug: 'croustade-aux-pommes-et-fraises',
    theme: 'Croustade aux pommes et aux fraises avec garniture croustillante à la cassonade et flocons d\'avoine. Dessert québécois par excellence.',
    categoryIds: [3, 23], // Desserts + Canada
    tags: ['dessert', 'croustade', 'pommes', 'fraises', 'comfort-food'],
  },
  {
    slug: 'haut-de-cuisse-poulet-garam-masala',
    theme: 'Hauts de cuisse de poulet au garam masala, épices indiennes, cuisson au four ou à la poêle. Savoureux et juteux.',
    categoryIds: [22], // Volaille
    tags: ['poulet', 'garam-masala', 'epices', 'plat-principal'],
  },
  {
    slug: 'jambon-recette-grand-mere',
    theme: "Jambon de grand-mère, recette traditionnelle québécoise avec glaçage à la moutarde et cassonade ou érable. Cuisson lente au four.",
    categoryIds: [4, 23], // Porc + Canada
    tags: ['jambon', 'grand-mere', 'traditionnel', 'fetes'],
  },
  {
    slug: 'pain-aux-bananes-chocolat',
    theme: 'Pain aux bananes et aux pépites de chocolat, moelleux et facile. Recette québécoise classique avec bananes bien mûres.',
    categoryIds: [3, 23], // Desserts + Canada
    tags: ['pain-aux-bananes', 'chocolat', 'dessert', 'collation'],
  },
  {
    slug: 'guacamole-maison',
    theme: 'Guacamole maison frais et authentique. Avocats mûrs, lime, coriandre, oignon rouge, tomate. Recette mexicaine facile.',
    categoryIds: [27], // Amuse-gueules
    tags: ['guacamole', 'mexicain', 'entree', 'amuse-gueule'],
  },
  {
    slug: 'carrés-rice-krispies',
    theme: 'Carrés Rice Krispies classiques (carrés de riz soufflé au marshmallow). Recette facile, sans cuisson, parfaite avec les enfants.',
    categoryIds: [3], // Desserts
    tags: ['rice-krispies', 'sans-cuisson', 'enfants', 'collation'],
  },
  {
    slug: 'pouding-chomeur-original',
    theme: "Pouding chômeur original, recette traditionnelle québécoise avec sauce au sirop d'érable et cassonade. Le vrai de vrai.",
    categoryIds: [3, 23], // Desserts + Canada
    tags: ['pouding-chomeur', 'erable', 'quebecois', 'traditionnel', 'dessert'],
  },
  {
    slug: 'chili-facile-rapide',
    theme: 'Chili facile et rapide, boeuf haché, haricots rouges, tomates, épices. Prêt en 30 minutes. Repas de semaine parfait.',
    categoryIds: [37, 10], // Boeuf + Soupes
    tags: ['chili', 'boeuf', 'rapide', 'facile', 'repas-semaine'],
  },
];

async function generateRecipe(concept: RecipeConcept): Promise<any> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Tu es une chroniqueuse culinaire québécoise experte. Tu génères des recettes complètes et authentiques en JSON.
Ton style est chaleureux, québécois, engageant. Tu utilises des expressions québécoises naturelles.
IMPORTANT: Toutes les recettes doivent être ORIGINALES - ne copie aucune recette existante.
Les introductions et conclusions doivent être substantielles (2-3 paragraphes chacune).
Les ingrédients doivent utiliser des unités métriques pour le français (g, ml, c. à soupe, c. à thé) et impériales pour l'anglais (cups, tbsp, tsp, oz, lb).`
      },
      {
        role: 'user',
        content: `Génère une recette complète sur ce thème: "${concept.theme}"

Retourne un JSON avec EXACTEMENT cette structure:
{
  "fr": {
    "title": "Titre en français (accrocheur, max 60 chars)",
    "excerpt": "Description courte (1-2 phrases, max 200 chars)",
    "content": "Astuces et conseils (2-3 phrases)",
    "introduction": "Introduction engageante (2-3 paragraphes séparés par \\n\\n)",
    "conclusion": "Conclusion avec suggestions de service et variantes (2 paragraphes séparés par \\n\\n)",
    "seo_title": "Titre SEO optimisé | Menucochon",
    "seo_description": "Meta description SEO (max 160 chars)",
    "ingredients": [{"title": "Nom du groupe", "items": [{"quantity": "2", "unit": "c. à soupe", "name": "nom", "note": "optionnel"}]}],
    "instructions": [{"step": 1, "title": "Titre étape", "content": "Description détaillée", "tip": "Astuce optionnelle"}],
    "faq": [
      {"question_fr": "Question?", "answer_fr": "Réponse détaillée.", "question_en": "Question?", "answer_en": "Detailed answer."},
      {"question_fr": "Question?", "answer_fr": "Réponse détaillée.", "question_en": "Question?", "answer_en": "Detailed answer."},
      {"question_fr": "Question?", "answer_fr": "Réponse détaillée.", "question_en": "Question?", "answer_en": "Detailed answer."}
    ]
  },
  "en": {
    "title": "English title (catchy, max 60 chars)",
    "slug_en": "english-slug-here",
    "excerpt": "Short description (1-2 sentences, max 200 chars)",
    "content": "Tips and tricks (2-3 sentences)",
    "introduction": "Engaging introduction (2-3 paragraphs separated by \\n\\n)",
    "conclusion": "Conclusion with serving suggestions and variations (2 paragraphs separated by \\n\\n)",
    "seo_title": "SEO optimized title | Menucochon",
    "seo_description": "SEO meta description (max 160 chars)",
    "ingredients": [{"title": "Group name", "items": [{"quantity": "2", "unit": "tbsp", "name": "name", "note": "optional"}]}],
    "instructions": [{"step": 1, "title": "Step title", "content": "Detailed description", "tip": "Optional tip"}]
  },
  "meta": {
    "prep_time": 15,
    "cook_time": 25,
    "rest_time": 0,
    "total_time": 40,
    "servings": 6,
    "servings_unit": "portions",
    "difficulty": "facile",
    "cuisine": "Québécoise",
    "nutrition": {"calories": 350, "protein": 15, "carbs": 30, "fat": 18, "fiber": 2, "sugar": 5, "sodium": 600}
  }
}

IMPORTANT:
- slug_en: génère un slug anglais pertinent et court.
- Les quantités, temps de cuisson et nutrition doivent être RÉALISTES.
- Les instructions doivent avoir 5-8 étapes détaillées.
- Au moins 2 groupes d'ingrédients.
- La FAQ doit répondre à de vraies questions que les gens posent sur Google.`
      }
    ],
    temperature: 0.8,
    max_tokens: 4000,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('Empty response from GPT');
  return JSON.parse(content);
}

async function main() {
  console.log('🍳 Génération de 10 recettes avec OpenAI');
  console.log('');

  const results: { slug: string; slugEn: string; title: string; titleEn: string; id: number }[] = [];
  let success = 0;
  let failed = 0;

  for (let i = 0; i < RECIPES.length; i++) {
    const concept = RECIPES[i];
    console.log(`\n[${i + 1}/10] 🍽️  ${concept.slug}`);

    // Check if already exists
    const { data: existing } = await supabase.from('recipes').select('id').eq('slug', concept.slug).single();
    if (existing) {
      console.log('  ⏭️  Already exists, skipping');
      const { data: trans } = await supabase.from('recipe_translations').select('slug_en, title').eq('recipe_id', existing.id).eq('locale', 'en').single();
      const { data: rec } = await supabase.from('recipes').select('title').eq('id', existing.id).single();
      results.push({ slug: concept.slug, slugEn: trans?.slug_en || concept.slug, title: rec?.title || '', titleEn: trans?.title || '', id: existing.id });
      success++;
      continue;
    }

    try {
      console.log('  📝 Generating with GPT-4o...');
      const recipe = await generateRecipe(concept);

      const faqData = {
        id: null,
        title_fr: `FAQ – ${recipe.fr.title}`,
        title_en: `FAQ – ${recipe.en.title}`,
        faq: recipe.fr.faq || [],
      };

      // Insert recipe
      const { data: inserted, error: insertError } = await supabase.from('recipes').insert({
        slug: concept.slug,
        title: recipe.fr.title,
        excerpt: recipe.fr.excerpt,
        content: recipe.fr.content,
        introduction: recipe.fr.introduction,
        conclusion: recipe.fr.conclusion,
        featured_image: null,
        prep_time: recipe.meta.prep_time,
        cook_time: recipe.meta.cook_time,
        rest_time: recipe.meta.rest_time || 0,
        total_time: recipe.meta.total_time,
        servings: recipe.meta.servings,
        servings_unit: recipe.meta.servings_unit || 'portions',
        difficulty: recipe.meta.difficulty || 'facile',
        ingredients: recipe.fr.ingredients,
        instructions: recipe.fr.instructions,
        nutrition: recipe.meta.nutrition,
        tags: concept.tags,
        cuisine: recipe.meta.cuisine || 'Québécoise',
        author: 'Menucochon',
        seo_title: recipe.fr.seo_title,
        seo_description: recipe.fr.seo_description,
        faq: JSON.stringify(faqData),
      }).select('id').single();

      if (insertError || !inserted) {
        console.error('  ❌ Insert error:', insertError?.message);
        failed++;
        continue;
      }

      console.log('  ✅ Recipe ID:', inserted.id);

      // Link categories
      if (concept.categoryIds.length > 0) {
        await supabase.from('recipe_categories').insert(
          concept.categoryIds.map(catId => ({ recipe_id: inserted.id, category_id: catId }))
        );
      }

      // Insert English translation
      const slugEn = recipe.en.slug_en || concept.slug;
      await supabase.from('recipe_translations').insert({
        recipe_id: inserted.id,
        locale: 'en',
        slug_en: slugEn,
        title: recipe.en.title,
        excerpt: recipe.en.excerpt,
        content: recipe.en.content,
        introduction: recipe.en.introduction,
        conclusion: recipe.en.conclusion,
        ingredients: recipe.en.ingredients,
        instructions: recipe.en.instructions,
        seo_title: recipe.en.seo_title,
        seo_description: recipe.en.seo_description,
        faq: JSON.stringify(recipe.fr.faq || []),
      });

      results.push({
        slug: concept.slug,
        slugEn,
        title: recipe.fr.title,
        titleEn: recipe.en.title,
        id: inserted.id,
      });

      success++;
      console.log(`  ✅ Done! FR: ${recipe.fr.title} | EN: ${recipe.en.title}`);

      // Delay between API calls
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`  ❌ Error:`, error instanceof Error ? error.message : error);
      failed++;
    }
  }

  // Summary
  console.log('\n\n========================================');
  console.log('📊 RÉSUMÉ');
  console.log(`✅ Réussies: ${success}/10`);
  console.log(`❌ Échouées: ${failed}/10`);
  console.log('\n📋 LIENS:');
  console.log('');
  for (const r of results) {
    console.log(`${r.title}`);
    console.log(`  FR: https://menucochon.com/recette/${r.slug}/`);
    console.log(`  EN: https://menucochon.com/en/recipe/${r.slugEn}/`);
    console.log('');
  }
}

main().catch(console.error);
