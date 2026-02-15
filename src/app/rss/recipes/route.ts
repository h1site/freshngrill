import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/lib/config';

export const revalidate = 3600;

export async function GET() {
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, title, excerpt, featured_image, published_at, updated_at')
    .order('published_at', { ascending: false })
    .limit(50) as { data: { slug: string; title: string; excerpt: string | null; featured_image: string | null; published_at: string | null; updated_at: string | null }[] | null };

  const items = (recipes || []).map((recipe) => {
    const pubDate = recipe.published_at || recipe.updated_at || new Date().toISOString();
    return `    <item>
      <title><![CDATA[${recipe.title}]]></title>
      <link>${siteConfig.url}/recipe/${recipe.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/recipe/${recipe.slug}</guid>
      <description><![CDATA[${recipe.excerpt || ''}]]></description>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>${recipe.featured_image ? `
      <enclosure url="${recipe.featured_image}" type="image/webp" />` : ''}
    </item>`;
  }).join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} - BBQ Recipes</title>
    <link>${siteConfig.url}/recipe</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss/recipes" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
