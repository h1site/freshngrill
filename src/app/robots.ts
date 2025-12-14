import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/login/', '/register/', '/profil/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
