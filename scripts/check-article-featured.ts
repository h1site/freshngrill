import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: post } = await supabase.from('posts').select('id, title, featured_image, slug').eq('id', 95).single();
  console.log('Article:', JSON.stringify(post, null, 2));
}

main().catch(console.error);
