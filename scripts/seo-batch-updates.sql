-- ============================================================
-- Batch SEO Updates pour les recettes du CSV SEMrush
-- Mots-clés ciblés avec bon volume de recherche
-- ============================================================

-- ============================================================
-- 1. SOUPE AU CHOU (position 10, 320 recherches/mois)
-- Mot-clé: "soupe au chou"
-- ============================================================
UPDATE recipes SET
  seo_title = 'Soupe au Chou Traditionnelle | Recette Réconfortante',
  seo_description = 'Recette authentique de soupe au chou: légumes, chou vert et bouillon savoureux. Repas complet, économique et réconfortant. Prête en 30 minutes!',
  introduction = '<p>La <strong>soupe au chou</strong> est un classique réconfortant de la cuisine familiale québécoise et européenne. Cette recette traditionnelle transforme des légumes simples en un repas nourrissant et délicieux.</p>
<p>Économique, facile à préparer et excellente pour la santé, cette <strong>soupe au chou maison</strong> réchauffe le corps et l''âme pendant les mois froids!</p>'
WHERE slug = 'soupe-au-chou';

UPDATE recipes SET
  faq = '[
    {
      "question": "Comment éviter que le chou soit trop amer dans la soupe?",
      "answer": "Blanchissez le chou 2-3 minutes dans l''eau bouillante avant de l''ajouter à la soupe, ou ajoutez une pincée de sucre au bouillon. Utilisez aussi du chou frais plutôt que du chou défraîchi."
    },
    {
      "question": "Peut-on congeler la soupe au chou?",
      "answer": "Oui! La soupe au chou se congèle très bien jusqu''à 3 mois. Laissez refroidir complètement avant de congeler dans des contenants hermétiques, en laissant un espace pour l''expansion."
    },
    {
      "question": "Comment rendre la soupe au chou plus nourrissante?",
      "answer": "Ajoutez des pommes de terre en cubes, des haricots blancs, du riz ou des pâtes. Vous pouvez aussi incorporer des morceaux de saucisse fumée ou de jambon pour un repas complet."
    }
  ]'::jsonb
WHERE slug = 'soupe-au-chou';


-- ============================================================
-- 2. CHOCOLAT CHAUD (position 4, 880 recherches/mois)
-- Mot-clé: "chocolat chaud maison"
-- ============================================================
UPDATE recipes SET
  seo_title = 'Chocolat Chaud Maison Onctueux | Recette Gourmande',
  seo_description = 'Recette chocolat chaud maison onctueux et réconfortant. Préparez le meilleur chocolat chaud avec du vrai chocolat, lait et crème en 5 minutes!',
  introduction = '<p>Rien ne réchauffe autant qu''un bon <strong>chocolat chaud maison</strong>! Cette recette utilise du vrai chocolat pour un résultat onctueux et gourmand, bien loin des préparations en poudre industrielles.</p>
<p>Prêt en 5 minutes, ce <strong>chocolat chaud onctueux</strong> est parfait pour les soirées d''hiver, les après-ski ou simplement pour se faire plaisir!</p>'
WHERE slug = 'chocolat-chaud';

UPDATE recipes SET
  faq = '[
    {
      "question": "Comment faire un chocolat chaud plus épais?",
      "answer": "Pour un chocolat chaud plus épais et onctueux, ajoutez 1 cuillère à café de fécule de maïs diluée dans un peu de lait froid, ou utilisez plus de chocolat (100g au lieu de 50g par tasse). Vous pouvez aussi remplacer une partie du lait par de la crème."
    },
    {
      "question": "Quel chocolat utiliser pour le chocolat chaud maison?",
      "answer": "Utilisez du chocolat noir à 60-70% de cacao pour un goût intense, ou du chocolat au lait pour une version plus douce. Évitez le chocolat à cuisson qui peut être amer. Le chocolat en tablette de qualité donne les meilleurs résultats."
    },
    {
      "question": "Peut-on préparer le chocolat chaud à l''avance?",
      "answer": "Oui! Préparez la base chocolat-lait et conservez-la au réfrigérateur jusqu''à 3 jours. Réchauffez doucement en remuant avant de servir. Ajoutez la crème fouettée au moment de servir."
    }
  ]'::jsonb
WHERE slug = 'chocolat-chaud';


