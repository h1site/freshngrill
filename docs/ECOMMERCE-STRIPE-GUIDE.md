# Guide d'implémentation E-commerce avec Stripe + Next.js + Supabase

Ce guide documente l'implémentation complète d'une boutique en ligne avec:
- **Stripe** pour les paiements
- **Next.js App Router** pour le frontend
- **Supabase** pour la base de données
- Support **produits physiques** et **numériques**

---

## 1. Prérequis

### Comptes requis
- Compte Stripe (https://dashboard.stripe.com)
- Compte Supabase (déjà configuré)
- Compte Resend pour les emails (optionnel)

### Variables d'environnement à ajouter

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx          # Clé secrète (backend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # Clé publique (frontend)
STRIPE_WEBHOOK_SECRET=whsec_xxx        # Secret webhook (production)

# Optionnel - Emails
RESEND_API_KEY=re_xxx
```

---

## 2. Installation des dépendances

```bash
npm install stripe @stripe/stripe-js
```

- `stripe` - SDK serveur pour Node.js
- `@stripe/stripe-js` - SDK client pour le navigateur

---

## 3. Structure de la base de données (Supabase)

### Table `products`

```sql
CREATE TABLE products (
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
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_type ON products(product_type);
```

### Table `orders`

```sql
CREATE TABLE orders (
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
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user ON orders(user_id);
```

### Table `order_items`

```sql
CREATE TABLE order_items (
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

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_token ON order_items(download_token);
```

### Fonction pour générer numéro de commande

```sql
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  prefix TEXT := 'MC';  -- Menucochon - changer pour ton projet
BEGIN
  SELECT prefix || TO_CHAR(NOW(), 'YYMMDD') || '-' ||
         LPAD(COALESCE(MAX(CAST(SPLIT_PART(order_number, '-', 2) AS INTEGER)), 0) + 1, 4, '0')
  INTO new_number
  FROM orders
  WHERE order_number LIKE prefix || TO_CHAR(NOW(), 'YYMMDD') || '-%';

  RETURN new_number;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. Configuration Stripe

### Fichier: `src/lib/stripe.ts`

```typescript
import Stripe from 'stripe';

// Serveur uniquement
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});
```

### Fichier: `src/lib/stripe-client.ts`

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};
```

---

## 5. API Routes

### Fichier: `src/app/api/checkout/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase';

interface CartItem {
  productId: number;
  quantity: number;
}

export async function POST(request: Request) {
  const supabase = createAdminClient();

  try {
    const { items, customerEmail } = await request.json() as {
      items: CartItem[];
      customerEmail?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    // Récupérer les produits
    const productIds = items.map(item => item.productId);
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)
      .eq('status', 'active');

    if (error || !products) {
      return NextResponse.json({ error: 'Produits non trouvés' }, { status: 404 });
    }

    // Vérifier si produits physiques (nécessite adresse)
    const hasPhysicalProducts = products.some(p => p.product_type === 'physical');

    // Créer les line items Stripe
    const lineItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Produit ${item.productId} non trouvé`);

      return {
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: {
            name: product.name,
            description: product.description?.substring(0, 500),
            images: product.featured_image ? [product.featured_image] : [],
          },
          unit_amount: Math.round(product.price * 100), // Stripe utilise les cents
        },
        quantity: item.quantity,
      };
    });

    // Créer la session Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/boutique/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/boutique/panier`,
      customer_email: customerEmail,

      // Collecter adresse si produits physiques
      ...(hasPhysicalProducts && {
        shipping_address_collection: {
          allowed_countries: ['CA', 'US'],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 999, currency: 'cad' },
              display_name: 'Livraison standard',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 5 },
                maximum: { unit: 'business_day', value: 10 },
              },
            },
          },
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 1999, currency: 'cad' },
              display_name: 'Livraison express',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 2 },
                maximum: { unit: 'business_day', value: 3 },
              },
            },
          },
        ],
      }),

      // Métadonnées pour le webhook
      metadata: {
        items: JSON.stringify(items),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du checkout' },
      { status: 500 }
    );
  }
}
```

### Fichier: `src/app/api/webhooks/stripe/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase';
import Stripe from 'stripe';
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(supabase, session);
        break;
      }

      case 'payment_intent.succeeded': {
        // Optionnel: logique additionnelle
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(supabase, charge);
        break;
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutComplete(supabase: any, session: Stripe.Checkout.Session) {
  const items = JSON.parse(session.metadata?.items || '[]');

  // Récupérer les produits
  const productIds = items.map((item: any) => item.productId);
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds);

  // Calculer le total
  let subtotal = 0;
  const orderItems = items.map((item: any) => {
    const product = products?.find((p: any) => p.id === item.productId);
    const totalPrice = (product?.price || 0) * item.quantity;
    subtotal += totalPrice;

    return {
      product_id: item.productId,
      product_name: product?.name,
      product_image: product?.featured_image,
      product_type: product?.product_type,
      quantity: item.quantity,
      unit_price: product?.price,
      total_price: totalPrice,
      // Token pour téléchargement (produits numériques)
      download_token: product?.product_type === 'digital'
        ? crypto.randomBytes(32).toString('hex')
        : null,
      download_expires_at: product?.product_type === 'digital'
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
        : null,
    };
  });

  // Générer numéro de commande
  const { data: orderNumberResult } = await supabase.rpc('generate_order_number');
  const orderNumber = orderNumberResult || `MC${Date.now()}`;

  // Créer la commande
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent,
      subtotal,
      shipping_cost: (session.shipping_cost?.amount_total || 0) / 100,
      tax_amount: (session.total_details?.amount_tax || 0) / 100,
      total: (session.amount_total || 0) / 100,
      status: 'paid',
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
      shipping_address: session.shipping_details?.address ? {
        name: session.shipping_details.name,
        ...session.shipping_details.address,
      } : null,
    })
    .select('id')
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }

  // Créer les items de commande
  const itemsWithOrderId = orderItems.map((item: any) => ({
    ...item,
    order_id: order.id,
  }));

  await supabase.from('order_items').insert(itemsWithOrderId);

  // Mettre à jour l'inventaire si nécessaire
  for (const item of items) {
    const product = products?.find((p: any) => p.id === item.productId);
    if (product?.track_inventory) {
      await supabase
        .from('products')
        .update({
          inventory_quantity: product.inventory_quantity - item.quantity
        })
        .eq('id', item.productId);
    }
  }

  // TODO: Envoyer email de confirmation
  // await sendOrderConfirmationEmail(session.customer_details?.email, order, orderItems);
}

