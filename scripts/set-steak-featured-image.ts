/**
 * Set Unsplash steak photo as featured_image for the steak cooking guide article
 * Usage: npx tsx scripts/set-steak-featured-image.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UNSPLASH_PHOTOS = [
  'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&h=630&fit=crop&q=80', // grilled steak on plate
  'https://images.unsplash.com/photo-1558030006-450675393462?w=1200&h=630&fit=crop&q=80', // steak with herbs
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=630&fit=crop&q=80', // steak on cutting board
  'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=1200&h=630&fit=crop&q=80', // steak bbq
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
      console.log(`  Downloaded: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);

      const filename = 'posts/guide-cuisson-steak-featured.jpg';
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filename, buffer, { contentType, upsert: true });

      if (uploadError) {
        console.log(`  Upload error: ${uploadError.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filename);

      console.log(`  Uploaded: ${publicUrl}`);

      // Update article featured_image
      const { error: updateError } = await supabase
        .from('posts')
        .update({ featured_image: publicUrl })
        .eq('slug', 'guide-cuisson-steak');

      if (updateError) {
        console.error(`  Update error: ${updateError.message}`);
      } else {
        console.log(`\n✅ Featured image set!`);
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
