"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CaseStudyCard, CaseStudySection } from "@/data/case-studies";

interface Props {
  card: CaseStudyCard;
  sections: CaseStudySection[] | null;
  userTier: string;
}

function renderParagraph(text: string, i: number) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  const isItalic = text.startsWith("*") && text.endsWith("*") && !text.startsWith("**");
  if (isItalic) {
    return (
      <blockquote key={i} className="border-l-4 border-primary-400 pl-4 my-4 italic text-gray-800 font-serif">
        {text.slice(1, -1)}
      </blockquote>
    );
  }
  if (text.startsWith("▸")) {
    return (
      <p key={i} className="text-sm text-gray-700 leading-relaxed mb-2 pl-3 border-l-2 border-primary-line">
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-semibold text-gray-900">{part}</strong> : part
        )}
      </p>
    );
  }
  return (
    <p key={i} className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
      {parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j} className="font-semibold text-gray-900">{part}</strong> : part
      )}
    </p>
  );
}

export function CaseStudyDetailClient({ card, sections }: Props) {
  return (
    <div className="page-container py-6 sm:py-10">
      <div className="max-w-3xl mx-auto px-0 sm:px-2">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-fg hover:text-primary-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" /> All Case Studies
        </Link>

        <Badge size="sm" className="mb-3">{card.category}</Badge>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
          {card.title}
        </h1>
        <p className="text-base sm:text-lg italic text-muted-fg mb-2 break-words">{card.catchLine}</p>
        <p className="flex items-center gap-1.5 text-sm text-muted-fg mb-6 sm:mb-8">
          <Clock className="w-4 h-4 shrink-0" /> {card.readMinutes} min read
        </p>

        {!sections?.length ? (
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">{card.description}</p>
            <p className="text-sm text-muted-fg">Full breakdown unavailable.</p>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-10">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{card.description}</p>
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-1">
                  {section.label}
                </p>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 break-words">
                  {section.title}
                </h2>
                <div className="rounded-xl sm:rounded-2xl border border-border bg-white p-4 sm:p-6">
                  {section.paragraphs.map((p, i) => renderParagraph(p, i))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
