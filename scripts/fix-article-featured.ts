import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// American football focused Unsplash images
const URLS = [
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&h=630&fit=crop&q=80', // american football ball on grass
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200&h=630&fit=crop&q=80', // NFL game
  'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=1200&h=630&fit=crop&q=80', // american football on field
  'https://images.unsplash.com/photo-1530025809667-1f4bcff8e60f?w=1200&h=630&fit=crop&q=80', // football field
];

async function main() {
  for (const url of URLS) {
    try {
      console.log(`Trying ${url.substring(0, 70)}...`);
      const res = await fetch(url);
      if (!res.ok) { console.log(`  ${res.status}`); continue; }

      const buffer = Buffer.from(await res.arrayBuffer());
      console.log(`  ${(buffer.length / 1024).toFixed(0)}KB`);

      const { error: upErr } = await supabase.storage
        .from('recipe-images')
        .upload('posts/super-bowl-2026-featured.jpg', buffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });
      if (upErr) { console.log(`  Upload: ${upErr.message}`); continue; }

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl('posts/super-bowl-2026-featured.jpg');

      // Add cache bust
      const finalUrl = publicUrl + '?t=' + Date.now();

      await supabase.from('posts').update({ featured_image: finalUrl }).eq('id', 95);
      console.log(`✅ Done: ${finalUrl}`);
      return;
    } catch (e: any) { console.log(`  ${e.message}`); }
  }
}

main().catch(console.error);
