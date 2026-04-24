import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripe, stripeWebhookSecret } from "@/lib/summer/stripe";
import {
  insertSummerRows,
  selectSummerSingle,
  updateSummerRows,
  upsertSummerRows,
} from "@/lib/summer/supabase";
import type {
  SummerClient,
  SummerDigitalProduct,
  SummerSubscription,
  SummerSubscriptionTier,
} from "@/lib/summer/types";

export const runtime = "nodejs";

// We need the raw body for signature verification.
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const secret = stripeWebhookSecret();
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid signature: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 400 },
    );
  }

  // Idempotency: skip if we've already processed this event id.
  const existing = await selectSummerSingle<{ id: string }>("stripe_events", {
    stripe_event_id: `eq.${event.id}`,
  });
  if (existing) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(sub);
        break;
      }
      default:
        break;
    }

    await insertSummerRows("stripe_events", [
      {
        stripe_event_id: event.id,
        type: event.type,
        payload: event.data.object as unknown as Record<string, unknown>,
      },
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook processing failed." },
      { status: 500 },
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const clientIdFromMetadata = session.metadata?.summer_client_id || null;
  const customerEmail = session.customer_details?.email?.toLowerCase() || session.customer_email?.toLowerCase() || null;
  const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id || null;

  // Ensure we have a client row linked.
  let client: SummerClient | null = null;
  if (clientIdFromMetadata) {
    client = await selectSummerSingle<SummerClient>("clients", { id: `eq.${clientIdFromMetadata}` });
  }
  if (!client && customerEmail) {
    client = await selectSummerSingle<SummerClient>("clients", { email: `eq.${customerEmail}` });
  }
  if (!client && customerEmail) {
    const inserted = await upsertSummerRows<SummerClient>(
      "clients",
      [
        {
          email: customerEmail,
          stripe_customer_id: stripeCustomerId,
          lifecycle_status: "client",
        },
      ],
      "email",
    );
    client = inserted?.[0] || null;
  }

  if (client && stripeCustomerId && !client.stripe_customer_id) {
    await updateSummerRows("clients", { id: `eq.${client.id}` }, {
      stripe_customer_id: stripeCustomerId,
      lifecycle_status: "client",
    });
  }

  if (session.mode === "payment" && session.metadata?.product_id) {
    const product = await selectSummerSingle<SummerDigitalProduct>("digital_products", {
      id: `eq.${session.metadata.product_id}`,
    });
    await insertSummerRows("purchases", [
      {
        client_id: client?.id || null,
        product_id: product?.id || null,
        amount_cents: session.amount_total || product?.price_cents || 0,
        currency: session.currency || "usd",
        stripe_payment_intent_id:
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null,
        status: "paid",
        download_url: product?.file_url || null,
        download_expires_at: null,
      },
    ]);
  }

  if (session.mode === "subscription" && session.subscription) {
    const stripe = getStripe();
    if (!stripe) return;
    const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    const subscription = await stripe.subscriptions.retrieve(subId);
    await upsertSubscriptionRecord(subscription, client?.id || null, session.metadata?.tier_id || null);
  }
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  const stripeCustomerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const client = await selectSummerSingle<SummerClient>("clients", {
    stripe_customer_id: `eq.${stripeCustomerId}`,
  });
  await upsertSubscriptionRecord(sub, client?.id || null, null);
}

async function upsertSubscriptionRecord(
  sub: Stripe.Subscription,
  clientId: string | null,
  fallbackTierId: string | null,
) {
  // Find the tier by stripe_price_id first; fall back to metadata.
  const item = sub.items?.data?.[0];
  const priceId = item?.price?.id || null;
  let tier: SummerSubscriptionTier | null = null;
  if (priceId) {
    tier = await selectSummerSingle<SummerSubscriptionTier>("subscription_tiers", {
      stripe_price_id: `eq.${priceId}`,
    });
  }
  const existing = await selectSummerSingle<SummerSubscription>("subscriptions", {
    stripe_subscription_id: `eq.${sub.id}`,
  });
  // Some Stripe API versions expose the billing period on the item instead of
  // the subscription. Read from either source.
  const subAny = sub as unknown as { current_period_start?: number; current_period_end?: number };
  const itemAny = item as unknown as { current_period_start?: number; current_period_end?: number } | undefined;
  const periodStart = subAny.current_period_start ?? itemAny?.current_period_start ?? null;
  const periodEnd = subAny.current_period_end ?? itemAny?.current_period_end ?? null;
  const payload = {
    client_id: clientId || existing?.client_id || null,
    tier_id: tier?.id || fallbackTierId || existing?.tier_id || null,
    stripe_subscription_id: sub.id,
    status: sub.status,
    current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    cancel_at_period_end: Boolean(sub.cancel_at_period_end),
  };
  await upsertSummerRows("subscriptions", [payload], "stripe_subscription_id");
}
