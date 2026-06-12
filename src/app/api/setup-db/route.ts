import { NextRequest, NextResponse } from "next/server";
import { execFileSync } from "child_process";
import path from "path";
import { seedDatabase } from "../../../../prisma/seed";
import { prisma } from "@/lib/prisma";

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
    const prismaBin = path.join(process.cwd(), "node_modules", ".bin", "prisma");
    execFileSync(prismaBin, ["db", "push", "--accept-data-loss"], {
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
    const stderr =
      err && typeof err === "object" && "stderr" in err
        ? String((err as { stderr: Buffer }).stderr)
        : "";
    const message =
      err instanceof Error ? `${err.message}${stderr ? `\n${stderr}` : ""}` : "Setup failed";
    return NextResponse.json({ error: message.slice(0, 500) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
