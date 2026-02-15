/**
 * Download Unsplash Super Bowl image and set as article featured_image
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Unsplash football/Super Bowl images (free to use)
const UNSPLASH_PHOTOS = [
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&h=630&fit=crop&q=80', // football on field
  'https://images.unsplash.com/photo-1504450758481-7338bbe75005?w=1200&h=630&fit=crop&q=80', // football stadium
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&h=630&fit=crop&q=80', // american football
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200&h=630&fit=crop&q=80', // football game
  'https://images.unsplash.com/photo-1461896836934-bd45ba054ba7?w=1200&h=630&fit=crop&q=80', // football stadium aerial
];

async function main() {
  // Try each URL until one works
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
      console.log(`  Downloaded: ${(buffer.length / 1024 / 1024).toFixed(2)}MB (${contentType})`);

      // Upload to Supabase
      const filename = `posts/super-bowl-2026-featured.jpg`;
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

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filename);

      console.log(`  Uploaded: ${publicUrl}`);

      // Update article
      const { error: updateError } = await supabase
        .from('posts')
        .update({ featured_image: publicUrl })
        .eq('id', 95);

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
