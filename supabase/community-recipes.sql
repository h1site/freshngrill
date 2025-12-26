-- Migration pour ajouter le support des recettes de la communauté
-- Exécuter ce script dans le SQL Editor de Supabase

-- Ajouter les colonnes pour les recettes de la communauté
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_community_recipe BOOLEAN DEFAULT FALSE;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS community_author_name VARCHAR(255);
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS community_author_email VARCHAR(255);
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS community_author_image VARCHAR(500);
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS submission_id INTEGER REFERENCES recipe_submissions(id);

-- Index pour filtrer les recettes de la communauté
CREATE INDEX IF NOT EXISTS idx_recipes_community ON recipes(is_community_recipe) WHERE is_community_recipe = TRUE;

-- Ajouter slug anglais à recipe_translations pour les URLs anglaises
ALTER TABLE recipe_translations ADD COLUMN IF NOT EXISTS slug_en VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_recipe_translations_slug_en ON recipe_translations(slug_en);

-- Ajouter contenu (tips) à recipe_translations
ALTER TABLE recipe_translations ADD COLUMN IF NOT EXISTS content TEXT;

-- Commentaires
COMMENT ON COLUMN recipes.is_community_recipe IS 'Indique si la recette provient de la communauté';
COMMENT ON COLUMN recipes.community_author_name IS 'Nom de l''auteur de la communauté';
COMMENT ON COLUMN recipes.community_author_email IS 'Email de l''auteur (privé)';
COMMENT ON COLUMN recipes.community_author_image IS 'Photo de profil de l''auteur';
COMMENT ON COLUMN recipes.submission_id IS 'Référence à la soumission originale';
