/**
 * Mise à jour de la recette Ceviche Péruvien avec optimisations
 * Basé sur les meilleures sources: Ricardo, EatPeru, FaimDeVoyages
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function updateCeviche() {
  const recipeUpdate = {
    title: "Ceviche Péruvien Authentique : La Vraie Recette avec Leche de Tigre",

    excerpt: "Découvrez la véritable recette du ceviche péruvien avec son fameux leche de tigre (lait de tigre). Un plat emblématique du Pérou où le poisson frais est \"cuit\" dans le jus de citron vert, relevé de piment ají et servi avec patate douce et maïs cancha.",

    prep_time: 30,
    cook_time: 0, // Le ceviche ne cuit pas au feu!
    rest_time: 20, // Temps de marinade
    total_time: 50,
    servings: 4,
    servings_unit: "portions",
    difficulty: "moyen",

    ingredients: [
      {
        title: "Pour le Leche de Tigre (Lait de Tigre)",
        items: [
          { quantity: "50", unit: "g", name: "poisson blanc émincé (réserver des parures)", note: null },
          { quantity: "1/3", unit: "tasse", name: "jus de lime frais", note: null },
          { quantity: "1/2", unit: null, name: "piment ají limo ou ají amarillo", note: "ou 1/2 piment Fresno" },
          { quantity: "1/2", unit: null, name: "branche de céleri", note: null },
          { quantity: "1/2", unit: null, name: "gousse d'ail", note: null },
          { quantity: "1", unit: "c. à thé", name: "gingembre frais râpé", note: null },
          { quantity: "1", unit: null, name: "tige de coriandre", note: null },
          { quantity: "1", unit: "c. à thé", name: "sel", note: null },
          { quantity: "2", unit: null, name: "glaçons", note: null }
        ]
      },
      {
        title: "Pour le Ceviche",
        items: [
          { quantity: "500", unit: "g", name: "filet de poisson blanc très frais", note: "bar, dorade, flétan ou mahi-mahi" },
          { quantity: "1/2", unit: "tasse", name: "jus de lime frais", note: "environ 6-8 limes" },
          { quantity: "1", unit: null, name: "oignon rouge moyen", note: "émincé finement" },
          { quantity: "1", unit: null, name: "piment ají limo ou Fresno", note: "épépiné et émincé" },
          { quantity: "3", unit: "c. à soupe", name: "coriandre fraîche hachée", note: null },
          { quantity: null, unit: null, name: "Sel et poivre", note: "au goût" },
          { quantity: null, unit: null, name: "Fleur de sel", note: "pour finition" }
        ]
      },
      {
        title: "Accompagnements traditionnels",
        items: [
          { quantity: "1", unit: null, name: "grosse patate douce", note: "cuite et coupée en tranches" },
          { quantity: "1", unit: null, name: "épi de maïs", note: "cuit et coupé en rondelles" },
          { quantity: "1/4", unit: "tasse", name: "maïs cancha (maïs grillé)", note: "ou corn nuts" },
          { quantity: null, unit: null, name: "Feuilles de laitue", note: "pour décoration" },
          { quantity: null, unit: null, name: "Chips de plantain", note: "facultatif" }
        ]
      }
    ],

    instructions: [
      {
        step: 1,
        title: "Préparer les accompagnements",
        content: "Faites cuire la patate douce à la vapeur ou dans l'eau bouillante pendant 25-30 minutes jusqu'à tendreté. Laissez refroidir, puis coupez en tranches. Faites bouillir l'épi de maïs 5-7 minutes, égouttez et coupez en rondelles."
      },
      {
        step: 2,
        title: "Préparer le poisson",
        content: "Assurez-vous que le poisson est très frais (qualité sushi idéalement). Retirez la peau et les arêtes. Coupez le poisson en cubes uniformes de 2 cm pour une marinade homogène. Réservez 50g de parures pour le leche de tigre."
      },
      {
        step: 3,
        title: "Préparer le Leche de Tigre",
        content: "Dans un mélangeur, combinez les 50g de poisson émincé, le jus de lime, le piment, le céleri, l'ail, le gingembre, la tige de coriandre, le sel et les glaçons. Mixez jusqu'à obtenir un liquide homogène et onctueux. Passez au tamis fin et réfrigérez."
      },
      {
        step: 4,
        title: "Préparer l'oignon",
        content: "Émincez finement l'oignon rouge. Pour adoucir son goût, faites-le tremper dans l'eau froide pendant 10-15 minutes, puis égouttez bien. Cette étape réduit l'amertume tout en gardant le croquant."
      },
      {
        step: 5,
        title: "Mariner le poisson (IMPORTANT : timing court!)",
        content: "Dans un grand bol, déposez les cubes de poisson. Versez le jus de lime et le leche de tigre. Ajoutez une pincée de sel et mélangez délicatement. Laissez mariner SEULEMENT 3 à 5 minutes - le poisson doit devenir opaque à l'extérieur mais rester légèrement translucide au centre. Une marinade trop longue rend le poisson caoutchouteux."
      },
      {
        step: 6,
        title: "Assembler le ceviche",
        content: "Égouttez légèrement le poisson en réservant le liquide de marinade. Ajoutez l'oignon rouge égoutté, le piment émincé et la coriandre fraîche. Mélangez délicatement. Rectifiez l'assaisonnement avec sel et poivre."
      },
      {
        step: 7,
        title: "Dresser et servir immédiatement",
        content: "Disposez les tranches de patate douce et les rondelles de maïs autour d'une assiette creuse ou dans des bols individuels. Déposez le ceviche au centre. Arrosez d'un filet de leche de tigre réservé. Parsemez de maïs cancha pour le croquant. Terminez avec une pincée de fleur de sel et quelques feuilles de coriandre. Servez immédiatement - le ceviche se déguste frais!"
      }
    ],

    introduction: `<p>Le <strong>ceviche péruvien</strong> est bien plus qu'un simple plat de poisson cru mariné — c'est le trésor national du Pérou, célébré chaque année le 28 juin lors de la Journée nationale du Ceviche. Cette recette authentique vous révèle le secret des meilleurs ceviches de Lima : le fameux <strong>leche de tigre</strong> (lait de tigre), cette marinade crémeuse et intense qui fait toute la différence.</p>

<p>Contrairement aux idées reçues, le ceviche n'est pas "cuit" au sens traditionnel. L'acide citrique du jus de lime dénature les protéines du poisson, lui donnant cette texture ferme et ce goût unique. Les Péruviens appellent ce processus "cocinar en frío" — cuire à froid.</p>

<p><strong>Ce qui rend cette recette authentique :</strong></p>
<ul>
<li>Le <strong>leche de tigre</strong> préparé séparément pour une saveur intense</li>
<li>Une marinade COURTE de 3-5 minutes seulement (pas 30 minutes!)</li>
<li>Du poisson extrêmement frais, idéalement qualité sushi</li>
<li>Les piments <strong>ají</strong> traditionnels du Pérou</li>
<li>Les accompagnements classiques : patate douce (camote) et maïs cancha</li>
</ul>

<p>Préparez-vous à découvrir le vrai goût du Pérou dans votre cuisine!</p>`,

    content: `<h3>Secrets pour un Ceviche Parfait</h3>

<p><strong>La fraîcheur du poisson est ESSENTIELLE</strong></p>
<p>Achetez votre poisson le jour même chez un poissonnier de confiance. Demandez du poisson "qualité sushi" si possible. Les meilleurs choix sont : le bar (lubina), la dorade, le flétan, le mahi-mahi ou le tilapia. Évitez les poissons gras comme le saumon pour un ceviche traditionnel.</p>

<p><strong>Le secret du timing</strong></p>
<p>L'erreur la plus commune est de laisser mariner trop longtemps. Un vrai ceviche péruvien ne marine que 3 à 5 minutes! Le poisson doit être opaque à l'extérieur mais encore légèrement translucide au centre. Au-delà de 10 minutes, la texture devient caoutchouteuse.</p>

<p><strong>Le Leche de Tigre : l'ingrédient secret</strong></p>
<p>Cette marinade crémeuse est préparée séparément en mixant du poisson avec les agrumes et aromates. C'est elle qui donne au ceviche péruvien sa profondeur de goût incomparable. Au Pérou, le leche de tigre se boit même comme remède contre la gueule de bois!</p>

<h3>Variantes Populaires</h3>

<p><strong>Ceviche Mixto</strong> : Ajoutez des fruits de mer variés (crevettes, calamars, pétoncles) pour une version plus riche.</p>

<p><strong>Ceviche Nikkei</strong> : Version fusion péruviano-japonaise avec sauce soya, sésame et gingembre — un héritage de l'immigration japonaise au Pérou.</p>

<p><strong>Ceviche de Crevettes</strong> : Utilisez des crevettes crues décortiquées, le temps de marinade reste le même.</p>

<p><strong>Tiradito</strong> : Cousin du ceviche, le poisson est coupé en fines tranches (comme un sashimi) et nappé de sauce au moment de servir, sans marinade préalable.</p>

<h3>Accompagnements Traditionnels</h3>

<p>Au Pérou, le ceviche est toujours servi avec :</p>
<ul>
<li><strong>Camote</strong> (patate douce) : Sa douceur équilibre l'acidité du plat</li>
<li><strong>Choclo</strong> (maïs péruvien à gros grains) : Texture unique et goût légèrement sucré</li>
<li><strong>Cancha</strong> (maïs grillé) : Pour le croquant indispensable</li>
<li><strong>Lechuga</strong> (laitue) : Traditionnellement servie en feuilles entières</li>
</ul>`,

    conclusion: `<p>Voilà, vous maîtrisez maintenant la <strong>vraie recette du ceviche péruvien</strong>! Le secret réside dans la fraîcheur absolue du poisson, la préparation du leche de tigre et surtout — ne l'oubliez jamais — une marinade TRÈS courte de 3 à 5 minutes maximum.</p>

<p>Ce plat emblématique du Pérou est parfait en entrée lors d'un dîner spécial ou comme plat principal léger en été. Servez-le immédiatement après la préparation pour profiter de toutes ses saveurs vives et fraîches.</p>

<p><strong>Conseil de chef :</strong> Gardez tous vos ingrédients bien froids jusqu'au moment de servir. Réfrigérez même les bols de service pour maintenir le ceviche à la température idéale.</p>

<p>¡Buen provecho! Dégustez ce trésor de la gastronomie péruvienne et transportez vos papilles sur les côtes ensoleillées de Lima.</p>`,

    seo_title: "Ceviche Péruvien Authentique : Recette avec Leche de Tigre | Menucochon",
    seo_description: "La vraie recette du ceviche péruvien avec leche de tigre (lait de tigre). Poisson frais mariné au citron vert, piment ají, servi avec patate douce et maïs. Prêt en 30 min!",

    nutrition: {
      calories: "180",
      protein: "28g",
      carbs: "12g",
      fat: "3g",
      fiber: "2g"
    },

    faq: JSON.stringify({
      id: 155,
      title_fr: "Ceviche Péruvien Authentique : La Vraie Recette avec Leche de Tigre",
      title_en: "Authentic Peruvian Ceviche Recipe with Leche de Tigre",
      faq: [
        {
          question_fr: "Combien de temps doit mariner le ceviche péruvien?",
          answer_fr: "Seulement 3 à 5 minutes! C'est le secret d'un ceviche authentique. Le poisson doit être opaque à l'extérieur mais encore légèrement translucide au centre. Une marinade trop longue (30+ minutes) rend le poisson caoutchouteux.",
          question_en: "How long should Peruvian ceviche marinate?",
          answer_en: "Only 3 to 5 minutes! This is the secret to authentic ceviche. The fish should be opaque on the outside but still slightly translucent in the center. Over-marinating (30+ minutes) makes the fish rubbery."
        },
        {
          question_fr: "Qu'est-ce que le leche de tigre et pourquoi est-il important?",
          answer_fr: "Le leche de tigre (lait de tigre) est la marinade crémeuse obtenue en mixant du poisson avec du jus de lime, des piments et des aromates. C'est l'ingrédient secret qui donne au ceviche péruvien sa saveur intense et unique. Au Pérou, il se boit même comme remède contre la gueule de bois!",
          question_en: "What is leche de tigre and why is it important?",
          answer_en: "Leche de tigre (tiger's milk) is the creamy marinade made by blending fish with lime juice, peppers and aromatics. It's the secret ingredient that gives Peruvian ceviche its intense, unique flavor. In Peru, it's even drunk as a hangover cure!"
        },
        {
          question_fr: "Quel poisson utiliser pour le ceviche?",
          answer_fr: "Utilisez un poisson blanc très frais, idéalement qualité sushi : bar (lubina), dorade, flétan, mahi-mahi ou tilapia. Évitez les poissons gras comme le saumon. La fraîcheur est ESSENTIELLE - achetez le poisson le jour même.",
          question_en: "What fish should I use for ceviche?",
          answer_en: "Use very fresh white fish, ideally sushi-grade: sea bass, sea bream, halibut, mahi-mahi or tilapia. Avoid fatty fish like salmon. Freshness is ESSENTIAL - buy the fish the same day."
        },
        {
          question_fr: "Le ceviche est-il sécuritaire à manger? Le poisson est-il vraiment cuit?",
          answer_fr: "L'acide citrique du lime dénature les protéines du poisson, le rendant ferme et opaque comme s'il était cuit à la chaleur. Pour une sécurité maximale, utilisez du poisson qualité sushi très frais et gardez tous les ingrédients bien froids.",
          question_en: "Is ceviche safe to eat? Is the fish really cooked?",
          answer_en: "The citric acid in lime denatures fish proteins, making it firm and opaque as if heat-cooked. For maximum safety, use very fresh sushi-grade fish and keep all ingredients well chilled."
        },
        {
          question_fr: "Peut-on préparer le ceviche à l'avance?",
          answer_fr: "Non, le ceviche doit être servi immédiatement après préparation. Cependant, vous pouvez préparer le leche de tigre, couper le poisson et les légumes à l'avance. Assemblez et marinez seulement au moment de servir.",
          question_en: "Can ceviche be prepared in advance?",
          answer_en: "No, ceviche must be served immediately after preparation. However, you can prepare the leche de tigre, cut the fish and vegetables in advance. Assemble and marinate only when ready to serve."
        },
        {
          question_fr: "Quels sont les accompagnements traditionnels du ceviche péruvien?",
          answer_fr: "Les accompagnements traditionnels sont : la patate douce (camote) pour sa douceur qui équilibre l'acidité, le maïs péruvien (choclo), le maïs grillé (cancha) pour le croquant, et des feuilles de laitue.",
          question_en: "What are the traditional accompaniments for Peruvian ceviche?",
          answer_en: "Traditional accompaniments are: sweet potato (camote) for sweetness that balances the acidity, Peruvian corn (choclo), toasted corn (cancha) for crunch, and lettuce leaves."
        }
      ]
    })
  };

  console.log('🐟 Mise à jour de la recette Ceviche Péruvien...\n');

  const { data, error } = await supabase
    .from('recipes')
    .update(recipeUpdate)
    .eq('slug', 'ceviche-peruvien')
    .select();

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  console.log('✅ Recette mise à jour avec succès!');
  console.log('\n📋 Améliorations apportées:');
  console.log('   • Titre SEO optimisé avec "Leche de Tigre"');
  console.log('   • Portions corrigées: 1 → 4');
  console.log('   • Temps corrigés: prep 30min, marinade 20min, total 50min');
  console.log('   • Ajout du Leche de Tigre (recette authentique)');
  console.log('   • Ajout du gingembre, céleri, maïs cancha');
  console.log('   • Instructions détaillées avec timing de marinade COURT (3-5 min)');
  console.log('   • FAQ optimisée avec vraies questions SEO');
  console.log('   • Valeurs nutritionnelles ajoutées');
  console.log('   • Contenu enrichi avec variantes (Nikkei, Mixto, Tiradito)');
  console.log('\n🔗 URL: https://menucochon.com/recette/ceviche-peruvien/');
}

updateCeviche();
