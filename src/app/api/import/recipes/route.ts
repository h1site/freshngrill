import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

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
      const recipeEn = recipesEn.find(r => r.index === recipeFr.index);
      const image = images.find(img => img.index === recipeFr.index);

      if (!recipeEn) {
        results.errors.push({
          index: recipeFr.index,
          error: `Recette EN manquante pour l'index ${recipeFr.index}`,
        });
        continue;
      }

      if (!image) {
        results.errors.push({
          index: recipeFr.index,
          error: `Image manquante pour l'index ${recipeFr.index}`,
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
            ingredients: recipeFr.ingredients,
            instructions: recipeFr.instructions,
            nutrition: recipeFr.nutrition || null,
            faq: recipeFr.faq || null,
            seo_title: recipeFr.seo_title || null,
            seo_description: recipeFr.seo_description || null,
            author: 'Menu Cochon',
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
          for (const catSlug of recipeFr.categories) {
            const { data: category } = await supabase
              .from('categories')
              .select('id')
              .eq('slug', catSlug)
              .single();

            if (category) {
              const catId = (category as { id: number }).id;
              await supabase
                .from('recipe_categories')
                .insert({ recipe_id: recipeId, category_id: catId } as never);
            }
          }
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

        // 4. Insérer la traduction anglaise
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
            ingredients: recipeEn.ingredients,
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
