import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const questions = await prisma.mentorQuestion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, tier: true } },
    },
  });

  return NextResponse.json(questions);
}
