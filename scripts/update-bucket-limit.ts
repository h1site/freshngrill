/**
 * Update recipe-images bucket file size limit to 50MB
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase.storage.updateBucket('recipe-images', {
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
  });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('✅ Bucket recipe-images updated: file size limit = 50MB');
    console.log(data);
  }
}

main().catch(console.error);
