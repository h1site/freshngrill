import { Post } from '@/types/post';

interface Props {
  post: Post;
}

export default function ArticleSchema({ post }: Props) {
  const baseUrl = 'https://freshngrill.com';
  const postUrl = `${baseUrl}/blog/${post.slug}/`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.seoDescription,
    image: post.featuredImage ? [post.featuredImage] : [`${baseUrl}/images/og-default.svg`],
    author: {
      '@type': 'Organization',
      name: "Fresh N' Grill",
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: "Fresh N' Grill",
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
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
    inLanguage: 'en',
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
