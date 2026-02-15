import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data } = await supabase
    .from('recipes')
    .select('slug, featured_image')
    .in('slug', ['rondelles-oignon-panees', 'tacos-poulet-bbq']);

  console.log('Current featured_image in DB:');
  data?.forEach(r => console.log(`  ${r.slug}: ${r.featured_image}`));

  // Check what's in the article
  const { data: post } = await supabase.from('posts').select('content').eq('id', 95).single();
  const { data: trans } = await supabase.from('post_translations').select('content').eq('post_id', 95).eq('locale', 'en').single();

  for (const slug of ['rondelles-oignon-panees', 'tacos-poulet-bbq']) {
    const linkIdx = post!.content.indexOf(`/recette/${slug}/`);
    if (linkIdx > -1) {
      const before = post!.content.substring(Math.max(0, linkIdx - 1500), linkIdx);
      const imgs = [...before.matchAll(/src="(https?:\/\/[^"]+)"/g)];
      const lastImg = imgs.length > 0 ? imgs[imgs.length - 1][1] : 'NOT FOUND';
      console.log(`\n  FR article img for ${slug}:\n    ${lastImg}`);
    }
  }

  // Check storage for these files
  const { data: files } = await supabase.storage
    .from('recipe-images')
    .list('recipes', { limit: 500, sortBy: { column: 'created_at', order: 'desc' } });

  console.log('\nStorage files matching these slugs:');
  files?.filter(f => f.name.includes('rondelles') || f.name.includes('tacos'))
    .forEach(f => console.log(`  ${f.name} (created: ${f.created_at}, size: ${((f.metadata as any)?.size || 0) / 1024}KB)`));
}

main().catch(console.error);
