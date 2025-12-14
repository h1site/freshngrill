'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import FavoriteCard from './FavoriteCard';

interface FavoriteRecipe {
  recipeId: number;
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  prepTime: number | null;
  cookTime: number | null;
  difficulty: string | null;
  createdAt: string;
  note: string | null;
}

interface FavoritesListProps {
  initialFavorites: FavoriteRecipe[];
}

export default function FavoritesList({ initialFavorites }: FavoritesListProps) {
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleRemove = (recipeId: number) => {
    setFavorites((prev) => prev.filter((f) => f.recipeId !== recipeId));
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
        <h2 className="text-xl font-medium text-neutral-600 mb-2">Aucune recette favorite</h2>
        <p className="text-neutral-400 mb-6">
          Explorez nos recettes et cliquez sur le coeur pour les ajouter à vos favoris!
        </p>
        <Link
          href="/recette"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#F77313] text-white rounded-lg hover:bg-[#e56610] transition-colors"
        >
          Découvrir les recettes
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-neutral-500 mb-6">
        {favorites.length} recette{favorites.length !== 1 ? 's' : ''} dans vos favoris
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.recipeId}
            recipeId={favorite.recipeId}
            slug={favorite.slug}
            title={favorite.title}
            excerpt={favorite.excerpt}
            featuredImage={favorite.featuredImage}
            prepTime={favorite.prepTime}
            cookTime={favorite.cookTime}
            difficulty={favorite.difficulty}
            createdAt={favorite.createdAt}
            note={favorite.note}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </>
  );
}
