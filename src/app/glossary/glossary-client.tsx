"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Filter, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { BrandedSearchInput } from "@/components/brand/logo";
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, type GlossaryTerm } from "@/data/glossary";
import { Reveal } from "@/components/animations";
import { Button } from "@/components/ui/button";

const CATEGORY_COLORS: Record<string, string> = {
  "Physical markets": "#3280ff",
  "Pricing & Derivatives": "#0040f5",
  "Risk & P&L": "#B45309",
  "Operations & Scheduling": "#0F766E",
  "Shipping": "#115cff",
  "Gas & LNG": "#0131cc",
  "Oil & Products": "#0830a0",
  "Metals & Mining": "#5B21B6",
  "Market Intelligence & Analytics": "#9A3412",
};

export function GlossaryClient({ terms = GLOSSARY_TERMS }: { terms?: GlossaryTerm[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const categories = useMemo(() => {
    const fromTerms = [...new Set(terms.map((t) => t.category))];
    return fromTerms.length > 0 ? fromTerms : [...GLOSSARY_CATEGORIES];
  }, [terms]);

  const filtered = useMemo(() => {
    return terms.filter((t) => {
      const matchesSearch =
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase()) ||
        (t.context?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, terms]);

  const grouped = useMemo(() => {
    if (search || activeCategory !== "All") return null;
    const groups: Record<string, GlossaryTerm[]> = {};
    terms.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    });
    return groups;
  }, [search, activeCategory, terms]);

  return (
    <div className="page-container py-8 sm:py-10">
      <section className="rounded-2xl bg-primary-800 px-8 py-12 mb-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3280ff 0%, transparent 70%)" }} />
        <Reveal className="relative z-10">
          <div className="pill pill-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Free Resource — Starter Pack
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-3">The Desk Glossary</h1>
          <p className="text-white/65 text-lg max-w-xl">
            196 commodity trading terms, explained the way a senior trader would actually explain them to a new hire on day one — not Wikipedia definitions.
          </p>
          <div className="flex items-center gap-3 mt-6 flex-wrap">
            {[
              `${terms.length} Terms`,
              `${categories.length} Categories`,
              "Desk Voice throughout",
              "Always updated",
            ].map((label) => (
              <div key={label} className="glass-card px-4 py-2.5 text-white text-sm font-semibold">
                {label}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-border pb-4 pt-4 -mx-6 px-6 mb-6">
        <div className="flex flex-col gap-3">
          <BrandedSearchInput
            variant="light"
            placeholder="Search terms and definitions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            wrapperClassName="w-full"
          />
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-muted-fg flex-shrink-0" />
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary-400 text-white"
                    : "bg-secondary text-muted-fg hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-fg mt-2">
          {filtered.length === terms.length
            ? `Showing all ${terms.length} terms`
            : `${filtered.length} of ${terms.length} terms`}
        </p>
      </div>

      {search || activeCategory !== "All" ? (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <BookOpen className="w-8 h-8 text-muted-fg mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No terms found</p>
              </motion.div>
            ) : (
              filtered.map((term) => (
                <TermCard
                  key={term.term}
                  term={term}
                  expanded={expandedTerm === term.term}
                  onToggle={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped || {})
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, letterTerms]) => (
              <div key={letter}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center text-white text-sm font-bold font-serif">
                    {letter}
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-fg">{letterTerms.length} terms</span>
                </div>
                <div className="space-y-2">
                  {letterTerms.map((term) => (
                    <TermCard
                      key={term.term}
                      term={term}
                      expanded={expandedTerm === term.term}
                      onToggle={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Teaser — no "See what's inside" button */}
      <section className="mt-16 rounded-2xl bg-primary-800 px-8 py-12 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3280ff 0%, transparent 70%)" }} />
        <Reveal className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to go <span className="text-accent italic">deeper</span>?
            </h2>
            <p className="text-white/65 text-base leading-relaxed">
              The Desk Glossary is just the start. The full Playbook covers commodity market mechanics, desk structure, career roadmaps, and deal teardowns — with the same practitioner voice throughout.
            </p>
          </div>
          <Link href="/signup?plan=pro" className="flex-shrink-0">
            <Button size="lg" variant="primary-dark" className="whitespace-nowrap">
              Get the Playbook <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}

function TermCard({
  term,
  expanded,
  onToggle,
}: {
  term: GlossaryTerm;
  expanded: boolean;
  onToggle: () => void;
}) {
  const color = CATEGORY_COLORS[term.category] || "#677184";

  return (
    <motion.div
      layout
      className="rounded-xl border border-border bg-white overflow-hidden cursor-pointer hover:border-primary-line transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between p-4 gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-2 h-8 rounded-full flex-shrink-0 mt-0.5" style={{ background: color }} />
          <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-[minmax(140px,200px)_1fr] gap-2 md:gap-6">
            <p className="font-semibold text-gray-900 text-sm">{term.term}</p>
            {!expanded ? (
              <p className="text-xs text-muted-fg line-clamp-2 md:line-clamp-1">
                {term.definition}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: `${color}12`, color }}
          >
            {term.category}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-fg" /> : <ChevronDown className="w-4 h-4 text-muted-fg" />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 md:pl-[calc(1rem+11px+0.75rem+200px+1.5rem)]">
              <div className="h-px bg-border mb-4 md:hidden" />
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{term.definition}</p>
              {term.context && (
                <p className="text-sm text-primary-800/80 italic border-l-2 border-primary-400 pl-3 leading-relaxed">
                  <span className="text-[10px] font-bold uppercase tracking-widest not-italic text-primary-800 block mb-1">Desk voice</span>
                  {term.context}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
