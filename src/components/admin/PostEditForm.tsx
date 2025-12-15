'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import ImageUpload from './ImageUpload';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  pinterest_image?: string | null;
  status: string;
  author_id: number | null;
  reading_time: number | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: string[] | null;
}

interface TranslationData {
  id?: number;
  slug_en: string;
  title: string;
  excerpt: string;
  content: string;
  faq: string;
  seo_title: string;
  seo_description: string;
}

export default function PostEditForm({
  post,
  categories,
  isNew = false,
}: {
  post: PostRow;
  categories: Category[];
  isNew?: boolean;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
  const [postId, setPostId] = useState(post.id);

  // Form state - Français (données principales)
  const [form, setForm] = useState({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content || '',
    faq: (post as any).faq || '',
    featured_image: post.featured_image || '',
    pinterest_image: (post as any).pinterest_image || '',
    status: post.status || 'draft',
    reading_time: post.reading_time || 5,
    tags: post.tags || [],
    seo_title: post.seo_title || '',
    seo_description: post.seo_description || '',
  });

  // English translation state
  const [enTranslation, setEnTranslation] = useState<TranslationData>({
    slug_en: '',
    title: '',
    excerpt: '',
    content: '',
    faq: '',
    seo_title: '',
    seo_description: '',
  });
  const [hasEnTranslation, setHasEnTranslation] = useState(false);

  const [tagsInput, setTagsInput] = useState((post.tags || []).join(', '));
  const [loading, setLoading] = useState(false);
  const [loadingTranslation, setLoadingTranslation] = useState(!isNew);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Charger la traduction anglaise (seulement si pas nouveau)
  useEffect(() => {
    if (isNew) {
      setLoadingTranslation(false);
      return;
    }

    async function loadTranslation() {
      const supabase = createClient();
      const { data } = await supabase
        .from('post_translations')
        .select('*')
        .eq('post_id', post.id)
        .eq('locale', 'en')
        .single();

      if (data) {
        const translationData = data as any;
        setHasEnTranslation(true);
        setEnTranslation({
          id: translationData.id,
          slug_en: translationData.slug_en || '',
          title: translationData.title || '',
          excerpt: translationData.excerpt || '',
          content: translationData.content || '',
          faq: translationData.faq || '',
          seo_title: translationData.seo_title || '',
          seo_description: translationData.seo_description || '',
        });
      }
      setLoadingTranslation(false);
    }
    loadTranslation();
  }, [post.id]);

  // Générer un slug à partir du titre
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Copier FR vers EN
  const copyFrToEn = () => {
    setEnTranslation({
      ...enTranslation,
      slug_en: generateSlug(form.title),
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      faq: form.faq,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();

      // Parse tags
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const postData = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content || null,
        faq: form.faq || null,
        featured_image: form.featured_image || null,
        pinterest_image: form.pinterest_image || null,
        status: form.status,
        reading_time: form.reading_time,
        tags,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        updated_at: new Date().toISOString(),
      };

      let currentPostId = postId;

      if (isNew) {
        // Create new post
        const { data: newPost, error: insertError } = await supabase
          .from('posts')
          .insert({
            ...postData,
            created_at: new Date().toISOString(),
            published_at: form.status === 'publish' ? new Date().toISOString() : null,
          } as any)
          .select('id')
          .single();

        if (insertError) throw insertError;
        currentPostId = (newPost as any).id;
        setPostId(currentPostId);
      } else {
        // Update existing post
        const { error: updateError } = await supabase
          .from('posts')
          // @ts-ignore Supabase types not defined for posts table
          .update(postData)
          .eq('id', postId);

        if (updateError) throw updateError;
      }

      // Sauvegarder/mettre à jour la traduction anglaise si titre rempli
      if (enTranslation.title.trim() && currentPostId) {
        const translationData = {
          post_id: currentPostId,
          locale: 'en',
          slug_en: enTranslation.slug_en || null,
          title: enTranslation.title,
          excerpt: enTranslation.excerpt || null,
          content: enTranslation.content || null,
          faq: enTranslation.faq || null,
          seo_title: enTranslation.seo_title || null,
          seo_description: enTranslation.seo_description || null,
          translated_at: new Date().toISOString(),
        };

        if (hasEnTranslation && enTranslation.id) {
          await supabase
            .from('post_translations')
            .update(translationData as never)
            .eq('id', enTranslation.id);
        } else {
          await supabase
            .from('post_translations')
            .insert(translationData as never);
          setHasEnTranslation(true);
        }
      }

      if (isNew) {
        setSuccess('Article créé!');
        router.push(`/admin/blog/${currentPostId}`);
      } else {
        setSuccess('Article mis à jour!');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Tabs FR/EN */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('fr')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'fr'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Français
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('en')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'en'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          English {hasEnTranslation && '✓'}
        </button>
      </div>

      {loadingTranslation ? (
        <div className="text-center py-8">Chargement...</div>
      ) : activeTab === 'fr' ? (
        <>
          {/* FRANÇAIS - Informations de base */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Informations de base</h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">/blog/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extrait</label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Court résumé de l'article..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea
                  rows={15}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="Contenu de l'article (HTML supporté)..."
                />
              </div>
            </div>
          </section>

          {/* FAQ - Rich Snippets */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">FAQ (Rich Snippets)</h2>
            <p className="text-sm text-gray-500 mb-4">
              Format JSON pour les rich snippets Google. Ex: [{`{"question": "...", "answer": "..."}`}]
            </p>
            <textarea
              rows={8}
              value={form.faq}
              onChange={(e) => setForm({ ...form, faq: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              placeholder='[{"question": "Question 1?", "answer": "Réponse 1"}, {"question": "Question 2?", "answer": "Réponse 2"}]'
            />
          </section>

          {/* Images */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Images</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image principale</label>
                <ImageUpload
                  value={form.featured_image}
                  onChange={(url: string) => setForm({ ...form, featured_image: url })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Pinterest
                  <span className="text-gray-400 font-normal ml-2">(Verticale 2:3, ex: 1000×1500px)</span>
                </label>
                <ImageUpload
                  value={form.pinterest_image}
                  onChange={(url: string) => setForm({ ...form, pinterest_image: url })}
                />
              </div>
            </div>
          </section>

          {/* Paramètres */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Paramètres</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">Brouillon</option>
                  <option value="pending">En attente</option>
                  <option value="publish">Publié</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temps de lecture (min)</label>
                <input
                  type="number"
                  min="1"
                  value={form.reading_time}
                  onChange={(e) => setForm({ ...form, reading_time: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </section>

          {/* SEO FR */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">SEO (Français)</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre SEO</label>
                <input
                  type="text"
                  value={form.seo_title}
                  onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                  placeholder={form.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">{form.seo_title.length || form.title.length}/60 caractères</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description SEO</label>
                <textarea
                  rows={2}
                  value={form.seo_description}
                  onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                  placeholder={form.excerpt}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">{form.seo_description.length || form.excerpt.length}/160 caractères</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* ENGLISH Tab */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">English Translation</h2>
              <button
                type="button"
                onClick={copyFrToEn}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Copier FR → EN
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Slug</label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">/en/blog/</span>
                  <input
                    type="text"
                    value={enTranslation.slug_en}
                    onChange={(e) => setEnTranslation({ ...enTranslation, slug_en: e.target.value })}
                    placeholder="english-slug"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={enTranslation.title}
                  onChange={(e) => setEnTranslation({ ...enTranslation, title: e.target.value })}
                  placeholder="English title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  rows={3}
                  value={enTranslation.excerpt}
                  onChange={(e) => setEnTranslation({ ...enTranslation, excerpt: e.target.value })}
                  placeholder="Short summary..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows={15}
                  value={enTranslation.content}
                  onChange={(e) => setEnTranslation({ ...enTranslation, content: e.target.value })}
                  placeholder="English content (HTML supported)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FAQ (Rich Snippets)</label>
                <textarea
                  rows={6}
                  value={enTranslation.faq}
                  onChange={(e) => setEnTranslation({ ...enTranslation, faq: e.target.value })}
                  placeholder='[{"question": "Question 1?", "answer": "Answer 1"}]'
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                />
              </div>
            </div>
          </section>

          {/* SEO EN */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">SEO (English)</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={enTranslation.seo_title}
                  onChange={(e) => setEnTranslation({ ...enTranslation, seo_title: e.target.value })}
                  placeholder={enTranslation.title || 'English SEO title...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">{enTranslation.seo_title.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <textarea
                  rows={2}
                  value={enTranslation.seo_description}
                  onChange={(e) => setEnTranslation({ ...enTranslation, seo_description: e.target.value })}
                  placeholder={enTranslation.excerpt || 'English meta description...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">{enTranslation.seo_description.length}/160 characters</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
