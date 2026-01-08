import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
  const { data, error } = await supabase
    .from('recipes')
    .select('slug, title, seo_title')
    .order('slug');

  if (error) { console.error(error); return; }

  console.log('=== Recettes avec seo_title contenant "Menucochon" en double ===\n');

  let duplicates = 0;
  data.forEach(r => {
    const seoTitle = r.seo_title || '';
    const count = (seoTitle.toLowerCase().match(/menucochon/g) || []).length;

    if (count >= 2) {
      console.log(`❌ ${r.slug}`);
      console.log(`   seo_title: ${seoTitle}\n`);
      duplicates++;
    }
  });

  if (duplicates === 0) {
    console.log('✅ Aucun doublon trouvé dans seo_title');
  } else {
    console.log(`\n${duplicates} recette(s) avec "Menucochon" en double`);
  }

  console.log('\n=== Recettes SANS seo_title (utilise title + " | Menucochon") ===\n');
  const noSeo = data.filter(r => !r.seo_title);
  noSeo.forEach(r => {
    console.log(`- ${r.slug}: "${r.title} | Menucochon"`);
  });
  console.log(`\n${noSeo.length} recette(s) sans seo_title personnalisé`);
}

check();
