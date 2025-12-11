import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function analyzeImages() {
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, slug, featured_image, images');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const wpImages: string[] = [];
  const supabaseImages: string[] = [];
  const otherImages: string[] = [];

  for (const recipe of recipes || []) {
    // Check featured_image
    if (recipe.featured_image) {
      if (recipe.featured_image.includes('menucochon.com') || recipe.featured_image.includes('wp-content')) {
        wpImages.push(recipe.featured_image);
      } else if (recipe.featured_image.includes('supabase')) {
        supabaseImages.push(recipe.featured_image);
      } else {
        otherImages.push(recipe.featured_image);
      }
    }

    // Check images array
    const images = recipe.images as string[] | null;
    if (images) {
      for (const img of images) {
        if (img.includes('menucochon.com') || img.includes('wp-content')) {
          wpImages.push(img);
        } else if (img.includes('supabase')) {
          supabaseImages.push(img);
        } else {
          otherImages.push(img);
        }
      }
    }
  }

  console.log('=== Analyse des images ===');
  console.log('Total recettes:', recipes?.length);
  console.log('');
  console.log('Images WordPress:', wpImages.length);
  console.log('Images Supabase:', supabaseImages.length);
  console.log('Autres images:', otherImages.length);
  console.log('');

  if (wpImages.length > 0) {
    console.log('Exemples URLs WordPress:');
    wpImages.slice(0, 5).forEach(url => console.log('  -', url));
  }

  if (otherImages.length > 0) {
    console.log('');
    console.log('Exemples autres URLs:');
    otherImages.slice(0, 5).forEach(url => console.log('  -', url));
  }
}

analyzeImages();
