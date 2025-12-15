'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { MessageSquare, Trash2, Ban, ExternalLink, User, Check } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  recipe_id: number;
  profiles: {
    id: string;
    display_name: string | null;
    email: string;
    is_banned: boolean;
  } | null;
  recipes: {
    id: number;
    title: string;
    slug: string;
  } | null;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'banned'>('all');

  const supabase = createClient();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);

    // Fetch comments with profiles and recipes
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments' as never)
      .select('id, content, created_at, user_id, recipe_id')
      .order('created_at', { ascending: false }) as unknown as {
        data: { id: number; content: string; created_at: string; user_id: string; recipe_id: number }[] | null;
        error: { message: string } | null;
      };

    if (commentsError || !commentsData) {
      console.error('Erreur chargement commentaires:', commentsError);
      setLoading(false);
      return;
    }

    // Get unique user IDs and recipe IDs
    const userIds = [...new Set(commentsData.map(c => c.user_id))];
    const recipeIds = [...new Set(commentsData.map(c => c.recipe_id))];

    // Fetch profiles
    const { data: profilesData } = await supabase
      .from('profiles' as never)
      .select('id, display_name, email, is_banned')
      .in('id', userIds) as unknown as {
        data: { id: string; display_name: string | null; email: string; is_banned: boolean }[] | null;
      };

    // Fetch recipes
    const { data: recipesData } = await supabase
      .from('recipes' as never)
      .select('id, title, slug')
      .in('id', recipeIds) as unknown as {
        data: { id: number; title: string; slug: string }[] | null;
      };

    // Create maps
    const profilesMap = new Map((profilesData || []).map(p => [p.id, p]));
    const recipesMap = new Map((recipesData || []).map(r => [r.id, r]));

    // Merge data
    const commentsWithData = commentsData.map(comment => ({
      ...comment,
      profiles: profilesMap.get(comment.user_id) || null,
      recipes: recipesMap.get(comment.recipe_id) || null,
    }));

    setComments(commentsWithData as Comment[]);
    setLoading(false);
  };

  const deleteComment = async (id: number) => {
    if (!confirm('Supprimer ce commentaire ?')) return;

    const { error } = await supabase
      .from('comments' as never)
      .delete()
      .eq('id', id);

    if (!error) {
      setComments(comments.filter(c => c.id !== id));
    } else {
      alert('Erreur lors de la suppression');
    }
  };

  const toggleBan = async (userId: string, currentBanned: boolean) => {
    const action = currentBanned ? 'débannir' : 'bannir';
    if (!confirm(`Voulez-vous ${action} cet utilisateur ?`)) return;

    const { error } = await supabase
      .from('profiles' as never)
      .update({ is_banned: !currentBanned } as never)
      .eq('id', userId);

    if (!error) {
      setComments(comments.map(c =>
        c.user_id === userId
          ? { ...c, profiles: c.profiles ? { ...c.profiles, is_banned: !currentBanned } : null }
          : c
      ));
    } else {
      alert('Erreur lors de la mise à jour');
    }
  };

  const filteredComments = comments.filter(c => {
    if (filter === 'banned') return c.profiles?.is_banned;
    return true;
  });

  const bannedUsersCount = new Set(
    comments.filter(c => c.profiles?.is_banned).map(c => c.user_id)
  ).size;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Commentaires</h1>
          <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
            {comments.length} total
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tous ({comments.length})
          </button>
          <button
            onClick={() => setFilter('banned')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === 'banned'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Utilisateurs bannis ({bannedUsersCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des commentaires...</p>
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter === 'all' ? 'Aucun commentaire' : 'Aucun utilisateur banni'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`px-6 py-4 ${comment.profiles?.is_banned ? 'bg-red-50' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* User info */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {comment.profiles?.display_name || comment.profiles?.email?.split('@')[0] || 'Utilisateur'}
                        </span>
                        {comment.profiles?.is_banned && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            BANNI
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{comment.profiles?.email}</span>
                    </div>
                  </div>

                  {/* Comment content */}
                  <p className="text-gray-700 mb-3 pl-10">{comment.content}</p>

                  {/* Recipe link and date */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 pl-10">
                    {comment.recipes && (
                      <Link
                        href={`/recette/${comment.recipes.slug}`}
                        target="_blank"
                        className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {comment.recipes.title.length > 40
                          ? comment.recipes.title.substring(0, 40) + '...'
                          : comment.recipes.title
                        }
                      </Link>
                    )}
                    <span>
                      {new Date(comment.created_at).toLocaleDateString('fr-CA', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => comment.profiles && toggleBan(comment.user_id, comment.profiles.is_banned)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md ${
                      comment.profiles?.is_banned
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                    title={comment.profiles?.is_banned ? 'Débannir' : 'Bannir'}
                  >
                    {comment.profiles?.is_banned ? (
                      <>
                        <Check className="w-4 h-4" />
                        Débannir
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4" />
                        Bannir
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
