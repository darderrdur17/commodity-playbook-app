"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Inbox, Clock, CheckCircle, MessageSquare, Send, User, Filter,
  ArrowLeft, Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/animations";
import { formatDate, PERSONA_LABELS, TIER_LABELS } from "@/lib/utils";
import { MENTOR_SEGMENT_LABELS } from "@/lib/mentor-demo";

type FilterTab = "all" | "pending" | "answered";

interface MemberInfo {
  id: string;
  tier: string;
  track: string;
  persona: string | null;
}

interface MentorRequest {
  id: string;
  segment: string;
  question: string;
  answer: string | null;
  isAnswered: boolean;
  isPublic: boolean;
  createdAt: string;
  answeredAt: string | null;
  member: MemberInfo;
}

interface InboxStats {
  pending: number;
  answered: number;
  total: number;
}

interface Props {
  mentorName: string;
  initialRequests: MentorRequest[];
  initialStats: InboxStats;
}

export function MentorInboxClient({ mentorName, initialRequests, initialStats }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [stats, setStats] = useState(initialStats);
  const [filter, setFilter] = useState<FilterTab>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialRequests.find((r) => !r.isAnswered)?.id ?? initialRequests[0]?.id ?? null
  );
  const [answer, setAnswer] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    if (filter === "pending") return requests.filter((r) => !r.isAnswered);
    if (filter === "answered") return requests.filter((r) => r.isAnswered);
    return requests;
  }, [requests, filter]);

  const selected = requests.find((r) => r.id === selectedId) ?? null;

  async function handleAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || answer.length < 10) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/mentor-connect/inbox/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, isPublic }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send answer");
        return;
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === selected.id
            ? {
                ...r,
                answer: data.answer,
                isAnswered: true,
                isPublic: data.isPublic,
                answeredAt: data.answeredAt,
              }
            : r
        )
      );
      setStats((s) => ({
        ...s,
        pending: Math.max(0, s.pending - 1),
        answered: s.answered + 1,
      }));
      setAnswer("");
      setIsPublic(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function selectRequest(id: string) {
    setSelectedId(id);
    setAnswer("");
    setError("");
    setIsPublic(false);
  }

  return (
    <div className="page-container py-8 sm:py-10">
      <section className="rounded-2xl bg-primary-800 px-6 sm:px-8 py-10 sm:py-12 mb-8 relative overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #3280ff 0%, transparent 70%)" }}
        />
        <Reveal className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="pill pill-dark mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Mentor Connect · Practitioner Inbox
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
                Member <span className="text-accent italic">Requests</span>
              </h1>
              <p className="text-white/65 text-base max-w-xl">
                Signed in as {mentorName}. Review anonymous member queries, see persona and tier context, and respond from your practitioner perspective.
              </p>
            </div>
            <Link
              href="/mentor-connect"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> Member view
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
            {[
              { label: "Pending", value: stats.pending, icon: Clock },
              { label: "Answered", value: stats.answered, icon: CheckCircle },
              { label: "Total", value: stats.total, icon: Inbox },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass-card px-4 py-3 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{label}</span>
                </div>
                <p className="font-serif text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-muted-fg" />
        {(["pending", "answered", "all"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === tab
                ? "bg-primary-800 text-white border-primary-800"
                : "bg-white text-muted-fg border-border hover:border-primary-line"
            }`}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="opacity-70 ml-1">
              {tab === "pending"
                ? stats.pending
                : tab === "answered"
                  ? stats.answered
                  : stats.total}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Request list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-8 text-center">
              <Inbox className="w-8 h-8 text-muted-fg mx-auto mb-3" />
              <p className="text-sm text-muted-fg">No {filter === "all" ? "" : filter} requests.</p>
            </div>
          ) : (
            filtered.map((req) => {
              const persona = req.member.persona ? PERSONA_LABELS[req.member.persona] : null;
              const active = selectedId === req.id;
              return (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => selectRequest(req.id)}
                  className={`w-full text-left rounded-xl border bg-white p-4 transition-all ${
                    active
                      ? "border-primary-400 ring-2 ring-primary-400/20 shadow-sm"
                      : "border-border hover:border-primary-line"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant={req.isAnswered ? "success" : "warning"} size="sm">
                      {req.isAnswered ? "Answered" : "Pending"}
                    </Badge>
                    <span className="text-[10px] text-muted-fg">{formatDate(req.createdAt)}</span>
                  </div>
                  <p className="text-xs font-bold text-primary-800 mb-1">{req.member.id}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-fg mb-2">
                    {MENTOR_SEGMENT_LABELS[req.segment] ?? req.segment}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">{req.question}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {persona && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: persona.bg, color: persona.color }}
                      >
                        {persona.label}
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-fg font-semibold">
                      {TIER_LABELS[req.member.tier]?.label ?? req.member.tier}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-fg font-semibold capitalize">
                      {req.member.track.toLowerCase()} track
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-border p-10 text-center">
              <MessageSquare className="w-10 h-10 text-muted-fg mx-auto mb-3" />
              <p className="text-muted-fg text-sm">Select a member request to view details.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-5 border-b border-border bg-secondary/40">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary-800 mb-1">
                      {MENTOR_SEGMENT_LABELS[selected.segment] ?? selected.segment}
                    </p>
                    <h2 className="font-serif text-xl font-bold text-gray-900">{selected.member.id}</h2>
                  </div>
                  <Badge variant={selected.isAnswered ? "success" : "warning"}>
                    {selected.isAnswered ? "Answered" : "Awaiting response"}
                  </Badge>
                </div>
              </div>

              <div className="px-6 py-5 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Member profile (anonymous)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Persona",
                      value: selected.member.persona
                        ? PERSONA_LABELS[selected.member.persona]?.label
                        : "—",
                    },
                    {
                      label: "Tier",
                      value: TIER_LABELS[selected.member.tier]?.label ?? selected.member.tier,
                    },
                    {
                      label: "Track",
                      value: selected.member.track === "CAREER" ? "Career" : "Sales",
                    },
                    { label: "Submitted", value: formatDate(selected.createdAt) },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-fg mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-5 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-2">Member query</p>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{selected.question}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-fg">
                  {selected.isPublic ? (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Member opted in to anonymous sharing
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Private — not shared publicly
                    </>
                  )}
                </div>
              </div>

              {selected.isAnswered && selected.answer ? (
                <div className="px-6 py-5 bg-primary-soft/50">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-800 mb-2">Your answer</p>
                  <p className="text-sm text-primary-900 leading-relaxed whitespace-pre-wrap">{selected.answer}</p>
                  {selected.answeredAt && (
                    <p className="text-xs text-muted-fg mt-3">Sent {formatDate(selected.answeredAt)}</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAnswer} className="px-6 py-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-2 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Write your response
                  </p>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Give a direct, practitioner answer — specific enough that they can act on it this week."
                    className="w-full h-36 px-3 py-2.5 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 mb-3"
                  />
                  <p className={`text-xs mb-3 ${answer.length >= 10 ? "text-green-600" : "text-muted-fg"}`}>
                    {answer.length}/2000 characters
                  </p>
                  <label className="flex items-center gap-2.5 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded accent-primary-400"
                    />
                    <span className="text-sm text-gray-700">Allow anonymous sharing in Desk Channel library</span>
                  </label>
                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3 mb-3">{error}</p>
                  )}
                  <Button type="submit" loading={submitting} disabled={answer.length < 10}>
                    <Send className="w-4 h-4" /> Send answer to member
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
