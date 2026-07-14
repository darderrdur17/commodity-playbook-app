"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, Download, Lock, Check, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/animations";
import {
  STARTER_INFOGRAPHICS,
  STARTER_MARKET_NOTE,
  STARTER_CHAPTER_PREVIEW,
} from "@/data/starter-pack";
import { StarterPackModal } from "@/components/landing/starter-pack-modal";
import { startCheckout } from "@/lib/start-checkout";

export function StarterPackClient({
  assetUrls = {},
  isLoggedIn = false,
}: {
  assetUrls?: Record<string, string>;
  isLoggedIn?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loadingPro, setLoadingPro] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  async function handleUpgradePro() {
    if (!session?.user) {
      router.push("/signup?plan=pro&callbackUrl=/pricing");
      return;
    }
    setLoadingPro(true);
    try {
      const url = await startCheckout("pro");
      if (url) window.location.href = url;
      else router.push("/pricing");
    } catch {
      router.push("/pricing");
    } finally {
      setLoadingPro(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary-800 section-dark py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="relative z-10 page-container">
          <Reveal>
            <div className="pill pill-dark mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Free · Starter Pack
            </div>
            <h1 className="font-serif text-[clamp(32px,5vw,56px)] font-bold text-white mb-4 max-w-2xl leading-tight">
              Your desk-ready starter resources.
            </h1>
            <p className="text-white/65 text-lg max-w-xl mb-8 leading-relaxed">
              Five infographics, a weekly market note, Chapter A preview, and the full Desk Glossary — free, forever.
            </p>
            <Button size="xl" variant="primary-dark" onClick={() => setModalOpen(true)}>
              Get the Starter Pack <ArrowRight className="w-5 h-5" />
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Infographics grid */}
      <section className="py-16 sm:py-24 page-container">
        <Reveal className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-800 mb-2">5 Infographics</p>
          <h2 className="font-serif text-3xl font-bold text-gray-900">Download and keep.</h2>
        </Reveal>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STARTER_INFOGRAPHICS.map((info) => (
            <StaggerItem key={info.id}>
              <div className="rounded-xl border border-border bg-white overflow-hidden card-hover h-full flex flex-col">
                <div className={`h-32 bg-gradient-to-br ${info.thumbClass} flex items-center justify-center`}>
                  <span className="font-serif text-4xl font-bold text-white/30">{info.num}</span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary-800 mb-1">{info.num}</p>
                  <h3 className="font-serif font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-sm text-muted-fg flex-1">{info.description}</p>
                  {isLoggedIn && assetUrls[info.fileKey] ? (
                    <a
                      href={assetUrls[info.fileKey]}
                      download
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-400 hover:text-primary-800 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-400 hover:text-primary-800 transition-colors"
                    >
                      <Download className="w-4 h-4" /> {isLoggedIn ? "Get Starter Pack" : "Download free"}
                    </button>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Market note */}
      <section className="py-16 sm:py-24 bg-[#f4f6f9]">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
            <Reveal>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-400 mb-4">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse flex-shrink-0" />
                {STARTER_MARKET_NOTE.eyebrow}
              </p>
              <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] font-bold text-primary-800 leading-[1.15] mb-5">
                {STARTER_MARKET_NOTE.title}
              </h2>
              <p className="text-[15px] text-muted-fg leading-relaxed mb-8 max-w-lg">
                {STARTER_MARKET_NOTE.description}
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
                  <Check className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
                  {STARTER_MARKET_NOTE.subscribed}
                </div>
              ) : (
                <Button onClick={() => setModalOpen(true)}>Subscribe with Starter Pack</Button>
              )}
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl bg-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(8,48,160,0.07)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-1">
                  Recent topics
                </p>
                <ul>
                  {STARTER_MARKET_NOTE.sampleTopics.map((topic, index) => (
                    <li
                      key={topic.title}
                      className={`flex items-center gap-4 py-[18px] ${
                        index > 0 ? "border-t border-gray-100" : ""
                      }`}
                    >
                      <span
                        className="inline-flex items-center justify-center min-w-[78px] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide flex-shrink-0"
                        style={{ color: topic.tagColor, backgroundColor: topic.tagBg }}
                      >
                        {topic.tag}
                      </span>
                      <p className="text-[13px] text-gray-800 leading-snug">{topic.title}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Chapter A preview */}
      <section className="py-16 sm:py-24 page-container">
        <Reveal className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-800 mb-2">{STARTER_CHAPTER_PREVIEW.label}</p>
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">{STARTER_CHAPTER_PREVIEW.title}</h2>
          <p className="text-muted-fg">
            {STARTER_CHAPTER_PREVIEW.freeSections} of {STARTER_CHAPTER_PREVIEW.totalSections} sections free with Starter.
          </p>
        </Reveal>
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          {STARTER_CHAPTER_PREVIEW.sections.map((section, i) => (
            <div
              key={section.id}
              className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-border" : ""} ${!section.free ? "bg-secondary/50" : ""}`}
            >
              <span className="font-mono text-xs text-primary-400 w-8 flex-shrink-0">{section.number}</span>
              <p className={`text-sm flex-1 ${section.free ? "text-gray-900 font-medium" : "text-muted-fg"}`}>
                {section.title}
              </p>
              {section.free ? (
                <Link href="/playbook/a" className="text-xs font-semibold text-primary-400 hover:underline flex items-center gap-1">
                  Read <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-fg">
                  <Lock className="w-3 h-3" /> Pro
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/playbook/a">
            <Button>
              <BookOpen className="w-4 h-4" /> Start Chapter A Preview
            </Button>
          </Link>
          {isLoggedIn ? (
            <Link href="/glossary">
              <Button variant="outline">Browse Glossary (196 terms)</Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              Browse Glossary (196 terms)
            </Button>
          )}
        </div>
      </section>

      <section className="bg-primary-800 section-dark py-14 sm:py-16">
        <div className="page-container flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready for the full playbook?
            </h2>
            <p className="text-white/65 text-sm sm:text-base leading-relaxed">
              Unlock all 9 chapters, resume templates, career roadmap, interview prep, and practitioner guides.
            </p>
          </div>
          <Button
            size="lg"
            variant="primary-dark"
            className="w-full md:w-auto shrink-0"
            onClick={handleUpgradePro}
            loading={loadingPro}
          >
            Upgrade to Pro <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <StarterPackModal open={modalOpen} onClose={() => { setModalOpen(false); setSubscribed(true); }} />
    </div>
  );
}
