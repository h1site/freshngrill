/**
 * Script d'import des recettes depuis WordPress vers Supabase
 * Inclut TOUS les champs ACF
 *
 * Usage: npx tsx scripts/import-from-wordpress.ts
 *        npx tsx scripts/import-from-wordpress.ts --skip-images
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const WORDPRESS_URL = 'https://menucochon.com';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface WPRecipe {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  link: string;
  date: string;
  modified: string;
  acf?: {
    introduction?: string;
    ingredients?: string;
    les_etapes?: string;
    conclusion?: string;
    serves?: number;
    cook_time?: number;
    prep_time?: number;
    total_time?: number;
    calories?: number;
    thumbnail_url?: string | { url: string };
    video?: string;
    tag_ingredients?: number[];
    tag_origine?: number[];
    type_de_cuisine?: number[];
    faq?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ id: number; slug: string; name: string; taxonomy: string }>>;
  };
}

interface JsonLdRecipe {
  name: string;
  description?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string | string[];
  recipeIngredient?: string[];
  recipeInstructions?: Array<{ text: string; name?: string }> | string[];
  recipeCuisine?: string | string[];
  nutrition?: { calories?: string };
  image?: string | string[] | { url: string };
}

interface ScrapedData {
  introduction?: string;
  ingredients?: string;
  instructions?: string;
  instructionsDetailed?: Array<{ step: number; title: string; content: string }>;
  conclusion?: string;
  astuces?: string;
  faq?: string;
  video?: string;
  calories?: number;
}

/**
 * Parser une durée ISO 8601 (PT5M, PT1H30M) en minutes
 */
function parseDuration(duration?: string): number {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  return hours * 60 + minutes;
}

/**
 * Nettoyer le HTML et les entités (garder le HTML pour certains champs)
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
 * Nettoyer le HTML mais garder la structure basique
 */
function cleanHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&hellip;/g, '...')
    .trim();
}

/**
 * Récupérer toutes les recettes via l'API WP avec ACF
 */
async function fetchAllRecipes(): Promise<WPRecipe[]> {
  const recipes: WPRecipe[] = [];
  let page = 1;
  let hasMore = true;

  console.log('📥 Récupération de la liste des recettes...');

  while (hasMore) {
    // Ajouter acf_format=standard pour obtenir les champs ACF
    // Réduire per_page pour éviter les erreurs 500 avec _embed et ACF
    const url = `${WORDPRESS_URL}/wp-json/wp/v2/recettes?per_page=20&page=${page}&_embed&acf_format=standard`;
    console.log(`  Page ${page}...`);

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400) break;
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) break;

    recipes.push(...data);
    page++;

    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    if (page > totalPages) hasMore = false;
  }

  console.log(`  ✓ ${recipes.length} recettes trouvées\n`);
  return recipes;
}

/**
 * Extraire les données JSON-LD et scraper le HTML pour les champs ACF
 */
