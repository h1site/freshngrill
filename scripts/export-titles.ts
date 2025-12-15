import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabase = createClient(
  'https://cjbdgfcxewvxcojxbuab.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODk3MzQsImV4cCI6MjA4MDg2NTczNH0.rjCE0Fec2hQuOrFpIG0u69RbFiEx-zAu3P6kXMTYfxY'
);

async function exportTitles() {
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, title')
    .order('title');

  const { data: translations } = await supabase
    .from('recipe_translations')
    .select('recipe_id, title')
    .eq('locale', 'en');

  const translationMap = new Map();
  translations?.forEach(t => translationMap.set(t.recipe_id, t.title));

  const output = recipes?.map(r => ({
    id: r.id,
    title_fr: r.title,
    title_en: translationMap.get(r.id) || ''
  }));

  fs.writeFileSync('recettes-titres.json', JSON.stringify(output, null, 2));
  console.log(`✓ ${recipes?.length} recettes exportées dans recettes-titres.json`);
}

exportTitles();
