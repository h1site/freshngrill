import { getAllRecipes, enrichRecipesWithEnglishData } from '@/lib/recipes';
import { siteConfig } from '@/lib/config';
import { PINTEREST_BOARDS } from '@/lib/pinterestBoards';

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const board = PINTEREST_BOARDS.find((b) => b.slug === category);

  if (!board) {
    return new Response('Category not found', { status: 404 });
  }

  const allRecipes = await getAllRecipes();
  const recipes = await enrichRecipesWithEnglishData(allRecipes);
  const baseUrl = siteConfig.url;

  // Filter recipes that have Pinterest images AND belong to this category
  const filteredRecipes = recipes
    .filter((recipe) => {
      if (!recipe.pinterestImageEn && !recipe.pinterestImage) return false;
      return recipe.categories.some((cat) => board.categorySlugs.includes(cat.slug));
    })
    .slice(0, 100);

  const rssItems = filteredRecipes.map((recipe) => {
    const title = recipe.pinterestTitleEn || recipe.pinterestTitle || recipe.title;
    const description = recipe.pinterestDescriptionEn || recipe.pinterestDescription || recipe.excerpt || recipe.seoDescription || '';
    const pubDate = new Date(recipe.publishedAt).toUTCString();
    const pinterestImage = recipe.pinterestImageEn || recipe.pinterestImage!;
    const slug = recipe.slugEn || recipe.slug;

    return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${baseUrl}/en/recipe/${slug}/</link>
      <guid isPermaLink="true">${baseUrl}/en/recipe/${slug}/</guid>
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
    <title>Menucochon - ${board.nameEn}</title>
    <link>${baseUrl}/en/recipe/</link>
    <description>${escapeXml(board.descriptionEn)}</description>
    <language>en-CA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/en/rss/pinterest/${board.slug}" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/images/logos/menucochon-logo.png</url>
      <title>Menucochon - ${escapeXml(board.nameEn)}</title>
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
