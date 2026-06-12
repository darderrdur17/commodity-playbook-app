"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, FileText, Sparkles } from "lucide-react";
import { TierGate } from "@/components/tier-gate";
import { Reveal } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RESUME_TEMPLATES, PERSONA_QUIZ_QUESTIONS, type ResumeTemplate } from "@/data/resume-templates";
import { PERSONA_LABELS } from "@/lib/utils";

interface Props {
  userTier: string;
  persona: string | null;
  templates?: ResumeTemplate[];
  quiz?: typeof PERSONA_QUIZ_QUESTIONS;
  assetUrls?: Record<string, string>;
  requiredTier?: "PRO" | "ELITE";
}

export function ResumeTemplatesClient({
  userTier,
  persona,
  templates = RESUME_TEMPLATES,
  quiz = PERSONA_QUIZ_QUESTIONS,
  assetUrls = {},
  requiredTier = "PRO",
}: Props) {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const recommended = quizAnswer
    ? templates.find((t) => t.id === quizAnswer)
    : persona
      ? templates.find((t) => t.persona === persona)
      : null;

  return (
    <div className="page-container py-8 sm:py-10">
      <section className="rounded-2xl bg-primary-800 px-6 sm:px-8 py-10 mb-8 relative overflow-hidden">
        <Reveal className="relative z-10">
          <div className="pill pill-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Pro · 5 Templates
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">Resume Templates</h1>
          <p className="text-white/65 text-base sm:text-lg max-w-xl">
            Five persona-specific templates from the Pro Pack — each reframes your background using commodity desk vocabulary, not generic finance language.
          </p>
        </Reveal>
      </section>

      <TierGate requiredTier={requiredTier} userTier={userTier}>
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-serif font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" /> Persona Analysis Quiz
          </h2>
          <p className="text-sm text-muted-fg mb-4">{quiz[0]?.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {quiz[0]?.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setQuizAnswer(opt.value)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  quizAnswer === opt.value
                    ? "border-primary-400 bg-primary-soft font-medium"
                    : "border-border hover:border-primary-line"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {recommended && (
            <p className="text-sm text-primary-800 bg-primary-soft rounded-lg px-4 py-3">
              Recommended template: <strong>{recommended.label}</strong>
              {persona && !quizAnswer && ` (from your profile: ${PERSONA_LABELS[persona] || persona})`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {templates.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl border bg-white p-6 transition-all ${
                recommended?.id === t.id ? "border-primary-400 ring-2 ring-primary-400/20" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <Badge size="sm" className="mb-2">{t.persona.replace(/_/g, " ")}</Badge>
                  <h3 className="font-serif text-xl font-bold text-gray-900">{t.label}</h3>
                  {t.roleBand && <p className="text-xs text-muted-fg mt-1">{t.roleBand}</p>}
                </div>
                <FileText className="w-8 h-8 text-primary-400/40" />
              </div>
              <p className="text-sm text-gray-700 mb-3">{t.positioningChallenge}</p>
              {t.keyMove && (
                <p className="text-xs text-primary-800 bg-primary-soft rounded-lg px-3 py-2 mb-4">{t.keyMove}</p>
              )}
              <a href={assetUrls[t.templateFile] || `/templates/${t.templateFile}`} download>
                <Button className="w-full">
                  <Download className="w-4 h-4" />
                  Download template
                </Button>
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-fg mt-8">
          Need help positioning? See the{" "}
          <Link href="/career-roadmap" className="text-primary-400 hover:underline">Career Roadmap</Link>
          {" "}or{" "}
          <Link href="/interview-questions" className="text-primary-400 hover:underline">Interview Questions</Link>.
        </p>
      </TierGate>
    </div>
  );
}
