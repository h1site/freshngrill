-- ============================================================
-- Table: spices (Dictionnaire des épices)
-- ============================================================

CREATE TABLE IF NOT EXISTS spices (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,

  -- Noms
  name_fr VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  other_names TEXT[], -- Autres noms (pimentón, etc.)

  -- Définition
  definition_fr TEXT,
  definition_en TEXT,

  -- Origine & Histoire
  origin TEXT[], -- Pays/régions d'origine
  history_fr TEXT,
  history_en TEXT,

  -- Profil gustatif (JSONB)
  taste_profile JSONB DEFAULT '{
    "intensity": 3,
    "spicy": 0,
    "bitterness": 0,
    "sweetness": 0,
    "notes_fr": [],
    "notes_en": []
  }'::jsonb,

  -- Utilisation en cuisine
  usage_tips_fr TEXT,
  usage_tips_en TEXT,
  common_mistakes_fr TEXT,
  common_mistakes_en TEXT,

  -- Avec quels aliments (JSONB)
  used_with JSONB DEFAULT '{
    "meat": [],
    "fish": [],
    "vegetables": [],
    "grains": [],
    "bread": [],
    "desserts": [],
    "cheese": [],
    "soups": []
  }'::jsonb,

  -- Bienfaits (optionnel)
  benefits_fr TEXT,
  benefits_en TEXT,

  -- Conservation
  storage_fr TEXT,
  storage_en TEXT,

  -- Équivalences & substitutions
  substitutes TEXT[], -- Slugs des épices de substitution

  -- SEO
  seo_title_fr VARCHAR(70),
  seo_title_en VARCHAR(70),
  seo_description_fr VARCHAR(160),
  seo_description_en VARCHAR(160),
  faq JSONB,

  -- Image
  featured_image TEXT,
  image_alt_fr VARCHAR(200),
  image_alt_en VARCHAR(200),

  -- Catégories pour filtrage
  categories TEXT[], -- ['piquant', 'doux', 'fumé', 'chaud', 'indien', 'méditerranéen']

  -- Métadonnées
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_spices_slug ON spices(slug);
CREATE INDEX IF NOT EXISTS idx_spices_categories ON spices USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_spices_published ON spices(is_published);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_spices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_spices_updated_at ON spices;
CREATE TRIGGER trigger_spices_updated_at
  BEFORE UPDATE ON spices
  FOR EACH ROW
  EXECUTE FUNCTION update_spices_updated_at();

-- Table de liaison épices <-> recettes
CREATE TABLE IF NOT EXISTS recipe_spices (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  spice_id INTEGER REFERENCES spices(id) ON DELETE CASCADE,
  UNIQUE(recipe_id, spice_id)
);

