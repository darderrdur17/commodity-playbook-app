import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, STRIPE_PRICES, createOrRetrieveCustomer } from "@/lib/stripe";
import { z } from "zod";

const schema = z.object({
  plan: z.enum(["pro", "elite"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { plan } = parsed.data;
  const userId = session.user.id;
  const email = session.user.email!;

  const customerId = await createOrRetrieveCustomer(userId, email);
  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL;

  const priceId = plan === "elite" ? STRIPE_PRICES.ELITE_MONTHLY : STRIPE_PRICES.PRO_ONE_TIME;
  const mode = plan === "elite" ? "subscription" : "payment";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?upgraded=1`,
    cancel_url: `${origin}/pricing?cancelled=1`,
    metadata: { userId, plan },
    subscription_data: mode === "subscription" ? { metadata: { userId } } : undefined,
    allow_promotion_codes: true,
    billing_address_collection: "required",
  });

  return NextResponse.json({ url: checkoutSession.url });
}