async function fetchRecipeData(url: string): Promise<{ jsonLd: JsonLdRecipe | null; scraped: ScrapedData }> {
  const scraped: ScrapedData = {};
  let jsonLd: JsonLdRecipe | null = null;

  try {
    const response = await fetch(url);
    if (!response.ok) return { jsonLd: null, scraped };

    const html = await response.text();

    // Extraire JSON-LD
    const jsonLdPattern = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = jsonLdPattern.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1]);
        if (data['@type'] === 'Recipe') {
          jsonLd = data as JsonLdRecipe;
          break;
        }
        if (data['@graph']) {
          for (const item of data['@graph']) {
            if (item['@type'] === 'Recipe') {
              jsonLd = item as JsonLdRecipe;
              break;
            }
          }
        }
      } catch (e) {
        // JSON invalide
      }
    }

    // ========================================
    // SCRAPING AMÉLIORÉ DU CONTENU HTML
    // ========================================

    // Helper: Extraire une section complète après un titre H2/H3
    const extractSectionContent = (titlePattern: string): string | null => {
      // Chercher le titre dans un h2 ou h3
      const titleRegex = new RegExp(
        `<h[23][^>]*>[\\s\\S]*?${titlePattern}[\\s\\S]*?</h[23]>`,
        'i'
      );
      const titleMatch = html.match(titleRegex);
      if (!titleMatch) return null;

      const startIndex = titleMatch.index! + titleMatch[0].length;

      // Trouver la fin de la section (prochain h2/h3 ou fin de contenu)
      const remainingHtml = html.substring(startIndex);
      const nextSectionMatch = remainingHtml.match(/<h[23][^>]*>/i);
      const endIndex = nextSectionMatch ? nextSectionMatch.index! : remainingHtml.length;

      const sectionHtml = remainingHtml.substring(0, Math.min(endIndex, 5000));

      // Extraire tous les paragraphes de la section
      const paragraphs: string[] = [];
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let pMatch;
      while ((pMatch = pRegex.exec(sectionHtml)) !== null) {
        const text = cleanText(pMatch[1]);
        if (text.length > 20) {
          paragraphs.push(text);
        }
      }

      return paragraphs.length > 0 ? paragraphs.join('\n\n') : null;
    };

    // ========================================
    // INTRODUCTION - Extraire le HTML complet avant les ingrédients
    // ========================================
    const introEndMarkers = [
      /ingrédients/i,
      /ingredients/i,
      /<h[23][^>]*>[^<]*ingrédient/i,
      /elementor-widget-premium-addon-dual-header/i,
    ];

    // Trouver où commence le contenu principal (après le titre H1)
    const h1Match = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/i);
    const contentStart = h1Match ? (h1Match.index! + h1Match[0].length) : 0;

    // Trouver où finit l'introduction (avant les ingrédients)
    let introEndIndex = html.length;
    for (const marker of introEndMarkers) {
      const markerMatch = html.substring(contentStart).match(marker);
      if (markerMatch && markerMatch.index! < introEndIndex - contentStart) {
        introEndIndex = contentStart + markerMatch.index!;
      }
    }

    // Extraire les paragraphes d'introduction - GARDER LE HTML pour les blocs
    const introHtml = html.substring(contentStart, introEndIndex);
    const introParagraphs: string[] = [];
    const introParaRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let introMatch;
    while ((introMatch = introParaRegex.exec(introHtml)) !== null) {
      // Garder le HTML interne pour les balises comme <strong>, <em>, etc.
      let htmlContent = introMatch[1];
      let textContent = cleanText(htmlContent);

      // Nettoyer le texte des préfixes de métadonnées si présents au début
      const metadataPattern = /^.*?Imprimer\s*/i;
      if (metadataPattern.test(textContent)) {
        continue; // Skip entièrement les paragraphes avec métadonnées
      }

      // Filtrer les paragraphes qui ne sont QUE des métadonnées
      const skipPatterns = [
        /^Préparation\s*:\s*\d+/i,
        /^Cuisson\s*:\s*\d+/i,
        /^Calories\s*:\s*\d+/i,
        /^Portions\s*:\s*\d+/i,
        /^Version\s+Simplifi/i,
        /^Merci de Partager/i,
        /^Imprimer$/i,
        /Skip to content/i,
        /^\d+\s*MIN$/i,
      ];

      // Ne skip que si le texte est ENTIÈREMENT un pattern à ignorer
      const isOnlyMetadata = skipPatterns.some(pattern => pattern.test(textContent)) && textContent.length < 100;
      if (isOnlyMetadata) continue;

      // Paragraphes substantiels uniquement (plus de 50 caractères)
      if (textContent.length > 50) {
        // Garder le HTML nettoyé (entités décodées mais balises conservées)
        introParagraphs.push(`<p>${cleanHtml(htmlContent)}</p>`);
      }
    }

    if (introParagraphs.length > 0) {
      scraped.introduction = introParagraphs.join('\n');
    }

    // ========================================
    // FALLBACK: Si pas d'introduction, chercher le premier paragraphe après le H1
    // ========================================
    if (!scraped.introduction) {
      const afterH1Match = html.match(/<h1[^>]*>[\s\S]*?<\/h1>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
      if (afterH1Match) {
        const firstPara = cleanText(afterH1Match[1]);
        // Vérifier que c'est un vrai paragraphe d'introduction (pas des métadonnées)
        if (firstPara.length > 100 && !firstPara.match(/^(Préparation|Cuisson|Portions|Calories)/i)) {
          scraped.introduction = `<p>${cleanHtml(afterH1Match[1])}</p>`;
        }
      }
    }

    // ========================================
    // ÉTAPES DÉTAILLÉES - Scraper le HTML complet des étapes
    // ========================================
    const stepsDetailed: Array<{ step: number; title: string; content: string }> = [];

    // Pattern pour les étapes numérotées - plusieurs formats possibles
    // Format MenuCochon: <h3 data-start="xxx"><strong data-start="xxx">1. Titre</strong></h3>
    const stepPatterns = [
      // Format avec data attributes et strong: <h3 data-*><strong data-*>1. Titre</strong></h3>
      /<h[34][^>]*>\s*<strong[^>]*>\s*(\d+)\.\s*([^<]+)<\/strong>\s*<\/h[34]>/gi,
      // Format simple: <h3>1. Titre</h3>
      /<h[34][^>]*>\s*(\d+)\.\s*([^<]+)<\/h[34]>/gi,
      // Format "Étape 1:" ou "Step 1:"
      /<h[34][^>]*>[^<]*(?:étape|step)\s*(\d+)[:\s]*([^<]*)<\/h[34]>/gi,
    ];

    for (const pattern of stepPatterns) {
      pattern.lastIndex = 0; // Reset regex
      let stepMatch;
      const seenSteps = new Set<number>(); // Éviter les doublons

      while ((stepMatch = pattern.exec(html)) !== null) {
        const stepNum = parseInt(stepMatch[1]);
        const stepTitle = cleanText(stepMatch[2]);

        // Skip si on a déjà vu cette étape (le HTML contient des doublons)
        if (seenSteps.has(stepNum)) continue;
        seenSteps.add(stepNum);

        // Trouver le contenu après ce titre d'étape
        const afterTitle = html.substring(stepMatch.index + stepMatch[0].length);
        // Chercher la prochaine étape ou section h2/h3
        const nextStepMatch = afterTitle.match(/<h[34][^>]*>[\s\S]*?<strong[^>]*>\s*\d+\./i)
          || afterTitle.match(/<h[34][^>]*>\s*\d+\./i);
        const nextSectionMatch = afterTitle.match(/<h2[^>]*>/i);
        let contentEnd = Math.min(afterTitle.length, 3000);
        if (nextStepMatch) contentEnd = Math.min(contentEnd, nextStepMatch.index!);
        if (nextSectionMatch) contentEnd = Math.min(contentEnd, nextSectionMatch.index!);

        const stepContentHtml = afterTitle.substring(0, contentEnd);
        const contentParagraphs: string[] = [];
        const contentRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
        let contentMatch;
        while ((contentMatch = contentRegex.exec(stepContentHtml)) !== null) {
          const text = cleanText(contentMatch[1]);
          if (text.length > 10) {
            contentParagraphs.push(text);
          }
        }

        if (contentParagraphs.length > 0 || stepTitle) {
          stepsDetailed.push({
            step: stepNum,
            title: stepTitle,
            content: contentParagraphs.join(' ')
          });
        }
      }
      if (stepsDetailed.length > 0) break;
    }

    // Trier par numéro d'étape
    stepsDetailed.sort((a, b) => a.step - b.step);

    if (stepsDetailed.length > 0) {
      scraped.instructionsDetailed = stepsDetailed;
    }

    // ========================================
    // CONCLUSION - chercher la section complète après "Pourquoi" ou "conclusion"
    // ========================================
    const conclusionPatterns = [
      /Pourquoi\s+Choisir/i,
      /conclusion/i,
    ];

    for (const pattern of conclusionPatterns) {
      const conclusionHeaderMatch = html.match(new RegExp(`<h[23][^>]*>[\\s\\S]*?${pattern.source}[\\s\\S]*?</h[23]>`, 'i'));
      if (conclusionHeaderMatch) {
        const conclusionStart = conclusionHeaderMatch.index! + conclusionHeaderMatch[0].length;
        const afterConclusion = html.substring(conclusionStart);

        // Trouver la fin (section astuces, commentaires, ou footer)
        const conclusionEndMatch = afterConclusion.match(/nos astuces|id="comments"|class="comment|<footer/i);
        const conclusionEnd = conclusionEndMatch ? conclusionEndMatch.index! : Math.min(afterConclusion.length, 10000);

        const conclusionHtml = afterConclusion.substring(0, conclusionEnd);
        const conclusionParagraphs: string[] = [];

        // Extraire tous les paragraphes et listes - GARDER LE HTML
        const contentRegex = /<p[^>]*>([\s\S]*?)<\/p>|<li[^>]*>([\s\S]*?)<\/li>/gi;
        let contentMatch;
        while ((contentMatch = contentRegex.exec(conclusionHtml)) !== null) {
          const htmlContent = contentMatch[1] || contentMatch[2];
          const text = cleanText(htmlContent);
          // Filtrer le bruit
          const noisePatterns = [
            /menucochon\.com/i,
            /^Accueil\s+Recettes/i,
            /Plat[s]?\s*(principaux|d.accompagnement)/i,
            /^Mise en conserve/i,
            /accessoires/i,
            /^\d+\s+accessoires/i,
            /^Déjeuner$/i,
            /^Desserts$/i,
            /^Soupes$/i,
            /^Entrées$/i,
            /^Autres$/i,
          ];
          const isNoise = noisePatterns.some(p => p.test(text));
          if (text.length > 15 && !isNoise) {
            conclusionParagraphs.push(`<p>${cleanHtml(htmlContent)}</p>`);
          }
        }

        if (conclusionParagraphs.length > 0) {
          scraped.conclusion = conclusionParagraphs.join('\n');
          break;
        }
      }
    }

    // Fallback sur extractSectionContent si rien trouvé
    if (!scraped.conclusion) {
      scraped.conclusion = extractSectionContent('conclusion')
        || extractSectionContent('Pourquoi')
        || undefined;
    }

    // ========================================
    // ASTUCES / CONSEILS - chercher la section après "nos astuces"
    // ========================================
    // Chercher plusieurs formats de header pour "nos astuces"
    const astucesPatterns = [
      /nos astuces[^<]*<\/span><\/div><\/h2>/i,
      /<h2[^>]*>[\s\S]*?nos astuces[\s\S]*?<\/h2>/i,
      /<h3[^>]*>[\s\S]*?nos astuces[\s\S]*?<\/h3>/i,
    ];

    for (const astucesPattern of astucesPatterns) {
      const astucesHeaderMatch = html.match(astucesPattern);
      if (astucesHeaderMatch) {
        const astucesStart = astucesHeaderMatch.index! + astucesHeaderMatch[0].length;
        const afterAstuces = html.substring(astucesStart);
        // Trouver la fin (prochain h2 ou commentaires)
        const astucesEndMatch = afterAstuces.match(/<h2[^>]*>|id="comments"|class="comment/i);
        const astucesEnd = astucesEndMatch ? astucesEndMatch.index! : Math.min(afterAstuces.length, 8000);

        const astucesHtml = afterAstuces.substring(0, astucesEnd);
        const astucesParagraphs: string[] = [];

        // Extraire les titres h3 et leurs contenus - Format avec strong
        const astucesRegex = /<h3[^>]*>[\s\S]*?<strong[^>]*>([^<]+)<\/strong>[\s\S]*?<\/h3>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi;
        let astucesMatch;
        while ((astucesMatch = astucesRegex.exec(astucesHtml)) !== null) {
          const title = cleanText(astucesMatch[1]);
          const content = cleanHtml(astucesMatch[2]);
          if (title && content) {
            astucesParagraphs.push(`<strong>${title}</strong>\n<p>${content}</p>`);
          }
        }

        // Fallback: extraire tous les h3 et p séparément
        if (astucesParagraphs.length === 0) {
          const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
          const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
          let h3Match;
          let pMatch;
          const titles: string[] = [];
          const contents: string[] = [];

          while ((h3Match = h3Regex.exec(astucesHtml)) !== null) {
            const title = cleanText(h3Match[1]);
            if (title.length > 3) titles.push(title);
          }
          while ((pMatch = pRegex.exec(astucesHtml)) !== null) {
            const content = cleanHtml(pMatch[1]);
            if (content.length > 20) contents.push(content);
          }

          // Associer titres et contenus
          for (let i = 0; i < Math.min(titles.length, contents.length); i++) {
            astucesParagraphs.push(`<strong>${titles[i]}</strong>\n<p>${contents[i]}</p>`);
          }
          // Ajouter les contenus orphelins
          for (let i = titles.length; i < contents.length; i++) {
            astucesParagraphs.push(`<p>${contents[i]}</p>`);
          }
        }

        if (astucesParagraphs.length > 0) {
          scraped.astuces = astucesParagraphs.join('\n\n');
          break;
        }
      }
    }

    // Fallback si aucun pattern ne fonctionne
    if (!scraped.astuces) {
      scraped.astuces = extractSectionContent('astuces')
        || extractSectionContent('conseils')
        || extractSectionContent('nos astuces')
        || undefined;
    }

    // ========================================
    // FAQ
    // ========================================
    scraped.faq = extractSectionContent('faq')
      || extractSectionContent('questions fréquentes')
      || extractSectionContent('questions')
      || undefined;

    // ========================================
    // VIDEO YouTube
    // ========================================
    const videoMatch = html.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/i);
    if (videoMatch) scraped.video = `https://www.youtube.com/watch?v=${videoMatch[1]}`;

    // ========================================
    // CALORIES - chercher dans le HTML si pas dans JSON-LD
    // ========================================
    if (!jsonLd?.nutrition?.calories) {
      const caloriesMatch = html.match(/(\d+)\s*(?:calories|kcal|cal)/i);
      if (caloriesMatch) {
        scraped.calories = parseInt(caloriesMatch[1]);
      }
    }

  } catch (error) {
    console.warn(`  ⚠️ Erreur fetch ${url}:`, error);
  }

  return { jsonLd, scraped };
}

