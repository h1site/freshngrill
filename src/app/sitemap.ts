import { MetadataRoute } from 'next';
import { getAllRecipes } from '@/lib/recipes';
import { getAllPosts } from '@/lib/posts';
import { getAllTerms } from '@/lib/lexique';
import { siteConfig } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/recette`,
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
    {
      url: `${baseUrl}/lexique`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/recherche`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Convertisseurs
    {
      url: `${baseUrl}/convertisseur`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/convertisseur/celsius-fahrenheit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/convertisseur/metre-pied`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/convertisseur/pouce-pied`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/convertisseur/centimetre-pied`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/convertisseur/minuterie`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Récupérer toutes les données dynamiques en parallèle
  const [recipes, posts, lexiqueTerms] = await Promise.all([
    getAllRecipes(),
    getAllPosts(),
    getAllTerms(),
  ]);

  // Pages recettes
  const recipePages: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${baseUrl}/recette/${recipe.slug}`,
    lastModified: new Date(recipe.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Pages blog
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Pages lexique
  const lexiquePages: MetadataRoute.Sitemap = lexiqueTerms.map((term) => ({
    url: `${baseUrl}/lexique/${term.slug}`,
    lastModified: new Date(term.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...recipePages, ...blogPages, ...lexiquePages];
}
