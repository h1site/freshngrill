/**
 * Upload steak-eng.png and update EN article to use it
 * Usage: npx tsx scripts/fix-steak-en-image.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // 1. Upload steak-eng.png
  console.log('Uploading steak-eng.png...');
  const buffer = fs.readFileSync(path.join(process.cwd(), 'steak-eng.png'));
  console.log(`  Size: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);

  const filename = 'posts/guide-cuisson-steak-en.png';

  const { error: uploadError } = await supabase.storage
    .from('recipe-images')
    .upload(filename, buffer, { contentType: 'image/png', upsert: true });

  if (uploadError) throw new Error(`Upload error: ${uploadError.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(filename);

  console.log(`  Uploaded: ${publicUrl}`);

  // 2. Get the EN translation content
  const { data: post } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', 'guide-cuisson-steak')
    .single();

  if (!post) { console.error('Post not found!'); return; }

  const { data: translation } = await supabase
    .from('post_translations')
    .select('id, content')
    .eq('post_id', post.id)
    .eq('locale', 'en')
    .single();

  if (!translation) { console.error('EN translation not found!'); return; }

  // 3. Replace the FR image URL with EN image URL in the EN content
  const frImageUrl = 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/posts/guide-cuisson-steak.png';
  const updatedContent = translation.content.replace(frImageUrl, publicUrl);

  const { error: updateError } = await supabase
    .from('post_translations')
    .update({ content: updatedContent })
    .eq('id', translation.id);

  if (updateError) { console.error('Update error:', updateError); return; }

  console.log('\n✅ EN article updated with steak-eng.png!');
  console.log(`   Image: ${publicUrl}`);
}

main().catch(console.error);
