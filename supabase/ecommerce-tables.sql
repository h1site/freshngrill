-- =============================================
-- E-COMMERCE TABLES FOR MENUCOCHON
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- Table: products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),  -- Prix barré (optionnel)
  currency VARCHAR(3) DEFAULT 'CAD',

  -- Type de produit
  product_type VARCHAR(20) DEFAULT 'physical', -- 'physical' | 'digital'

  -- Pour produits numériques
  digital_file_url TEXT,           -- URL du fichier (Supabase Storage)
  download_limit INTEGER DEFAULT 3, -- Nombre de téléchargements max

  -- Pour produits physiques
  weight_grams INTEGER,
  requires_shipping BOOLEAN DEFAULT true,

  -- Inventaire
  track_inventory BOOLEAN DEFAULT false,
  inventory_quantity INTEGER DEFAULT 0,
  allow_backorder BOOLEAN DEFAULT false,

  -- Images
  featured_image TEXT,
  images TEXT[],

  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,

  -- Statut
  status VARCHAR(20) DEFAULT 'draft', -- 'draft' | 'active' | 'archived'
  featured BOOLEAN DEFAULT false,

  -- Stripe
  stripe_product_id VARCHAR(255),
  stripe_price_id VARCHAR(255),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,

  -- Client
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  user_id UUID REFERENCES auth.users(id),  -- Si connecté

  -- Stripe
  stripe_checkout_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),

  -- Montants
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'CAD',

  -- Statut
  status VARCHAR(20) DEFAULT 'pending',
  -- 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

  payment_status VARCHAR(20) DEFAULT 'unpaid',
  -- 'unpaid' | 'paid' | 'refunded' | 'partially_refunded'

  fulfillment_status VARCHAR(20) DEFAULT 'unfulfilled',
  -- 'unfulfilled' | 'partially_fulfilled' | 'fulfilled'

  -- Livraison (produits physiques)
  shipping_address JSONB,
  -- { name, line1, line2, city, state, postal_code, country }

  shipping_method VARCHAR(100),
  tracking_number VARCHAR(255),
  tracking_url TEXT,

  -- Notes
  customer_notes TEXT,
  internal_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),

  -- Snapshot du produit au moment de l'achat
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  product_type VARCHAR(20),

  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,

  -- Pour produits numériques
  download_count INTEGER DEFAULT 0,
  download_token VARCHAR(255) UNIQUE,
  download_expires_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_token ON order_items(download_token);

-- Fonction pour générer numéro de commande
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  prefix TEXT := 'MC';  -- Menucochon
BEGIN
  SELECT prefix || TO_CHAR(NOW(), 'YYMMDD') || '-' ||
         LPAD(COALESCE(MAX(CAST(SPLIT_PART(order_number, '-', 2) AS INTEGER)), 0) + 1, 4, '0')
  INTO new_number
  FROM orders
  WHERE order_number LIKE prefix || TO_CHAR(NOW(), 'YYMMDD') || '-%';

  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at sur products
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Trigger pour updated_at sur orders
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- RLS Policies (Row Level Security)
-- Permettre aux utilisateurs de voir leurs propres commandes
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.email() = customer_email
  );

-- Les admins peuvent tout voir (via service role key)
-- Note: Les API routes utilisent le service role qui bypass RLS

-- Storage bucket pour les produits numériques
-- À créer manuellement dans Supabase Dashboard > Storage
-- Nom suggéré: "downloads" (privé)

COMMENT ON TABLE products IS 'Produits de la boutique (physiques et numériques)';
COMMENT ON TABLE orders IS 'Commandes clients';
COMMENT ON TABLE order_items IS 'Items individuels dans chaque commande';
