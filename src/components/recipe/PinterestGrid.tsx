'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Flame } from 'lucide-react';

interface RecipePin {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  pinterest_image: string | null;
  total_time: number;
  difficulty: string;
  tags: string[] | null;
}

interface PinterestGridProps {
  recipes: RecipePin[];
}

const difficultyColor: Record<string, string> = {
  easy: 'bg-[#00bf63]',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
};

const difficultyLabel: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export default function PinterestGrid({ recipes }: PinterestGridProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (recipes.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <Flame className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg">No recipes yet. Fire up the grill!</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
      {recipes.map((recipe, index) => {
        const image = recipe.pinterest_image || recipe.featured_image;
        const isHovered = hoveredId === recipe.id;

        return (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="break-inside-avoid mb-5"
          >
            <Link
              href={`/recipe/${recipe.slug}`}
              className="group block rounded-2xl overflow-hidden bg-neutral-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
              onMouseEnter={() => setHoveredId(recipe.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              {image && (
                <div className="relative overflow-hidden">
                  <Image
                    src={image}
                    alt={recipe.title}
                    width={600}
                    height={recipe.pinterest_image ? 900 : 400}
                    className={`w-full h-auto object-cover transition-transform duration-500 ${
                      isHovered ? 'scale-105' : 'scale-100'
                    }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />

                  {/* Overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Difficulty badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${
                      difficultyColor[recipe.difficulty] || 'bg-neutral-700'
                    }`}
                  >
                    {difficultyLabel[recipe.difficulty] || recipe.difficulty}
                  </span>

                  {/* Time badge */}
                  {recipe.total_time > 0 && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white bg-black/60 backdrop-blur-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.total_time} min
                    </span>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-[#00bf63] transition-colors line-clamp-2 min-h-[2.75rem]">
                  {recipe.title}
                </h3>
                {recipe.excerpt && (
                  <p className="text-neutral-500 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                    {recipe.excerpt}
                  </p>
                )}

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-200/80 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
