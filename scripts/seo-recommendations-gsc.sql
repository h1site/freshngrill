-- ============================================================
-- RECOMMANDATIONS SEO BASÉES SUR GOOGLE SEARCH CONSOLE
-- Priorités classées par potentiel de trafic
-- ============================================================

-- ============================================================
-- PRIORITÉ 1: Pain Gumbo (position 1, fort volume, CTR faible)
-- Requêtes: "petit pain gumbo" (147 imp), "pain gumbo" (308 imp)
-- Position: 1.04-1.77 mais CTR de seulement 0.65-2.72%
-- ============================================================
UPDATE recipes SET
  seo_title = 'Petit Pain Gumbo ⭐ Recette Authentique Facile',
  seo_description = 'Recette petit pain gumbo facile: pains fourrés sauce chili et fromage. La vraie recette québécoise! Prêts en 30 minutes.'
WHERE slug = 'pain-gumbo' OR slug = 'petit-pain-gumbo';


-- ============================================================
-- PRIORITÉ 2: Soupe Won Ton (position 3, bon volume)
-- Requêtes: "soupe won ton" (180 imp), "soupe won ton recette"
-- Position: 3.07 - potentiel de monter en position 1
-- ============================================================
UPDATE recipes SET
  seo_title = 'Soupe Won Ton Maison ⭐ Bouillon Authentique',
  seo_description = 'Soupe won ton traditionnelle: bouillon savoureux + dumplings maison. Recette facile étape par étape. Meilleure que le restaurant!'
WHERE slug LIKE '%won-ton%' OR slug LIKE '%wonton%';


-- ============================================================
-- PRIORITÉ 3: Poulet Mijoteuse (fort volume, bonnes positions)
-- Requêtes multiples avec "poitrine poulet mijoteuse"
-- CTR variable de 2-30% selon la requête
-- ============================================================
UPDATE recipes SET
  seo_title = 'Poitrine de Poulet Mijoteuse Crème Champignon ⭐',
  seo_description = 'Poitrine de poulet mijoteuse ultra tendre! Sauce crémeuse aux champignons Campbell. Recette facile, 5 min de préparation.'
WHERE slug LIKE '%poulet%mijoteuse%' OR slug LIKE '%poitrine-poulet%';


-- ============================================================
-- PRIORITÉ 4: Mozza Burger (volume moyen, position 6-10)
-- Requêtes: "mozza burger" (303 imp), "sauce mozza burger"
-- Améliorer pour cibler la sauce A&W
-- ============================================================
UPDATE recipes SET
  seo_title = 'Sauce Mozza Burger Style A&W ⭐ Recette Secrète',
  seo_description = 'La vraie recette sauce mozza burger style A&W! Recréez le goût du restaurant à la maison. Simple et délicieux.'
WHERE slug LIKE '%mozza%' OR slug LIKE '%mozza-burger%';


-- ============================================================
-- PRIORITÉ 5: Orange Julep (volume faible mais niche)
-- Requêtes: "orange julep recette" (75 imp)
-- Position: 4.03 - bonne opportunité
-- ============================================================
UPDATE recipes SET
  seo_title = 'Orange Julep Maison ⭐ Recette Gibeau Originale',
  seo_description = 'Recette orange julep maison comme chez Gibeau! Boisson mousseuse orange emblématique de Montréal. Facile et rafraîchissante.'
WHERE slug LIKE '%orange-julep%';


-- ============================================================
-- PRIORITÉ 6: Cube de Boeuf (volume moyen)
-- Requêtes: "recette cube de boeuf" (92 imp)
-- ============================================================
UPDATE recipes SET
  seo_title = 'Cube de Boeuf Mijoteuse ⭐ Tendre et Savoureux',
  seo_description = 'Recette cube de boeuf mijoteuse ultra tendre! Viande fondante en sauce. Le secret pour des cubes de boeuf parfaits.'
WHERE slug LIKE '%cube%boeuf%';


-- ============================================================
-- PRIORITÉ 7: Gâteau Blanc (recherches nostalgiques)
-- Requêtes: "recette de gâteau blanc de grand-mère" (50 imp)
-- ============================================================
UPDATE recipes SET
  seo_title = 'Gâteau Blanc de Grand-Mère ⭐ Recette Traditionnelle',
  seo_description = 'Recette gâteau blanc moelleux de grand-mère! Gâteau à l''ancienne extra léger. La vraie recette traditionnelle québécoise.'
WHERE slug LIKE '%gateau-blanc%';


-- ============================================================
-- INSIGHTS ADDITIONNELS DU CSV:
--
-- 1. CRÉER une page "Conversion CM en Pied et Pouce"
--    → 148 impressions pour "conversion cm en pouce et pied"
--    → 72 impressions pour "180 cm en pied et pouce"
--
-- 2. CRÉER une page "Recette Frappuccino Maison"
--    → 90 impressions, position 92 (pas indexé correctement)
--    → "caramel frappuccino" 119 impressions
--
-- 3. AMÉLIORER page "Bortsch"
--    → Position 41 pour "bortsch" principal
--    → Mais position 5-8 pour variantes spécifiques
--
-- 4. AMÉLIORER page "Queue de Castor"
--    → 43 impressions, position 10
--    → Potentiel avec meilleur titre
-- ============================================================
