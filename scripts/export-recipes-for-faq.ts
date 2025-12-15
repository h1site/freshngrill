import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODk3MzQsImV4cCI6MjA4MDg2NTczNH0.rjCE0Fec2hQuOrFpIG0u69RbFiEx-zAu3P6kXMTYfxY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportRecipesForFaq() {
  // Récupérer toutes les recettes avec leur FAQ existante
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, slug, excerpt, faq')
    .order('title');

  if (error) {
    console.error('Erreur:', error);
    return;
  }

  // Récupérer les traductions anglaises
  const { data: translations } = await supabase
    .from('recipe_translations')
    .select('recipe_id, title, excerpt, faq')
    .eq('locale', 'en');

  const translationMap = new Map();
  translations?.forEach(t => {
    translationMap.set(t.recipe_id, t);
  });

  // Construire le fichier JSON
  const output = {
    instructions: "Génère 3-5 FAQ par recette pour les rich snippets Google. Questions pertinentes sur la préparation, conservation, substitutions, etc.",
    format_exemple: {
      question_fr: "Question en français?",
      answer_fr: "Réponse complète en français (2-3 phrases).",
      question_en: "Question in English?",
      answer_en: "Complete answer in English (2-3 sentences)."
    },
    recettes: recipes?.map(r => {
      const enTrans = translationMap.get(r.id);
      return {
        id: r.id,
        title_fr: r.title,
        title_en: enTrans?.title || '',
        excerpt_fr: r.excerpt || '',
        excerpt_en: enTrans?.excerpt || '',
        faq_fr_existante: r.faq || '',
        faq_en_existante: enTrans?.faq || '',
        faq: []
      };
    })
  };

  fs.writeFileSync('recettes-faq-export.json', JSON.stringify(output, null, 2));
  console.log(`✓ Exporté ${recipes?.length} recettes dans recettes-faq-export.json`);
}

exportRecipesForFaq();
