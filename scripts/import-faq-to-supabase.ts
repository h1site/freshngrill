import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabase = createClient(
  'https://cjbdgfcxewvxcojxbuab.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA'
);

interface FaqItem {
  q: string;
  a: string;
}

interface RecipeFaq {
  id: number;
  title: string;
  lang: string;
  faqs: FaqItem[];
}

async function importFaq() {
  // Lire les fichiers FAQ
  const faqFr: RecipeFaq[] = JSON.parse(fs.readFileSync('faq_recettes_fr.json', 'utf-8'));
  const faqEn: RecipeFaq[] = JSON.parse(fs.readFileSync('faq_recettes_en.json', 'utf-8'));

  console.log(`📖 ${faqFr.length} recettes FR, ${faqEn.length} recettes EN`);

  // Créer un map EN par ID
  const enMap = new Map<number, RecipeFaq>();
  faqEn.forEach(r => enMap.set(r.id, r));

  let updated = 0;
  let errors = 0;

  for (const frRecipe of faqFr) {
    const enRecipe = enMap.get(frRecipe.id);

    // Fusionner les FAQ FR + EN
    const mergedFaq = {
      id: frRecipe.id,
      title_fr: frRecipe.title,
      title_en: enRecipe?.title || '',
      faq: frRecipe.faqs.map((faq, i) => ({
        question_fr: faq.q,
        answer_fr: faq.a,
        question_en: enRecipe?.faqs[i]?.q || '',
        answer_en: enRecipe?.faqs[i]?.a || ''
      }))
    };

    // Mettre à jour dans Supabase
    const { error } = await supabase
      .from('recipes')
      .update({ faq: JSON.stringify(mergedFaq) })
      .eq('id', frRecipe.id);

    if (error) {
      console.error(`❌ Erreur pour recette ${frRecipe.id}:`, error.message);
      errors++;
    } else {
      updated++;
    }
  }

  console.log(`\n✅ ${updated} recettes mises à jour`);
  if (errors > 0) console.log(`❌ ${errors} erreurs`);
}

importFaq();
