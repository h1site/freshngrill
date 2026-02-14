/**
 * Generate 11 new recipes (FR + EN) using OpenAI - No images
 * Usage: npx tsx scripts/generate-11-recipes.ts
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

// Known category IDs:
// 3=Desserts, 4=Porc, 5=Déjeuner, 10=Soupes, 22=Volaille, 23=Canada, 27=Amuse-gueules, 37=Boeuf

interface RecipeConcept {
  slug: string;
  theme: string;
  categoryIds: number[];
  tags: string[];
}

const RECIPES: RecipeConcept[] = [
  {
    slug: 'tofu-general-tao',
    theme: "Tofu Général Tao, recette végétarienne du classique chinois. Tofu croustillant frit dans une sauce sucrée-épicée au gingembre, ail et piments. Aussi bon que le poulet!",
    categoryIds: [23],
    tags: ['tofu', 'vegetarien', 'asiatique', 'chinois', 'general-tao', 'plat-principal'],
  },
  {
    slug: 'pate-a-pizza-maison',
    theme: "Pâte à pizza maison facile et parfaite. Recette de base avec farine, eau, levure, sel et huile d'olive. Croustillante à l'extérieur, moelleuse à l'intérieur. Avec astuces pour la réussir à coup sûr.",
    categoryIds: [23],
    tags: ['pizza', 'pate', 'base', 'maison', 'facile', 'italien'],
  },
  {
    slug: 'fudge-au-chocolat',
    theme: "Fudge au chocolat à la Seb, recette maison ultra fondante et facile. Chocolat, lait condensé, beurre. Pas besoin de thermomètre. Le meilleur fudge que tu vas manger!",
    categoryIds: [3, 23],
    tags: ['fudge', 'chocolat', 'dessert', 'noel', 'sans-cuisson', 'facile'],
  },
  {
    slug: 'soupe-oignon-classique',
    theme: "Soupe à l'oignon classique et réconfortante. Oignons caramélisés lentement, bouillon de boeuf riche, gratinée au fromage suisse et gruyère. La recette traditionnelle parfaite.",
    categoryIds: [10, 23],
    tags: ['soupe', 'oignon', 'gratinee', 'fromage', 'comfort-food', 'hiver'],
  },
  {
    slug: 'porc-effiloche',
    theme: "Porc effiloché (pulled pork) tendre et savoureux, cuisson lente au four ou à la mijoteuse. Épaule de porc avec épices BBQ, sauce fumée. Parfait pour les sandwichs.",
    categoryIds: [4, 23],
    tags: ['porc', 'effiloche', 'pulled-pork', 'bbq', 'mijoteuse', 'sandwich'],
  },
  {
    slug: 'soupe-tonkinoise',
    theme: "Soupe tonkinoise (Phở) vietnamienne maison. Bouillon parfumé aux épices (anis étoilé, cannelle, clou de girofle), nouilles de riz, boeuf tranché mince, herbes fraîches. Authentique et réconfortante.",
    categoryIds: [10],
    tags: ['soupe', 'tonkinoise', 'pho', 'vietnamien', 'asiatique', 'boeuf', 'nouilles'],
  },
  {
    slug: 'salade-poulet-nouilles',
    theme: "Salade de poulet et nouilles asiatique, fraîche et croquante. Poulet grillé, nouilles de riz ou vermicelles, légumes croquants (chou, carottes, concombre), vinaigrette aux arachides et lime.",
    categoryIds: [22],
    tags: ['salade', 'poulet', 'nouilles', 'asiatique', 'sante', 'ete'],
  },
  {
    slug: 'muffins-aux-pommes',
    theme: "Muffins aux pommes moelleux, recette québécoise facile. Pommes fraîches en morceaux, cannelle, cassonade, garniture croustillante sur le dessus. Parfaits pour le déjeuner ou la collation.",
    categoryIds: [3, 5, 23],
    tags: ['muffins', 'pommes', 'dejeuner', 'collation', 'cannelle', 'facile'],
  },
  {
    slug: 'riz-frit',
    theme: "Riz frit (fried rice) à la maison, recette asiatique facile et rapide. Riz de la veille, oeufs, légumes, sauce soya. Prêt en 15 minutes. Les trucs pour un vrai bon riz frit.",
    categoryIds: [23],
    tags: ['riz', 'frit', 'asiatique', 'chinois', 'rapide', 'facile', 'repas-semaine'],
  },
  {
    slug: 'muffins-aux-bleuets',
    theme: "Muffins aux bleuets classiques, moelleux et gonflés. Bleuets frais ou congelés, babeurre pour la texture, dôme parfait. Recette québécoise éprouvée, la meilleure!",
    categoryIds: [3, 5, 23],
    tags: ['muffins', 'bleuets', 'dejeuner', 'collation', 'classique', 'quebecois'],
  },
  {
    slug: 'sous-marin-vegetarien',
    theme: "Sous-marin végétarien garni et satisfaisant. Pain sub croustillant, légumes grillés (poivrons, courgettes, aubergine), fromage fondu, pesto ou mayo épicée. Un lunch qui a du punch!",
    categoryIds: [23],
    tags: ['sous-marin', 'vegetarien', 'sandwich', 'lunch', 'legumes', 'fromage'],
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
  const total = RECIPES.length;
  console.log(`🍳 Génération de ${total} recettes avec OpenAI`);
  console.log('');

  const results: { slug: string; slugEn: string; title: string; titleEn: string; id: number }[] = [];
  let success = 0;
  let failed = 0;

  for (let i = 0; i < RECIPES.length; i++) {
    const concept = RECIPES[i];
    console.log(`\n[${i + 1}/${total}] 🍽️  ${concept.slug}`);

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
  console.log(`✅ Réussies: ${success}/${total}`);
  console.log(`❌ Échouées: ${failed}/${total}`);
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
