"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, Lock, BookOpen, BarChart3, Users, Briefcase,
  TrendingUp, Star, Globe, Zap, ChevronRight, Play, Award,
  MessageSquare, FileText, Map, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reveal, StaggerChildren, StaggerItem, AnimatedCounter, HeroParticles, GradientOrbs } from "@/components/animations";

// ─── TRACK TOGGLE ────────────────────────────────────────────────────
type Track = "career" | "sales";

const TRACKS = {
  career: {
    label: "Build a Career",
    eyebrow: "Track 1 — Career",
    headline: "Your Unfair Advantage\nin Commodity Trading",
    sub: "The playbook that top desk analysts used to break in, move up, and build careers that last. From fresh grad to senior coverage — every step mapped.",
    cta: "Start Free — Explorer Pack",
    ctaHref: "/signup",
    statsLabel: "careers mapped",
  },
  sales: {
    label: "Sell Into Trading Firms",
    eyebrow: "Track 2 — Sales",
    headline: "Sell Smarter Into\nCommodity Trading Desks",
    sub: "The intelligence layer that B2B sales professionals use to speak the desk's language, open the right doors, and close deals that stick.",
    cta: "Start Free — Explorer Pack",
    ctaHref: "/signup",
    statsLabel: "firms profiled",
  },
};

// ─── TIERS ───────────────────────────────────────────────────────────
const TIERS = [
  {
    name: "Starter",
    price: "Free",
    billing: "forever",
    badge: "starter" as const,
    highlight: false,
    description: "Explore the playbook and get your first desk-ready resources.",
    features: [
      "5 desk infographics",
      "Chapter A preview (40+ pages)",
      "Desk Glossary (100 terms)",
      "Weekly Market Digest",
      "Job Board waitlist",
    ],
    locked: [],
    cta: "Get Starter Free",
    href: "/signup",
    color: "#16a34a",
  },
  {
    name: "Pro",
    price: "SGD 99",
    billing: "one-time",
    badge: "pro" as const,
    highlight: true,
    description: "Everything you need to position yourself and land the role.",
    features: [
      "Full Playbook — all 5 chapters",
      "Persona Analysis Quiz",
      "5 tailored resume templates",
      "Career Roadmap (10 role blueprints)",
      "50 Interview Questions + answers",
      "Market Knowledge Test (gap analysis)",
    ],
    locked: [],
    cta: "Get Pro",
    href: "/signup?plan=pro",
    color: "#3280ff",
  },
  {
    name: "Elite",
    price: "SGD 299",
    billing: "per month",
    badge: "elite" as const,
    highlight: false,
    description: "Full access plus live intelligence and mentor access.",
    features: [
      "Everything in Pro",
      "10 deep-dive Case Studies",
      "Desk Channel — 40 Q&As across 5 segments",
      "Anonymous Mentor Connect",
      "Market Job Openings tracker",
    ],
    locked: [],
    cta: "Get Elite",
    href: "/signup?plan=elite",
    color: "#B45309",
  },
];

// ─── FEATURES ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BookOpen,
    title: "Full Playbook",
    desc: "5 chapters covering every facet of commodity trading — markets, operations, finance, analytics, and career strategy.",
    tier: "Pro",
    color: "#3280ff",
  },
  {
    icon: Target,
    title: "Persona Quiz & Resumes",
    desc: "Discover your archetype (Fresh Grad / Switcher / Insider / Analyst / Vendor) and download a tailored resume template.",
    tier: "Pro",
    color: "#3280ff",
  },
  {
    icon: Map,
    title: "Career Roadmap",
    desc: "10 role blueprints with comp benchmarks, skills matrices, and 90-day action plans for every stage.",
    tier: "Pro",
    color: "#3280ff",
  },
  {
    icon: FileText,
    title: "Case Studies",
    desc: "10 real-world trading scenarios with full breakdowns — price dynamics, P&L, risk decisions, and lessons learned.",
    tier: "Elite",
    color: "#B45309",
  },
  {
    icon: MessageSquare,
    title: "Desk Channel",
    desc: "40 practitioner Q&As across Physical Trading, Finance, Analytics, Operations, and Sales — the unfiltered desk view.",
    tier: "Elite",
    color: "#B45309",
  },
  {
    icon: Users,
    title: "Mentor Connect",
    desc: "One question. One mentor. One honest answer. Anonymous access to 25 practitioners across 5 segments.",
    tier: "Elite",
    color: "#B45309",
  },
];

