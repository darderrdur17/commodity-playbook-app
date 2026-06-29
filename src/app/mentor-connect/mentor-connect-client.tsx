"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, MessageSquare, Clock, CheckCircle, Send, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TierGate } from "@/components/tier-gate";
import { Reveal } from "@/components/animations";
import { formatDate } from "@/lib/utils";
import { MENTOR_SEGMENTS, MENTOR_COUNT, type MentorProfile } from "@/data/mentors";

const SEGMENT_API_MAP: Record<string, string> = {
  "physical-paper": "physical-trading",
  "shipping-logistics": "operations",
  "risk-management": "finance",
  "market-intelligence": "analytics",
  "tools": "sales",
};

const SEGMENTS = [
  { value: "physical-trading", label: "Physical Trading", desc: "Price discovery, cargo logistics, arbitrage" },
  { value: "finance", label: "Finance & Risk", desc: "P&L, hedging, credit, derivatives" },
  { value: "analytics", label: "Market Analytics", desc: "Forecasting, data analysis, market intelligence" },
  { value: "operations", label: "Operations", desc: "Logistics, settlements, documentation" },
  { value: "sales", label: "Commercial / Sales", desc: "Origination, counterparty relationships, B2B" },
];

interface Question {
  id: string;
  segment: string;
  question: string;
  answer: string | null;
  isAnswered: boolean;
  createdAt: string;
  answeredAt?: string;
}

interface Props {
  userTier: string;
  mentorCredits: number;
  questions: Question[];
}

