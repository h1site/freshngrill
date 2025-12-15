import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://cjbdgfcxewvxcojxbuab.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA');

async function main() {
  // 1. Vérifier l'article de blog
  console.log('=== ARTICLE DE BLOG ===');
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('id, slug, title, status, published_at')
    .eq('slug', 'recettes-crepes-noel-jour-de-lan')
    .single();

  if (postError) {
    console.log('Article non trouvé:', postError.message);
  } else {
    console.log('Article trouvé:', post);
  }

  // 2. Vérifier les recettes de crêpes et leurs conclusions
  console.log('\n=== RECETTES DE CRÊPES ===');
  const slugs = ['crepe-allemande-pfannkuchen', 'crepes-maison-recette-de-base', 'crepe-proteinee', 'crepe', 'crepes-minces'];

  for (const slug of slugs) {
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('id, slug, conclusion')
      .eq('slug', slug)
      .single();

    if (error) {
      console.log(`❌ "${slug}" - non trouvée`);
    } else {
      const hasLinks = recipe.conclusion?.includes('Découvrez aussi') || false;
      console.log(`${hasLinks ? '✅' : '⚠️'} "${slug}" - liens: ${hasLinks}`);
      if (recipe.conclusion) {
        console.log(`   Conclusion (fin): ...${recipe.conclusion.slice(-100)}`);
      }
    }
  }
}

main();
