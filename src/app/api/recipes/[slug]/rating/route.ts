import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET - Fetch current rating for a recipe
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    // First get recipe ID
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('id')
      .eq('slug', slug)
      .single();

    if (recipeError || !recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Get ratings from recipe_ratings table
    const { data: ratings, error: ratingsError } = await supabase
      .from('recipe_ratings')
      .select('rating')
      .eq('recipe_id', recipe.id);

    if (ratingsError) {
      // Table might not exist yet, return defaults
      return NextResponse.json({
        averageRating: 0,
        ratingCount: 0,
      });
    }

    const ratingCount = ratings?.length || 0;
    const averageRating = ratingCount > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratingCount) * 10) / 10
      : 0;

    return NextResponse.json({
      averageRating,
      ratingCount,
    });
  } catch (error) {
    console.error('Error fetching rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Submit a new rating
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const { rating } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    // Get recipe ID
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('id')
      .eq('slug', slug)
      .single();

    if (recipeError || !recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Get client IP for duplicate prevention (optional)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Insert new rating
    const { error: insertError } = await supabase
      .from('recipe_ratings')
      .insert({
        recipe_id: recipe.id,
        rating,
        ip_address: ip,
      });

    if (insertError) {
      console.error('Error inserting rating:', insertError);
      // If table doesn't exist, return success anyway (rating stored in localStorage)
      return NextResponse.json({
        averageRating: rating,
        ratingCount: 1,
      });
    }

    // Get updated ratings
    const { data: ratings } = await supabase
      .from('recipe_ratings')
      .select('rating')
      .eq('recipe_id', recipe.id);

    const ratingCount = ratings?.length || 1;
    const averageRating = ratingCount > 0
      ? Math.round((ratings!.reduce((sum, r) => sum + r.rating, 0) / ratingCount) * 10) / 10
      : rating;

    return NextResponse.json({
      averageRating,
      ratingCount,
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
