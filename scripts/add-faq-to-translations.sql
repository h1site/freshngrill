-- Add faq column to recipe_translations table if it doesn't exist
ALTER TABLE recipe_translations
ADD COLUMN IF NOT EXISTS faq TEXT;

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'recipe_translations'
AND column_name = 'faq';
