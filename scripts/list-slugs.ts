import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: recipes } = await supabase.from('recipes').select('id, slug').order('slug');
  const { data: translations } = await supabase.from('recipe_translations').select('recipe_id, slug_en').eq('locale', 'en');

  const map = new Map(translations?.map(t => [t.recipe_id, t.slug_en]) || []);

  for (const r of recipes || []) {
    console.log(`${r.slug} -> ${map.get(r.id) || 'MISSING'}`);
  }
}

main().catch(console.error);
