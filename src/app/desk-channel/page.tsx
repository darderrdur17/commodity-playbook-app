import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DeskChannelClient } from "./desk-channel-client";

export const metadata = { title: "Desk Channel" };

export default async function DeskChannelPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/desk-channel");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true },
  });
  if (!user) redirect("/login");

  return <DeskChannelClient userTier={user.tier} />;
}
