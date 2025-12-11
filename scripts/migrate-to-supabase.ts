/**
 * Script de migration des recettes vers Supabase
 *
 * Usage: npx tsx scripts/migrate-to-supabase.ts
 *
 * Ce script:
 * 1. Lit les recettes depuis un fichier JSON
 * 2. Télécharge les images vers Supabase Storage
 * 3. Insère les données dans les tables Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RecipeData {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  images?: string[];
  prepTime: number;
  cookTime: number;
  restTime?: number;
  totalTime: number;
  servings: number;
  servingsUnit?: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  ingredients: any[];
  instructions: any[];
  nutrition?: any;
  categories: { id: number; slug: string; name: string; parent?: number }[];
  tags?: string[];
  cuisine?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  likes?: number;
  seoTitle?: string;
  seoDescription?: string;
}

interface ImportData {
  recipes: RecipeData[];
  categories: { id: number; slug: string; name: string; parent?: number }[];
}

/**
 * Télécharger une image depuis une URL et l'uploader vers Supabase Storage
 */
async function uploadImageFromUrl(imageUrl: string, bucket: string = 'recipe-images'): Promise<string | null> {
  try {
    if (!imageUrl || imageUrl.startsWith('data:')) return null;

    // Extraire le nom du fichier de l'URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1].split('?')[0];
    const uniqueFileName = `${Date.now()}-${fileName}`;

    // Télécharger l'image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`⚠️ Impossible de télécharger: ${imageUrl}`);
      return imageUrl; // Garder l'URL originale
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload vers Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, buffer, {
        contentType: blob.type,
        upsert: true,
      });

    if (error) {
      console.warn(`⚠️ Erreur upload ${fileName}:`, error.message);
      return imageUrl; // Garder l'URL originale
    }

    // Retourner l'URL publique
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  } catch (error) {
    console.warn(`⚠️ Erreur avec l'image ${imageUrl}:`, error);
    return imageUrl; // Garder l'URL originale en cas d'erreur
  }
}

/**
 * Migrer les catégories
 */
async function migrateCategories(categories: ImportData['categories']): Promise<Map<number, number>> {
  console.log('\n📁 Migration des catégories...');
  const idMap = new Map<number, number>(); // old ID -> new ID

  for (const cat of categories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert({
        slug: cat.slug,
        name: cat.name,
        parent_id: cat.parent ? idMap.get(cat.parent) : null,
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`❌ Erreur catégorie ${cat.name}:`, error.message);
      continue;
    }

    idMap.set(cat.id, data.id);
    console.log(`  ✓ ${cat.name}`);
  }

  return idMap;
}

/**
 * Migrer une recette
 */
async function migrateRecipe(
  recipe: RecipeData,
  categoryIdMap: Map<number, number>,
  uploadImages: boolean = false
): Promise<boolean> {
  try {
    // Optionnel: télécharger et réuploader les images
    let featuredImage = recipe.featuredImage;
    let images = recipe.images || [];

    if (uploadImages && featuredImage) {
      const newUrl = await uploadImageFromUrl(featuredImage);
      if (newUrl) featuredImage = newUrl;
    }

    if (uploadImages && images.length > 0) {
      const newImages: string[] = [];
      for (const img of images) {
        const newUrl = await uploadImageFromUrl(img);
        if (newUrl) newImages.push(newUrl);
      }
      images = newImages;
    }

    // Insérer la recette
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .upsert({
        slug: recipe.slug,
        title: recipe.title,
        excerpt: recipe.excerpt || null,
        content: recipe.content || null,
        featured_image: featuredImage || null,
        images: images.length > 0 ? images : null,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        rest_time: recipe.restTime || null,
        total_time: recipe.totalTime,
        servings: recipe.servings,
        servings_unit: recipe.servingsUnit || null,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition || null,
        tags: recipe.tags || null,
        cuisine: recipe.cuisine || null,
        author: recipe.author,
        published_at: recipe.publishedAt,
        updated_at: recipe.updatedAt || new Date().toISOString(),
        likes: recipe.likes || 0,
        seo_title: recipe.seoTitle || null,
        seo_description: recipe.seoDescription || null,
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (recipeError) {
      console.error(`❌ Erreur recette ${recipe.title}:`, recipeError.message);
      return false;
    }

    // Lier les catégories
    const categoryLinks = recipe.categories
      .map((cat) => {
        const newCatId = categoryIdMap.get(cat.id);
        if (newCatId) {
          return {
            recipe_id: recipeData.id,
            category_id: newCatId,
          };
        }
        return null;
      })
      .filter(Boolean);

    if (categoryLinks.length > 0) {
      // Supprimer les anciennes liaisons
      await supabase
        .from('recipe_categories')
        .delete()
        .eq('recipe_id', recipeData.id);

      // Insérer les nouvelles
      const { error: linkError } = await supabase
        .from('recipe_categories')
        .insert(categoryLinks as any[]);

      if (linkError) {
        console.warn(`⚠️ Erreur liaison catégories pour ${recipe.title}:`, linkError.message);
      }
    }

    return true;
  } catch (error) {
    console.error(`❌ Erreur migration ${recipe.title}:`, error);
    return false;
  }
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Début de la migration vers Supabase\n');

  // Chemin vers le fichier JSON source
  const jsonPath = process.argv[2] || path.join(process.cwd(), 'src/data/recipes.json');

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Fichier non trouvé: ${jsonPath}`);
    console.log('\nUsage: npx tsx scripts/migrate-to-supabase.ts [chemin/vers/recipes.json]');
    process.exit(1);
  }

  // Lire le fichier JSON
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  let data: ImportData;

  try {
    data = JSON.parse(jsonContent);
  } catch (error) {
    console.error('❌ Erreur parsing JSON:', error);
    process.exit(1);
  }

  const { recipes = [], categories = [] } = data;

  console.log(`📊 Données à migrer:`);
  console.log(`   - ${categories.length} catégories`);
  console.log(`   - ${recipes.length} recettes`);

  // Option pour uploader les images
  const uploadImages = process.argv.includes('--upload-images');
  if (uploadImages) {
    console.log('   - 📷 Upload des images activé');
  }

  // Migrer les catégories d'abord
  const categoryIdMap = await migrateCategories(categories);

  // Migrer les recettes
  console.log('\n🍳 Migration des recettes...');
  let success = 0;
  let failed = 0;

  for (const recipe of recipes) {
    const result = await migrateRecipe(recipe, categoryIdMap, uploadImages);
    if (result) {
      success++;
      console.log(`  ✓ ${recipe.title}`);
    } else {
      failed++;
    }
  }

  console.log('\n✅ Migration terminée!');
  console.log(`   - ${success} recettes migrées avec succès`);
  if (failed > 0) {
    console.log(`   - ${failed} recettes en erreur`);
  }
}

main().catch(console.error);
