import React from "react";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";

const FOOTER_LINKS = {
  "Content": [
    { label: "Desk Glossary", href: "/glossary" },
    { label: "Full Playbook", href: "/playbook" },
    { label: "Career Roadmap", href: "/career-roadmap" },
    { label: "Case Studies", href: "/case-studies" },
  ],
  "Community": [
    { label: "Desk Channel", href: "/desk-channel" },
    { label: "Mentor Connect", href: "/mentor-connect" },
    { label: "Job Openings", href: "/job-openings" },
    { label: "Job Board Waitlist", href: "/waitlist" },
  ],
  "Account": [
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sign Up", href: "/signup" },
    { label: "Login", href: "/login" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="w-5 h-5 bg-primary-400 transform rotate-45 group-hover:rotate-90 transition-transform duration-400" />
              <span className="font-serif font-bold text-[17px] text-white tracking-tight">
                Commodity<span className="text-primary-400">Playbook</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 mb-5">
              The definitive career guide for commodity trading — from first desk to senior coverage.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="mailto:hello@commodityplaybook.com"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-gray-800 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Commodity Playbook. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
