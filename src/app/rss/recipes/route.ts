import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/lib/config';

export const revalidate = 3600;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, title, excerpt, featured_image, pinterest_image, published_at, updated_at')
    .order('published_at', { ascending: false })
    .limit(50) as { data: { slug: string; title: string; excerpt: string | null; featured_image: string | null; pinterest_image: string | null; published_at: string | null; updated_at: string | null }[] | null };

  const items = (recipes || []).map((recipe) => {
    const pubDate = recipe.published_at || recipe.updated_at || new Date().toISOString();
    const recipeUrl = `${siteConfig.url}/recipe/${recipe.slug}/`;
    const imageUrl = recipe.pinterest_image || recipe.featured_image;

    let mediaBlock = '';
    if (recipe.pinterest_image) {
      mediaBlock += `
      <media:content url="${escapeXml(recipe.pinterest_image)}" medium="image">
        <media:title><![CDATA[Pinterest - ${recipe.title}]]></media:title>
      </media:content>`;
    }
    if (recipe.featured_image) {
      mediaBlock += `
      <media:content url="${escapeXml(recipe.featured_image)}" medium="image">
        <media:title><![CDATA[Featured - ${recipe.title}]]></media:title>
      </media:content>`;
    }

    return `    <item>
      <title><![CDATA[${recipe.title}]]></title>
      <link>${escapeXml(recipeUrl)}</link>
      <guid isPermaLink="true">${escapeXml(recipeUrl)}</guid>
      <description><![CDATA[${recipe.excerpt || recipe.title}]]></description>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>${imageUrl ? `
      <enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="50000" />` : ''}${mediaBlock}
    </item>`;
  }).join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title><![CDATA[${siteConfig.name} - BBQ Recipes]]></title>
    <link>${siteConfig.url}/recipe/</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss/recipes/" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteConfig.url}/icon.svg</url>
      <title><![CDATA[${siteConfig.name}]]></title>
      <link>${siteConfig.url}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