-- ============================================================
-- 3. POUDING AUX BLEUETS (position 2-7, 320 recherches/mois)
-- Mot-clé: "pouding aux bleuets"
-- ============================================================
UPDATE recipes SET
  seo_title = 'Pouding aux Bleuets du Québec | Recette Traditionnelle',
  seo_description = 'Pouding aux bleuets québécois traditionnel: gâteau moelleux et sauce sucrée aux bleuets frais ou congelés. Dessert réconfortant de grand-mère!',
  introduction = '<p>Le <strong>pouding aux bleuets</strong> est un dessert emblématique de la cuisine québécoise! Ce gâteau moelleux nappé de sa sauce sucrée aux bleuets rappelle les desserts de nos grands-mères.</p>
<p>Avec des <strong>bleuets du Québec</strong> frais ou congelés, cette recette traditionnelle se prépare facilement et fait le bonheur de toute la famille!</p>'
WHERE slug = 'pouding-aux-bleuets';

UPDATE recipes SET
  faq = '[
    {
      "question": "Peut-on faire le pouding aux bleuets avec des bleuets congelés?",
      "answer": "Absolument! Utilisez des bleuets congelés sans les décongeler pour éviter qu''ils ne deviennent trop mous. Ajoutez 5 minutes au temps de cuisson. Les bleuets congelés du Québec donnent d''excellents résultats toute l''année."
    },
    {
      "question": "Comment conserver le pouding aux bleuets?",
      "answer": "Conservez le pouding couvert au réfrigérateur jusqu''à 3 jours. Réchauffez les portions au micro-ondes 30-45 secondes avant de servir. La sauce peut épaissir au frigo — ajoutez un peu d''eau chaude si nécessaire."
    },
    {
      "question": "Peut-on utiliser d''autres fruits que les bleuets?",
      "answer": "Oui! Cette recette fonctionne aussi avec des framboises, des mûres, des cerises dénoyautées ou un mélange de petits fruits. Ajustez le sucre selon l''acidité des fruits utilisés."
    }
  ]'::jsonb
WHERE slug = 'pouding-aux-bleuets';


-- ============================================================
-- 4. JAMBON À LA BIÈRE MIJOTEUSE (position 2, 70 recherches/mois)
-- Mot-clé: "jambon à la bière mijoteuse"
-- ============================================================
UPDATE recipes SET
  seo_title = 'Jambon à la Bière à la Mijoteuse | Fondant et Savoureux',
  seo_description = 'Jambon à la bière à la mijoteuse: tendre, juteux et savoureux. Recette facile de jambon glacé à la bière brune avec cassonade. Parfait pour les fêtes!',
  introduction = '<p>Le <strong>jambon à la bière à la mijoteuse</strong> est la façon la plus simple d''obtenir un jambon incroyablement tendre et savoureux! La bière brune et la cassonade créent un glaçage caramélisé irrésistible.</p>
<p>Parfait pour les réceptions, les fêtes ou un dimanche en famille, ce <strong>jambon glacé à la mijoteuse</strong> se prépare pratiquement tout seul!</p>'
WHERE slug = 'jambon-a-la-biere-a-la-mijoteuse';

UPDATE recipes SET
  faq = '[
    {
      "question": "Quelle bière utiliser pour le jambon à la mijoteuse?",
      "answer": "Une bière brune ou rousse donne les meilleurs résultats grâce à ses notes de caramel et de malt. La Boréale Rousse, la St-Ambroise Noire ou une bière brune artisanale locale fonctionnent parfaitement. Évitez les bières très amères (IPA)."
    },
    {
      "question": "Combien de temps cuire le jambon à la mijoteuse?",
      "answer": "Comptez environ 4-5 heures à température élevée (HIGH) ou 7-8 heures à basse température (LOW) pour un jambon de 2-3 kg. Le jambon est prêt quand il se défait facilement à la fourchette."
    },
    {
      "question": "Peut-on utiliser un jambon pré-cuit pour cette recette?",
      "answer": "Oui! Un jambon pré-cuit (style jambon de Pâques) fonctionne très bien. Réduisez le temps de cuisson à 3-4 heures à HIGH ou 5-6 heures à LOW, juste assez pour réchauffer et imbiber des saveurs."
    }
  ]'::jsonb
WHERE slug = 'jambon-a-la-biere-a-la-mijoteuse';


-- ============================================================
-- 5. POULET GÉNÉRAL TAO (position 15, 1000 recherches/mois)
-- Mot-clé: "poulet général tao"
-- ============================================================
UPDATE recipes SET
  seo_title = 'Poulet Général Tao Maison | Meilleur que le Restaurant',
  seo_description = 'Recette poulet général tao maison croustillant avec sauce sucrée-épicée. Plus savoureux que le resto, prêt en 30 minutes! Avec riz ou nouilles.',
  introduction = '<p>Le <strong>poulet général tao</strong> est le plat sino-canadien préféré de tous! Cette version maison vous permet de recréer ce classique avec du poulet extra croustillant et une sauce sucrée-épicée parfaitement équilibrée.</p>
