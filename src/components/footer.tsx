import React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { FooterNewsletter } from "@/components/footer-newsletter";

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
    { label: "Contact Us", href: "mailto:hello@commodityplaybook.com" },
  ],
} as const;

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/[0.07] pt-16">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-11">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1fr] gap-9 lg:gap-[52px] pb-14 border-b border-white/[0.07]">
          <div>
            <Logo
              variant="footer"
              href="/"
              className="mb-[22px]"
              imageClassName="h-20 sm:h-24 w-auto max-h-none"
            />
            <p className="text-[14.5px] text-white/[0.55] leading-[1.8] max-w-[300px]">
              The definitive guide on commodity trading — for professionals breaking in, and for
              vendors selling into the industry.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bfdbff] mb-5 mt-1.5">
                {section}
              </p>
              <ul>
                {links.map((link) => (
                  <li key={link.label} className="border-b border-white/[0.055] last:border-b-0">
                    {link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="block py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="block py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
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

        <div className="py-5 pb-[26px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[13px] text-white">
            © 2026. CommodityPlaybook. All rights reserved.
          </p>
          <div className="flex items-center gap-[18px] text-[13px]">
            <Link
              href="/privacy"
              className="text-white underline decoration-white/30 underline-offset-[3px] hover:decoration-white/70 transition-colors"
            >
              Privacy
            </Link>
            <span className="text-white/20">·</span>
            <Link
              href="/terms"
              className="text-white underline decoration-white/30 underline-offset-[3px] hover:decoration-white/70 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
