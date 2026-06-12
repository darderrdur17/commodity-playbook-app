"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, Shield, MessageSquare, Mail, Crown, TrendingUp,
  CheckCircle, Clock, ArrowLeft, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/animations";
import { PERSONA_LABELS, formatDate } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  tiers: { starter: number; pro: number; elite: number };
  adminCount: number;
  waitlistCount: number;
  mentor: { pending: number; answered: number };
  subscribers: number;
  personas: { persona: string; count: number }[];
}

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  tier: string;
  track: string;
  persona: string | null;
  mentorCredits: number;
  resumeCredits: number;
  createdAt: string;
  _count: { mentorQuestions: number; progress: number };
}

interface MentorQ {
  id: string;
  segment: string;
  question: string;
  answer: string | null;
  isAnswered: boolean;
  createdAt: string;
  user: { name: string | null; email: string; tier: string };
}

interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  track: string;
  createdAt: string;
}

export function AdminClient({ adminName }: { adminName: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [mentorQs, setMentorQs] = useState<MentorQ[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "mentor" | "waitlist">("users");
  const [answerDraft, setAnswerDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    try {
      const [statsRes, usersRes, mentorRes, waitlistRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
        fetch("/api/admin/mentor"),
        fetch("/api/admin/waitlist"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (mentorRes.ok) setMentorQs(await mentorRes.json());
      if (waitlistRes.ok) setWaitlist(await waitlistRes.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function updateUserTier(userId: string, tier: string) {
    setSaving(userId);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, tier }),
    });
    await loadAll();
    setSaving(null);
  }

  async function submitAnswer(id: string) {
    const answer = answerDraft[id];
    if (!answer || answer.length < 10) return;
    setSaving(id);
    await fetch(`/api/admin/mentor/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, isPublic: false }),
    });
    setAnswerDraft((d) => ({ ...d, [id]: "" }));
    await loadAll();
    setSaving(null);
  }

  const tierBadge = (tier: string) =>
    tier === "ELITE" ? "elite" : tier === "PRO" ? "pro" : "starter";

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Member Dashboard
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h1 className="font-serif text-2xl font-bold">Admin Dashboard</h1>
                  <p className="text-gray-400 text-sm">Signed in as {adminName}</p>
                </div>
              </div>
            </div>
            <Button variant="outline-dark" size="sm" onClick={loadAll} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <Reveal className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Total Users", value: stats.totalUsers, icon: Users, color: "#3280ff" },
              { label: "Starter", value: stats.tiers.starter, icon: TrendingUp, color: "#16a34a" },
              { label: "Pro", value: stats.tiers.pro, icon: Crown, color: "#3280ff" },
              { label: "Elite", value: stats.tiers.elite, icon: Crown, color: "#B45309" },
              { label: "Pending Q&A", value: stats.mentor.pending, icon: MessageSquare, color: "#ef4444" },
              { label: "Waitlist", value: stats.waitlistCount, icon: Mail, color: "#5B21B6" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-fg">{s.label}</p>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <p className="font-serif text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            ))}
          </Reveal>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["users", "mentor", "waitlist"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-primary-400 text-white"
                  : "bg-white text-muted-fg border border-border hover:border-primary-line"
              }`}
            >
              {tab === "users" ? `Users (${users.length})` : tab === "mentor" ? `Mentor Q&A (${mentorQs.filter((q) => !q.isAnswered).length} pending)` : `Waitlist (${waitlist.length})`}
            </button>
          ))}
          <Link href="/demo" className="ml-auto">
            <Button variant="outline" size="sm">View Demo Accounts</Button>
          </Link>
        </div>

        {/* Users tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary text-left">
                    <th className="px-4 py-3 font-semibold text-muted-fg">User</th>
                    <th className="px-4 py-3 font-semibold text-muted-fg">Role</th>
                    <th className="px-4 py-3 font-semibold text-muted-fg">Tier</th>
                    <th className="px-4 py-3 font-semibold text-muted-fg">Persona</th>
                    <th className="px-4 py-3 font-semibold text-muted-fg">Track</th>
                    <th className="px-4 py-3 font-semibold text-muted-fg">Credits</th>
                    <th className="px-4 py-3 font-semibold text-muted-fg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{u.name || "—"}</p>
                        <p className="text-xs text-muted-fg">{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        {u.role === "ADMIN" ? (
                          <Badge variant="danger" size="sm">Admin</Badge>
                        ) : (
                          <Badge variant="secondary" size="sm">User</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={tierBadge(u.tier) as any} size="sm">{u.tier}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {u.persona ? PERSONA_LABELS[u.persona]?.label : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs">{u.track}</td>
                      <td className="px-4 py-3 text-xs text-muted-fg">
                        M:{u.mentorCredits} · R:{u.resumeCredits}
                      </td>
                      <td className="px-4 py-3">
                        {u.role !== "ADMIN" && (
                          <select
                            className="text-xs border border-border rounded-lg px-2 py-1"
                            value={u.tier}
                            disabled={saving === u.id}
                            onChange={(e) => updateUserTier(u.id, e.target.value)}
                          >
                            <option value="STARTER">Starter</option>
                            <option value="PRO">Pro</option>
                            <option value="ELITE">Elite</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mentor tab */}
        {activeTab === "mentor" && (
          <div className="space-y-4">
            {mentorQs.length === 0 ? (
              <div className="bg-white rounded-xl border border-border p-8 text-center text-muted-fg">
                No mentor questions yet.
              </div>
            ) : (
              mentorQs.map((q) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-border p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {q.isAnswered ? (
                          <Badge variant="success" size="sm"><CheckCircle className="w-3 h-3" /> Answered</Badge>
                        ) : (
                          <Badge variant="warning" size="sm"><Clock className="w-3 h-3" /> Pending</Badge>
                        )}
                        <span className="text-xs text-muted-fg capitalize">{q.segment.replace("-", " ")}</span>
                      </div>
                      <p className="text-sm text-gray-800">{q.question}</p>
                      <p className="text-xs text-muted-fg mt-1">
                        From {q.user.name || q.user.email} · {q.user.tier} · {formatDate(q.createdAt)}
                      </p>
                    </div>
                  </div>
                  {q.isAnswered && q.answer ? (
                    <div className="bg-primary-soft border border-primary-line rounded-lg p-3 text-sm text-primary-800">
                      {q.answer}
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-2">
                      <textarea
                        className="flex-1 text-sm border border-border rounded-lg p-2.5 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="Write mentor answer..."
                        value={answerDraft[q.id] || ""}
                        onChange={(e) => setAnswerDraft((d) => ({ ...d, [q.id]: e.target.value }))}
                      />
                      <Button
                        size="sm"
                        onClick={() => submitAnswer(q.id)}
                        loading={saving === q.id}
                        disabled={!answerDraft[q.id] || answerDraft[q.id].length < 10}
                      >
                        Send
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Waitlist tab */}
        {activeTab === "waitlist" && (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary text-left">
                  <th className="px-4 py-3 font-semibold text-muted-fg">Email</th>
                  <th className="px-4 py-3 font-semibold text-muted-fg">Name</th>
                  <th className="px-4 py-3 font-semibold text-muted-fg">Track</th>
                  <th className="px-4 py-3 font-semibold text-muted-fg">Joined</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((w) => (
                  <tr key={w.id} className="border-b border-border">
                    <td className="px-4 py-3">{w.email}</td>
                    <td className="px-4 py-3">{w.name || "—"}</td>
                    <td className="px-4 py-3">{w.track}</td>
                    <td className="px-4 py-3 text-muted-fg">{formatDate(w.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
