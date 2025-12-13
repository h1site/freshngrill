-- Création de la table lexique_en pour les termes culinaires anglais
-- Source: Land O'Lakes Kitchen Glossary

CREATE TABLE IF NOT EXISTS lexique_en (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  term VARCHAR(255) NOT NULL,
  definition TEXT NOT NULL,
  letter CHAR(1) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la recherche par lettre
CREATE INDEX IF NOT EXISTS idx_lexique_en_letter ON lexique_en(letter);

-- Index pour la recherche par slug
CREATE INDEX IF NOT EXISTS idx_lexique_en_slug ON lexique_en(slug);

-- Index pour la recherche full-text en anglais
CREATE INDEX IF NOT EXISTS idx_lexique_en_search ON lexique_en USING gin(to_tsvector('english', term || ' ' || definition));

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_lexique_en_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_lexique_en_updated_at ON lexique_en;
CREATE TRIGGER trigger_lexique_en_updated_at
  BEFORE UPDATE ON lexique_en
  FOR EACH ROW
  EXECUTE FUNCTION update_lexique_en_updated_at();
