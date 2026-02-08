import { NextRequest, NextResponse } from 'next/server';
import { submitUrls, submitRecipeUrls, submitBlogUrls, submitSitemapUrls } from '@/lib/indexnow';

// POST - Submit URLs to IndexNow
// Protected by a simple secret key in the request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, action, urls, slugFr, slugEn, slug } = body;

    // Simple auth check
    if (secret !== process.env.INDEXNOW_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    switch (action) {
      case 'urls': {
        // Submit specific URLs
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
          return NextResponse.json({ error: 'urls array required' }, { status: 400 });
        }
        const success = await submitUrls(urls);
        return NextResponse.json({ success, submitted: urls.length });
      }

      case 'recipe': {
        // Submit a recipe (FR + optional EN)
        if (!slugFr) {
          return NextResponse.json({ error: 'slugFr required' }, { status: 400 });
        }
        const success = await submitRecipeUrls(slugFr, slugEn);
        return NextResponse.json({ success, slugFr, slugEn });
      }

      case 'blog': {
        // Submit a blog post (FR + optional EN)
        if (!slug) {
          return NextResponse.json({ error: 'slug required' }, { status: 400 });
        }
        const success = await submitBlogUrls(slug, slugEn);
        return NextResponse.json({ success, slug, slugEn });
      }

      case 'sitemap': {
        // Submit all URLs from sitemap
        const result = await submitSitemapUrls();
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: urls, recipe, blog, or sitemap' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('IndexNow API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
