-- Table pour les abonnés newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  locale VARCHAR(5) DEFAULT 'fr',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  source VARCHAR(50) DEFAULT 'website',
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Index pour recherche par email
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Index pour les abonnés actifs
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active) WHERE is_active = TRUE;

-- Fonction pour vérifier si un email existe déjà
CREATE OR REPLACE FUNCTION check_newsletter_subscriber(p_email VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = LOWER(p_email));
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre l'insertion depuis l'API (anon)
CREATE POLICY "Allow anonymous insert" ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy pour permettre la lecture aux admins seulement
CREATE POLICY "Allow admin read" ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);
