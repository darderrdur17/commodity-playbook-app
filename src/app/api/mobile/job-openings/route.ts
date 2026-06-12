import { NextRequest, NextResponse } from "next/server";
import { getJobOpeningsData } from "@/lib/content/accessors";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { requireMobileContentAccess } from "@/lib/mobile-content";

export async function GET(req: NextRequest) {
  const access = await requireMobileContentAccess(req, "job-openings");
  if (access.error) return access.error;

  const data = await getJobOpeningsData();
  return NextResponse.json(
    {
      jobs: data.jobs,
      filters: { regions: data.regions, levels: data.levels, segments: data.segments },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
