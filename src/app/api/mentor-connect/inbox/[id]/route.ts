import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isMentorDemoUser } from "@/lib/mentor-demo";

const schema = z.object({
  answer: z.string().min(10).max(2000),
  isPublic: z.boolean().optional().default(false),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || !isMentorDemoUser(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const mentorUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true },
  });
  if (!mentorUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.mentorQuestion.findUnique({ where: { id } });
  if (!existing || existing.userId === mentorUser.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.isAnswered) {
    return NextResponse.json({ error: "Already answered" }, { status: 409 });
  }

  const question = await prisma.mentorQuestion.update({
    where: { id },
    data: {
      answer: parsed.data.answer,
      isAnswered: true,
      isPublic: parsed.data.isPublic,
      answeredAt: new Date(),
    },
  });

  return NextResponse.json({
    id: question.id,
    answer: question.answer,
    isAnswered: question.isAnswered,
    isPublic: question.isPublic,
    answeredAt: question.answeredAt?.toISOString() ?? null,
  });
}
