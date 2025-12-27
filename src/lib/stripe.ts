import Stripe from 'stripe';

// Serveur uniquement - Ne pas importer côté client
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export direct pour usage simple
export const stripe = {
  get instance() {
    return getStripe();
  },
};
