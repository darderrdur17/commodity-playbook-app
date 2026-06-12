import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const STRIPE_PRICES = {
  PRO_ONE_TIME: process.env.STRIPE_PRO_PRICE_ID!,
  ELITE_MONTHLY: process.env.STRIPE_ELITE_PRICE_ID!,
} as const;

export async function createOrRetrieveCustomer(userId: string, email: string) {
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
  if (priceId === STRIPE_PRICES.ELITE_MONTHLY) return "ELITE";
  if (priceId === STRIPE_PRICES.PRO_ONE_TIME) return "PRO";
  return "STARTER";
}
