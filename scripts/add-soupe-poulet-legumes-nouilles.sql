-- Add Soupe poulet légumes et nouilles (macaroni)
INSERT INTO recipes (
  slug,
  title,
  excerpt,
  content,
  introduction,
  conclusion,
  prep_time,
  cook_time,
  rest_time,
  total_time,
  servings,
  servings_unit,
  difficulty,
  ingredients,
  instructions,
  nutrition,
  tags,
  cuisine,
  author,
  seo_title,
  seo_description,
  faq,
  published_at,
  updated_at
) VALUES (
  'soupe-poulet-legumes-nouilles-macaroni',
  'Soupe poulet, légumes et nouilles (macaroni)',
  'Une soupe-repas bien réconfortante: poulet doré à l''huile d''olive, légumes tendres, bouillon riche et macaroni qui rend le tout vraiment nourrissant.',
  'Astuces: pour un bouillon plus goûteux, fais dorer le poulet sans le bouger au début (ça crée une belle coloration). Si tu veux éviter que le macaroni devienne trop mou, tu peux le cuire à part et l''ajouter au moment de servir. Ajuste l''eau ou le bouillon en fin de cuisson: les pâtes boivent beaucoup!',
  E'Cette soupe poulet-légumes-nouilles, c''est le classique «ça sent bon dans toute la maison» qui sauve les journées froides (ou les journées où on veut juste du comfort food). Le truc gagnant ici, c''est de dorer le poulet dans l''huile d''olive avant de tout mouiller au bouillon: ça donne une base plus savoureuse, comme si la soupe avait mijoté depuis le matin.\n\nAvec oignon, poivron, céleri, carotte et une bonne poignée de persil, tu te retrouves avec une soupe complète, colorée, et parfaite pour vider le tiroir à légumes sans se compliquer la vie. Et oui: le macaroni, c''est un peu la touche «soupe-repas» qui fait que tout le monde en reprend.',
  E'Sers cette soupe bien chaude avec des craquelins, du pain beurré (ou un grilled cheese si tu veux jouer dans la cour des grands). Elle est encore meilleure le lendemain, quand les saveurs ont eu le temps de se jaser.\n\nSi tu prévois des restants, garde en tête que les pâtes gonflent: au service, ajoute un petit splash de bouillon ou d''eau chaude pour retrouver la texture parfaite.',
  20,
  70,
  5,
  95,
  6,
  'bols',
  'facile',
  '[{"title": "Base de soupe", "items": [{"quantity": "2", "unit": "c. à soupe", "name": "huile d''olive", "note": ""}, {"quantity": "600", "unit": "g", "name": "poulet désossé (poitrines ou hauts de cuisse)", "note": "coupé en petits morceaux"}, {"quantity": "1", "unit": "", "name": "oignon", "note": "haché"}, {"quantity": "1", "unit": "", "name": "poivron", "note": "en petits dés"}, {"quantity": "2", "unit": "branches", "name": "céleri", "note": "en dés"}, {"quantity": "2", "unit": "", "name": "carottes", "note": "en dés ou en demi-rondelles"}, {"quantity": "2", "unit": "gousses", "name": "ail", "note": "haché (optionnel mais recommandé)"}, {"quantity": "1800", "unit": "ml", "name": "bouillon de poulet", "note": ""}, {"quantity": "410", "unit": "g", "name": "macaroni", "note": "sec"}, {"quantity": "2", "unit": "c. à soupe", "name": "persil", "note": "haché (ou au goût)"}, {"quantity": "", "unit": "", "name": "sel", "note": "au goût (le bouillon peut déjà être salé)"}, {"quantity": "", "unit": "", "name": "poivre", "note": "au goût"}]}]',
  '[{"step": 1, "title": "Dorer le poulet", "content": "Dans une grosse marmite, chauffe l''huile d''olive à feu moyen-élevé. Ajoute le poulet en petits morceaux et laisse-le dorer sans trop brasser au début: cette coloration donne une base plus goûteuse à toute la soupe. Brasse ensuite pour cuire uniformément jusqu''à ce que le poulet ne soit plus rosé.", "tip": "Évite de surcharger la marmite: si besoin, dore le poulet en 2 fois pour garder une belle chaleur."}, {"step": 2, "title": "Ajouter le persil et les légumes aromatiques", "content": "Ajoute le persil, l''oignon, le poivron, le céleri et les carottes. Fais revenir 5 à 7 minutes en remuant: ça attendrit les légumes et ça libère leurs arômes, ce qui rend le bouillon plus riche au final.", "tip": "Si tu utilises l''ail, ajoute-le dans la dernière minute pour éviter qu''il brûle."}, {"step": 3, "title": "Mouiller au bouillon", "content": "Verse le bouillon de poulet (1800 ml) dans la marmite. Gratte le fond avec une cuillère pour décoller les petits sucs de cuisson: c''est là que se cache le goût. Assaisonne légèrement (sel/poivre) en gardant en tête que le bouillon est souvent déjà salé.", "tip": "Goûte avant de trop saler: tu pourras ajuster à la fin."}, {"step": 4, "title": "Porter à gros bouillon", "content": "Monte à feu très élevé et amène la soupe à ébullition franche. Cette étape chauffe rapidement le bouillon et aide à démarrer la cuisson des légumes de façon efficace.", "tip": "Couvre partiellement pour accélérer l''ébullition, mais surveille pour éviter les débordements."}, {"step": 5, "title": "Cuire le macaroni puis mijoter", "content": "Ajoute le macaroni (410 g) quand ça bout. Remue tout de suite pour éviter que les pâtes collent au fond. Quand l''ébullition reprend, baisse à feu moyen et laisse mijoter environ 60 minutes, en remuant à l''occasion: ça attendrit les légumes et donne une soupe plus «mijotée», bien ronde en bouche.", "tip": "Si le niveau descend trop (les pâtes boivent!), ajoute un peu d''eau ou de bouillon chaud en cours de route."}, {"step": 6, "title": "Ajuster la texture et rectifier l''assaisonnement", "content": "À la fin, goûte et ajuste sel/poivre. Si tu la veux plus soupy, ajoute un peu de bouillon. Si tu la veux plus épaisse, laisse mijoter 5 à 10 minutes de plus à découvert: l''évaporation va concentrer les saveurs.", "tip": "Un petit extra de persil frais juste avant de servir réveille vraiment le goût."}]',
  '{"calories": 420, "protein": 30, "carbs": 44, "fat": 12, "fiber": 4, "sugar": 6, "sodium": 780}',
  ARRAY['réconfortant', 'familial', 'soupe-repas', 'poulet', 'légumes'],
  'Québécoise',
  'Menucochon',
  'Soupe poulet légumes et nouilles | Recette facile',
  'Fais une soupe poulet-légumes avec macaroni ultra réconfortante: poulet doré, bouillon savoureux et cuisson simple. Essaie-la ce soir!',
  '{"id":null,"title_fr":"FAQ – Soupe poulet légumes et nouilles","title_en":"FAQ – Chicken vegetable noodle soup","faq":[{"question_fr":"Comment conserver cette soupe?","answer_fr":"Garde-la au frigo dans un contenant hermétique jusqu''à 3-4 jours. Comme les pâtes absorbent le bouillon, ajoute un peu d''eau ou de bouillon au réchauffage pour retrouver une belle texture.","question_en":"How do I store this soup?","answer_en":"Refrigerate in an airtight container for up to 3–4 days. The pasta will absorb broth, so add a splash of water or broth when reheating."},{"question_fr":"Est-ce que ça se congèle bien?","answer_fr":"Oui, mais idéalement sans les pâtes: elles ramollissent au congélo. Si tu peux, congèle la soupe (sans macaroni) et ajoute des pâtes fraîchement cuites au service.","question_en":"Does it freeze well?","answer_en":"Yes, but it''s best without the pasta since it can turn soft after freezing. Freeze the soup base and add freshly cooked pasta when serving."},{"question_fr":"Quelles substitutions je peux faire?","answer_fr":"Tu peux remplacer le poivron par du zucchini, ajouter des petits pois, ou utiliser du dinde au lieu du poulet. Pour les pâtes, n''importe quelle petite pâte courte fonctionne (coquillettes, ditalini, etc.).","question_en":"What substitutions can I make?","answer_en":"Swap bell pepper for zucchini, add peas, or use turkey instead of chicken. Any small short pasta works (ditalini, small shells, etc.)."},{"question_fr":"Comment savoir quand c''est prêt?","answer_fr":"Les légumes doivent être tendres, le poulet bien cuit, et les pâtes al dente (ou un peu plus tendres si tu mijotes longtemps). Goûter reste la meilleure méthode!","question_en":"How do I know when it''s done?","answer_en":"Vegetables should be tender, chicken fully cooked, and pasta al dente (or softer if you simmer longer). A quick taste test is the best check."},{"question_fr":"Puis-je la préparer à l''avance?","answer_fr":"Oui! Prépare la base (poulet + légumes + bouillon), puis ajoute les pâtes au moment de servir pour éviter qu''elles boivent tout le bouillon pendant la nuit.","question_en":"Can I make it ahead?","answer_en":"Absolutely. Make the soup base (chicken, veggies, broth) ahead, then add pasta at serving time so it doesn''t absorb all the broth overnight."},{"question_fr":"Quelles erreurs éviter?","answer_fr":"Évite de trop saler au début (le bouillon est souvent salé) et pense à remuer après avoir ajouté les pâtes pour prévenir qu''elles collent. Surveille aussi le niveau de liquide: les pâtes épaississent vite la soupe.","question_en":"What mistakes should I avoid?","answer_en":"Don''t oversalt early (broth can be salty) and stir right after adding pasta so it doesn''t stick. Also watch the liquid level—pasta thickens the soup quickly."}]}',
  NOW(),
  NOW()
);

