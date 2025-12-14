/**
 * Script pour mettre à jour les images du guide d'achat avec des images locales
 *
 * 1. Télécharge les images depuis Amazon et place-les dans /public/images/buying-guide/
 * 2. Lance ce script: npx tsx scripts/update-buying-guide-local-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const BUCKET_NAME = 'post-images';

const imageDir = path.join(process.cwd(), 'public/images/buying-guide');

// Mapping des images - anciennes URLs Amazon à remplacer
const imageMapping = [
  {
    localFile: 'breville-barista-express.jpg',
    oldUrls: [
      'https://m.media-amazon.com/images/I/71HjGprXRyL._AC_SL1500_.jpg',
      'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/post-images/1765685120670-breville-barista-express.jpg',
    ],
  },
  {
    localFile: 'delonghi-magnifica-s.jpg',
    oldUrls: [
      'https://m.media-amazon.com/images/I/61qjHpHpEeL._AC_SL1500_.jpg',
      'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/post-images/1765685122579-delonghi-magnifica-s.jpg',
    ],
  },
  {
    localFile: 'gaggia-classic-pro.jpg',
    oldUrls: [
      'https://m.media-amazon.com/images/I/61RdmBGGURL._AC_SL1200_.jpg',
      'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/post-images/1765685122843-gaggia-classic-pro.jpg',
    ],
  },
  {
    localFile: 'nespresso-vertuo-next.jpg',
    oldUrls: [
      'https://m.media-amazon.com/images/I/61S2GbYXx8L._AC_SL1500_.jpg',
    ],
  },
  {
    localFile: 'breville-bambino-plus.jpg',
    oldUrls: [
      'https://m.media-amazon.com/images/I/71Qk4j0h45L._AC_SL1500_.jpg',
      'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/post-images/1765685123625-breville-bambino-plus.jpg',
    ],
  },
];

async function uploadToSupabase(localPath: string, fileName: string): Promise<string | null> {
  try {
    const buffer = fs.readFileSync(localPath);
    const timestamp = Date.now();
    const fullFileName = `${timestamp}-${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullFileName, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '31536000',
        upsert: false,
      });

    if (error) {
      console.error(`  Upload error for ${fileName}:`, error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fullFileName);

    return urlData.publicUrl;
  } catch (err) {
    console.error(`  Error reading/uploading ${fileName}:`, err);
    return null;
  }
}

async function main() {
  console.log('Checking for local images in /public/images/buying-guide/...\n');

  const uploadedImages = new Map<string, string>();
  let missingImages: string[] = [];

  // Check and upload each image
  for (const img of imageMapping) {
    const localPath = path.join(imageDir, img.localFile);

    if (fs.existsSync(localPath)) {
      console.log(`Found: ${img.localFile}`);
      const publicUrl = await uploadToSupabase(localPath, img.localFile);
      if (publicUrl) {
        console.log(`  Uploaded to: ${publicUrl}`);
        // Map all old URLs to the new Supabase URL
        for (const oldUrl of img.oldUrls) {
          uploadedImages.set(oldUrl, publicUrl);
        }
      }
    } else {
      console.log(`Missing: ${img.localFile}`);
      missingImages.push(img.localFile);
    }
  }

  if (missingImages.length > 0) {
    console.log('\n⚠️  Missing images:');
    missingImages.forEach(img => console.log(`  - ${img}`));
    console.log('\nTélécharge ces images depuis Amazon et place-les dans /public/images/buying-guide/');

    if (uploadedImages.size === 0) {
      console.log('\nAucune image à mettre à jour. Arrêt du script.');
      return;
    }
  }

  if (uploadedImages.size > 0) {
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
    let replacements = 0;

    for (const [amazonUrl, supabaseUrl] of uploadedImages) {
      if (updatedContent.includes(amazonUrl)) {
        updatedContent = updatedContent.split(amazonUrl).join(supabaseUrl);
        replacements++;
      }
    }

    if (replacements > 0) {
      const { error: updateError } = await supabase
        .from('posts')
        .update({ content: updatedContent, updated_at: new Date().toISOString() })
        .eq('id', post.id);

      if (updateError) {
        console.error('Error updating post:', updateError);
      } else {
        console.log(`French post: ${replacements} image(s) updated`);
      }
    }

    // Update English translation
    const { data: translation, error: transError } = await supabase
      .from('post_translations')
      .select('id, content')
      .eq('post_id', post.id)
      .eq('locale', 'en')
      .single();

    if (!transError && translation) {
      let updatedEnContent = translation.content;
      let enReplacements = 0;

      for (const [amazonUrl, supabaseUrl] of uploadedImages) {
        if (updatedEnContent.includes(amazonUrl)) {
          updatedEnContent = updatedEnContent.split(amazonUrl).join(supabaseUrl);
          enReplacements++;
        }
      }

      if (enReplacements > 0) {
        const { error: transUpdateError } = await supabase
          .from('post_translations')
          .update({ content: updatedEnContent })
          .eq('id', translation.id);

        if (!transUpdateError) {
          console.log(`English translation: ${enReplacements} image(s) updated`);
        }
      }
    }
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
