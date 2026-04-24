import { NextRequest, NextResponse } from "next/server";

import { getClientSession } from "@/lib/summer/client-auth";
import { getStripe, isStripeConfigured, publicBaseUrl } from "@/lib/summer/stripe";
import { selectSummerSingle, upsertSummerRows } from "@/lib/summer/supabase";
import type { SummerClient, SummerSubscriptionTier } from "@/lib/summer/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local to enable checkout.",
      },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as { tierId?: string; tierSlug?: string; email?: string };
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe SDK failed to initialize." }, { status: 500 });
  }

  // Prefer the signed-in client session for email — fall back to the passed email.
  const session = await getClientSession();
  const inboundEmail = payload.email?.trim().toLowerCase();
  const email = session?.client.email || inboundEmail;

  // Resolve the tier from slug or id.
  let tier: SummerSubscriptionTier | null = null;
  if (payload.tierId) {
    tier = await selectSummerSingle<SummerSubscriptionTier>("subscription_tiers", {
      id: `eq.${payload.tierId}`,
    });
  } else if (payload.tierSlug) {
    tier = await selectSummerSingle<SummerSubscriptionTier>("subscription_tiers", {
      slug: `eq.${payload.tierSlug}`,
    });
  }

  if (!tier) {
    return NextResponse.json({ error: "Subscription tier not found." }, { status: 404 });
  }

  if (!tier.stripe_price_id) {
    return NextResponse.json(
      {
        error:
          "This tier has no Stripe price ID. Create the price in Stripe, then add it in /admin/subscriptions.",
      },
      { status: 409 },
    );
  }

  // Locate or create a client row for this email (so we can attach later via webhook).
  let client: SummerClient | null = null;
  if (email) {
    client = await selectSummerSingle<SummerClient>("clients", { email: `eq.${email}` });
    if (!client) {
      const inserted = await upsertSummerRows<SummerClient>(
        "clients",
        [{ email, lifecycle_status: "lead" }],
        "email",
      );
      client = inserted?.[0] || null;
    }
  }

  // Reuse an existing Stripe customer if we already have one.
  let customerId = client?.stripe_customer_id || undefined;
  if (!customerId && email) {
    const customer = await stripe.customers.create({
      email,
      metadata: { summer_client_id: client?.id || "" },
    });
    customerId = customer.id;
    if (client) {
      await upsertSummerRows<SummerClient>(
        "clients",
        [{ ...client, stripe_customer_id: customerId }],
        "id",
      );
    }
  }

  const base = publicBaseUrl();
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: tier.stripe_price_id, quantity: 1 }],
    customer: customerId,
    customer_email: customerId ? undefined : email,
    allow_promotion_codes: true,
    success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
    cancel_url: `${base}/canceled`,
    metadata: {
      tier_id: tier.id,
      tier_slug: tier.slug,
      summer_client_id: client?.id || "",
    },
  });

  return NextResponse.json({ url: checkout.url });
}
