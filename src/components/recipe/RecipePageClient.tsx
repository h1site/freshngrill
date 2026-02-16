'use client';

import { useState, useMemo } from 'react';
import PinterestGrid, { type RecipePin } from './PinterestGrid';
import { categoryTranslations } from '@/lib/categoryTranslations';

interface Props {
  recipes: RecipePin[];
}

// Categories to exclude (useless on a BBQ site — every recipe is BBQ/grilling)
const BLOCKED_SLUGS = ['bbq', 'grilling', 'grill', 'grille'];

// Parent grouping: child slug prefix → parent display name
// e.g., "chicken-wings" contains "chicken" so it matches the "Chicken" filter
const PARENT_GROUPS: Record<string, string[]> = {
  Chicken: ['chicken', 'poulet', 'volaille', 'ailes'],
  Beef: ['beef', 'boeuf', 'bœuf', 'steak'],
  Pork: ['pork', 'porc'],
  Seafood: ['seafood', 'fruits-de-mer', 'poisson', 'fish'],
};

function translateCategory(name: string): string {
  return categoryTranslations[name] || name;
}

function isBlocked(slug: string): boolean {
  return BLOCKED_SLUGS.some((b) => slug.toLowerCase() === b);
}

export default function RecipePageClient({ recipes }: Props) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Extract unique categories from recipe data, translate, and sort
  const categoryPills = useMemo(() => {
    const catMap = new Map<string, { slug: string; name: string; count: number }>();

    for (const recipe of recipes) {
      for (const cat of recipe.categories || []) {
        if (isBlocked(cat.slug)) continue;
        if (!catMap.has(cat.slug)) {
          catMap.set(cat.slug, {
            slug: cat.slug,
            name: translateCategory(cat.name),
            count: 0,
          });
        }
        catMap.get(cat.slug)!.count++;
      }
    }

    // Sort by count descending, then alphabetically
    return Array.from(catMap.values())
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [recipes]);

  // Filter recipes by selected category
  const filteredRecipes = useMemo(() => {
    if (!activeFilter) return recipes;

    const selectedSlug = activeFilter;

    // Find which parent group this slug belongs to (if any)
    let matchSlugs: string[] = [selectedSlug];
    for (const [, groupSlugs] of Object.entries(PARENT_GROUPS)) {
      if (groupSlugs.some((g) => selectedSlug.toLowerCase().includes(g))) {
        // This category is part of a group — find all category slugs that also match
        matchSlugs = categoryPills
          .filter((cat) =>
            groupSlugs.some((g) => cat.slug.toLowerCase().includes(g))
          )
          .map((cat) => cat.slug);
        break;
      }
    }

    return recipes.filter((recipe) =>
      (recipe.categories || []).some((cat) => matchSlugs.includes(cat.slug))
    );
  }, [recipes, activeFilter, categoryPills]);

  return (
    <div>
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeFilter === null
              ? 'bg-[#00bf63] text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          All
        </button>
        {categoryPills.map((cat) => (
          <button
            key={cat.slug}
            onClick={() =>
              setActiveFilter(activeFilter === cat.slug ? null : cat.slug)
            }
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeFilter === cat.slug
                ? 'bg-[#00bf63] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <PinterestGrid recipes={filteredRecipes} />
    </div>
  );
}
