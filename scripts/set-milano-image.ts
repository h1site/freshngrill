import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const filePath = '/tmp/milano-cortina.jpg';
  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = 'posts/milano-cortina-2026-athletes-repas.jpg';

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('recipe-images')
    .upload(storagePath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return;
  }

  const { data: urlData } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(storagePath);

  const imageUrl = urlData.publicUrl;
  console.log('Image uploaded:', imageUrl);

  // Update post featured_image
  const { error: updateError } = await supabase
    .from('posts')
    .update({ featured_image: imageUrl })
    .eq('slug', 'repas-athletes-jeux-olympiques-milano-cortina-2026');

  if (updateError) {
    console.error('Update error:', updateError);
    return;
  }

  console.log('✅ Featured image set for Milano Cortina article!');
}

main().catch(console.error);
