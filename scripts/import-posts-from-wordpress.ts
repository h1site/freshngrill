/**
 * Script d'import des posts/articles depuis WordPress vers Supabase
 *
 * Usage: npx tsx scripts/import-posts-from-wordpress.ts
 *        npx tsx scripts/import-posts-from-wordpress.ts --skip-images
 *
 * Ce script:
 * 1. Récupère la liste des posts via l'API REST WordPress
 * 2. Télécharge les images et les upload vers Supabase Storage
 * 3. Insère les données dans Supabase (authors, post_categories, posts)
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const WORDPRESS_URL = 'https://menucochon.com';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  date: string;
  modified: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ id: number; slug: string; name: string; taxonomy: string }>>;
    author?: Array<{
      id: number;
      name: string;
      slug: string;
      avatar_urls?: { [key: string]: string };
      description?: string;
    }>;
  };
}

/**
 * Nettoyer le HTML et les entités
 */
function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&hellip;/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculer le temps de lecture
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Récupérer tous les posts via l'API WP
 */
async function fetchAllPosts(): Promise<WPPost[]> {
  const posts: WPPost[] = [];
  let page = 1;
  let hasMore = true;

  console.log('📥 Récupération de la liste des posts...');

  while (hasMore) {
    const url = `${WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed`;
    console.log(`  Page ${page}...`);

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400) break;
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) break;

    posts.push(...data);
    page++;

    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    if (page > totalPages) hasMore = false;
  }

  console.log(`  ✓ ${posts.length} posts trouvés\n`);
  return posts;
}

/**
 * Télécharger et uploader une image vers Supabase Storage
 */
async function uploadImage(imageUrl: string, bucket: string = 'post-images'): Promise<string | null> {
  try {
    if (!imageUrl) return null;

    // Nettoyer l'URL
    const cleanUrl = imageUrl.split('?')[0];
    const urlParts = cleanUrl.split('/');
    let fileName = urlParts[urlParts.length - 1];
    fileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Télécharger
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`    ⚠️ Image non trouvée: ${imageUrl}`);
      return imageUrl;
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Upload vers Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: blob.type || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.warn(`    ⚠️ Erreur upload: ${error.message}`);
      return imageUrl;
    }

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  } catch (error) {
    return imageUrl;
  }
}

/**
 * Importer les auteurs
 */
