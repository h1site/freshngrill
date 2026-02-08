const INDEXNOW_KEY = '9170df015d176c80201f0fb47283f655';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITE_HOST = 'menucochon.com';
const KEY_LOCATION = `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`;

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrl(url: string): Promise<boolean> {
  return submitUrls([url]);
}

/**
 * Submit multiple URLs to IndexNow (max 10,000 per batch)
 */
export async function submitUrls(urls: string[]): Promise<boolean> {
  if (urls.length === 0) return true;

  // IndexNow accepts max 10,000 URLs per request
  const batch = urls.slice(0, 10000);

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: batch,
      }),
    });

    // 200 = OK, 202 = Accepted (URL will be processed later)
    if (response.ok || response.status === 202) {
      console.log(`IndexNow: submitted ${batch.length} URL(s) successfully`);
      return true;
    }

    console.error(`IndexNow: failed with status ${response.status}`, await response.text());
    return false;
  } catch (error) {
    console.error('IndexNow: submission error', error);
    return false;
  }
}

/**
 * Submit a recipe URL (both FR and EN) to IndexNow
 */
export async function submitRecipeUrls(slugFr: string, slugEn?: string): Promise<boolean> {
  const urls = [`https://${SITE_HOST}/recette/${slugFr}/`];
  if (slugEn) {
    urls.push(`https://${SITE_HOST}/en/recipe/${slugEn}/`);
  }
  return submitUrls(urls);
}

/**
 * Submit a blog post URL (both FR and EN) to IndexNow
 */
export async function submitBlogUrls(slug: string, slugEn?: string): Promise<boolean> {
  const urls = [`https://${SITE_HOST}/blog/${slug}/`];
  if (slugEn) {
    urls.push(`https://${SITE_HOST}/en/blog/${slugEn}/`);
  }
  return submitUrls(urls);
}

/**
 * Submit all sitemap URLs to IndexNow (useful for initial submission)
 */
export async function submitSitemapUrls(): Promise<{ submitted: number; success: boolean }> {
  try {
    const response = await fetch(`https://${SITE_HOST}/sitemap.xml`);
    const xml = await response.text();

    // Extract URLs from sitemap XML
    const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
    if (!urlMatches) return { submitted: 0, success: false };

    const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));

    // Submit in batches of 10,000
    let success = true;
    for (let i = 0; i < urls.length; i += 10000) {
      const batch = urls.slice(i, i + 10000);
      const result = await submitUrls(batch);
      if (!result) success = false;
    }

    return { submitted: urls.length, success };
  } catch (error) {
    console.error('IndexNow: sitemap submission error', error);
    return { submitted: 0, success: false };
  }
}
