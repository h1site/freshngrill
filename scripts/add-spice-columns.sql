-- ============================================================
-- Ajouter les colonnes pour les données détaillées des épices
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- Origine et histoire
ALTER TABLE spices ADD COLUMN IF NOT EXISTS origine_histoire_fr TEXT;
ALTER TABLE spices ADD COLUMN IF NOT EXISTS origine_histoire_en TEXT;

-- Utilisations avec aliments
ALTER TABLE spices ADD COLUMN IF NOT EXISTS utilisation_aliments_fr TEXT[];
ALTER TABLE spices ADD COLUMN IF NOT EXISTS utilisation_aliments_en TEXT[];

-- Bienfaits culinaires
ALTER TABLE spices ADD COLUMN IF NOT EXISTS bienfaits_fr TEXT[];
ALTER TABLE spices ADD COLUMN IF NOT EXISTS bienfaits_en TEXT[];

-- Conservation
ALTER TABLE spices ADD COLUMN IF NOT EXISTS conservation_fr TEXT;
ALTER TABLE spices ADD COLUMN IF NOT EXISTS conservation_en TEXT;

-- Substitutions
ALTER TABLE spices ADD COLUMN IF NOT EXISTS substitutions TEXT[];

-- FAQ (stockées en JSONB)
ALTER TABLE spices ADD COLUMN IF NOT EXISTS faq_fr JSONB DEFAULT '[]'::jsonb;
ALTER TABLE spices ADD COLUMN IF NOT EXISTS faq_en JSONB DEFAULT '[]'::jsonb;

-- Vérifier les colonnes ajoutées
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'spices'
ORDER BY ordinal_position;
