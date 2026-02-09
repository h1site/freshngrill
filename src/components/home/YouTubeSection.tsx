import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Youtube } from 'lucide-react';
import { Video, YOUTUBE_CHANNEL } from '@/lib/videos';
import type { Locale } from '@/i18n/config';

interface YouTubeSectionProps {
  videos: Video[];
  locale?: Locale;
}

const translations = {
  fr: {
    ourChannel: 'Notre Chaîne',
    latestVideos: 'Nos Vidéos',
    allVideos: 'Toutes les vidéos',
    watchVideo: 'Regarder',
    subscribeTitle: 'Abonnez-vous!',
    subscribeDesc: 'Rejoignez notre communauté sur YouTube pour ne rien manquer de nos nouvelles recettes en vidéo.',
    subscribeBtn: "S'abonner",
  },
  en: {
    ourChannel: 'Our Channel',
    latestVideos: 'Our Videos',
    allVideos: 'All videos',
    watchVideo: 'Watch',
    subscribeTitle: 'Subscribe!',
    subscribeDesc: 'Join our community on YouTube to never miss our new recipe videos.',
    subscribeBtn: 'Subscribe',
  },
};

export function YouTubeSection({ videos, locale = 'fr' }: YouTubeSectionProps) {
  const t = translations[locale];
  const videosBasePath = locale === 'en' ? '/en/videos' : '/videos';
  const videoBasePath = locale === 'en' ? '/en/video' : '/video';

  if (videos.length === 0) return null;

  const [featuredVideo, ...otherVideos] = videos;

  return (
    <section className="py-20 md:py-32 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-red-500 text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
              <Youtube className="w-4 h-4" />
              {t.ourChannel}
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-neutral-900 mt-3">
              {t.latestVideos}
            </h2>
            <div className="w-24 h-1 bg-red-500 mt-6" />
          </div>
          <Link
            href={videosBasePath}
            className="group flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-red-500 transition-colors mt-6 md:mt-0 uppercase tracking-wide"
          >
            {t.allVideos}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Featured Video - Left */}
          <div className="lg:row-span-1">
            <Link
              href={`${videoBasePath}/${locale === 'en' ? featuredVideo.slugEn : featuredVideo.slug}`}
              className="group block h-full"
            >
              <article className="relative h-full min-h-[300px] lg:min-h-[400px] overflow-hidden bg-neutral-200 rounded-2xl">
                {/* Thumbnail */}
                <div className="absolute inset-0">
                  <Image
                    src={featuredVideo.thumbnail}
                    alt={locale === 'en' ? featuredVideo.titleEn : featuredVideo.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                  {featuredVideo.duration}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-display text-white leading-tight mb-3 group-hover:text-red-400 transition-colors duration-300">
                    {locale === 'en' ? featuredVideo.titleEn : featuredVideo.title}
                  </h3>
                  <p className="text-white/70 line-clamp-2 text-sm md:text-base">
                    {locale === 'en' ? featuredVideo.descriptionEn : featuredVideo.description}
                  </p>
                </div>
              </article>
            </Link>
          </div>

          {/* Other Videos + Subscribe CTA - Right */}
          <div className="flex flex-col gap-4">
            {otherVideos.slice(0, 2).map((video) => (
              <Link
                key={video.id}
                href={`${videoBasePath}/${locale === 'en' ? video.slugEn : video.slug}`}
                className="group block"
              >
                <article className="flex gap-4 bg-white p-4 rounded-xl border border-neutral-200 hover:border-red-500/50 hover:bg-neutral-50 shadow-sm transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="relative w-32 md:w-40 aspect-video flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={video.thumbnail}
                      alt={locale === 'en' ? video.titleEn : video.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="160px"
                    />
                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                    {/* Duration */}
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="font-display text-lg md:text-xl text-neutral-900 leading-tight mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
                      {locale === 'en' ? video.titleEn : video.title}
                    </h3>
                    <p className="text-neutral-500 text-sm line-clamp-2 hidden md:block">
                      {locale === 'en' ? video.descriptionEn : video.description}
                    </p>
                  </div>
                </article>
              </Link>
            ))}

            {/* Subscribe CTA */}
            <a
              href={YOUTUBE_CHANNEL.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700 p-5 md:p-6 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 mt-auto"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl md:text-2xl text-white">
                    {t.subscribeTitle}
                  </h3>
                  <p className="text-white/70 text-sm mt-0.5 hidden md:block max-w-xs">
                    {t.subscribeDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white font-medium">
                <span className="hidden sm:inline uppercase tracking-wide text-sm">{t.subscribeBtn}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
