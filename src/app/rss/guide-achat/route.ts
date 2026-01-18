import { getPostCards } from '@/lib/posts';
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
  const allPosts = await getPostCards();
  const baseUrl = siteConfig.url;

  // Filtrer les posts de la catégorie "Guide d'achat"
  const guideAchatPosts = allPosts.filter((post) =>
    post.categories.some((cat) => cat.slug === 'guide-achat')
  );

  const rssItems = guideAchatPosts.map((post) => {
    const description = post.excerpt || '';
    const pubDate = new Date(post.publishedAt).toUTCString();
    const imageTag = post.featuredImage
      ? `<enclosure url="${escapeXml(post.featuredImage)}" type="image/jpeg" />`
      : '';

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/guide-achat/${post.slug}/</link>
      <guid isPermaLink="true">${baseUrl}/guide-achat/${post.slug}/</guid>
      <description>${escapeXml(stripHtml(description))}</description>
      <pubDate>${pubDate}</pubDate>
      ${imageTag}
      ${post.categories.map((cat) => `<category>${escapeXml(cat.name)}</category>`).join('\n      ')}
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Menucochon - Guide d'achat</title>
    <link>${baseUrl}/guide-achat/</link>
    <description>Guides complets pour choisir les meilleurs ustensiles, électroménagers et équipements de cuisine.</description>
    <language>fr-CA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss/guide-achat" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/images/logos/menucochon-logo.png</url>
      <title>Menucochon - Guide d'achat</title>
      <link>${baseUrl}/guide-achat/</link>
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
