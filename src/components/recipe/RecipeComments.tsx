'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
    email: string;
  } | null;
}

interface RecipeCommentsProps {
  recipeId: number;
  slug: string;
  locale?: Locale;
}

export default function RecipeComments({ recipeId, slug, locale = 'fr' }: RecipeCommentsProps) {
  const isEN = locale === 'en';
  const t = {
    comments: isEN ? 'Comments' : 'Commentaires',
    placeholder: isEN ? 'Share your thoughts on this recipe...' : 'Partagez votre avis sur cette recette...',
    sending: isEN ? 'Sending...' : 'Envoi...',
    publish: isEN ? 'Post' : 'Publier',
    loginPrompt: isEN ? 'Log in to leave a comment' : 'Connectez-vous pour laisser un commentaire',
    login: isEN ? 'Log in' : 'Se connecter',
    noComments: isEN ? 'No comments yet' : 'Aucun commentaire pour le moment',
    beFirst: isEN ? 'Be the first to share your thoughts!' : 'Soyez le premier à donner votre avis!',
    deleteConfirm: isEN ? 'Delete this comment?' : 'Supprimer ce commentaire?',
    delete: isEN ? 'Delete' : 'Supprimer',
    user: isEN ? 'User' : 'Utilisateur',
    banned: isEN ? 'Your account has been suspended and you cannot post comments.' : 'Votre compte a été suspendu et vous ne pouvez pas publier de commentaires.',
  };
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; isBanned?: boolean } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadComments();
    checkUser();
  }, [recipeId]);

  const checkUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      setUser(null);
      return;
    }

    // Check if user is banned
    const { data: profile } = await supabase
      .from('profiles' as never)
      .select('is_banned')
      .eq('id', authUser.id)
      .single() as unknown as { data: { is_banned: boolean } | null };

    setUser({
      id: authUser.id,
      email: authUser.email || '',
      isBanned: profile?.is_banned || false,
    });
  };

  const loadComments = async () => {
    setIsLoading(true);

    // Get comments first
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments' as never)
      .select('id, content, created_at, user_id')
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false }) as unknown as {
        data: { id: number; content: string; created_at: string; user_id: string }[] | null;
        error: { message: string } | null;
      };

    if (commentsError) {
      console.error('Error loading comments:', commentsError);
      setComments([]);
      setIsLoading(false);
      return;
    }

    if (!commentsData || commentsData.length === 0) {
      setComments([]);
      setIsLoading(false);
      return;
    }

    // Get unique user IDs
    const userIds = [...new Set(commentsData.map(c => c.user_id))];

    // Fetch profiles for those users
    const { data: profilesData } = await supabase
      .from('profiles' as never)
      .select('id, display_name, avatar_url, email')
      .in('id', userIds) as unknown as {
        data: { id: string; display_name: string | null; avatar_url: string | null; email: string }[] | null;
      };

    // Create a map of profiles by user_id
    const profilesMap = new Map(
      (profilesData || []).map(p => [p.id, p])
    );

    // Merge comments with profiles
    const commentsWithProfiles = commentsData.map(comment => ({
      ...comment,
      profiles: profilesMap.get(comment.user_id) || null
    }));

    setComments(commentsWithProfiles as unknown as Comment[]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from('comments')
      .insert({
        recipe_id: recipeId,
        user_id: user.id,
        content: newComment.trim(),
      } as never)
      .select();

    if (error) {
      console.error('Error inserting comment:', error);
      alert(locale === 'en' ? 'Error posting comment. Please try again.' : 'Erreur lors de la publication. Veuillez réessayer.');
    } else {
      console.log('Comment inserted:', data);
      setNewComment('');
      await loadComments();
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm(t.deleteConfirm)) return;

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
        {t.comments} ({comments.length})
      </h3>

      {/* Formulaire de commentaire */}
      {user ? (
        user.isBanned ? (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-600">{t.banned}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F77313] flex items-center justify-center text-white font-bold flex-shrink-0">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t.placeholder}
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
                    {isSubmitting ? t.sending : t.publish}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )
      ) : (
        <div className="mb-8 p-4 bg-neutral-50 rounded-xl text-center">
          <p className="text-neutral-600 mb-2">{t.loginPrompt}</p>
          <Link
            href={`/login?redirectTo=${encodeURIComponent(`${isEN ? '/en/recipe' : '/recette'}/${slug}/`)}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F77313] text-white rounded-lg hover:bg-[#e56610] transition-colors"
          >
            {t.login}
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
          <p>{t.noComments}</p>
          <p className="text-sm">{t.beFirst}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {comment.profiles?.avatar_url ? (
                <Image
                  src={comment.profiles.avatar_url}
                  alt={`Avatar de ${comment.profiles?.display_name || 'utilisateur'}`}
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
                    {comment.profiles?.display_name || comment.profiles?.email?.split('@')[0] || t.user}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(comment.created_at).toLocaleDateString(isEN ? 'en-CA' : 'fr-CA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  {user?.id === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="ml-auto text-neutral-400 hover:text-red-500 transition-colors"
                      title={t.delete}
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
