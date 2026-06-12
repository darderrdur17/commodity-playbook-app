import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  track: z.enum(["CAREER", "SALES"]).optional().default("CAREER"),
  gdprOpt: z.boolean().refine((v) => v, "GDPR consent required"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const existing = await prisma.jobWaitlistEntry.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return NextResponse.json({ message: "Already on the waitlist!" });
  }

  await prisma.jobWaitlistEntry.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      track: parsed.data.track,
      gdprOpt: parsed.data.gdprOpt,
      ...(session?.user?.id && { userId: session.user.id }),
    },
  });

  // Also subscribe to email list
  await prisma.emailSubscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email, name: parsed.data.name, source: "waitlist" },
  });

  return NextResponse.json({ success: true, message: "You're on the list!" }, { status: 201 });
}
