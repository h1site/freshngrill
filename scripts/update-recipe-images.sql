-- Mise à jour des images et alt texts pour les 7 nouvelles recettes
-- Utilise featured_image (pas featured_image)

-- D'abord, ajouter la colonne image_alt à recipes si elle n'existe pas
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- Ajouter la colonne image_alt à recipe_translations si elle n'existe pas
ALTER TABLE recipe_translations ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- 1. Pain aux bananes moelleux
UPDATE recipes SET
  featured_image = 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/banana-bread-and-bananas-on-a-dark-background-top-2025-03-25-17-19-04-utc.jpg',
  image_alt = 'Pain aux bananes moelleux tranché avec des bananes fraîches sur fond sombre'
WHERE slug = 'pain-aux-bananes-moelleux';

UPDATE recipe_translations SET
  image_alt = 'Moist sliced banana bread with fresh bananas on a dark background'
WHERE locale = 'en' AND recipe_id = (SELECT id FROM recipes WHERE slug = 'pain-aux-bananes-moelleux');

-- 2. Poulet au beurre indien
UPDATE recipes SET
  featured_image = 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/chicken-tikka-masala-2025-03-06-04-51-00-utc.jpg',
  image_alt = 'Poulet au beurre indien (butter chicken) dans une sauce crémeuse aux tomates'
WHERE slug = 'poulet-au-beurre-indien';

UPDATE recipe_translations SET
  image_alt = 'Indian butter chicken in a creamy tomato sauce'
WHERE locale = 'en' AND recipe_id = (SELECT id FROM recipes WHERE slug = 'poulet-au-beurre-indien');

-- 3. Filets de porc glacés à l'érable
UPDATE recipes SET
  featured_image = 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/pork-baked-with-vegetables-on-a-tray-2024-10-11-06-09-24-utc.JPG',
  image_alt = 'Filets de porc glacés à l''érable du Québec avec légumes rôtis'
WHERE slug = 'filets-de-porc-glaces-erable';

UPDATE recipe_translations SET
  image_alt = 'Quebec maple glazed pork tenderloin with roasted vegetables'
WHERE locale = 'en' AND recipe_id = (SELECT id FROM recipes WHERE slug = 'filets-de-porc-glaces-erable');

-- 4. Soupe à l'oignon gratinée
UPDATE recipes SET
  featured_image = 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/french-onion-soup-with-cheesy-bread-2024-09-13-22-12-03-utc.jpg',
  image_alt = 'Soupe à l''oignon gratinée française avec croûton de pain et fromage fondu'
WHERE slug = 'soupe-a-loignon-gratinee';

UPDATE recipe_translations SET
  image_alt = 'French onion soup gratinée with bread crouton and melted cheese'
WHERE locale = 'en' AND recipe_id = (SELECT id FROM recipes WHERE slug = 'soupe-a-loignon-gratinee');

-- 5. Gâteau aux carottes meilleur
UPDATE recipes SET
  featured_image = 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/spiced-carrot-cake-with-walnuts-and-cinnamon-2025-03-24-07-37-24-utc.jpg',
  image_alt = 'Gâteau aux carottes épicé avec noix et cannelle, glaçage au fromage à la crème'
WHERE slug = 'gateau-aux-carottes-meilleur';

UPDATE recipe_translations SET
  image_alt = 'Spiced carrot cake with walnuts and cinnamon, cream cheese frosting'
WHERE locale = 'en' AND recipe_id = (SELECT id FROM recipes WHERE slug = 'gateau-aux-carottes-meilleur');

-- 6. Tartare de boeuf classique
UPDATE recipes SET
  featured_image = 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/fresh-beef-tartar-with-tasty-vegetables-2024-12-05-18-48-04-utc.jpg',
  image_alt = 'Tartare de boeuf classique frais avec légumes et assaisonnements'
WHERE slug = 'tartare-de-boeuf-classique';

UPDATE recipe_translations SET
  image_alt = 'Classic fresh beef tartare with vegetables and seasonings'
WHERE locale = 'en' AND recipe_id = (SELECT id FROM recipes WHERE slug = 'tartare-de-boeuf-classique');

-- 7. Soupe aux pois traditionnelle
UPDATE recipes SET
  featured_image = 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/chickpea-sauce-with-fresh-lemon-juice-sesame-seed-2025-02-18-12-45-53-utc.jpg',
  image_alt = 'Soupe aux pois traditionnelle québécoise crémeuse et réconfortante'
WHERE slug = 'soupe-aux-pois-traditionnelle';

UPDATE recipe_translations SET
  image_alt = 'Traditional Quebec split pea soup, creamy and comforting'
WHERE locale = 'en' AND recipe_id = (SELECT id FROM recipes WHERE slug = 'soupe-aux-pois-traditionnelle');
