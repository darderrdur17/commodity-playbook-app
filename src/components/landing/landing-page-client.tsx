"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight, Check, BookOpen, Users, Lock,
  Star, Zap, ChevronRight,
  MessageSquare, FileText, Map, Target, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Reveal, StaggerChildren, StaggerItem, AnimatedCounter,
  HeroParticles, GradientOrbs,
} from "@/components/animations";
import { StarterPackModal } from "@/components/landing/starter-pack-modal";
import { ContactModal } from "@/components/landing/contact-modal";
import { SalesLandingPanel } from "@/components/landing/sales-landing-panel";
import { SectionCategoryLabel } from "@/components/landing/section-category-label";
import { MembersStrip } from "@/components/landing/members-strip";
import { ChapterAccordion } from "@/components/landing/chapter-accordion";
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
    quote: "The Playbook gave me the commodity context I was missing — I finally understood the trade, not just the financing.",
    name: "James K.",
    role: "Commodity Trade Finance, London",
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
  const searchParams = useSearchParams();
  const [activeTrack, setActiveTrack] = useState<Track>("career");
  const [modalOpen, setModalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const track = searchParams.get("track");
    if (track === "sales" || track === "career") {
      setActiveTrack(track);
    }
  }, [searchParams]);

  const career = content.career;
  const tierColors: Record<string, string> = { Pro: "#3280ff", Elite: "#B45309" };

  return (
    <div className="overflow-hidden -mt-[calc(80px+env(safe-area-inset-top,0px))]">
      {/* Audience toggle — flush under nav */}
      <div className="sticky top-[calc(80px+env(safe-area-inset-top,0px))] z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-stretch gap-0 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTrack("career")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTrack === "career"
                ? "border-primary-400 text-primary-400"
                : "border-transparent text-muted-fg hover:text-gray-900"
            }`}
          >
            I invest my career in commodity markets
          </button>
          <div className="w-px h-5 bg-border flex-shrink-0 mx-1 self-center" />
          <button
            type="button"
            onClick={() => setActiveTrack("sales")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTrack === "sales"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-muted-fg hover:text-gray-900"
            }`}
          >
            I sell solutions into commodity trading firms
          </button>
          <p className="hidden lg:flex items-center gap-1.5 ml-auto text-xs text-muted-fg whitespace-nowrap py-3">
            <Info className="w-3.5 h-3.5" />
            Select your track to see the right content
          </p>
        </div>
      </div>

      {activeTrack === "sales" ? (
        <SalesLandingPanel
          content={content.sales}
          membersStrip={content.membersStrip}
          onOpenModal={() => setModalOpen(true)}
          onOpenContactModal={() => setContactOpen(true)}
        />
      ) : (
        <>
          {/* Career Hero */}
          <section className="relative min-h-[80vh] sm:min-h-[88vh] flex flex-col bg-navy section-dark overflow-hidden">
            <GradientOrbs />
            <HeroParticles count={16} />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
              }}
            />
            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-24 flex-1 flex items-center">
              <div className="max-w-3xl w-full">
                <Reveal>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-medium tracking-wide mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {career.eyebrow}
                  </div>
                  <h1 className="font-serif text-[clamp(32px,6.5vw,68px)] font-bold leading-[1.04] tracking-tight text-white mb-6">
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mt-12 pt-10 border-t border-white/10">
                    {career.heroStats.map((stat, i) => (
                      <Reveal key={stat.label} delay={0.2 + i * 0.08}>
                        <div className="text-left sm:text-center">
                          <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                          </p>
                          <p className="text-white/50 text-xs font-medium mt-1 max-w-[160px] sm:mx-auto">{stat.label}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>

            <div className="relative z-10 w-full">
              <MembersStrip label={content.membersStrip.label} companies={content.membersStrip.companies} variant="dark" />
            </div>
          </section>

          {/* What's Inside */}
          <section className="py-16 sm:py-24 page-container">
            <Reveal className="text-center mb-14">
              <SectionCategoryLabel>What&apos;s Inside</SectionCategoryLabel>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4 leading-[1.1]">
                {content.whatsInside.titleLine1}
                <br />
                <span className="text-primary-400 italic">{content.whatsInside.titleLine2}</span>
              </h2>
              <p className="text-muted-fg text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
                {content.whatsInside.description}
              </p>
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
                      <div className="flex-1">
                        <h3 className="font-serif font-semibold text-gray-900 mb-2">{f.title}</h3>
                        <p className="text-sm text-muted-fg leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </section>

          {/* Chapter Coverage — accordion */}
          <section className="py-16 sm:py-24 bg-secondary border-y border-border">
            <div className="page-container">
              <Reveal className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
                <SectionCategoryLabel>{content.chapterCoverage.eyebrow}</SectionCategoryLabel>
                <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4">
                  {content.chapterCoverage.title}
                </h2>
                <p className="text-muted-fg text-base sm:text-lg leading-relaxed">
                  {content.chapterCoverage.description}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <ChapterAccordion chapters={content.chapterCoverage.chapters} />
              </Reveal>
            </div>
          </section>

          {/* Case Studies sample */}
          <section className="py-16 sm:py-24 page-container">
            <Reveal className="text-center mb-12 sm:mb-14 max-w-3xl mx-auto">
              <SectionCategoryLabel>{content.caseStudySample.eyebrow}</SectionCategoryLabel>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-gray-900 mb-4">
                {content.caseStudySample.title}{" "}
                <span className="text-primary-400 italic">{content.caseStudySample.titleAccent}</span>
              </h2>
              <p className="text-muted-fg text-base sm:text-lg leading-relaxed">
                {content.caseStudySample.description}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-border bg-white overflow-hidden">
                <div className="px-6 sm:px-8 py-5 border-b border-border flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="pro" size="sm">{content.caseStudySample.tag}</Badge>
                  <p className="text-xs text-muted-fg">{content.caseStudySample.sampleMeta}</p>
                </div>
                <div className="px-6 sm:px-8 py-6">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-6">
                    {content.caseStudySample.sampleTitle}
                  </h3>
                  <div className="space-y-5">
                    {content.caseStudySample.steps.map((step) => (
                      <div key={step.label} className="flex gap-4">
                        <div className="w-1 rounded-full bg-primary-400/30 shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-primary-400 mb-1">
                            {step.label}
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">{step.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 sm:px-8 py-4 bg-secondary border-t border-border flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-muted-fg shrink-0" />
                  <p className="text-sm text-muted-fg">{content.caseStudySample.unlockText}</p>
                </div>
              </div>
            </Reveal>
          </section>

          {/* Pricing */}
          <section className="bg-primary-800 section-dark py-16 sm:py-24 relative overflow-hidden">
            <GradientOrbs />
            <div className="relative z-10 page-container">
              <Reveal className="text-center mb-12 sm:mb-14">
                <SectionCategoryLabel colorClass="text-white/50">Choose Your Plan</SectionCategoryLabel>
                <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-white mb-4">
                  {content.pricing.title}
                </h2>
                <p className="text-white/65 text-base sm:text-lg max-w-none leading-relaxed px-0">
                  {content.pricing.subtitle}
                </p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {content.pricing.tiers.map((tier, i) => (
                  <Reveal key={tier.name} delay={i * 0.1} className="h-full">
                    <div
                      className={`relative rounded-2xl h-full flex flex-col group/tier ${
                        tier.highlight
                          ? "bg-white text-gray-900 border-2 border-primary-400 shadow-2xl"
                          : "bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                      }`}
                    >
                      {tier.highlight && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-400 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          Most Popular
                        </div>
                      )}
                      <div className="p-6 sm:p-7 flex-1">
                        <Badge
                          variant={tier.badge}
                          className={tier.highlight ? "mb-4" : "mb-4 bg-white/10 text-white border-white/20"}
                        >
                          {tier.name}
                        </Badge>
                        <p
                          className={`text-sm mb-4 italic leading-relaxed ${
                            tier.highlight ? "text-muted-fg" : "text-white/70"
                          }`}
                        >
                          {tier.tooltip}
                        </p>
                        <div className="mb-4">
                          <span className={`font-serif text-3xl sm:text-4xl font-bold ${tier.highlight ? "text-gray-900" : "text-white"}`}>
                            {tier.price}
                          </span>
                          {tier.price !== "Free" && (
                            <span className={`text-sm ml-2 ${tier.highlight ? "text-muted-fg" : "text-white/60"}`}>
                              {tier.billing}
                            </span>
                          )}
                        </div>
                        <ul className="space-y-2.5">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-2.5 text-sm">
                              <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlight ? "text-primary-400" : "text-accent"}`} />
                              <span className={tier.highlight ? "text-gray-700" : "text-white/85"}>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 sm:p-7 pt-0">
                        {tier.opensModal ? (
                          <Button
                            className="w-full"
                            variant={tier.highlight ? "default" : "primary-dark"}
                            size="lg"
                            onClick={() => setModalOpen(true)}
                          >
                            {tier.cta}
                          </Button>
                        ) : (
                          <Link href={tier.href} className="block">
                            <Button
                              className="w-full"
                              variant={tier.highlight ? "default" : "primary-dark"}
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
                <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
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
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {TESTIMONIALS.map((t) => (
                <StaggerItem key={t.name} className="h-full">
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
                  <Button size="xl" variant="primary-dark" className="shadow-xl w-full sm:w-auto" onClick={() => setModalOpen(true)}>
                    Start Free — Starter Pack <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    size="xl"
                    variant="outline-dark"
                    className="w-full sm:w-auto"
                    onClick={() => setContactOpen(true)}
                  >
                    Contact Us
                  </Button>
                </div>
              </Reveal>
            </div>
          </section>
        </>
      )}

      <StarterPackModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
