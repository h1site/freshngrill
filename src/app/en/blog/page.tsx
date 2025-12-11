import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPostCards, getAllPostCategories } from '@/lib/posts';
import { Calendar, Clock, ArrowRight, Newspaper } from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';

export const metadata: Metadata = {
  title: 'Blog | Menu Cochon',
  description: 'Discover our articles, tips and culinary tricks to become a chef in the kitchen.',
  alternates: {
    canonical: '/en/blog/',
    languages: {
      'fr-CA': '/blog/',
      'en-CA': '/en/blog/',
    },
  },
};

export default async function BlogPageEN() {
  const [posts, categories] = await Promise.all([
    getPostCards(),
    getAllPostCategories(),
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);
  const remainingPosts = posts.slice(3);

  return (
    <main className="min-h-screen bg-white">
      {/* Magazine-Style Hero */}
      <section className="relative bg-black">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="py-8 md:py-12 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Newspaper className="w-5 h-5 text-[#F77313]" />
                  <span className="text-[#F77313] text-sm font-medium uppercase tracking-[0.2em]">
                    The Journal
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white">
                  Blog
                </h1>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-neutral-500 text-sm uppercase tracking-wider">
                  Edition
                </p>
                <p className="text-white font-display text-2xl">
                  {new Date().toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Article Grid */}
          {featuredPost && (
            <div className="py-8 md:py-12">
              <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Main Featured */}
                <div className="lg:col-span-7">
                  <Link href={`/en/blog/${featuredPost.slug}`} className="group block relative">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {featuredPost.featuredImage ? (
                        <Image
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        {featuredPost.categories[0] && (
                          <span className="inline-block bg-[#F77313] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 mb-4">
                            {featuredPost.categories[0].name}
                          </span>
                        )}
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight group-hover:text-[#F77313] transition-colors">
                          {featuredPost.title}
                        </h2>
                        {featuredPost.excerpt && (
                          <p className="text-white/70 text-lg mt-4 line-clamp-2 max-w-2xl">
                            {featuredPost.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-6 text-white/60 text-sm">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(featuredPost.publishedAt)}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-white/40" />
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readingTime} min
                          </span>
                          {featuredPost.author && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-white/40" />
                              <span>By {featuredPost.author.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Secondary Posts */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {secondaryPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/en/blog/${post.slug}`}
                      className="group flex gap-4 md:gap-6"
                    >
                      <div className="relative w-32 md:w-40 aspect-square flex-shrink-0 overflow-hidden">
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-800" />
                        )}
                      </div>
                      <div className="flex-1 py-1">
                        {post.categories[0] && (
                          <span className="text-[#F77313] text-xs font-medium uppercase tracking-wider">
                            {post.categories[0].name}
                          </span>
                        )}
                        <h3 className="font-display text-xl md:text-2xl text-white group-hover:text-[#F77313] transition-colors leading-tight mt-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-3 text-neutral-500 text-xs">
                          <span>{formatDate(post.publishedAt)}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-600" />
                          <span>{post.readingTime} min</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Bar */}
      {categories.length > 0 && (
        <section className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 py-1 overflow-x-auto scrollbar-hide">
              <button className="px-4 py-3 text-sm font-medium text-[#F77313] border-b-2 border-[#F77313] whitespace-nowrap">
                All articles
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="px-4 py-3 text-sm text-neutral-600 hover:text-black border-b-2 border-transparent hover:border-neutral-300 transition-all whitespace-nowrap"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad after hero */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Articles Grid - Magazine Layout */}
      {remainingPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-black">
                Latest Articles
              </h2>
              <div className="w-16 h-1 bg-[#F77313] mt-3" />
            </div>
            <span className="text-neutral-400 text-sm">
              {posts.length} articles
            </span>
          </div>

          {/* Asymmetric Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {remainingPosts.map((post, index) => {
              // Every 4th post is featured (larger)
              const isFeatured = index % 4 === 0;

              return (
                <article
                  key={post.id}
                  className={`group ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}`}
                >
                  <Link href={`/en/blog/${post.slug}`} className="block">
                    {/* Image */}
                    <div className={`relative overflow-hidden bg-neutral-100 ${isFeatured ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}>
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                      )}

                      {/* Category Badge */}
                      {post.categories[0] && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-white text-black text-xs font-bold uppercase tracking-wider px-3 py-1.5 shadow-lg">
                            {post.categories[0].name}
                          </span>
                        </div>
                      )}

                      {/* Read More Arrow */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-[#F77313] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-5">
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-neutral-500 uppercase tracking-wide mb-3">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        <span>{post.readingTime} min read</span>
                      </div>

                      {/* Title */}
                      <h3 className={`font-display text-black group-hover:text-[#F77313] transition-colors leading-tight ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className={`text-neutral-600 mt-3 line-clamp-2 ${isFeatured ? 'text-base' : 'text-sm'}`}>
                          {post.excerpt}
                        </p>
                      )}

                      {/* Author */}
                      {post.author && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
                          <div className="w-8 h-8 rounded-full bg-[#F77313] flex items-center justify-center text-white text-xs font-bold">
                            {post.author.name.charAt(0)}
                          </div>
                          <span className="text-sm text-neutral-600">
                            By <span className="text-black font-medium">{post.author.name}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Ad before newsletter */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Newsletter CTA */}
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-[0.2em]">
              Newsletter
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white mt-4 mb-6">
              Stay Inspired
            </h2>
            <p className="text-neutral-400 text-lg mb-8">
              Receive our best recipes and culinary tips directly in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-neutral-500 focus:border-[#F77313] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#F77313] text-white font-medium uppercase tracking-wide hover:bg-[#d45f0a] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
