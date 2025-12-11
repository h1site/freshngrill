import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getPostBySlug,
  getAllPostSlugs,
  getSimilarPosts,
} from '@/lib/posts';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, Bookmark, Quote } from 'lucide-react';
import PostCard from '@/components/blog/PostCard';
import GoogleAd from '@/components/ads/GoogleAd';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article non trouvé',
    };
  }

  return {
    title: post.seoTitle || `${post.title} | Menu Cochon`,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: `/blog/${slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      url: `/blog/${slug}/`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const similarPosts = await getSimilarPosts(post, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Magazine Header */}
      <header className="bg-black text-white">
        <div className="container mx-auto px-4">
          {/* Navigation Bar */}
          <div className="py-4 flex items-center justify-between border-b border-white/10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au blog
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
            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    className="bg-[#F77313] text-white text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

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
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#F77313] flex items-center justify-center text-white font-display text-lg">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <span className="text-white font-medium block text-sm">
                    {post.author.name}
                  </span>
                  <span className="text-xs text-neutral-500">Auteur</span>
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
                {post.readingTime} min de lecture
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
      <article className="relative">
        {/* Progress Bar Placeholder */}
        <div className="sticky top-0 z-50 h-1 bg-neutral-100">
          <div className="h-full bg-[#F77313] w-0" id="reading-progress" />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Drop Cap Article Content */}
            <div
              className="prose prose-lg lg:prose-xl max-w-none
                prose-headings:font-display prose-headings:text-black prose-headings:font-normal
                prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-[#F77313] prose-h2:pl-6
                prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-neutral-700 prose-p:leading-[1.8] prose-p:text-lg
                prose-a:text-[#F77313] prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                prose-strong:text-black prose-strong:font-semibold
                prose-img:rounded-none prose-img:my-10 prose-img:shadow-xl
                prose-blockquote:border-l-0 prose-blockquote:bg-neutral-50 prose-blockquote:p-8 prose-blockquote:my-10 prose-blockquote:relative prose-blockquote:not-italic
                prose-blockquote:before:content-[''] prose-blockquote:before:absolute prose-blockquote:before:top-0 prose-blockquote:before:left-0 prose-blockquote:before:w-1 prose-blockquote:before:h-full prose-blockquote:before:bg-[#F77313]
                prose-ul:my-6 prose-li:text-neutral-700 prose-li:marker:text-[#F77313]
                prose-ol:my-6
                first-letter:text-7xl first-letter:font-display first-letter:text-[#F77313] first-letter:float-left first-letter:mr-3 first-letter:mt-1"
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

            {/* Share Section */}
            <div className="mt-12 p-8 bg-black text-white text-center">
              <p className="text-sm text-neutral-400 uppercase tracking-wider mb-3">
                Partagez cet article
              </p>
              <div className="flex justify-center gap-4">
                <button className="w-12 h-12 bg-white/10 hover:bg-[#F77313] flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </button>
                <button className="w-12 h-12 bg-white/10 hover:bg-[#F77313] flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </button>
                <button className="w-12 h-12 bg-white/10 hover:bg-[#F77313] flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                </button>
                <button className="w-12 h-12 bg-white/10 hover:bg-[#F77313] flex items-center justify-center transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ad before author */}
            <GoogleAd slot="7610644087" className="my-12" />

            {/* Author Box - Magazine Style */}
            <div className="mt-12 border border-neutral-200">
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {post.author.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={100}
                      height={100}
                      className="rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#F77313] flex items-center justify-center text-white text-3xl font-display flex-shrink-0">
                      {post.author.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="text-xs text-[#F77313] uppercase tracking-[0.15em] font-medium">
                      À propos de l'auteur
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-black mt-2">
                      {post.author.name}
                    </h3>
                    {post.author.bio && (
                      <p className="text-neutral-600 mt-3 leading-relaxed">
                        {post.author.bio}
                      </p>
                    )}
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 text-[#F77313] font-medium mt-4 hover:underline"
                    >
                      Voir tous ses articles
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
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
                Continuez la lecture
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-black mt-3">
                Articles Similaires
              </h2>
              <div className="w-16 h-1 bg-[#F77313] mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {similarPosts.map((similarPost, index) => (
                <article key={similarPost.id} className="group">
                  <Link href={`/blog/${similarPost.slug}`} className="block">
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
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-medium uppercase tracking-wide hover:bg-[#F77313] transition-colors"
              >
                Voir tous les articles
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
