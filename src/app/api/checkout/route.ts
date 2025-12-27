import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase';
import { transformProduct } from '@/types/shop';

interface CartItem {
  productId: number;
  quantity: number;
}

export async function POST(request: Request) {
  const supabase = createAdminClient();

  try {
    const { items, customerEmail } = (await request.json()) as {
      items: CartItem[];
      customerEmail?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    // Récupérer les produits
    const productIds = items.map((item) => item.productId);
    const { data: productsData, error } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)
      .eq('status', 'active');

    if (error || !productsData) {
      return NextResponse.json(
        { error: 'Produits non trouvés' },
        { status: 404 }
      );
    }

    const products = productsData.map(transformProduct);

    // Vérifier si produits physiques (nécessite adresse)
    const hasPhysicalProducts = products.some((p) => p.productType === 'physical');

    // Créer les line items Stripe
    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Produit ${item.productId} non trouvé`);

      return {
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: {
            name: product.name,
            description: product.description?.substring(0, 500),
            images: product.featuredImage ? [product.featuredImage] : [],
          },
          unit_amount: Math.round(product.price * 100), // Stripe utilise les cents
        },
        quantity: item.quantity,
      };
    });

    const stripe = getStripe();

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
