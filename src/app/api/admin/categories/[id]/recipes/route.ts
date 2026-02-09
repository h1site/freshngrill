import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && user.email === 'info@h1site.com';
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const categoryId = parseInt(id, 10);
    const { recipeId } = await request.json();

    if (isNaN(categoryId) || !recipeId) {
      return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('recipe_categories')
      .insert({ recipe_id: recipeId, category_id: categoryId });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already assigned' });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const categoryId = parseInt(id, 10);
    const { recipeId } = await request.json();

    if (isNaN(categoryId) || !recipeId) {
      return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('recipe_categories')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('category_id', categoryId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
