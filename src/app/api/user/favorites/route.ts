import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// DELETE - Supprimer un favori
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { recipeId } = await request.json();

    if (!recipeId) {
      return NextResponse.json({ error: 'recipeId requis' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('user_likes')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erreur suppression favori:', error);
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Favori supprimé' });
  } catch (error) {
    console.error('Erreur DELETE favori:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH - Mettre à jour le commentaire/note d'un favori
export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { recipeId, note } = await request.json();

    if (!recipeId) {
      return NextResponse.json({ error: 'recipeId requis' }, { status: 400 });
    }

    // Mettre à jour la note (on utilise le champ existant ou on l'ajoute)
    const { error } = await supabaseAdmin
      .from('user_likes')
      .update({ note: note || null })
      .eq('recipe_id', recipeId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erreur mise à jour note:', error);
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Note mise à jour' });
  } catch (error) {
    console.error('Erreur PATCH favori:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
