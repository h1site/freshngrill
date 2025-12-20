-- Amélioration SEO pour la recette "Pain aux bananes"
-- Mots-clés ciblés: "recette pain aux bananes facile" (390 recherches/mois, position 15)
--                  "pain aux bananes moelleux" (480 recherches/mois)

-- Mise à jour du titre SEO et description
UPDATE recipes SET
  seo_title = 'Pain aux Bananes Moelleux | Recette Facile en 10 Minutes',
  seo_description = 'Recette pain aux bananes facile et moelleux: mélangez, enfournez, dégustez! Le meilleur pain aux bananes avec bananes mûres, prêt en 10 min de préparation. Succès garanti!',
  excerpt = 'Ce pain aux bananes moelleux est la recette facile que tout le monde adore! Avec des bananes bien mûres, quelques ingrédients simples et 10 minutes de préparation, vous obtiendrez un pain ultra fondant et parfumé. Parfait pour le petit-déjeuner ou la collation!',
  introduction = '<p>Vous cherchez une <strong>recette de pain aux bananes facile</strong> qui donne un résultat moelleux à tout coup? Cette recette de <strong>pain aux bananes moelleux</strong> est LA solution! Pas besoin d''être pâtissier: mélangez les ingrédients, enfournez et laissez la magie opérer.</p>
<p>Le secret d''un bon pain aux bananes? Des <strong>bananes très mûres</strong> (avec des taches brunes sur la peau). Plus elles sont mûres, plus votre pain sera sucré naturellement et moelleux!</p>',
  conclusion = '<p>Ce <strong>pain aux bananes moelleux</strong> est la recette parfaite pour utiliser vos bananes trop mûres. Conservez-le enveloppé à température ambiante pendant 2-3 jours, ou tranchez-le et congelez-le pour jusqu''à 3 mois.</p>
<p>Servez-le tiède avec un peu de beurre, de Nutella ou simplement nature — c''est toujours un délice!</p>',
  content = '<p><strong>Bananes parfaites:</strong> Utilisez des bananes avec des taches brunes sur la peau — elles sont plus sucrées et donnent un pain plus moelleux.</p>
<p><strong>Astuce congélation:</strong> Congelez vos bananes trop mûres (avec la peau) pour les utiliser plus tard dans cette recette.</p>
<p><strong>Variations gourmandes:</strong> Ajoutez des pépites de chocolat, des noix de Grenoble ou des noix de pécan pour encore plus de saveur!</p>
<p><strong>Pain encore plus moelleux:</strong> Remplacez le beurre par de l''huile végétale ou ajoutez 1/4 tasse de yogourt grec.</p>
<p><strong>Test de cuisson:</strong> Insérez un cure-dent au centre — s''il ressort propre, votre pain est prêt!</p>'
WHERE slug = 'pain-aux-bananes';

-- Mise à jour/Ajout du FAQ en français
UPDATE recipes SET
  faq = '[
    {
      "question": "Pourquoi mon pain aux bananes est-il sec?",
      "answer": "Un pain aux bananes sec est souvent causé par une cuisson trop longue ou pas assez de bananes. Utilisez 3-4 bananes très mûres et vérifiez la cuisson avec un cure-dent à partir de 50 minutes. Le centre doit être juste pris mais encore humide."
    },
    {
      "question": "Peut-on faire un pain aux bananes sans oeufs?",
      "answer": "Oui! Remplacez chaque oeuf par 1/4 tasse de compote de pommes, 1/4 tasse de yogourt grec, ou 1 banane écrasée supplémentaire. Le pain sera légèrement plus dense mais tout aussi délicieux."
    },
    {
      "question": "Comment rendre le pain aux bananes plus moelleux?",
      "answer": "Pour un pain aux bananes ultra moelleux: utilisez des bananes très mûres, ne sur-mélangez pas la pâte, ajoutez 1/4 tasse de yogourt grec ou de crème sure, et ne sur-cuisez pas (arrêtez quand le cure-dent sort avec quelques miettes humides)."
    },
    {
      "question": "Peut-on congeler le pain aux bananes?",
      "answer": "Absolument! Le pain aux bananes se congèle parfaitement. Tranchez-le, emballez les tranches individuellement dans du film plastique, puis placez-les dans un sac congélation. Conservation jusqu''à 3 mois. Décongelez à température ambiante ou au grille-pain."
    },
    {
      "question": "Comment utiliser des bananes trop mûres?",
      "answer": "Les bananes avec des taches brunes ou même noires sont parfaites pour le pain aux bananes! Elles sont plus sucrées et donnent un pain plus moelleux. Vous pouvez aussi les congeler pour les utiliser plus tard."
    }
  ]'::jsonb
