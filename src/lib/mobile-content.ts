import { NextRequest, NextResponse } from "next/server";
import { getContentTierForSlug } from "@/lib/content/accessors";
import { getModuleMeta } from "@/lib/content/modules";
import { getMobileUser, hasTierAccess } from "@/lib/mobile-auth";

export async function requireMobileContentAccess(req: NextRequest, slug: string) {
  const meta = getModuleMeta(slug);
  if (!meta) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }

  const user = await getMobileUser(req);
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const requiredTier = await getContentTierForSlug(slug);
  if (!hasTierAccess(user.tier, requiredTier)) {
    return {
      error: NextResponse.json(
        { error: `${requiredTier} membership required` },
        { status: 403 }
      ),
    };
  }

  return { user, requiredTier };
}
