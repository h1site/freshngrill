import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_EMAIL = 'info@h1site.com';

// Liste de User-Agents suspects (bots, scrapers chinois)
// Note: AhrefsBot et SemrushBot sont autorisés pour le SEO
const BLOCKED_USER_AGENTS = [
  'Baiduspider',
  'YandexBot',
  'Sogou',
  'Bytespider',
  'PetalBot',
  'DotBot',
  'MJ12bot',
];

// Bloquer certains pays via Vercel Geo (header x-vercel-ip-country)
const BLOCKED_COUNTRIES = ['CN', 'RU'];

export async function middleware(request: NextRequest) {
  // Bloquer le trafic suspect basé sur le pays (Vercel Geo)
  const country = request.headers.get('x-vercel-ip-country') || request.geo?.country;
  if (country && BLOCKED_COUNTRIES.includes(country)) {
    // Retourner une page vide ou 403 pour le trafic bloqué
    return new NextResponse(null, { status: 403 });
  }

  // Bloquer les User-Agents suspects
  const userAgent = request.headers.get('user-agent') || '';
  const isBlockedBot = BLOCKED_USER_AGENTS.some(bot =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
  if (isBlockedBot) {
    return new NextResponse(null, { status: 403 });
  }
  // Add pathname header for locale detection in layout
  const requestHeaders = new Headers(request.headers);
  const currentPathname = request.nextUrl.pathname;
  requestHeaders.set('x-pathname', currentPathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protection des routes /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Vérifier si l'utilisateur est admin
    if (user.email !== ADMIN_EMAIL) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Rediriger les utilisateurs connectés depuis login/register
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/admin';
    const url = request.nextUrl.clone();
    url.pathname = redirectTo;
    url.searchParams.delete('redirectTo');
    return NextResponse.redirect(url);
  }

  // Set locale cookie AFTER all other middleware logic
  // This ensures it's on the final response
  const locale = currentPathname.startsWith('/en') ? 'en' : 'fr';
  supabaseResponse.cookies.set('x-locale', locale, { path: '/', sameSite: 'lax' });

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
