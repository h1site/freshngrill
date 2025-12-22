import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { extractIngredientsFromRecipe, parseAllIngredients } from '@/lib/ingredient-extractor';

interface InstructionStep {
  step: number;
  content: string;
  tip?: string;
}

interface RecipeFr {
  index: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  introduction?: string;
  conclusion?: string;
  prep_time: number;
  cook_time: number;
  rest_time?: number;
  servings: number;
  servings_unit?: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  cuisine?: string;
  categories?: string[];
  origines?: string[];
  tags?: string[];
  ingredients: { group?: string; items: string[] }[];
  instructions: InstructionStep[] | string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  faq?: string;
  seo_title?: string;
  seo_description?: string;
}

interface RecipeEn {
  index: number;
  slug_en: string;
  title: string;
  excerpt?: string;
  introduction?: string;
  conclusion?: string;
  ingredients: { group?: string; items: string[] }[];
  instructions: InstructionStep[] | string[];
  faq?: string;
  seo_title?: string;
  seo_description?: string;
}

interface ImportRequest {
  recipesFr: RecipeFr[];
  recipesEn: RecipeEn[];
  images: { index: number; url: string }[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body: ImportRequest = await request.json();
    const { recipesFr, recipesEn, images } = body;

    // Validations
    if (!recipesFr || !recipesEn) {
      return NextResponse.json(
        { error: 'Les fichiers FR et EN sont requis' },
        { status: 400 }
      );
    }

    if (recipesFr.length !== recipesEn.length) {
      return NextResponse.json(
        { error: `Nombre de recettes différent: ${recipesFr.length} FR vs ${recipesEn.length} EN` },
        { status: 400 }
      );
    }

    if (recipesFr.length !== images.length) {
      return NextResponse.json(
        { error: `Nombre d'images différent: ${images.length} images pour ${recipesFr.length} recettes` },
        { status: 400 }
      );
    }

    const results: { success: number; errors: { index: number; error: string }[] } = {
      success: 0,
      errors: [],
    };

    // Importer chaque recette
    for (let i = 0; i < recipesFr.length; i++) {
      const recipeFr = recipesFr[i];
      // Chercher par index OU par position dans le tableau
      const recipeEn = recipesEn.find(r => r.index === recipeFr.index) || recipesEn[i];
      // Utiliser la position dans le tableau pour les images (plus fiable)
      const image = images[i] || images.find(img => img.index === recipeFr.index);

      if (!recipeEn) {
        results.errors.push({
          index: recipeFr.index,
          error: `Recette EN manquante pour l'index ${recipeFr.index}`,
        });
        continue;
      }

      if (!image || !image.url) {
        results.errors.push({
          index: recipeFr.index,
          error: `Image manquante pour la recette ${i + 1} (${recipeFr.title})`,
        });
        continue;
      }

      try {
        // 1. Insérer la recette française
        const { data: insertedRecipe, error: recipeError } = await supabase
          .from('recipes')
          .insert({
            slug: recipeFr.slug,
            title: recipeFr.title,
            excerpt: recipeFr.excerpt || null,
            content: recipeFr.content || null,
            featured_image: image.url,
            introduction: recipeFr.introduction || null,
            conclusion: recipeFr.conclusion || null,
            prep_time: recipeFr.prep_time,
            cook_time: recipeFr.cook_time,
            rest_time: recipeFr.rest_time || null,
            total_time: recipeFr.prep_time + recipeFr.cook_time + (recipeFr.rest_time || 0),
            servings: recipeFr.servings,
            servings_unit: recipeFr.servings_unit || 'portions',
            difficulty: recipeFr.difficulty,
            cuisine: recipeFr.cuisine || null,
            tags: recipeFr.tags || null,
            ingredients: parseAllIngredients(recipeFr.ingredients),
            instructions: recipeFr.instructions,
            nutrition: recipeFr.nutrition || null,
            faq: recipeFr.faq || null,
            seo_title: recipeFr.seo_title || null,
            seo_description: recipeFr.seo_description || null,
            author: 'Menucochon',
            published_at: new Date().toISOString(),
          } as never)
          .select('id')
          .single();

        if (recipeError || !insertedRecipe) {
          results.errors.push({
            index: recipeFr.index,
            error: `Erreur insertion FR: ${recipeError?.message || 'Pas de données retournées'}`,
          });
          continue;
        }

        const recipeId = (insertedRecipe as { id: number }).id;

        // 2. Lier les catégories (par slug)
        if (recipeFr.categories && recipeFr.categories.length > 0) {
          console.log(`Recipe ${recipeFr.index}: categories to link:`, recipeFr.categories);
          for (const catSlug of recipeFr.categories) {
            const { data: category, error: catError } = await supabase
              .from('categories')
              .select('id')
              .eq('slug', catSlug)
              .single();

            if (catError) {
              console.log(`Category "${catSlug}" not found:`, catError.message);
            }

            if (category) {
              const catId = (category as { id: number }).id;
              const { error: linkError } = await supabase
                .from('recipe_categories')
                .insert({ recipe_id: recipeId, category_id: catId } as never);
              if (linkError) {
                console.log(`Error linking category ${catSlug}:`, linkError.message);
              } else {
                console.log(`Linked category ${catSlug} (${catId}) to recipe ${recipeId}`);
              }
            }
          }
        } else {
          console.log(`Recipe ${recipeFr.index}: no categories provided`);
        }

        // 3. Lier les origines (par slug)
        if (recipeFr.origines && recipeFr.origines.length > 0) {
          for (const origineSlug of recipeFr.origines) {
            const { data: origine } = await supabase
              .from('origines')
              .select('id')
              .eq('slug', origineSlug)
              .single();

            if (origine) {
              const origineId = (origine as { id: number }).id;
              await supabase
                .from('recipe_origines')
                .insert({ recipe_id: recipeId, origine_id: origineId } as never);
            }
          }
        }

        // 4. Extraire et lier les ingrédients (FR)
        const detectedIngredientsFr = extractIngredientsFromRecipe(recipeFr.ingredients, 'fr');
        for (const ingredientName of detectedIngredientsFr) {
          const slug = ingredientName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          // Upsert ingredient (insert if not exists)
          const { data: existingIngredient } = await supabase
            .from('ingredients')
            .select('id')
            .eq('slug', slug)
            .single();

          let ingredientId: number;

          if (existingIngredient) {
            ingredientId = (existingIngredient as { id: number }).id;
          } else {
            const { data: newIngredient, error: ingredientError } = await supabase
              .from('ingredients')
              .insert({ slug, name: ingredientName } as never)
              .select('id')
              .single();

            if (ingredientError || !newIngredient) {
              console.error(`Erreur insertion ingrédient ${ingredientName}:`, ingredientError);
              continue;
            }
            ingredientId = (newIngredient as { id: number }).id;
          }

          // Link ingredient to recipe
          await supabase
            .from('recipe_ingredients')
            .insert({ recipe_id: recipeId, ingredient_id: ingredientId } as never);
        }

        // 4b. Extraire et lier les ingrédients (EN)
        const detectedIngredientsEn = extractIngredientsFromRecipe(recipeEn.ingredients, 'en');
        for (const ingredientName of detectedIngredientsEn) {
          const slug = ingredientName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          // Upsert ingredient (insert if not exists)
          const { data: existingIngredient } = await supabase
            .from('ingredients')
            .select('id')
            .eq('slug', slug)
            .single();

          let ingredientId: number;

          if (existingIngredient) {
            ingredientId = (existingIngredient as { id: number }).id;
          } else {
            const { data: newIngredient, error: ingredientError } = await supabase
              .from('ingredients')
              .insert({ slug, name: ingredientName } as never)
              .select('id')
              .single();

            if (ingredientError || !newIngredient) {
              console.error(`Error inserting ingredient ${ingredientName}:`, ingredientError);
              continue;
            }
            ingredientId = (newIngredient as { id: number }).id;
          }

          // Link ingredient to recipe (avoid duplicates)
          const { data: existingLink } = await supabase
            .from('recipe_ingredients')
            .select('id')
            .eq('recipe_id', recipeId)
            .eq('ingredient_id', ingredientId)
            .single();

          if (!existingLink) {
            await supabase
              .from('recipe_ingredients')
              .insert({ recipe_id: recipeId, ingredient_id: ingredientId } as never);
          }
        }

        // 5. Insérer la traduction anglaise
        const { error: translationError } = await supabase
          .from('recipe_translations')
          .insert({
            recipe_id: recipeId,
            locale: 'en',
            slug_en: recipeEn.slug_en,
            title: recipeEn.title,
            excerpt: recipeEn.excerpt || null,
            introduction: recipeEn.introduction || null,
            conclusion: recipeEn.conclusion || null,
            ingredients: parseAllIngredients(recipeEn.ingredients),
            instructions: recipeEn.instructions,
            faq: recipeEn.faq || null,
            seo_title: recipeEn.seo_title || null,
            seo_description: recipeEn.seo_description || null,
            translated_at: new Date().toISOString(),
          } as never);

        if (translationError) {
          results.errors.push({
            index: recipeFr.index,
            error: `Recette FR créée (ID: ${recipeId}) mais erreur traduction EN: ${translationError.message}`,
          });
          continue;
        }

        results.success++;
      } catch (err) {
        results.errors.push({
          index: recipeFr.index,
          error: err instanceof Error ? err.message : 'Erreur inconnue',
        });
      }
    }

    return NextResponse.json({
      success: true,
      imported: results.success,
      errors: results.errors,
      total: recipesFr.length,
    });
  } catch (error) {
    console.error('Erreur API import:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'import' },
      { status: 500 }
    );
  }
}