/**
 * Télécharger et uploader une image vers Supabase Storage
 */
async function uploadImage(imageUrl: string): Promise<string | null> {
  try {
    if (!imageUrl) return null;

    const cleanUrl = imageUrl.split('?')[0];
    const urlParts = cleanUrl.split('/');
    let fileName = urlParts[urlParts.length - 1];
    fileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`    ⚠️ Image non trouvée: ${imageUrl}`);
      return imageUrl;
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, buffer, {
        contentType: blob.type || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.warn(`    ⚠️ Erreur upload: ${error.message}`);
      return imageUrl;
    }

    const { data: publicUrl } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  } catch (error) {
    return imageUrl;
  }
}

/**
 * Parser les ingrédients du JSON-LD ou HTML
 */
function parseIngredients(ingredients?: string[], htmlIngredients?: string): any[] {
  let allIngredients: string[] = [];

  if (ingredients && ingredients.length > 0) {
    for (const ing of ingredients) {
      const lines = ing.split('\n').map(l => l.trim()).filter(Boolean);
      allIngredients.push(...lines);
    }
  } else if (htmlIngredients) {
    // Parser le HTML des ingrédients
    const listItems = htmlIngredients.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    allIngredients = listItems.map(li => cleanText(li));
  }

  if (allIngredients.length === 0) return [];

  return [{
    title: null,
    items: allIngredients.map(ing => {
      const match = ing.match(/^([\d\/\.,]+)?\s*(c\. à (?:soupe|thé|café)|tasse|ml|g|kg|l|oz|lb|pincée|scoop)?\s*(?:de\s+)?(.+)$/i);
      if (match) {
        return {
          quantity: match[1] || null,
          unit: match[2] || null,
          name: match[3] || ing,
        };
      }
      return { name: ing };
    }),
  }];
}