async function handleRefund(supabase: any, charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent;

  await supabase
    .from('orders')
    .update({
      payment_status: charge.amount_refunded === charge.amount ? 'refunded' : 'partially_refunded',
      status: charge.amount_refunded === charge.amount ? 'refunded' : 'paid',
    })
    .eq('stripe_payment_intent_id', paymentIntentId);
}
```

### Fichier: `src/app/api/download/[token]/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createAdminClient();

  // Trouver l'item de commande
  const { data: orderItem, error } = await supabase
    .from('order_items')
    .select(`
      *,
      product:products(digital_file_url, download_limit),
      order:orders(status, payment_status)
    `)
    .eq('download_token', token)
    .single();

  if (error || !orderItem) {
    return NextResponse.json({ error: 'Lien invalide' }, { status: 404 });
  }

  // Vérifier le paiement
  if (orderItem.order?.payment_status !== 'paid') {
    return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 403 });
  }

  // Vérifier expiration
  if (orderItem.download_expires_at && new Date(orderItem.download_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Lien expiré' }, { status: 410 });
  }

  // Vérifier limite de téléchargements
  const downloadLimit = orderItem.product?.download_limit || 3;
  if (orderItem.download_count >= downloadLimit) {
    return NextResponse.json({ error: 'Limite de téléchargements atteinte' }, { status: 403 });
  }

  // Incrémenter le compteur
  await supabase
    .from('order_items')
    .update({ download_count: orderItem.download_count + 1 })
    .eq('id', orderItem.id);

  // Rediriger vers le fichier (Supabase Storage signed URL)
  const fileUrl = orderItem.product?.digital_file_url;
  if (!fileUrl) {
    return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
  }

  // Si c'est une URL Supabase Storage, créer un signed URL
  if (fileUrl.includes('supabase')) {
    const path = fileUrl.split('/storage/v1/object/public/')[1];
    if (path) {
      const { data: signedUrl } = await supabase.storage
        .from('downloads')
        .createSignedUrl(path.replace('downloads/', ''), 60); // 60 secondes

      if (signedUrl?.signedUrl) {
        return NextResponse.redirect(signedUrl.signedUrl);
      }
    }
  }

  return NextResponse.redirect(fileUrl);
}
```

---

## 6. Types TypeScript

### Fichier: `src/types/shop.ts`

```typescript
export interface Product {
  id: number;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  productType: 'physical' | 'digital';
  digitalFileUrl?: string;
  downloadLimit: number;
  weightGrams?: number;
  requiresShipping: boolean;
  trackInventory: boolean;
  inventoryQuantity: number;
  allowBackorder: boolean;
  featuredImage?: string;
  images: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'active' | 'archived';
  featured: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'partially_refunded';
  fulfillmentStatus: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled';
  shippingAddress?: ShippingAddress;
  shippingMethod?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage?: string;
  productType: 'physical' | 'digital';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  downloadCount: number;
  downloadToken?: string;
  downloadExpiresAt?: string;
}
```

---

## 7. Hook Panier (Context)

### Fichier: `src/contexts/CartContext.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, CartItem } from '@/types/shop';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'menucochon_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger le panier depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder le panier
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(current => {
      const existing = current.find(item => item.product.id === product.id);
      if (existing) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { product, quantity }];
    });
  };

  const removeItem = (productId: number) => {
    setItems(current => current.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

---

## 8. Composant bouton d'achat

### Fichier: `src/components/shop/AddToCartButton.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/types/shop';

interface Props {
  product: Product;
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({ product, quantity = 1, className = '' }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Vérifier inventaire
  const outOfStock = product.trackInventory && product.inventoryQuantity <= 0 && !product.allowBackorder;

  if (outOfStock) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed ${className}`}
      >
        Rupture de stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F77313] hover:bg-[#e56200] text-white font-semibold rounded-lg transition-all ${
        added ? 'bg-green-600 hover:bg-green-600' : ''
      } ${className}`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Ajouté!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Ajouter au panier
        </>
      )}
    </button>
  );
}
```

---

## 9. Page Boutique

### Fichier: `src/app/boutique/page.tsx`

```typescript
import { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase';
import ProductCard from '@/components/shop/ProductCard';

export const metadata: Metadata = {
  title: 'Boutique | Menucochon',
  description: 'Découvrez nos produits: livres de recettes, épices, et plus encore.',
};

async function getProducts() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Boutique</h1>

        {products.length === 0 ? (
          <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

---

## 10. Configuration Webhook Stripe (Production)

1. Aller sur https://dashboard.stripe.com/webhooks
2. Créer un endpoint: `https://tonsite.com/api/webhooks/stripe`
3. Sélectionner les événements:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `charge.refunded`
4. Copier le "Signing secret" dans `STRIPE_WEBHOOK_SECRET`

### Test local avec Stripe CLI

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Écouter les webhooks localement
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Dans un autre terminal, déclencher un test
stripe trigger checkout.session.completed
```

---

## 11. Checklist de déploiement

- [ ] Variables d'environnement configurées sur Vercel
- [ ] Tables Supabase créées
- [ ] Webhook Stripe configuré
- [ ] Test d'achat en mode test
- [ ] Passer en mode live sur Stripe
- [ ] Mettre à jour les clés pour production

---

## 12. Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks Stripe](https://stripe.com/docs/webhooks)
- [Next.js App Router](https://nextjs.org/docs/app)

---

*Guide créé pour Menucochon - Réutilisable pour d'autres projets Next.js + Supabase*
