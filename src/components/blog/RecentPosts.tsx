'use client';

import { motion } from 'framer-motion';
import { PostCard as PostCardType } from '@/types/post';
import PostCard from './PostCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Props {
  posts: PostCardType[];
  title?: string;
  showViewAll?: boolean;
}

export default function RecentPosts({ posts, title = 'Articles récents', showViewAll = true }: Props) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-wider">
              Blog
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-black mt-2">
              {title}
            </h2>
          </div>

          {showViewAll && (
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-2 text-black hover:text-[#F77313] transition-colors group"
            >
              <span className="font-medium">Voir tout</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>

        {/* Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Mobile view all */}
        {showViewAll && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center md:hidden"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-medium hover:bg-[#F77313] transition-colors"
            >
              <span>Voir tous les articles</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
