-- Ajouter les colonnes pour les traductions anglaises du lexique
ALTER TABLE lexique ADD COLUMN IF NOT EXISTS term_en VARCHAR(255);
ALTER TABLE lexique ADD COLUMN IF NOT EXISTS definition_en TEXT;

-- Créer un index pour la recherche en anglais
CREATE INDEX IF NOT EXISTS idx_lexique_search_en ON lexique USING gin(to_tsvector('english', COALESCE(term_en, '') || ' ' || COALESCE(definition_en, '')));
