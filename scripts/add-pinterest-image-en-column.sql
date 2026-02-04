-- Add pinterest_image_en column to recipes table
-- This column stores the English Pinterest image URL for each recipe

ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS pinterest_image_en TEXT;

-- Add comment for documentation
COMMENT ON COLUMN recipes.pinterest_image_en IS 'URL of the Pinterest image with English title (1000x1500)';
