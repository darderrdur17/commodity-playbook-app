"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Download, FileText, Sparkles, ArrowLeft, ArrowRight, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { TierGate } from "@/components/tier-gate";
import { Reveal } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RESUME_TEMPLATES,
  PERSONA_QUIZ_STEPS,
  INDUSTRY_MAP,
  type ResumeTemplate,
  type PersonaQuizStep,
  type IndustryMapZone,
} from "@/data/resume-templates";
import { PERSONA_ARCHETYPES } from "@/data/persona-archetypes";
import { scorePersonaQuiz, type PersonaId } from "@/lib/persona-quiz";
import { personaIdToApi } from "@/lib/persona-map";
import { PERSONA_LABELS } from "@/lib/utils";

interface Props {
  userTier: string;
  persona: string | null;
  templates?: ResumeTemplate[];
  quizSteps?: PersonaQuizStep[];
  industryMap?: IndustryMapZone[];
  assetUrls?: Record<string, string>;
  requiredTier?: "PRO" | "ELITE";
}

export function ResumeTemplatesClient({
  userTier,
  persona,
  templates = RESUME_TEMPLATES,
  quizSteps = PERSONA_QUIZ_STEPS,
  industryMap = INDUSTRY_MAP,
  assetUrls = {},
  requiredTier = "PRO",
}: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const savedPersonaRef = useRef<PersonaId | null>(null);
  const { data: session, update: updateSession } = useSession();

  const scoreResult = useMemo(
    () =>
      scorePersonaQuiz({
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5,
      }),
    [answers]
  );

  const recommendedId = useMemo((): PersonaId | null => {
    if (quizComplete && Object.keys(answers).length >= 4) {
      return scoreResult.personaId;
    }
    if (persona) {
      const map: Record<string, PersonaId> = {
        CAREER_SWITCHER: "switcher",
        INSIDER: "insider",
        ANALYST_TRADER: "analyst",
        VENDOR: "vendor",
        FRESH_GRAD: "fresh_grad",
      };
      return map[persona] ?? null;
    }
    return null;
  }, [quizComplete, answers, scoreResult.personaId, persona]);

  const archetype = recommendedId ? PERSONA_ARCHETYPES[recommendedId] : null;
  const recommended = recommendedId ? templates.find((t) => t.id === recommendedId) : null;

  const currentStep = quizSteps[step];
  const canNext = currentStep && answers[currentStep.id];

  function selectOption(stepId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
  }

  function nextStep() {
    if (step < quizSteps.length - 1) setStep(step + 1);
    else setQuizComplete(true);
  }

  function prevStep() {
    if (quizComplete) setQuizComplete(false);
    else if (step > 0) setStep(step - 1);
  }

  function retakeQuiz() {
    setQuizComplete(false);
    setStep(0);
    setAnswers({});
    setSaveStatus("idle");
    savedPersonaRef.current = null;
  }

  const progressPct = quizComplete ? 100 : Math.round(((step + 1) / quizSteps.length) * 100);

  const templateDownloadUrl =
    recommended &&
    (assetUrls[archetype?.templateFile ?? ""] ||
      assetUrls[`resume-templates/${recommended.templateFile}`] ||
      `/templates/${recommended.templateFile}`);

  const downloadHref =
    typeof templateDownloadUrl === "string" ? templateDownloadUrl : `/templates/${recommended?.templateFile ?? ""}`;

  useEffect(() => {
    if (!quizComplete || !recommendedId) return;
    if (savedPersonaRef.current === recommendedId) return;

    const personaToSave = recommendedId;
    savedPersonaRef.current = personaToSave;

    async function persistPersona() {
      setSaveStatus("saving");
      const track = (session?.user as { track?: string } | undefined)?.track ?? "CAREER";
      try {
        const res = await fetch("/api/user/persona", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona: personaIdToApi(personaToSave),
            track,
          }),
        });
        if (!res.ok) throw new Error("Save failed");
        await updateSession();
        setSaveStatus("saved");
      } catch {
        savedPersonaRef.current = null;
        setSaveStatus("error");
      }
    }

    persistPersona();
  }, [quizComplete, recommendedId, session?.user, updateSession]);

  return (
    <div className="page-container py-8 sm:py-10">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-fg hover:text-primary-400 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <section className="rounded-2xl bg-primary-800 px-6 sm:px-8 py-10 mb-8 relative overflow-hidden">
        <Reveal className="relative z-10">
          <div className="pill pill-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Pro · Tailored Templates
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            Your Resume, <span className="text-accent italic">Positioned Right.</span>
          </h1>
          <p className="text-white/65 text-base sm:text-lg max-w-xl">
            Five archetype-specific templates built for how the commodity trading industry actually reads a CV. Take the 5-step quiz to find your archetype — then download the template built for your exact positioning challenge.
          </p>
        </Reveal>
      </section>

      <TierGate requiredTier={requiredTier} userTier={userTier}>
        {/* 5-step quiz */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-10">
          <div className="bg-primary-800 px-6 py-5 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <div>
              <p className="font-serif font-bold text-white">Persona Analysis Quiz</p>
              <p className="text-white/60 text-xs">5 questions · weighted scoring · find your archetype</p>
            </div>
          </div>
          <div className="h-1 bg-secondary">
            <div className="h-full bg-primary-400 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="p-6 sm:p-8">
            {quizComplete && archetype && recommended ? (
              <div className="max-w-2xl mx-auto">
                <div className={`rounded-2xl border border-border p-6 sm:p-8 ${archetype.bgClass}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary-800 mb-3">
                    Your archetype · {scoreResult.confidence}% match
                  </p>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl" aria-hidden>
                      {archetype.emoji}
                    </span>
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">{archetype.name}</h2>
                      <p className="text-sm font-semibold mt-1" style={{ color: archetype.color }}>
                        {archetype.label}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{archetype.desc}</p>
                  <div className="rounded-xl bg-white/80 border border-border p-4 mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-fg mb-2">Industry position</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{archetype.industryPosition}</p>
                  </div>
                  <div className="rounded-xl bg-primary-800 text-white p-4 mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">Key move</p>
                    <p className="text-sm leading-relaxed">{archetype.keyMove}</p>
                  </div>
                  {(scoreResult.marketFocus || scoreResult.entryTrack) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {scoreResult.marketFocus && (
                        <Badge variant="outline" size="sm">
                          Market focus: {scoreResult.marketFocus}
                        </Badge>
                      )}
                      {scoreResult.entryTrack && (
                        <Badge variant="outline" size="sm">
                          Entry track: {scoreResult.entryTrack}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href={downloadHref} download className="flex-1">
                      <Button className="w-full">
                        <Download className="w-4 h-4" />
                        Download {archetype.name} template
                      </Button>
                    </a>
                    <Button variant="outline" onClick={retakeQuiz} className="flex-1">
                      Retake quiz
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-fg text-center mt-4">
                  Template file: {archetype.templateFile}
                </p>
                {saveStatus === "saving" && (
                  <p className="text-xs text-muted-fg text-center mt-2">Saving persona to your profile…</p>
                )}
                {saveStatus === "saved" && (
                  <p className="text-xs text-teal-700 text-center mt-2 flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved to your profile — synced across devices
                  </p>
                )}
                {saveStatus === "error" && (
                  <p className="text-xs text-red-600 text-center mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Could not save persona. Try again after signing in.
                  </p>
                )}
              </div>
            ) : currentStep ? (
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-800 mb-2">
                  Question {step + 1} of {quizSteps.length}
                </p>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-1">{currentStep.question}</h2>
                <p className="text-sm text-muted-fg mb-6">{currentStep.sub}</p>
                <div className="space-y-2 mb-8">
                  {currentStep.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => selectOption(currentStep.id, opt.value)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                        answers[currentStep.id] === opt.value
                          ? "border-primary-400 bg-primary-soft"
                          : "border-border hover:border-primary-line"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                      {opt.sub && <p className="text-xs text-muted-fg mt-0.5">{opt.sub}</p>}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 0}
                    className="inline-flex items-center gap-1 text-sm text-muted-fg disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <Button onClick={nextStep} disabled={!canNext}>
                    {step === quizSteps.length - 1 ? "See result" : "Next"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Industry map */}
        {industryMap.length > 0 && (
          <section className="mb-10">
            <Reveal className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-800 mb-2">Step 2 — Understand the Landscape</p>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Where Does Your Role Sit?</h2>
              <p className="text-muted-fg text-sm max-w-2xl">
                Commodity trading is not one function — it is a set of closely connected roles across four zones. Your quiz answers map you toward one of these entry paths.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {industryMap.map((zone) => (
                <div key={zone.zone} className="rounded-xl border border-border bg-white overflow-hidden">
                  <div className="px-4 py-3 text-white" style={{ background: zone.color }}>
                    <p className="text-[10px] uppercase tracking-widest opacity-70">Zone {zone.zone}</p>
                    <p className="font-serif font-bold">{zone.title}</p>
                  </div>
                  <ul className="p-4 space-y-2">
                    {zone.roles.map((role) => (
                      <li key={role.name} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: zone.color }} />
                        <span>
                          {role.name}
                          {role.tag && (
                            <span className="ml-1.5 text-[10px] font-semibold text-primary-800 bg-primary-soft px-1.5 py-0.5 rounded">
                              {role.tag}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {templates.map((t) => {
            const arch = PERSONA_ARCHETYPES[t.id as PersonaId];
            const isRecommended = recommended?.id === t.id;
            return (
              <div
                key={t.id}
                className={`rounded-2xl border bg-white p-6 transition-all ${
                  isRecommended ? "border-primary-400 ring-2 ring-primary-400/20" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    {isRecommended && (
                      <Badge size="sm" className="mb-2 bg-accent text-primary-900">
                        Recommended for you
                      </Badge>
                    )}
                    <Badge size="sm" className="mb-2">
                      {t.persona.replace(/_/g, " ")}
                    </Badge>
                    <h3 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                      {arch?.emoji && <span aria-hidden>{arch.emoji}</span>}
                      {t.label}
                    </h3>
                    {t.roleBand && <p className="text-xs text-muted-fg mt-1">{t.roleBand}</p>}
                  </div>
                  <FileText className="w-8 h-8 text-primary-400/40" />
                </div>
                <p className="text-sm text-gray-700 mb-3">{arch?.desc ?? t.positioningChallenge}</p>
                {(arch?.keyMove || t.keyMove) && (
                  <p className="text-xs text-primary-800 bg-primary-soft rounded-lg px-3 py-2 mb-4">
                    {arch?.keyMove ?? t.keyMove}
                  </p>
                )}
                <a
                  href={
                    assetUrls[arch?.templateFile ?? ""] ||
                    assetUrls[`resume-templates/${t.templateFile}`] ||
                    `/templates/${t.templateFile}`
                  }
                  download
                >
                  <Button className="w-full" variant={isRecommended ? "default" : "outline"}>
                    <Download className="w-4 h-4" />
                    Download template
                  </Button>
                </a>
              </div>
            );
          })}
        </div>

        {!quizComplete && persona && (
          <p className="text-sm text-muted-fg mt-6 text-center">
            Profile hint: {PERSONA_LABELS[persona]?.label || persona}
          </p>
        )}
      </TierGate>
    </div>
  );
}