-- Add categories: Soupes (10), Poulet (22), Pâtes (24), Nouilles (15), Canada (23)
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT id, unnest(ARRAY[10, 22, 24, 15, 23])
FROM recipes
WHERE slug = 'soupe-poulet-legumes-nouilles-macaroni';

-- Add English translation
INSERT INTO recipe_translations (
  recipe_id,
  locale,
  slug_en,
  title,
  excerpt,
  content,
  introduction,
  conclusion,
  ingredients,
  instructions,
  seo_title,
  seo_description,
  faq,
  translated_at
)
SELECT
  id,
  'en',
  'chicken-vegetable-noodle-soup-macaroni',
  'Chicken Vegetable Noodle Soup (with Macaroni)',
  'A cozy, satisfying soup made with golden-seared chicken, tender vegetables, flavorful broth, and macaroni that turns it into a full meal.',
  'The key move is searing the chicken in olive oil first—those browned bits at the bottom of the pot add real depth to the broth.',
  E'This chicken-vegetable noodle soup is the kind of comfort food that makes the whole kitchen smell like home. The key move is searing the chicken in olive oil first—those browned bits at the bottom of the pot add real depth to the broth.\n\nWith onion, bell pepper, celery, carrots, and a handful of parsley, you get a colorful, hearty soup that''s perfect for busy nights and leftover lunches. The macaroni makes it extra filling, so it truly eats like a meal.',
  E'Serve it piping hot with crackers or buttered bread (or go all-in with a grilled cheese). It tastes even better the next day once the flavors meld.\n\nIf you''re planning leftovers, remember pasta absorbs broth—just add a splash of broth or hot water when reheating to bring it back to the perfect consistency.',
  '[{"title": "Soup base", "items": [{"quantity": "2", "unit": "tbsp", "name": "olive oil", "note": ""}, {"quantity": "600", "unit": "g", "name": "boneless chicken (breast or thighs)", "note": "cut into small pieces"}, {"quantity": "1", "unit": "", "name": "onion", "note": "chopped"}, {"quantity": "1", "unit": "", "name": "bell pepper", "note": "small dice"}, {"quantity": "2", "unit": "stalks", "name": "celery", "note": "diced"}, {"quantity": "2", "unit": "", "name": "carrots", "note": "diced or sliced"}, {"quantity": "2", "unit": "cloves", "name": "garlic", "note": "minced (optional but recommended)"}, {"quantity": "1800", "unit": "ml", "name": "chicken broth", "note": ""}, {"quantity": "410", "unit": "g", "name": "macaroni", "note": "dry"}, {"quantity": "2", "unit": "tbsp", "name": "parsley", "note": "chopped (or to taste)"}, {"quantity": "", "unit": "", "name": "salt", "note": "to taste"}, {"quantity": "", "unit": "", "name": "black pepper", "note": "to taste"}]}]',
  '[{"step": 1, "title": "Sear the chicken", "content": "Heat olive oil in a large pot over medium-high heat. Add the chicken pieces and let them sit briefly so they brown—this builds flavor for the whole soup. Stir and cook until the chicken is no longer pink.", "tip": "If the pot is crowded, sear in two batches so the chicken browns instead of steaming."}, {"step": 2, "title": "Add parsley and vegetables", "content": "Stir in parsley, onion, bell pepper, celery, and carrots. Cook for 5–7 minutes, stirring, to soften the vegetables and release their aromas, which enriches the broth later.", "tip": "Add garlic in the last minute so it stays fragrant and doesn''t burn."}, {"step": 3, "title": "Pour in the broth", "content": "Add the chicken broth. Scrape the bottom of the pot to lift any browned bits—those are pure flavor. Season lightly with salt and pepper, keeping in mind the broth may already be salty.", "tip": "Taste before adding much salt—you can always adjust at the end."}, {"step": 4, "title": "Bring to a rolling boil", "content": "Turn the heat to high and bring the soup to a strong boil. This quickly heats everything through and gets the cooking momentum going.", "tip": "Partially cover to speed things up, but watch closely to prevent boil-overs."}, {"step": 5, "title": "Cook the macaroni, then simmer", "content": "Add the dry macaroni once the broth is boiling. Stir immediately so it doesn''t stick. When it returns to a boil, reduce to medium and simmer for about 60 minutes, stirring occasionally, until the vegetables are very tender and the soup tastes nicely ''mellowed'' and developed.", "tip": "If it thickens too much (pasta drinks broth!), add a little hot water or extra broth as needed."}, {"step": 6, "title": "Adjust and serve", "content": "Taste and adjust seasoning. For a soupier texture, add more broth; for a thicker soup, simmer uncovered for 5–10 minutes to concentrate the flavors. Serve hot with an extra sprinkle of parsley if you like.", "tip": "Fresh parsley right before serving brightens everything up."}]',
  'Chicken Vegetable Noodle Soup | Easy Comfort Meal',
  'Make a hearty chicken vegetable noodle soup with macaroni: golden-seared chicken, tender veggies, and rich broth. Cozy, easy, and perfect for leftovers.',
  '[{"question_fr":"Comment conserver cette soupe?","answer_fr":"Garde-la au frigo dans un contenant hermétique jusqu''à 3-4 jours.","question_en":"How do I store this soup?","answer_en":"Refrigerate in an airtight container for up to 3–4 days."},{"question_fr":"Est-ce que ça se congèle bien?","answer_fr":"Oui, mais idéalement sans les pâtes.","question_en":"Does it freeze well?","answer_en":"Yes, but it''s best without the pasta since it can turn soft after freezing."},{"question_fr":"Quelles substitutions je peux faire?","answer_fr":"Tu peux remplacer le poivron par du zucchini ou utiliser du dinde.","question_en":"What substitutions can I make?","answer_en":"Swap bell pepper for zucchini, add peas, or use turkey instead of chicken."}]',
  NOW()
FROM recipes
WHERE slug = 'soupe-poulet-legumes-nouilles-macaroni';
