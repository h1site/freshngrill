-- ============================================
-- Fresh N' Grill — Database Setup
-- English-only BBQ recipe site
-- Run against Supabase PostgreSQL
-- ============================================

-- ============================================
-- 0. CLEAN UP EXISTING TABLES FROM PREVIOUS PROJECT
-- ============================================

DROP VIEW IF EXISTS recipes_with_categories CASCADE;
DROP VIEW IF EXISTS posts_with_details CASCADE;

DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS comparisons CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

DROP TYPE IF EXISTS difficulty_level CASCADE;

-- ============================================
-- 1. ENUMS
-- ============================================

CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- ============================================
-- 2. RECIPE TABLES
-- ============================================

-- Recipe categories (hierarchical)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT,
  introduction TEXT,
  conclusion TEXT,
  featured_image TEXT,
  pinterest_image TEXT,
  pinterest_title TEXT,
  pinterest_description TEXT,
  images TEXT[],
  video_url TEXT,
  faq TEXT,
  prep_time INTEGER NOT NULL DEFAULT 0,
  cook_time INTEGER NOT NULL DEFAULT 0,
  rest_time INTEGER,
  total_time INTEGER NOT NULL DEFAULT 0,
  servings INTEGER NOT NULL DEFAULT 4,
  servings_unit VARCHAR(100),
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  nutrition JSONB,
  tags TEXT[],
  cuisine VARCHAR(100),
  author VARCHAR(255) NOT NULL DEFAULT 'Fresh N'' Grill',
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER NOT NULL DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe-categories junction
CREATE TABLE IF NOT EXISTS recipe_categories (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, category_id)
);

-- Ingredient taxonomy
CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Origin/country taxonomy
CREATE TABLE IF NOT EXISTS origines (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cuisine type taxonomy
CREATE TABLE IF NOT EXISTS cuisine_types (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Taxonomy junction tables
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

-- ============================================
-- 3. BLOG TABLES
-- ============================================

-- Authors
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog post categories (hierarchical)
CREATE TABLE IF NOT EXISTS post_categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES post_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
  tags TEXT[],
  reading_time INTEGER DEFAULT 5,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'published',
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts-categories junction
CREATE TABLE IF NOT EXISTS posts_categories (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES post_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- ============================================
-- 4. INDEXES
-- ============================================

-- Recipe indexes
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_published_at ON recipes(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_likes ON recipes(likes DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_recipe_categories_recipe ON recipe_categories(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_categories_category ON recipe_categories(category_id);

-- Full-text search (English)
CREATE INDEX IF NOT EXISTS idx_recipes_title_gin ON recipes USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_recipes_tags_gin ON recipes USING GIN (tags);

-- Taxonomy indexes
CREATE INDEX IF NOT EXISTS idx_ingredients_slug ON ingredients(slug);
CREATE INDEX IF NOT EXISTS idx_origines_slug ON origines(slug);
CREATE INDEX IF NOT EXISTS idx_cuisine_types_slug ON cuisine_types(slug);

-- Blog indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_slug ON post_categories(slug);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);
CREATE INDEX IF NOT EXISTS idx_posts_title_gin ON posts USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_posts_content_gin ON posts USING GIN (to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_posts_tags_gin ON posts USING GIN (tags);

-- ============================================
-- 5. TRIGGERS
-- ============================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE origines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuisine_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_origines ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_cuisine_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Public read policies — Recipes
CREATE POLICY "Recipes readable by all" ON recipes
  FOR SELECT USING (true);

CREATE POLICY "Categories readable by all" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Recipe categories readable by all" ON recipe_categories
  FOR SELECT USING (true);

CREATE POLICY "Ingredients readable by all" ON ingredients
  FOR SELECT USING (true);

CREATE POLICY "Origines readable by all" ON origines
  FOR SELECT USING (true);

CREATE POLICY "Cuisine types readable by all" ON cuisine_types
  FOR SELECT USING (true);

CREATE POLICY "Recipe ingredients readable by all" ON recipe_ingredients
  FOR SELECT USING (true);

CREATE POLICY "Recipe origines readable by all" ON recipe_origines
  FOR SELECT USING (true);

CREATE POLICY "Recipe cuisine types readable by all" ON recipe_cuisine_types
  FOR SELECT USING (true);

-- Public read policies — Blog
CREATE POLICY "Published posts readable by all" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Post categories readable by all" ON post_categories
  FOR SELECT USING (true);

CREATE POLICY "Posts categories readable by all" ON posts_categories
  FOR SELECT USING (true);

CREATE POLICY "Authors readable by all" ON authors
  FOR SELECT USING (true);

-- ============================================
-- 7. VIEWS
-- ============================================

-- Recipes with all taxonomies aggregated as JSON
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

-- Posts with author and categories aggregated as JSON
CREATE OR REPLACE VIEW posts_with_details AS
SELECT
  p.*,
  json_build_object(
    'id', a.id,
    'name', a.name,
    'slug', a.slug,
    'avatar', a.avatar,
    'bio', a.bio
  ) as author,
  COALESCE(
    json_agg(
      json_build_object(
        'id', pc.id,
        'slug', pc.slug,
        'name', pc.name,
        'parent', pc.parent_id
      )
    ) FILTER (WHERE pc.id IS NOT NULL),
    '[]'
  ) as categories
FROM posts p
LEFT JOIN authors a ON p.author_id = a.id
LEFT JOIN posts_categories pcat ON p.id = pcat.post_id
LEFT JOIN post_categories pc ON pcat.category_id = pc.id
WHERE p.status = 'published'
GROUP BY p.id, a.id;

-- ============================================
-- 8. STORAGE BUCKETS
-- ============================================

-- Recipe images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Post images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies — Recipe images
CREATE POLICY "Recipe images public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Recipe images upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Recipe images update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'recipe-images');

CREATE POLICY "Recipe images delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'recipe-images');

-- Storage policies — Post images
CREATE POLICY "Post images public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Post images upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Post images update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'post-images');

CREATE POLICY "Post images delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'post-images');
