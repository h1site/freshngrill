import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cjbdgfcxewvxcojxbuab.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA'
);

async function main() {
  const { data, error } = await supabase
    .from('spices')
    .select('name_fr, name_en, definition_fr, utilisation_aliments_fr, bienfaits_fr, conservation_fr, faq_fr')
    .eq('is_published', true)
    .order('name_fr');

  if (error) {
    console.error(error);
    process.exit(1);
  }

  const missing = data.filter(s => {
    const hasDef = s.definition_fr && s.definition_fr.length > 0;
    const hasUtil = s.utilisation_aliments_fr && s.utilisation_aliments_fr.length > 0;
    const hasBien = s.bienfaits_fr && s.bienfaits_fr.length > 0;
    const hasCons = s.conservation_fr && s.conservation_fr.length > 0;
    const hasFaq = s.faq_fr && s.faq_fr.length > 0;
    return !(hasDef && hasUtil && hasBien && hasCons && hasFaq);
  });

  console.log(`\n📋 Épices avec données incomplètes (${missing.length}):\n`);

  missing.forEach((s, i) => {
    const lacks: string[] = [];
    if (!s.definition_fr) lacks.push('definition');
    if (!s.utilisation_aliments_fr?.length) lacks.push('utilisation');
    if (!s.bienfaits_fr?.length) lacks.push('bienfaits');
    if (!s.conservation_fr) lacks.push('conservation');
    if (!s.faq_fr?.length) lacks.push('faq');
    console.log(`${i + 1}. ${s.name_fr} (${s.name_en || '-'}) - manque: ${lacks.join(', ')}`);
  });

  console.log(`\n✅ Épices complètes: ${data.length - missing.length}/${data.length}`);
}

main();
