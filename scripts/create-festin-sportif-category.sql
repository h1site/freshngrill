-- 1. Create the "Festin Sportif" category
INSERT INTO categories (slug, name, parent_id)
VALUES ('festin-sportif', 'Festin Sportif', NULL)
ON CONFLICT (slug) DO NOTHING;

-- 2. Link all 20 Super Bowl recipes to this category
-- Get the category ID and recipe IDs from slugs
WITH festin_cat AS (
  SELECT id FROM categories WHERE slug = 'festin-sportif'
),
superbowl_recipes AS (
  SELECT id FROM recipes WHERE slug IN (
    'ailes-de-poulet-buffalo',
    'nachos-supreme-fromage',
    'trempette-pizza-chaude',
    'mini-pogos-fromage-biere',
    'jalapeno-poppers-bacon',
    'ailes-general-tao-erable',
    'pelures-patates-garnies',
    'trempette-fromage-biere',
    'boulettes-viande-sauce-bbq',
    'mini-burgers-smash',
    'fromage-en-croute-curds',
    'guacamole-maison-chips',
    'pizza-baguette-pepperoni',
    'saucisses-cocktail-erable-whisky',
    'rondelles-oignon-panees',
    'tacos-poulet-bbq',
    'mac-and-cheese-bacon',
    'crevettes-coco-panees',
    'chili-con-carne-superbowl',
    'cotes-levees-sauce-bbq-maison'
  )
)
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT sr.id, fc.id
FROM superbowl_recipes sr
CROSS JOIN festin_cat fc
ON CONFLICT DO NOTHING;

-- Verify
SELECT c.name, COUNT(rc.recipe_id) as recipe_count
FROM categories c
LEFT JOIN recipe_categories rc ON rc.category_id = c.id
WHERE c.slug = 'festin-sportif'
GROUP BY c.name;
