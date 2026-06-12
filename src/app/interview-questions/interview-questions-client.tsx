"use client";

import React, { useMemo, useState } from "react";
import { Search, ChevronDown, MessageSquare, Lightbulb } from "lucide-react";
import { TierGate } from "@/components/tier-gate";
import { Reveal } from "@/components/animations";
import { INTERVIEW_QUESTIONS, INTERVIEW_CATEGORIES, type InterviewQuestion } from "@/data/interview-questions";

interface Props {
  userTier: string;
  questions?: InterviewQuestion[];
  categories?: string[];
  requiredTier?: "PRO" | "ELITE";
}

export function InterviewQuestionsClient({
  userTier,
  questions = INTERVIEW_QUESTIONS,
  categories = INTERVIEW_CATEGORIES,
  requiredTier = "PRO",
}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchCat = category === "All" || q.category === category;
      const matchSearch =
        !search ||
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.modelAnswer.toLowerCase().includes(search.toLowerCase()) ||
        q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [search, category, questions]);

  return (
    <div className="page-container py-8 sm:py-10">
      <section className="rounded-2xl bg-primary-800 px-6 sm:px-8 py-10 mb-8 relative overflow-hidden">
        <Reveal className="relative z-10">
          <div className="pill pill-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Pro · 50 Q&amp;As
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">Interview Questions</h1>
          <p className="text-white/65 text-base sm:text-lg max-w-xl mb-6">
            Desk interview prep — 40 practitioner Q&amp;As from the Desk Channel plus 10 foundational questions from the Playbook.
          </p>
          <div className="relative max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search questions, answers, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/25 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </Reveal>
      </section>

      <TierGate requiredTier={requiredTier} userTier={userTier}>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                category === cat
                  ? "bg-primary-400 text-white border-primary-400"
                  : "bg-white text-gray-700 border-border hover:border-primary-line"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-fg mb-4">{filtered.length} of {questions.length} questions</p>

        <div className="space-y-3">
          {filtered.map((q) => {
            const isOpen = openId === q.id;
            return (
              <div key={q.id} className="rounded-xl border border-border bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : q.id)}
                  className="w-full flex items-start gap-3 p-5 text-left hover:bg-secondary/40 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-fg mb-1">{q.category}</p>
                    <p className="font-medium text-gray-900">{q.question}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {q.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-fg">{t}</span>
                      ))}
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-fg flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-border pt-4 ml-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-2">Model answer</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{q.modelAnswer}</p>
                    {q.interviewTip && (
                      <div className="mt-4 flex gap-2 text-sm bg-amber-50 text-amber-900 rounded-lg p-3">
                        <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span><strong>Desk signal:</strong> {q.interviewTip}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </TierGate>
    </div>
  );
}
