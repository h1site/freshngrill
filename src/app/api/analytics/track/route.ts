import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Lire le body (peut être JSON ou text pour sendBeacon)
    let body;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = JSON.parse(text);
    }

    // Si c'est une mise à jour
    if (body.update_id) {
      const updateData: Record<string, unknown> = {};

      if (body.time_on_page !== undefined) {
        updateData.time_on_page = body.time_on_page;
      }
      if (body.exited !== undefined) {
        updateData.exited = body.exited;
      }
      if (body.next_page !== undefined) {
        updateData.next_page = body.next_page;
      }

      if (Object.keys(updateData).length > 0) {
        await supabase
          .from('page_views')
          .update(updateData as never)
          .eq('id', body.update_id);
      }

      return NextResponse.json({ success: true });
    }

    // Nouvelle visite
    const { data, error } = await supabase
      .from('page_views')
      .insert({
        page_path: body.page_path,
        page_title: body.page_title,
        referrer: body.referrer,
        user_agent: request.headers.get('user-agent'),
        session_id: body.session_id,
        locale: body.locale || 'fr',
      } as never)
      .select('id')
      .single() as { data: { id: number } | null; error: unknown };

    if (error || !data) {
      console.error('Error tracking page view:', error);
      return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error('Error in analytics track:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
