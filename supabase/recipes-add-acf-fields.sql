-- Ajout des champs ACF manquants pour les recettes
-- Exécuter ce script dans le SQL Editor de Supabase

-- IMPORTANT: Supprimer la vue existante d'abord
DROP VIEW IF EXISTS recipes_with_categories;

-- Ajouter les colonnes manquantes à la table recipes
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS introduction TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS conclusion TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS faq TEXT;

-- Table pour les ingrédients (taxonomy)
CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les origines (taxonomy)
CREATE TABLE IF NOT EXISTS origines (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les types de cuisine (taxonomy) - si pas déjà gérée par le champ cuisine
CREATE TABLE IF NOT EXISTS cuisine_types (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tables de liaison pour les taxonomies
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS recipe_origines (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  origine_id INTEGER REFERENCES origines(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, origine_id)
);

CREATE TABLE IF NOT EXISTS recipe_cuisine_types (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  cuisine_type_id INTEGER REFERENCES cuisine_types(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, cuisine_type_id)
);

-- Index pour les nouvelles tables
CREATE INDEX IF NOT EXISTS idx_ingredients_slug ON ingredients(slug);
CREATE INDEX IF NOT EXISTS idx_origines_slug ON origines(slug);
CREATE INDEX IF NOT EXISTS idx_cuisine_types_slug ON cuisine_types(slug);

-- RLS pour les nouvelles tables
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE origines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuisine_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_origines ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_cuisine_types ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
DROP POLICY IF EXISTS "Ingredients lisibles par tous" ON ingredients;
CREATE POLICY "Ingredients lisibles par tous" ON ingredients
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Origines lisibles par tous" ON origines;
CREATE POLICY "Origines lisibles par tous" ON origines
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cuisine types lisibles par tous" ON cuisine_types;
CREATE POLICY "Cuisine types lisibles par tous" ON cuisine_types
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Recipe ingredients lisibles par tous" ON recipe_ingredients;
CREATE POLICY "Recipe ingredients lisibles par tous" ON recipe_ingredients
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Recipe origines lisibles par tous" ON recipe_origines;
CREATE POLICY "Recipe origines lisibles par tous" ON recipe_origines
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Recipe cuisine types lisibles par tous" ON recipe_cuisine_types;
CREATE POLICY "Recipe cuisine types lisibles par tous" ON recipe_cuisine_types
  FOR SELECT USING (true);

-- Mettre à jour la vue recipes_with_categories pour inclure les nouveaux champs
CREATE OR REPLACE VIEW recipes_with_categories AS
SELECT
  r.*,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', c.id,
        'slug', c.slug,
        'name', c.name,
        'parent', c.parent_id
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'
  ) as categories,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', ing.id,
        'slug', ing.slug,
        'name', ing.name
      )
    ) FILTER (WHERE ing.id IS NOT NULL),
    '[]'
  ) as ingredient_tags,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', orig.id,
        'slug', orig.slug,
        'name', orig.name
      )
    ) FILTER (WHERE orig.id IS NOT NULL),
    '[]'
  ) as origine_tags,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', ct.id,
        'slug', ct.slug,
        'name', ct.name
      )
    ) FILTER (WHERE ct.id IS NOT NULL),
    '[]'
  ) as cuisine_type_tags
FROM recipes r
LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
LEFT JOIN categories c ON rc.category_id = c.id
LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
LEFT JOIN ingredients ing ON ri.ingredient_id = ing.id
LEFT JOIN recipe_origines ro ON r.id = ro.recipe_id
LEFT JOIN origines orig ON ro.origine_id = orig.id
LEFT JOIN recipe_cuisine_types rct ON r.id = rct.recipe_id
LEFT JOIN cuisine_types ct ON rct.cuisine_type_id = ct.id
GROUP BY r.id;
