import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCaseStudiesList, getContentTierForSlug } from "@/lib/content/accessors";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { CaseStudiesClient } from "./case-studies-client";

export const metadata = { title: "Case Studies" };

export default async function CaseStudiesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/case-studies");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true },
  });

  if (!user) redirect("/login");

  const [studies, requiredTier] = await Promise.all([
    getCaseStudiesList(),
    getContentTierForSlug("case-studies"),
  ]);
  return (
    <CaseStudiesClient
      userTier={user.tier}
      studies={studies}
      requiredTier={requiredTier as "PRO" | "ELITE"}
    />
  );
}
