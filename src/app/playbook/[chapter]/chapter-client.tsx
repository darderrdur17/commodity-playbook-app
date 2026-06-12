"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedProgress } from "@/components/animations";
import { CHAPTERS } from "@/data/playbook";

interface Props {
  chapter: typeof CHAPTERS[0];
  content: string[];
  userTier: string;
  chapters: typeof CHAPTERS;
}

export function ChapterClient({ chapter, content, chapters }: Props) {
  const [readProgress, setReadProgress] = useState(0);
  const [saved, setSaved] = useState(false);
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

  function renderContent(text: string, idx: number) {
    if (text.startsWith("## ")) {
      return (
        <h2 key={idx} className="font-serif text-2xl font-bold text-gray-900 mt-10 mb-4">
          {text.slice(3)}
        </h2>
      );
    }
    if (text.startsWith("**") && text.endsWith("**")) {
      return (
        <p key={idx} className="font-semibold text-gray-900 mt-4 mb-2">
          {text.slice(2, -2)}
        </p>
      );
    }
    // Handle bold inline text
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={idx} className="text-gray-700 leading-relaxed mb-4">
        {parts.map((part, i) =>
          i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{part}</strong> : part
        )}
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-16 left-0 right-0 h-0.5 bg-primary-400 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Sticky chapter header */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[900px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
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

      <div className="max-w-[900px] mx-auto px-6 py-10">
        {/* Chapter hero */}
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
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {chapter.pages} pages</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {chapter.readTime}</span>
            </div>
          </div>
        </div>

        {/* Table of contents */}
        <div className="bg-secondary rounded-xl p-5 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-3">Contents</p>
          <div className="space-y-1.5">
            {chapter.sections.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="font-mono text-xs text-primary-400">{s.pages}</span>
                <ChevronRight className="w-3 h-3 text-muted-fg" />
                {s.title}
              </div>
            ))}
          </div>
        </div>

        {/* Key takeaways */}
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

        {/* Chapter content */}
        <div ref={contentRef} className="prose max-w-none">
          {content.map((block, i) => renderContent(block, i))}
        </div>

        {/* Chapter navigation */}
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
          {prevChapter ? (
            <Link href={`/playbook/${prevChapter.id}`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Chapter {prevChapter.letter}: {prevChapter.title}
              </Button>
            </Link>
          ) : <div />}
          {nextChapter && (
            <Link href={`/playbook/${nextChapter.id}`}>
              <Button>
                Chapter {nextChapter.letter}: {nextChapter.title}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
