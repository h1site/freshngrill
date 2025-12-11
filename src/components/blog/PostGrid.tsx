'use client';

import { motion } from 'framer-motion';
import { PostCard as PostCardType } from '@/types/post';
import PostCard from './PostCard';

interface Props {
  posts: PostCardType[];
  variant?: 'default' | 'featured';
}

export default function PostGrid({ posts, variant = 'default' }: Props) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500 text-lg">Aucun article trouvé</p>
      </div>
    );
  }

  if (variant === 'featured' && posts.length >= 3) {
    const [featured, ...rest] = posts;

    return (
      <div className="space-y-12">
        {/* Featured post */}
        <PostCard post={featured} variant="large" index={0} />

        {/* Other posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post, index) => (
            <PostCard key={post.id} post={post} index={index + 1} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </motion.div>
  );
}
