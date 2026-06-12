import { NextRequest, NextResponse } from "next/server";
import { JOB_OPENINGS, JOB_REGIONS, JOB_LEVELS, JOB_SEGMENTS } from "@/data/job-openings";
import { getMobileUser, hasTierAccess } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  const user = await getMobileUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasTierAccess(user.tier, "ELITE")) {
    return NextResponse.json({ error: "Elite membership required" }, { status: 403 });
  }

  return NextResponse.json({
    jobs: JOB_OPENINGS,
    filters: { regions: JOB_REGIONS, levels: JOB_LEVELS, segments: JOB_SEGMENTS },
  });
}
