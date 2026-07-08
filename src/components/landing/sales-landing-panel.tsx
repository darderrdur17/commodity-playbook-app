"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight, AlertCircle, Users, TrendingUp, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations";
import { SectionCategoryLabel } from "@/components/landing/section-category-label";
import { MembersStrip } from "@/components/landing/members-strip";
import type { LandingContent } from "@/data/landing-content";

const SALES_COLOR = "#0F766E";

const PAIN_POINTS = [
  {
    icon: AlertCircle,
    title: "You're Pitching to People Who Think in Barrels",
    desc: "Traders don't think in annual recurring revenue, user seats, or implementation timelines. They think in cargo positions, freight rates, and margin at risk.",
  },
  {
    icon: Users,
    title: "Your Champion Can't Sell You Internally",
    desc: "Even when your champion sees the value, they struggle to articulate it to a trading desk in commercial terms. They need language that maps to P&L and risk exposure.",
  },
  {
    icon: TrendingUp,
    title: "You Can't Differentiate on Product Alone",
    desc: "The vendor who wins understands the buyer's commercial context deeply enough to position their solution as the answer to a specific, felt problem.",
  },
];

const LEARN_ITEMS = [
  { num: "01", title: "How the desk actually makes money", desc: "The six revenue levers — flat price, spread, freight, timing, quality, and optionality." },
  { num: "02", title: "How trading desks use data and intelligence", desc: "How desks consume Platts, Argus, Kpler, Vortexa, and the Baltic Exchange." },
  { num: "03", title: "How operations and scheduling work", desc: "The cargo lifecycle — nomination, NOR, laytime, demurrage, B/L, and vessel scheduling." },
  { num: "04", title: "How risk and compliance think", desc: "VaR, position limits, basis risk, counterparty credit, sanctions — the constraints that shape every commercial decision." },
  { num: "05", title: "How to map your solution to their P&L", desc: "Case studies teach you how traders think about market signals and decisions." },
  { num: "06", title: "The language that builds immediate credibility", desc: "40 Q&As from real practitioners — what they care about and how they frame problems." },
];

interface Props {
  content: LandingContent["sales"];
  membersStrip: LandingContent["membersStrip"];
  onOpenModal: () => void;
}

