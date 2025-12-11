import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function analyzeConvertisseurUrls() {
  console.log('=== Analyse des URLs convertisseur-de-mesures ===\n');

  // Chercher dans les posts
  const { data: posts } = await supabase
    .from('posts')
    .select('id, slug, content');

  let postsWithUrl = 0;
  const postMatches: { id: number; slug: string; urls: string[] }[] = [];

  for (const post of posts || []) {
    if (post.content && post.content.includes('convertisseur-de-mesures')) {
      const matches = post.content.match(/https?:\/\/[^\s"'<>]*convertisseur-de-mesures[^\s"'<>]*/g) || [];
      if (matches.length > 0) {
        postsWithUrl++;
        postMatches.push({ id: post.id, slug: post.slug, urls: [...new Set(matches)] });
      }
    }
  }

  // Chercher dans les recettes
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, slug, content, instructions');

  let recipesWithUrl = 0;
  const recipeMatches: { id: number; slug: string; urls: string[] }[] = [];

  for (const recipe of recipes || []) {
    const searchContent = JSON.stringify(recipe.content || '') + JSON.stringify(recipe.instructions || '');
    if (searchContent.includes('convertisseur-de-mesures')) {
      const matches = searchContent.match(/https?:\/\/[^\s"'<>\\]*convertisseur-de-mesures[^\s"'<>\\]*/g) || [];
      if (matches.length > 0) {
        recipesWithUrl++;
        recipeMatches.push({ id: recipe.id, slug: recipe.slug, urls: [...new Set(matches)] });
      }
    }
  }

  console.log('=== Résultats ===\n');
  console.log(`Posts avec URL convertisseur-de-mesures: ${postsWithUrl}`);
  console.log(`Recettes avec URL convertisseur-de-mesures: ${recipesWithUrl}`);
  console.log('');

  if (postMatches.length > 0) {
    console.log('=== Posts concernés ===');
    for (const match of postMatches) {
      console.log(`[${match.id}] ${match.slug}`);
      match.urls.forEach(url => console.log(`    ${url}`));
    }
    console.log('');
  }

  if (recipeMatches.length > 0) {
    console.log('=== Recettes concernées ===');
    for (const match of recipeMatches) {
      console.log(`[${match.id}] ${match.slug}`);
      match.urls.forEach(url => console.log(`    ${url}`));
    }
  }

  // Lister toutes les URLs uniques
  const allUrls = new Set<string>();
  postMatches.forEach(m => m.urls.forEach(u => allUrls.add(u)));
  recipeMatches.forEach(m => m.urls.forEach(u => allUrls.add(u)));

  if (allUrls.size > 0) {
    console.log('\n=== URLs uniques à rediriger ===');
    allUrls.forEach(url => console.log(url));
  }

  console.log('\n=== Recommandation SEO ===');
  console.log('L\'ancienne URL: https://menucochon.com/convertisseur-de-mesures/');
  console.log('Nouvelle URL:   https://menucochon.com/convertisseur/');
  console.log('');
  console.log('Redirection 301 nécessaire dans next.config.ts ou middleware');
}

analyzeConvertisseurUrls();
