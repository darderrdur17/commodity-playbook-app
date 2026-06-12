import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JobOpeningsClient } from "./job-openings-client";

export const metadata = { title: "Job Openings" };

export default async function JobOpeningsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/job-openings");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true },
  });
  if (!user) redirect("/login");

  return <JobOpeningsClient userTier={user.tier} />;
}