<p>Plus savoureux et plus frais que celui du restaurant, ce <strong>poulet général tao maison</strong> deviendra rapidement votre recette du vendredi soir!</p>'
WHERE slug = 'poulet-general-tao';

UPDATE recipes SET
  faq = '[
    {
      "question": "Comment rendre le poulet général tao croustillant?",
      "answer": "Le secret: enrobez le poulet de fécule de maïs (pas de farine) et faites-le frire deux fois. La première friture cuit le poulet, la deuxième le rend extra croustillant. Ajoutez la sauce au dernier moment pour garder le croustillant."
    },
    {
      "question": "Peut-on faire le poulet général tao au four?",
      "answer": "Oui! Pour une version plus légère, enrobez le poulet de fécule et faites-le cuire au four à 425°F (220°C) pendant 20-25 minutes en le retournant à mi-cuisson. Nappez de sauce avant de servir."
    },
    {
      "question": "Comment préparer la sauce général tao?",
      "answer": "Mélangez sauce soja, vinaigre de riz, sucre, ketchup, bouillon de poulet, ail et gingembre. Épaississez avec un peu de fécule de maïs diluée. Ajoutez des flocons de piment pour plus de piquant!"
    },
    {
      "question": "Avec quoi servir le poulet général tao?",
      "answer": "Servez-le sur du riz blanc ou du riz frit, avec des légumes sautés (brocoli, pois mange-tout). Vous pouvez aussi le servir avec des nouilles udon ou chow mein. Garnissez de graines de sésame et d''oignons verts."
    }
  ]'::jsonb
WHERE slug = 'poulet-general-tao';


-- ============================================================
-- 6. CREPE TRADITIONNELLE (position 8-9, 390-1300 recherches/mois)
-- Mots-clés: "crepe traditionnelle", "recette crepe traditionnelle"
-- ============================================================
UPDATE recipes SET
  seo_title = 'Crêpe Traditionnelle Facile | Recette Classique Parfaite',
  seo_description = 'Recette crêpe traditionnelle facile: pâte légère, crêpes fines et savoureuses. La vraie recette de crêpes maison pour le petit-déjeuner ou la Chandeleur!',
  introduction = '<p>La <strong>crêpe traditionnelle</strong> est un incontournable de la cuisine française et québécoise! Cette recette classique vous donne des crêpes fines, légères et délicieusement moelleuses à chaque fois.</p>
<p>Que ce soit pour la Chandeleur, le brunch du dimanche ou un dessert improvisé, cette <strong>recette de crêpes facile</strong> plaît à toute la famille!</p>'
WHERE slug = 'crepe-traditionnelle';

UPDATE recipes SET
  faq = '[
    {
      "question": "Comment avoir des crêpes bien fines?",
      "answer": "Pour des crêpes fines: utilisez une pâte liquide (ajoutez du lait si nécessaire), versez une petite quantité dans la poêle chaude et faites-la tourner rapidement pour répartir la pâte en couche mince. Laissez reposer la pâte 30 min avant de cuire."
    },
    {
      "question": "Pourquoi laisser reposer la pâte à crêpes?",
      "answer": "Le repos permet au gluten de se détendre et à l''amidon d''absorber le liquide. Résultat: des crêpes plus moelleuses et plus faciles à cuire. Minimum 30 minutes, idéalement 1-2 heures au réfrigérateur."
    },
    {
      "question": "Comment conserver les crêpes?",
      "answer": "Empilez les crêpes refroidies en intercalant du papier ciré entre chacune. Conservez au réfrigérateur 3-4 jours ou congelez jusqu''à 2 mois. Réchauffez au micro-ondes 15-20 secondes par crêpe."
    },
    {
      "question": "Peut-on préparer la pâte à crêpes la veille?",
      "answer": "Absolument! La pâte à crêpes se conserve très bien au réfrigérateur pendant 24-48 heures. Sortez-la 15-20 minutes avant de cuire et mélangez-la doucement. Elle sera même meilleure car bien reposée!"
    }
  ]'::jsonb
WHERE slug = 'crepe-traditionnelle';


-- ============================================================
-- 7. SOUPE AUX LÉGUMES (position 7, 1600 recherches/mois)
-- Mot-clé: "soupe aux légumes facile"
-- ============================================================
UPDATE recipes SET
  seo_title = 'Soupe aux Légumes Facile | Recette Réconfortante Maison',
  seo_description = 'Soupe aux légumes facile et réconfortante: carottes, céleri, pommes de terre dans un bouillon savoureux. Prête en 30 minutes, parfaite toute l''année!',
  introduction = '<p>Cette <strong>soupe aux légumes facile</strong> est le repas réconfortant par excellence! Remplie de légumes colorés et d''un bouillon savoureux, elle réchauffe le corps et l''âme.</p>
