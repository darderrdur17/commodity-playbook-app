export type CheckoutPlan = "pro" | "elite";

/** Start Stripe Checkout for Pro or Elite. Returns redirect URL or null on failure. */
export async function startCheckout(plan: CheckoutPlan): Promise<string | null> {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { url?: string };
  return data.url ?? null;
}
