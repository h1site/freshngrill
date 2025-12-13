import { supabase } from './supabase';
import { Post, PostCard, PostCategory, Author } from '@/types/post';

// Avatar par défaut pour tous les auteurs
const DEFAULT_AVATAR = '/images/auteurs/seb.jpg';

// Transformer l'auteur avec avatar
function transformAuthor(author: any): Author {
  if (!author) {
    return {
      id: 0,
      name: 'Menu Cochon',
      slug: 'menu-cochon',
      avatar: DEFAULT_AVATAR
    };
  }

  return {
    id: author.id || 0,
    name: author.name || 'Menu Cochon',
    slug: author.slug || 'menu-cochon',
    avatar: author.avatar || DEFAULT_AVATAR,
    bio: author.bio,
  };
}

// Transformer les données Supabase vers le format Post
function transformPost(data: any): Post {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt || '',
    content: data.content || '',
    featuredImage: data.featured_image,
    author: transformAuthor(data.author),
    categories: data.categories || [],
    tags: data.tags || [],
    publishedAt: data.published_at,
    updatedAt: data.updated_at,
    readingTime: data.reading_time || 5,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
  };
}

/**
 * Obtenir tous les posts
 */
export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts_with_details')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur getAllPosts:', error);
    return [];
  }

  return (data || []).map(transformPost);
}

/**
 * Obtenir un post par son slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts_with_details')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Erreur getPostBySlug:', error);
    return null;
  }

  return data ? transformPost(data) : null;
}

/**
 * Obtenir les cartes de posts (version légère)
 */
export async function getPostCards(): Promise<PostCard[]> {
  const { data, error } = await supabase
    .from('posts_with_details')
    .select('id, slug, title, excerpt, featured_image, author, categories, published_at, reading_time')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur getPostCards:', error);
    return [];
  }

  return (data as any[] || []).map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    featuredImage: post.featured_image,
    author: transformAuthor(post.author),
    categories: post.categories || [],
    publishedAt: post.published_at,
    readingTime: post.reading_time || 5,
  }));
}

/**
 * Obtenir les posts récents
 */
export async function getRecentPosts(limit: number = 5): Promise<PostCard[]> {
  const { data, error } = await supabase
    .from('posts_with_details')
    .select('id, slug, title, excerpt, featured_image, author, categories, published_at, reading_time')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erreur getRecentPosts:', error);
    return [];
  }

  return (data as any[] || []).map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    featuredImage: post.featured_image,
    author: transformAuthor(post.author),
    categories: post.categories || [],
    publishedAt: post.published_at,
    readingTime: post.reading_time || 5,
  }));
}

/**
 * Obtenir les posts par catégorie
 */
export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const { data: category } = await supabase
    .from('post_categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!category) return [];

  const { data: postIds } = await supabase
    .from('posts_categories')
    .select('post_id')
    .eq('category_id', (category as any).id);

  if (!postIds?.length) return [];

  const { data, error } = await supabase
    .from('posts_with_details')
    .select('*')
    .in('id', (postIds as any[]).map(p => p.post_id))
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur getPostsByCategory:', error);
    return [];
  }

  return (data || []).map(transformPost);
}

/**
 * Rechercher des posts
 */
export async function searchPosts(query: string): Promise<Post[]> {
  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('posts_with_details')
    .select('*')
    .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erreur searchPosts:', error);
    return [];
  }

  return (data || []).map(transformPost);
}

/**
 * Obtenir toutes les catégories de posts
 */
export async function getAllPostCategories(): Promise<PostCategory[]> {
  const { data, error } = await supabase
    .from('post_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Erreur getAllPostCategories:', error);
    return [];
  }

  return (data as any[] || []).map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    parent: cat.parent_id ?? undefined,
  }));
}

/**
 * Obtenir tous les slugs de posts (pour generateStaticParams)
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.error('Erreur getAllPostSlugs:', error);
    return [];
  }

  return (data as any[] || []).map((post) => post.slug);
}

/**
 * Obtenir les posts similaires
 */
export async function getSimilarPosts(post: Post, limit: number = 3): Promise<PostCard[]> {
  const categoryIds = post.categories.map((c) => c.id);

  if (categoryIds.length === 0) {
    // Si pas de catégories, retourner les posts récents
    return getRecentPosts(limit);
  }

  const { data: postIds } = await supabase
    .from('posts_categories')
    .select('post_id')
    .in('category_id', categoryIds)
    .neq('post_id', post.id);

  if (!postIds?.length) return getRecentPosts(limit);

  const uniqueIds = [...new Set((postIds as any[]).map(p => p.post_id))].slice(0, limit);

  const { data, error } = await supabase
    .from('posts_with_details')
    .select('id, slug, title, excerpt, featured_image, author, categories, published_at, reading_time')
    .in('id', uniqueIds);

  if (error) {
    console.error('Erreur getSimilarPosts:', error);
    return [];
  }

  return (data as any[] || []).map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    featuredImage: post.featured_image,
    author: transformAuthor(post.author),
    categories: post.categories || [],
    publishedAt: post.published_at,
    readingTime: post.reading_time || 5,
  }));
}

