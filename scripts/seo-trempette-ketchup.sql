-- Amélioration SEO pour la recette "Trempette au Ketchup"
-- Mots-clés ciblés: "trempette ketchup mayo miel" (140 recherches/mois, position 10-13)
--                  "trempette ketchup mayonnaise" (70 recherches/mois, position 10-13)

-- Mise à jour du titre SEO et description
UPDATE recipes SET
  seo_title = 'Trempette Ketchup Mayonnaise Miel | Recette Facile en 2 Minutes',
  seo_description = 'La meilleure trempette ketchup mayo miel: mélangez ketchup, mayonnaise et miel pour une sauce parfaite avec poulet, frites ou crudités. Recette facile et rapide!',
  excerpt = 'Cette trempette ketchup mayonnaise au miel est LA sauce parfaite pour accompagner vos nuggets, ailes de poulet, frites et crudités. Avec seulement 3 ingrédients (ketchup, mayo et miel), préparez cette trempette irrésistible en moins de 2 minutes!',
  introduction = '<p>Vous cherchez la <strong>recette de trempette ketchup mayo miel</strong> parfaite? Cette sauce addictive combine le goût familier du ketchup avec la crémosité de la mayonnaise et une touche sucrée de miel. Le résultat: une <strong>trempette ketchup mayonnaise</strong> onctueuse qui plaît à toute la famille!</p>
<p>Idéale pour accompagner les <strong>nuggets de poulet</strong>, les <strong>ailes de poulet</strong>, les <strong>frites maison</strong> ou même les <strong>crudités</strong>, cette trempette se prépare en quelques secondes et se conserve au réfrigérateur pendant plusieurs jours.</p>',
  conclusion = '<p>Cette <strong>trempette ketchup mayo miel</strong> deviendra rapidement un incontournable de votre cuisine! Simple, rapide et délicieuse, elle accompagne parfaitement tous vos plats de poulet, frites et crudités.</p>
<p>N''hésitez pas à ajuster les proportions selon vos goûts: plus de miel pour une version plus sucrée, ou une touche de sriracha pour les amateurs de piquant!</p>',
  content = '<p><strong>Ratio parfait:</strong> Pour une trempette ketchup mayonnaise équilibrée, utilisez 2 parts de ketchup pour 1 part de mayonnaise et 1/2 part de miel.</p>
<p><strong>Variantes populaires:</strong> Ajoutez une cuillère à café de moutarde de Dijon pour plus de caractère, ou quelques gouttes de sauce Worcestershire pour une saveur umami.</p>
<p><strong>Version épicée:</strong> Incorporez une petite quantité de sriracha ou de sauce piquante pour transformer votre trempette en sauce buffalo sucrée.</p>
<p><strong>Conservation:</strong> Gardez votre trempette ketchup mayo au réfrigérateur dans un contenant hermétique jusqu''à 1 semaine.</p>'
WHERE slug = 'trempette-au-ketchup';

-- Mise à jour/Ajout du FAQ en français
UPDATE recipes SET
  faq = '[
    {
      "question": "Quelles sont les proportions idéales pour une trempette ketchup mayonnaise miel?",
      "answer": "Pour une trempette ketchup mayo miel parfaite, utilisez 1/2 tasse de ketchup, 1/4 tasse de mayonnaise et 2 cuillères à soupe de miel. Ajustez selon vos préférences: plus de miel pour une version sucrée, plus de mayo pour une texture crémeuse."
    },
    {
      "question": "Avec quoi servir la trempette ketchup mayonnaise?",
      "answer": "Cette trempette est parfaite avec les nuggets de poulet, les ailes de poulet, les frites, les rondelles d''oignon, les bâtonnets de légumes crus (carottes, céleri, poivrons) ou même comme sauce pour burger et hot-dog."
    },
    {
      "question": "Peut-on préparer la trempette ketchup mayo à l''avance?",
      "answer": "Oui! Cette trempette se conserve jusqu''à une semaine au réfrigérateur dans un contenant hermétique. Les saveurs se mélangent même mieux après quelques heures de repos."
    },
    {
      "question": "Comment rendre la trempette ketchup miel plus épicée?",
      "answer": "Ajoutez une cuillère à café de sriracha, quelques gouttes de sauce piquante Tabasco ou une pincée de piment de Cayenne. Vous obtiendrez une délicieuse sauce buffalo sucrée-épicée!"
    }
  ]'::jsonb
