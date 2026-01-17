import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

// Create admin client with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipeId = parseInt(id, 10);

    if (isNaN(recipeId)) {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 });
    }

    // Verify user is authenticated and is admin
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const ADMIN_EMAIL = 'info@h1site.com';
    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { recipeData, translationData, hasExistingTranslation, translationId } = body;

    // Update recipe using admin client (bypasses RLS)
    const { data: updatedRecipe, error: updateError } = await supabaseAdmin
      .from('recipes')
      .update(recipeData)
      .eq('id', recipeId)
      .select()
      .single();

    if (updateError) {
      console.error('Recipe update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Handle translation if provided
    let translationResult = null;
    if (translationData && translationData.title) {
      if (hasExistingTranslation && translationId) {
        const { data, error } = await supabaseAdmin
          .from('recipe_translations')
          .update(translationData)
          .eq('id', translationId)
          .select()
          .single();

        if (error) {
          console.error('Translation update error:', error);
        } else {
          translationResult = data;
        }
      } else {
        const { data, error } = await supabaseAdmin
          .from('recipe_translations')
          .insert({ ...translationData, recipe_id: recipeId })
          .select()
          .single();

        if (error) {
          console.error('Translation insert error:', error);
        } else {
          translationResult = data;
        }
      }
    }

    return NextResponse.json({
      success: true,
      recipe: updatedRecipe,
      translation: translationResult,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
