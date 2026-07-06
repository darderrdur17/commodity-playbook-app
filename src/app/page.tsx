import { Suspense } from "react";
import { getLandingContent } from "@/lib/content/accessors";
import { LandingPageClient } from "@/components/landing/landing-page-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getLandingContent();
  return (
    <Suspense fallback={null}>
      <LandingPageClient content={content} />
    </Suspense>
  );
}
