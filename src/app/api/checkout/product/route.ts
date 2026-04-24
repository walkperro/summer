import { NextRequest, NextResponse } from "next/server";

import { getClientSession } from "@/lib/summer/client-auth";
import { getStripe, isStripeConfigured, publicBaseUrl } from "@/lib/summer/stripe";
import { selectSummerSingle, upsertSummerRows } from "@/lib/summer/supabase";
import type { SummerClient, SummerDigitalProduct } from "@/lib/summer/types";

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

  const payload = (await request.json()) as { productId?: string; productSlug?: string; email?: string };
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe SDK failed to initialize." }, { status: 500 });
  }

  const session = await getClientSession();
  const inboundEmail = payload.email?.trim().toLowerCase();
  const email = session?.client.email || inboundEmail;

  let product: SummerDigitalProduct | null = null;
  if (payload.productId) {
    product = await selectSummerSingle<SummerDigitalProduct>("digital_products", {
      id: `eq.${payload.productId}`,
    });
  } else if (payload.productSlug) {
    product = await selectSummerSingle<SummerDigitalProduct>("digital_products", {
      slug: `eq.${payload.productSlug}`,
    });
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

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

  const base = publicBaseUrl();

  // If a Stripe price already exists on the product row, use it. Otherwise
  // create an ad-hoc price-less line item from our own description + price.
  const lineItems = product.stripe_price_id
    ? [{ price: product.stripe_price_id, quantity: 1 }]
    : [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              description: product.subtitle || product.description || undefined,
            },
            unit_amount: product.price_cents,
          },
          quantity: 1,
        },
      ];

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer: client?.stripe_customer_id || undefined,
    customer_email: client?.stripe_customer_id ? undefined : email,
    success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}&type=product`,
    cancel_url: `${base}/canceled`,
    metadata: {
      product_id: product.id,
      product_slug: product.slug,
      summer_client_id: client?.id || "",
    },
  });

  return NextResponse.json({ url: checkout.url });
}
