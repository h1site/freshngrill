import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase';
import { transformProduct } from '@/types/shop';
import Stripe from 'stripe';
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const stripe = getStripe();
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
        console.log('Payment succeeded:', event.data.object.id);
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
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(
  supabase: ReturnType<typeof createAdminClient>,
  session: Stripe.Checkout.Session
) {
  const items = JSON.parse(session.metadata?.items || '[]') as Array<{
    productId: number;
    quantity: number;
  }>;

  // Récupérer les produits
  const productIds = items.map((item) => item.productId);
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds);

  const products = productsData?.map(transformProduct) || [];

  // Calculer le total
  let subtotal = 0;
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const totalPrice = (product?.price || 0) * item.quantity;
    subtotal += totalPrice;

    return {
      product_id: item.productId,
      product_name: product?.name || 'Produit inconnu',
      product_image: product?.featuredImage,
      product_type: product?.productType || 'physical',
      quantity: item.quantity,
      unit_price: product?.price || 0,
      total_price: totalPrice,
      // Token pour téléchargement (produits numériques)
      download_token:
        product?.productType === 'digital'
          ? crypto.randomBytes(32).toString('hex')
          : null,
      download_expires_at:
        product?.productType === 'digital'
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
          : null,
    };
  });

  // Générer numéro de commande
  const { data: orderNumberResult } = await supabase.rpc('generate_order_number');
  const orderNumber = (orderNumberResult as unknown as string) || `MC${Date.now()}`;

  // Créer la commande
  const { data: order, error: orderError } = await supabase
    .from('orders' as never)
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
      shipping_address: (session as unknown as { shipping_details?: { name: string; address: Record<string, unknown> } }).shipping_details?.address
        ? {
            name: (session as unknown as { shipping_details: { name: string } }).shipping_details.name,
            ...(session as unknown as { shipping_details: { address: Record<string, unknown> } }).shipping_details.address,
          }
        : null,
    } as never)
    .select('id')
    .single() as { data: { id: number } | null; error: Error | null };

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }

  if (!order) {
    throw new Error('Failed to create order');
  }

  // Créer les items de commande
  const itemsWithOrderId = orderItems.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  await supabase.from('order_items' as never).insert(itemsWithOrderId as never);

  // Mettre à jour l'inventaire si nécessaire
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (product?.trackInventory) {
      await supabase
        .from('products' as never)
        .update({
          inventory_quantity: product.inventoryQuantity - item.quantity,
        } as never)
        .eq('id', item.productId);
    }
  }

  console.log(`Order ${orderNumber} created successfully`);

  // TODO: Envoyer email de confirmation
  // await sendOrderConfirmationEmail(session.customer_details?.email, order, orderItems);
}

async function handleRefund(
  supabase: ReturnType<typeof createAdminClient>,
  charge: Stripe.Charge
) {
  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    console.error('No payment intent ID found in charge');
    return;
  }

  await supabase
    .from('orders' as never)
    .update({
      payment_status:
        charge.amount_refunded === charge.amount
          ? 'refunded'
          : 'partially_refunded',
      status: charge.amount_refunded === charge.amount ? 'refunded' : 'paid',
    } as never)
    .eq('stripe_payment_intent_id', paymentIntentId);

  console.log(`Refund processed for payment ${paymentIntentId}`);
}
