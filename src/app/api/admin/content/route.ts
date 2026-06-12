import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listContentModules, seedContentModulesIfEmpty } from "@/lib/content/repository";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await seedContentModulesIfEmpty();
  const modules = await listContentModules();
  return NextResponse.json({ modules });
}
