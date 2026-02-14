/**
 * Download Unsplash Valentine's Day image and set as article featured_image
 * Usage: npx tsx scripts/set-saint-valentin-image.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UNSPLASH_PHOTOS = [
  'https://images.unsplash.com/photo-1758874089745-72a5f308af86?w=1200&h=630&fit=crop&q=80', // couple romantic dinner candles
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&h=630&fit=crop&q=80', // heart cookies
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=630&fit=crop&q=80', // couple holding hands
];

async function main() {
  for (let i = 0; i < UNSPLASH_PHOTOS.length; i++) {
    const url = UNSPLASH_PHOTOS[i];
    console.log(`Trying image ${i + 1}...`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`  Failed: ${response.status}`);
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      console.log(`  Downloaded: ${(buffer.length / 1024).toFixed(0)}KB (${contentType})`);

      const filename = `posts/saint-valentin-2026-featured.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filename, buffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.log(`  Upload error: ${uploadError.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filename);

      console.log(`  Uploaded: ${publicUrl}`);

      // Update the saint-valentin article (post ID 97)
      const { error: updateError } = await supabase
        .from('posts')
        .update({ featured_image: publicUrl })
        .eq('slug', '14-recettes-saint-valentin');

      if (updateError) {
        console.error(`  Update error: ${updateError.message}`);
      } else {
        console.log(`\n✅ Article featured_image set!`);
        console.log(`   ${publicUrl}`);
      }

      return;
    } catch (err: any) {
      console.log(`  Error: ${err.message}`);
    }
  }

  console.log('All URLs failed');
}

main().catch(console.error);
