import { getAllRecipes } from '@/lib/recipes';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export async function GET() {
  const recipes = await getAllRecipes();
  const baseUrl = siteConfig.url;

  // Only include recipes with Pinterest images
  const recipesWithPinterest = recipes
    .filter((recipe) => recipe.pinterestImage)
    .slice(0, 100);

  const rssItems = recipesWithPinterest.map((recipe) => {
    const title = recipe.pinterestTitle || recipe.title;
    const description = recipe.pinterestDescription || recipe.excerpt || recipe.seoDescription || '';
    const pubDate = new Date(recipe.publishedAt).toUTCString();
    const pinterestImage = recipe.pinterestImage!;

    return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${baseUrl}/recette/${recipe.slug}/</link>
      <guid isPermaLink="true">${baseUrl}/recette/${recipe.slug}/</guid>
      <description>${escapeXml(stripHtml(description))}</description>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${escapeXml(pinterestImage)}" type="image/jpeg" length="0" />
      <media:content url="${escapeXml(pinterestImage)}" type="image/jpeg" medium="image" width="1000" height="1500">
        <media:title type="plain">${escapeXml(title)}</media:title>
        <media:description type="plain">${escapeXml(stripHtml(description))}</media:description>
      </media:content>
      <media:thumbnail url="${escapeXml(pinterestImage)}" width="1000" height="1500" />
      ${recipe.categories.map((cat) => `<category>${escapeXml(cat.name)}</category>`).join('\n      ')}
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Menucochon - Recettes Pinterest</title>
    <link>${baseUrl}/recette/</link>
    <description>Recettes québécoises avec images Pinterest optimisées (1000x1500). Parfait pour Pinterest et les lecteurs RSS avec support images.</description>
    <language>fr-CA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss/pinterest" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/images/logos/menucochon-logo.png</url>
      <title>Menucochon - Recettes Pinterest</title>
      <link>${baseUrl}/recette/</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
