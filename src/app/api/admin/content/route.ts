import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listContentModules, seedContentModulesIfEmpty } from "@/lib/content/repository";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await seedContentModulesIfEmpty();
    const modules = await listContentModules();
    return NextResponse.json(
      { modules },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[admin/content] GET failed:", err);
    const message =
      err instanceof Error ? err.message : "Failed to load content modules";
    return NextResponse.json(
      {
        error:
          message.includes("ContentModule") || message.includes("does not exist")
            ? "CMS tables missing. Run: npx prisma db push && npm run db:seed"
            : "Failed to load content modules. Check database connection.",
      },
      { status: 500 }
    );
  }
}
