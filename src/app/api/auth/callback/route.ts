import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Décoder le paramètre next s'il est encodé
  const nextParam = searchParams.get('next');
  const next = nextParam ? decodeURIComponent(nextParam) : '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log('Auth callback - code:', code?.substring(0, 10) + '...');
    console.log('Auth callback - data:', data?.user?.email);
    console.log('Auth callback - error:', error);

    if (!error && data?.session) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    const errorMsg = error?.message || 'Session not created';
    console.error('Auth callback error:', errorMsg);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMsg)}`);
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
