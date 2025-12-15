import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://cjbdgfcxewvxcojxbuab.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA');

async function main() {
  const { data } = await supabase.from('recipes').select('slug').ilike('slug', '%roti%');
  console.log('Roti:', data);
  const { data: data2 } = await supabase.from('recipes').select('slug').ilike('slug', '%jambon%');
  console.log('Jambon:', data2);
}
main();
