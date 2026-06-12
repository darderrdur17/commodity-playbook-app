import { NextRequest, NextResponse } from "next/server";
import { getCaseStudiesList } from "@/lib/content/accessors";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { requireMobileContentAccess } from "@/lib/mobile-content";

export async function GET(req: NextRequest) {
  const access = await requireMobileContentAccess(req, "case-studies");
  if (access.error) return access.error;

  const studies = await getCaseStudiesList();
  return NextResponse.json(
    { studies },
    { headers: { "Cache-Control": "no-store" } }
  );
}
