import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function check() {
  const { data } = await supabase
    .from('post_translations')
    .select('post_id, title, content')
    .eq('locale', 'en')
    .limit(5);
  
  console.log('Posts with translations:');
  data?.forEach(p => {
    console.log('  Post', p.post_id + ':', p.title?.substring(0, 50), '- Content length:', p.content?.length || 0);
  });
  
  const { data: stats } = await supabase
    .from('post_translations')
    .select('content')
    .eq('locale', 'en');
  
  const withContent = stats?.filter(p => p.content && p.content.length > 100).length || 0;
  const total = stats?.length || 0;
  console.log('\nTotal translations:', total);
  console.log('With content (>100 chars):', withContent);
}

check();
