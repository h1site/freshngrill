-- Table pour les soumissions de recettes par les utilisateurs
-- Recipe submissions from users

CREATE TABLE IF NOT EXISTS recipe_submissions (
  id SERIAL PRIMARY KEY,

  -- Informations de l'utilisateur
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  profile_image VARCHAR(500),

  -- Détails de la recette
  recipe_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  prep_time INTEGER,
  cook_time INTEGER,
  servings VARCHAR(50),
  category VARCHAR(100),
  recipe_image VARCHAR(500),

  -- Options
  newsletter_opt_in BOOLEAN DEFAULT FALSE,
  member_opt_in BOOLEAN DEFAULT FALSE,

  -- Statut de la soumission
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, published
  admin_notes TEXT,

  -- Tracking
  ip_address VARCHAR(45),
  user_agent TEXT,
  locale VARCHAR(5) DEFAULT 'fr',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_recipe_submissions_email ON recipe_submissions(email);
CREATE INDEX IF NOT EXISTS idx_recipe_submissions_status ON recipe_submissions(status);
CREATE INDEX IF NOT EXISTS idx_recipe_submissions_created ON recipe_submissions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE recipe_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs anonymes peuvent soumettre des recettes
CREATE POLICY "Allow anonymous recipe submissions" ON recipe_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Les administrateurs peuvent tout voir
CREATE POLICY "Allow admins to view all submissions" ON recipe_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Les administrateurs peuvent mettre à jour les soumissions
CREATE POLICY "Allow admins to update submissions" ON recipe_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Commentaires
COMMENT ON TABLE recipe_submissions IS 'Soumissions de recettes par les utilisateurs de la communauté';
COMMENT ON COLUMN recipe_submissions.status IS 'pending = en attente, approved = approuvé, rejected = refusé, published = publié';
