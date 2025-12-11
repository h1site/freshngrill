import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('recipes')
    .select('id, title')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    process.exit(1);
  }

  let csv = 'id,title,pays\n';
  data.forEach((r: { id: number; title: string }) => {
    const title = r.title.replace(/"/g, '""');
    csv += `${r.id},"${title}",\n`;
  });

  fs.writeFileSync('recettes-export.csv', csv);
  console.log(`Exported ${data.length} recipes to recettes-export.csv`);
}

main();
