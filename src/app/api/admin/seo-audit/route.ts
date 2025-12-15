import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  current?: string | number;
  recommended?: string;
}

interface RecipeAudit {
  id: number;
  slug: string;
  title: string;
  locale: 'fr' | 'en';
  issues: SEOIssue[];
  score: number;
}

interface AuditSummary {
  totalRecipes: number;
  totalTranslations: number;
  avgScore: number;
  issuesByType: {
    error: number;
    warning: number;
    info: number;
  };
  commonIssues: { issue: string; count: number }[];
}

const SEO_LIMITS = {
  seoTitle: { min: 30, max: 60, ideal: 55 },
  seoDescription: { min: 120, max: 160, ideal: 155 },
  title: { min: 10, max: 70 },
  excerpt: { min: 50, max: 300 },
};

function auditRecipe(recipe: {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  introduction: string | null;
  faq: string | null;
  nutrition: unknown | null;
  tags: string[] | null;
}, locale: 'fr' | 'en' = 'fr'): RecipeAudit {
  const issues: SEOIssue[] = [];
  let score = 100;

  // 1. SEO Title
  if (!recipe.seo_title) {
    issues.push({
      type: 'error',
      field: 'seo_title',
      message: locale === 'fr' ? 'Titre SEO manquant' : 'SEO title missing',
      recommended: `${recipe.title} | Menucochon`,
    });
    score -= 15;
  } else {
    const titleLen = recipe.seo_title.length;
    if (titleLen > SEO_LIMITS.seoTitle.max) {
      issues.push({
        type: 'error',
        field: 'seo_title',
        message: `Titre SEO trop long (${titleLen}/${SEO_LIMITS.seoTitle.max} car.)`,
        current: recipe.seo_title,
        recommended: recipe.seo_title.substring(0, SEO_LIMITS.seoTitle.max - 3) + '...',
      });
      score -= 10;
    } else if (titleLen < SEO_LIMITS.seoTitle.min) {
      issues.push({
        type: 'warning',
        field: 'seo_title',
        message: `Titre SEO trop court (${titleLen}/${SEO_LIMITS.seoTitle.min} car. min)`,
        current: recipe.seo_title,
      });
      score -= 5;
    }
  }

  // 2. Meta Description
  if (!recipe.seo_description) {
    issues.push({
      type: 'error',
      field: 'seo_description',
      message: locale === 'fr' ? 'Meta description manquante' : 'Meta description missing',
      recommended: recipe.excerpt?.substring(0, SEO_LIMITS.seoDescription.max) || '',
    });
    score -= 15;
  } else {
    const descLen = recipe.seo_description.length;
    if (descLen > SEO_LIMITS.seoDescription.max) {
      issues.push({
        type: 'error',
        field: 'seo_description',
        message: `Meta description trop longue (${descLen}/${SEO_LIMITS.seoDescription.max} car.)`,
        current: recipe.seo_description,
        recommended: recipe.seo_description.substring(0, SEO_LIMITS.seoDescription.max - 3) + '...',
      });
      score -= 10;
    } else if (descLen < SEO_LIMITS.seoDescription.min) {
      issues.push({
        type: 'warning',
        field: 'seo_description',
        message: `Meta description trop courte (${descLen}/${SEO_LIMITS.seoDescription.min} car. min)`,
        current: recipe.seo_description,
      });
      score -= 5;
    }
  }

  // 3. H1 / Title
  if (!recipe.title || recipe.title.length < SEO_LIMITS.title.min) {
    issues.push({
      type: 'warning',
      field: 'title',
      message: 'Titre (H1) trop court ou manquant',
      current: recipe.title,
    });
    score -= 5;
  } else if (recipe.title.length > SEO_LIMITS.title.max) {
    issues.push({
      type: 'info',
      field: 'title',
      message: `Titre (H1) long (${recipe.title.length} car.) - acceptable mais considérer raccourcir`,
      current: recipe.title,
    });
    score -= 2;
  }

  // 4. Excerpt
  if (!recipe.excerpt) {
    issues.push({
      type: 'warning',
      field: 'excerpt',
      message: 'Extrait/description courte manquant',
    });
    score -= 5;
  } else if (recipe.excerpt.length < SEO_LIMITS.excerpt.min) {
    issues.push({
      type: 'info',
      field: 'excerpt',
      message: `Extrait court (${recipe.excerpt.length} car.)`,
      current: recipe.excerpt,
    });
    score -= 2;
  }

  // 5. Introduction
  if (!recipe.introduction) {
    issues.push({
      type: 'warning',
      field: 'introduction',
      message: 'Introduction manquante - important pour le contenu enrichi',
    });
    score -= 5;
  }

  // 6. FAQ
  if (!recipe.faq) {
    issues.push({
      type: 'info',
      field: 'faq',
      message: 'FAQ manquante - opportunité pour rich snippets',
    });
    score -= 3;
  }

  // 7. Nutrition
  if (!recipe.nutrition) {
    issues.push({
      type: 'info',
      field: 'nutrition',
      message: 'Informations nutritionnelles manquantes',
    });
    score -= 2;
  }

  // 8. Tags
  if (!recipe.tags || recipe.tags.length === 0) {
    issues.push({
      type: 'info',
      field: 'tags',
      message: 'Aucun tag/mot-clé défini',
    });
    score -= 2;
  } else if (recipe.tags.length < 3) {
    issues.push({
      type: 'info',
      field: 'tags',
      message: `Peu de tags (${recipe.tags.length}) - recommandé: 4-6`,
    });
    score -= 1;
  }

  return {
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    locale,
    issues,
    score: Math.max(0, score),
  };
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Types pour les données Supabase
    interface RecipeRow {
      id: number;
      slug: string;
      title: string;
      excerpt: string | null;
      seo_title: string | null;
      seo_description: string | null;
      introduction: string | null;
      faq: string | null;
      nutrition: unknown | null;
      tags: string[] | null;
    }

    interface TranslationRow {
      recipe_id: number;
      slug_en: string;
      title: string;
      excerpt: string | null;
      seo_title: string | null;
      seo_description: string | null;
      introduction: string | null;
      faq: string | null;
    }

    // Récupérer toutes les recettes FR
    const { data: recipesData, error: recipesError } = await supabase
      .from('recipes')
      .select('id, slug, title, excerpt, seo_title, seo_description, introduction, faq, nutrition, tags')
      .order('title');

    if (recipesError) {
      throw recipesError;
    }

    const recipes = recipesData as RecipeRow[] | null;

    // Récupérer toutes les traductions EN
    const { data: translationsData, error: transError } = await supabase
      .from('recipe_translations')
      .select('recipe_id, slug_en, title, excerpt, seo_title, seo_description, introduction, faq')
      .eq('locale', 'en');

    if (transError) {
      throw transError;
    }

    const translations = translationsData as TranslationRow[] | null;

    // Auditer les recettes FR
    const frAudits: RecipeAudit[] = (recipes || []).map(r => auditRecipe(r, 'fr'));

    // Auditer les traductions EN
    const enAudits: RecipeAudit[] = (translations || []).map(t => {
      const parentRecipe = recipes?.find(r => r.id === t.recipe_id);
      return auditRecipe({
        id: t.recipe_id,
        slug: t.slug_en,
        title: t.title,
        excerpt: t.excerpt,
        seo_title: t.seo_title,
        seo_description: t.seo_description,
        introduction: t.introduction,
        faq: t.faq,
        nutrition: parentRecipe?.nutrition || null,
        tags: parentRecipe?.tags || null,
      }, 'en');
    });

    // Calculer le résumé
    const allAudits = [...frAudits, ...enAudits];
    const avgScore = allAudits.length > 0
      ? Math.round(allAudits.reduce((sum, a) => sum + a.score, 0) / allAudits.length)
      : 0;

    // Compter les issues par type
    const issuesByType = { error: 0, warning: 0, info: 0 };
    const issueCountMap: Record<string, number> = {};

    allAudits.forEach(audit => {
      audit.issues.forEach(issue => {
        issuesByType[issue.type]++;
        const key = `${issue.field}: ${issue.message.split('(')[0].trim()}`;
        issueCountMap[key] = (issueCountMap[key] || 0) + 1;
      });
    });

    const commonIssues = Object.entries(issueCountMap)
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const summary: AuditSummary = {
      totalRecipes: recipes?.length || 0,
      totalTranslations: translations?.length || 0,
      avgScore,
      issuesByType,
      commonIssues,
    };

    // Trier par score (pire en premier)
    const sortedFrAudits = frAudits.sort((a, b) => a.score - b.score);
    const sortedEnAudits = enAudits.sort((a, b) => a.score - b.score);

    return NextResponse.json({
      summary,
      audits: {
        fr: sortedFrAudits,
        en: sortedEnAudits,
      },
    });
  } catch (error) {
    console.error('Erreur audit SEO:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'audit' },
      { status: 500 }
    );
  }
}
