'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  recipeId: number;
  initialCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function LikeButton({
  recipeId,
  initialCount = 0,
  size = 'md',
  showCount = true,
}: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  // Vérifier si l'utilisateur a déjà liké au chargement
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`/api/recipes/like?recipeId=${recipeId}`);
        const data = await response.json();
        setLiked(data.liked);
        setCount(data.count);
      } catch (error) {
        console.error('Erreur vérification like:', error);
      }
    };

    checkLikeStatus();
  }, [recipeId]);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);

    // Animation optimiste
    const wasLiked = liked;
    setLiked(!liked);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    if (!wasLiked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }

    try {
      const response = await fetch('/api/recipes/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });

      const data = await response.json();

      if (response.ok) {
        setLiked(data.liked);
        setCount(data.count);
      } else {
        // Rollback en cas d'erreur
        setLiked(wasLiked);
        setCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      // Rollback en cas d'erreur
      setLiked(wasLiked);
      setCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      console.error('Erreur like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      {/* Animation coeur qui monte */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleLike}
        disabled={isLoading}
        whileTap={{ scale: 0.9 }}
        className={`
          ${sizeClasses[size]}
          rounded-full
          transition-all
          ${liked
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-white/90 text-neutral-600 hover:bg-white hover:text-red-500'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          shadow-lg backdrop-blur-sm
        `}
        title={liked ? 'Retirer le like' : 'Aimer cette recette'}
      >
        <motion.div
          animate={liked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`${iconSizes[size]} ${liked ? 'fill-current' : ''}`}
          />
        </motion.div>
      </motion.button>

      {showCount && (
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            font-medium
            ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}
            ${liked ? 'text-red-500' : 'text-neutral-600'}
          `}
        >
          {count}
        </motion.span>
      )}
    </div>
  );
}
