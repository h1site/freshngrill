'use client';

import { Printer } from 'lucide-react';
import { Recipe } from '@/types/recipe';

interface Props {
  recipe: Recipe;
  compact?: boolean;
}

export default function PrintButton({ recipe, compact = false }: Props) {
  const handlePrint = () => {
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Formater les ingrédients
    const ingredientsHTML = recipe.ingredients
      .map(
        (group) => `
        ${group.title ? `<h3 style="font-size: 14px; font-weight: 600; color: #F77313; margin: 16px 0 8px 0; text-transform: uppercase;">${group.title}</h3>` : ''}
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${group.items
            .map(
              (item) => `
            <li style="padding: 8px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
              <span style="width: 8px; height: 8px; background: #F77313; border-radius: 50%; margin-right: 12px; flex-shrink: 0;"></span>
              <span>
                ${item.quantity ? `<strong>${item.quantity}</strong>` : ''}
                ${item.unit ? `${item.unit}` : ''}
                ${item.name}
                ${item.note ? `<em style="color: #666;"> (${item.note})</em>` : ''}
              </span>
            </li>
          `
            )
            .join('')}
        </ul>
      `
      )
      .join('');

    // Formater les instructions
    const instructionsHTML = recipe.instructions
      .map(
        (step, index) => `
        <div style="display: flex; margin-bottom: 20px; page-break-inside: avoid;">
          <div style="flex-shrink: 0; width: 40px; height: 40px; background: #F77313; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 16px;">
            ${index + 1}
          </div>
          <div style="flex: 1; padding-top: 8px;">
            <p style="margin: 0; line-height: 1.6; color: #333;">${step.content}</p>
            ${step.tip ? `<p style="margin: 8px 0 0 0; padding: 8px 12px; background: #fff8f0; border-left: 3px solid #F77313; font-size: 13px; color: #666;"><strong>💡 Astuce:</strong> ${step.tip}</p>` : ''}
          </div>
        </div>
      `
      )
      .join('');

    // Créer le contenu HTML pour l'impression
    const printContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>${recipe.title} - Menu Cochon</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #1a1a1a;
            line-height: 1.5;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }

          @media print {
            body {
              padding: 20px;
            }

            .no-print {
              display: none !important;
            }

            .page-break {
              page-break-before: always;
            }
          }

          @page {
            margin: 1.5cm;
          }
        </style>
      </head>
      <body>
        <!-- Header avec logo -->
        <header style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 3px solid #F77313; margin-bottom: 30px;">
          <div>
            <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0; line-height: 1.2;">
              ${recipe.title}
            </h1>
            <p style="color: #666; font-size: 14px; margin-top: 4px;">menucochon.com</p>
          </div>
          <div style="text-align: right;">
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" fill="#F77313"/>
              <text x="50" y="58" text-anchor="middle" fill="white" font-size="24" font-weight="bold">MC</text>
            </svg>
          </div>
        </header>

        <!-- Photo -->
        ${
          recipe.featuredImage
            ? `
        <div style="margin-bottom: 30px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <img src="${recipe.featuredImage}" alt="${recipe.title}" style="width: 100%; height: 250px; object-fit: cover; display: block;" />
        </div>
        `
            : ''
        }

        <!-- Informations rapides -->
        <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 30px; padding: 20px; background: #f9f9f9; border-radius: 12px;">
          ${
            recipe.prepTime > 0
              ? `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">⏱️</span>
            <div>
              <div style="font-size: 11px; color: #666; text-transform: uppercase;">Préparation</div>
              <div style="font-weight: 600;">${recipe.prepTime} min</div>
            </div>
          </div>
          `
              : ''
          }
          ${
            recipe.cookTime > 0
              ? `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">🍳</span>
            <div>
              <div style="font-size: 11px; color: #666; text-transform: uppercase;">Cuisson</div>
              <div style="font-weight: 600;">${recipe.cookTime} min</div>
            </div>
          </div>
          `
              : ''
          }
          ${
            recipe.servings > 0
              ? `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">👥</span>
            <div>
              <div style="font-size: 11px; color: #666; text-transform: uppercase;">Portions</div>
              <div style="font-weight: 600;">${recipe.servings} ${recipe.servingsUnit || 'portions'}</div>
            </div>
          </div>
          `
              : ''
          }
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">👨‍🍳</span>
            <div>
              <div style="font-size: 11px; color: #666; text-transform: uppercase;">Difficulté</div>
              <div style="font-weight: 600; text-transform: capitalize;">${recipe.difficulty}</div>
            </div>
          </div>
        </div>

        <!-- Deux colonnes: Ingrédients et Instructions -->
        <div style="display: grid; grid-template-columns: 280px 1fr; gap: 40px;">
          <!-- Ingrédients -->
          <div style="background: #fff; border: 2px solid #F77313; border-radius: 12px; padding: 24px; height: fit-content;">
            <h2 style="font-size: 18px; font-weight: 700; color: #F77313; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #f0f0f0; text-transform: uppercase;">
              🥗 Ingrédients
            </h2>
            ${ingredientsHTML}
          </div>

          <!-- Instructions -->
          <div>
            <h2 style="font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #F77313; text-transform: uppercase;">
              📝 Instructions
            </h2>
            ${instructionsHTML}
          </div>
        </div>

        <!-- Footer -->
        <footer style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #eee; text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 12px;">
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" fill="#F77313"/>
              <text x="50" y="58" text-anchor="middle" fill="white" font-size="24" font-weight="bold">MC</text>
            </svg>
            <span style="font-size: 20px; font-weight: 700; color: #F77313;">Menu Cochon</span>
          </div>
          <p style="color: #666; font-size: 13px; margin-bottom: 8px;">
            Retrouvez cette recette et des centaines d'autres sur
          </p>
          <p style="color: #F77313; font-weight: 600; font-size: 16px;">
            🌐 www.menucochon.com
          </p>
          <p style="color: #999; font-size: 11px; margin-top: 16px;">
            Bon appétit! 🍽️
          </p>
        </footer>

        <!-- Boutons (non visible à l'impression) -->
        <div class="no-print" style="position: fixed; bottom: 20px; right: 20px; display: flex; gap: 12px;">
          <button onclick="window.close()" style="background: #333; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            ← Retour
          </button>
          <button onclick="window.print()" style="background: #F77313; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(247,115,19,0.3);">
            🖨️ Imprimer
          </button>
        </div>
      </body>
      </html>
    `;

    // Écrire le contenu et ouvrir la boîte de dialogue d'impression
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Attendre que les images soient chargées avant d'imprimer
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  return (
    <button
      onClick={handlePrint}
      className={`flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium rounded-full transition-colors print:hidden ${
        compact ? 'p-2 md:px-4 md:py-2' : 'px-5 py-2.5'
      }`}
      title="Imprimer"
    >
      <Printer className={compact ? 'w-4 h-4 md:w-5 md:h-5' : 'w-5 h-5'} />
      <span className={compact ? 'hidden md:inline text-sm' : ''}>Imprimer</span>
    </button>
  );
}
