/**
 * Génération d'un livre de recettes PDF - 50 recettes variées Menucochon
 * Format livre: page gauche = image + titre, page droite = détails
 *
 * Usage: npx tsx scripts/generate-recipe-book.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';
import http from 'http';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Configuration du livre
const BOOK_CONFIG = {
  title: 'Les 50 Meilleures Recettes',
  subtitle: 'Menucochon',
  author: 'Menucochon.com',
  year: new Date().getFullYear(),
  recipesPerCategory: {
    'Plats principaux - Boeuf': 5,
    'Plats principaux - Volaille': 5,
    'Plats principaux - Porc': 5,
    'Plats principaux - Poissons': 3,
    'Soupes': 5,
    'Desserts': 8,
    'Pâtes': 4,
    'Salades': 3,
    'Déjeuner': 4,
    'Accompagnements': 4,
    'Boissons': 2,
    'Poutine': 2,
  }
};

interface Recipe {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string | null;
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  servings_unit: string;
  difficulty: string;
  ingredients: any[];
  instructions: any[];
  categories: any[];
}

// Catégories et leurs slugs
const CATEGORY_MAP: Record<string, string> = {
  'Plats principaux - Boeuf': 'plats-principaux-boeuf',
  'Plats principaux - Volaille': 'plats-principaux-volaille',
  'Plats principaux - Porc': 'plats-principaux-porc',
  'Plats principaux - Poissons': 'plat-principaux-poissons',
  'Soupes': 'soupes',
  'Desserts': 'dessert',
  'Pâtes': 'pates',
  'Salades': 'salades',
  'Déjeuner': 'dejeuner',
  'Accompagnements': 'plats-daccompagnement-legumes',
  'Boissons': 'boissons',
  'Poutine': 'poutine',
};

// Télécharger une image
async function downloadImage(url: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, { timeout: 5000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Suivre la redirection
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl).then(resolve);
          return;
        }
      }

      if (response.statusCode !== 200) {
        resolve(null);
        return;
      }

      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', () => resolve(null));
    });

    request.on('error', () => resolve(null));
    request.on('timeout', () => {
      request.destroy();
      resolve(null);
    });
  });
}

// Récupérer les recettes par catégorie
async function getRecipesByCategory(categorySlug: string, limit: number): Promise<Recipe[]> {
  const { data: categoryData } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!categoryData) return [];

  const { data: recipeIds } = await supabase
    .from('recipe_categories')
    .select('recipe_id')
    .eq('category_id', categoryData.id)
    .limit(limit * 2); // Récupérer plus pour avoir du choix

  if (!recipeIds || recipeIds.length === 0) return [];

  const ids = recipeIds.map(r => r.recipe_id);

  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .in('id', ids)
    .not('featured_image', 'is', null)
    .limit(limit);

  return (recipes || []) as Recipe[];
}

// Nettoyer le HTML
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Formater les ingrédients
function formatIngredients(ingredients: any[]): string[] {
  const lines: string[] = [];

  for (const group of ingredients) {
    if (group.title) {
      lines.push(`\n${group.title}:`);
    }

    for (const item of group.items || []) {
      let line = '';
      if (item.quantity) line += item.quantity + ' ';
      if (item.unit) line += item.unit + ' ';
      line += item.name;
      if (item.note) line += ` (${item.note})`;
      lines.push('• ' + line.trim());
    }
  }

  return lines;
}

// Formater les instructions
function formatInstructions(instructions: any[]): string[] {
  return instructions.map((inst, index) => {
    const stepNum = inst.step || index + 1;
    const title = inst.title ? `${inst.title}: ` : '';
    const content = stripHtml(inst.content || '');
    return `${stepNum}. ${title}${content}`;
  });
}

async function generatePDF() {
  console.log('📚 Génération du livre de recettes Menucochon...\n');

  // Récupérer les recettes par catégorie
  const allRecipes: { category: string; recipes: Recipe[] }[] = [];

  for (const [categoryName, count] of Object.entries(BOOK_CONFIG.recipesPerCategory)) {
    const categorySlug = CATEGORY_MAP[categoryName];
    if (!categorySlug) continue;

    console.log(`📂 ${categoryName}...`);
    const recipes = await getRecipesByCategory(categorySlug, count);

    if (recipes.length > 0) {
      allRecipes.push({ category: categoryName, recipes });
      console.log(`   ✓ ${recipes.length} recettes trouvées`);
    } else {
      console.log(`   ⚠ Aucune recette trouvée`);
    }
  }

  const totalRecipes = allRecipes.reduce((sum, cat) => sum + cat.recipes.length, 0);
  console.log(`\n📊 Total: ${totalRecipes} recettes\n`);

  // Créer le PDF
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
    info: {
      Title: `${BOOK_CONFIG.title} - ${BOOK_CONFIG.subtitle}`,
      Author: BOOK_CONFIG.author,
      Creator: 'Menucochon.com',
    }
  });

  const outputPath = path.join(process.cwd(), 'public', 'livre-recettes-menucochon.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // === PAGE COUVERTURE ===
  console.log('📄 Création de la page couverture...');

  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1a1a1a');

  // Titre principal
  doc.fillColor('#F77313')
     .fontSize(48)
     .font('Helvetica-Bold')
     .text(BOOK_CONFIG.title, 72, 200, { align: 'center' });

  // Sous-titre
  doc.fillColor('#ffffff')
     .fontSize(32)
     .font('Helvetica')
     .text(BOOK_CONFIG.subtitle, 72, 280, { align: 'center' });

  // Ligne décorative
  doc.strokeColor('#F77313')
     .lineWidth(3)
     .moveTo(200, 340)
     .lineTo(412, 340)
     .stroke();

  // Description
  doc.fillColor('#999999')
     .fontSize(14)
     .text('Recettes québécoises gourmandes', 72, 380, { align: 'center' });

  // Année
  doc.fillColor('#666666')
     .fontSize(12)
     .text(`© ${BOOK_CONFIG.year} ${BOOK_CONFIG.author}`, 72, 700, { align: 'center' });

  // === TABLE DES MATIÈRES ===
  doc.addPage();
  console.log('📄 Création de la table des matières...');

  doc.fillColor('#1a1a1a')
     .fontSize(28)
     .font('Helvetica-Bold')
     .text('Table des matières', 72, 72);

  doc.strokeColor('#F77313')
     .lineWidth(2)
     .moveTo(72, 110)
     .lineTo(250, 110)
     .stroke();

  let tocY = 140;
  let recipeIndex = 0;

  for (const { category, recipes } of allRecipes) {
    // Catégorie
    doc.fillColor('#F77313')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text(category, 72, tocY);
    tocY += 20;

    // Recettes de la catégorie
    for (const recipe of recipes) {
      recipeIndex++;
      // Page = 2 (couverture + TOC) + (recipeIndex * 2) pour les 2 pages par recette
      const pageNum = 2 + (recipeIndex * 2);

      const title = recipe.title.length > 40
        ? recipe.title.substring(0, 40) + '...'
        : recipe.title;

      doc.fillColor('#333333')
         .fontSize(11)
         .font('Helvetica')
         .text(`  ${title}`, 72, tocY, { continued: true })
         .text(` p.${pageNum}`, { align: 'right' });

      tocY += 16;

      if (tocY > 700) {
        doc.addPage();
        tocY = 72;
      }
    }

    tocY += 10;
  }

  // === PAGES DE RECETTES (Format livre: gauche=image, droite=détails) ===
  let recipeCount = 0;

  for (const { category, recipes } of allRecipes) {
    for (const recipe of recipes) {
      recipeCount++;
      console.log(`📄 [${recipeCount}/${totalRecipes}] ${recipe.title}`);

      // ========================================
      // PAGE GAUCHE: Image + Titre
      // ========================================
      doc.addPage();

      // Fond sombre pour la page image
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1a1a1a');

      // Télécharger et afficher l'image
      let imageLoaded = false;
      if (recipe.featured_image) {
        try {
          console.log(`   → Téléchargement image: ${recipe.featured_image.substring(0, 60)}...`);
          const imageBuffer = await downloadImage(recipe.featured_image);
          if (imageBuffer && imageBuffer.length > 0) {
            console.log(`   ✓ Image téléchargée (${(imageBuffer.length / 1024).toFixed(0)} KB)`);
            // Image pleine largeur en haut
            doc.image(imageBuffer, 0, 0, {
              width: doc.page.width,
              height: 450,
              fit: [doc.page.width, 450],
              align: 'center',
              valign: 'center'
            });
            imageLoaded = true;

            // Overlay gradient sombre en bas de l'image
            doc.rect(0, 350, doc.page.width, 100).fill('#1a1a1a');
          } else {
            console.log(`   ✗ Image vide ou null`);
          }
        } catch (e: any) {
          // Image placeholder si erreur
          console.log(`   ✗ Erreur image: ${e.message}`);
        }
      }

      if (!imageLoaded) {
        doc.rect(0, 0, doc.page.width, 450).fill('#2a2a2a');
        doc.fillColor('#444444')
           .fontSize(14)
           .font('Helvetica')
           .text('Image non disponible', 0, 200, { align: 'center', width: doc.page.width });
      }

      // Catégorie (badge)
      doc.fillColor('#F77313')
         .fontSize(11)
         .font('Helvetica-Bold')
         .text(category.toUpperCase(), 72, 480, { align: 'left' });

      // Titre de la recette (grand)
      doc.fillColor('#ffffff')
         .fontSize(32)
         .font('Helvetica-Bold')
         .text(recipe.title, 72, 510, { width: 468 });

      // Ligne décorative
      const titleEndY = doc.y + 20;
      doc.strokeColor('#F77313')
         .lineWidth(4)
         .moveTo(72, titleEndY)
         .lineTo(200, titleEndY)
         .stroke();

      // Description courte
      if (recipe.excerpt) {
        doc.fillColor('#999999')
           .fontSize(12)
           .font('Helvetica-Oblique')
           .text(stripHtml(recipe.excerpt).substring(0, 200) + '...', 72, titleEndY + 20, { width: 468 });
      }

      // Infos en bas de page
      const infosY = 700;
      doc.fillColor('#F77313')
         .fontSize(10)
         .font('Helvetica-Bold');

      let infoX = 72;
      if (recipe.total_time) {
        doc.text(`⏱ ${recipe.total_time} min`, infoX, infosY);
        infoX += 100;
      }
      if (recipe.servings) {
        doc.text(`👥 ${recipe.servings} ${recipe.servings_unit || 'portions'}`, infoX, infosY);
        infoX += 120;
      }
      if (recipe.difficulty) {
        doc.text(`📊 ${recipe.difficulty}`, infoX, infosY);
      }

      // Numéro de page (gauche)
      doc.fillColor('#666666')
         .fontSize(10)
         .font('Helvetica')
         .text(`${recipeCount * 2}`, 72, 750);

      // ========================================
      // PAGE DROITE: Ingrédients + Instructions
      // ========================================
      doc.addPage();

      // Fond blanc/clair
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fafafa');

      let currentY = 50;

      // === INGRÉDIENTS ===
      doc.fillColor('#F77313')
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('Ingrédients', 72, currentY);

      doc.strokeColor('#F77313')
         .lineWidth(2)
         .moveTo(72, currentY + 25)
         .lineTo(180, currentY + 25)
         .stroke();

      currentY += 40;

      const ingredients = formatIngredients(recipe.ingredients || []);

      doc.fillColor('#333333')
         .fontSize(11)
         .font('Helvetica');

      for (const line of ingredients) {
        if (line.startsWith('\n')) {
          currentY += 8;
          doc.fillColor('#F77313')
             .font('Helvetica-Bold')
             .text(line.trim(), 72, currentY, { width: 468 });
          doc.fillColor('#333333')
             .font('Helvetica');
        } else {
          doc.text(line, 72, currentY, { width: 468 });
        }
        currentY = doc.y + 4;

        if (currentY > 350) break;
      }

      // === PRÉPARATION ===
      currentY = Math.max(currentY + 20, 380);

      doc.fillColor('#F77313')
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('Préparation', 72, currentY);

      doc.strokeColor('#F77313')
         .lineWidth(2)
         .moveTo(72, currentY + 25)
         .lineTo(180, currentY + 25)
         .stroke();

      currentY += 40;

      const instructions = formatInstructions(recipe.instructions || []);

      for (const instruction of instructions) {
        doc.fillColor('#333333')
           .fontSize(10)
           .font('Helvetica')
           .text(instruction, 72, currentY, { width: 468 });
        currentY = doc.y + 10;

        if (currentY > 700) break;
      }

      // Pied de page avec URL
      doc.fillColor('#999999')
         .fontSize(8)
         .font('Helvetica')
         .text(`menucochon.com/recette/${recipe.slug}`, 72, 740, { align: 'center' });

      // Numéro de page (droite)
      doc.fillColor('#666666')
         .fontSize(10)
         .font('Helvetica')
         .text(`${recipeCount * 2 + 1}`, 540, 750, { align: 'right' });
    }
  }

  // === PAGE FINALE ===
  doc.addPage();

  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1a1a1a');

  doc.fillColor('#F77313')
     .fontSize(24)
     .font('Helvetica-Bold')
     .text('Merci!', 72, 300, { align: 'center' });

  doc.fillColor('#ffffff')
     .fontSize(14)
     .font('Helvetica')
     .text('Découvrez plus de 2000 recettes sur', 72, 350, { align: 'center' });

  doc.fillColor('#F77313')
     .fontSize(18)
     .font('Helvetica-Bold')
     .text('menucochon.com', 72, 380, { align: 'center' });

  doc.fillColor('#666666')
     .fontSize(11)
     .font('Helvetica')
     .text('Recettes québécoises gourmandes', 72, 420, { align: 'center' });

  // Finaliser
  doc.end();

  return new Promise<string>((resolve) => {
    stream.on('finish', () => {
      console.log(`\n✅ Livre généré avec succès!`);
      console.log(`📁 Fichier: ${outputPath}`);
      console.log(`📊 ${totalRecipes} recettes incluses`);
      resolve(outputPath);
    });
  });
}

generatePDF().catch(console.error);
