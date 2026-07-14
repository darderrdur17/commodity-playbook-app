import { getGlossaryTerms } from "@/lib/content/accessors";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GlossaryClient } from "./glossary-client";

export const metadata = { title: "Desk Glossary" };

export default async function GlossaryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signup?plan=starter&callbackUrl=/glossary");
  }

  const [terms] = await Promise.all([getGlossaryTerms()]);
  return <GlossaryClient terms={terms} persona={session.user.persona ?? null} />;
}
