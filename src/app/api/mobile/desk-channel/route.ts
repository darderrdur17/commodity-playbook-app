import { NextRequest, NextResponse } from "next/server";
import { DESK_CATEGORIES, DESK_QA } from "@/data/desk-channel";
import { getMobileUser, hasTierAccess } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  const user = await getMobileUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasTierAccess(user.tier, "ELITE")) {
    return NextResponse.json({ error: "Elite membership required" }, { status: 403 });
  }

  return NextResponse.json({ categories: DESK_CATEGORIES, questions: DESK_QA });
}
