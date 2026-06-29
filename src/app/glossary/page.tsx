import { getGlossaryTerms } from "@/lib/content/accessors";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { auth } from "@/lib/auth";
import { GlossaryClient } from "./glossary-client";

export const metadata = { title: "Desk Glossary" };

export default async function GlossaryPage() {
  const [terms, session] = await Promise.all([getGlossaryTerms(), auth()]);
  return <GlossaryClient terms={terms} persona={session?.user?.persona ?? null} />;
}
