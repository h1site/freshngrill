'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types/recipe';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface Props {
  categories: Category[];
}

export default function RecipeFilters({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('categorie') || ''
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    searchParams.get('difficulte') || ''
  );
  const [maxTime, setMaxTime] = useState(searchParams.get('temps') || '');
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (selectedCategory) params.set('categorie', selectedCategory);
    if (selectedDifficulty) params.set('difficulte', selectedDifficulty);
    if (maxTime) params.set('temps', maxTime);

    router.push(`/recette?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setMaxTime('');
    router.push('/recette');
  };

  const hasActiveFilters =
    search || selectedCategory || selectedDifficulty || maxTime;

  return (
    <div className="mb-10">
      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Rechercher une recette..."
            className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#F77313] text-sm"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3.5 font-medium text-sm uppercase tracking-wide transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-[#F77313] text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-white" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-neutral-50 border border-neutral-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                    Difficulté
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent"
                  >
                    <option value="">Toutes</option>
                    <option value="facile">Facile</option>
                    <option value="moyen">Moyen</option>
                    <option value="difficile">Difficile</option>
                  </select>
                </div>

                {/* Max Time */}
                <div>
                  <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                    Temps maximum
                  </label>
                  <select
                    value={maxTime}
                    onChange={(e) => setMaxTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent"
                  >
                    <option value="">Peu importe</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="120">2 heures</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-neutral-200">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-black text-sm"
                  >
                    <X className="w-4 h-4" />
                    Effacer
                  </button>
                )}
                <button
                  onClick={applyFilters}
                  className="bg-black hover:bg-neutral-800 text-white font-medium text-sm uppercase tracking-wide px-6 py-2.5 transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
