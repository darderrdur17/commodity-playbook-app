import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Demo1234!";

const DEMO_ACCOUNTS = [
  {
    email: "admin@demo.com",
    name: "Admin User",
    role: "ADMIN" as const,
    tier: "ELITE" as const,
    track: "CAREER" as const,
    persona: "INSIDER" as const,
    mentorCredits: 10,
    resumeCredits: 10,
  },
  {
    email: "starter.fresh@demo.com",
    name: "Maya Tan (Starter)",
    role: "USER" as const,
    tier: "STARTER" as const,
    track: "CAREER" as const,
    persona: "FRESH_GRAD" as const,
    mentorCredits: 0,
    resumeCredits: 0,
  },
  {
    email: "starter.vendor@demo.com",
    name: "Chris Lim (Starter)",
    role: "USER" as const,
    tier: "STARTER" as const,
    track: "SALES" as const,
    persona: "VENDOR" as const,
    mentorCredits: 0,
    resumeCredits: 0,
  },
  {
    email: "pro.switcher@demo.com",
    name: "Sarah Wong (Pro)",
    role: "USER" as const,
    tier: "PRO" as const,
    track: "CAREER" as const,
    persona: "CAREER_SWITCHER" as const,
    mentorCredits: 0,
    resumeCredits: 3,
  },
  {
    email: "pro.analyst@demo.com",
    name: "James Park (Pro)",
    role: "USER" as const,
    tier: "PRO" as const,
    track: "CAREER" as const,
    persona: "ANALYST_TRADER" as const,
    mentorCredits: 0,
    resumeCredits: 2,
    progress: [
      { chapterId: "a", progress: 100, completed: true },
      { chapterId: "b", progress: 45, completed: false },
    ],
  },
  {
    email: "elite.insider@demo.com",
    name: "Priya Sharma (Elite)",
    role: "USER" as const,
    tier: "ELITE" as const,
    track: "CAREER" as const,
    persona: "INSIDER" as const,
    mentorCredits: 3,
    resumeCredits: 5,
    progress: [
      { chapterId: "a", progress: 100, completed: true },
      { chapterId: "b", progress: 100, completed: true },
      { chapterId: "c", progress: 60, completed: false },
    ],
  },
  {
    email: "elite.vendor@demo.com",
    name: "Marcus Lee (Elite)",
    role: "USER" as const,
    tier: "ELITE" as const,
    track: "SALES" as const,
    persona: "VENDOR" as const,
    mentorCredits: 2,
    resumeCredits: 3,
    progress: [
      { chapterId: "a", progress: 100, completed: true },
    ],
  },
  {
    email: "elite.mentor@demo.com",
    name: "Raj Patel (Mentor)",
    role: "USER" as const,
    tier: "ELITE" as const,
    track: "CAREER" as const,
    persona: "INSIDER" as const,
    mentorCredits: 5,
    resumeCredits: 4,
    progress: [
      { chapterId: "a", progress: 100, completed: true },
      { chapterId: "b", progress: 80, completed: false },
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  console.log("🌱 Seeding demo accounts...\n");

  for (const account of DEMO_ACCOUNTS) {
    const { progress, ...userData } = account as typeof account & {
      progress?: { chapterId: string; progress: number; completed: boolean }[];
    };

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        passwordHash,
        role: userData.role,
        tier: userData.tier,
        track: userData.track,
        persona: userData.persona,
        onboardingDone: true,
        mentorCredits: userData.mentorCredits,
        resumeCredits: userData.resumeCredits,
        stripeStatus: userData.tier === "STARTER" ? "inactive" : "active",
      },
      create: {
        email: userData.email,
        name: userData.name,
        passwordHash,
        role: userData.role,
        tier: userData.tier,
        track: userData.track,
        persona: userData.persona,
        onboardingDone: true,
        mentorCredits: userData.mentorCredits,
        resumeCredits: userData.resumeCredits,
        stripeStatus: userData.tier === "STARTER" ? "inactive" : "active",
      },
    });

    if (progress?.length) {
      for (const p of progress) {
        await prisma.chapterProgress.upsert({
          where: { userId_chapterId: { userId: user.id, chapterId: p.chapterId } },
          update: { progress: p.progress, completed: p.completed },
          create: {
            userId: user.id,
            chapterId: p.chapterId,
            progress: p.progress,
            completed: p.completed,
            ...(p.completed && { completedAt: new Date() }),
          },
        });
      }
    }

    console.log(`  ✓ ${userData.email} (${userData.role} · ${userData.tier} · ${userData.persona})`);
  }

  // Sample mentor questions for demo accounts
  const mentorDemo = await prisma.user.findUnique({ where: { email: "elite.mentor@demo.com" } });
  if (mentorDemo) {
    const samples = [
      {
        segment: "physical-trading",
        question:
          "I'm moving from scheduling to a commercial analyst role — how do I demonstrate I understand flat price vs. time spread exposure in interviews?",
        answer:
          "Lead with one cargo example where your scheduling decision changed which month the desk was exposed. Interviewers want proof you know P&L sits in the book, not in the voyage plan.",
        isAnswered: true,
        isPublic: true,
      },
      {
        segment: "analytics",
        question:
          "What's the best way to show market views on a resume when my current role is purely quantitative research?",
        answer: null,
        isAnswered: false,
        isPublic: false,
      },
    ];
    for (const sample of samples) {
      const exists = await prisma.mentorQuestion.findFirst({
        where: { userId: mentorDemo.id, question: sample.question },
      });
      if (!exists) {
        await prisma.mentorQuestion.create({
          data: {
            userId: mentorDemo.id,
            segment: sample.segment,
            question: sample.question,
            answer: sample.answer,
            isAnswered: sample.isAnswered,
            isPublic: sample.isPublic,
            ...(sample.isAnswered && { answeredAt: new Date() }),
          },
        });
      }
    }
    console.log("  ✓ Mentor demo questions seeded");
  }

  const eliteUser = await prisma.user.findUnique({ where: { email: "elite.insider@demo.com" } });
  if (eliteUser) {
    const existing = await prisma.mentorQuestion.findFirst({
      where: { userId: eliteUser.id, question: { contains: "break into physical crude" } },
    });
    if (!existing) {
      await prisma.mentorQuestion.create({
        data: {
          userId: eliteUser.id,
          segment: "physical-trading",
          question:
            "What's the most realistic path to break into physical crude trading from a mid-office role? What skills should I prioritize in the next 6 months?",
          isAnswered: false,
          isPublic: false,
        },
      });
      console.log("  ✓ Sample pending mentor question created");
    }
  }

  // Sample waitlist entry
  await prisma.jobWaitlistEntry.upsert({
    where: { email: "waitlist.demo@example.com" },
    update: {},
    create: {
      email: "waitlist.demo@example.com",
      name: "Demo Waitlist User",
      track: "CAREER",
      gdprOpt: true,
    },
  });
  console.log("  ✓ Sample waitlist entry created");

  const { seedContentModulesIfEmpty } = await import("../src/lib/content/repository");
  const contentResult = await seedContentModulesIfEmpty();
  if (contentResult.seeded) {
    console.log(`  ✓ Seeded ${contentResult.count} content modules`);
  }

  const { seedContentAssetsIfMissing } = await import("./seed-assets");
  const assetResult = await seedContentAssetsIfMissing();
  console.log(
    `  ✓ Content assets: ${assetResult.created} created, ${assetResult.skipped} existing (${assetResult.total} expected)`
  );

  console.log(`\n✅ Done! All accounts use password: ${DEMO_PASSWORD}`);
  console.log("   Try them at http://localhost:3000/demo\n");
}

export async function seedDatabase() {
  await main();
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