WHERE slug = 'trempette-au-ketchup';

-- Mise à jour de la traduction anglaise
UPDATE recipe_translations SET
  seo_title = 'Ketchup Mayo Honey Dip | Easy 2-Minute Recipe',
  seo_description = 'The best ketchup mayo honey dip: mix ketchup, mayonnaise and honey for a perfect sauce with chicken, fries or veggies. Quick and easy recipe!',
  excerpt = 'This ketchup mayonnaise honey dip is THE perfect sauce for chicken nuggets, wings, fries and raw veggies. With only 3 ingredients (ketchup, mayo and honey), prepare this irresistible dip in under 2 minutes!',
  introduction = '<p>Looking for the perfect <strong>ketchup mayo honey dip recipe</strong>? This addictive sauce combines the familiar taste of ketchup with creamy mayonnaise and a sweet touch of honey. The result: a smooth <strong>ketchup mayonnaise dip</strong> that the whole family will love!</p>
<p>Perfect for dipping <strong>chicken nuggets</strong>, <strong>chicken wings</strong>, <strong>homemade fries</strong> or even <strong>raw vegetables</strong>, this dip takes seconds to prepare and keeps in the refrigerator for several days.</p>',
  conclusion = '<p>This <strong>ketchup mayo honey dip</strong> will quickly become a staple in your kitchen! Simple, fast and delicious, it perfectly accompanies all your chicken dishes, fries and veggies.</p>
<p>Feel free to adjust the proportions to your taste: more honey for a sweeter version, or a touch of sriracha for spice lovers!</p>',
  content = '<p><strong>Perfect ratio:</strong> For a balanced ketchup mayonnaise dip, use 2 parts ketchup to 1 part mayonnaise and 1/2 part honey.</p>
<p><strong>Popular variations:</strong> Add a teaspoon of Dijon mustard for more character, or a few drops of Worcestershire sauce for umami flavor.</p>
<p><strong>Spicy version:</strong> Add a small amount of sriracha or hot sauce to transform your dip into a sweet buffalo sauce.</p>
<p><strong>Storage:</strong> Keep your ketchup mayo dip refrigerated in an airtight container for up to 1 week.</p>',
  faq = '[
    {
      "question": "What are the ideal proportions for a ketchup mayo honey dip?",
      "answer": "For a perfect ketchup mayo honey dip, use 1/2 cup ketchup, 1/4 cup mayonnaise and 2 tablespoons honey. Adjust according to your preferences: more honey for a sweeter version, more mayo for a creamier texture."
    },
    {
      "question": "What to serve with ketchup mayonnaise dip?",
      "answer": "This dip is perfect with chicken nuggets, chicken wings, fries, onion rings, raw veggie sticks (carrots, celery, peppers) or even as a sauce for burgers and hot dogs."
    },
    {
      "question": "Can you make ketchup mayo dip ahead of time?",
      "answer": "Yes! This dip keeps for up to a week in the refrigerator in an airtight container. The flavors even blend better after a few hours of rest."
    },
    {
      "question": "How to make ketchup honey dip spicier?",
      "answer": "Add a teaspoon of sriracha, a few drops of Tabasco hot sauce or a pinch of cayenne pepper. You''ll get a delicious sweet-spicy buffalo sauce!"
    }
  ]'::jsonb
WHERE locale = 'en' AND recipe_id = (SELECT id FROM recipes WHERE slug = 'trempette-au-ketchup');

-- Vérification
SELECT
  r.id,
  r.slug,
  r.seo_title,
  r.seo_description,
  LEFT(r.excerpt, 100) as excerpt_preview
FROM recipes r
WHERE r.slug = 'trempette-au-ketchup';
