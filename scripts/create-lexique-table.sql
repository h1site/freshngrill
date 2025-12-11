-- Créer la table lexique
CREATE TABLE IF NOT EXISTS lexique (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  term VARCHAR(255) NOT NULL,
  definition TEXT NOT NULL,
  letter CHAR(1) NOT NULL,
  related_terms TEXT[], -- Termes liés (optionnel)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la recherche rapide
CREATE INDEX IF NOT EXISTS idx_lexique_letter ON lexique(letter);
CREATE INDEX IF NOT EXISTS idx_lexique_term ON lexique(term);
CREATE INDEX IF NOT EXISTS idx_lexique_slug ON lexique(slug);

-- Index full-text pour la recherche
CREATE INDEX IF NOT EXISTS idx_lexique_search ON lexique USING gin(to_tsvector('french', term || ' ' || definition));

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_lexique_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lexique_updated_at ON lexique;
CREATE TRIGGER lexique_updated_at
  BEFORE UPDATE ON lexique
  FOR EACH ROW
  EXECUTE FUNCTION update_lexique_updated_at();

-- Activer RLS
ALTER TABLE lexique ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Lexique is viewable by everyone" ON lexique
  FOR SELECT USING (true);
