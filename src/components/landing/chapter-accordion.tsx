"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChapterCoverage } from "@/data/landing-content";

interface ChapterAccordionProps {
  chapters: ChapterCoverage[];
}

export function ChapterAccordion({ chapters }: ChapterAccordionProps) {
  const [openLetter, setOpenLetter] = useState<string | null>(chapters[0]?.letter ?? null);

  return (
    <div className="max-w-3xl mx-auto divide-y divide-border rounded-xl border border-border bg-white overflow-hidden">
      {chapters.map((ch) => {
        const isOpen = openLetter === ch.letter;
        return (
          <div key={ch.letter}>
            <button
              type="button"
              onClick={() => setOpenLetter(isOpen ? null : ch.letter)}
              className="w-full flex items-center gap-4 px-4 sm:px-5 py-4 text-left hover:bg-secondary/60 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-800 text-white font-serif font-bold text-base sm:text-lg flex items-center justify-center shrink-0">
                {ch.letter}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-serif font-semibold text-gray-900 text-sm sm:text-base">
                  {ch.title}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-fg shrink-0 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pl-[4.25rem] sm:pl-[4.75rem]">
                <p className="text-sm text-muted-fg leading-relaxed">{ch.desc}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
