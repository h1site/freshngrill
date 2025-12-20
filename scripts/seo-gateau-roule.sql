-- ============================================================
-- SEO Optimization: Gâteau Roulé Moelleux
-- URL: https://menucochon.com/recette/gateau-roule-moelleux/
-- Mots-clés ciblés: "gâteau roulé recette de maman", "recette gâteau roulé moelleux"
-- ============================================================

UPDATE recipes SET
  -- A. Nouveau titre SEO optimisé
  seo_title = 'Gâteau Roulé – Recette de Maman, Moelleux et Facile',

  -- B. Nouveau titre H1 (title dans la DB)
  title = 'Gâteau roulé : la vraie recette de maman (moelleux et facile)',

  -- Meta description optimisée
  seo_description = 'La vraie recette de gâteau roulé de maman Bilodeau! Moelleux, léger et facile à faire. Garniture confiture, chocolat ou crème. Recette familiale québécoise.',

  -- E. Introduction émotionnelle
  introduction = '<p>Cette <strong>recette de gâteau roulé</strong>, c''est celle que ma maman Bilodeau faisait chaque dimanche après-midi. Léger, moelleux et simple, ce gâteau roulé évoque toujours la chaleur de la cuisine familiale.</p>
<p>Transmise de génération en génération, cette <strong>recette de maman</strong> donne un gâteau roulé parfaitement moelleux à chaque fois. Le secret? Une génoise aérée qui se roule sans craquer, garnie de votre confiture préférée ou d''une crème onctueuse.</p>',

  -- Conclusion mise à jour
  conclusion = '<p>Ce <strong>gâteau roulé moelleux</strong> est bien plus qu''une simple recette — c''est un morceau d''histoire familiale. Que vous le garnissiez de confiture de framboises comme maman, de crème au chocolat ou de Nutella, il fera toujours des heureux!</p>
<p>Conservez-le enveloppé au réfrigérateur jusqu''à 3 jours. Pour le servir, sortez-le 15 minutes avant pour qu''il soit à température ambiante.</p>',

  -- C. FAQ Schema optimisé pour les requêtes populaires
  faq = '[
    {
      "question": "Pourquoi cette recette s''appelle recette de maman?",
      "answer": "Cette recette de gâteau roulé a été transmise par maman Ginette Bilodeau, qui la préparait chaque dimanche. C''est une vraie recette familiale québécoise, perfectionnée au fil des années pour obtenir un gâteau toujours moelleux."
    },
    {
      "question": "Comment faire un gâteau roulé moelleux qui ne craque pas?",
      "answer": "Le secret pour un gâteau roulé moelleux: 1) Ne pas trop cuire la génoise (8-10 min max), 2) Rouler le gâteau chaud dans un linge humide, 3) Le laisser refroidir roulé avant de le garnir. La vapeur garde le gâteau souple!"
    },
    {
      "question": "Avec quoi garnir un gâteau roulé?",
      "answer": "Vous pouvez garnir votre gâteau roulé de confiture (framboises, fraises, abricot), de crème fouettée, de crème au beurre, de Nutella, de crème pâtissière ou même de crème glacée pour un dessert glacé. Maman utilisait de la confiture de framboises maison!"
    },
    {
      "question": "Peut-on préparer le gâteau roulé à l''avance?",
      "answer": "Oui! Le gâteau roulé se conserve 2-3 jours au réfrigérateur bien emballé. Vous pouvez aussi congeler la génoise roulée (sans garniture) jusqu''à 1 mois. Décongelez-la au frigo puis garnissez avant de servir."
    },
    {
      "question": "Pourquoi mon gâteau roulé est-il sec?",
      "answer": "Un gâteau roulé sec est souvent trop cuit. Surveillez bien la cuisson: la génoise doit être dorée mais encore souple au toucher (8-10 minutes à 375°F). Roulez-la immédiatement dans un linge humide pour conserver l''humidité."
    }
  ]'::jsonb,

  -- Astuces/Tips mise à jour
  content = '<p><strong>Le secret de maman:</strong> Roulez la génoise pendant qu''elle est encore chaude! Utilisez un linge à vaisselle propre et légèrement humide, saupoudré de sucre glace. Laissez refroidir complètement avant de dérouler et garnir.</p>
<p><strong>Pour éviter les craquelures:</strong> Ne surcuisez jamais la génoise. Sortez-la du four quand elle est juste dorée et rebondit légèrement au toucher. Une génoise trop cuite sera sèche et cassera au roulage.</p>
<p><strong>Garnitures préférées de la famille:</strong> Confiture de framboises (la classique de maman), crème fouettée sucrée, Nutella, ou crème au beurre à la vanille pour les occasions spéciales.</p>
<p><strong>Présentation:</strong> Saupoudrez de sucre glace juste avant de servir. Pour un look festif, ajoutez des fruits frais ou des copeaux de chocolat sur le dessus.</p>'

WHERE slug = 'gateau-roule-moelleux';

-- Vérification
SELECT
  slug,
  title,
  seo_title,
  LEFT(introduction, 150) as intro_preview
FROM recipes
WHERE slug = 'gateau-roule-moelleux';
