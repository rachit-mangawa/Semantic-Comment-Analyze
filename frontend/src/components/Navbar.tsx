"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Database,
  BookOpen,
  Layers,
  Search,
  Command,
  X,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RouteView } from "@/router";

export type ViewType = RouteView;

interface NavbarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

interface NavTab {
  id: ViewType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 4 Canonical Tabs with consolidated Docs & Architecture
  const navTabs: NavTab[] = [
    { id: "overview", label: "Overview", shortLabel: "Overview", icon: Sparkles },
    { id: "single", label: "Single Analysis", shortLabel: "Single", icon: Zap },
    { id: "batch", label: "Batch Processing", shortLabel: "Batch", icon: Database },
    { id: "architecture", label: "Docs & Specs", shortLabel: "Docs", icon: Layers },
  ];

  // Listen for Cmd+K / Ctrl+K and keys 1-4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
        return;
      }

      if (!isInput && !commandPaletteOpen) {
        if (e.key === "1") onViewChange("overview");
        else if (e.key === "2") onViewChange("single");
        else if (e.key === "3") onViewChange("batch");
        else if (e.key === "4") onViewChange("architecture");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, onViewChange]);

  const handleTabClick = (view: ViewType) => {
    onViewChange(view);
  };

  const handleCommandSelect = (view: ViewType) => {
    onViewChange(view);
    setCommandPaletteOpen(false);
  };

  const quickActions = [
    {
      title: "Platform Overview",
      description: "Architecture summary and interactive triage playground",
      view: "overview" as ViewType,
      icon: Sparkles,
      shortcut: "1",
    },
    {
      title: "Single Comment Analysis",
      description: "Real-time intent and token occlusion heatmap",
      view: "single" as ViewType,
      icon: Zap,
      shortcut: "2",
    },
    {
      title: "Batch Processing Pipeline",
      description: "Chunked CSV streaming inference pipeline",
      view: "batch" as ViewType,
      icon: Database,
      shortcut: "3",
    },
    {
      title: "Docs & Architecture Specs",
      description: "Blueprints, pipeline telemetry, occlusion XAI, heuristics, and REST API",
      view: "architecture" as ViewType,
      icon: Layers,
      shortcut: "4",
    },
  ];

  const filteredActions = quickActions.filter(
    (action) =>
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating White Pill Capsule Navbar (Exactly matching reference image) */}
      <header className="sticky top-4 z-40 w-full flex justify-center px-3 sm:px-4 pointer-events-none select-none">
        <nav
          className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-hairline-light rounded-pill shadow-level-3 max-w-full overflow-x-auto no-scrollbar transition-all duration-200"
          aria-label="Main Navigation"
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-pill text-[13px] sm:text-[14px] font-sans font-medium whitespace-nowrap transition-all duration-150 ease-out active:scale-[0.97] ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-shade-60 hover:text-black hover:bg-black/[0.04]"
                }`}
              >
                {/* Active Solid Black Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill-active"
                    className="absolute inset-0 rounded-pill bg-black shadow-sm"
                    transition={{ type: "spring", stiffness: 480, damping: 38 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon
                    size={15}
                    strokeWidth={isActive ? 2.25 : 1.75}
                    className={`shrink-0 ${isActive ? "text-white" : "text-shade-50"}`}
                  />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </span>
              </button>
            );
          })}

          {/* Quick Search & Command launcher */}
          <div className="h-4 w-px bg-hairline-light mx-1 select-none hidden sm:block" />
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-pill text-[12px] font-sans text-shade-60 hover:text-black hover:bg-black/[0.04] transition-all active:scale-[0.97]"
            title="Search views (⌘K or keys 1-5)"
            aria-label="Search views"
          >
            <Search size={14} className="text-shade-50" />
            <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-canvas-cream border border-hairline-light text-[10px] font-mono text-shade-50">
              ⌘K
            </kbd>
          </button>
        </nav>
      </header>

      {/* ⌘K Command Palette Modal */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommandPaletteOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-white border border-hairline-light rounded-2xl shadow-level-4 overflow-hidden z-10 text-ink"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline-light bg-canvas-cream/50">
                <Search size={18} className="text-shade-40 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Jump to a view... (e.g. single, batch, docs)"
                  autoFocus
                  className="w-full bg-transparent text-[15px] font-sans text-ink placeholder:text-shade-40 focus:outline-none"
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="p-1 rounded-pill hover:bg-black/5 text-shade-40 hover:text-ink transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Action List */}
              <div className="p-2 max-h-80 overflow-y-auto divide-y divide-hairline-light/50">
                <div className="text-[11px] font-sans uppercase tracking-[0.72px] font-semibold text-shade-40 px-3 py-2">
                  Navigation Targets
                </div>

                {filteredActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.view}
                      onClick={() => handleCommandSelect(action.view)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-canvas-cream transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-pill bg-black/5 flex items-center justify-center text-ink group-hover:bg-black group-hover:text-white transition-colors">
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-[14px] font-sans font-medium text-ink">
                            {action.title}
                          </p>
                          <p className="text-[12px] font-sans text-shade-50">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-1.5 py-0.5 rounded bg-canvas-cream border border-hairline-light text-[11px] font-mono text-shade-50">
                          {action.shortcut}
                        </kbd>
                        <ArrowRight
                          size={14}
                          className="text-shade-40 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </button>
                  );
                })}

                {filteredActions.length === 0 && (
                  <div className="py-8 text-center text-shade-50 text-[14px]">
                    No matching views found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2.5 bg-canvas-cream border-t border-hairline-light flex items-center justify-between text-[11px] font-mono text-shade-50">
                <span>Select to navigate</span>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-hairline-light text-[10px]">
                    ESC
                  </kbd>
                  <span>to close</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
