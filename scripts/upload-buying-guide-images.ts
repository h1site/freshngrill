/**
 * Script pour télécharger les images Amazon et les uploader vers Supabase
 * Usage: npx tsx scripts/upload-buying-guide-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as https from 'https';
import * as http from 'http';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BUCKET_NAME = 'post-images';

// Images Unsplash de machines à espresso (libres de droits)
const images = [
  {
    name: 'breville-barista-express.jpg',
    url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&q=80',
    amazonUrl: 'https://m.media-amazon.com/images/I/71HjGprXRyL._AC_SL1500_.jpg',
    alt_fr: 'Machine à espresso Breville Barista Express avec moulin intégré en acier inoxydable',
    alt_en: 'Breville Barista Express espresso machine with built-in grinder in stainless steel',
  },
  {
    name: 'delonghi-magnifica-s.jpg',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80',
    amazonUrl: 'https://m.media-amazon.com/images/I/61qjHpHpEeL._AC_SL1500_.jpg',
    alt_fr: 'Machine à café automatique De\'Longhi Magnifica S avec panneau de contrôle',
    alt_en: 'De\'Longhi Magnifica S automatic coffee machine with control panel',
  },
  {
    name: 'gaggia-classic-pro.jpg',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
    amazonUrl: 'https://m.media-amazon.com/images/I/61RdmBGGURL._AC_SL1200_.jpg',
    alt_fr: 'Machine espresso semi-automatique Gaggia Classic Pro en acier inoxydable brossé',
    alt_en: 'Gaggia Classic Pro semi-automatic espresso machine in brushed stainless steel',
  },
  {
    name: 'nespresso-vertuo-next.jpg',
    url: 'https://images.unsplash.com/photo-1606937295547-bc0a11e6f5cf?w=800&q=80',
    amazonUrl: 'https://m.media-amazon.com/images/I/61S2GbYXx8L._AC_SL1500_.jpg',
    alt_fr: 'Machine Nespresso Vertuo Next noire avec capsule et tasse à café',
    alt_en: 'Black Nespresso Vertuo Next machine with capsule and coffee cup',
  },
  {
    name: 'breville-bambino-plus.jpg',
    url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
    amazonUrl: 'https://m.media-amazon.com/images/I/71Qk4j0h45L._AC_SL1500_.jpg',
    alt_fr: 'Machine espresso compacte Breville Bambino Plus en acier inoxydable avec buse vapeur',
    alt_en: 'Compact Breville Bambino Plus espresso machine in stainless steel with steam wand',
  },
];

async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.amazon.ca/',
      },
    };

    protocol.get(url, options, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          console.log(`  Redirecting to: ${redirectUrl}`);
          downloadImage(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadToSupabase(fileName: string, buffer: Buffer, contentType: string): Promise<string> {
  const timestamp = Date.now();
  const fullFileName = `${timestamp}-${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fullFileName, buffer, {
      contentType,
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload error: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fullFileName);

  return urlData.publicUrl;
}

async function updatePostContent(uploadedImages: Map<string, string>) {
  console.log('\nUpdating post content...');

  // Get the post
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('id, content')
    .eq('slug', 'meilleures-machines-espresso')
    .single();

  if (fetchError || !post) {
    console.error('Error fetching post:', fetchError);
    return;
  }

  let updatedContent = post.content;

  // Replace Amazon URLs with Supabase URLs
  for (const img of images) {
    const supabaseUrl = uploadedImages.get(img.name);
    if (supabaseUrl) {
      // Replace the Amazon URL with Supabase URL
      updatedContent = updatedContent.replace(img.amazonUrl, supabaseUrl);
    }
  }

  // Update the post
  const { error: updateError } = await supabase
    .from('posts')
    .update({ content: updatedContent, updated_at: new Date().toISOString() })
    .eq('id', post.id);

  if (updateError) {
    console.error('Error updating post:', updateError);
    return;
  }

  console.log('French post content updated!');

  // Update English translation
  const { data: translation, error: transError } = await supabase
    .from('post_translations')
    .select('id, content')
    .eq('post_id', post.id)
    .eq('locale', 'en')
    .single();

  if (transError || !translation) {
    console.error('Error fetching translation:', transError);
    return;
  }

  let updatedEnContent = translation.content;

  for (const img of images) {
    const supabaseUrl = uploadedImages.get(img.name);
    if (supabaseUrl) {
      updatedEnContent = updatedEnContent.replace(img.amazonUrl, supabaseUrl);
    }
  }

  const { error: transUpdateError } = await supabase
    .from('post_translations')
    .update({ content: updatedEnContent })
    .eq('id', translation.id);

  if (transUpdateError) {
    console.error('Error updating translation:', transUpdateError);
    return;
  }

  console.log('English translation content updated!');
}

async function main() {
  console.log('Starting image download and upload process...\n');

  const uploadedImages = new Map<string, string>();

  for (const img of images) {
    console.log(`Processing: ${img.name}`);
    console.log(`  Downloading from: ${img.url}`);

    try {
      const buffer = await downloadImage(img.url);
      console.log(`  Downloaded: ${buffer.length} bytes`);

      const publicUrl = await uploadToSupabase(img.name, buffer, 'image/jpeg');
      console.log(`  Uploaded to: ${publicUrl}`);

      uploadedImages.set(img.name, publicUrl);
    } catch (error) {
      console.error(`  Error: ${error}`);
    }

    console.log('');
  }

  if (uploadedImages.size > 0) {
    await updatePostContent(uploadedImages);
  }

  console.log('\n✅ Done!');
  console.log(`\nUploaded images:`);
  for (const [name, url] of uploadedImages) {
    console.log(`  ${name}: ${url}`);
  }
}

main().catch(console.error);
