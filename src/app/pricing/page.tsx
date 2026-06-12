"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, Star, Zap, Shield, HelpCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, StaggerChildren, StaggerItem, GradientOrbs } from "@/components/animations";

const FEATURES_TABLE = [
  {
    category: "Starter — Free",
    color: "#16a34a",
    items: [
      { name: "5 desk infographics", starter: true, pro: true, elite: true },
      { name: "Chapter A preview (40+ pages)", starter: true, pro: true, elite: true },
      { name: "Desk Glossary (100 terms)", starter: true, pro: true, elite: true },
      { name: "Weekly Market Digest (email)", starter: true, pro: true, elite: true },
      { name: "Job Board waitlist", starter: true, pro: true, elite: true },
    ],
  },
  {
    category: "Pro — SGD 99 one-time",
    color: "#3280ff",
    items: [
      { name: "Full Playbook — all 5 chapters (200+ pages)", starter: false, pro: true, elite: true },
      { name: "Persona Analysis Quiz", starter: false, pro: true, elite: true },
      { name: "5 tailored resume templates (download)", starter: false, pro: true, elite: true },
      { name: "Career Roadmap (10 role blueprints)", starter: false, pro: true, elite: true },
      { name: "50 Interview Questions + model answers", starter: false, pro: true, elite: true },
      { name: "Market Knowledge Test (20 Qs + gap analysis)", starter: false, pro: true, elite: true },
    ],
  },
  {
    category: "Elite — SGD 299/month",
    color: "#B45309",
    items: [
      { name: "10 deep-dive Case Studies with P&L", starter: false, pro: false, elite: true },
      { name: "Desk Channel — 40 Q&As across 5 segments", starter: false, pro: false, elite: true },
      { name: "Anonymous Mentor Connect (25 practitioners)", starter: false, pro: false, elite: true },
      { name: "Market Job Openings tracker", starter: false, pro: false, elite: true },
      { name: "Priority email support", starter: false, pro: false, elite: true },
      { name: "Early access to new content", starter: false, pro: false, elite: true },
    ],
  },
];

