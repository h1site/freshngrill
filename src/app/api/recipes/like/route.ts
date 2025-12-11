import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Obtenir l'IP du client
function getClientIP(request: NextRequest): string {
  // Vérifier les headers de proxy
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback
  return '127.0.0.1';
}

// GET - Vérifier si l'IP a déjà liké et obtenir le count
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get('recipeId');

  if (!recipeId) {
    return NextResponse.json({ error: 'recipeId requis' }, { status: 400 });
  }

  const ip = getClientIP(request);

  try {
    // Vérifier si l'IP a déjà liké
    const { data: existingLike } = await supabase
      .from('recipe_likes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('ip_address', ip)
      .single();

    // Compter le total de likes
    const { count } = await supabase
      .from('recipe_likes')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId);

    return NextResponse.json({
      liked: !!existingLike,
      count: count || 0,
    });
  } catch (error) {
    console.error('Erreur GET like:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Ajouter ou retirer un like
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeId } = body;

    if (!recipeId) {
      return NextResponse.json({ error: 'recipeId requis' }, { status: 400 });
    }

    const ip = getClientIP(request);

    // Vérifier si l'IP a déjà liké
    const { data: existingLike } = await supabase
      .from('recipe_likes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('ip_address', ip)
      .single();

    if (existingLike) {
      // Retirer le like
      await supabase
        .from('recipe_likes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('ip_address', ip);

      // Compter le nouveau total
      const { count } = await supabase
        .from('recipe_likes')
        .select('*', { count: 'exact', head: true })
        .eq('recipe_id', recipeId);

      return NextResponse.json({
        liked: false,
        count: count || 0,
        message: 'Like retiré',
      });
    } else {
      // Ajouter le like
      const { error } = await supabase
        .from('recipe_likes')
        .insert({
          recipe_id: recipeId,
          ip_address: ip,
        });

      if (error) {
        console.error('Erreur insert like:', error);
        return NextResponse.json({ error: 'Erreur lors du like' }, { status: 500 });
      }

      // Compter le nouveau total
      const { count } = await supabase
        .from('recipe_likes')
        .select('*', { count: 'exact', head: true })
        .eq('recipe_id', recipeId);

      return NextResponse.json({
        liked: true,
        count: count || 0,
        message: 'Like ajouté',
      });
    }
  } catch (error) {
    console.error('Erreur POST like:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
