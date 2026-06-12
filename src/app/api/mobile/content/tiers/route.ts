import { NextRequest, NextResponse } from "next/server";
import { getContentTiersMap } from "@/lib/content/accessors";
import { getMobileUser } from "@/lib/mobile-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const user = await getMobileUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tiers = await getContentTiersMap();
  return NextResponse.json(
    { tiers },
    { headers: { "Cache-Control": "no-store" } }
  );
}