const FAQS = [
  {
    q: "Can I upgrade from Starter or Pro later?",
    a: "Yes — you can upgrade at any time. When upgrading from Starter to Pro, you pay once for lifetime access. When upgrading to Elite, your subscription starts immediately.",
  },
  {
    q: "Is the Pro plan really a one-time purchase?",
    a: "Yes. You pay once and keep access forever — including all future updates to the 5 chapters, resume templates, career roadmap, interview questions, and knowledge test.",
  },
  {
    q: "What happens to my Pro content if I cancel Elite?",
    a: "Your Pro access remains active. Elite-only features (case studies, Desk Channel, Mentor Connect, job openings) are removed, but everything in Pro stays.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit and debit cards via Stripe. For Pro (one-time), payment is processed once immediately. For Elite (monthly), you are billed on the same date each month.",
  },
  {
    q: "Is there a student or team discount?",
    a: "Yes — reach out to hello@commodityplaybook.com for student pricing or team licences for 5+ seats.",
  },
  {
    q: "How does the Mentor Connect credit work?",
    a: "Elite members receive mentor credits each month (quantity TBD at launch). Each credit allows one question to one anonymous practitioner across 5 desk segments.",
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handlePurchase(plan: "pro" | "elite") {
    if (!session) {
      router.push(`/signup?plan=${plan}`);
      return;
    }
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="bg-primary-800 section-dark py-20 relative overflow-hidden">
        <GradientOrbs />
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 text-center">
          <Reveal>
            <div className="pill pill-dark mb-5 mx-auto">
              <Zap className="w-3 h-3" /> Simple Pricing
            </div>
            <h1 className="font-serif text-[clamp(36px,6vw,60px)] font-bold text-white mb-4 tracking-tight">
              Start free. Upgrade when you're ready.
            </h1>
            <p className="text-white/65 text-lg max-w-xl mx-auto">
              No hidden fees. No lock-in on Pro. Cancel Elite anytime. The only commitment is to getting ahead.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-[1100px] mx-auto px-6 -mt-8 mb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <Reveal>
            <div className="bg-white rounded-2xl border border-border p-7 h-full flex flex-col">
              <Badge variant="starter" className="mb-4">Starter</Badge>
              <div className="mb-5">
                <div className="font-serif text-4xl font-bold text-gray-900 mb-1">Free</div>
                <p className="text-sm text-muted-fg">Forever — no card required</p>
              </div>
              <p className="text-sm text-muted-fg mb-6">
                Your first step onto the desk. Explore the playbook and get desk-ready resources instantly.
              </p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["5 desk infographics", "Chapter A preview", "Desk Glossary (100 terms)", "Weekly Market Digest", "Job Board waitlist"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full" size="lg">Get Starter Free</Button>
              </Link>
            </div>
          </Reveal>

          {/* Pro */}
          <Reveal delay={0.1}>
            <div className="relative bg-primary-800 rounded-2xl border-2 border-primary-400 p-7 h-full flex flex-col text-white shadow-2xl shadow-primary-800/30">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-400 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                Most Popular
              </div>
              <Badge variant="pro" className="mb-4 bg-white/10 text-white border-white/20">Pro</Badge>
              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-bold">SGD 99</span>
                  <span className="text-white/60 text-sm">one-time</span>
                </div>
                <p className="text-sm text-white/60 mt-1">Lifetime access — no expiry</p>
              </div>
              <p className="text-sm text-white/70 mb-6">
                Everything you need to position yourself, prepare for interviews, and map your career.
              </p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["Full Playbook — all 5 chapters", "Persona Quiz + 5 resume templates", "Career Roadmap (10 role blueprints)", "50 Interview Questions + answers", "Market Knowledge Test"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/85">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant="primary-dark"
                size="lg"
                className="w-full"
                onClick={() => handlePurchase("pro")}
                loading={loadingPlan === "pro"}
              >
                Get Pro — SGD 99 <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Reveal>

          {/* Elite */}
          <Reveal delay={0.2}>
            <div className="bg-white rounded-2xl border border-border p-7 h-full flex flex-col">
              <Badge variant="elite" className="mb-4">Elite</Badge>
              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-bold text-gray-900">SGD 299</span>
                  <span className="text-sm text-muted-fg">/month</span>
                </div>
                <p className="text-sm text-muted-fg mt-1">Cancel anytime</p>
              </div>
              <p className="text-sm text-muted-fg mb-6">
                Live intelligence, mentor access, and the full practitioner network — for serious professionals.
              </p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["Everything in Pro", "10 Case Studies with P&L breakdown", "Desk Channel — 40 Q&As (5 segments)", "Anonymous Mentor Connect", "Market Job Openings tracker"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-amber-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                size="lg"
                onClick={() => handlePurchase("elite")}
                loading={loadingPlan === "elite"}
              >
                Get Elite — SGD 299/mo <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="max-w-[1100px] mx-auto px-6 mb-20">
        <Reveal className="text-center mb-8">
          <h2 className="font-serif text-3xl font-bold text-gray-900">Full feature comparison</h2>
        </Reveal>
        <div className="rounded-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 gap-0 bg-secondary">
            <div className="p-4 col-span-1" />
            {["Starter", "Pro", "Elite"].map((t, i) => (
              <div key={t} className="p-4 text-center border-l border-border">
                <p className="font-semibold text-sm text-gray-900">{t}</p>
                <p className="text-xs text-muted-fg">{["Free", "SGD 99", "SGD 299/mo"][i]}</p>
              </div>
            ))}
          </div>
          {FEATURES_TABLE.map((group) => (
            <React.Fragment key={group.category}>
              <div className="px-4 py-2.5 border-t border-border" style={{ background: `${group.color}08` }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: group.color }}>
                  {group.category}
                </p>
              </div>
              {group.items.map((item) => (
                <div key={item.name} className="grid grid-cols-4 border-t border-border hover:bg-secondary transition-colors">
                  <div className="p-3.5 col-span-1 text-sm text-gray-700">{item.name}</div>
                  {(["starter", "pro", "elite"] as const).map((tier) => (
                    <div key={tier} className="p-3.5 flex items-center justify-center border-l border-border">
                      {item[tier] ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-[700px] mx-auto px-6 mb-20">
        <Reveal className="text-center mb-8">
          <h2 className="font-serif text-3xl font-bold text-gray-900">Frequently asked questions</h2>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="rounded-xl border border-border overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-sm text-gray-900">{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 flex-shrink-0 transition-colors ${openFaq === i ? "text-primary-400" : "text-muted-fg"}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-4"
                  >
                    <p className="text-sm text-muted-fg leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-16">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <Reveal>
            <Shield className="w-8 h-8 text-primary-400 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">
              Not sure yet? Start free.
            </h2>
            <p className="text-muted-fg text-sm mb-6">
              Get the Starter pack instantly — no card required. Upgrade when the time is right.
            </p>
            <Link href="/signup">
              <Button size="lg">Get Starter Free <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
