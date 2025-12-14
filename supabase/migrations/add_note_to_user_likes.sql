-- Ajouter la colonne note à la table user_likes pour les commentaires personnels
-- Exécuter cette migration dans Supabase SQL Editor

ALTER TABLE user_likes
ADD COLUMN IF NOT EXISTS note TEXT;

-- Commentaire optionnel pour documenter le champ
COMMENT ON COLUMN user_likes.note IS 'Note personnelle de l''utilisateur sur cette recette favorite';