WHERE slug = 'pain-aux-bananes';

-- Mise à jour de la traduction anglaise
UPDATE recipe_translations SET
  seo_title = 'Moist Banana Bread | Easy Recipe in 10 Minutes',
  seo_description = 'Easy moist banana bread recipe: mix, bake, enjoy! The best banana bread with ripe bananas, ready in 10 min prep time. Guaranteed success!',
  excerpt = 'This moist banana bread is the easy recipe everyone loves! With ripe bananas, a few simple ingredients and 10 minutes of prep, you''ll get an ultra-tender and flavorful bread. Perfect for breakfast or snack time!',
  introduction = '<p>Looking for an <strong>easy banana bread recipe</strong> that turns out moist every time? This <strong>moist banana bread recipe</strong> is THE solution! No need to be a pastry chef: mix the ingredients, bake and let the magic happen.</p>
<p>The secret to great banana bread? <strong>Very ripe bananas</strong> (with brown spots on the peel). The riper they are, the naturally sweeter and moister your bread will be!</p>',
  conclusion = '<p>This <strong>moist banana bread</strong> is the perfect recipe for using up your overripe bananas. Store it wrapped at room temperature for 2-3 days, or slice and freeze for up to 3 months.</p>
<p>Serve it warm with a little butter, Nutella or simply plain — it''s always delicious!</p>',
  content = '<p><strong>Perfect bananas:</strong> Use bananas with brown spots on the peel — they''re sweeter and make a moister bread.</p>
<p><strong>Freezing tip:</strong> Freeze your overripe bananas (with the peel) to use later in this recipe.</p>
<p><strong>Delicious variations:</strong> Add chocolate chips, walnuts or pecans for even more flavor!</p>
<p><strong>Even moister bread:</strong> Replace butter with vegetable oil or add 1/4 cup Greek yogurt.</p>
<p><strong>Doneness test:</strong> Insert a toothpick in the center — if it comes out clean, your bread is ready!</p>',
  faq = '[
    {
      "question": "Why is my banana bread dry?",
      "answer": "Dry banana bread is often caused by overbaking or not enough bananas. Use 3-4 very ripe bananas and check doneness with a toothpick starting at 50 minutes. The center should be just set but still moist."
    },
    {
      "question": "Can you make banana bread without eggs?",
      "answer": "Yes! Replace each egg with 1/4 cup applesauce, 1/4 cup Greek yogurt, or 1 extra mashed banana. The bread will be slightly denser but just as delicious."
    },
    {
      "question": "How to make banana bread more moist?",
      "answer": "For ultra-moist banana bread: use very ripe bananas, don''t overmix the batter, add 1/4 cup Greek yogurt or sour cream, and don''t overbake (stop when the toothpick comes out with a few moist crumbs)."
    },
    {
      "question": "Can you freeze banana bread?",
      "answer": "Absolutely! Banana bread freezes perfectly. Slice it, wrap slices individually in plastic wrap, then place in a freezer bag. Keeps up to 3 months. Thaw at room temperature or in the toaster."
    },
    {
      "question": "How to use overripe bananas?",
      "answer": "Bananas with brown or even black spots are perfect for banana bread! They''re sweeter and make a moister bread. You can also freeze them to use later."
    }
  ]'::jsonb
WHERE locale = 'en' AND recipe_id = (SELECT id FROM recipes WHERE slug = 'pain-aux-bananes');

-- Vérification
SELECT
  r.id,
  r.slug,
  r.seo_title,
  r.seo_description
FROM recipes r
WHERE r.slug = 'pain-aux-bananes';