export function MentorConnectClient({ userTier, mentorCredits, questions }: Props) {
  const [segment, setSegment] = useState("");
  const [question, setQuestion] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<(MentorProfile & { segmentId: string; segmentTitle: string }) | null>(null);

  const isElite = userTier === "ELITE";

  function openMentor(mentor: MentorProfile, segmentId: string, segmentTitle: string) {
    setSelectedMentor({ ...mentor, segmentId, segmentTitle });
    setSegment(SEGMENT_API_MAP[segmentId] || segmentId);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!segment || question.length < 20) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/mentor-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment, question, isPublic }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      } else {
        setSubmitted(true);
        setQuestion("");
        setSegment("");
        setSelectedMentor(null);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container py-8 sm:py-10">
      <section className="rounded-2xl bg-primary-800 px-8 py-12 mb-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3280ff 0%, transparent 70%)" }} />
        <Reveal className="relative z-10">
          <div className="pill pill-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Elite · Mentor Connect
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-3">
            One Question. <span className="text-accent italic">One Honest Answer.</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mb-6">
            Anonymous access to {MENTOR_COUNT} vetted practitioners across 5 commodity trading segments. Browse mentors, pick the closest match, and submit one question per month.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="glass-card px-4 py-2.5 text-white text-sm font-semibold">
              {isElite ? `${mentorCredits} credits remaining` : "Elite only"}
            </div>
            <div className="glass-card px-4 py-2.5 text-white text-sm font-semibold">{MENTOR_COUNT} Practitioners</div>
            <div className="glass-card px-4 py-2.5 text-white text-sm font-semibold">5 Segments</div>
          </div>
        </Reveal>
      </section>

      <TierGate requiredTier="ELITE" userTier={userTier}>
        {/* Mentor grid */}
        <section className="mb-12">
          <Reveal className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-800 mb-2">Browse mentors</p>
            <h2 className="font-serif text-2xl font-bold text-gray-900">25 Practitioners. Five Segments.</h2>
          </Reveal>
          <div className="space-y-10">
            {MENTOR_SEGMENTS.map((seg) => (
              <div key={seg.id}>
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary-800">{seg.num} · {seg.title}</p>
                  <p className="text-sm text-muted-fg">{seg.blurb}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {seg.mentors.map((mentor) => (
                    <button
                      key={mentor.id}
                      type="button"
                      onClick={() => openMentor(mentor, seg.id, seg.title)}
                      className={`text-left rounded-xl border bg-white p-4 h-full transition-all hover:-translate-y-1 hover:border-primary-line hover:shadow-md ${
                        selectedMentor?.id === mentor.id ? "border-primary-400 ring-2 ring-primary-400/20" : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary-soft border border-primary-line flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary-800" />
                        </div>
                        <span className="text-[10px] font-semibold text-muted-fg uppercase tracking-wider">{mentor.years} yrs</span>
                      </div>
                      <p className="text-[10px] font-bold text-primary-800 tracking-wider mb-1">{mentor.id}</p>
                      <h3 className="font-serif font-bold text-sm text-gray-900 mb-2 leading-snug">{mentor.headline}</h3>
                      <p className="text-xs text-muted-fg line-clamp-3 mb-3">{mentor.bio}</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-fg">{tag}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Selected mentor preview */}
        <AnimatePresence>
          {selectedMentor && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-8 rounded-xl border border-primary-line bg-primary-soft p-5 flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-800 mb-1">Selected mentor</p>
                <h3 className="font-serif font-bold text-gray-900">{selectedMentor.headline}</h3>
                <p className="text-sm text-muted-fg mt-1 italic">&ldquo;{selectedMentor.sampleReply.slice(0, 180)}…&rdquo;</p>
              </div>
              <button type="button" onClick={() => setSelectedMentor(null)} className="text-muted-fg hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border p-7">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-400" />
                Ask a Mentor
              </h2>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Question sent!</h3>
                  <p className="text-muted-fg text-sm mb-5">
                    Your question has been anonymously routed to a practitioner in that segment.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>Ask another question</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Which segment?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SEGMENTS.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setSegment(s.value)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            segment === s.value ? "border-primary-400 bg-primary-soft" : "border-border hover:border-primary-line"
                          }`}
                        >
                          <p className="font-semibold text-sm text-gray-900">{s.label}</p>
                          <p className="text-xs text-muted-fg">{s.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Your question <span className="text-muted-fg font-normal">(min. 20 characters)</span>
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Be specific — give context, name the commodity or function, ask the question only they can answer."
                      className="w-full h-32 px-3 py-2.5 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                    <p className={`text-xs mt-1 ${question.length >= 20 ? "text-green-600" : "text-muted-fg"}`}>
                      {question.length}/500 characters
                    </p>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="rounded accent-primary-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Allow anonymous sharing</p>
                      <p className="text-xs text-muted-fg">Share your Q&A so others can benefit</p>
                    </div>
                  </label>

                  {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

                  <Button type="submit" className="w-full" size="lg" loading={submitting} disabled={!segment || question.length < 20 || mentorCredits < 1}>
                    <Send className="w-4 h-4" />
                    Send to Mentor (1 credit)
                  </Button>
                  {mentorCredits < 1 && (
                    <p className="text-xs text-center text-muted-fg">No credits remaining. Credits refresh monthly.</p>
                  )}
                </form>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-fg" /> My Questions
            </h2>
            {questions.length === 0 ? (
              <div className="bg-white rounded-xl border border-border p-6 text-center">
                <Users className="w-8 h-8 text-muted-fg mx-auto mb-3" />
                <p className="text-sm text-muted-fg">No questions yet. Pick a mentor and ask your first question.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q) => (
                  <div key={q.id} className="bg-white rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant={q.isAnswered ? "success" : "secondary"} size="sm">
                        {q.isAnswered ? "Answered" : "Pending"}
                      </Badge>
                      <span className="text-xs text-muted-fg">{formatDate(q.createdAt)}</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-1">
                      {SEGMENTS.find((s) => s.value === q.segment)?.label}
                    </p>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{q.question}</p>
                    {q.isAnswered && q.answer && (
                      <div className="bg-primary-soft border border-primary-line rounded-lg p-3 mt-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-primary-800 mb-1">Answer</p>
                        <p className="text-sm text-primary-800">{q.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </TierGate>
    </div>
  );
}
