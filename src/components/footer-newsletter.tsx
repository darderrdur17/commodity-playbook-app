"use client";

import React, { useState } from "react";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="py-[34px] border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-7">
      <div className="flex flex-col gap-1.5">
        <span className="font-serif text-xl font-bold italic text-white tracking-tight leading-tight">
          Stay close to the desk.
        </span>
        <span className="text-[13.5px] text-white/[0.46] leading-snug">
          One short email. Industry happenings.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col xs:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === "loading"}
          className="w-full sm:w-[236px] bg-[#1a1a1a] border border-white/20 rounded-[7px] px-[17px] py-[11px] text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-white text-black border-none rounded-[7px] px-[22px] py-[11px] text-sm font-bold whitespace-nowrap hover:bg-white/90 hover:-translate-y-px transition-all disabled:opacity-60"
        >
          {status === "loading" ? "…" : "I'm in →"}
        </button>
      </form>

      {message && (
        <p className={`text-xs mt-2 ${status === "error" ? "text-red-400" : "text-emerald-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