/**
 * Calculer le temps de lecture estimé
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// ============================================
// ENGLISH TRANSLATION SUPPORT
// ============================================

interface PostTranslation {
  post_id: number;
  locale: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface PostCategoryTranslation {
  category_id: number;
  locale: string;
  name: string;
}

/**
 * Get all English translations for posts
 */
async function getPostTranslations(): Promise<Map<number, PostTranslation>> {
  const { data, error } = await supabase
    .from('post_translations')
    .select('*')
    .eq('locale', 'en');

  if (error) {
    console.error('Error fetching post translations:', error);
    return new Map();
  }

  const map = new Map<number, PostTranslation>();
  (data || []).forEach((t: PostTranslation) => {
    map.set(t.post_id, t);
  });
  return map;
}

/**
 * Get all English translations for post categories
 */
async function getPostCategoryTranslations(): Promise<Map<number, string>> {
  const { data, error } = await supabase
    .from('post_category_translations')
    .select('*')
    .eq('locale', 'en');

  if (error) {
    console.error('Error fetching post category translations:', error);
    return new Map();
  }

  const map = new Map<number, string>();
  (data || []).forEach((t: PostCategoryTranslation) => {
    map.set(t.category_id, t.name);
  });
  return map;
}

/**
 * Translate category names using translation map
 */
function translateCategories(categories: PostCategory[], translations: Map<number, string>): PostCategory[] {
  return categories.map(cat => ({
    ...cat,
    name: translations.get(cat.id) || cat.name,
  }));
}

/**
 * Enrich posts with English translation data (including categories)
 */
export async function enrichPostsWithEnglishData(posts: Post[]): Promise<Post[]> {
  const [translations, categoryTranslations] = await Promise.all([
    getPostTranslations(),
    getPostCategoryTranslations(),
  ]);

  return posts.map(post => {
    const translation = translations.get(post.id);
    const translatedCategories = translateCategories(post.categories, categoryTranslations);

    if (translation) {
      return {
        ...post,
        title: translation.title || post.title,
        excerpt: translation.excerpt || post.excerpt,
        content: translation.content || post.content,
        seoTitle: translation.seo_title || post.seoTitle,
        seoDescription: translation.seo_description || post.seoDescription,
        categories: translatedCategories,
      };
    }
    return {
      ...post,
      categories: translatedCategories,
    };
  });
}

/**
 * Enrich post cards with English translation data (including categories)
 */
export async function enrichPostCardsWithEnglishData(posts: PostCard[]): Promise<PostCard[]> {
  const [translations, categoryTranslations] = await Promise.all([
    getPostTranslations(),
    getPostCategoryTranslations(),
  ]);

  return posts.map(post => {
    const translation = translations.get(post.id);
    const translatedCategories = translateCategories(post.categories, categoryTranslations);

    if (translation) {
      return {
        ...post,
        title: translation.title || post.title,
        excerpt: translation.excerpt || post.excerpt,
        categories: translatedCategories,
      };
    }
    return {
      ...post,
      categories: translatedCategories,
    };
  });
}

/**
 * Get a single post with English translation (including categories)
 */
export async function getPostBySlugWithEnglish(slug: string): Promise<Post | null> {
  const post = await getPostBySlug(slug);
  if (!post) return null;

  const [translationResult, categoryTranslations] = await Promise.all([
    supabase
      .from('post_translations')
      .select('*')
      .eq('post_id', post.id)
      .eq('locale', 'en')
      .single(),
    getPostCategoryTranslations(),
  ]);

  const translation = translationResult.data as PostTranslation | null;
  const translatedCategories = translateCategories(post.categories, categoryTranslations);

  if (translation) {
    return {
      ...post,
      title: translation.title || post.title,
      excerpt: translation.excerpt || post.excerpt,
      content: translation.content || post.content,
      seoTitle: translation.seo_title || post.seoTitle,
      seoDescription: translation.seo_description || post.seoDescription,
      categories: translatedCategories,
    };
  }

  return {
    ...post,
    categories: translatedCategories,
  };
}

/**
 * Get recent posts with English translations
 */
export async function getRecentPostsWithEnglish(limit: number = 5): Promise<PostCard[]> {
  const posts = await getRecentPosts(limit);
  return enrichPostCardsWithEnglishData(posts);
}

/**
 * Get post cards with English translations
 */
export async function getPostCardsWithEnglish(): Promise<PostCard[]> {
  const posts = await getPostCards();
  return enrichPostCardsWithEnglishData(posts);
}

/**
 * Get similar posts with English translations
 */
export async function getSimilarPostsWithEnglish(post: Post, limit: number = 3): Promise<PostCard[]> {
  const posts = await getSimilarPosts(post, limit);
  return enrichPostCardsWithEnglishData(posts);
}

/**
 * Get all post categories with English translations
 */
export async function getAllPostCategoriesWithEnglish(): Promise<PostCategory[]> {
  const [categories, translations] = await Promise.all([
    getAllPostCategories(),
    getPostCategoryTranslations(),
  ]);

  return translateCategories(categories, translations);
}
