import { getAllTerms } from '@/lib/lexique';
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
  const terms = await getAllTerms('fr');
  const baseUrl = siteConfig.url;

  const rssItems = terms.map((term) => {
    const description = term.definition || '';
    const pubDate = new Date(term.createdAt).toUTCString();

    return `
    <item>
      <title>${escapeXml(term.term)}</title>
      <link>${baseUrl}/lexique/${term.slug}/</link>
      <guid isPermaLink="true">${baseUrl}/lexique/${term.slug}/</guid>
      <description>${escapeXml(stripHtml(description))}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(term.letter)}</category>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Menucochon - Lexique Culinaire</title>
    <link>${baseUrl}/lexique/</link>
    <description>Lexique culinaire complet: définitions des termes de cuisine, techniques et ingrédients.</description>
    <language>fr-CA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss/lexique" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/images/logos/menucochon-logo.png</url>
      <title>Menucochon - Lexique Culinaire</title>
      <link>${baseUrl}/lexique/</link>
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
