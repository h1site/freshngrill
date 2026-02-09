import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.email !== 'info@h1site.com') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, nameEn } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    const slug = slugify(name);

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .insert({ name, slug })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (nameEn) {
      await supabaseAdmin
        .from('category_translations')
        .insert({ category_id: category.id, locale: 'en', name: nameEn });
    }

    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
