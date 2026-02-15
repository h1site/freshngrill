import Image from 'next/image';
import Link from 'next/link';
import { PostCard as PostCardType } from '@/types/post';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';

interface Props {
  post: PostCardType;
  index?: number;
  variant?: 'default' | 'large' | 'horizontal';
}

export default function PostCard({ post, variant = 'default' }: Props) {
  const isLarge = variant === 'large';
  const isHorizontal = variant === 'horizontal';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isHorizontal) {
    return (
      <article className="group">
        <Link href={`/blog/${post.slug}`} className="flex gap-6">
          {/* Image Container */}
          <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden bg-neutral-100">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="192px"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 py-1">
            {/* Category */}
            {post.categories[0] && (
              <span className="text-[#00bf63] text-xs font-medium uppercase tracking-wider">
                {post.categories[0].name}
              </span>
            )}

            {/* Title */}
            <h3 className="font-display text-lg text-black group-hover:text-[#00bf63] transition-colors leading-tight mt-1 mb-2">
              {post.title}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.publishedAt)}
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-neutral-100 ${isLarge ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Category Badge */}
          {post.categories[0] && (
            <span className="absolute top-4 left-4 bg-[#00bf63] text-white text-xs font-medium uppercase tracking-wider px-3 py-1.5">
              {post.categories[0].name}
            </span>
          )}

          {/* Arrow indicator on hover */}
          <div className="absolute bottom-4 right-4 w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight className="w-5 h-5 text-black" />
          </div>
        </div>

        {/* Content */}
        <div className="pt-4">
          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-neutral-500 uppercase tracking-wide mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-display text-black group-hover:text-[#00bf63] transition-colors leading-tight ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-neutral-600 text-sm mt-2 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Author */}
          {post.author && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-neutral-500">By {post.author.name}</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
