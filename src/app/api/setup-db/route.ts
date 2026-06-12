import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { seedDatabase } from "../../../../prisma/seed";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * One-time production DB setup when local port 5432 is blocked.
 * POST with header: Authorization: Bearer <SETUP_SECRET>
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SETUP_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "SETUP_SECRET not configured on server" }, { status: 503 });
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL?.includes("neon.tech")) {
    return NextResponse.json({ error: "DATABASE_URL does not look like Neon" }, { status: 400 });
  }

  try {
    execSync("npx prisma db push --accept-data-loss", {
      stdio: "pipe",
      env: process.env,
    });

    await seedDatabase();

    return NextResponse.json({
      success: true,
      message: "Database schema pushed and demo accounts seeded.",
      demo: { email: "elite.insider@demo.com", password: "Demo1234!" },
    });
  } catch (err) {
    console.error("[setup-db]", err);
    const message = err instanceof Error ? err.message : "Setup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