const STATS = [
  { value: 2400, suffix: "+", label: "Members worldwide" },
  { value: 100, suffix: "", label: "Glossary terms" },
  { value: 10, suffix: "", label: "Deep case studies" },
  { value: 25, suffix: "", label: "Anonymous mentors" },
];

const TESTIMONIALS = [
  {
    quote: "I landed my first commodity analyst role 6 weeks after going through the Pro pack. The interview question bank was exactly what I needed.",
    name: "Priya M.",
    role: "Commodity Analyst, Singapore",
    persona: "FRESH_GRAD",
    personaLabel: "Fresh Graduate",
    personaColor: "#0F766E",
  },
  {
    quote: "The Desk Channel gave me actual desk language I could use in client calls. My close rate went up noticeably after week one.",
    name: "James K.",
    role: "B2B Sales, London",
    persona: "VENDOR",
    personaLabel: "Vendor / Supplier",
    personaColor: "#9A3412",
  },
  {
    quote: "The Career Roadmap was the clearest articulation of progression paths I've ever seen. Immediately shared it with my team.",
    name: "Sarah T.",
    role: "Senior Trader, Geneva",
    persona: "INSIDER",
    personaLabel: "Industry Insider",
    personaColor: "#5B21B6",
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────
export default function HomePage() {
  const [activeTrack, setActiveTrack] = useState<Track>("career");
  const track = TRACKS[activeTrack];

  return (
    <div className="overflow-hidden">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center bg-navy section-dark overflow-hidden">
        <GradientOrbs />
        <HeroParticles count={16} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            {/* Track toggle */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1 p-1 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm mb-8 max-w-full overflow-x-auto"
            >
              {(["career", "sales"] as Track[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTrack(t)}
                  className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                    activeTrack === t
                      ? "bg-white text-primary-800 shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {TRACKS[t].label}
                </button>
              ))}
            </motion.div>

            {/* Eyebrow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTrack + "-eyebrow"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {track.eyebrow}
              </motion.div>
            </AnimatePresence>

            {/* Headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeTrack + "-headline"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="font-serif text-[clamp(40px,7vw,72px)] font-bold leading-[1.04] tracking-tight text-white mb-6 whitespace-pre-line"
              >
                {track.headline.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {i === 0 ? line : <span className="text-accent italic">{line}</span>}
                  </span>
                ))}
              </motion.h1>
            </AnimatePresence>

            {/* Subtext */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTrack + "-sub"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-white/65 text-base sm:text-lg font-light leading-relaxed max-w-2xl mb-8 sm:mb-10"
              >
                {track.sub}
              </motion.p>
            </AnimatePresence>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <Link href={track.ctaHref} className="w-full sm:w-auto">
                <Button
                  size="xl"
                  variant="primary-dark"
                  className="group shadow-xl shadow-black/20 w-full sm:w-auto"
                >
                  {track.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button size="xl" variant="outline-dark" className="w-full sm:w-auto">
                  See All Plans
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-8 sm:mt-10"
            >
              <div className="flex -space-x-2 flex-shrink-0">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-primary-800 bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(65 + i * 4)}
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-sm">
                Joined by <span className="text-white font-semibold">2,400+</span> traders &amp; sales professionals
              </p>
            </motion.div>
          </div>

          {/* Floating feature cards */}
          <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 w-72 space-y-3">
            {[
              { icon: "📘", label: "5 Chapters", sub: "Full Playbook" },
              { icon: "🎯", label: "Persona Quiz", sub: "5 Archetypes" },
              { icon: "🤝", label: "Mentor Connect", sub: "25 Practitioners" },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                <span className="text-2xl">{card.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{card.label}</p>
                  <p className="text-white/50 text-xs">{card.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────── */}
      <section className="border-y border-border bg-secondary py-6 sm:py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:divide-x md:divide-border">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1} className="text-center px-2 sm:px-4">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-primary-800">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-fg uppercase tracking-wider mt-1">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 page-container">
        <Reveal className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary-800 text-xs font-bold uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5" /> What's Inside
          </div>
          <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4">
            Every resource you need,<br />
            <span className="text-primary-400 italic">nothing you don't.</span>
          </h2>
          <p className="text-muted-fg text-lg max-w-xl mx-auto">
            Built by practitioners, validated by desk veterans. Structured for how
            commodity professionals actually learn and work.
          </p>
        </Reveal>

        <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <div className="card-hover group h-full rounded-xl border border-border bg-white p-6 flex flex-col gap-4 cursor-default">
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${f.color}12` }}
                  >
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <Badge variant={f.tier === "Elite" ? "elite" : "pro"} size="sm">
                    {f.tier}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-fg leading-relaxed">{f.desc}</p>
                </div>
                <div
                  className="mt-auto h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ background: f.color }}
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section className="bg-secondary py-16 sm:py-24">
        <div className="page-container">
          <Reveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary-800 text-xs font-bold uppercase tracking-widest mb-4">
              <Award className="w-3.5 h-3.5" /> Choose Your Plan
            </div>
            <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4">
              Simple, transparent pricing.
            </h2>
            <p className="text-muted-fg text-lg max-w-lg mx-auto">
              Start free. Upgrade when you're ready. No hidden fees, no subscriptions until Elite.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {TIERS.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl h-full flex flex-col ${
                    tier.highlight
                      ? "bg-primary-800 text-white border-2 border-primary-400 shadow-2xl shadow-primary-800/30"
                      : "bg-white border border-border"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-400 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="p-7 flex-1">
                    <Badge variant={tier.badge} className="mb-4">{tier.name}</Badge>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className={`font-serif text-4xl font-bold ${tier.highlight ? "text-white" : "text-gray-900"}`}>
                          {tier.price}
                        </span>
                        {tier.price !== "Free" && (
                          <span className={`text-sm ${tier.highlight ? "text-white/60" : "text-muted-fg"}`}>
                            {tier.billing}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm mb-6 ${tier.highlight ? "text-white/70" : "text-muted-fg"}`}>
                      {tier.description}
                    </p>

                    <ul className="space-y-3">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <Check
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              tier.highlight ? "text-accent" : "text-primary-400"
                            }`}
                          />
                          <span className={tier.highlight ? "text-white/85" : "text-gray-700"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-7 pt-0">
                    <Link href={tier.href} className="block">
                      <Button
                        className="w-full"
                        variant={tier.highlight ? "primary-dark" : tier.name === "Starter" ? "outline" : "default"}
                        size="lg"
                      >
                        {tier.cta}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="text-center mt-8">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-muted-fg hover:text-primary-400 transition-colors">
              View full feature comparison <ChevronRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 page-container">
        <Reveal className="text-center mb-14">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900">
            Used by practitioners who mean it.
          </h2>
        </Reveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <div className="card-hover rounded-xl border border-border bg-white p-6 h-full flex flex-col gap-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: t.personaColor }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                    <p className="text-xs text-muted-fg">{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────── */}
      <section className="bg-primary-800 section-dark py-16 sm:py-20 relative overflow-hidden">
        <GradientOrbs />
        <div className="relative z-10 page-container text-center">
          <Reveal>
            <h2 className="font-serif text-[clamp(28px,5vw,52px)] font-bold tracking-tight text-white mb-5">
              Start your playbook today.
              <br />
              <span className="text-accent italic">It's free to begin.</span>
            </h2>
            <p className="text-white/65 text-lg mb-8 max-w-lg mx-auto">
              Join 2,400+ commodity traders and sales professionals who've used the Playbook to get ahead.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="xl" variant="primary-dark" className="shadow-xl w-full sm:w-auto">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/glossary" className="w-full sm:w-auto">
                <Button size="xl" variant="outline-dark" className="w-full sm:w-auto">
                  Browse Glossary
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
