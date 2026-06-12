import { getGlossaryTerms } from "@/lib/content/accessors";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { GlossaryClient } from "./glossary-client";

export const metadata = { title: "Desk Glossary" };

export default async function GlossaryPage() {
  const terms = await getGlossaryTerms();
  return <GlossaryClient terms={terms} />;
}