<p>Économique, saine et délicieuse, cette <strong>soupe aux légumes maison</strong> se prépare en 30 minutes avec des ingrédients que vous avez probablement déjà!</p>'
WHERE slug = 'soupe-aux-legumes';

UPDATE recipes SET
  faq = '[
    {
      "question": "Quels légumes mettre dans une soupe aux légumes?",
      "answer": "Les classiques: carottes, céleri, pommes de terre, oignon, haricots verts, pois, maïs, tomates. Vous pouvez aussi ajouter courgettes, poireaux, navet, chou, épinards ou tout légume de saison que vous avez sous la main!"
    },
    {
      "question": "Comment rendre la soupe aux légumes plus nourrissante?",
      "answer": "Ajoutez des légumineuses (lentilles, pois chiches, haricots blancs), des pâtes courtes (macaroni, orzo) ou du riz. Vous pouvez aussi incorporer du poulet effiloché ou des cubes de bœuf pour un repas complet."
    },
    {
      "question": "Peut-on congeler la soupe aux légumes?",
      "answer": "Oui! La soupe aux légumes se congèle parfaitement jusqu''à 3 mois. Si elle contient des pâtes ou des pommes de terre, ceux-ci peuvent devenir un peu mous — ajoutez-les frais lors du réchauffage pour un meilleur résultat."
    },
    {
      "question": "Comment épaissir une soupe aux légumes trop liquide?",
      "answer": "Écrasez quelques légumes cuits avec une fourchette ou mixez une partie de la soupe et remélangez. Vous pouvez aussi ajouter une pomme de terre râpée ou 1-2 cuillères de fécule de maïs diluée dans un peu d''eau froide."
    }
  ]'::jsonb
WHERE slug = 'soupe-aux-legumes';


-- ============================================================
-- 8. BLANC MANGER (position 4, 320 recherches/mois)
-- Mot-clé: "blanc manger"
-- ============================================================
UPDATE recipes SET
  seo_title = 'Blanc Manger Traditionnel | Dessert Québécois Crémeux',
  seo_description = 'Recette blanc manger québécois traditionnel: dessert crémeux à la vanille ou au coconut. Facile, économique et nostalgique! Comme grand-maman le faisait.',
  introduction = '<p>Le <strong>blanc manger</strong> est un dessert québécois traditionnel qui rappelle notre enfance! Ce pouding crémeux à la vanille (ou au coconut) est simple, économique et absolument délicieux.</p>
<p>Transmise de génération en génération, cette recette de <strong>blanc manger maison</strong> fait partie de notre patrimoine culinaire. Un dessert réconfortant qui plaît à tous les âges!</p>'
WHERE slug = 'blanc-manger-traditionnel';

UPDATE recipes SET
  faq = '[
    {
      "question": "Quelle est la différence entre blanc manger et pouding?",
      "answer": "Le blanc manger est traditionnellement préparé avec du lait, du sucre et de la fécule de maïs, sans œufs. Sa texture est plus légère et gélatineuse que le pouding classique. Au Québec, on l''aromatise souvent à la vanille ou au coconut."
    },
    {
      "question": "Comment éviter les grumeaux dans le blanc manger?",
      "answer": "Délayez toujours la fécule de maïs dans du lait froid avant de l''ajouter au lait chaud. Remuez constamment avec un fouet pendant la cuisson. Si des grumeaux se forment, passez le mélange au tamis."
    },
    {
      "question": "Peut-on faire le blanc manger à l''avance?",
      "answer": "Oui! Le blanc manger se conserve 3-4 jours au réfrigérateur. Couvrez la surface de pellicule plastique (en contact direct) pour éviter la formation d''une peau. Servez froid ou à température ambiante."
    }
  ]'::jsonb
WHERE slug = 'blanc-manger-traditionnel';


-- ============================================================
-- VÉRIFICATION FINALE
-- ============================================================
SELECT
  slug,
  seo_title,
  LEFT(seo_description, 80) as description_preview
FROM recipes
WHERE slug IN (
  'soupe-au-chou',
  'chocolat-chaud',
  'pouding-aux-bleuets',
  'jambon-a-la-biere-a-la-mijoteuse',
  'poulet-general-tao',
  'crepe-traditionnelle',
  'soupe-aux-legumes',
  'blanc-manger-traditionnel'
);
