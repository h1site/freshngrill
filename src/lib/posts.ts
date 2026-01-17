import { supabase } from './supabase';
import { Post, PostCard, PostCategory, Author } from '@/types/post';

// Avatar par défaut pour tous les auteurs
const DEFAULT_AVATAR = '/images/auteurs/seb.jpg';

// Transformer l'auteur avec avatar
function transformAuthor(author: any): Author {
  if (!author) {
    return {
      id: 0,
      name: 'Menucochon',
      slug: 'menucochon',
      avatar: DEFAULT_AVATAR
    };
  }

  return {
    id: author.id || 0,
    name: author.name || 'Menucochon',
    slug: author.slug || 'menucochon',
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
 * Supports both French slug and English slug (slug_en)
 */
export async function getPostBySlugWithEnglish(slug: string): Promise<Post | null> {
  // First try to find by French slug
  let post = await getPostBySlug(slug);

  // If not found, try to find by English slug
  if (!post) {
    const { data: translation } = await supabase
      .from('post_translations')
      .select('post_id')
      .eq('slug_en', slug)
      .eq('locale', 'en')
      .single();

    if (translation) {
      const postId = (translation as { post_id: number }).post_id;
      const { data: postData } = await supabase
        .from('posts')
        .select(`
          *,
          author:authors(*),
          categories:posts_categories(
            category:post_categories(*)
          )
        `)
        .eq('id', postId)
        .single();

      if (postData) {
        const postDataTyped = postData as any;
        const categories = (postDataTyped.categories || [])
          .map((pc: any) => pc.category)
          .filter(Boolean);
        post = transformPost({ ...postDataTyped, categories });
      }
    }
  }

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
 * Get the English slug for a post (if it exists)
 */
export async function getEnglishSlugForPost(frenchSlug: string): Promise<string | null> {
  const { data: post } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', frenchSlug)
    .single();

  if (!post) return null;

  const postId = (post as { id: number }).id;
  const { data: translation } = await supabase
    .from('post_translations')
    .select('slug_en')
    .eq('post_id', postId)
    .eq('locale', 'en')
    .single();

  if (translation) {
    const slugEn = (translation as { slug_en: string | null }).slug_en;
    return slugEn || null;
  }

  return null;
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

/**
 * Get all posts with their English slugs (for sitemap)
 */
export async function getAllPostsWithEnglishSlugs(): Promise<Array<{ id: number; slug: string; slugEn: string | null; updatedAt: string; categories: PostCategory[] }>> {
  const posts = await getAllPosts();

  if (posts.length === 0) return [];

  const postIds = posts.map(p => p.id);
  const { data: translations } = await supabase
    .from('post_translations')
    .select('post_id, slug_en')
    .eq('locale', 'en')
    .in('post_id', postIds);

  const slugMap = new Map<number, string | null>();
  for (const t of (translations || []) as { post_id: number; slug_en: string | null }[]) {
    slugMap.set(t.post_id, t.slug_en);
  }

  return posts.map(post => ({
    id: post.id,
    slug: post.slug,
    slugEn: slugMap.get(post.id) || null,
    updatedAt: post.updatedAt,
    categories: post.categories,
  }));
}

/**
 * Get related blog posts for a recipe based on shared keywords/categories
 */
export async function getRelatedPostsForRecipe(
  recipeTitle: string,
  recipeCategories: string[],
  limit: number = 3,
  locale: 'fr' | 'en' = 'fr'
): Promise<PostCard[]> {
  // Extract keywords from recipe title
  const keywords = recipeTitle
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 5);

  if (keywords.length === 0 && recipeCategories.length === 0) {
    // Return recent posts as fallback
    return locale === 'en' ? getRecentPostsWithEnglish(limit) : getRecentPosts(limit);
  }

  const { data, error } = await supabase
    .from('posts_with_details')
    .select('id, slug, title, excerpt, featured_image, author, categories, published_at, reading_time, content')
    .order('published_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error getRelatedPostsForRecipe:', error);
    return [];
  }

  // Score each post by relevance
  const scoredPosts: { post: any; score: number }[] = [];

  for (const post of (data || []) as any[]) {
    let score = 0;
    const postTitle = post.title?.toLowerCase() || '';
    const postContent = post.content?.toLowerCase() || '';
    const postExcerpt = post.excerpt?.toLowerCase() || '';
    const postCategories = (post.categories || []).map((c: any) => c.slug?.toLowerCase());

    // Check keyword matches in title (high weight)
    for (const keyword of keywords) {
      if (postTitle.includes(keyword)) score += 3;
      if (postExcerpt.includes(keyword)) score += 2;
      if (postContent.includes(keyword)) score += 1;
    }

    // Check category matches
    for (const cat of recipeCategories) {
      const catLower = cat.toLowerCase();
      if (postCategories.some((pc: string) => pc?.includes(catLower) || catLower.includes(pc))) {
        score += 2;
      }
    }

    if (score > 0) {
      scoredPosts.push({ post, score });
    }
  }

  // Sort by score and take top results
  scoredPosts.sort((a, b) => b.score - a.score);
  const topPosts = scoredPosts.slice(0, limit);

  if (topPosts.length === 0) {
    // Fallback to recent posts
    return locale === 'en' ? getRecentPostsWithEnglish(limit) : getRecentPosts(limit);
  }

  let cards: PostCard[] = topPosts.map(({ post }) => ({
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

  // Enrich with English data if needed
  if (locale === 'en' && cards.length > 0) {
    cards = await enrichPostCardsWithEnglishData(cards);
  }

  return cards;
}
