"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Check, BookOpen, BarChart3, Users, Briefcase,
  TrendingUp, Star, Zap, Award, ChevronRight, Play,
  MessageSquare, FileText, Map, Target, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Reveal, StaggerChildren, StaggerItem, AnimatedCounter,
  HeroParticles, GradientOrbs,
} from "@/components/animations";
import { StarterPackModal } from "@/components/landing/starter-pack-modal";
import { SalesLandingPanel } from "@/components/landing/sales-landing-panel";
import { Logo } from "@/components/brand/logo";
import {
  DEFAULT_LANDING_CONTENT,
  type LandingContent,
  type LandingFeature,
} from "@/data/landing-content";

type Track = "career" | "sales";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  BookOpen, Target, Map, FileText, MessageSquare, Users,
};

const TESTIMONIALS = [
  {
    quote: "I landed my first commodity analyst role 6 weeks after going through the Pro pack. The interview question bank was exactly what I needed.",
    name: "Priya M.",
    role: "Commodity Analyst, Singapore",
    personaColor: "#0F766E",
  },
  {
    quote: "The Desk Channel gave me actual desk language I could use in client calls. My close rate went up noticeably after week one.",
    name: "James K.",
    role: "B2B Sales, London",
    personaColor: "#9A3412",
  },
  {
    quote: "The Career Roadmap was the clearest articulation of progression paths I've ever seen. Immediately shared it with my team.",
    name: "Sarah T.",
    role: "Senior Trader, Geneva",
    personaColor: "#5B21B6",
  },
];

interface Props {
  content?: LandingContent;
}

