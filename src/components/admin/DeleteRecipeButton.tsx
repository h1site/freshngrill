'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function DeleteRecipeButton({
  recipeId,
  recipeTitle,
}: {
  recipeId: number;
  recipeTitle: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${recipeTitle}"?`)) {
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // Supprimer les liens recipe_ingredients d'abord
      await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeId);

      // Supprimer les liens recipe_categories
      await supabase
        .from('recipe_categories')
        .delete()
        .eq('recipe_id', recipeId);

      // Supprimer la recette
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
      title="Supprimer"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    </button>
  );
}
