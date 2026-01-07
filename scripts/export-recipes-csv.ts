import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

function cleanForCsv(text: string | null): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/"/g, '""')
    .trim();
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('recipes')
    .select('title, slug, introduction, conclusion')
    .order('title');

  if (error) {
    console.error(error);
    process.exit(1);
  }

  let csv = 'titre,url,introduction,conclusion\n';

  for (const r of data || []) {
    const url = `https://menucochon.com/recette/${r.slug}/`;
    const title = cleanForCsv(r.title);
    const intro = cleanForCsv(r.introduction);
    const conclusion = cleanForCsv(r.conclusion);
    csv += `"${title}","${url}","${intro}","${conclusion}"\n`;
  }

  fs.writeFileSync('recettes-export.csv', csv);
  console.log(`✅ Exporté ${data?.length || 0} recettes vers recettes-export.csv`);
}

main();
