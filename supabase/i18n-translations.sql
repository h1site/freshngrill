-- Schema pour les traductions i18n
-- Exécuter ce script dans le SQL Editor de Supabase

-- ============================================
-- Tables de traduction pour l'internationalisation
-- ============================================

-- Table traductions recettes
CREATE TABLE IF NOT EXISTS recipe_translations (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  excerpt TEXT,
  introduction TEXT,
  conclusion TEXT,
  ingredients JSONB,
  instructions JSONB,
  seo_title TEXT,
  seo_description TEXT,
  translated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_id, locale)
);

-- Table traductions articles blog
CREATE TABLE IF NOT EXISTS post_translations (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  translated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, locale)
);

-- Table traductions catégories de recettes
CREATE TABLE IF NOT EXISTS category_translations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, locale)
);

-- Table traductions catégories de posts
CREATE TABLE IF NOT EXISTS post_category_translations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES post_categories(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, locale)
);

-- Table traductions lexique
CREATE TABLE IF NOT EXISTS lexique_translations (
  id SERIAL PRIMARY KEY,
  lexique_id INTEGER NOT NULL REFERENCES lexique(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL DEFAULT 'en',
  term TEXT NOT NULL,
  definition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lexique_id, locale)
);

-- ============================================
-- Index pour performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_recipe_translations_locale ON recipe_translations(locale);
CREATE INDEX IF NOT EXISTS idx_recipe_translations_recipe ON recipe_translations(recipe_id);
CREATE INDEX IF NOT EXISTS idx_post_translations_locale ON post_translations(locale);
CREATE INDEX IF NOT EXISTS idx_post_translations_post ON post_translations(post_id);
CREATE INDEX IF NOT EXISTS idx_category_translations_locale ON category_translations(locale);
CREATE INDEX IF NOT EXISTS idx_category_translations_category ON category_translations(category_id);
CREATE INDEX IF NOT EXISTS idx_post_category_translations_locale ON post_category_translations(locale);
CREATE INDEX IF NOT EXISTS idx_lexique_translations_locale ON lexique_translations(locale);
CREATE INDEX IF NOT EXISTS idx_lexique_translations_lexique ON lexique_translations(lexique_id);

-- Index GIN pour recherche full-text sur les traductions
CREATE INDEX IF NOT EXISTS idx_recipe_translations_title_gin ON recipe_translations USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_post_translations_title_gin ON post_translations USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_post_translations_content_gin ON post_translations USING GIN (to_tsvector('english', content));

-- ============================================
-- RLS (Row Level Security) Policies
-- ============================================

ALTER TABLE recipe_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lexique_translations ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
CREATE POLICY "Recipe translations lisibles par tous" ON recipe_translations
  FOR SELECT USING (true);

CREATE POLICY "Post translations lisibles par tous" ON post_translations
  FOR SELECT USING (true);

CREATE POLICY "Category translations lisibles par tous" ON category_translations
  FOR SELECT USING (true);

CREATE POLICY "Post category translations lisibles par tous" ON post_category_translations
  FOR SELECT USING (true);

CREATE POLICY "Lexique translations lisibles par tous" ON lexique_translations
  FOR SELECT USING (true);

-- ============================================
-- Fonction pour updated_at (doit être créée AVANT les triggers)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column_translated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.translated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Triggers pour updated_at
-- ============================================

DROP TRIGGER IF EXISTS update_recipe_translations_translated_at ON recipe_translations;
CREATE TRIGGER update_recipe_translations_translated_at
  BEFORE UPDATE ON recipe_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column_translated();

DROP TRIGGER IF EXISTS update_post_translations_translated_at ON post_translations;
CREATE TRIGGER update_post_translations_translated_at
  BEFORE UPDATE ON post_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column_translated();

-- ============================================
-- Vues pour faciliter les requêtes avec traductions
-- ============================================

