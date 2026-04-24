import "server-only";

import Stripe from "stripe";

let cachedStripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (cachedStripe) return cachedStripe;
  cachedStripe = new Stripe(key, {
    typescript: true,
  });
  return cachedStripe;
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function stripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || null;
}

export function publicBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
