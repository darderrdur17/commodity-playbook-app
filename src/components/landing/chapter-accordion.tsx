"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChapterCoverage } from "@/data/landing-content";

interface ChapterAccordionProps {
  chapters: ChapterCoverage[];
}

function ChapterAccordionItem({
  chapter,
  isOpen,
  onToggle,
}: {
  chapter: ChapterCoverage;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden hover:border-primary-300 transition-colors self-start w-full min-w-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-3.5 px-4 sm:px-5 py-4 text-left hover:bg-secondary/60 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-800 text-white font-serif font-bold text-base sm:text-lg flex items-center justify-center shrink-0">
          {chapter.letter}
        </span>
        <span className="flex-1 min-w-0 pt-1.5">
          <span className="block font-serif font-semibold text-gray-900 text-sm sm:text-base">
            {chapter.title}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-fg shrink-0 mt-2 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pl-[3.75rem] sm:pl-[4.25rem] border-t border-border/60">
          <p className="text-sm text-muted-fg leading-relaxed pt-3">{chapter.desc}</p>
        </div>
      )}
    </div>
  );
}

export function ChapterAccordion({ chapters }: ChapterAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {chapters.map((chapter, index) => (
        <ChapterAccordionItem
          key={chapter.letter}
          chapter={chapter}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
