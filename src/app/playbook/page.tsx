import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getContentTierForSlug, getPlaybookChapters } from "@/lib/content/accessors";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { PlaybookHubClient } from "./playbook-hub-client";

export const metadata = { title: "Full Playbook" };

export default async function PlaybookPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/playbook");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { progress: true },
  });

  if (!user) redirect("/login");

  const [chapters, requiredTier] = await Promise.all([
    getPlaybookChapters(),
    getContentTierForSlug("playbook"),
  ]);

  return (
    <PlaybookHubClient
      chapters={chapters}
      userTier={user.tier}
      requiredTier={requiredTier as "PRO" | "ELITE"}
      progress={user.progress.map((p) => ({
        chapterId: p.chapterId,
        progress: p.progress,
        completed: p.completed,
      }))}
    />
  );
}