export function LandingPageClient({ content = DEFAULT_LANDING_CONTENT }: Props) {
  const [activeTrack, setActiveTrack] = useState<Track>("career");
  const [modalOpen, setModalOpen] = useState(false);

  const career = content.career;
  const tierColors: Record<string, string> = { Pro: "#3280ff", Elite: "#B45309" };

  return (
    <div className="overflow-hidden">
      {/* Audience toggle bar */}
      <div className="sticky top-16 z-40 bg-secondary border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center gap-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTrack("career")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTrack === "career"
                ? "border-primary-400 text-primary-400"
                : "border-transparent text-muted-fg hover:text-gray-900"
            }`}
          >
            I invest my career in commodity markets
          </button>
          <div className="w-px h-5 bg-border flex-shrink-0 mx-1" />
          <button
            type="button"
            onClick={() => setActiveTrack("sales")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTrack === "sales"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-muted-fg hover:text-gray-900"
            }`}
          >
            I sell solutions into commodity trading firms
          </button>
          <p className="hidden lg:flex items-center gap-1.5 ml-auto text-xs text-muted-fg whitespace-nowrap">
            <Info className="w-3.5 h-3.5" />
            Select your track to see the right content
          </p>
        </div>
      </div>

      {activeTrack === "sales" ? (
        <SalesLandingPanel content={content.sales} onOpenModal={() => setModalOpen(true)} />
      ) : (
        <>
          {/* Career Hero */}
          <section className="relative min-h-[80vh] sm:min-h-[88vh] flex items-center bg-navy section-dark overflow-hidden">
            <GradientOrbs />
            <HeroParticles count={16} />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
              }}
            />
            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
              <div className="max-w-3xl">
                <Reveal>
                  <Logo variant="lockup-dark" showTagline className="mb-8" priority />
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {career.eyebrow}
                  </div>
                  <h1 className="font-serif text-[clamp(36px,6.5vw,68px)] font-bold leading-[1.04] tracking-tight text-white mb-6">
                    {career.headline}{" "}
                    <span className="text-accent italic">{career.headlineAccent}</span>
                  </h1>
                  <p className="text-white/65 text-base sm:text-lg font-light leading-relaxed max-w-2xl mb-8 sm:mb-10">
                    {career.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      size="xl"
                      variant="primary-dark"
                      className="group shadow-xl shadow-black/20 w-full sm:w-auto"
                      onClick={() => setModalOpen(true)}
                    >
                      {career.ctaPrimary}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Link href="/starter-pack" className="w-full sm:w-auto">
                      <Button size="xl" variant="outline-dark" className="w-full sm:w-auto">
                        {career.ctaSecondary}
                      </Button>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-8 sm:gap-12 mt-12 pt-10 border-t border-white/10">
                    {career.heroStats.map((stat, i) => (
                      <Reveal key={stat.label} delay={0.2 + i * 0.08}>
                        <div>
                          <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                          </p>
                          <p className="text-white/50 text-xs font-medium mt-1 max-w-[140px]">{stat.label}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Stats strip */}
          <section className="border-y border-border bg-secondary py-6 sm:py-8">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {content.stats.map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 0.1} className="text-center px-2 sm:px-4">
                    <p className="font-serif text-2xl sm:text-3xl font-bold text-primary-800 uppercase tracking-wide">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-muted-fg uppercase tracking-wider mt-1">{stat.label}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Ground-Level View */}
          <section className="py-16 sm:py-24 page-container">
            <Reveal className="text-center mb-14 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary-800 text-xs font-bold uppercase tracking-widest mb-4">
                {content.groundLevelView.eyebrow}
              </div>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4 leading-[1.1]">
                {content.groundLevelView.title}
              </h2>
              <p className="text-muted-fg text-lg">{content.groundLevelView.description}</p>
            </Reveal>
            <StaggerChildren staggerDelay={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.groundLevelView.features.map((f) => (
                <StaggerItem key={f.title}>
                  <div className="card-hover h-full rounded-xl border border-border bg-white p-6">
                    <h3 className="font-serif font-semibold text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-fg leading-relaxed">{f.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>

          {/* Chapter Coverage */}
          <section className="py-16 sm:py-24 bg-secondary border-y border-border">
            <div className="page-container">
              <Reveal className="text-center mb-14 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary-800 text-xs font-bold uppercase tracking-widest mb-4">
                  {content.chapterCoverage.eyebrow}
                </div>
                <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4">
                  {content.chapterCoverage.title}
                </h2>
                <p className="text-muted-fg text-lg">{content.chapterCoverage.description}</p>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {content.chapterCoverage.chapters.map((ch, i) => (
                  <Reveal key={ch.letter} delay={i * 0.08}>
                    <div className="rounded-xl border border-border bg-white p-5 h-full hover:border-primary-line transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary-800 text-white font-serif font-bold text-lg flex items-center justify-center mb-3">
                        {ch.letter}
                      </div>
                      <h3 className="font-serif font-semibold text-gray-900 text-sm mb-2">{ch.title}</h3>
                      <p className="text-xs text-muted-fg leading-relaxed">{ch.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Case Study Sample */}
          <section className="py-16 sm:py-24 page-container">
            <Reveal className="text-center mb-12 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
                {content.caseStudySample.eyebrow}
              </div>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4">
                {content.caseStudySample.title}
              </h2>
              <p className="text-muted-fg text-lg">{content.caseStudySample.description}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border bg-white overflow-hidden max-w-3xl mx-auto">
                <div className="px-6 py-4 bg-secondary border-b border-border flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-800">{content.caseStudySample.tag}</span>
                  <span className="text-xs text-muted-fg">{content.caseStudySample.sampleMeta}</span>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">{content.caseStudySample.sampleTitle}</h3>
                  <div className="space-y-5">
                    {content.caseStudySample.steps.map((step) => (
                      <div key={step.label} className="border-l-2 border-primary-400 pl-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary-800 mb-1">{step.label}</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{step.text}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-fg italic mt-6 pt-6 border-t border-border">{content.caseStudySample.unlockText}</p>
                </div>
              </div>
            </Reveal>
          </section>

          {/* Product tiers — What's Inside */}
          <section className="py-16 sm:py-24 page-container">
            <Reveal className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary-800 text-xs font-bold uppercase tracking-widest mb-4">
                <Zap className="w-3.5 h-3.5" /> What&apos;s Inside
              </div>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4 leading-[1.1]">
                {content.whatsInside.titleLine1}
                <br />
                <span className="text-primary-400 italic">{content.whatsInside.titleLine2}</span>
              </h2>
              <p className="text-muted-fg text-lg max-w-xl mx-auto">{content.whatsInside.description}</p>
            </Reveal>
            <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.whatsInside.features.map((f: LandingFeature) => {
                const Icon = ICON_MAP[f.icon] || BookOpen;
                const color = f.tier ? tierColors[f.tier] : "#3280ff";
                return (
                  <StaggerItem key={f.title}>
                    <div className="card-hover group h-full rounded-xl border border-border bg-white p-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                        {f.tier && (
                          <Badge variant={f.tier === "Elite" ? "elite" : "pro"} size="sm">{f.tier}</Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                        <p className="text-sm text-muted-fg leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </section>

          {/* Pricing */}
          <section className="bg-secondary py-16 sm:py-24">
            <div className="page-container">
              <Reveal className="text-center mb-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary-800 text-xs font-bold uppercase tracking-widest mb-4">
                  <Award className="w-3.5 h-3.5" /> Choose Your Plan
                </div>
                <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4">
                  {content.pricing.title}
                </h2>
                <p className="text-muted-fg text-lg max-w-lg mx-auto">{content.pricing.subtitle}</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {content.pricing.tiers.map((tier, i) => (
                  <Reveal key={tier.name} delay={i * 0.1}>
                    <div
                      className={`relative rounded-2xl h-full flex flex-col group/tier ${
                        tier.highlight
                          ? "bg-primary-800 text-white border-2 border-primary-400 shadow-2xl shadow-primary-800/30"
                          : "bg-white border border-border"
                      }`}
                      title={tier.tooltip}
                    >
                      {tier.highlight && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-400 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          Most Popular
                        </div>
                      )}
                      <div className="p-7 flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant={tier.badge}>{tier.name}</Badge>
                          <span
                            className="text-[10px] text-muted-fg opacity-0 group-hover/tier:opacity-100 transition-opacity cursor-help hidden sm:inline"
                            title={tier.tooltip}
                          >
                            ⓘ
                          </span>
                        </div>
                        <p className={`text-xs mb-3 italic ${tier.highlight ? "text-white/60" : "text-muted-fg"}`} title={tier.tooltip}>
                          {tier.tooltip}
                        </p>
                        <div className="mb-4">
                          <span className={`font-serif text-4xl font-bold ${tier.highlight ? "text-white" : "text-gray-900"}`}>
                            {tier.price}
                          </span>
                          {tier.price !== "Free" && (
                            <span className={`text-sm ml-2 ${tier.highlight ? "text-white/60" : "text-muted-fg"}`}>
                              {tier.billing}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mb-6 ${tier.highlight ? "text-white/70" : "text-muted-fg"}`}>
                          {tier.description}
                        </p>
                        <ul className="space-y-3">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-2.5 text-sm">
                              <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlight ? "text-accent" : "text-primary-400"}`} />
                              <span className={tier.highlight ? "text-white/85" : "text-gray-700"}>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-7 pt-0">
                        {tier.opensModal ? (
                          <Button
                            className="w-full"
                            variant={tier.highlight ? "primary-dark" : "outline"}
                            size="lg"
                            onClick={() => setModalOpen(true)}
                          >
                            {tier.cta}
                          </Button>
                        ) : (
                          <Link href={tier.href} className="block">
                            <Button
                              className="w-full"
                              variant={tier.highlight ? "primary-dark" : tier.name === "Starter" ? "outline" : "default"}
                              size="lg"
                            >
                              {tier.cta}
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
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

          {/* Testimonials */}
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
                    <p className="text-gray-700 text-sm leading-relaxed flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: t.personaColor }}>
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

          {/* CTA */}
          <section className="bg-primary-800 section-dark py-16 sm:py-20 relative overflow-hidden">
            <GradientOrbs />
            <div className="relative z-10 page-container text-center">
              <Reveal>
                <h2 className="font-serif text-[clamp(28px,5vw,52px)] font-bold tracking-tight text-white mb-5">
                  Start your playbook today.
                  <br />
                  <span className="text-accent italic">It&apos;s free to begin.</span>
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">
                  <Button size="xl" variant="primary-dark" className="shadow-xl" onClick={() => setModalOpen(true)}>
                    Start Free — Starter Pack <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Link href="/glossary">
                    <Button size="xl" variant="outline-dark">Browse Glossary</Button>
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>
        </>
      )}

      {/* Members strip — both tracks */}
      <section className="py-9 bg-secondary border-t border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-fg mb-5">
            {content.membersStrip.label}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
            {content.membersStrip.companies.map((name) => (
              <span key={name} className="font-serif font-bold text-lg text-gray-900">{name}</span>
            ))}
          </div>
        </div>
      </section>

      <StarterPackModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
