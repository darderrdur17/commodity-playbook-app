import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CHAPTERS, CHAPTER_CONTENT } from "@/data/playbook";
import { hasAccess } from "@/lib/utils";
import { ChapterClient } from "./chapter-client";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ chapter: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const ch = CHAPTERS.find((c) => c.id === chapter);
  if (!ch) return { title: "Chapter Not Found" };
  return { title: `Chapter ${ch.letter}: ${ch.title}` };
}

export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const chapterData = CHAPTERS.find((c) => c.id === chapter);
  if (!chapterData) notFound();

  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/playbook/${chapter}`);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true },
  });

  if (!user) redirect("/login");

  const isPro = hasAccess(user.tier, "PRO");
  if (!isPro && !chapterData.preview) {
    redirect("/pricing?locked=playbook");
  }

  const content = CHAPTER_CONTENT[chapter] || [
    `## ${chapterData.title}`,
    `This chapter covers ${chapterData.subtitle}. Full content available to Pro and Elite members.`,
    ...chapterData.sections.map(
      (s) => `## ${s.title}\n\nDetailed content for pages ${s.pages} — covering the key concepts, frameworks, and practical applications relevant to commodity trading professionals.`
    ),
  ];

  return (
    <ChapterClient
      chapter={chapterData}
      content={content}
      userTier={user.tier}
      chapters={CHAPTERS}
    />
  );
}
