"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Clock, DollarSign, BookOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TierGate } from "@/components/tier-gate";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/animations";

const ROLES = [
  {
    id: "analyst",
    title: "Junior Commodity Analyst",
    level: "Entry",
    color: "#3280ff",
    yoe: "0–2 years",
    comp: "SGD 60–90K",
    description: "Your entry point onto the desk. Focus on price reporting, data analysis, and market monitoring.",
    skills: ["Excel / Python basics", "Market fundamentals", "Report writing", "Bloomberg / Reuters"],
    nextRole: "Senior Analyst",
    actionItems: [
      "Complete Chapters A–C of the Playbook",
      "Pass the Market Knowledge Test",
      "Build a working supply/demand model",
      "Network with 3 practitioners in your target segment",
    ],
  },
  {
    id: "sr-analyst",
    title: "Senior Commodity Analyst",
    level: "Mid",
    color: "#0040f5",
    yoe: "2–4 years",
    comp: "SGD 90–140K",
    description: "Develop independent market views. Contribute to trading decisions with quality research.",
    skills: ["Market view construction", "Macro overlay", "Presentation skills", "Quantitative analysis"],
    nextRole: "Junior Trader",
    actionItems: [
      "Own one segment's weekly market note",
      "Present a trade idea to the book runner",
      "Build counterparty relationships externally",
      "Develop a proprietary data edge",
    ],
  },
  {
    id: "jr-trader",
    title: "Junior Trader",
    level: "Mid",
    color: "#0131cc",
    yoe: "3–5 years",
    comp: "SGD 120–200K + bonus",
    description: "Execute trades with P&L responsibility. Manage a small book under senior oversight.",
    skills: ["Trade execution", "Risk management", "Counterparty negotiation", "P&L attribution"],
    nextRole: "Trader",
    actionItems: [
      "Run a small speculative book independently",
      "Complete all 5 Playbook chapters",
      "Study all 10 case studies with P&L focus",
      "Build your own pricing model for one product",
    ],
  },
  {
    id: "trader",
    title: "Trader",
    level: "Senior",
    color: "#0830a0",
    yoe: "5–8 years",
    comp: "SGD 200–500K + bonus",
    description: "Full P&L responsibility for a commodity or segment. Drive commercial strategy for the desk.",
    skills: ["Book management", "Market origination", "Team mentoring", "Strategic deal structuring"],
    nextRole: "Senior Trader / Head of Desk",
    actionItems: [
      "Generate origination opportunities beyond spot",
      "Mentor a junior analyst effectively",
      "Build a proprietary network of counterparties",
      "Deliver consistent alpha over 3+ years",
    ],
  },
  {
    id: "head-desk",
    title: "Head of Desk / Director",
    level: "Leadership",
    color: "#05145c",
    yoe: "10+ years",
    comp: "SGD 500K–2M+ (all-in)",
    description: "Lead a trading team. Drive P&L strategy, manage risk appetite, and develop talent.",
    skills: ["Leadership", "Business development", "Regulatory navigation", "Talent management"],
    nextRole: "MD / Global Head",
    actionItems: [
      "Develop next-generation talent on the desk",
      "Own the segment's commercial strategy",
      "Manage senior bank and counterparty relationships",
      "Drive innovation in product or market coverage",
    ],
  },
];

interface Props {
  userTier: string;
  persona: string | null;
}

export function CareerRoadmapClient({ userTier, persona }: Props) {
  const [activeRole, setActiveRole] = useState(ROLES[0].id);
  const role = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  return (
    <div className="page-container py-8 sm:py-10">
      {/* Hero */}
      <section className="rounded-2xl bg-primary-800 px-8 py-12 mb-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3280ff 0%, transparent 70%)" }} />
        <Reveal className="relative z-10">
          <div className="pill pill-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Pro Access
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-3">Career Roadmap</h1>
          <p className="text-white/65 text-lg max-w-xl">
            10 role blueprints with compensation benchmarks, skill matrices, and 90-day action plans for each stage of a commodity trading career.
          </p>
        </Reveal>
      </section>

      <TierGate requiredTier="PRO" userTier={userTier}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Role selector */}
          <div className="lg:col-span-1">
            <h2 className="font-serif font-bold text-gray-900 mb-4">Career Stages</h2>
            <div className="space-y-2">
              {ROLES.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all ${
                    activeRole === r.id
                      ? "border-primary-400 bg-primary-soft"
                      : "border-border hover:border-primary-line bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: r.color }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 leading-tight">{r.title}</p>
                      <p className="text-xs text-muted-fg">{r.yoe}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Role detail */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="bg-white rounded-2xl border border-border p-7">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Badge
                      size="sm"
                      className="mb-3"
                      style={{
                        background: `${role.color}12`,
                        color: role.color,
                        borderColor: `${role.color}30`,
                      }}
                    >
                      {role.level} Level
                    </Badge>
                    <h2 className="font-serif text-2xl font-bold text-gray-900">{role.title}</h2>
                    <p className="text-muted-fg text-sm mt-1">{role.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-fg text-xs mb-1">
                      <Clock className="w-3.5 h-3.5" /> Experience
                    </div>
                    <p className="font-semibold text-gray-900">{role.yoe}</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-fg text-xs mb-1">
                      <DollarSign className="w-3.5 h-3.5" /> Base Comp (SGD)
                    </div>
                    <p className="font-semibold text-gray-900">{role.comp}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-2">
                    Key Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-gray-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {role.nextRole && (
                  <div className="flex items-center gap-2 text-sm text-muted-fg">
                    <TrendingUp className="w-4 h-4 text-primary-400" />
                    Next step: <span className="font-semibold text-gray-900">{role.nextRole}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* 90-day action plan */}
              <div className="bg-white rounded-2xl border border-border p-7">
                <h3 className="font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> 90-Day Action Plan
                </h3>
                <div className="space-y-3">
                  {role.actionItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ background: role.color }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </TierGate>
    </div>
  );
}
