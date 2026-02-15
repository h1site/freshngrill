import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, title, featured_image')
    .order('published_at', { ascending: false })
    .limit(50);

  if (!recipes) return;

  let cleanCount = 0;
  let uglyCount = 0;

  console.log('=== IMAGE FILENAMES vs RECIPE SLUGS ===\n');
  for (const r of recipes) {
    const url = r.featured_image || '';
    const filename = url.split('/').pop()?.split('?')[0] || '';
    const isClean = filename.includes(r.slug);

    if (!isClean && url) {
      uglyCount++;
      console.log(`  ❌ ${r.slug}`);
      console.log(`     file: ${filename}`);
    } else {
      cleanCount++;
    }
  }

  console.log(`\n✅ Clean names: ${cleanCount}`);
  console.log(`❌ Ugly names: ${uglyCount}`);
}

main().catch(console.error);
