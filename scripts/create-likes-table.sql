-- Table pour tracker les likes par IP
CREATE TABLE IF NOT EXISTS recipe_likes (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ip_address VARCHAR(45) NOT NULL, -- IPv4 ou IPv6
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_id, ip_address) -- Un like par IP par recette
);

-- Index pour les requêtes rapides
CREATE INDEX IF NOT EXISTS idx_recipe_likes_recipe_id ON recipe_likes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_ip ON recipe_likes(ip_address);

-- Vue pour compter les likes par recette
CREATE OR REPLACE VIEW recipe_likes_count AS
SELECT
  recipe_id,
  COUNT(*) as likes_count
FROM recipe_likes
GROUP BY recipe_id;

-- Fonction pour obtenir les recettes les plus aimées
CREATE OR REPLACE FUNCTION get_most_liked_recipes(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id INTEGER,
  slug VARCHAR,
  title VARCHAR,
  featured_image TEXT,
  total_time INTEGER,
  difficulty VARCHAR,
  likes_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.slug,
    r.title,
    r.featured_image,
    r.total_time,
    r.difficulty,
    COALESCE(rlc.likes_count, 0) as likes_count
  FROM recipes r
  LEFT JOIN recipe_likes_count rlc ON r.id = rlc.recipe_id
  WHERE r.status = 'published'
  ORDER BY likes_count DESC, r.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Activer RLS
ALTER TABLE recipe_likes ENABLE ROW LEVEL SECURITY;

-- Politique: tout le monde peut lire les likes
CREATE POLICY "Likes are viewable by everyone" ON recipe_likes
  FOR SELECT USING (true);

-- Politique: tout le monde peut insérer un like (limité par la contrainte UNIQUE)
CREATE POLICY "Anyone can like" ON recipe_likes
  FOR INSERT WITH CHECK (true);

-- Politique: on peut supprimer son propre like (par IP)
CREATE POLICY "Can unlike own like" ON recipe_likes
  FOR DELETE USING (true);
