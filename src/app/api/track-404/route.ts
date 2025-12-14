import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { path, referrer, userAgent } = await request.json();

    // Insert 404 tracking record
    const { error } = await supabase.from('error_404_logs').insert({
      path: path || 'unknown',
      referrer: referrer || null,
      user_agent: userAgent || null,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
    });

    if (error) {
      console.error('Error tracking 404:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in 404 tracking:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
