import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { notifyMentorPoolNewQuestion } from "@/lib/mentor-questions";

const schema = z.object({
  segment: z.enum(["physical-trading", "finance", "analytics", "operations", "sales"]),
  question: z.string().min(20, "Question must be at least 20 characters").max(500),
  isPublic: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true, mentorCredits: true },
  });

  if (!user || user.tier !== "ELITE") {
    return NextResponse.json({ error: "Elite membership required" }, { status: 403 });
  }

  if (user.mentorCredits < 1) {
    return NextResponse.json({ error: "No mentor credits remaining" }, { status: 402 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  // Deduct credit and create question atomically
  const [, question] = await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { mentorCredits: { decrement: 1 } },
    }),
    prisma.mentorQuestion.create({
      data: {
        userId: session.user.id,
        segment: parsed.data.segment,
        question: parsed.data.question,
        isPublic: parsed.data.isPublic,
      },
    }),
  ]);

  // Notify mentor pool (email) — non-blocking for member submit
  notifyMentorPoolNewQuestion(question.id).catch((err) =>
    console.error("[mentor-connect] mentor pool notify failed", err)
  );

  return NextResponse.json({ id: question.id, success: true }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const questions = await prisma.mentorQuestion.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(questions);
}
