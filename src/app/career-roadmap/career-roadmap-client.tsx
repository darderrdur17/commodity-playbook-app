"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, DollarSign, AlertTriangle, TrendingUp, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TierGate } from "@/components/tier-gate";
import { Reveal } from "@/components/animations";
import { CAREER_ROLES, type CareerRole } from "@/data/career-roadmap";
// roles prop overrides static default when loaded from CMS

const CAT_COLORS: Record<string, string> = {
  front: "#3280ff",
  ops: "#0F766E",
  middle: "#5B21B6",
  adjacent: "#B45309",
};

const DIFF_LABELS: Record<CareerRole["difficulty"], string> = {
  low: "Lower entry barrier",
  med: "Medium entry barrier",
  high: "High entry barrier",
};

interface Props {
  userTier: string;
  persona: string | null;
  roles?: CareerRole[];
  requiredTier?: "PRO" | "ELITE";
}

export function CareerRoadmapClient({
  userTier,
  roles = CAREER_ROLES,
  requiredTier = "PRO",
}: Props) {
  const [activeSlug, setActiveSlug] = useState(roles[0]?.slug ?? "");
  const role = roles.find((r) => r.slug === activeSlug) || roles[0];
  if (!role) {
    return <div className="page-container py-10 text-muted-fg">No career roles configured.</div>;
  }

  const color = CAT_COLORS[role.cat] || "#3280ff";

  return (
    <div className="page-container py-8 sm:py-10">
      <section className="rounded-2xl bg-primary-800 px-6 sm:px-8 py-10 mb-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3280ff 0%, transparent 70%)" }} />
        <Reveal className="relative z-10">
          <div className="pill pill-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Pro · 10 Roles
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">Career Roadmap</h1>
          <p className="text-white/65 text-base sm:text-lg max-w-xl">
            Role blueprints from the Pro Pack — comp benchmarks, typical backgrounds, red flags, and upgrade paths across front office, operations, middle office, and adjacent functions.
          </p>
        </Reveal>
      </section>

      <TierGate requiredTier={requiredTier} userTier={userTier}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="font-serif font-bold text-gray-900 mb-4">Roles</h2>
            <div className="space-y-2">
              {roles.map((r) => (
                <button
                  key={r.slug}
                  type="button"
                  onClick={() => setActiveSlug(r.slug)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all ${
                    activeSlug === r.slug
                      ? "border-primary-400 bg-primary-soft"
                      : "border-border hover:border-primary-line bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: CAT_COLORS[r.cat] }}
                    >
                      {r.id}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 leading-tight truncate">{r.title}</p>
                      <p className="text-xs text-muted-fg">{r.categoryLabel}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              key={activeSlug}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="bg-white rounded-2xl border border-border p-6 sm:p-7">
                <div className="flex flex-wrap gap-2 mb-4">
                  {role.tags.map((t) => (
                    <Badge key={t.label} size="sm">{t.label}</Badge>
                  ))}
                </div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">{role.title}</h2>
                <p className="text-muted-fg text-sm mb-5">{role.summary}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="bg-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-fg text-xs mb-1">
                      <Clock className="w-3.5 h-3.5" /> Typical timeline
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{role.timeline}</p>
                    <p className="text-xs text-muted-fg mt-1">{DIFF_LABELS[role.difficulty]}</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-fg text-xs mb-1">
                      <Building2 className="w-3.5 h-3.5" /> Typical firms
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{role.firms}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-2">What the role actually involves</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{role.what}</p>
                </div>

                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Compensation benchmarks (SGD)
                  </p>
                  <div className="space-y-2">
                    {role.comp.map((c) => (
                      <div key={c.label} className="flex justify-between text-sm border-b border-border pb-2">
                        <span className="text-muted-fg">{c.label}</span>
                        <span className="font-semibold text-gray-900">{c.range}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-primary-800 bg-primary-soft rounded-xl p-4">
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                  <div>
                    <p className="font-semibold mb-1">Upgrade path</p>
                    <p className="text-primary-900/80">{role.upgrade}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-6 sm:p-7">
                <h3 className="font-serif font-bold text-gray-900 mb-3">Typical backgrounds</h3>
                <ul className="space-y-2 mb-6">
                  {role.backgrounds.map((b, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-primary-400">·</span>
                      <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*/g, "") }} />
                    </li>
                  ))}
                </ul>

                <h3 className="font-serif font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Red flags for hiring managers
                </h3>
                <ul className="space-y-2">
                  {role.redFlags.map((f, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-amber-500">!</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </TierGate>
    </div>
  );
}
