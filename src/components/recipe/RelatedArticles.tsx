import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { PostCard } from '@/types/post';

interface Props {
  posts: PostCard[];
  locale?: 'fr' | 'en';
}

const translations = {
  fr: {
    title: 'Articles reliés',
    subtitle: 'Approfondissez vos connaissances culinaires',
    readMore: 'Lire l\'article',
    viewAll: 'Voir tous les articles',
    blogPath: '/blog',
    min: 'min de lecture',
  },
  en: {
    title: 'Related Articles',
    subtitle: 'Deepen your culinary knowledge',
    readMore: 'Read article',
    viewAll: 'View all articles',
    blogPath: '/en/blog',
    min: 'min read',
  },
};

export default function RelatedArticles({ posts, locale = 'fr' }: Props) {
  if (!posts || posts.length === 0) return null;

  const t = translations[locale];

  return (
    <section className="bg-white border border-neutral-200 rounded-lg p-6 md:p-8 print:hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-display text-xl text-black">{t.title}</h2>
            <p className="text-neutral-500 text-sm">{t.subtitle}</p>
          </div>
        </div>
        <Link
          href={t.blogPath}
          className="hidden md:flex items-center gap-1 text-sm text-[#F77313] hover:text-[#d45f0a] transition-colors"
        >
          {t.viewAll}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`${t.blogPath}/${post.slug}/`}
            className="group flex flex-col bg-neutral-50 rounded-lg overflow-hidden hover:bg-neutral-100 transition-colors"
          >
            {post.featuredImage && (
              <div className="relative aspect-video">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              {post.categories.length > 0 && (
                <span className="text-xs font-medium text-[#F77313] uppercase tracking-wider mb-2">
                  {post.categories[0].name}
                </span>
              )}
              <h3 className="font-medium text-black group-hover:text-[#F77313] transition-colors line-clamp-2 flex-1">
                {post.title}
              </h3>
              <div className="flex items-center gap-1 mt-3 text-xs text-neutral-500">
                <Clock className="w-3 h-3" />
                <span>{post.readingTime} {t.min}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href={t.blogPath}
        className="md:hidden flex items-center justify-center gap-1 mt-4 text-sm text-[#F77313] hover:text-[#d45f0a] transition-colors"
      >
        {t.viewAll}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
