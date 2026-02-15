import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: existing } = await supabase.from('categories').select('id').eq('slug', 'saint-valentin').single();
  if (existing) {
    console.log('Category already exists, ID:', existing.id);
    return;
  }
  const { data, error } = await supabase.from('categories').insert({ slug: 'saint-valentin', name: 'Saint-Valentin' }).select('id').single();
  if (error) { console.error('Error:', error.message); return; }
  console.log('Category created, ID:', data.id);
}
main().catch(console.error);
