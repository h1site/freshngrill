'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteCategoryButton({ categoryId, categoryName }: { categoryId: number; categoryName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Supprimer la catégorie "${categoryName}" ? Les recettes ne seront pas supprimées, seulement le lien avec cette catégorie.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Suppression...' : 'Supprimer la catégorie'}
    </button>
  );
}
