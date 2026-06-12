import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CareerRoadmapClient } from "./career-roadmap-client";

export const metadata = { title: "Career Roadmap" };

export default async function CareerRoadmapPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/career-roadmap");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true, persona: true },
  });

  if (!user) redirect("/login");

  return <CareerRoadmapClient userTier={user.tier} persona={user.persona} />;
}