/**
 * Parser les instructions - priorité aux étapes détaillées scrapées
 */
function parseInstructions(
  scrapedDetailed?: Array<{ step: number; title: string; content: string }>,
  jsonLdInstructions?: Array<{ text: string; name?: string }> | string[],
  htmlInstructions?: string
): any[] {
  // Priorité 1: Étapes détaillées scrapées du HTML (contenu complet)
  if (scrapedDetailed && scrapedDetailed.length > 0) {
    return scrapedDetailed.map((inst, index) => ({
      step: inst.step || index + 1,
      title: inst.title || null,
      content: inst.content || inst.title,
    }));
  }

  // Priorité 2: JSON-LD (mais souvent incomplet/résumé)
  if (jsonLdInstructions && jsonLdInstructions.length > 0) {
    return jsonLdInstructions.map((inst, index) => {
      const text = typeof inst === 'string' ? inst : inst.text;
      const name = typeof inst === 'string' ? null : inst.name;
      return {
        step: index + 1,
        title: name || null,
        content: cleanText(text),
      };
    });
  }

  // Priorité 3: HTML brut
  if (htmlInstructions) {
    const listItems = htmlInstructions.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    return listItems.map((li, index) => ({
      step: index + 1,
      content: cleanText(li),
    }));
  }

  return [];
}

