-- Schema pour Menu Cochon
-- Exécuter ce script dans le SQL Editor de Supabase

-- Enum pour la difficulté
CREATE TYPE difficulty_level AS ENUM ('facile', 'moyen', 'difficile');

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des recettes
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  images TEXT[],
  prep_time INTEGER NOT NULL DEFAULT 0,
  cook_time INTEGER NOT NULL DEFAULT 0,
  rest_time INTEGER,
  total_time INTEGER NOT NULL DEFAULT 0,
  servings INTEGER NOT NULL DEFAULT 4,
  servings_unit VARCHAR(100),
  difficulty difficulty_level NOT NULL DEFAULT 'moyen',
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  nutrition JSONB,
  tags TEXT[],
  cuisine VARCHAR(100),
  author VARCHAR(255) NOT NULL DEFAULT 'Menu Cochon',
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER NOT NULL DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison recettes-catégories
CREATE TABLE IF NOT EXISTS recipe_categories (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, category_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_published_at ON recipes(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_likes ON recipes(likes DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_recipe_categories_recipe ON recipe_categories(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_categories_category ON recipe_categories(category_id);

-- Index GIN pour la recherche full-text
CREATE INDEX IF NOT EXISTS idx_recipes_title_gin ON recipes USING GIN (to_tsvector('french', title));
CREATE INDEX IF NOT EXISTS idx_recipes_tags_gin ON recipes USING GIN (tags);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_categories ENABLE ROW LEVEL SECURITY;

-- Politique: lecture publique pour toutes les recettes
CREATE POLICY "Recettes lisibles par tous" ON recipes
  FOR SELECT USING (true);

-- Politique: lecture publique pour toutes les catégories
CREATE POLICY "Catégories lisibles par tous" ON categories
  FOR SELECT USING (true);

-- Politique: lecture publique pour recipe_categories
CREATE POLICY "Recipe categories lisibles par tous" ON recipe_categories
  FOR SELECT USING (true);

-- Vue pour les recettes avec catégories
CREATE OR REPLACE VIEW recipes_with_categories AS
SELECT
  r.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', c.id,
        'slug', c.slug,
        'name', c.name,
        'parent', c.parent_id
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'
  ) as categories
FROM recipes r
LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
LEFT JOIN categories c ON rc.category_id = c.id
GROUP BY r.id;
