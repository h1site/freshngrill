-- Tables pour les Posts/Articles de Blog
-- Exécuter ce script dans le SQL Editor de Supabase

-- Fonction pour updated_at (si pas déjà créée)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table des auteurs
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories de posts
CREATE TABLE IF NOT EXISTS post_categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES post_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des posts
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

-- Table de liaison posts-catégories
CREATE TABLE IF NOT EXISTS posts_categories (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES post_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_slug ON post_categories(slug);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
DROP POLICY IF EXISTS "Posts publiés lisibles par tous" ON posts;
CREATE POLICY "Posts publiés lisibles par tous" ON posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Catégories de posts lisibles par tous" ON post_categories;
CREATE POLICY "Catégories de posts lisibles par tous" ON post_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Posts categories lisibles par tous" ON posts_categories;
CREATE POLICY "Posts categories lisibles par tous" ON posts_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auteurs lisibles par tous" ON authors;
CREATE POLICY "Auteurs lisibles par tous" ON authors
  FOR SELECT USING (true);

-- Vue pour les posts avec auteur et catégories
CREATE OR REPLACE VIEW posts_with_details AS
SELECT
  p.*,
  CASE
    WHEN a.id IS NOT NULL THEN
      json_build_object(
        'id', a.id,
        'name', a.name,
        'slug', a.slug,
        'avatar', a.avatar,
        'bio', a.bio
      )
    ELSE
      json_build_object(
        'id', 0,
        'name', 'Menu Cochon',
        'slug', 'menu-cochon',
        'avatar', NULL,
        'bio', NULL
      )
  END as author,
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
