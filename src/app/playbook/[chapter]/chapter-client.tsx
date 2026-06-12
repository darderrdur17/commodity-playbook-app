"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedProgress } from "@/components/animations";
import { CHAPTERS, type PlaybookSection } from "@/data/playbook";

interface Props {
  chapter: (typeof CHAPTERS)[number];
  sections: PlaybookSection[];
  chapters: typeof CHAPTERS;
}

export function ChapterClient({ chapter, sections, chapters }: Props) {
  const [readProgress, setReadProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(sections[0]?.id ?? null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: contentRef });

  const chapterIndex = chapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  useEffect(() => {
    const save = async (progress: number) => {
      if (saved) return;
      const completed = progress >= 90;
      try {
        await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chapterId: chapter.id,
            progress: Math.round(progress),
            completed,
          }),
        });
        if (completed) setSaved(true);
      } catch {}
    };

    const unsub = scrollYProgress.on("change", (v) => {
      const pct = Math.round(v * 100);
      setReadProgress(pct);
      if (pct >= 90) save(pct);
    });
    return unsub;
  }, [scrollYProgress, chapter.id, saved]);

  return (
    <div className="relative">
      <motion.div
        className="fixed top-16 left-0 right-0 h-0.5 bg-primary-400 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="page-container py-3 flex items-center justify-between gap-3 sm:gap-4">
          <Link href="/playbook" className="flex items-center gap-1.5 text-sm text-muted-fg hover:text-primary-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Chapters
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-fg hidden sm:block">{readProgress}% read</span>
            <AnimatedProgress value={readProgress} className="w-24 hidden sm:block" />
            {readProgress >= 90 && (
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Complete
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div
          className="rounded-2xl p-8 mb-10 text-white relative overflow-hidden"
          style={{ background: chapter.color }}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-serif font-bold text-xl">
                {chapter.letter}
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest">Chapter {chapter.letter}</p>
                <h1 className="font-serif text-2xl font-bold">{chapter.title}</h1>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-4">{chapter.subtitle}</p>
            <div className="flex items-center gap-4 text-white/60 text-sm flex-wrap">
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {sections.length} sections</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {chapter.readTime}</span>
            </div>
          </div>
        </div>

        <div className="bg-primary-soft border border-primary-line rounded-xl p-5 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-800 mb-3">Key Takeaways</p>
          <ul className="space-y-2">
            {chapter.keyTakeaways.map((kt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-primary-800">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-400" />
                {kt}
              </li>
            ))}
          </ul>
        </div>

        <div ref={contentRef} className="space-y-3">
          {sections.map((section) => {
            const isOpen = openSection === section.id;
            return (
              <div key={section.id} className="rounded-xl border border-border bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="w-full flex items-start gap-3 p-5 text-left hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-mono text-xs text-primary-400 mt-1 flex-shrink-0">{section.number}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-gray-900">{section.title}</p>
                    <p className="text-sm text-muted-fg mt-0.5">{section.desc}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-fg flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 border-t border-border pt-5">
                    <p className="text-gray-900 font-medium italic border-l-4 border-primary-400 pl-4 mb-5">
                      {section.hook}
                    </p>
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="text-gray-700 leading-relaxed mb-4">{p}</p>
                    ))}
                    {section.pullQuote && (
                      <blockquote className="bg-secondary rounded-xl p-5 my-5 border-l-4 border-primary-400">
                        <p className="font-serif text-gray-800 italic">{section.pullQuote}</p>
                      </blockquote>
                    )}
                    {section.wtmfy && (
                      <div className="bg-primary-soft rounded-xl p-5 mt-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary-800 mb-2">What this means for you</p>
                        <p className="text-sm text-primary-900">{section.wtmfy}</p>
                      </div>
                    )}
                    {section.handoff && (
                      <p className="text-sm text-muted-fg mt-5 flex items-center gap-1">
                        <ChevronRight className="w-4 h-4" /> {section.handoff}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-16 pt-8 border-t border-border gap-4 flex-wrap">
          {prevChapter ? (
            <Link href={`/playbook/${prevChapter.id}`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Chapter {prevChapter.letter}
              </Button>
            </Link>
          ) : <div />}
          {nextChapter && (
            <Link href={`/playbook/${nextChapter.id}`}>
              <Button>
                Chapter {nextChapter.letter}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
