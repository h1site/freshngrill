/**
 * Script pour mettre à jour les instructions des recettes des fêtes
 * (FR et EN)
 *
 * Usage: npx tsx scripts/update-fetes-recipes-instructions.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================
// DONNÉES DES RECETTES
// ============================================

const recipesData = {
  fr: [
    {
      slug: "dinde-rotie-farcie-sauce-canneberges",
      instructions: [
        {
          step: 1,
          content: "Sortir la dinde du réfrigérateur 1 heure avant cuisson pour limiter le choc thermique et assurer une cuisson plus uniforme.",
          tip: "Une volaille trop froide risque de cuire inégalement (poitrine sèche, cuisses pas prêtes)."
        },
        {
          step: 2,
          content: "Préchauffer le four à 180 °C. Placer la grille au tiers inférieur. Préparer une rôtissoire avec une grille (si possible)."
        },
        {
          step: 3,
          content: "Préparer la farce : mélanger chair à saucisse, veau, oignon, céleri, ail, herbes, œuf, lait et chapelure/pain. Mélanger juste assez pour homogénéiser.",
          tip: "Trop mélanger rend la farce dense. Vise une texture souple et légèrement collante."
        },
        {
          step: 4,
          content: "Assaisonner l'intérieur de la dinde (sel/poivre). Farcir sans tasser. Replier l'excédent de peau (ou ficeler) pour retenir la farce."
        },
        {
          step: 5,
          content: "Mélanger beurre ramolli et huile. Badigeonner uniformément la peau. Assaisonner avec paprika, herbes de Provence, sel et poivre."
        },
        {
          step: 6,
          content: "Déposer oignon, carottes et céleri au fond de la rôtissoire. Verser 500 ml de bouillon. Déposer la dinde sur la grille (au-dessus des légumes).",
          tip: "Les légumes parfument le jus et évitent que les sucs brûlent au fond."
        },
        {
          step: 7,
          content: "Rôtir 3 à 3 h 30 (selon taille), en arrosant toutes les 30 minutes avec le jus de cuisson.",
          tip: "Arroser aide à dorer et limite le dessèchement de la peau."
        },
        {
          step: 8,
          content: "Si la peau colore trop vite, couvrir lâchement de papier aluminium (sans coller sur la peau) et poursuivre la cuisson."
        },
        {
          step: 9,
          content: "Vérifier la cuisson : retirer la dinde quand la poitrine atteint 74 °C (thermomètre inséré sans toucher l'os).",
          tip: "Si tu vérifies aussi la farce : elle doit atteindre 74 °C pour être sécuritaire."
        },
        {
          step: 10,
          content: "Laisser reposer la dinde 20 à 25 minutes, couverte lâchement, avant de découper pour que les jus se redistribuent."
        },
        {
          step: 11,
          content: "Sauce : mettre canneberges, sucre, jus d'orange, zeste et épices dans une casserole. Cuire 12 à 15 minutes à feu moyen en remuant, jusqu'à éclatement et texture nappante.",
          tip: "Pour une sauce plus lisse : écraser légèrement ou mixer rapidement."
        }
      ]
    },
    {
      slug: "tourtiere-du-quebec-porc-boeuf",
      instructions: [
        {
          step: 1,
          content: "Chauffer une casserole large à feu moyen. Ajouter porc, bœuf et oignon. Cuire 10 à 12 minutes en défaisant la viande jusqu'à évaporation complète du liquide."
        },
        {
          step: 2,
          content: "Ajouter l'ail et les épices (cannelle, clou, muscade). Cuire 60 secondes pour torréfier légèrement les épices et développer les arômes.",
          tip: "Cette minute change tout : arômes plus ronds et moins \"poudrés\"."
        },
        {
          step: 3,
          content: "Saupoudrer la farine. Mélanger 1 à 2 minutes pour bien enrober la viande : c'est la base de la liaison."
        },
        {
          step: 4,
          content: "Verser le bouillon chaud graduellement en remuant (comme une sauce) pour éviter les grumeaux. Amener à frémissement."
        },
        {
          step: 5,
          content: "Baisser à feu doux et mijoter 40 à 45 minutes, partiellement couvert, jusqu'à garniture épaisse (elle doit se tenir dans une cuillère).",
          tip: "Si trop liquide : prolonger 5–10 min. Si trop épais : ajouter un peu de bouillon."
        },
        {
          step: 6,
          content: "Refroidir 20 minutes (ou jusqu'à tiède). Une garniture trop chaude ramollit la pâte et peut provoquer une fuite."
        },
        {
          step: 7,
          content: "Préchauffer le four à 190 °C. Foncer un moule à tarte avec la première abaisse. Ajouter la garniture. Couvrir avec la seconde abaisse."
        },
        {
          step: 8,
          content: "Sceller les bords (pincer ou fourchette). Badigeonner d'œuf battu. Faire une cheminée au centre pour laisser la vapeur s'échapper."
        },
        {
          step: 9,
          content: "Cuire 50 minutes jusqu'à croûte bien dorée. Si la bordure brunit trop : protéger avec une bande d'aluminium."
        },
        {
          step: 10,
          content: "Repos 15 minutes avant de trancher pour stabiliser la garniture."
        }
      ]
    },
    {
      slug: "roti-de-porc-ail-romarin",
      instructions: [
        {
          step: 1,
          content: "Sortir le rôti du réfrigérateur 30 minutes avant cuisson. Éponger avec papier absorbant."
        },
        {
          step: 2,
          content: "Préchauffer le four à 170 °C. Préparer un plat allant au four ou une cocotte."
        },
        {
          step: 3,
          content: "Mélanger huile, ail écrasé, romarin, sel et poivre. Frotter le rôti sur toutes les faces."
        },
        {
          step: 4,
          content: "Saisir le rôti dans une poêle très chaude 2 à 3 minutes par face pour colorer.",
          tip: "La saisie crée une croûte aromatique (réaction de Maillard) : goût plus profond."
        },
        {
          step: 5,
          content: "Déposer le rôti dans le plat. Ajouter 250 ml de bouillon au fond (sans noyer le rôti)."
        },
        {
          step: 6,
          content: "Cuire environ 2 heures en arrosant toutes les 30 minutes avec le jus.",
          tip: "Si le fond sèche : ajouter 50–100 ml de bouillon."
        },
        {
          step: 7,
          content: "Vérifier la cuisson : retirer à 63 °C au cœur (thermomètre), puis laisser remonter en repos."
        },
        {
          step: 8,
          content: "Repos 15 minutes, couvert lâchement. Trancher contre le grain."
        },
        {
          step: 9,
          content: "Option sauce rapide : déglacer le plat avec un peu de bouillon, gratter les sucs et réduire 3–5 minutes."
        }
      ]
    },
    {
      slug: "jambon-glace-a-lerable",
      instructions: [
        {
          step: 1,
          content: "Préchauffer le four à 160 °C. Placer le jambon dans une rôtissoire."
        },
        {
          step: 2,
          content: "Ajouter un fond d'eau chaude (ou bouillon) au fond de la rôtissoire pour maintenir l'humidité."
        },
        {
          step: 3,
          content: "Couvrir (couvercle ou aluminium) et cuire 1 h 30 en arrosant toutes les 20–30 minutes avec le jus."
        },
        {
          step: 4,
          content: "Préparer le glaçage : mélanger sirop d'érable, moutarde de Dijon, vinaigre de cidre et poivre."
        },
        {
          step: 5,
          content: "Découvrir le jambon. Badigeonner généreusement de glaçage. Remettre au four 10 minutes."
        },
        {
          step: 6,
          content: "Répéter le badigeonnage 2 à 3 fois (toutes les 10 minutes) pour superposer les couches et caraméliser."
        },
        {
          step: 7,
          content: "Terminer 5 minutes sous le gril (optionnel) pour une finition brillante, en surveillant constamment.",
          tip: "Ça peut brûler vite : rester devant le four."
        },
        {
          step: 8,
          content: "Repos 10 minutes avant de trancher pour garder le jambon juteux."
        }
      ]
    }
  ],
  en: [
    {
      slug: "dinde-rotie-farcie-sauce-canneberges",
      slug_en: "stuffed-roast-turkey-cranberry-sauce",
      instructions: [
        {
          step: 1,
          content: "Remove the turkey from the refrigerator 1 hour before roasting for more even cooking.",
          tip: "A very cold turkey can lead to dry breast meat while the legs lag behind."
        },
        {
          step: 2,
          content: "Preheat the oven to 180 °C. Set the rack in the lower third. Prepare a roasting pan with a rack if possible."
        },
        {
          step: 3,
          content: "Make the stuffing: gently mix sausage meat, veal, vegetables, herbs, egg, milk, and breadcrumbs until just combined."
        },
        {
          step: 4,
          content: "Season the cavity, then loosely stuff the turkey—do not pack it tight."
        },
        {
          step: 5,
          content: "Brush the skin with softened butter and oil. Season with paprika, herbs, salt, and pepper."
        },
        {
          step: 6,
          content: "Add aromatic vegetables to the pan, pour in the stock, and set the turkey on the rack above the vegetables.",
          tip: "The vegetables flavor the drippings and help prevent scorching."
        },
        {
          step: 7,
          content: "Roast for 3 to 3½ hours, basting every 30 minutes with pan juices."
        },
        {
          step: 8,
          content: "If the skin browns too quickly, tent loosely with foil and continue roasting."
        },
        {
          step: 9,
          content: "Remove when the breast reaches 74 °C (165 °F) internal temperature (probe without touching bone).",
          tip: "If checking stuffing too, it should also reach 74 °C (165 °F)."
        },
        {
          step: 10,
          content: "Rest the turkey 20–25 minutes, loosely covered, before carving."
        },
        {
          step: 11,
          content: "Cranberry sauce: simmer cranberries with sugar, orange juice, zest, and spices for 12–15 minutes until burst and glossy.",
          tip: "For a smoother sauce, lightly mash or blend briefly."
        }
      ]
    },
    {
      slug: "tourtiere-du-quebec-porc-boeuf",
      slug_en: "quebec-pork-beef-tourtiere",
      instructions: [
        {
          step: 1,
          content: "Cook pork, beef, and onion over medium heat for 10–12 minutes, breaking up the meat, until all liquid has evaporated."
        },
        {
          step: 2,
          content: "Add garlic and spices; cook 1 minute until fragrant.",
          tip: "Blooming spices reduces the raw \"powdery\" taste."
        },
        {
          step: 3,
          content: "Stir in the flour and cook 1–2 minutes to coat the meat (this builds the binder)."
        },
        {
          step: 4,
          content: "Gradually add hot stock, stirring constantly to avoid lumps, and bring to a gentle simmer."
        },
        {
          step: 5,
          content: "Simmer on low for 40–45 minutes, partially covered, until thick and cohesive.",
          tip: "Too loose: simmer longer. Too thick: add a splash of stock."
        },
        {
          step: 6,
          content: "Cool the filling for about 20 minutes before assembling to keep the crust flaky."
        },
        {
          step: 7,
          content: "Preheat oven to 190 °C. Line a pie dish with the bottom crust and add the filling. Top with the second crust."
        },
        {
          step: 8,
          content: "Seal the edges, brush with egg wash, and cut a small vent in the center."
        },
        {
          step: 9,
          content: "Bake about 50 minutes until deeply golden. Shield edges with foil if browning too fast."
        },
        {
          step: 10,
          content: "Rest 15 minutes before slicing so the filling sets."
        }
      ]
    },
    {
      slug: "roti-de-porc-ail-romarin",
      slug_en: "garlic-rosemary-pork-roast",
      instructions: [
        {
          step: 1,
          content: "Let the pork roast sit at room temperature for 30 minutes and pat dry."
        },
        {
          step: 2,
          content: "Preheat the oven to 170 °C. Prepare a baking dish or Dutch oven."
        },
        {
          step: 3,
          content: "Mix oil, crushed garlic, rosemary, salt, and pepper. Rub all over the roast."
        },
        {
          step: 4,
          content: "Sear the roast in a very hot pan for 2–3 minutes per side to brown.",
          tip: "Browning builds deep flavor (Maillard reaction)."
        },
        {
          step: 5,
          content: "Transfer to the oven dish. Add 250 ml stock to the bottom (do not submerge the roast)."
        },
        {
          step: 6,
          content: "Roast about 2 hours, basting every 30 minutes with the pan juices.",
          tip: "If the pan dries out, add 50–100 ml more stock."
        },
        {
          step: 7,
          content: "Remove at 63 °C (145 °F) internal temperature."
        },
        {
          step: 8,
          content: "Rest 15 minutes, loosely covered, then slice against the grain."
        },
        {
          step: 9,
          content: "Optional quick pan sauce: deglaze with a splash of stock, scrape browned bits, and reduce 3–5 minutes."
        }
      ]
    },
    {
      slug: "jambon-glace-a-lerable",
      slug_en: "maple-glazed-ham",
      instructions: [
        {
          step: 1,
          content: "Preheat the oven to 160 °C. Place the ham in a roasting pan."
        },
        {
          step: 2,
          content: "Add a small amount of hot water (or stock) to the bottom of the pan to keep moisture."
        },
        {
          step: 3,
          content: "Cover and bake for 1½ hours, basting every 20–30 minutes."
        },
        {
          step: 4,
          content: "Make the glaze: whisk together maple syrup, Dijon mustard, apple cider vinegar, and pepper."
        },
        {
          step: 5,
          content: "Uncover the ham. Brush generously with glaze and return to the oven for 10 minutes."
        },
        {
          step: 6,
          content: "Repeat glazing 2–3 times, every 10 minutes, to build caramelized layers."
        },
        {
          step: 7,
          content: "Optional finish: broil for 3–5 minutes for extra shine—watch closely.",
          tip: "Maple glaze can burn quickly under the broiler."
        },
        {
          step: 8,
          content: "Rest 10 minutes before slicing to keep it juicy."
        }
      ]
    }
  ]
};

// ============================================
// FONCTIONS
// ============================================

async function updateRecipeInstructions() {
  console.log('🍽️  Mise à jour des instructions des recettes des fêtes\n');
  console.log('='.repeat(50));

  // Mettre à jour les recettes françaises
  console.log('\n📝 Mise à jour des instructions FRANÇAISES...\n');

  for (const recipe of recipesData.fr) {
    const { data: recipeData, error: findError } = await supabase
      .from('recipes')
      .select('id')
      .eq('slug', recipe.slug)
      .single();

    if (findError || !recipeData) {
      console.log(`⚠️  Recette "${recipe.slug}" non trouvée`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ instructions: recipe.instructions })
      .eq('id', recipeData.id);

    if (updateError) {
      console.error(`❌ Erreur "${recipe.slug}":`, updateError.message);
    } else {
      console.log(`✅ "${recipe.slug}" - ${recipe.instructions.length} étapes`);
    }
  }

  // Mettre à jour les traductions anglaises
  console.log('\n📝 Mise à jour des instructions ANGLAISES...\n');

  for (const recipe of recipesData.en) {
    // Trouver l'ID de la recette par le slug français
    const { data: recipeData, error: findError } = await supabase
      .from('recipes')
      .select('id')
      .eq('slug', recipe.slug)
      .single();

    if (findError || !recipeData) {
      console.log(`⚠️  Recette "${recipe.slug}" non trouvée pour traduction EN`);
      continue;
    }

    // Vérifier si une traduction existe
    const { data: existingTrans } = await supabase
      .from('recipe_translations')
      .select('id')
      .eq('recipe_id', recipeData.id)
      .eq('locale', 'en')
      .single();

    if (existingTrans) {
      // Mettre à jour
      const { error: updateError } = await supabase
        .from('recipe_translations')
        .update({
          instructions: recipe.instructions,
          slug_en: recipe.slug_en,
        })
        .eq('id', existingTrans.id);

      if (updateError) {
        console.error(`❌ Erreur EN "${recipe.slug}":`, updateError.message);
      } else {
        console.log(`✅ EN "${recipe.slug_en}" - ${recipe.instructions.length} steps`);
      }
    } else {
      // Créer la traduction
      const { error: insertError } = await supabase
        .from('recipe_translations')
        .insert({
          recipe_id: recipeData.id,
          locale: 'en',
          slug_en: recipe.slug_en,
          instructions: recipe.instructions,
        });

      if (insertError) {
        console.error(`❌ Erreur création EN "${recipe.slug}":`, insertError.message);
      } else {
        console.log(`✅ EN "${recipe.slug_en}" créé - ${recipe.instructions.length} steps`);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Terminé!');
}

updateRecipeInstructions().catch(console.error);
