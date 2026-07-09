"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { ContactModal } from "@/components/landing/contact-modal";

const FOOTER_LINKS = {
  Contents: [
    { label: "Overview", href: "/" },
    { label: "Full Playbook", href: "/playbook" },
    { label: "Career Guide", href: "/career-roadmap" },
    { label: "Sales Guide", href: "/?track=sales" },
  ],
  Community: [
    { label: "Mentor Connect", href: "/mentor-connect" },
    { label: "Desk Channel", href: "/desk-channel" },
    { label: "Weekly Note", href: "/starter-pack" },
    { label: "Job Board Waitlist", href: "/waitlist" },
  ],
  Access: [
    { label: "Pricing", href: "/pricing" },
    { label: "Team Licenses", href: "mailto:hello@commodityplaybook.com" },
    { label: "Sign Up", href: "/signup" },
    { label: "Login", href: "/login" },
    { label: "Contact Us", href: "#contact" },
  ],
} as const;

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer className="bg-muted text-gray-800 border-t border-border pt-16">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-11">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1fr] gap-9 lg:gap-[52px] pb-14 border-b border-border">
          <div>
            <Logo
              variant="wordmark-tagline"
              href="/"
              className="mb-5 sm:mb-6"
              imageClassName="h-16 sm:h-[4.5rem] md:h-20 lg:h-[5.5rem] max-w-[min(100%,340px)]"
            />
            <p className="text-[14.5px] text-muted-fg leading-[1.8] max-w-[300px]">
              The definitive guide on commodity trading — for professionals breaking in, and for
              vendors selling into the industry.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-400 mb-5 mt-1.5">
                {section}
              </p>
              <ul>
                {links.map((link) => (
                  <li key={link.label} className="border-b border-border last:border-b-0">
                    {link.href === "#contact" ? (
                      <button
                        type="button"
                        onClick={() => setContactOpen(true)}
                        className="block w-full text-left py-2.5 text-sm font-medium text-muted-fg hover:text-gray-900 transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="block py-2.5 text-sm font-medium text-muted-fg hover:text-gray-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="block py-2.5 text-sm font-medium text-muted-fg hover:text-gray-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <FooterNewsletter />

        <div className="py-5 pb-[26px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-border">
          <p className="text-[13px] text-muted-fg">
            © 2026. CommodityPlaybook. All rights reserved.
          </p>
          <div className="flex items-center gap-[18px] text-[13px]">
            <Link
              href="/privacy"
              className="text-muted-fg underline decoration-border underline-offset-[3px] hover:text-gray-900 hover:decoration-gray-400 transition-colors"
            >
              Privacy
            </Link>
            <span className="text-border">·</span>
            <Link
              href="/terms"
              className="text-muted-fg underline decoration-border underline-offset-[3px] hover:text-gray-900 hover:decoration-gray-400 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </footer>
  );
}
