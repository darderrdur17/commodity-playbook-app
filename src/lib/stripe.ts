import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** Lazy Stripe client — avoids build failure when STRIPE_SECRET_KEY is unset at compile time. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }

  return stripeClient;
}

export function getStripePrices() {
  const pro = process.env.STRIPE_PRO_PRICE_ID;
  const elite = process.env.STRIPE_ELITE_PRICE_ID;

  if (!pro || !elite) {
    throw new Error("STRIPE_PRO_PRICE_ID and STRIPE_ELITE_PRICE_ID must be configured");
  }

  return {
    PRO_MONTHLY: pro,
    ELITE_MONTHLY: elite,
  } as const;
}

export async function createOrRetrieveCustomer(userId: string, email: string) {
  const stripe = getStripe();
  const { prisma } = await import("@/lib/prisma");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export function getTierFromPriceId(priceId: string) {
  const prices = getStripePrices();
  if (priceId === prices.ELITE_MONTHLY) return "ELITE";
  if (priceId === prices.PRO_MONTHLY) return "PRO";
  return "STARTER";
}
