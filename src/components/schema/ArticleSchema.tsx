import { Post } from '@/types/post';

interface Props {
  post: Post;
  locale?: 'fr' | 'en';
}

export default function ArticleSchema({ post, locale = 'fr' }: Props) {
  const baseUrl = 'https://menucochon.com';
  const postPath = locale === 'en' ? `/en/blog/${post.slug}/` : `/blog/${post.slug}/`;
  const postUrl = `${baseUrl}${postPath}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.seoDescription,
    image: post.featuredImage ? [post.featuredImage] : [`${baseUrl}/images/og-default.svg`],
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Menucochon',
      url: `${baseUrl}/a-propos`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Menucochon',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logos/menucochon-blanc.svg`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    articleSection: post.categories?.[0]?.name || 'Blog',
    wordCount: post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : undefined,
    inLanguage: locale === 'en' ? 'en-CA' : 'fr-CA',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
