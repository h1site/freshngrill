-- Configuration du Storage pour les images de recettes
-- Exécuter ce script dans le SQL Editor de Supabase

-- Créer le bucket pour les images de recettes
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politique: lecture publique des images
CREATE POLICY "Images publiques en lecture" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'recipe-images');

-- Politique: upload pour utilisateurs authentifiés (admin)
CREATE POLICY "Upload images pour service role" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'recipe-images');

-- Politique: update pour service role
CREATE POLICY "Update images pour service role" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'recipe-images');

-- Politique: delete pour service role
CREATE POLICY "Delete images pour service role" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'recipe-images');