CREATE INDEX IF NOT EXISTS idx_recipe_spices_recipe ON recipe_spices(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_spices_spice ON recipe_spices(spice_id);

-- RLS Policies
ALTER TABLE spices ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_spices ENABLE ROW LEVEL SECURITY;

-- Public read access for published spices
CREATE POLICY "Public can view published spices"
  ON spices FOR SELECT
  USING (is_published = true);

-- Admin full access (adjust email as needed)
CREATE POLICY "Admin full access to spices"
  ON spices FOR ALL
  USING (auth.jwt() ->> 'email' = 'info@h1site.com');

CREATE POLICY "Public can view recipe_spices"
  ON recipe_spices FOR SELECT
  USING (true);

CREATE POLICY "Admin full access to recipe_spices"
  ON recipe_spices FOR ALL
  USING (auth.jwt() ->> 'email' = 'info@h1site.com');

-- ============================================================
-- Exemple d'insertion: Paprika
-- ============================================================
INSERT INTO spices (
  slug,
  name_fr,
  name_en,
  other_names,
  definition_fr,
  definition_en,
  origin,
  history_fr,
  history_en,
  taste_profile,
  usage_tips_fr,
  usage_tips_en,
  common_mistakes_fr,
  common_mistakes_en,
  used_with,
  benefits_fr,
  benefits_en,
  storage_fr,
  storage_en,
  substitutes,
  seo_title_fr,
  seo_title_en,
  seo_description_fr,
  seo_description_en,
  faq,
  categories,
  is_published
) VALUES (
  'paprika',
  'Paprika',
  'Paprika',
  ARRAY['Pimentón', 'Poivre rouge doux'],
  'Le paprika est une épice douce à moyennement piquante obtenue à partir de poivrons rouges séchés et moulus. Son goût varie de sucré et fruité à fumé et intense selon sa préparation.',
  'Paprika is a mild to moderately spicy spice made from dried and ground red peppers. Its taste ranges from sweet and fruity to smoky and intense depending on its preparation.',
  ARRAY['Hongrie', 'Espagne', 'Amérique centrale'],
  'Originaire d''Amérique centrale, le paprika a été adopté et popularisé en Hongrie et en Espagne au 16e siècle, où il est devenu un pilier culinaire. Les Hongrois ont développé plusieurs variétés distinctes.',
  'Originally from Central America, paprika was adopted and popularized in Hungary and Spain in the 16th century, where it became a culinary staple. The Hungarians developed several distinct varieties.',
  '{
    "intensity": 3,
    "spicy": 1,
    "bitterness": 1,
    "sweetness": 2,
    "notes_fr": ["sucré", "fumé", "légèrement amer"],
    "notes_en": ["sweet", "smoky", "slightly bitter"]
  }'::jsonb,
  '<p><strong>Comment l''utiliser:</strong></p>
<ul>
<li>Idéal en début de cuisson douce pour libérer ses arômes</li>
<li>Excellent pour colorer les plats (riz, sauces, viandes)</li>
<li>S''ajoute aussi en fin de cuisson pour la couleur</li>
<li>Peut être utilisé cru en garniture</li>
</ul>',
  '<p><strong>How to use it:</strong></p>
<ul>
<li>Ideal at the beginning of gentle cooking to release its aromas</li>
<li>Excellent for coloring dishes (rice, sauces, meats)</li>
<li>Can also be added at the end of cooking for color</li>
<li>Can be used raw as a garnish</li>
</ul>',
  '<p><strong>Erreurs à éviter:</strong></p>
<ul>
<li><strong>Ne jamais brûler:</strong> Le paprika devient très amer quand il brûle</li>
<li><strong>Chaleur trop forte:</strong> Toujours cuire à feu doux/moyen</li>
<li><strong>Mauvaise conservation:</strong> Perd rapidement sa couleur et son goût à la lumière</li>
</ul>',
  '<p><strong>Common mistakes:</strong></p>
<ul>
<li><strong>Never burn it:</strong> Paprika becomes very bitter when burned</li>
<li><strong>Heat too high:</strong> Always cook on low/medium heat</li>
<li><strong>Poor storage:</strong> Quickly loses color and taste in light</li>
</ul>',
  '{
    "meat": ["poulet", "porc", "bœuf", "agneau", "saucisses"],
    "fish": ["poisson blanc", "crevettes", "poulpe"],
    "vegetables": ["pommes de terre", "carottes", "poivrons", "oignons", "chou-fleur"],
    "grains": ["riz", "pâtes", "quinoa"],
    "bread": [],
    "desserts": [],
    "cheese": ["fromage frais", "cream cheese"],
    "soups": ["soupe de tomates", "goulasch", "ragoûts"]
  }'::jsonb,
  '<p><strong>Bienfaits:</strong></p>
<ul>
<li>Riche en vitamine A et antioxydants</li>
<li>Contient de la capsaïcine (version piquante) qui stimule le métabolisme</li>
<li>Anti-inflammatoire naturel</li>
</ul>',
  '<p><strong>Benefits:</strong></p>
<ul>
<li>Rich in vitamin A and antioxidants</li>
<li>Contains capsaicin (spicy version) that stimulates metabolism</li>
<li>Natural anti-inflammatory</li>
</ul>',
  '<p><strong>Conservation:</strong></p>
<ul>
<li>Pot hermétique à l''abri de la lumière</li>
<li>Durée: 6 à 12 mois moulu, jusqu''à 3 ans entier</li>
<li>Ne jamais exposer à l''humidité</li>
</ul>',
  '<p><strong>Storage:</strong></p>
<ul>
<li>Airtight container away from light</li>
<li>Duration: 6 to 12 months ground, up to 3 years whole</li>
<li>Never expose to moisture</li>
</ul>',
  ARRAY['piment-de-cayenne', 'poivre-rouge'],
  'Paprika: Épice Douce et Fumée | Guide Complet',
  'Paprika: Sweet and Smoky Spice | Complete Guide',
  'Tout sur le paprika: goût, utilisation, recettes. Découvrez cette épice douce et colorée d''origine hongroise. Guide complet + conseils.',
  'Everything about paprika: taste, uses, recipes. Discover this sweet and colorful spice of Hungarian origin. Complete guide + tips.',
  '[
    {"question": "Quelle est la différence entre paprika doux et fumé?", "answer": "Le paprika doux est simplement séché, tandis que le paprika fumé (pimentón) est séché au feu de bois, ce qui lui donne un goût fumé distinctif. Le fumé est typique de la cuisine espagnole."},
    {"question": "Le paprika est-il piquant?", "answer": "Le paprika doux n''est pas piquant du tout. Il existe cependant du paprika fort (hot paprika) qui a un niveau de piquant modéré, similaire au piment de Cayenne léger."},
    {"question": "Par quoi remplacer le paprika?", "answer": "Vous pouvez remplacer le paprika par du piment d''Espelette, du piment de Cayenne (en plus petite quantité car plus fort), ou un mélange de poivre rouge et une pincée de sucre."}
  ]'::jsonb,
  ARRAY['doux', 'fumé', 'méditerranéen', 'hongrois', 'espagnol'],
  true
);
