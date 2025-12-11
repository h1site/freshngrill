/**
 * Script pour télécharger les images des recettes exportées
 *
 * USAGE:
 * 1. Placez votre fichier JSON exporté dans src/data/recipes.json
 * 2. Exécutez: npx ts-node scripts/download-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

interface Recipe {
  id: number;
  slug: string;
  featuredImage: string;
  images: string[];
  instructions: { image?: string }[];
}

interface ExportData {
  recipes: Recipe[];
}

const DATA_PATH = path.join(__dirname, '../src/data/recipes.json');
const IMAGES_DIR = path.join(__dirname, '../public/images/recipes');

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url || fs.existsSync(filepath)) {
      resolve(false);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          // Suivre la redirection
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            downloadImage(redirectUrl, filepath).then(resolve);
            return;
          }
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      })
      .on('error', (err) => {
        fs.unlink(filepath, () => {});
        console.error(`Erreur téléchargement ${url}:`, err.message);
        resolve(false);
      });
  });
}

function getFilenameFromUrl(url: string): string {
  const urlObj = new URL(url);
  return path.basename(urlObj.pathname);
}

async function main() {
  // Vérifier que le fichier JSON existe
  if (!fs.existsSync(DATA_PATH)) {
    console.error('❌ Fichier recipes.json non trouvé dans src/data/');
    console.log('   Exportez d\'abord vos recettes depuis WordPress');
    process.exit(1);
  }

  // Créer le dossier images
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Charger les données
  const data: ExportData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const recipes = data.recipes;

  console.log(`📦 ${recipes.length} recettes à traiter\n`);

  let totalImages = 0;
  let downloadedImages = 0;
  const imageMapping: Record<string, string> = {};

  for (const recipe of recipes) {
    const recipeDir = path.join(IMAGES_DIR, recipe.slug);
    if (!fs.existsSync(recipeDir)) {
      fs.mkdirSync(recipeDir, { recursive: true });
    }

    console.log(`🍳 ${recipe.slug}`);

    // Image principale
    if (recipe.featuredImage) {
      totalImages++;
      const filename = 'featured-' + getFilenameFromUrl(recipe.featuredImage);
      const filepath = path.join(recipeDir, filename);
      const downloaded = await downloadImage(recipe.featuredImage, filepath);

      if (downloaded) {
        downloadedImages++;
        console.log(`   ✅ Image principale`);
      }

      imageMapping[recipe.featuredImage] = `/images/recipes/${recipe.slug}/${filename}`;
    }

    // Galerie
    if (recipe.images && recipe.images.length > 0) {
      for (let i = 0; i < recipe.images.length; i++) {
        const imgUrl = recipe.images[i];
        if (imgUrl) {
          totalImages++;
          const filename = `gallery-${i + 1}-` + getFilenameFromUrl(imgUrl);
          const filepath = path.join(recipeDir, filename);
          const downloaded = await downloadImage(imgUrl, filepath);

          if (downloaded) {
            downloadedImages++;
          }

          imageMapping[imgUrl] = `/images/recipes/${recipe.slug}/${filename}`;
        }
      }
    }

    // Images des étapes
    if (recipe.instructions) {
      for (let i = 0; i < recipe.instructions.length; i++) {
        const step = recipe.instructions[i];
        if (step.image) {
          totalImages++;
          const filename = `step-${i + 1}-` + getFilenameFromUrl(step.image);
          const filepath = path.join(recipeDir, filename);
          const downloaded = await downloadImage(step.image, filepath);

          if (downloaded) {
            downloadedImages++;
          }

          imageMapping[step.image] = `/images/recipes/${recipe.slug}/${filename}`;
        }
      }
    }
  }

  // Sauvegarder le mapping des images
  fs.writeFileSync(
    path.join(__dirname, '../src/data/image-mapping.json'),
    JSON.stringify(imageMapping, null, 2)
  );

  // Créer une version mise à jour du JSON avec les chemins locaux
  const updatedRecipes = recipes.map((recipe) => ({
    ...recipe,
    featuredImage: imageMapping[recipe.featuredImage] || recipe.featuredImage,
    images: recipe.images?.map((img) => imageMapping[img] || img) || [],
    instructions: recipe.instructions?.map((step) => ({
      ...step,
      image: step.image ? imageMapping[step.image] || step.image : undefined,
    })),
  }));

  const updatedData = { ...data, recipes: updatedRecipes };
  fs.writeFileSync(
    path.join(__dirname, '../src/data/recipes-local.json'),
    JSON.stringify(updatedData, null, 2)
  );

  console.log(`\n✨ Terminé!`);
  console.log(`   ${downloadedImages}/${totalImages} images téléchargées`);
  console.log(`   📁 Dossier: public/images/recipes/`);
  console.log(`   📄 JSON mis à jour: src/data/recipes-local.json`);
}

main().catch(console.error);
