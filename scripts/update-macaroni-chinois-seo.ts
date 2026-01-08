import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Corrections: le layout ajoute déjà " | Menucochon" via template
// Donc seo_title ne doit PAS contenir "| Menucochon"
const corrections = [
  { slug: 'macaroni-chinois', seo_title: 'Recette Macaroni Chinois Maison' },
  { slug: 'ceviche-peruvien', seo_title: 'Ceviche Péruvien Authentique : Recette avec Leche de Tigre' },
  { slug: 'crepe-soufflee-dutch-baby', seo_title: 'Crêpe soufflée (Dutch Baby Pancake) - Recette facile' },
];

async function fixSeoTitles() {
  for (const { slug, seo_title } of corrections) {
    const { data, error } = await supabase
      .from('recipes')
      .update({ seo_title })
      .eq('slug', slug)
      .select('id, slug, seo_title');

    if (error) {
      console.error(`❌ Erreur pour ${slug}:`, error);
    } else {
      console.log(`✅ ${slug}: "${seo_title}"`);
    }
  }
}

fixSeoTitles();
