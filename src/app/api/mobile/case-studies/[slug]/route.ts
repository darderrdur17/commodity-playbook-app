import { NextRequest, NextResponse } from "next/server";
import { getCaseStudyBySlug } from "@/lib/content/accessors";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { requireMobileContentAccess } from "@/lib/mobile-content";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const access = await requireMobileContentAccess(req, "case-studies");
  if (access.error) return access.error;

  const { slug } = await params;
  const data = await getCaseStudyBySlug(slug);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(
    { card: data.card, sections: data.sections },
    { headers: { "Cache-Control": "no-store" } }
  );
}
