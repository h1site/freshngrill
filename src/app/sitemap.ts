import { MetadataRoute } from 'next';
import { getAllRecipes, getAllEnglishRecipeSlugs, getAllCategorySlugs } from '@/lib/recipes';
import { getAllPosts } from '@/lib/posts';
import { getAllTerms } from '@/lib/lexique';
import { getAllTermsEn } from '@/lib/lexiqueEn';
import { siteConfig } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // ============================================
  // PAGES STATIQUES FRANÇAISES
  // ============================================
  const staticPagesFr: MetadataRoute.Sitemap = [
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
      url: `${baseUrl}/frigo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/recherche`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // Convertisseurs FR
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

  // ============================================
  // PAGES STATIQUES ANGLAISES
  // ============================================
  const staticPagesEn: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/en/recipe`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/lexicon`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/frigo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/recherche`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // Convertisseurs EN
    {
      url: `${baseUrl}/en/converter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/converter/celsius-fahrenheit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/converter/meter-feet`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/converter/inch-feet`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/converter/centimeter-feet`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/converter/timer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // ============================================
  // DONNÉES DYNAMIQUES
  // ============================================
  const [
    recipes,
    englishRecipeSlugs,
    posts,
    lexiqueTermsFr,
    lexiqueTermsEn,
    categorySlugs,
  ] = await Promise.all([
    getAllRecipes(),
    getAllEnglishRecipeSlugs(),
    getAllPosts(),
    getAllTerms(),
    getAllTermsEn(),
    getAllCategorySlugs(),
  ]);

  // ============================================
  // PAGES RECETTES FRANÇAISES
  // ============================================
  const recipePagesFr: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${baseUrl}/recette/${recipe.slug}`,
    lastModified: new Date(recipe.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ============================================
  // PAGES RECETTES ANGLAISES
  // ============================================
  const recipePagesEn: MetadataRoute.Sitemap = englishRecipeSlugs.map((item) => ({
    url: `${baseUrl}/en/recipe/${item.slugEn}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ============================================
  // PAGES CATÉGORIES FRANÇAISES
  // ============================================
  const categoryPagesFr: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/categorie/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // ============================================
  // PAGES CATÉGORIES ANGLAISES
  // ============================================
  const categoryPagesEn: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/en/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // ============================================
  // PAGES BLOG FRANÇAISES
  // ============================================
  const blogPagesFr: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Note: Les pages blog anglaises utilisent les mêmes slugs que le français
  // car il n'y a pas encore de traduction des posts

  // ============================================
  // PAGES LEXIQUE FRANÇAISES
  // ============================================
  const lexiquePagesFr: MetadataRoute.Sitemap = lexiqueTermsFr.map((term) => ({
    url: `${baseUrl}/lexique/${term.slug}`,
    lastModified: new Date(term.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // ============================================
  // PAGES LEXIQUE ANGLAISES
  // ============================================
  const lexiquePagesEn: MetadataRoute.Sitemap = lexiqueTermsEn.map((term) => ({
    url: `${baseUrl}/en/lexicon/${term.slug}`,
    lastModified: new Date(term.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // ============================================
  // ASSEMBLAGE FINAL
  // ============================================
  return [
    ...staticPagesFr,
    ...staticPagesEn,
    ...recipePagesFr,
    ...recipePagesEn,
    ...categoryPagesFr,
    ...categoryPagesEn,
    ...blogPagesFr,
    ...lexiquePagesFr,
    ...lexiquePagesEn,
  ];
}
