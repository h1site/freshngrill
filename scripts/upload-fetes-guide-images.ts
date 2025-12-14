/**
 * Script pour uploader les images du guide d'achat des fêtes vers Supabase
 * Usage: npx tsx scripts/upload-fetes-guide-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BUCKET_NAME = 'post-images';

const images = [
  { localPath: '/tmp/guide-images/sensarte-poele-crepes.jpg', name: 'sensarte-poele-crepes.jpg' },
  { localPath: '/tmp/guide-images/crockpot-slowcooker.jpg', name: 'crockpot-slowcooker.jpg' },
  { localPath: '/tmp/guide-images/bols-inoxydable.jpg', name: 'bols-inoxydable.jpg' },
  { localPath: '/tmp/guide-images/breville-barista.jpg', name: 'breville-barista.jpg' },
  { localPath: '/tmp/guide-images/kitchenaid-mixer.jpg', name: 'kitchenaid-mixer.jpg' },
];

async function uploadToSupabase(fileName: string, buffer: Buffer, contentType: string): Promise<string> {
  const timestamp = Date.now();
  const fullFileName = `guide-fetes/${timestamp}-${fileName}`;

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

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fullFileName);

  return urlData.publicUrl;
}

async function main() {
  console.log('Uploading images to Supabase...\n');

  const uploadedImages: { name: string; url: string }[] = [];

  for (const img of images) {
    console.log(`Processing: ${img.name}`);

    try {
      const buffer = fs.readFileSync(img.localPath);
      console.log(`  Read: ${buffer.length} bytes`);

      const publicUrl = await uploadToSupabase(img.name, buffer, 'image/jpeg');
      console.log(`  Uploaded to: ${publicUrl}`);

      uploadedImages.push({ name: img.name, url: publicUrl });
    } catch (error) {
      console.error(`  Error: ${error}`);
    }

    console.log('');
  }

  console.log('\n✅ Done!');
  console.log(`\nUploaded images for article content:`);
  for (const img of uploadedImages) {
    console.log(`  ${img.name}: ${img.url}`);
  }
}

main().catch(console.error);
