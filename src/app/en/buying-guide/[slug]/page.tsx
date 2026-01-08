import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getPostBySlugWithEnglish,
  getSimilarPostsWithEnglish,
  getEnglishSlugForPost,
} from '@/lib/posts';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Bookmark, ShoppingCart } from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';
import ArticleSchema from '@/components/schema/ArticleSchema';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Check if French slug should redirect to English
  const englishSlug = await getEnglishSlugForPost(slug);
  const finalSlug = englishSlug || slug;

  const post = await getPostBySlugWithEnglish(slug);

  if (!post) {
    return {
      title: 'Article not found',
    };
  }

  return {
    title: post.seoTitle || `${post.title} | Buying Guide`,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: `/en/buying-guide/${finalSlug}/`,
      languages: {
        'fr-CA': `/guide-achat/${post.slug}/`,
        'en-CA': `/en/buying-guide/${finalSlug}/`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630, alt: post.title }]
        : [],
      type: 'article',
      url: `/en/buying-guide/${finalSlug}/`,
      siteName: 'Menucochon',
      locale: 'en_CA',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  };
}

export default async function BuyingGuidePostPage({ params }: Props) {
  const { slug } = await params;

  // Check if this is a French slug that should redirect to English
  const englishSlug = await getEnglishSlugForPost(slug);
  if (englishSlug && englishSlug !== slug) {
    redirect(`/en/buying-guide/${englishSlug}`);
  }

  const post = await getPostBySlugWithEnglish(slug);

  if (!post) {
    notFound();
  }

  // Verify post is in guide-achat category
  const isGuideAchat = post.categories.some((cat) => cat.slug === 'guide-achat');
  if (!isGuideAchat) {
    notFound();
  }

  // Get similar posts and filter to only guide-achat category
  const allSimilarPosts = await getSimilarPostsWithEnglish(post, 10);
  const similarPosts = allSimilarPosts
    .filter((p) => p.categories.some((cat) => cat.slug === 'guide-achat'))
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const breadcrumbs = [
    { name: 'Home', url: '/en' },
    { name: 'Buying Guide', url: '/en/buying-guide' },
    { name: post.title, url: `/en/buying-guide/${slug}/` },
  ];

  return (
    <>
      <ArticleSchema post={post} locale="en" />
      <BreadcrumbSchema items={breadcrumbs} />
      <main className="min-h-screen bg-white">
        <article>
        {/* Magazine Header */}
        <header className="bg-black text-white">
        <div className="container mx-auto px-4">
          {/* Navigation Bar */}
          <div className="py-4 flex items-center justify-between border-b border-white/10">
            <Link
              href="/en/buying-guide"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to buying guide
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Article Header */}
          <div className="py-12 md:py-16 lg:py-20 max-w-4xl mx-auto text-center">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F77313] text-white text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-6">
              <ShoppingCart className="w-4 h-4" />
              Buying Guide
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl md:text-2xl text-neutral-400 mt-6 max-w-3xl mx-auto leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-neutral-500">
              {/* Author */}
              <div className="flex items-center gap-3">
                <Image
                  src="/images/auteurs/seb.jpg"
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="text-left">
                  <span className="text-white font-medium block text-sm">
                    {post.author.name}
                  </span>
                  <span className="text-xs text-neutral-500">Author</span>
                </div>
              </div>

              <span className="w-px h-8 bg-white/20 hidden sm:block" />

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </div>

              <span className="w-px h-8 bg-white/20 hidden sm:block" />

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                {post.readingTime} min read
              </div>
            </div>
          </div>
        </div>
        </header>

        {/* Featured Image - Full Width */}
        {post.featuredImage && (
          <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh]">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
        )}

        {/* Article Content */}
        <div className="relative">
          {/* Progress Bar Placeholder */}
          <div className="sticky top-0 z-50 h-1 bg-neutral-100">
            <div className="h-full bg-[#F77313] w-0" id="reading-progress" />
          </div>

          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl mx-auto">
              {/* Affiliate Disclosure */}
              <div className="bg-neutral-100 border-l-4 border-[#F77313] p-4 mb-8 text-sm text-neutral-600">
                <strong>Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases.
                Product links are affiliate links.
              </div>

              {/* Drop Cap Article Content */}
              <div
                className="blog-content buying-guide-content first-letter:text-7xl first-letter:font-display first-letter:text-[#F77313] first-letter:float-left first-letter:mr-3 first-letter:mt-1"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Ad in article */}
              <GoogleAd slot="7610644087" className="my-12" />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-neutral-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-neutral-500 font-medium">Tags:</span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm px-4 py-2 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </article>

        {/* Similar Articles - Editorial Style */}
      {similarPosts.length > 0 && (
        <section className="bg-neutral-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#F77313] text-sm font-medium uppercase tracking-[0.2em]">
                Continue reading
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-black mt-3">
                Other Guides
              </h2>
              <div className="w-16 h-1 bg-[#F77313] mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {similarPosts.map((similarPost) => {
                const isGuide = similarPost.categories.some((cat) => cat.slug === 'guide-achat');
                const postUrl = isGuide ? `/en/buying-guide/${similarPost.slug}` : `/en/blog/${similarPost.slug}`;

                return (
                  <article key={similarPost.id} className="group">
                    <Link href={postUrl} className="block">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                        {similarPost.featuredImage ? (
                          <Image
                            src={similarPost.featuredImage}
                            alt={similarPost.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-300 to-neutral-400" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>

                      {/* Content */}
                      <div className="pt-5">
                        {similarPost.categories[0] && (
                          <span className="text-[#F77313] text-xs font-medium uppercase tracking-wider">
                            {similarPost.categories[0].name}
                          </span>
                        )}
                        <h3 className="font-display text-xl md:text-2xl text-black group-hover:text-[#F77313] transition-colors leading-tight mt-2">
                          {similarPost.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-3 text-neutral-500 text-xs">
                          <span>{formatDate(similarPost.publishedAt)}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-400" />
                          <span>{similarPost.readingTime} min</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/en/buying-guide"
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-medium uppercase tracking-wide hover:bg-[#F77313] transition-colors"
              >
                See all guides
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
      </main>
    </>
  );
}
