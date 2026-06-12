"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, isAdmin } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Demo", href: "/demo" },
  { label: "Playbook", href: "/playbook", requiresAuth: true },
  { label: "Glossary", href: "/glossary" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const tierVariant = user?.tier === "ELITE" ? "elite" : user?.tier === "PRO" ? "pro" : "starter";
  const tierLabel = isAdmin(user?.role)
    ? "Admin"
    : user?.tier === "ELITE"
      ? "Elite"
      : user?.tier === "PRO"
        ? "Pro"
        : "Starter";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-white/90 backdrop-blur-md border-b border-border"
        )}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-5 h-5 bg-primary-400 transform rotate-45 group-hover:rotate-90 transition-transform duration-400" />
            <span className="font-serif font-bold text-[17px] text-gray-800 tracking-tight">
              Commodity<span className="text-primary-400">Playbook</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 nav-link py-1",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-primary-400"
                    : "text-muted-fg hover:text-gray-800"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth CTA */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-400 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <Badge variant={isAdmin(user?.role) ? "danger" : (tierVariant as any)} size="sm">{tierLabel}</Badge>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-muted-fg transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-border shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-gray-800 truncate">{user?.name || "Member"}</p>
                        <p className="text-xs text-muted-fg truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {isAdmin(user?.role) && (
                          <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <Shield className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <User className="w-4 h-4" /> Account
                        </Link>
                        <button
                          onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-border overflow-hidden"
          >
            <nav className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary-soft text-primary-400"
                      : "text-gray-700 hover:bg-secondary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              {session ? (
                <>
                  <Link href="/dashboard" className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-secondary flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link href="/login"><Button variant="outline" className="w-full">Sign in</Button></Link>
                  <Link href="/signup"><Button className="w-full">Get Started Free</Button></Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {(mobileOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setMobileOpen(false); setUserMenuOpen(false); }}
        />
      )}
    </>
  );
}
