'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Play, Youtube, Share2, Clock, Calendar } from 'lucide-react';
import { getAllVideos, getVideoBySlug, YOUTUBE_CHANNEL } from '@/lib/videos';
import { use } from 'react';

interface VideoPageProps {
  params: Promise<{ slug: string }>;
}

export default function VideoPage({ params }: VideoPageProps) {
  const { slug } = use(params);
  const video = getVideoBySlug(slug, 'fr');

  if (!video) {
    notFound();
  }

  const allVideos = getAllVideos();
  const otherVideos = allVideos.filter((v) => v.id !== video.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-neutral-950 pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux vidéos
        </Link>
      </div>

      {/* Video Player */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* YouTube Embed */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Video Info */}
            <div className="mt-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-4">
                {video.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-neutral-500 text-sm mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {video.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(video.publishedAt).toLocaleDateString('fr-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Description */}
              <p className="text-neutral-300 text-lg leading-relaxed mb-8">
                {video.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-neutral-800 text-neutral-400 px-3 py-1.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  Voir sur YouTube
                </a>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: video.title,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Videos */}
      {otherVideos.length > 0 && (
        <section className="py-16 md:py-24 bg-neutral-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-display text-white mb-8">
              Autres vidéos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherVideos.map((v) => (
                <Link
                  key={v.id}
                  href={`/video/${v.slug}`}
                  className="group block"
                >
                  <article className="bg-neutral-800 rounded-xl overflow-hidden hover:bg-neutral-700 transition-colors">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={v.thumbnail}
                        alt={v.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" fill="white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {v.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        {v.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subscribe CTA */}
      <section className="py-16 bg-neutral-950">
        <div className="container mx-auto px-4 text-center">
          <a
            href={YOUTUBE_CHANNEL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-medium text-lg transition-colors"
          >
            <Youtube className="w-6 h-6" />
            S'abonner à notre chaîne
          </a>
        </div>
      </section>
    </main>
  );
}