export function SalesLandingPanel({ content, membersStrip, onOpenModal }: Props) {
  const learnRef = useRef<HTMLElement>(null);

  return (
    <div className="sales-panel">
      {/* Hero */}
      <section className="relative overflow-hidden flex flex-col" style={{ background: "#065F46" }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: SALES_COLOR }} />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-200/30 bg-teal-200/10 text-teal-100 text-xs font-medium tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-200 animate-pulse" />
              {content.eyebrow}
            </div>
            <h1 className="font-serif text-[clamp(32px,6vw,64px)] font-bold leading-[1.05] text-white mb-6 max-w-3xl">
              {content.headline}{" "}
              <span className="text-teal-100 italic">{content.headlineAccent}</span>
            </h1>
            <p className="text-teal-100/75 text-base sm:text-lg font-light leading-relaxed max-w-2xl mb-8">
              {content.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="xl" className="bg-teal-600 hover:bg-teal-700 text-white border-0 w-full sm:w-auto" onClick={onOpenModal}>
                {content.ctaPrimary}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="xl"
                variant="outline-dark"
                className="border-teal-200/40 text-white hover:bg-teal-200/10 w-full sm:w-auto"
                onClick={() => learnRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                {content.ctaSecondary}
              </Button>
            </div>
          </Reveal>

          <div className="flex flex-wrap gap-6 sm:gap-10 mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-white/10">
            {content.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {stat.animate === false ? (
                      <>{stat.value}{stat.suffix}</>
                    ) : (
                      <>{stat.value}{stat.suffix}</>
                    )}
                  </p>
                  <p className="text-teal-100/55 text-xs font-medium mt-1 max-w-[160px]">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <MembersStrip label={membersStrip.label} companies={membersStrip.companies} variant="dark" />
      </section>

      {/* Pain points */}
      <section className="py-16 sm:py-24 page-container">
        <Reveal className="text-center mb-12 max-w-3xl mx-auto">
          <SectionCategoryLabel colorClass="text-teal-700">The Problem</SectionCategoryLabel>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Buyers Know When You Don&apos;t Get It.
          </h2>
          <p className="text-muted-fg text-base sm:text-lg leading-relaxed">
            Commodity trading firms buy from people who understand their business. Most vendors don&apos;t.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAIN_POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="rounded-xl border border-border bg-white p-6 h-full hover:border-teal-200 hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "#CCFBF1", color: SALES_COLOR }}>
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-muted-fg leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What you'll learn */}
      <section ref={learnRef} id="sales-learn" className="py-16 sm:py-24 bg-secondary border-y border-border">
        <div className="page-container">
          <Reveal className="text-center mb-12 max-w-3xl mx-auto">
            <SectionCategoryLabel colorClass="text-teal-700">What You&apos;ll Learn</SectionCategoryLabel>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Commercial Context Your Buyers Live In.
            </h2>
            <p className="text-muted-fg text-base sm:text-lg leading-relaxed">
              A working understanding of how commodity trading desks make money, manage risk, and evaluate vendors.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEARN_ITEMS.map((item, i) => (
              <Reveal key={item.num} delay={i * 0.06}>
                <div className="flex gap-4 p-5 rounded-xl border border-border bg-white hover:border-teal-200 transition-colors">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center font-serif font-bold text-sm flex-shrink-0" style={{ background: "#CCFBF1", color: SALES_COLOR }}>
                    {item.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-fg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-16 sm:py-24 page-container">
        <Reveal className="text-center mb-12 max-w-3xl mx-auto">
          <SectionCategoryLabel colorClass="text-teal-700">Who This Is For</SectionCategoryLabel>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            Six Sales Roles. One Shared Problem.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.whoCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.06}>
              <div className="rounded-xl border border-border bg-white p-6 h-full hover:border-teal-200 transition-all flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: SALES_COLOR }}>{card.role}</p>
                <h3 className="font-serif font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-muted-fg mb-4 flex-1 leading-relaxed">{card.desc}</p>
                {card.outcome && (
                  <blockquote className="text-xs text-gray-600 italic border-l-2 border-teal-300 pl-3 leading-relaxed">
                    &ldquo;{card.outcome}&rdquo;
                  </blockquote>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Commercial Case — dark blue design */}
      <section className="py-16 sm:py-24 bg-primary-800 section-dark relative overflow-hidden">
        <div className="page-container">
          <Reveal className="text-center mb-10 sm:mb-12">
            <SectionCategoryLabel colorClass="text-white/50">{content.roi.eyebrow}</SectionCategoryLabel>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              {content.roi.title}{" "}
              <span className="text-accent italic">{content.roi.titleAccent}</span>
            </h2>
            <p className="text-white/65 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              {content.roi.description}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {content.roi.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:p-5">
                    <p className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-white/55 leading-snug">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <blockquote className="rounded-xl border border-accent/40 bg-white/5 p-6 sm:p-8 h-full flex flex-col justify-center">
                <p className="font-serif text-lg sm:text-xl text-white italic leading-relaxed mb-4">
                  &ldquo;{content.roi.quote}&rdquo;
                </p>
                <footer className="text-sm text-white/50">— {content.roi.quoteAuthor}</footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sales pricing — Pro & Elite only */}
      <section className="py-16 sm:py-24 page-container">
        <Reveal className="text-center mb-12">
          <SectionCategoryLabel colorClass="text-teal-700">Pricing</SectionCategoryLabel>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">Built for Sales Professionals.</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {content.pricing.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.1}>
              <div
                className={`rounded-2xl h-full flex flex-col ${
                  tier.featured
                    ? "bg-teal-900 text-white border-2 border-teal-500 shadow-xl"
                    : "bg-white border border-border"
                }`}
              >
                <div className="p-6 sm:p-7 flex-1">
                  {tier.featured && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-teal-600 text-white px-2 py-0.5 rounded mb-3">
                      Recommended
                    </span>
                  )}
                  <h3 className="font-serif text-xl font-bold mb-1">{tier.name}</h3>
                  <div className="mb-3">
                    <span className="font-serif text-3xl font-bold">{tier.price}</span>
                    <span className={`text-sm ml-2 ${tier.featured ? "text-teal-200/70" : "text-muted-fg"}`}>{tier.billing}</span>
                  </div>
                  <p className={`text-sm mb-5 leading-relaxed ${tier.featured ? "text-teal-100/75" : "text-muted-fg"}`}>{tier.description}</p>
                  <ul className="space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.featured ? "text-teal-300" : "text-teal-600"}`} />
                        <span className={tier.featured ? "text-white/90" : "text-gray-700"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 sm:p-7 pt-0">
                  <Link href={tier.href} className="block">
                    <Button
                      className={`w-full ${tier.featured ? "bg-teal-600 hover:bg-teal-500 text-white border-0" : ""}`}
                      variant={tier.featured ? "default" : "outline"}
                      size="lg"
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sales CTA */}
      <section className="py-16 sm:py-20 relative overflow-hidden" style={{ background: "#065F46" }}>
        <div className="relative z-10 page-container text-center">
          <Reveal>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Speaking the Desk&apos;s Language.
            </h2>
            <p className="text-teal-100/70 text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Get the free Starter Pack — 5 infographics plus weekly market digest. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="xl" className="bg-teal-600 hover:bg-teal-700 text-white border-0 w-full sm:w-auto" onClick={onOpenModal}>
                Start Free — Starter Pack <ArrowRight className="w-5 h-5" />
              </Button>
              <a href="mailto:hello@commodityplaybook.com" className="w-full sm:w-auto">
                <Button size="xl" variant="outline-dark" className="border-teal-200/40 text-white w-full sm:w-auto">
                  Contact Us
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team licences */}
      <section className="py-10 sm:py-12 bg-[#ecfdf5] border-t border-teal-100">
        <div className="page-container max-w-3xl text-center">
          <Reveal>
            <SectionCategoryLabel colorClass="text-teal-700">Team Licences</SectionCategoryLabel>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              If you want to upskill your entire sales team on commodity trading before a major campaign or account push, contact us for team pricing. Available for 5+ seats with a custom onboarding session.
            </p>
            <a href="mailto:hello@commodityplaybook.com" className="inline-block mt-4">
              <Button variant="outline" className="border-teal-300 text-teal-800 hover:bg-teal-50">
                Contact Us
              </Button>
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
