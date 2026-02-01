'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface RecipeVideoProps {
  videoUrl: string;
  title: string;
  locale?: 'fr' | 'en';
}

/**
 * Extracts YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * RecipeVideo component - Displays YouTube video with optimized parameters
 * to keep users on the site (no external recommendations)
 */
export default function RecipeVideo({ videoUrl, title, locale = 'fr' }: RecipeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractYouTubeId(videoUrl);

  if (!videoId) return null;

  // YouTube embed parameters to keep users on site:
  // - youtube-nocookie.com: Privacy-enhanced mode, better iframe compatibility
  // - rel=0: Only show videos from the same channel (not random suggestions)
  // - modestbranding=1: Reduce YouTube logo
  // - autoplay=1: Start playing when clicked (only works after user interaction)
  // - playsinline=1: Play inline on mobile
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&playsinline=1`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const labels = {
    fr: {
      title: 'Vidéo de la recette',
      subtitle: 'Regardez comment préparer cette recette étape par étape',
      play: 'Regarder la vidéo',
    },
    en: {
      title: 'Recipe Video',
      subtitle: 'Watch how to prepare this recipe step by step',
      play: 'Watch video',
    },
  };

  const t = labels[locale];

  return (
    <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-xl print:hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
          <div>
            <h2 className="font-display text-xl text-white">{t.title}</h2>
            <p className="text-white/50 text-sm mt-0.5">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Video container */}
      <div className="relative aspect-video bg-black">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={title}
          />
        ) : (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={t.play}
          >
            {/* Thumbnail with fallback */}
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackThumbnail;
              }}
              unoptimized
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 group-hover:from-black/70 transition-all duration-300" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </div>
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white font-medium text-lg drop-shadow-lg line-clamp-2">
                {title}
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
