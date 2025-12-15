import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ArrowRight, Calendar, Clock } from 'lucide-react';
import { getPostCardsWithEnglish } from '@/lib/posts';
import GoogleAd from '@/components/ads/GoogleAd';

export const metadata: Metadata = {
  title: 'Kitchen Buying Guide | Menucochon',
  description:
    'Discover our selection of the best utensils, appliances and cookbooks to equip your kitchen like a professional chef.',
  alternates: {
    canonical: '/en/buying-guide/',
    languages: {
      'fr-CA': '/guide-achat/',
      'en-CA': '/en/buying-guide/',
    },
  },
  openGraph: {
    title: 'Kitchen Buying Guide | Menucochon',
    description:
      'Discover our selection of the best utensils, appliances and cookbooks to equip your kitchen like a professional chef.',
    images: [
      {
        url: '/images/og-guide-achat.jpg',
        width: 1200,
        height: 630,
        alt: 'Buying Guide - Menucochon',
      },
    ],
    type: 'website',
    url: '/en/buying-guide/',
    siteName: 'Menucochon',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kitchen Buying Guide | Menucochon',
    description:
      'Discover our selection of the best utensils, appliances and cookbooks.',
    images: ['/images/og-guide-achat.jpg'],
  },
};

export default async function BuyingGuidePage() {
  const allPosts = await getPostCardsWithEnglish();

  // Filter posts from "Guide d'achat" category
  const buyingGuidePosts = allPosts.filter((post) =>
    post.categories.some((cat) => cat.slug === 'guide-achat')
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const featuredPost = buyingGuidePosts[0];
  const otherPosts = buyingGuidePosts.slice(1);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <header className="bg-black text-white">
        <div className="container mx-auto px-4">
          {/* Hero Content */}
          <div className="py-12 md:py-20 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#F77313] text-white text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 mb-6">
              <ShoppingCart className="w-4 h-4" />
              Buying Guide
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display leading-tight">
              Equip Your Kitchen Like a Chef
            </h1>
            <p className="text-xl text-neutral-400 mt-6 max-w-2xl mx-auto">
              Our comprehensive guides to help you choose the best utensils, appliances
              and kitchen equipment.
            </p>
          </div>
        </div>
      </header>

      {/* Featured Article */}
      {featuredPost && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <Link href={`/en/buying-guide/${featuredPost.slug}`} className="group block">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                {featuredPost.featuredImage ? (
                  <Image
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                )}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-[#F77313] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 mb-4">
                  <ShoppingCart className="w-3 h-3" />
                  Featured
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-black group-hover:text-[#F77313] transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                {featuredPost.excerpt && (
                  <p className="text-neutral-600 text-lg mt-4 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-6 text-neutral-500 text-sm">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredPost.publishedAt)}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readingTime} min read
                  </span>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-[#F77313] font-medium group-hover:gap-3 transition-all">
                  Read the guide
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Ad */}
      <div className="container mx-auto px-4">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Articles Grid */}
      {otherPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-black">All Guides</h2>
              <div className="w-16 h-1 bg-[#F77313] mt-3" />
            </div>
            <span className="text-neutral-400 text-sm">{otherPosts.length} guides</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/en/buying-guide/${post.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    {/* Arrow */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#F77313] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 rounded">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span>{post.readingTime} min</span>
                    </div>
                    <h3 className="font-display text-xl text-black group-hover:text-[#F77313] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-neutral-600 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {buyingGuidePosts.length === 0 && (
        <section className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="font-display text-2xl text-black mb-2">Guides Coming Soon</h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Our buying guides are coming soon. Check back to discover
            our kitchen equipment recommendations.
          </p>
        </section>
      )}

      <GoogleAd slot="7610644087" className="container mx-auto px-4 mb-12" />

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-black text-white rounded-lg p-8 md:p-12 text-center">
          <ShoppingCart className="w-12 h-12 text-[#F77313] mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl mb-4">Ready to Cook?</h2>
          <p className="text-neutral-400 max-w-xl mx-auto mb-6">
            Discover our recipes and put your new equipment to the test!
          </p>
          <Link
            href="/en/recipes"
            className="inline-flex items-center justify-center gap-2 bg-[#F77313] text-white px-6 py-3 font-medium uppercase tracking-wide hover:bg-[#d45f0a] transition-colors"
          >
            Explore recipes
          </Link>
        </div>
      </section>
    </main>
  );
}
