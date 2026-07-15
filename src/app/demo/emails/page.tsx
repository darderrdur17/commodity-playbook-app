"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/animations";
import { formatDate } from "@/lib/utils";
import { PAGE_HERO_TOP } from "@/lib/layout-constants";

interface DemoEmail {
  id: string;
  kind: string;
  kindLabel: string;
  to: string;
  subject: string;
  bodyText: string;
  delivered: boolean;
  createdAt: string;
}

export default function DemoEmailsPage() {
  const [emails, setEmails] = useState<DemoEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/demo/emails");
      if (res.ok) {
        const data = await res.json();
        setEmails(data);
        if (!selectedId && data.length > 0) setSelectedId(data[0].id);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const selected = emails.find((e) => e.id === selectedId);

  return (
    <div className="min-h-screen bg-secondary">
      <section className={`bg-primary-800 section-dark ${PAGE_HERO_TOP} pb-10 px-4 sm:px-6`}>
        <div className="max-w-[960px] mx-auto">
          <Link href="/demo/mentor-flow" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Mentor flow demo
          </Link>
          <Reveal>
            <div className="pill pill-dark mb-4">
              <Mail className="w-3.5 h-3.5" /> Demo email inbox
            </div>
            <h1 className="font-serif text-3xl font-bold text-white mb-2">Notification preview</h1>
            <p className="text-white/65 max-w-xl">
              Every Mentor Connect email is logged here for demo — member answer notifications, mentor reminders, and new question alerts. Works even without Resend configured.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={load} loading={loading}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {emails.length === 0 && !loading ? (
          <div className="bg-white rounded-xl border border-border p-10 text-center">
            <Mail className="w-10 h-10 text-muted-fg mx-auto mb-3" />
            <p className="text-gray-800 font-medium mb-1">No demo emails yet</p>
            <p className="text-sm text-muted-fg mb-4">
              Run through the{" "}
              <Link href="/demo/mentor-flow" className="text-primary-400 hover:underline">
                mentor flow demo
              </Link>{" "}
              — answer a question or send an admin reminder to generate emails.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            <div className="lg:col-span-2 space-y-2">
              {emails.map((email) => (
                <button
                  key={email.id}
                  type="button"
                  onClick={() => setSelectedId(email.id)}
                  className={`w-full text-left rounded-xl border bg-white p-4 transition-all ${
                    selectedId === email.id
                      ? "border-primary-400 ring-2 ring-primary-400/20"
                      : "border-border hover:border-primary-line"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant={email.delivered ? "success" : "secondary"} size="sm">
                      {email.delivered ? "Sent" : "Demo log"}
                    </Badge>
                    <span className="text-[10px] text-muted-fg">{formatDate(email.createdAt)}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary-800 mb-1">
                    {email.kindLabel}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">{email.subject}</p>
                  <p className="text-xs text-muted-fg mt-1">To: {email.to}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              {selected ? (
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border bg-secondary/40">
                    <p className="text-sm font-semibold text-gray-900">{selected.subject}</p>
                    <p className="text-xs text-muted-fg mt-1">
                      To: {selected.to} · {formatDate(selected.createdAt)}
                    </p>
                  </div>
                  <div className="px-5 py-5">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {selected.bodyText}
                    </pre>
                  </div>
                  {!selected.delivered && (
                    <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 text-xs text-amber-800 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      Logged for demo — configure RESEND_API_KEY to deliver real emails.
                    </div>
                  )}
                  {selected.delivered && (
                    <div className="px-5 py-3 bg-green-50 border-t border-green-100 text-xs text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      Delivered via Resend.
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
