'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { PostCard } from '@/types/post';
import type { Locale } from '@/i18n/config';

interface MagazineBlogSectionProps {
  posts: PostCard[];
  locale?: Locale;
}

const translations = {
  fr: {
    theBlog: 'Le Blog',
    latestArticles: 'Derniers Articles',
    allArticles: 'Tous les articles',
    minRead: 'min de lecture',
    min: 'min',
  },
  en: {
    theBlog: 'The Blog',
    latestArticles: 'Latest Articles',
    allArticles: 'All Articles',
    minRead: 'min read',
    min: 'min',
  },
};

export function MagazineBlogSection({ posts, locale = 'fr' }: MagazineBlogSectionProps) {
  const t = translations[locale];
  const blogBasePath = locale === 'en' ? '/en/blog' : '/blog';

  if (posts.length === 0) return null;

  const [featuredPost, ...otherPosts] = posts;

  return (
    <section className="py-20 md:py-32 bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="text-[#F77313] text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t.theBlog}
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-white mt-3">
              {t.latestArticles}
            </h2>
            <div className="w-24 h-1 bg-[#F77313] mt-6" />
          </div>
          <Link
            href={blogBasePath}
            className="group flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-[#F77313] transition-colors mt-6 md:mt-0 uppercase tracking-wide"
          >
            {t.allArticles}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Blog Grid - 1 featured left, 3 stacked right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Featured Post - Left (full height) */}
          <motion.div
            className="lg:row-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href={`${blogBasePath}/${featuredPost.slug}`} className="group block h-full">
              <article className="relative h-full min-h-[400px] lg:min-h-full overflow-hidden bg-white">
                {/* Image - Full cover */}
                <div className="absolute inset-0">
                  {featuredPost.featuredImage ? (
                    <Image
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                      <BookOpen className="w-20 h-20 text-neutral-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  {featuredPost.categories[0] && (
                    <span className="inline-block w-fit bg-[#F77313] text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 mb-4">
                      {featuredPost.categories[0].name}
                    </span>
                  )}

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-display text-white leading-tight mb-4 group-hover:text-[#F77313] transition-colors duration-300">
                    {featuredPost.title}
                  </h3>

                  <p className="text-white/70 line-clamp-2 mb-4 hidden md:block">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readingTime} {t.minRead}</span>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-8 right-8 md:bottom-10 md:right-10 w-12 h-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <ArrowRight className="w-5 h-5 text-[#F77313]" />
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>

          {/* Other Posts - Right (3 stacked) */}
          <div className="flex flex-col gap-4">
            {otherPosts.slice(0, 3).map((post, index) => (
              <motion.div
                key={post.id}
                className="flex-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`${blogBasePath}/${post.slug}`} className="group block h-full">
                  <article className="flex gap-5 h-full bg-neutral-800 p-4 border border-neutral-700 hover:border-[#F77313]/50 hover:bg-neutral-800/80 transition-all duration-300">
                    {/* Thumbnail */}
                    {post.featuredImage && (
                      <div className="relative w-28 md:w-36 aspect-[4/3] flex-shrink-0 overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="144px"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      {post.categories[0] && (
                        <span className="text-[#F77313] text-[10px] font-semibold uppercase tracking-widest mb-1">
                          {post.categories[0].name}
                        </span>
                      )}
                      <h3 className="font-display text-lg md:text-xl text-white leading-tight mb-2 group-hover:text-[#F77313] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-neutral-500 text-xs mt-auto">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime} {t.min}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