async function importAuthors(posts: WPPost[]): Promise<Map<number, number>> {
  console.log('👤 Import des auteurs...');
  const idMap = new Map<number, number>();
  const seen = new Set<number>();

  // Collecter tous les auteurs uniques
  const authors: Array<{ id: number; name: string; slug: string; avatar?: string; bio?: string }> = [];

  for (const post of posts) {
    const wpAuthors = post._embedded?.author || [];
    for (const author of wpAuthors) {
      if (!seen.has(author.id)) {
        seen.add(author.id);
        authors.push({
          id: author.id,
          name: author.name,
          slug: author.slug,
          avatar: author.avatar_urls?.['96'] || author.avatar_urls?.['48'],
          bio: author.description,
        });
      }
    }
  }

  // Insérer dans Supabase
  for (const author of authors) {
    const { data, error } = await supabase
      .from('authors')
      .upsert({
        slug: author.slug,
        name: author.name,
        avatar: author.avatar || null,
        bio: author.bio || null,
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (!error && data) {
      idMap.set(author.id, data.id);
      console.log(`  ✓ ${author.name}`);
    }
  }

  // Ajouter un auteur par défaut si aucun trouvé
  if (authors.length === 0) {
    const { data, error } = await supabase
      .from('authors')
      .upsert({
        slug: 'menu-cochon',
        name: 'Menu Cochon',
        bio: 'L\'équipe de Menu Cochon',
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (!error && data) {
      idMap.set(0, data.id);
      console.log(`  ✓ Menu Cochon (par défaut)`);
    }
  }

  return idMap;
}

/**
 * Importer les catégories de posts
 */
async function importCategories(posts: WPPost[]): Promise<Map<number, number>> {
  console.log('\n📁 Import des catégories de posts...');
  const idMap = new Map<number, number>();
  const seen = new Set<number>();

  // Collecter toutes les catégories uniques (taxonomy = category)
  const categories: Array<{ id: number; slug: string; name: string }> = [];

  for (const post of posts) {
    const terms = post._embedded?.['wp:term'] || [];
    for (const termGroup of terms) {
      for (const term of termGroup) {
        if (term.taxonomy === 'category' && !seen.has(term.id)) {
          seen.add(term.id);
          categories.push(term);
        }
      }
    }
  }

  // Insérer dans Supabase
  for (const cat of categories) {
    const { data, error } = await supabase
      .from('post_categories')
      .upsert({
        slug: cat.slug,
        name: cat.name,
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (!error && data) {
      idMap.set(cat.id, data.id);
      console.log(`  ✓ ${cat.name}`);
    }
  }

  return idMap;
}

/**
 * Extraire les tags d'un post
 */
function extractTags(post: WPPost): string[] {
  const terms = post._embedded?.['wp:term'] || [];
  const tags: string[] = [];

  for (const termGroup of terms) {
    for (const term of termGroup) {
      if (term.taxonomy === 'post_tag') {
        tags.push(term.name);
      }
    }
  }

  return tags;
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Import Posts WordPress → Supabase\n');
  console.log(`WordPress: ${WORDPRESS_URL}`);
  console.log(`Supabase: ${SUPABASE_URL}\n`);

  const skipImages = process.argv.includes('--skip-images');
  if (skipImages) console.log('⚠️ Upload des images désactivé\n');

  // 1. Récupérer la liste des posts
  const posts = await fetchAllPosts();

  if (posts.length === 0) {
    console.log('Aucun post trouvé.');
    return;
  }

  // 2. Importer les auteurs
  const authorIdMap = await importAuthors(posts);

  // 3. Importer les catégories
  const categoryIdMap = await importCategories(posts);

  // 4. Importer chaque post
  console.log('\n📝 Import des posts...\n');
  let success = 0;
  let failed = 0;

  for (const wpPost of posts) {
    const title = cleanText(wpPost.title.rendered);
    console.log(`Processing: ${title}`);

    try {
      // Image à la une
      let featuredImage: string | null = null;
      if (wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
        const imgUrl = wpPost._embedded['wp:featuredmedia'][0].source_url;
        featuredImage = skipImages ? imgUrl : await uploadImage(imgUrl);
        if (!skipImages && featuredImage !== imgUrl) {
          console.log(`  ✓ Image uploadée`);
        }
      }

      // Auteur
      const wpAuthor = wpPost._embedded?.author?.[0];
      const authorId = wpAuthor ? authorIdMap.get(wpAuthor.id) : authorIdMap.get(0);

      // Contenu et excerpt
      const content = wpPost.content.rendered;
      const excerpt = cleanText(wpPost.excerpt.rendered);

      // Tags
      const tags = extractTags(wpPost);

      // Temps de lecture
      const readingTime = calculateReadingTime(content);

      // Insérer le post
      const { data: insertedPost, error } = await supabase
        .from('posts')
        .upsert({
          slug: wpPost.slug,
          title: title,
          excerpt: excerpt || null,
          content: content,
          featured_image: featuredImage,
          author_id: authorId || null,
          tags: tags.length > 0 ? tags : null,
          reading_time: readingTime,
          published_at: wpPost.date,
          updated_at: wpPost.modified,
          status: 'published',
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error(`  ❌ Erreur DB: ${error.message}`);
        failed++;
        continue;
      }

      // Lier les catégories
      const categoryTerms = (wpPost._embedded?.['wp:term'] || [])
        .flat()
        .filter(term => term.taxonomy === 'category');

      const categoryLinks = categoryTerms
        .map(term => {
          const newId = categoryIdMap.get(term.id);
          return newId ? { post_id: insertedPost.id, category_id: newId } : null;
        })
        .filter(Boolean);

      if (categoryLinks.length > 0) {
        // Supprimer les anciennes liaisons
        await supabase
          .from('posts_categories')
          .delete()
          .eq('post_id', insertedPost.id);

        // Insérer les nouvelles
        await supabase
          .from('posts_categories')
          .insert(categoryLinks as any[]);
      }

      console.log(`  ✓ Importé (${readingTime} min lecture, ${tags.length} tags, ${categoryLinks.length} catégories)`);
      success++;

    } catch (error) {
      console.error(`  ❌ Erreur:`, error);
      failed++;
    }

    // Petite pause pour ne pas surcharger
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Import terminé!`);
  console.log(`   ${success} posts importés`);
  if (failed > 0) console.log(`   ${failed} erreurs`);
}

main().catch(console.error);
