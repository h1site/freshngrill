'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, Trash2, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  recipeId: number;
  recipeSlug: string;
  recipeTitle: string;
  recipeFeaturedImage: string | null;
}

interface CommentsListProps {
  initialComments: Comment[];
}

export default function CommentsList({ initialComments }: CommentsListProps) {
  const [comments, setComments] = useState(initialComments);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const supabase = createClient();

  const handleDelete = async (commentId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire?')) {
      return;
    }

    setDeletingId(commentId);

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Erreur lors de la suppression du commentaire');
    } finally {
      setDeletingId(null);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
        <h2 className="text-xl font-medium text-neutral-600 mb-2">Aucun commentaire</h2>
        <p className="text-neutral-400 mb-6">
          Partagez votre avis sur les recettes que vous avez essayées!
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
        {comments.length} commentaire{comments.length !== 1 ? 's' : ''}
      </p>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="flex items-start gap-4 p-4">
              {/* Recipe image */}
              <Link href={`/recette/${comment.recipeSlug}`} className="flex-shrink-0">
                {comment.recipeFeaturedImage ? (
                  <Image
                    src={comment.recipeFeaturedImage}
                    alt={comment.recipeTitle}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-neutral-300" />
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/recette/${comment.recipeSlug}`}
                      className="font-medium text-neutral-900 hover:text-[#F77313] transition-colors flex items-center gap-2"
                    >
                      {comment.recipeTitle}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <p className="text-xs text-neutral-400 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString('fr-CA', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Supprimer le commentaire"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-neutral-600 mt-3 text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
