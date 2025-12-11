'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
    email: string;
  };
}

interface RecipeCommentsProps {
  recipeId: number;
}

export default function RecipeComments({ recipeId }: RecipeCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadComments();
    checkUser();
  }, [recipeId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user ? { id: user.id, email: user.email || '' } : null);
  };

  const loadComments = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles (
          display_name,
          avatar_url,
          email
        )
      `)
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false });

    setComments((data || []) as unknown as Comment[]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from('comments')
      .insert({
        recipe_id: recipeId,
        user_id: user.id,
        content: newComment.trim(),
      });

    if (!error) {
      setNewComment('');
      await loadComments();
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Supprimer ce commentaire?')) return;

    await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    await loadComments();
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <h3 className="font-display text-xl mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[#F77313]" />
        Commentaires ({comments.length})
      </h3>

      {/* Formulaire de commentaire */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F77313] flex items-center justify-center text-white font-bold flex-shrink-0">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Partagez votre avis sur cette recette..."
                rows={3}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F77313] resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F77313] text-white rounded-lg hover:bg-[#e56610] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Envoi...' : 'Publier'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-neutral-50 rounded-xl text-center">
          <p className="text-neutral-600 mb-2">Connectez-vous pour laisser un commentaire</p>
          <Link
            href={`/login?redirectTo=/recette/${recipeId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F77313] text-white rounded-lg hover:bg-[#e56610] transition-colors"
          >
            Se connecter
          </Link>
        </div>
      )}

      {/* Liste des commentaires */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-[#F77313] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-neutral-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>Aucun commentaire pour le moment</p>
          <p className="text-sm">Soyez le premier à donner votre avis!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {comment.profiles?.avatar_url ? (
                <Image
                  src={comment.profiles.avatar_url}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-neutral-400" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-neutral-900">
                    {comment.profiles?.display_name || comment.profiles?.email?.split('@')[0] || 'Utilisateur'}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(comment.created_at).toLocaleDateString('fr-CA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  {user?.id === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="ml-auto text-neutral-400 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-neutral-600">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