/**
 * Importer les catégories principales
 */
async function importCategories(recipes: WPRecipe[]): Promise<Map<number, number>> {
  console.log('📁 Import des catégories...');
  const idMap = new Map<number, number>();
  const seen = new Set<number>();

  const categories: Array<{ id: number; slug: string; name: string; taxonomy: string }> = [];

  for (const recipe of recipes) {
    const terms = recipe._embedded?.['wp:term'] || [];
    for (const termGroup of terms) {
      for (const term of termGroup) {
        if (term.taxonomy === 'recette_category' && !seen.has(term.id)) {
          seen.add(term.id);
          categories.push(term);
        }
      }
    }
  }

  for (const cat of categories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert({ slug: cat.slug, name: cat.name }, { onConflict: 'slug' })
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
 * Importer les taxonomies (ingrédients, origines, types de cuisine)
 */
async function importTaxonomies(recipes: WPRecipe[]): Promise<{
  ingredientMap: Map<number, number>;
  origineMap: Map<number, number>;
  cuisineTypeMap: Map<number, number>;
}> {
  console.log('\n📁 Import des taxonomies...');

  const ingredientMap = new Map<number, number>();
  const origineMap = new Map<number, number>();
  const cuisineTypeMap = new Map<number, number>();

  const ingredientsSeen = new Set<number>();
  const originesSeen = new Set<number>();
  const cuisineTypesSeen = new Set<number>();

  const ingredientsList: Array<{ id: number; slug: string; name: string }> = [];
  const originesList: Array<{ id: number; slug: string; name: string }> = [];
  const cuisineTypesList: Array<{ id: number; slug: string; name: string }> = [];

  for (const recipe of recipes) {
    const terms = recipe._embedded?.['wp:term'] || [];
    for (const termGroup of terms) {
      for (const term of termGroup) {
        if (term.taxonomy === 'ingredient' && !ingredientsSeen.has(term.id)) {
          ingredientsSeen.add(term.id);
          ingredientsList.push(term);
        }
        if (term.taxonomy === 'origine' && !originesSeen.has(term.id)) {
          originesSeen.add(term.id);
          originesList.push(term);
        }
        if (term.taxonomy === 'type-de-cuisine' && !cuisineTypesSeen.has(term.id)) {
          cuisineTypesSeen.add(term.id);
          cuisineTypesList.push(term);
        }
      }
    }
  }

  // Import ingrédients
  console.log('  Ingrédients...');
  for (const item of ingredientsList) {
    const { data, error } = await supabase
      .from('ingredients')
      .upsert({ slug: item.slug, name: item.name }, { onConflict: 'slug' })
      .select()
      .single();

    if (!error && data) {
      ingredientMap.set(item.id, data.id);
    }
  }
  console.log(`    ✓ ${ingredientsList.length} ingrédients`);

  // Import origines
  console.log('  Origines...');
  for (const item of originesList) {
    const { data, error } = await supabase
      .from('origines')
      .upsert({ slug: item.slug, name: item.name }, { onConflict: 'slug' })
      .select()
      .single();

    if (!error && data) {
      origineMap.set(item.id, data.id);
    }
  }
  console.log(`    ✓ ${originesList.length} origines`);

  // Import types de cuisine
  console.log('  Types de cuisine...');
  for (const item of cuisineTypesList) {
    const { data, error } = await supabase
      .from('cuisine_types')
      .upsert({ slug: item.slug, name: item.name }, { onConflict: 'slug' })
      .select()
      .single();

    if (!error && data) {
      cuisineTypeMap.set(item.id, data.id);
    }
  }
  console.log(`    ✓ ${cuisineTypesList.length} types de cuisine`);

  return { ingredientMap, origineMap, cuisineTypeMap };
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Import WordPress → Supabase (avec tous les champs ACF)\n');
  console.log(`WordPress: ${WORDPRESS_URL}`);
  console.log(`Supabase: ${SUPABASE_URL}\n`);

  const skipImages = process.argv.includes('--skip-images');
  if (skipImages) console.log('⚠️ Upload des images désactivé\n');

  // 1. Récupérer la liste des recettes
  const recipes = await fetchAllRecipes();

  // 2. Importer les catégories
  const categoryIdMap = await importCategories(recipes);

  // 3. Importer les taxonomies
  const { ingredientMap, origineMap, cuisineTypeMap } = await importTaxonomies(recipes);

  // 4. Importer chaque recette
  console.log('\n🍳 Import des recettes...\n');
  let success = 0;
  let failed = 0;

  for (const wpRecipe of recipes) {
    const title = cleanText(wpRecipe.title.rendered);
    console.log(`Processing: ${title}`);

    try {
      // Récupérer les données de la page (JSON-LD + scraping)
      const { jsonLd, scraped } = await fetchRecipeData(wpRecipe.link);

      // ACF fields directement depuis l'API (si disponible)
      const acf = wpRecipe.acf || {};

      // Image
      let featuredImage: string | null = null;
      const imgUrl = wpRecipe._embedded?.['wp:featuredmedia']?.[0]?.source_url
        || (typeof acf.thumbnail_url === 'string' ? acf.thumbnail_url : acf.thumbnail_url?.url);

      if (imgUrl) {
        featuredImage = skipImages ? imgUrl : await uploadImage(imgUrl);
        if (!skipImages && featuredImage !== imgUrl) {
          console.log(`  ✓ Image uploadée`);
        }
      }

      // Temps (priorité: ACF > JSON-LD)
      const prepTime = acf.prep_time || parseDuration(jsonLd?.prepTime) || 0;
      const cookTime = acf.cook_time || parseDuration(jsonLd?.cookTime) || 0;
      const totalTime = acf.total_time || parseDuration(jsonLd?.totalTime) || (prepTime + cookTime);

      // Portions
      let servings = acf.serves || 4;
      if (!acf.serves && jsonLd?.recipeYield) {
        const yieldStr = Array.isArray(jsonLd.recipeYield)
          ? jsonLd.recipeYield.find(y => /^\d+$/.test(y)) || jsonLd.recipeYield[0]
          : jsonLd.recipeYield;
        const match = yieldStr.match(/(\d+)/);
        if (match) servings = parseInt(match[1]);
      }

      // Ingrédients (priorité: ACF > JSON-LD > scraped)
      const ingredients = parseIngredients(
        jsonLd?.recipeIngredient,
        acf.ingredients || scraped.ingredients
      );

      // Instructions - PRIORITÉ aux étapes détaillées scrapées
      const instructions = parseInstructions(
        scraped.instructionsDetailed,  // Priorité 1: étapes détaillées scrapées
        jsonLd?.recipeInstructions as any,  // Priorité 2: JSON-LD
        acf.les_etapes || scraped.instructions  // Priorité 3: HTML brut
      );

      // Nutrition - ajouter fallback sur calories scrapées
      let nutrition = null;
      if (acf.calories) {
        nutrition = { calories: acf.calories };
      } else if (jsonLd?.nutrition?.calories) {
        const calMatch = jsonLd.nutrition.calories.match(/(\d+)/);
        if (calMatch) nutrition = { calories: parseInt(calMatch[1]) };
      } else if (scraped.calories) {
        nutrition = { calories: scraped.calories };
      }

      // Champs additionnels
      const introduction = acf.introduction || scraped.introduction || null;
      const conclusion = acf.conclusion || scraped.conclusion || null;
      const faq = acf.faq || scraped.faq || null;
      const videoUrl = acf.video || scraped.video || null;
      // Astuces scrapées séparément
      const astuces = scraped.astuces || null;

      // Insérer la recette
      const { data: insertedRecipe, error } = await supabase
        .from('recipes')
        .upsert({
          slug: wpRecipe.slug,
          title: title,
          excerpt: jsonLd?.description ? cleanText(jsonLd.description) : null,
          content: astuces ? cleanHtml(astuces) : null,
          featured_image: featuredImage,
          introduction: introduction ? cleanHtml(introduction) : null,
          conclusion: conclusion ? cleanHtml(conclusion) : null,
          video_url: videoUrl,
          faq: faq ? cleanHtml(faq) : null,
          prep_time: prepTime,
          cook_time: cookTime,
          total_time: totalTime,
          servings: servings,
          difficulty: 'moyen',
          ingredients: ingredients,
          instructions: instructions,
          nutrition: nutrition,
          cuisine: jsonLd?.recipeCuisine
            ? (Array.isArray(jsonLd.recipeCuisine) ? jsonLd.recipeCuisine[0] : jsonLd.recipeCuisine)
            : null,
          author: 'Menucochon',
          published_at: wpRecipe.date,
          updated_at: wpRecipe.modified,
          likes: 0,
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error(`  ❌ Erreur DB: ${error.message}`);
        failed++;
        continue;
      }

      // Lier les catégories
      const allTerms = (wpRecipe._embedded?.['wp:term'] || []).flat();

      // Catégories principales
      const categoryLinks = allTerms
        .filter(term => term.taxonomy === 'recette_category')
        .map(term => {
          const newId = categoryIdMap.get(term.id);
          return newId ? { recipe_id: insertedRecipe.id, category_id: newId } : null;
        })
        .filter(Boolean);

      if (categoryLinks.length > 0) {
        await supabase.from('recipe_categories').delete().eq('recipe_id', insertedRecipe.id);
        await supabase.from('recipe_categories').insert(categoryLinks as any[]);
      }

      // Ingrédients tags
      const ingredientLinks = allTerms
        .filter(term => term.taxonomy === 'ingredient')
        .map(term => {
          const newId = ingredientMap.get(term.id);
          return newId ? { recipe_id: insertedRecipe.id, ingredient_id: newId } : null;
        })
        .filter(Boolean);

      if (ingredientLinks.length > 0) {
        await supabase.from('recipe_ingredients').delete().eq('recipe_id', insertedRecipe.id);
        await supabase.from('recipe_ingredients').insert(ingredientLinks as any[]);
      }

      // Origines
      const origineLinks = allTerms
        .filter(term => term.taxonomy === 'origine')
        .map(term => {
          const newId = origineMap.get(term.id);
          return newId ? { recipe_id: insertedRecipe.id, origine_id: newId } : null;
        })
        .filter(Boolean);

      if (origineLinks.length > 0) {
        await supabase.from('recipe_origines').delete().eq('recipe_id', insertedRecipe.id);
        await supabase.from('recipe_origines').insert(origineLinks as any[]);
      }

      // Types de cuisine
      const cuisineTypeLinks = allTerms
        .filter(term => term.taxonomy === 'type-de-cuisine')
        .map(term => {
          const newId = cuisineTypeMap.get(term.id);
          return newId ? { recipe_id: insertedRecipe.id, cuisine_type_id: newId } : null;
        })
        .filter(Boolean);

      if (cuisineTypeLinks.length > 0) {
        await supabase.from('recipe_cuisine_types').delete().eq('recipe_id', insertedRecipe.id);
        await supabase.from('recipe_cuisine_types').insert(cuisineTypeLinks as any[]);
      }

      const details = [
        ingredients[0]?.items?.length ? `${ingredients[0].items.length} ing` : null,
        instructions.length ? `${instructions.length} étapes` : null,
        introduction ? 'intro' : null,
        conclusion ? 'concl' : null,
        faq ? 'faq' : null,
        videoUrl ? 'video' : null,
      ].filter(Boolean).join(', ');

      console.log(`  ✓ Importé (${details})`);
      success++;

    } catch (error) {
      console.error(`  ❌ Erreur:`, error);
      failed++;
    }

    // Petite pause
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Import terminé!`);
  console.log(`   ${success} recettes importées`);
  if (failed > 0) console.log(`   ${failed} erreurs`);
}

main().catch(console.error);
