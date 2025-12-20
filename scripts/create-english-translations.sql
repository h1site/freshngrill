-- Traductions anglaises pour les 7 nouvelles recettes (IDs 2139-2145)
-- + Associations catégories et origines
-- + Traductions anglaises des catégories et origines

-- ============================================
-- PARTIE 1: Table origine_translations (si n'existe pas)
-- ============================================

CREATE TABLE IF NOT EXISTS origine_translations (
  id SERIAL PRIMARY KEY,
  origine_id INTEGER NOT NULL REFERENCES origines(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(origine_id, locale)
);

-- Index et RLS
CREATE INDEX IF NOT EXISTS idx_origine_translations_locale ON origine_translations(locale);
CREATE INDEX IF NOT EXISTS idx_origine_translations_origine ON origine_translations(origine_id);

ALTER TABLE origine_translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Origine translations lisibles par tous" ON origine_translations;
CREATE POLICY "Origine translations lisibles par tous" ON origine_translations
  FOR SELECT USING (true);

-- ============================================
-- PARTIE 2: Associations catégories pour les 7 recettes
-- ============================================

-- Pain aux bananes → Desserts, Déjeuners
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'pain-aux-bananes-moelleux' AND c.slug = 'desserts'
ON CONFLICT DO NOTHING;

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'pain-aux-bananes-moelleux' AND c.slug = 'dejeuners'
ON CONFLICT DO NOTHING;

-- Poulet au beurre → Plats principaux, Volaille
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'poulet-au-beurre-indien' AND c.slug = 'plats-principaux'
ON CONFLICT DO NOTHING;

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'poulet-au-beurre-indien' AND c.slug = 'volaille'
ON CONFLICT DO NOTHING;

-- Filets de porc glacés → Plats principaux, Porc
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'filets-de-porc-glaces-erable' AND c.slug = 'plats-principaux'
ON CONFLICT DO NOTHING;

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'filets-de-porc-glaces-erable' AND c.slug = 'porc'
ON CONFLICT DO NOTHING;

-- Soupe à l'oignon → Soupes, Entrées
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'soupe-a-loignon-gratinee' AND c.slug = 'soupes'
ON CONFLICT DO NOTHING;

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'soupe-a-loignon-gratinee' AND c.slug = 'entrees'
ON CONFLICT DO NOTHING;

-- Gâteau aux carottes → Desserts, Gâteaux
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'gateau-aux-carottes-meilleur' AND c.slug = 'desserts'
ON CONFLICT DO NOTHING;

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'gateau-aux-carottes-meilleur' AND c.slug = 'gateaux'
ON CONFLICT DO NOTHING;

-- Tartare de boeuf → Plats principaux, Boeuf
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'tartare-de-boeuf-classique' AND c.slug = 'plats-principaux'
ON CONFLICT DO NOTHING;

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'tartare-de-boeuf-classique' AND c.slug = 'boeuf'
ON CONFLICT DO NOTHING;

-- Soupe aux pois → Soupes
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.slug = 'soupe-aux-pois-traditionnelle' AND c.slug = 'soupes'
ON CONFLICT DO NOTHING;

-- ============================================
-- PARTIE 3: Associations origines pour les recettes
-- ============================================

-- Poulet au beurre → Inde
INSERT INTO recipe_origines (recipe_id, origine_id)
SELECT r.id, o.id FROM recipes r, origines o
WHERE r.slug = 'poulet-au-beurre-indien' AND o.slug = 'inde'
ON CONFLICT DO NOTHING;

-- Filets de porc glacés → Québec
INSERT INTO recipe_origines (recipe_id, origine_id)
SELECT r.id, o.id FROM recipes r, origines o
WHERE r.slug = 'filets-de-porc-glaces-erable' AND o.slug = 'quebec'
ON CONFLICT DO NOTHING;

-- Soupe à l'oignon → France
INSERT INTO recipe_origines (recipe_id, origine_id)
SELECT r.id, o.id FROM recipes r, origines o
WHERE r.slug = 'soupe-a-loignon-gratinee' AND o.slug = 'france'
ON CONFLICT DO NOTHING;

-- Tartare de boeuf → France
INSERT INTO recipe_origines (recipe_id, origine_id)
SELECT r.id, o.id FROM recipes r, origines o
WHERE r.slug = 'tartare-de-boeuf-classique' AND o.slug = 'france'
ON CONFLICT DO NOTHING;

-- Soupe aux pois → Québec
INSERT INTO recipe_origines (recipe_id, origine_id)
SELECT r.id, o.id FROM recipes r, origines o
WHERE r.slug = 'soupe-aux-pois-traditionnelle' AND o.slug = 'quebec'
ON CONFLICT DO NOTHING;

-- ============================================
-- PARTIE 4: Traductions anglaises des catégories
-- ============================================

-- S'assurer que les traductions existent pour les catégories utilisées
INSERT INTO category_translations (category_id, locale, name)
SELECT id, 'en', 'Desserts' FROM categories WHERE slug = 'desserts'
ON CONFLICT (category_id, locale) DO NOTHING;

INSERT INTO category_translations (category_id, locale, name)
SELECT id, 'en', 'Breakfasts' FROM categories WHERE slug = 'dejeuners'
ON CONFLICT (category_id, locale) DO NOTHING;

INSERT INTO category_translations (category_id, locale, name)
SELECT id, 'en', 'Main Dishes' FROM categories WHERE slug = 'plats-principaux'
ON CONFLICT (category_id, locale) DO NOTHING;

INSERT INTO category_translations (category_id, locale, name)
SELECT id, 'en', 'Poultry' FROM categories WHERE slug = 'volaille'
ON CONFLICT (category_id, locale) DO NOTHING;

INSERT INTO category_translations (category_id, locale, name)
SELECT id, 'en', 'Pork' FROM categories WHERE slug = 'porc'
ON CONFLICT (category_id, locale) DO NOTHING;

INSERT INTO category_translations (category_id, locale, name)
SELECT id, 'en', 'Soups' FROM categories WHERE slug = 'soupes'
ON CONFLICT (category_id, locale) DO NOTHING;

INSERT INTO category_translations (category_id, locale, name)
SELECT id, 'en', 'Appetizers' FROM categories WHERE slug = 'entrees'
ON CONFLICT (category_id, locale) DO NOTHING;

INSERT INTO category_translations (category_id, locale, name)
SELECT id, 'en', 'Cakes' FROM categories WHERE slug = 'gateaux'
ON CONFLICT (category_id, locale) DO NOTHING;

INSERT INTO category_translations (category_id, locale, name)
SELECT id, 'en', 'Beef' FROM categories WHERE slug = 'boeuf'
ON CONFLICT (category_id, locale) DO NOTHING;

-- ============================================
-- PARTIE 5: Traductions anglaises des origines
-- ============================================

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'India' FROM origines WHERE slug = 'inde'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Quebec' FROM origines WHERE slug = 'quebec'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'France' FROM origines WHERE slug = 'france'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'United States' FROM origines WHERE slug = 'etats-unis'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Italy' FROM origines WHERE slug = 'italie'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Mexico' FROM origines WHERE slug = 'mexique'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'China' FROM origines WHERE slug = 'chine'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Japan' FROM origines WHERE slug = 'japon'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Thailand' FROM origines WHERE slug = 'thailande'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Greece' FROM origines WHERE slug = 'grece'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Morocco' FROM origines WHERE slug = 'maroc'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Spain' FROM origines WHERE slug = 'espagne'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Vietnam' FROM origines WHERE slug = 'vietnam'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Lebanon' FROM origines WHERE slug = 'liban'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Korea' FROM origines WHERE slug = 'coree'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Portugal' FROM origines WHERE slug = 'portugal'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Belgium' FROM origines WHERE slug = 'belgique'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Germany' FROM origines WHERE slug = 'allemagne'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'England' FROM origines WHERE slug = 'angleterre'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Caribbean' FROM origines WHERE slug = 'caraibes'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Tunisia' FROM origines WHERE slug = 'tunisie'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Turkey' FROM origines WHERE slug = 'turquie'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Middle East' FROM origines WHERE slug = 'moyen-orient'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Peru' FROM origines WHERE slug = 'perou'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Argentina' FROM origines WHERE slug = 'argentine'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Brazil' FROM origines WHERE slug = 'bresil'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Indonesia' FROM origines WHERE slug = 'indonesie'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Malaysia' FROM origines WHERE slug = 'malaisie'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Philippines' FROM origines WHERE slug = 'philippines'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Australia' FROM origines WHERE slug = 'australie'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Africa' FROM origines WHERE slug = 'afrique'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Ireland' FROM origines WHERE slug = 'irlande'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Poland' FROM origines WHERE slug = 'pologne'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Hungary' FROM origines WHERE slug = 'hongrie'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Russia' FROM origines WHERE slug = 'russie'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Sweden' FROM origines WHERE slug = 'suede'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Switzerland' FROM origines WHERE slug = 'suisse'
ON CONFLICT (origine_id, locale) DO NOTHING;

INSERT INTO origine_translations (origine_id, locale, name)
SELECT id, 'en', 'Austria' FROM origines WHERE slug = 'autriche'
ON CONFLICT (origine_id, locale) DO NOTHING;

-- ============================================
-- PARTIE 6: Traductions des recettes
-- ============================================

-- 1. Banana Bread (ID 2139)
INSERT INTO recipe_translations (recipe_id, locale, title, excerpt, introduction, conclusion, ingredients, instructions, faq)
VALUES (
  2139, 'en',
  'Ultra Moist Banana Bread',
  'The best banana bread recipe: ultra moist thanks to coconut milk and perfectly sweet. A comforting classic perfect for breakfast.',
  '<p><strong>Banana bread</strong> is a comfort food classic. This ultra moist version uses <strong>coconut milk</strong> which gives it an incredibly tender texture and subtle exotic flavor. This is THE recipe to make when your bananas are overripe!</p><p>The secret to perfect banana bread? Very ripe bananas (with brown spots), the right sugar-butter balance, and most importantly, not over-mixing the batter to keep it moist.</p>',
  '<p>This banana bread keeps 3-4 days at room temperature when well wrapped, or up to 3 months in the freezer. Reheat a slice in the toaster to restore its moistness!</p>',
  '[{"title": "Ingredients", "items": [{"name": "all-purpose flour", "quantity": "340", "unit": "g"}, {"name": "baking powder", "quantity": "1", "unit": "tsp"}, {"name": "baking soda", "quantity": "1", "unit": "tsp"}, {"name": "mashed ripe bananas", "quantity": "310", "unit": "ml", "note": "3-4 bananas"}, {"name": "coconut milk", "quantity": "125", "unit": "ml"}, {"name": "lime juice", "quantity": "1", "unit": "tbsp"}, {"name": "softened unsalted butter", "quantity": "115", "unit": "g"}, {"name": "sugar", "quantity": "210", "unit": "g"}, {"name": "egg", "quantity": "1", "unit": ""}, {"name": "vanilla extract", "quantity": "1", "unit": "tsp"}]}]',
  '[{"step": 1, "title": "Preheat the oven", "content": "Preheat oven to 180°C (350°F). Butter a 23 x 13 cm loaf pan and line the bottom with parchment paper."}, {"step": 2, "title": "Mix dry ingredients", "content": "In a bowl, whisk together flour, baking powder, and baking soda. Set aside."}, {"step": 3, "title": "Prepare banana mixture", "content": "In another bowl, combine mashed bananas, coconut milk, and lime juice."}, {"step": 4, "title": "Cream the butter", "content": "Using an electric mixer, cream butter with sugar until light and fluffy. Add egg and vanilla, mix well."}, {"step": 5, "title": "Combine ingredients", "content": "Fold in dry ingredients alternating with banana mixture, starting and ending with dry ingredients. Do not over-mix."}, {"step": 6, "title": "Bake", "content": "Pour into pan and bake about 1 hour, until a toothpick inserted in the center comes out clean."}, {"step": 7, "title": "Cool", "content": "Let cool 10 minutes in pan, then turn out onto a wire rack. Cool completely before slicing."}]',
  '[{"question": "Why is my banana bread dry?", "answer": "Dry banana bread often results from overbaking or using bananas that aren''t ripe enough. Use bananas with brown spots and watch the baking time."}, {"question": "Can I substitute the coconut milk?", "answer": "Yes, you can use whole milk, buttermilk, or plain yogurt for a different but equally moist result."}, {"question": "How do I know when the bread is done?", "answer": "Insert a toothpick in the center. If it comes out clean or with a few dry crumbs, it''s ready."}, {"question": "Can I add nuts or chocolate?", "answer": "Absolutely! Add 125ml of walnuts or chocolate chips to the batter."}, {"question": "How long does banana bread keep?", "answer": "3-4 days at room temperature well wrapped, or 3 months in the freezer."}]'
);

-- 2. Butter Chicken (ID 2140)
INSERT INTO recipe_translations (recipe_id, locale, title, excerpt, introduction, conclusion, ingredients, instructions, faq)
VALUES (
  2140, 'en',
  'Indian Butter Chicken',
  'Authentic Indian butter chicken: tender chicken in a creamy spiced tomato sauce. An Indian cuisine classic that''s easy to make at home.',
  '<p><strong>Butter Chicken</strong> (or Murgh Makhani) is one of the most popular Indian dishes in the world. This homemade recipe rivals the best Indian restaurants: yogurt-marinated chicken, roasted in the oven, then simmered in a creamy tomato sauce flavored with garam masala.</p><p>The secret? The yogurt marinade that tenderizes the chicken and the high-temperature roasting that gives it a slight caramelized crust.</p>',
  '<p>Serve this butter chicken with fragrant basmati rice and warm naan bread for an authentic Indian experience. Leftovers are even better the next day!</p>',
  '[{"title": "Chicken Marinade", "items": [{"name": "boneless chicken thighs", "quantity": "1", "unit": "kg"}, {"name": "plain yogurt", "quantity": "125", "unit": "ml"}, {"name": "minced garlic cloves", "quantity": "2", "unit": ""}, {"name": "minced fresh ginger", "quantity": "1", "unit": "tbsp"}, {"name": "garam masala", "quantity": "1", "unit": "tbsp"}, {"name": "salt", "quantity": "1/2", "unit": "tsp"}, {"name": "lime juice", "quantity": "1", "unit": "lime"}]}, {"title": "Sauce", "items": [{"name": "chopped onion", "quantity": "1", "unit": ""}, {"name": "seeded and chopped jalapeño", "quantity": "1", "unit": "small"}, {"name": "chopped garlic cloves", "quantity": "2", "unit": ""}, {"name": "chopped fresh ginger", "quantity": "1", "unit": "tbsp"}, {"name": "butter", "quantity": "40", "unit": "g"}, {"name": "garam masala", "quantity": "1", "unit": "tbsp"}, {"name": "tomato paste", "quantity": "1", "unit": "tbsp"}, {"name": "canned diced tomatoes", "quantity": "398", "unit": "ml"}, {"name": "chicken broth", "quantity": "125", "unit": "ml"}, {"name": "heavy cream (35%)", "quantity": "125", "unit": "ml"}, {"name": "chopped fresh cilantro", "quantity": "1/4", "unit": "cup"}]}]',
  '[{"step": 1, "title": "Marinate the chicken", "content": "Cut chicken into cubes. Mix all marinade ingredients in a bowl. Marinate at least 30 minutes (ideally 2 hours)."}, {"step": 2, "title": "Cook the chicken", "content": "Preheat oven to 260°C (500°F). Spread chicken on a baking sheet lined with buttered aluminum foil. Cook 15 minutes. Set aside."}, {"step": 3, "title": "Prepare the sauce base", "content": "In a large saucepan, sauté onion, jalapeño, garlic, and ginger in butter over medium heat until golden."}, {"step": 4, "title": "Add spices", "content": "Add garam masala and tomato paste. Cook 2 minutes, stirring."}, {"step": 5, "title": "Simmer the sauce", "content": "Add tomatoes and broth. Season and simmer 15 minutes."}, {"step": 6, "title": "Cream the sauce", "content": "Add cream. Blend sauce with an immersion blender until smooth."}, {"step": 7, "title": "Finish the dish", "content": "Add cooked chicken to sauce. Simmer a few minutes. Garnish with cilantro and serve with rice and naan."}]',
  '[{"question": "What is garam masala?", "answer": "It''s an Indian spice blend including cinnamon, cardamom, cloves, cumin, and coriander. Find it in the spice section of supermarkets."}, {"question": "Can I use chicken breasts?", "answer": "Yes, but thighs stay more tender and juicy. If using breasts, reduce cooking time."}, {"question": "How to make it less spicy?", "answer": "Omit the jalapeño or reduce the garam masala by half."}, {"question": "Can I prepare ahead?", "answer": "Yes! The sauce keeps 3 days in the fridge. Reheat and add freshly cooked chicken."}, {"question": "What is the origin of butter chicken?", "answer": "Butter Chicken was invented in the 1950s in Delhi, India, at Moti Mahal restaurant."}]'
);

-- 3. Maple Glazed Pork Tenderloin (ID 2141)
INSERT INTO recipe_translations (recipe_id, locale, title, excerpt, introduction, conclusion, ingredients, instructions, faq)
VALUES (
  2141, 'en',
  'Maple Glazed Pork Tenderloin',
  'Tender pork tenderloin with a sweet-savory maple syrup and Dijon mustard glaze. A Quebec classic ready in 35 minutes.',
  '<p>These <strong>maple glazed pork tenderloins</strong> perfectly embody Quebec cuisine: quality local pork coated with our precious maple syrup. The combination of sweet maple with tangy Dijon mustard creates an irresistible sauce.</p><p>This quick recipe (35 minutes!) is perfect for an elegant weeknight dinner. The pork stays pink and juicy thanks to oven-finishing after pan-searing.</p>',
  '<p>Serve these pork tenderloins with squash purée or maple mashed potatoes to stay on theme. It''s a perfect dish for fall evenings!</p>',
  '[{"title": "Ingredients", "items": [{"name": "pork tenderloins", "quantity": "2", "unit": "", "note": "about 450g each"}, {"name": "flour", "quantity": "1/4", "unit": "cup"}, {"name": "butter", "quantity": "1", "unit": "tbsp"}, {"name": "vegetable oil", "quantity": "1", "unit": "tbsp"}, {"name": "chopped French shallots", "quantity": "4", "unit": ""}, {"name": "maple syrup", "quantity": "125", "unit": "ml"}, {"name": "Dijon mustard", "quantity": "1", "unit": "tbsp"}, {"name": "salt and pepper", "quantity": "", "unit": "to taste"}]}]',
  '[{"step": 1, "title": "Preheat the oven", "content": "Place rack in center of oven. Preheat to 180°C (350°F)."}, {"step": 2, "title": "Flour the tenderloins", "content": "Place flour on a plate. Coat pork tenderloins in flour, shaking off excess."}, {"step": 3, "title": "Sear the pork", "content": "In an oven-safe skillet over medium-high heat, brown tenderloins in butter and oil, about 2 minutes per side. Season with salt and pepper. Transfer to a plate."}, {"step": 4, "title": "Prepare the glaze", "content": "In the same skillet, sauté shallots for 1 minute. Add maple syrup and mustard. Simmer 1 minute until slightly thickened."}, {"step": 5, "title": "Glaze and bake", "content": "Return tenderloins to skillet and coat with sauce. Bake 16-17 minutes for medium-rare."}, {"step": 6, "title": "Rest and serve", "content": "Remove from oven, cover with aluminum foil and rest 5 minutes. Slice and serve drizzled with sauce."}]',
  '[{"question": "How do I know when pork is done?", "answer": "Internal temperature should reach 63°C (145°F) for juicy medium-rare. Pork can remain slightly pink in the center."}, {"question": "Can I use another cut of pork?", "answer": "Pork chops work too, but adjust cooking time based on thickness."}, {"question": "How to prevent dry pork?", "answer": "Don''t overcook! Resting time is crucial for redistributing juices."}, {"question": "Can I prepare the sauce ahead?", "answer": "Yes, make the maple glaze and reheat when serving."}, {"question": "What maple syrup to use?", "answer": "Use pure maple syrup, Grade A amber or dark for more flavor."}]'
);

-- 4. French Onion Soup (ID 2142)
INSERT INTO recipe_translations (recipe_id, locale, title, excerpt, introduction, conclusion, ingredients, instructions, faq)
VALUES (
  2142, 'en',
  'French Onion Soup Gratinée',
  'The best French onion soup: caramelized onions, rich broth, croutons, and melted cheese. A comforting French classic.',
  '<p><strong>French onion soup gratinée</strong> is one of the most comforting dishes in French cuisine. The secret lies in slowly caramelizing the onions to develop deep, sweet flavors, then the golden gruyère gratin that crisps under the broiler.</p><p>This recipe takes time but most of it is passive. The onions simmer gently while you go about your business. The result: a soup worthy of the best Parisian bistros!</p>',
  '<p>Serve this soup as a generous appetizer or light main course with a green salad. Be careful with the hot bowls straight from the oven!</p>',
  '[{"title": "Soup", "items": [{"name": "yellow onions", "quantity": "6", "unit": "large"}, {"name": "butter", "quantity": "55", "unit": "g"}, {"name": "red wine", "quantity": "125", "unit": "ml"}, {"name": "cognac or brandy", "quantity": "30", "unit": "ml"}, {"name": "chicken broth", "quantity": "1", "unit": "liter"}, {"name": "beef broth", "quantity": "1", "unit": "liter"}, {"name": "toasted flour", "quantity": "1", "unit": "tbsp"}, {"name": "ground nutmeg", "quantity": "1", "unit": "pinch"}]}, {"title": "Topping", "items": [{"name": "baguette slices", "quantity": "12", "unit": "", "note": "1 cm thick, toasted"}, {"name": "garlic clove cut in half", "quantity": "1", "unit": ""}, {"name": "grated gruyère", "quantity": "200", "unit": "g"}]}]',
  '[{"step": 1, "title": "Prepare the onions", "content": "Cut onions into quarters, then slice each quarter into short strips."}, {"step": 2, "title": "Caramelize the onions", "content": "In a large pot over medium heat, cook onions in butter for 15 minutes, stirring occasionally. Increase heat and cook 15 more minutes until caramelized, stirring constantly and scraping the bottom."}, {"step": 3, "title": "Deglaze", "content": "Deglaze with wine and cognac. Reduce until almost dry."}, {"step": 4, "title": "Add broths", "content": "Add broths, flour, and nutmeg. Mix well."}, {"step": 5, "title": "Simmer", "content": "Bring to a boil then simmer 30 minutes until reduced by half (about 1.25 liters). Season with salt and pepper."}, {"step": 6, "title": "Prepare the croutons", "content": "Preheat broiler. Rub croutons with garlic. Place bowls on a baking sheet."}, {"step": 7, "title": "Broil", "content": "Divide soup among bowls. Add 30ml cheese, 3 croutons, then remaining cheese. Broil 5 minutes until cheese is golden and bubbling."}]',
  '[{"question": "Why caramelize onions so long?", "answer": "Slow caramelization develops the natural sugars in onions and creates a deep, complex flavor impossible to achieve otherwise."}, {"question": "What wine to use?", "answer": "A dry red wine like Côtes du Rhône or Pinot Noir. Avoid wines that are too tannic or sweet."}, {"question": "Can I prepare the soup ahead?", "answer": "Yes! The soup (without croutons or cheese) keeps 3 days in the fridge. Reheat and broil when serving."}, {"question": "What cheese to use?", "answer": "Gruyère is traditional, but emmental or comté also work very well."}, {"question": "How to prevent the cheese from burning?", "answer": "Watch closely under the broiler and keep bowls in the center of the oven, not too close to the element."}]'
);

-- 5. Carrot Cake (ID 2143)
INSERT INTO recipe_translations (recipe_id, locale, title, excerpt, introduction, conclusion, ingredients, instructions, faq)
VALUES (
  2143, 'en',
  'The Best Carrot Cake',
  'The best carrot cake: moist, spiced, filled with nuts, and topped with silky cream cheese frosting.',
  '<p>This <strong>carrot cake</strong> is simply the best you''ll ever taste! Ultra moist thanks to grated carrots and orange juice, flavored with cinnamon and nutmeg, filled with crunchy walnuts and raisins.</p><p>The secret? Whipping egg whites to stiff peaks and folding them in gently for an airy texture. The cream cheese frosting brings the perfect finishing touch with its sweet-tangy balance.</p>',
  '<p>This cake keeps 5 days in the refrigerator. Take it out 30 minutes before serving so the frosting is creamier.</p>',
  '[{"title": "Cake", "items": [{"name": "all-purpose flour", "quantity": "560", "unit": "ml"}, {"name": "baking powder", "quantity": "1 1/2", "unit": "tsp"}, {"name": "baking soda", "quantity": "1/2", "unit": "tsp"}, {"name": "ground cinnamon", "quantity": "1/2", "unit": "tsp"}, {"name": "ground nutmeg", "quantity": "1/2", "unit": "tsp"}, {"name": "salt", "quantity": "1/4", "unit": "tsp"}, {"name": "eggs, separated", "quantity": "4", "unit": ""}, {"name": "brown sugar", "quantity": "430", "unit": "ml"}, {"name": "canola oil", "quantity": "180", "unit": "ml"}, {"name": "orange juice", "quantity": "125", "unit": "ml"}, {"name": "peeled and grated carrots", "quantity": "1", "unit": "liter"}, {"name": "chopped walnuts", "quantity": "250", "unit": "ml"}, {"name": "raisins", "quantity": "125", "unit": "ml"}]}, {"title": "Frosting", "items": [{"name": "softened cream cheese", "quantity": "250", "unit": "g"}, {"name": "softened unsalted butter", "quantity": "30", "unit": "ml"}, {"name": "powdered sugar", "quantity": "750", "unit": "ml"}]}]',
  '[{"step": 1, "title": "Prepare the pans", "content": "Preheat oven to 180°C (350°F). Butter two 20 cm springform pans and line bottoms with parchment paper."}, {"step": 2, "title": "Mix dry ingredients", "content": "In a bowl, whisk together flour, baking powder, baking soda, spices, and salt."}, {"step": 3, "title": "Whip the whites", "content": "Beat egg whites until foamy. Gradually add 250 ml brown sugar while beating until stiff peaks form."}, {"step": 4, "title": "Prepare the base", "content": "In another bowl, mix egg yolks, oil, orange juice, and remaining brown sugar."}, {"step": 5, "title": "Assemble the batter", "content": "Fold dry ingredients into yolk mixture. Gently fold in whipped whites, then carrots, nuts, and raisins."}, {"step": 6, "title": "Bake", "content": "Divide between pans. Bake 1h10 or until a toothpick comes out clean. Cool completely."}, {"step": 7, "title": "Prepare the frosting", "content": "Beat cream cheese and butter. Gradually add powdered sugar until smooth and creamy."}, {"step": 8, "title": "Frost the cake", "content": "Unmold cakes. Spread frosting between layers and on top of cake."}]',
  '[{"question": "Why is my cake dense?", "answer": "Make sure to properly whip the egg whites and fold them in gently. Don''t over-mix!"}, {"question": "Can I freeze this cake?", "answer": "Yes, without frosting, it freezes for 3 months. Frost after thawing."}, {"question": "How to grate the carrots?", "answer": "Use the large holes of a box grater or the shredding disc of a food processor."}, {"question": "Can I omit the nuts?", "answer": "Yes, replace with unsweetened coconut flakes for similar texture."}, {"question": "Is the frosting mandatory?", "answer": "No, but it''s the perfect combination! You can also dust with powdered sugar."}]'
);

-- 6. Classic Beef Tartare (ID 2144)
INSERT INTO recipe_translations (recipe_id, locale, title, excerpt, introduction, conclusion, ingredients, instructions, faq)
VALUES (
  2144, 'en',
  'Classic Beef Tartare',
  'The best beef tartare: ultra-fresh beef tenderloin with perfect seasoning of sambal oelek and mustard. A bistro classic.',
  '<p><strong>Beef tartare</strong> is an iconic dish that showcases the quality of raw meat. This classic version combines ultra-fresh beef tenderloin with a zesty dressing of sambal oelek, two mustards, and capers for perfect balance.</p><p>The secret to great tartare? Top-quality meat, sharp knives, and keeping everything very cold during preparation.</p>',
  '<p>Serve the tartare immediately with toasted baguette croutons, homemade fries, and a green salad. Never prepare tartare in advance!</p>',
  '[{"title": "Ingredients", "items": [{"name": "lemon juice", "quantity": "30", "unit": "ml"}, {"name": "Dijon mustard", "quantity": "30", "unit": "ml"}, {"name": "whole grain mustard", "quantity": "15", "unit": "ml"}, {"name": "egg yolk", "quantity": "1", "unit": ""}, {"name": "drained and chopped capers", "quantity": "15", "unit": "ml"}, {"name": "sambal oelek", "quantity": "10", "unit": "ml"}, {"name": "olive oil", "quantity": "60", "unit": "ml"}, {"name": "very fresh beef tenderloin", "quantity": "675", "unit": "g"}, {"name": "chopped flat-leaf parsley", "quantity": "30", "unit": "ml"}, {"name": "chopped chives", "quantity": "45", "unit": "ml"}, {"name": "minced French shallots", "quantity": "45", "unit": "ml"}]}]',
  '[{"step": 1, "title": "Prepare the dressing", "content": "In a large bowl, mix lemon juice, both mustards, egg yolk, capers, and sambal oelek."}, {"step": 2, "title": "Emulsify", "content": "Add olive oil in a thin stream while whisking continuously until emulsified."}, {"step": 3, "title": "Chop the meat", "content": "Using a sharp knife, finely hand-chop the beef tenderloin (do not use a food processor)."}, {"step": 4, "title": "Assemble", "content": "Add meat, herbs, and shallots to the dressing. Season with salt and pepper, mix well."}, {"step": 5, "title": "Serve immediately", "content": "Serve right away with toasted baguette croutons, homemade fries, and a green salad."}]',
  '[{"question": "What cut of beef to use?", "answer": "Beef tenderloin (filet mignon) is ideal because it''s very tender and lean. Inside round also works."}, {"question": "How to keep the meat cold?", "answer": "Place a bowl over ice during preparation. Work quickly."}, {"question": "Is tartare safe?", "answer": "With very fresh quality meat and hygienic preparation, yes. Avoid if immunocompromised, pregnant, or very young/elderly."}, {"question": "What is sambal oelek?", "answer": "An Indonesian chili paste. Substitute with sriracha or chopped hot peppers."}, {"question": "Can I prepare ahead?", "answer": "No! Tartare must be prepared and served immediately for freshness and safety reasons."}]'
);

-- 7. Traditional Split Pea Soup (ID 2145)
INSERT INTO recipe_translations (recipe_id, locale, title, excerpt, introduction, conclusion, ingredients, instructions, faq)
VALUES (
  2145, 'en',
  'Traditional Split Pea Soup',
  'Authentic Quebec split pea soup: yellow peas, salt pork, and savory. A comforting classic from our culinary heritage.',
  '<p><strong>Split pea soup</strong> is a pillar of traditional Quebec cuisine. Inherited from the first French settlers, this nourishing soup has warmed generations of Quebecers during long winters.</p><p>This authentic recipe uses salt pork (or pork belly) and savory, the emblematic herb of our cuisine. The secret? A long simmer that melts the peas into a creamy purée.</p>',
  '<p>Serve this steaming soup with toasted and buttered homemade bread. Leftovers are even better reheated the next day!</p>',
  '[{"title": "Ingredients", "items": [{"name": "whole yellow peas", "quantity": "310", "unit": "g", "note": "rinsed"}, {"name": "salted pork belly", "quantity": "115", "unit": "g", "note": "cut in half"}, {"name": "chopped onions", "quantity": "375", "unit": "g"}, {"name": "butter", "quantity": "30", "unit": "ml"}, {"name": "diced carrots", "quantity": "145", "unit": "g"}, {"name": "diced celery", "quantity": "135", "unit": "g"}, {"name": "water", "quantity": "1.5", "unit": "liter"}, {"name": "bay leaves", "quantity": "3", "unit": ""}, {"name": "chopped savory", "quantity": "2", "unit": "tsp", "note": "or 1/2 tsp ground"}]}]',
  '[{"step": 1, "title": "Soak the peas", "content": "Soak peas for 4 hours or overnight, covered with water. Drain and discard soaking water."}, {"step": 2, "title": "Desalt the pork", "content": "Soak pork belly in cold water for 15 minutes to remove some salt. Drain."}, {"step": 3, "title": "Sauté the vegetables", "content": "In a large pot, brown onions in butter. Add carrots and celery, cook 5 minutes."}, {"step": 4, "title": "Simmer", "content": "Add water, peas, pork, and bay leaves. Bring to a boil then reduce heat. Cover and simmer 2.5 to 3 hours."}, {"step": 5, "title": "Prepare the pork", "content": "Remove pork from pot. Remove fat, dice the meat, and return to soup."}, {"step": 6, "title": "Season", "content": "Add savory. Adjust salt and pepper. Serve hot."}]',
  '[{"question": "Why soak the peas?", "answer": "Soaking softens the peas and reduces cooking time. It also helps make them more digestible."}, {"question": "Can I use split peas?", "answer": "Yes, but they''ll cook faster (about 1.5 hours). The texture will be smoother."}, {"question": "What is savory?", "answer": "An aromatic herb typical of Quebec, also called summer savory. It traditionally flavors legumes."}, {"question": "How to thicken the soup?", "answer": "At the end of cooking, mash some peas with the back of a spoon or partially blend with an immersion blender."}, {"question": "Can I freeze this soup?", "answer": "Yes! It freezes well for up to 3 months. Thaw in the fridge and reheat gently."}]'
);
