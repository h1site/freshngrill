'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface Props {
  recipeId: number;
  recipeSlug: string;
  initialRating?: number;
  initialCount?: number;
  locale?: 'fr' | 'en';
}

export default function RecipeRating({
  recipeId,
  recipeSlug,
  initialRating = 0,
  initialCount = 0,
  locale = 'fr',
}: Props) {
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(initialCount);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storageKey = `recipe-rating-${recipeId}`;

  useEffect(() => {
    // Check if user has already rated
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setUserRating(parseInt(stored, 10));
      setHasRated(true);
    }

    // Fetch current rating from API
    fetchRating();
  }, [recipeId]);

  const fetchRating = async () => {
    try {
      const res = await fetch(`/api/recipes/${recipeSlug}/rating`);
      if (res.ok) {
        const data = await res.json();
        setRating(data.averageRating || 0);
        setCount(data.ratingCount || 0);
      }
    } catch (error) {
      // Silent fail - use initial values
    }
  };

  const submitRating = async (stars: number) => {
    if (hasRated || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/recipes/${recipeSlug}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: stars }),
      });

      if (res.ok) {
        const data = await res.json();
        setRating(data.averageRating);
        setCount(data.ratingCount);
        setUserRating(stars);
        setHasRated(true);
        localStorage.setItem(storageKey, stars.toString());
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || userRating || Math.round(rating);

  const labels = {
    fr: {
      rateThis: 'Notez cette recette',
      thanks: 'Merci pour votre note!',
      ratings: 'avis',
      rating: 'avis',
    },
    en: {
      rateThis: 'Rate this recipe',
      thanks: 'Thanks for your rating!',
      ratings: 'ratings',
      rating: 'rating',
    },
  };

  const t = labels[locale];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={hasRated || isSubmitting}
            onClick={() => submitRating(star)}
            onMouseEnter={() => !hasRated && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`transition-transform ${
              hasRated ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
          >
            <Star
              className={`w-7 h-7 ${
                star <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-neutral-300'
              }`}
            />
          </button>
        ))}
      </div>

      <div className="text-sm text-neutral-600">
        {hasRated ? (
          <span className="text-green-600 font-medium">{t.thanks}</span>
        ) : (
          <span>{t.rateThis}</span>
        )}
      </div>

      {count > 0 && (
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <span>/5</span>
          <span className="mx-1">•</span>
          <span>
            {count} {count === 1 ? t.rating : t.ratings}
          </span>
        </div>
      )}
    </div>
  );
}
