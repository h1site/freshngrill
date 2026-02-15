import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/recipe`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Recipes
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, updated_at')
    .order('slug') as { data: { slug: string; updated_at: string | null }[] | null };

  const recipePages: MetadataRoute.Sitemap = (recipes || []).map((recipe) => ({
    url: `${baseUrl}/recipe/${recipe.slug}`,
    lastModified: recipe.updated_at ? new Date(recipe.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('slug') as { data: { slug: string; updated_at: string | null }[] | null };

  const blogPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...recipePages, ...blogPages];
}
