import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('ingredients')
    .select('id, slug, name')
    .order('name');

  if (error) {
    console.error('Erreur fetch ingredients:', error);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data || []);
}