-- Vue: recettes avec traductions anglaises
CREATE OR REPLACE VIEW recipes_en AS
SELECT
  r.id,
  r.slug,
  COALESCE(rt.title, r.title) as title,
  COALESCE(rt.excerpt, r.excerpt) as excerpt,
  r.content as content_fr,
  COALESCE(rt.introduction, '') as introduction,
  COALESCE(rt.conclusion, '') as conclusion,
  r.featured_image,
  r.images,
  r.prep_time,
  r.cook_time,
  r.rest_time,
  r.total_time,
  r.servings,
  r.servings_unit,
  r.difficulty,
  COALESCE(rt.ingredients, r.ingredients) as ingredients,
  COALESCE(rt.instructions, r.instructions) as instructions,
  r.nutrition,
  r.tags,
  r.cuisine,
  r.author,
  r.published_at,
  r.updated_at,
  r.likes,
  COALESCE(rt.seo_title, r.seo_title) as seo_title,
  COALESCE(rt.seo_description, r.seo_description) as seo_description,
  r.created_at,
  rt.translated_at,
  CASE WHEN rt.id IS NOT NULL THEN true ELSE false END as has_translation
FROM recipes r
LEFT JOIN recipe_translations rt ON r.id = rt.recipe_id AND rt.locale = 'en';

-- Vue: posts avec traductions anglaises
CREATE OR REPLACE VIEW posts_en AS
SELECT
  p.id,
  p.slug,
  COALESCE(pt.title, p.title) as title,
  COALESCE(pt.excerpt, p.excerpt) as excerpt,
  COALESCE(pt.content, p.content) as content,
  p.featured_image,
  p.author_id,
  p.tags,
  p.reading_time,
  p.published_at,
  p.updated_at,
  p.status,
  COALESCE(pt.seo_title, p.seo_title) as seo_title,
  COALESCE(pt.seo_description, p.seo_description) as seo_description,
  p.created_at,
  pt.translated_at,
  CASE WHEN pt.id IS NOT NULL THEN true ELSE false END as has_translation
FROM posts p
LEFT JOIN post_translations pt ON p.id = pt.post_id AND pt.locale = 'en'
WHERE p.status = 'published';

-- ============================================
-- Fonctions utilitaires
-- ============================================

-- Fonction pour obtenir une recette avec la bonne locale
CREATE OR REPLACE FUNCTION get_recipe_by_locale(p_slug TEXT, p_locale VARCHAR(5) DEFAULT 'fr')
RETURNS TABLE (
  id INTEGER,
  slug VARCHAR,
  title TEXT,
  excerpt TEXT,
  featured_image TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  total_time INTEGER,
  servings INTEGER,
  difficulty difficulty_level,
  ingredients JSONB,
  instructions JSONB,
  seo_title TEXT,
  seo_description TEXT,
  has_translation BOOLEAN
) AS $$
BEGIN
  IF p_locale = 'en' THEN
    RETURN QUERY
    SELECT
      r.id,
      r.slug,
      COALESCE(rt.title, r.title)::TEXT,
      COALESCE(rt.excerpt, r.excerpt)::TEXT,
      r.featured_image,
      r.prep_time,
      r.cook_time,
      r.total_time,
      r.servings,
      r.difficulty,
      COALESCE(rt.ingredients, r.ingredients),
      COALESCE(rt.instructions, r.instructions),
      COALESCE(rt.seo_title, r.seo_title)::TEXT,
      COALESCE(rt.seo_description, r.seo_description)::TEXT,
      (rt.id IS NOT NULL)
    FROM recipes r
    LEFT JOIN recipe_translations rt ON r.id = rt.recipe_id AND rt.locale = 'en'
    WHERE r.slug = p_slug;
  ELSE
    RETURN QUERY
    SELECT
      r.id,
      r.slug,
      r.title::TEXT,
      r.excerpt::TEXT,
      r.featured_image,
      r.prep_time,
      r.cook_time,
      r.total_time,
      r.servings,
      r.difficulty,
      r.ingredients,
      r.instructions,
      r.seo_title::TEXT,
      r.seo_description::TEXT,
      true
    FROM recipes r
    WHERE r.slug = p_slug;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les catégories traduites
CREATE OR REPLACE FUNCTION get_categories_by_locale(p_locale VARCHAR(5) DEFAULT 'fr')
RETURNS TABLE (
  id INTEGER,
  slug VARCHAR,
  name TEXT,
  parent_id INTEGER
) AS $$
BEGIN
  IF p_locale = 'en' THEN
    RETURN QUERY
    SELECT
      c.id,
      c.slug,
      COALESCE(ct.name, c.name)::TEXT,
      c.parent_id
    FROM categories c
    LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = 'en'
    ORDER BY c.name;
  ELSE
    RETURN QUERY
    SELECT
      c.id,
      c.slug,
      c.name::TEXT,
      c.parent_id
    FROM categories c
    ORDER BY c.name;
  END IF;
END;
$$ LANGUAGE plpgsql;
