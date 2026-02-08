'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

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
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const isEN = locale === 'en';

  const t = isEN ? {
    rateThis: 'Rate this recipe',
    thanks: 'Thanks for your rating!',
    ratings: 'ratings',
    rating: 'rating',
    loginPrompt: 'Log in to rate this recipe',
    login: 'Log in',
  } : {
    rateThis: 'Notez cette recette',
    thanks: 'Merci pour votre note!',
    ratings: 'avis',
    rating: 'avis',
    loginPrompt: 'Connectez-vous pour noter cette recette',
    login: 'Se connecter',
  };

  useEffect(() => {
    checkUser();
    fetchRating();
  }, [recipeId]);

  const checkUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setUser({ id: authUser.id });
    }
    setIsLoading(false);
  };

  const fetchRating = async () => {
    try {
      const res = await fetch(`/api/recipes/${recipeSlug}/rating`);
      if (res.ok) {
        const data = await res.json();
        setRating(data.averageRating || 0);
        setCount(data.ratingCount || 0);
        if (data.userRating) {
          setUserRating(data.userRating);
          setHasRated(true);
        }
      }
    } catch {
      // Silent fail - use initial values
    }
  };

  // Re-fetch user rating once user is loaded
  useEffect(() => {
    if (user) {
      fetchUserRating();
    }
  }, [user]);

  const fetchUserRating = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/recipes/${recipeSlug}/rating?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.userRating) {
          setUserRating(data.userRating);
          setHasRated(true);
        }
      }
    } catch {
      // Silent fail
    }
  };

  const submitRating = async (stars: number) => {
    if (!user || hasRated || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/recipes/${recipeSlug}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: stars, userId: user.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setRating(data.averageRating);
        setCount(data.ratingCount);
        setUserRating(stars);
        setHasRated(true);
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || userRating || Math.round(rating);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-6 h-6 border-2 border-[#F77313] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {!user ? (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-7 h-7 fill-none text-neutral-300" />
            ))}
          </div>
          <p className="text-neutral-600 mb-2">{t.loginPrompt}</p>
          <Link
            href={`/login?redirectTo=${encodeURIComponent(`${isEN ? '/en/recipe' : '/recette'}/${recipeSlug}/`)}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F77313] text-white rounded-lg hover:bg-[#e56610] transition-colors"
          >
            {t.login}
          </Link>
        </div>
      ) : (
        <>
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
        </>
      )}

      {count > 0 && (
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <span>/5</span>
          <span className="mx-1">&bull;</span>
          <span>
            {count} {count === 1 ? t.rating : t.ratings}
          </span>
        </div>
      )}
    </div>
  );
}
