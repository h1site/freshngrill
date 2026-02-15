import { Metadata } from 'next';
import { getPostCards } from '@/lib/posts';
import PostGrid from '@/components/blog/PostGrid';

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Fresh N' Grill",
  description: 'BBQ tips, grilling techniques, steak guides, and outdoor cooking articles.',
  alternates: {
    canonical: '/blog/',
  },
  openGraph: {
    title: "Blog | Fresh N' Grill",
    description: 'BBQ tips, grilling techniques, steak guides, and outdoor cooking articles.',
    url: '/blog/',
    siteName: "Fresh N' Grill",
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blog | Fresh N' Grill",
    description: 'BBQ tips, grilling techniques, steak guides, and outdoor cooking articles.',
  },
};

export default async function BlogPage() {
  const posts = await getPostCards();

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide text-neutral-900 mb-8">
          Blog
        </h1>
        <PostGrid posts={posts} variant={posts.length >= 3 ? 'featured' : 'default'} />
      </div>
    </main>
  );
}
