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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {chapters.map((ch) => {
        const isOpen = openLetter === ch.letter;
        return (
          <div
            key={ch.letter}
            className="rounded-xl border border-border bg-white overflow-hidden hover:border-primary-300 transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenLetter(isOpen ? null : ch.letter)}
              className="w-full flex items-start gap-3.5 px-4 sm:px-5 py-4 text-left hover:bg-secondary/60 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-800 text-white font-serif font-bold text-base sm:text-lg flex items-center justify-center shrink-0">
                {ch.letter}
              </span>
              <span className="flex-1 min-w-0 pt-1.5">
                <span className="block font-serif font-semibold text-gray-900 text-sm sm:text-base">
                  {ch.title}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-fg shrink-0 mt-2 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pl-[3.75rem] sm:pl-[4.25rem]">
                <p className="text-sm text-muted-fg leading-relaxed">{ch.desc}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
