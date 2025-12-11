-- Table pour les messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche par email
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_messages(email);

-- Index pour les messages non lus
CREATE INDEX IF NOT EXISTS idx_contact_unread ON contact_messages(is_read) WHERE is_read = FALSE;

-- Index pour tri par date
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre l'insertion depuis l'API (anon)
CREATE POLICY "Allow anonymous insert" ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy pour permettre la lecture aux admins seulement
CREATE POLICY "Allow admin read" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy pour permettre la mise à jour aux admins (marquer comme lu)
CREATE POLICY "Allow admin update" ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);
