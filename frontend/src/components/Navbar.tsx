import React, { useState } from "react";
import { Zap, Database, BookOpen, Layers, ExternalLink, Menu, X, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RouteView } from "@/router";

export type ViewType = RouteView;

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface NavbarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

interface NavItem {
  id: ViewType;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  href: string;
  tag: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redesigned navigation items: Overview is accessed via the Brand Logo on the left.
  const navItems: NavItem[] = [
    {
      id: "single",
      label: "Single Analysis",
      shortLabel: "Single",
      icon: Zap,
      href: "#/single",
      tag: "Real-time",
    },
    {
      id: "batch",
      label: "Batch Processing",
      shortLabel: "Batch",
      icon: Database,
      href: "#/batch",
      tag: "Streaming",
    },
    {
      id: "methodology",
      label: "Methodology",
      shortLabel: "Methodology",
      icon: BookOpen,
      href: "#/methodology",
      tag: "XAI Math",
    },
    {
      id: "architecture",
      label: "Docs & Specs",
      shortLabel: "Docs",
      icon: Layers,
      href: "#/architecture",
      tag: "API / SOP",
    },
  ];

  const handleNavClick = (view: ViewType) => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  const isOverview = activeView === "overview";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline/80 bg-surface-card/85 backdrop-blur-xl shadow-[0_1px_4px_0_rgba(0,0,0,0.02)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity (Acts as direct Overview link) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#/overview"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("overview");
            }}
            className={`group flex items-center gap-3 p-1.5 -m-1.5 rounded-xl transition-all duration-150 select-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
              isOverview
                ? "bg-canvas-soft/80 ring-1 ring-hairline"
                : "hover:bg-canvas-soft/50"
            }`}
            title="Semantic Comment Analysis — Click to return to Overview"
          >
            {/* Monogram Badge */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-ink text-canvas font-serif text-[17px] font-bold shadow-xs ring-1 ring-ink/10 transition-transform duration-200 group-hover:scale-105 active:scale-95">
              S
              {isOverview && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-surface-card" />
              )}
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-[19px] sm:text-[20px] font-medium tracking-tight text-ink leading-tight">
                  Semantic
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted px-1.5 py-0.5 rounded bg-canvas border border-hairline hidden sm:inline-block">
                  NLP
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted tracking-tight hidden sm:block">
                Comment Intelligence
              </span>
            </div>
          </a>
        </div>

        {/* Center: Spacious Floating Pill Navigation Dock (Desktop) */}
        <nav
          className="hidden md:flex items-center p-1.5 rounded-full bg-canvas-soft/80 border border-hairline shadow-xs backdrop-blur-md"
          aria-label="Main Navigation"
        >
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-full text-[13px] font-sans font-normal select-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ink active:scale-[0.97] ${
                    isActive
                      ? "text-ink font-medium"
                      : "text-muted hover:text-ink hover:bg-surface-card/50"
                  }`}
                >
                  {/* Smooth Sliding Pill Indicator via Framer Motion */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-surface-card border border-hairline/80 shadow-xs"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <Icon
                      size={14}
                      strokeWidth={isActive ? 2 : 1.75}
                      className={isActive ? "text-ink" : "text-muted"}
                    />
                    <span className="hidden lg:inline">{item.label}</span>
                    <span className="lg:hidden">{item.shortLabel}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </nav>

        {/* Right: Actions, Live Engine Status & External Links */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Engine Live Status Pill */}
          <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-tight bg-canvas-soft border border-hairline text-body select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Engine: Live (384d)</span>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/rachit-mangawa/Semantic-Comment-Analyze"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-mono text-body hover:text-ink border border-hairline hover:bg-canvas-soft hover:border-hairline transition-all duration-150 active:scale-[0.96]"
            title="GitHub Repository"
          >
            <GithubIcon size={13} />
            <span>GitHub</span>
          </a>

          {/* Interactive API Docs Link */}
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-mono text-body hover:text-ink border border-hairline hover:bg-canvas-soft hover:border-hairline transition-all duration-150 active:scale-[0.96]"
            title="Interactive FastAPI Swagger Specification"
          >
            <span>/docs</span>
            <ExternalLink size={12} strokeWidth={1.75} className="text-muted" />
          </a>

          {/* Mobile Menu Hamburger Toggle (< md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-hairline text-body hover:text-ink hover:bg-canvas-soft transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (< md) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden border-t border-hairline bg-surface-card px-4 pt-3 pb-6 flex flex-col gap-2 shadow-lg"
          >
            <div className="text-[10px] font-mono text-muted uppercase tracking-wider px-2 py-1">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-sans transition-colors ${
                    isActive
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-ink" : "text-muted"} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted px-2 py-0.5 rounded bg-surface-card border border-hairline">
                    {item.tag}
                  </span>
                </a>
              );
            })}

            <div className="pt-3 mt-1 border-t border-hairline flex items-center justify-between gap-2">
              <a
                href="https://github.com/rachit-mangawa/Semantic-Comment-Analyze"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[12px] font-mono text-body border border-hairline hover:bg-canvas-soft"
              >
                <GithubIcon size={14} />
                <span>GitHub</span>
              </a>
              <a
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[12px] font-mono text-body border border-hairline hover:bg-canvas-soft"
              >
                <span>Swagger /docs</span>
                <ExternalLink size={12} className="text-muted" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
