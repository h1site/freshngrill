import { getAllRecipes, enrichRecipesWithEnglishData } from '@/lib/recipes';
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
  const enrichedRecipes = await enrichRecipesWithEnglishData(recipes);
  const baseUrl = siteConfig.url;

  // Filter only recipes that have English slugs
  const englishRecipes = enrichedRecipes.filter((r) => r.slugEn);

  const rssItems = englishRecipes.slice(0, 50).map((recipe) => {
    const description = recipe.excerpt || recipe.seoDescription || '';
    const pubDate = new Date(recipe.publishedAt).toUTCString();
    const imageTag = recipe.featuredImage
      ? `<enclosure url="${escapeXml(recipe.featuredImage)}" type="image/jpeg" />`
      : '';

    return `
    <item>
      <title>${escapeXml(recipe.title)}</title>
      <link>${baseUrl}/en/recipe/${recipe.slugEn}/</link>
      <guid isPermaLink="true">${baseUrl}/en/recipe/${recipe.slugEn}/</guid>
      <description>${escapeXml(stripHtml(description))}</description>
      <pubDate>${pubDate}</pubDate>
      ${imageTag}
      ${recipe.categories.map((cat) => `<category>${escapeXml(cat.name)}</category>`).join('\n      ')}
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Menucochon - Recipes</title>
    <link>${baseUrl}/en/recipe/</link>
    <description>Discover our delicious Quebec and international recipes. Meal ideas for every day.</description>
    <language>en-CA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/en/rss/recipes" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/images/logos/menucochon-logo.png</url>
      <title>Menucochon - Recipes</title>
      <link>${baseUrl}/en/recipe/</link>
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
