import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
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

// Créer un client Supabase pour vérifier l'authentification
async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// GET - Vérifier si l'utilisateur/IP a déjà liké et obtenir le count
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get('recipeId');

  if (!recipeId) {
    return NextResponse.json({ error: 'recipeId requis' }, { status: 400 });
  }

  const ip = getClientIP(request);

  try {
    // Vérifier si l'utilisateur est connecté
    const user = await getAuthenticatedUser();

    let liked = false;

    if (user) {
      // Utilisateur connecté: vérifier dans user_likes
      const { data: userLike } = await supabaseAdmin
        .from('user_likes')
        .select('id')
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)
        .single();

      liked = !!userLike;
    } else {
      // Utilisateur non connecté: vérifier par IP
      const { data: existingLike } = await supabaseAdmin
        .from('recipe_likes')
        .select('id')
        .eq('recipe_id', recipeId)
        .eq('ip_address', ip)
        .single();

      liked = !!existingLike;
    }

    // Compter le total de likes (les deux tables combinées)
    const { count: ipCount } = await supabaseAdmin
      .from('recipe_likes')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId);

    const { count: userCount } = await supabaseAdmin
      .from('user_likes')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId);

    return NextResponse.json({
      liked,
      count: (ipCount || 0) + (userCount || 0),
      isAuthenticated: !!user,
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

    // Vérifier si l'utilisateur est connecté
    const user = await getAuthenticatedUser();

    if (user) {
      // === UTILISATEUR CONNECTÉ: utiliser user_likes ===
      const { data: existingLike } = await supabaseAdmin
        .from('user_likes')
        .select('id')
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Retirer le like
        await supabaseAdmin
          .from('user_likes')
          .delete()
          .eq('recipe_id', recipeId)
          .eq('user_id', user.id);

        // Compter le nouveau total
        const { count: ipCount } = await supabaseAdmin
          .from('recipe_likes')
          .select('*', { count: 'exact', head: true })
          .eq('recipe_id', recipeId);

        const { count: userCount } = await supabaseAdmin
          .from('user_likes')
          .select('*', { count: 'exact', head: true })
          .eq('recipe_id', recipeId);

        return NextResponse.json({
          liked: false,
          count: (ipCount || 0) + (userCount || 0),
          message: 'Like retiré',
          isAuthenticated: true,
        });
      } else {
        // Ajouter le like dans user_likes
        const { error } = await supabaseAdmin
          .from('user_likes')
          .insert({
            recipe_id: recipeId,
            user_id: user.id,
          });

        if (error) {
          console.error('Erreur insert user like:', error);
          return NextResponse.json({ error: 'Erreur lors du like' }, { status: 500 });
        }

        // Compter le nouveau total
        const { count: ipCount } = await supabaseAdmin
          .from('recipe_likes')
          .select('*', { count: 'exact', head: true })
          .eq('recipe_id', recipeId);

        const { count: userCount } = await supabaseAdmin
          .from('user_likes')
          .select('*', { count: 'exact', head: true })
          .eq('recipe_id', recipeId);

        return NextResponse.json({
          liked: true,
          count: (ipCount || 0) + (userCount || 0),
          message: 'Like ajouté',
          isAuthenticated: true,
        });
      }
    } else {
      // === UTILISATEUR NON CONNECTÉ: utiliser recipe_likes (IP) ===
      const { data: existingLike } = await supabaseAdmin
        .from('recipe_likes')
        .select('id')
        .eq('recipe_id', recipeId)
        .eq('ip_address', ip)
        .single();

      if (existingLike) {
        // Retirer le like
        await supabaseAdmin
          .from('recipe_likes')
          .delete()
          .eq('recipe_id', recipeId)
          .eq('ip_address', ip);

        // Compter le nouveau total
        const { count: ipCount } = await supabaseAdmin
          .from('recipe_likes')
          .select('*', { count: 'exact', head: true })
          .eq('recipe_id', recipeId);

        const { count: userCount } = await supabaseAdmin
          .from('user_likes')
          .select('*', { count: 'exact', head: true })
          .eq('recipe_id', recipeId);

        return NextResponse.json({
          liked: false,
          count: (ipCount || 0) + (userCount || 0),
          message: 'Like retiré',
          isAuthenticated: false,
        });
      } else {
        // Ajouter le like dans recipe_likes
        const { error } = await supabaseAdmin
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
        const { count: ipCount } = await supabaseAdmin
          .from('recipe_likes')
          .select('*', { count: 'exact', head: true })
          .eq('recipe_id', recipeId);

        const { count: userCount } = await supabaseAdmin
          .from('user_likes')
          .select('*', { count: 'exact', head: true })
          .eq('recipe_id', recipeId);

        return NextResponse.json({
          liked: true,
          count: (ipCount || 0) + (userCount || 0),
          message: 'Like ajouté',
          isAuthenticated: false,
        });
      }
    }
  } catch (error) {
    console.error('Erreur POST like:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
