"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { GLOSSARY_TERMS, type GlossaryTerm } from "@/data/glossary";
import { Reveal } from "@/components/animations";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["All", "Physical Trading", "Finance", "Operations", "Analytics", "Legal", "Pricing"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "Physical Trading": "#3280ff",
  Finance: "#0040f5",
  Operations: "#0F766E",
  Analytics: "#5B21B6",
  Legal: "#B45309",
  Pricing: "#9A3412",
};

export function GlossaryClient({ terms = GLOSSARY_TERMS }: { terms?: GlossaryTerm[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return terms.filter((t) => {
      const matchesSearch =
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase());
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
      {/* Hero */}
      <section className="rounded-2xl bg-primary-800 px-8 py-12 mb-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3280ff 0%, transparent 70%)" }} />
        <Reveal className="relative z-10">
          <div className="pill pill-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Free Resource
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-3">
            Desk Glossary
          </h1>
          <p className="text-white/65 text-lg max-w-xl">
            100 essential terms every commodity trading professional needs to know. Searchable, filterable, and available to all members.
          </p>
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <div className="glass-card px-4 py-2.5 text-white text-sm font-semibold">
              {terms.length} Terms
            </div>
            <div className="glass-card px-4 py-2.5 text-white text-sm font-semibold">
              6 Categories
            </div>
            <div className="glass-card px-4 py-2.5 text-white text-sm font-semibold">
              Always updated
            </div>
          </div>
        </Reveal>
      </section>

      {/* Search + Filter */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-border pb-4 pt-4 -mx-6 px-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
            <input
              type="text"
              placeholder="Search terms and definitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-muted-fg flex-shrink-0" />
            {CATEGORIES.map((cat) => (
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

      {/* Results */}
      {search || activeCategory !== "All" ? (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <BookOpen className="w-8 h-8 text-muted-fg mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No terms found</p>
                <p className="text-muted-fg text-sm mt-1">Try a different search or category</p>
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
        // Alphabetical groups
        <div className="space-y-8">
          {Object.entries(grouped || {})
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, terms]) => (
              <div key={letter}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center text-white text-sm font-bold font-serif">
                    {letter}
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-fg">{terms.length} terms</span>
                </div>
                <div className="space-y-2">
                  {terms.map((term) => (
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
    </div>
  );
}

function TermCard({
  term,
  expanded,
  onToggle,
}: {
  term: (typeof GLOSSARY_TERMS)[0];
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
      <div className="flex items-center justify-between p-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-2 h-8 rounded-full flex-shrink-0"
            style={{ background: color }}
          />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{term.term}</p>
            {!expanded && (
              <p className="text-xs text-muted-fg truncate max-w-xs mt-0.5">
                {term.definition.slice(0, 80)}...
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: `${color}12`, color }}
          >
            {term.category}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-fg" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-fg" />
          )}
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
            <div className="px-4 pb-4 pt-0">
              <div className="h-px bg-border mb-4" />
              <p className="text-sm text-gray-700 leading-relaxed">{term.definition}</p>
              <span
                className="inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: `${color}12`, color }}
              >
                {term.category}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
