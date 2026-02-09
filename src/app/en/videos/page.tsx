import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Youtube, ArrowRight } from 'lucide-react';
import { getAllVideos, YOUTUBE_CHANNEL } from '@/lib/videos';

export const metadata: Metadata = {
  title: 'Recipe Videos | Menucochon',
  description: 'Discover our Quebec recipe videos on YouTube. Tutorials, tips and culinary inspiration!',
  alternates: {
    canonical: '/en/videos',
    languages: {
      'fr-CA': '/videos',
      'en-CA': '/en/videos',
      'x-default': '/videos',
    },
  },
};

export default function VideosPageEn() {
  const videos = getAllVideos();

  return (
    <main className="min-h-screen bg-neutral-950 pt-20">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-red-500 text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
              <Youtube className="w-5 h-5" />
              Our YouTube Channel
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-white mb-6">
              Our Videos
            </h1>
            <p className="text-xl text-neutral-400 mb-8">
              Learn to cook with us! Discover our video tutorials, step-by-step recipes and culinary tips.
            </p>
            <a
              href={YOUTUBE_CHANNEL.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <Youtube className="w-5 h-5" />
              Subscribe to the channel
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {videos.map((video) => (
              <Link
                key={video.id}
                href={`/en/video/${video.slugEn}`}
                className="group block"
              >
                <article className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-red-500/50 transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={video.thumbnail}
                      alt={video.titleEn}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                        <Play className="w-7 h-7 text-white ml-1" fill="white" />
                      </div>
                    </div>
                    {/* Duration */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="font-display text-xl text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                      {video.titleEn}
                    </h2>
                    <p className="text-neutral-500 text-sm line-clamp-2">
                      {video.descriptionEn}
                    </p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {video.tagsEn.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-16">
              <Youtube className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg">No videos yet.</p>
              <p className="text-neutral-600">Come back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-neutral-900">
        <div className="container mx-auto px-4 text-center">
          <Youtube className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            Don't miss any video!
          </h2>
          <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
            Subscribe to our YouTube channel to receive our new recipe videos directly in your feed.
          </p>
          <a
            href={YOUTUBE_CHANNEL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-medium text-lg transition-colors"
          >
            <Youtube className="w-6 h-6" />
            Subscribe now
          </a>
        </div>
      </section>
    </main>
  );
}
