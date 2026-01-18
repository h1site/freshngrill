import { createClient } from '@/lib/supabase-server';
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
  const supabase = await createClient();
  const baseUrl = siteConfig.url;

  const { data: spices } = await supabase
    .from('spices')
    .select('id, slug, name_fr, definition_fr, featured_image, origin, created_at')
    .order('name_fr');

  const rssItems = (spices || []).map((spice) => {
    const description = spice.definition_fr || '';
    const pubDate = new Date(spice.created_at).toUTCString();
    const imageTag = spice.featured_image
      ? `<enclosure url="${escapeXml(spice.featured_image)}" type="image/jpeg" />`
      : '';
    const origins = spice.origin || [];

    return `
    <item>
      <title>${escapeXml(spice.name_fr)}</title>
      <link>${baseUrl}/epices/${spice.slug}/</link>
      <guid isPermaLink="true">${baseUrl}/epices/${spice.slug}/</guid>
      <description>${escapeXml(stripHtml(description))}</description>
      <pubDate>${pubDate}</pubDate>
      ${imageTag}
      ${origins.map((o: string) => `<category>${escapeXml(o)}</category>`).join('\n      ')}
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Menucochon - La Route des Épices</title>
    <link>${baseUrl}/epices/</link>
    <description>Guide complet des épices: origine, goût, utilisations culinaires. Découvrez les épices du monde entier.</description>
    <language>fr-CA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss/epices" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/images/logos/menucochon-logo.png</url>
      <title>Menucochon - La Route des Épices</title>
      <link>${baseUrl}/epices/</link>
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
