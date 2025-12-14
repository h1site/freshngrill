'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Clock,
  ChefHat,
  MoreVertical,
  Trash2,
  Link2,
  MessageSquare,
  Check,
  X,
  Loader2,
} from 'lucide-react';

interface FavoriteCardProps {
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
  onRemove: (recipeId: number) => void;
}

export default function FavoriteCard({
  recipeId,
  slug,
  title,
  excerpt,
  featuredImage,
  prepTime,
  cookTime,
  difficulty,
  createdAt,
  note: initialNote,
  onRemove,
}: FavoriteCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [note, setNote] = useState(initialNote || '');
  const [savedNote, setSavedNote] = useState(initialNote || '');
  const [copied, setCopied] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const recipeUrl = `https://menucochon.com/recette/${slug}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(recipeUrl);
    setCopied(true);
    setShowMenu(false);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemove = async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });

      if (response.ok) {
        onRemove(recipeId);
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    } finally {
      setIsRemoving(false);
      setShowMenu(false);
    }
  };

  const handleSaveNote = async () => {
    if (isSavingNote) return;

    setIsSavingNote(true);
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, note: note.trim() }),
      });

      if (response.ok) {
        setSavedNote(note.trim());
        setShowNoteEditor(false);
      }
    } catch (error) {
      console.error('Erreur sauvegarde note:', error);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async () => {
    setNote('');
    setIsSavingNote(true);
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, note: '' }),
      });

      if (response.ok) {
        setSavedNote('');
        setShowNoteEditor(false);
      }
    } catch (error) {
      console.error('Erreur suppression note:', error);
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Menu dropdown */}
      <div className="absolute top-3 left-3 z-20">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <MoreVertical className="w-4 h-4 text-neutral-600" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute top-10 left-0 bg-white rounded-lg shadow-lg py-1 min-w-[180px] z-20">
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Lien copié!
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    Copier le lien
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowNoteEditor(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {savedNote ? 'Modifier la note' : 'Ajouter une note'}
              </button>
              <hr className="my-1" />
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Retirer des favoris
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Coeur favori */}
      <div className="absolute top-3 right-3 z-10">
        <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
        </div>
      </div>

      {/* Lien vers la recette */}
      <Link href={`/recette/${slug}`}>
        <div className="relative aspect-[4/3]">
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-neutral-300" />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/recette/${slug}`}>
          <h3 className="font-medium text-neutral-900 group-hover:text-[#F77313] transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        {excerpt && <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{excerpt}</p>}
        <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
          {(prepTime || cookTime) && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {(prepTime || 0) + (cookTime || 0)} min
            </span>
          )}
          {difficulty && <span className="capitalize">{difficulty}</span>}
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          Ajouté le {new Date(createdAt).toLocaleDateString('fr-CA')}
        </p>

        {/* Note personnelle affichée */}
        {savedNote && !showNoteEditor && (
          <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-800 flex items-start gap-1">
              <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{savedNote}</span>
            </p>
          </div>
        )}

        {/* Éditeur de note */}
        {showNoteEditor && (
          <div className="mt-3 space-y-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ajouter une note personnelle..."
              className="w-full p-2 text-sm border border-neutral-200 rounded-lg resize-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent"
              rows={3}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="flex-1 py-1.5 px-3 bg-[#F77313] text-white text-sm rounded-lg hover:bg-[#e56610] transition-colors flex items-center justify-center gap-1"
              >
                {isSavingNote ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Sauvegarder
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setNote(savedNote);
                  setShowNoteEditor(false);
                }}
                className="py-1.5 px-3 bg-neutral-100 text-neutral-600 text-sm rounded-lg hover:bg-neutral-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {savedNote && (
                <button
                  onClick={handleDeleteNote}
                  disabled={isSavingNote}
                  className="py-1.5 px-3 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast copié */}
      {copied && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1.5 rounded-full">
          Lien copié!
        </div>
      )}
    </div>
  );
}
