"use client";

import { SectionCategoryLabel } from "@/components/landing/section-category-label";
import { CaseStudiesPreview } from "@/components/landing/case-studies-preview";
import type { LandingContent } from "@/data/landing-content";

interface Props {
  content: LandingContent["caseStudySample"];
}

/** Case Studies intro + preview cards — sits directly below What We Cover on career track */
export function CaseStudiesSection({ content }: Props) {
  return (
    <section className="py-16 sm:py-24 bg-white page-container">
      <div className="text-center mb-12 sm:mb-14 max-w-3xl mx-auto">
        <SectionCategoryLabel colorClass="text-primary-400">
          {content.eyebrow}
        </SectionCategoryLabel>
        <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4 leading-[1.1]">
          {content.title}{" "}
          <span className="text-primary-400 italic">{content.titleAccent}</span>
        </h2>
        <p className="text-muted-fg text-base sm:text-lg leading-relaxed">
          {content.description}
        </p>
      </div>

      <CaseStudiesPreview
        cards={content.cards}
        categoryTags={content.categoryTags}
        disclaimer={content.disclaimer}
        viewMoreHref={content.viewMoreHref}
      />
    </section>
  );
}
