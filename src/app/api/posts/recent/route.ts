import { getRecentPosts, getRecentPostsWithEnglish } from '@/lib/posts';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'fr';
  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') || 4), 10);

  const posts = locale === 'en'
    ? await getRecentPostsWithEnglish(limit)
    : await getRecentPosts(limit);

  return Response.json(posts, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
