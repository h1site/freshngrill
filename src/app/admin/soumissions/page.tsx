'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { ChefHat, Mail, Clock, Eye, Check, X, Loader2, RefreshCw, Globe, ExternalLink } from 'lucide-react';

interface RecipeSubmission {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
  recipe_name: string;
  description: string;
  ingredients: string;
  instructions: string;
  prep_time: number | null;
  cook_time: number | null;
  servings: string | null;
  category: string | null;
  recipe_image: string | null;
  newsletter_opt_in: boolean;
  member_opt_in: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  admin_notes: string | null;
  locale: string;
  created_at: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  published: 'bg-blue-100 text-blue-800',
};

const statusLabels = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Refusé',
  published: 'Publié',
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<RecipeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<RecipeSubmission | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<number | null>(null);
  const [publishing, setPublishing] = useState<number | null>(null);
  const [publishResult, setPublishResult] = useState<{ success: boolean; message: string; slugFr?: string; slugEn?: string } | null>(null);

  const supabase = createClient();

  const fetchSubmissions = async () => {
    setLoading(true);
    let query = supabase
      .from('recipe_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const updateStatus = async (id: number, status: 'approved' | 'rejected' | 'published') => {
    setUpdating(id);
    const { error } = await supabase
      .from('recipe_submissions' as never)
      .update({
        status,
        reviewed_at: new Date().toISOString(),
      } as never)
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      fetchSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status });
      }
    }
    setUpdating(null);
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  // Publish submission as a real recipe with translations
  const publishRecipe = async (id: number) => {
    setPublishing(id);
    setPublishResult(null);

    try {
      const response = await fetch('/api/admin/submissions/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: id }),
      });

      const data = await response.json();

      if (response.ok) {
        setPublishResult({
          success: true,
          message: data.message,
          slugFr: data.slugFr,
          slugEn: data.slugEn,
        });
        fetchSubmissions();
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, status: 'published' });
        }
      } else {
        setPublishResult({
          success: false,
          message: data.error || 'Erreur lors de la publication',
        });
      }
    } catch (error) {
      setPublishResult({
        success: false,
        message: 'Erreur de connexion au serveur',
      });
    }

    setPublishing(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Soumissions de recettes</h1>
          <p className="text-gray-500 mt-1">
            {pendingCount > 0 ? `${pendingCount} soumission(s) en attente` : 'Aucune soumission en attente'}
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Rafraîchir
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Toutes' },
            { value: 'pending', label: 'En attente' },
            { value: 'approved', label: 'Approuvées' },
            { value: 'rejected', label: 'Refusées' },
            { value: 'published', label: 'Publiées' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Liste des soumissions</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucune soumission trouvée
              </div>
            ) : (
              submissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedSubmission?.id === submission.id ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{submission.recipe_name}</p>
                      <p className="text-sm text-gray-500 truncate">{submission.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(submission.created_at).toLocaleDateString('fr-CA', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${statusColors[submission.status]}`}>
                      {statusLabels[submission.status]}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Submission Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedSubmission ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedSubmission.recipe_name}</h2>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedSubmission.status]}`}>
                    {statusLabels[selectedSubmission.status]}
                  </span>
                </div>
                {selectedSubmission.recipe_image && (
                  <img
                    src={selectedSubmission.recipe_image}
                    alt={selectedSubmission.recipe_name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Informations de l&apos;utilisateur
                </h3>
                <div className="flex items-center gap-4">
                  {selectedSubmission.profile_image ? (
                    <img
                      src={selectedSubmission.profile_image}
                      alt={selectedSubmission.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{selectedSubmission.name}</p>
                    <a href={`mailto:${selectedSubmission.email}`} className="text-sm text-orange-600 hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-sm text-gray-600">
                  {selectedSubmission.newsletter_opt_in && (
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-500" />
                      Newsletter
                    </span>
                  )}
                  {selectedSubmission.member_opt_in && (
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-500" />
                      Compte membre
                    </span>
                  )}
                </div>
              </div>

              {/* Recipe Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                  <p className="text-gray-600">{selectedSubmission.description}</p>
                </div>

                <div className="flex gap-6 text-sm">
                  {selectedSubmission.prep_time && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      Prep: {selectedSubmission.prep_time} min
                    </div>
                  )}
                  {selectedSubmission.cook_time && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      Cuisson: {selectedSubmission.cook_time} min
                    </div>
                  )}
                  {selectedSubmission.servings && (
                    <div className="text-gray-600">
                      Portions: {selectedSubmission.servings}
                    </div>
                  )}
                  {selectedSubmission.category && (
                    <div className="text-gray-600">
                      Catégorie: {selectedSubmission.category}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Ingrédients</h4>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {selectedSubmission.ingredients}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Instructions</h4>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {selectedSubmission.instructions}
                  </pre>
                </div>
              </div>

              {/* Actions */}
              {selectedSubmission.status === 'pending' && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => updateStatus(selectedSubmission.id, 'approved')}
                    disabled={updating === selectedSubmission.id}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updating === selectedSubmission.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Approuver
                  </button>
                  <button
                    onClick={() => updateStatus(selectedSubmission.id, 'rejected')}
                    disabled={updating === selectedSubmission.id}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updating === selectedSubmission.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    Refuser
                  </button>
                </div>
              )}

              {selectedSubmission.status === 'approved' && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Publier avec traduction automatique</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          La recette sera publiée en français et traduite automatiquement en anglais.
                          L&apos;auteur &quot;{selectedSubmission.name}&quot; sera crédité sur la fiche recette.
                        </p>
                      </div>
                    </div>
                  </div>

                  {publishResult && (
                    <div className={`rounded-lg p-4 ${publishResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <p className={`text-sm ${publishResult.success ? 'text-green-800' : 'text-red-800'}`}>
                        {publishResult.message}
                      </p>
                      {publishResult.success && publishResult.slugFr && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            href={`/recette/${publishResult.slugFr}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-900"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Voir en français
                          </Link>
                          <Link
                            href={`/en/recipe/${publishResult.slugEn}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-900"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View in English
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => publishRecipe(selectedSubmission.id)}
                    disabled={publishing === selectedSubmission.id}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {publishing === selectedSubmission.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publication et traduction en cours...
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Publier la recette (FR + EN)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Sélectionnez une soumission pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
