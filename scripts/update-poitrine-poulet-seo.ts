/**
 * Script de mise à jour SEO pour la recette "Poitrine de poulet au four"
 * Basé sur l'analyse des mots-clés du concurrent lepoulet.qc.ca
 *
 * Mots-clés ciblés principaux:
 * - poitrine de poulet au four (12,100 vol)
 * - recette poitrine de poulet (9,900 vol)
 * - cuisson poitrine de poulet au four (2,900 vol)
 * - temps de cuisson poitrine de poulet au four 350 (1,900 vol)
 * - température cuisson poulet (2,400 vol)
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================
// SEO TITLE & DESCRIPTION
// ============================================================
const seoTitle = "Poitrine de Poulet au Four - Temps de Cuisson (350°F et 400°F)";
const seoDescription = "Recette de poitrine de poulet au four tendre et juteuse. Temps de cuisson à 350°F (25-30 min) ou 400°F (20-25 min). Température interne: 165°F (74°C).";

// ============================================================
// NOUVEAU TITRE OPTIMISÉ
// ============================================================
const newTitle = "Poitrine de Poulet au Four Tendre et Juteuse";

// ============================================================
// INTRODUCTION SEO OPTIMISÉE
// ============================================================
const newIntroduction = `<p>La <strong>poitrine de poulet au four</strong> est l'une des recettes les plus recherchées et polyvalentes en cuisine. Que vous prépariez un repas rapide en semaine ou un dîner plus élaboré, cette <strong>recette de poitrine de poulet</strong> vous garantit un résultat tendre et juteux à chaque fois.</p>

<p>Dans ce guide complet, vous découvrirez les <strong>temps de cuisson</strong> précis selon la température de votre four (350°F ou 400°F), les secrets pour une <strong>cuisson parfaite</strong>, et comment obtenir une poitrine de poulet dorée à l'extérieur tout en restant moelleuse à l'intérieur.</p>

<h2>Pourquoi cette recette de poitrine de poulet au four?</h2>
<ul>
  <li><strong>Temps de préparation minimal</strong> : seulement 10 minutes</li>
  <li><strong>Cuisson simple</strong> : le four fait tout le travail</li>
  <li><strong>Résultat garanti</strong> : tendre et juteux à chaque fois</li>
  <li><strong>Polyvalente</strong> : accompagne riz, salade, légumes ou pâtes</li>
</ul>`;

// ============================================================
// CONTENU (ASTUCES) SEO OPTIMISÉ
// ============================================================
const newContent = `<h2>Guide de Cuisson : Temps et Température</h2>

<h3>Temps de cuisson poitrine de poulet au four à 350°F (175°C)</h3>
<p>À <strong>350°F</strong>, comptez <strong>25 à 30 minutes</strong> de cuisson pour des poitrines de poulet de taille moyenne (170-200g). Cette température plus basse permet une cuisson plus douce et uniforme, idéale pour garder la viande juteuse.</p>

<h3>Temps de cuisson poitrine de poulet au four à 400°F (200°C)</h3>
<p>À <strong>400°F</strong>, la cuisson est plus rapide : <strong>20 à 25 minutes</strong> suffisent. Cette température plus élevée crée une belle coloration dorée sur l'extérieur tout en gardant l'intérieur tendre.</p>

<h3>Température interne du poulet cuit</h3>
<p>La <strong>température interne</strong> de la poitrine de poulet doit atteindre <strong>165°F (74°C)</strong> pour être parfaitement cuite et sécuritaire. Utilisez un thermomètre à viande pour vérifier la cuisson au centre de la partie la plus épaisse.</p>

<h2>Conseils pour une Poitrine de Poulet Tendre et Juteuse</h2>

<p><strong>1. Sortez le poulet du réfrigérateur 15-20 minutes avant la cuisson</strong><br/>
Cela permet une cuisson plus uniforme et évite que l'extérieur soit trop cuit avant que l'intérieur soit prêt.</p>

<p><strong>2. Aplatissez les poitrines pour une épaisseur uniforme</strong><br/>
Si vos poitrines sont très épaisses d'un côté, aplatissez-les légèrement avec un maillet ou le fond d'une casserole. Cela garantit une cuisson égale.</p>

<p><strong>3. Ne sautez pas le temps de repos</strong><br/>
Laissez reposer le poulet 5 minutes après la cuisson. Les jus se redistribuent et la viande reste juteuse quand vous la coupez.</p>

<p><strong>4. Utilisez un thermomètre à viande</strong><br/>
C'est la méthode la plus fiable pour éviter de surcuire ou sous-cuire votre poulet.</p>

<h2>Variations de la Recette</h2>

<p><strong>Poitrine de poulet au miel et moutarde</strong> : ajoutez 1 c. à soupe de miel et 1 c. à soupe de moutarde de Dijon au mélange d'huile et d'épices.</p>

<p><strong>Poitrine de poulet citronné à l'ail</strong> : ajoutez le jus d'un citron entier et doublez l'ail pour un goût plus prononcé.</p>

<p><strong>Poitrine de poulet épicée</strong> : remplacez le paprika doux par du paprika fort ou ajoutez 1/2 c. à café de flocons de piment.</p>

<p><strong>Poitrine de poulet aux herbes de Provence</strong> : remplacez le thym par un mélange d'herbes de Provence pour une touche méditerranéenne.</p>

<p><strong>Poitrine de poulet marinée au four</strong> : laissez mariner le poulet 2-4 heures avant la cuisson pour encore plus de saveur.</p>

<h2>Accompagnements Suggérés</h2>
<ul>
  <li>Riz basmati ou riz pilaf</li>
  <li>Légumes rôtis (brocoli, carottes, pommes de terre)</li>
  <li>Salade verte fraîche</li>
  <li>Purée de pommes de terre</li>
  <li>Pâtes avec sauce légère</li>
</ul>

<p><strong>Vous avez un Air Fryer?</strong><br/>
<a href="https://menucochon.com/recette/poitrine-de-poulet-a-lair-fryer/">Découvrez notre recette de poitrine de poulet à l'air fryer</a> pour une version encore plus croustillante!</p>`;

// ============================================================
// CONCLUSION SEO OPTIMISÉE
// ============================================================
const newConclusion = `<p>Cette <strong>recette de poitrine de poulet au four</strong> est la preuve qu'un plat simple peut être absolument délicieux. Avec les bons temps de cuisson et une attention particulière à la <strong>température interne</strong>, vous obtiendrez à chaque fois une poitrine de poulet parfaitement <strong>tendre et juteuse</strong>.</p>

<p>N'oubliez pas les points clés :</p>
<ul>
  <li><strong>350°F</strong> : 25-30 minutes de cuisson</li>
  <li><strong>400°F</strong> : 20-25 minutes de cuisson</li>
  <li><strong>Température interne</strong> : 165°F (74°C)</li>
  <li><strong>Repos</strong> : 5 minutes avant de servir</li>
</ul>

<p>Que vous la serviez avec des légumes rôtis, une salade fraîche ou un riz parfumé, cette poitrine de poulet au four deviendra rapidement un incontournable de vos repas de semaine!</p>`;

// ============================================================
// FAQ SEO OPTIMISÉE (basée sur les recherches réelles)
// ============================================================
const newFaq = {
  id: 41,
  title_fr: "Poitrine de Poulet au Four - Questions Fréquentes",
  title_en: "Oven-Baked Chicken Breast - Frequently Asked Questions",
  faq: [
    {
      question_fr: "Combien de temps cuire une poitrine de poulet au four à 350°F?",
      answer_fr: "À 350°F (175°C), la cuisson d'une poitrine de poulet prend environ 25 à 30 minutes pour des poitrines de taille moyenne (170-200g). Vérifiez toujours que la température interne atteint 165°F (74°C) avec un thermomètre à viande.",
      question_en: "How long to bake chicken breast at 350°F?",
      answer_en: "At 350°F (175°C), medium-sized chicken breasts (6-7 oz) take about 25-30 minutes to cook. Always verify the internal temperature reaches 165°F (74°C) with a meat thermometer."
    },
    {
      question_fr: "Combien de temps cuire une poitrine de poulet au four à 400°F?",
      answer_fr: "À 400°F (200°C), comptez 20 à 25 minutes de cuisson. Cette température plus élevée permet une cuisson plus rapide et une belle coloration dorée, tout en gardant l'intérieur juteux.",
      question_en: "How long to bake chicken breast at 400°F?",
      answer_en: "At 400°F (200°C), chicken breasts take 20-25 minutes to cook. This higher temperature creates a nice golden color while keeping the inside juicy."
    },
    {
      question_fr: "Quelle est la température interne d'une poitrine de poulet cuite?",
      answer_fr: "La température interne d'une poitrine de poulet parfaitement cuite doit être de 165°F (74°C). Utilisez un thermomètre à viande inséré dans la partie la plus épaisse pour vérifier. À cette température, le poulet est sécuritaire et reste juteux.",
      question_en: "What is the internal temperature of cooked chicken breast?",
      answer_en: "Properly cooked chicken breast should reach an internal temperature of 165°F (74°C). Use a meat thermometer inserted into the thickest part to check. At this temperature, the chicken is safe to eat and remains juicy."
    },
    {
      question_fr: "Comment garder la poitrine de poulet tendre et juteuse au four?",
      answer_fr: "Pour une poitrine de poulet tendre et juteuse : 1) Sortez-la du frigo 15-20 min avant cuisson, 2) Badigeonnez-la d'huile d'olive, 3) Ne la surcuisez pas (vérifiez la température interne), 4) Laissez-la reposer 5 minutes après la cuisson pour redistribuer les jus.",
      question_en: "How to keep chicken breast tender and juicy in the oven?",
      answer_en: "For tender, juicy chicken breast: 1) Let it come to room temperature 15-20 min before cooking, 2) Brush with olive oil, 3) Don't overcook (check internal temp), 4) Let it rest 5 minutes after cooking to redistribute juices."
    },
    {
      question_fr: "Peut-on cuire une poitrine de poulet congelée au four?",
      answer_fr: "Oui, vous pouvez cuire une poitrine de poulet congelée au four. Augmentez le temps de cuisson de 50% (environ 35-45 minutes à 400°F). Vérifiez toujours que la température interne atteint 165°F (74°C) au centre.",
      question_en: "Can you bake frozen chicken breast?",
      answer_en: "Yes, you can bake frozen chicken breast. Increase cooking time by 50% (about 35-45 minutes at 400°F). Always verify the internal temperature reaches 165°F (74°C) in the center."
    },
    {
      question_fr: "Quelle est la meilleure marinade pour poitrine de poulet au four?",
      answer_fr: "Une marinade simple et efficace : huile d'olive, ail émincé, jus de citron, herbes (thym, romarin), sel et poivre. Laissez mariner 30 minutes à 4 heures au réfrigérateur. Pour plus de saveur, ajoutez moutarde de Dijon ou miel.",
      question_en: "What is the best marinade for baked chicken breast?",
      answer_en: "A simple effective marinade: olive oil, minced garlic, lemon juice, herbs (thyme, rosemary), salt and pepper. Marinate 30 minutes to 4 hours in the fridge. For extra flavor, add Dijon mustard or honey."
    },
    {
      question_fr: "Combien de calories dans une poitrine de poulet au four?",
      answer_fr: "Une poitrine de poulet au four (environ 170g, sans peau) contient environ 250-280 calories, 50g de protéines, 3-5g de lipides (selon l'huile utilisée) et 0g de glucides. C'est une excellente source de protéines maigres.",
      question_en: "How many calories in baked chicken breast?",
      answer_en: "A baked chicken breast (about 6 oz, skinless) contains approximately 250-280 calories, 50g protein, 3-5g fat (depending on oil used), and 0g carbs. It's an excellent source of lean protein."
    },
    {
      question_fr: "Comment savoir si la poitrine de poulet est bien cuite?",
      answer_fr: "Les signes d'une poitrine de poulet bien cuite : 1) Température interne de 165°F (74°C), 2) Jus clairs (pas roses) quand on pique le poulet, 3) Chair blanche et opaque au centre. Le meilleur indicateur reste le thermomètre à viande.",
      question_en: "How to tell if chicken breast is fully cooked?",
      answer_en: "Signs of properly cooked chicken breast: 1) Internal temperature of 165°F (74°C), 2) Clear juices (not pink) when pierced, 3) White opaque flesh in the center. A meat thermometer is the most reliable method."
    }
  ]
};

// ============================================================
// INSTRUCTIONS MISES À JOUR AVEC TEMPÉRATURES
// ============================================================
const newInstructions = [
  {
    step: 1,
    title: "Préchauffer le four",
    content: "Préchauffez votre four à 400°F (200°C) pour une cuisson rapide avec une belle coloration, ou 350°F (175°C) pour une cuisson plus douce. Graissez légèrement un plat allant au four."
  },
  {
    step: 2,
    title: "Préparer les poitrines",
    content: "Sortez les poitrines de poulet du réfrigérateur 15-20 minutes avant la cuisson. Assaisonnez-les des deux côtés avec du sel et du poivre selon votre goût."
  },
  {
    step: 3,
    title: "Préparer le mélange d'épices",
    content: "Dans un petit bol, mélangez l'huile d'olive, l'ail émincé, le paprika et le thym séché jusqu'à obtenir un mélange homogène."
  },
  {
    step: 4,
    title: "Enrober le poulet",
    content: "Badigeonnez généreusement les poitrines de poulet avec le mélange d'huile assaisonnée, en veillant à bien les enrober des deux côtés."
  },
  {
    step: 5,
    title: "Disposer dans le plat",
    content: "Disposez les poitrines de poulet dans le plat de cuisson préparé, en laissant un espace entre chaque pièce. Ajoutez des tranches de citron sur le dessus si désiré."
  },
  {
    step: 6,
    title: "Cuisson au four",
    content: "Faites cuire au four : 20-25 minutes à 400°F (200°C) ou 25-30 minutes à 350°F (175°C). La poitrine de poulet est prête quand la température interne atteint 165°F (74°C)."
  },
  {
    step: 7,
    title: "Repos et service",
    content: "Retirez du four et laissez reposer 5 minutes avant de servir. Ce temps de repos permet aux jus de se redistribuer pour une viande plus juteuse. Garnissez de persil frais si désiré."
  }
];

async function updateRecipe() {
  console.log('🔄 Mise à jour SEO de la recette "Poitrine de poulet au four"...\n');

  const updateData = {
    title: newTitle,
    seo_title: seoTitle,
    seo_description: seoDescription,
    introduction: newIntroduction,
    content: newContent,
    conclusion: newConclusion,
    faq: JSON.stringify(newFaq),
    instructions: newInstructions,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('recipes')
    .update(updateData)
    .eq('slug', 'poitrine-de-poulet-au-four')
    .select();

  if (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    return;
  }

  console.log('✅ Recette mise à jour avec succès!\n');
  console.log('📝 Modifications apportées:');
  console.log('   - Nouveau titre:', newTitle);
  console.log('   - SEO Title:', seoTitle);
  console.log('   - SEO Description:', seoDescription.substring(0, 80) + '...');
  console.log('   - Introduction optimisée (avec H2 et liste)');
  console.log('   - Contenu enrichi avec guide de cuisson détaillé');
  console.log('   - Conclusion avec résumé des temps de cuisson');
  console.log('   - 8 nouvelles questions FAQ basées sur les recherches');
  console.log('   - Instructions mises à jour avec températures précises');
  console.log('\n🎯 Mots-clés ciblés:');
  console.log('   - poitrine de poulet au four (12,100 vol/mois)');
  console.log('   - recette poitrine de poulet (9,900 vol/mois)');
  console.log('   - cuisson poitrine de poulet au four (2,900 vol/mois)');
  console.log('   - temps de cuisson poitrine de poulet 350 (1,900 vol/mois)');
  console.log('   - température cuisson poulet (2,400 vol/mois)');
  console.log('   - poitrine poulet tendre juteux (2,900 vol/mois)');
}

updateRecipe().catch(console.error);
