"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Database,
  Layers,
  Search,
  X,
  ArrowRight,
  Workflow,
  Cpu,
  ShieldCheck,
  Activity,
  Code2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RouteView } from "@/router";
import { API_BASE } from "@/config";

export type ViewType = RouteView;

interface NavbarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType, subTab?: string) => void;
}

interface NavTab {
  id: ViewType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

interface QuickAction {
  id: string;
  category: "Primary Views" | "Architecture & Specs" | "Developer Resources";
  title: string;
  description: string;
  view: ViewType;
  subTab?: string;
  external?: string;
  icon: React.ElementType;
  shortcut?: string;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 4 Canonical Main Tabs
  const navTabs: NavTab[] = [
    { id: "overview", label: "Overview", shortLabel: "Overview", icon: Sparkles },
    { id: "single", label: "Single Analysis", shortLabel: "Single", icon: Zap },
    { id: "batch", label: "Batch Processing", shortLabel: "Batch", icon: Database },
    { id: "architecture", label: "Docs & Specs", shortLabel: "Docs", icon: Layers },
  ];

  // Comprehensive command targets covering all workspaces, blueprints, pipelines, XAI, heuristics, benchmarks, and API
  const quickActions: QuickAction[] = [
    // --- 1. Primary Views ---
    {
      id: "overview",
      category: "Primary Views",
      title: "Platform Overview",
      description: "Architecture summary, engine telemetry, and interactive triage playground",
      view: "overview",
      icon: Sparkles,
      shortcut: "1",
    },
    {
      id: "single",
      category: "Primary Views",
      title: "Single Comment Analysis",
      description: "Real-time intent classification, Twitter-RoBERTa sentiment, and LOO occlusion heatmap",
      view: "single",
      icon: Zap,
      shortcut: "2",
    },
    {
      id: "batch",
      category: "Primary Views",
      title: "Batch Processing Pipeline",
      description: "Chunked CSV streaming inference pipeline with constant ~45MB memory usage",
      view: "batch",
      icon: Database,
      shortcut: "3",
    },

    // --- 2. Architecture & Technical Specs ---
    {
      id: "blueprint",
      category: "Architecture & Specs",
      title: "Architecture Blueprint & Topology",
      description: "Interactive vector diagram, subsystem flow, and dense embedding design rationale",
      view: "architecture",
      subTab: "overview",
      icon: Layers,
      shortcut: "4",
      badge: "Blueprint",
    },
    {
      id: "pipeline",
      category: "Architecture & Specs",
      title: "Inference Pipeline Deep Dive",
      description: "7-stage execution lifecycle from FastAPI ASGI ingestion to streaming CSV output",
      view: "architecture",
      subTab: "pipeline",
      icon: Workflow,
      shortcut: "5",
      badge: "Pipeline",
    },
    {
      id: "occlusion",
      category: "Architecture & Specs",
      title: "Leave-One-Out (LOO) Occlusion XAI",
      description: "Mathematical token perturbation simulator and exact ΔP attribution formulation",
      view: "architecture",
      subTab: "occlusion",
      icon: Cpu,
      shortcut: "6",
      badge: "Occlusion XAI",
    },
    {
      id: "heuristics",
      category: "Architecture & Specs",
      title: "Business Heuristics & Decision Matrix",
      description: "Deterministic rules translating intent + sentiment into Urgency, Tone, and Jira SOP routing",
      view: "architecture",
      subTab: "heuristics",
      icon: ShieldCheck,
      shortcut: "7",
      badge: "Heuristics",
    },
    {
      id: "benchmarks",
      category: "Architecture & Specs",
      title: "Architectural Benchmarks & Economics",
      description: "Empirical CPU latency (~12ms), 280+ req/s throughput, and zero cloud API token cost",
      view: "architecture",
      subTab: "benchmarks",
      icon: Activity,
      shortcut: "8",
      badge: "Benchmarks",
    },
    {
      id: "api",
      category: "Architecture & Specs",
      title: "REST API Reference & Curl",
      description: "Interactive endpoints specification with live cURL, Python, and TypeScript code snippets",
      view: "architecture",
      subTab: "api",
      icon: Code2,
      shortcut: "9",
      badge: "REST API",
    },

    // --- 3. Developer Resources & External Docs ---
    ...(import.meta.env.DEV
      ? [
          {
            id: "swagger",
            category: "Developer Resources" as const,
            title: "FastAPI Swagger Documentation",
            description: "Live interactive OpenAPI specification and endpoint sandbox at /docs",
            view: "architecture" as const,
            external: `${API_BASE}/docs`,
            icon: FileText,
            badge: "Swagger /docs",
          },
        ]
      : []),
    {
      id: "github",
      category: "Developer Resources",
      title: "GitHub Repository & Source Code",
      description: "Public open-source repository, CI/CD deploy pipeline, and ARCHITECTURE.md specs",
      view: "overview",
      external: "https://github.com/rachit-mangawa/Semantic-Comment-Analyze",
      icon: ExternalLink,
      badge: "GitHub",
    },
  ];

  // Listen for Cmd+K / Ctrl+K and keys 1-9
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
        else if (e.key === "4") onViewChange("architecture", "overview");
        else if (e.key === "5") onViewChange("architecture", "pipeline");
        else if (e.key === "6") onViewChange("architecture", "occlusion");
        else if (e.key === "7") onViewChange("architecture", "heuristics");
        else if (e.key === "8") onViewChange("architecture", "benchmarks");
        else if (e.key === "9") onViewChange("architecture", "api");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, onViewChange]);

  const handleTabClick = (view: ViewType) => {
    onViewChange(view);
  };

  const handleCommandSelect = (action: QuickAction) => {
    if (action.external) {
      window.open(action.external, "_blank", "noopener,noreferrer");
    } else {
      onViewChange(action.view, action.subTab);
    }
    setCommandPaletteOpen(false);
  };

  const filteredActions = quickActions.filter((action) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      action.title.toLowerCase().includes(q) ||
      action.description.toLowerCase().includes(q) ||
      action.category.toLowerCase().includes(q) ||
      (action.badge && action.badge.toLowerCase().includes(q))
    );
  });

  // Group actions by category
  const categories: Array<QuickAction["category"]> = [
    "Primary Views",
    "Architecture & Specs",
    "Developer Resources",
  ];

  return (
    <>
      {/* Floating White Pill Capsule Navbar */}
      <header className="sticky top-4 sm:top-5 z-40 w-full flex justify-center px-3 sm:px-4 pointer-events-none select-none mb-1 sm:mb-2">
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
            title="Jump to any view or spec (⌘K or keys 1-9)"
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
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-6">
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
              className="relative w-full max-w-xl bg-white border border-hairline-light rounded-2xl shadow-level-4 overflow-hidden z-10 text-ink flex flex-col"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline-light bg-canvas-cream/50">
                <Search size={18} className="text-shade-40 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Jump to a view or spec... (e.g. blueprint, pipeline, occlusion, api, batch)"
                  autoFocus
                  className="w-full bg-transparent text-[14px] sm:text-[15px] font-sans text-ink placeholder:text-shade-40 focus:outline-none"
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="p-1 rounded-pill hover:bg-black/5 text-shade-40 hover:text-ink transition-colors"
                  aria-label="Close command palette"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Categorized Action List */}
              <div className="p-2 max-h-[60vh] sm:max-h-[460px] overflow-y-auto divide-y divide-hairline-light/50">
                {categories.map((category) => {
                  const categoryActions = filteredActions.filter((a) => a.category === category);
                  if (categoryActions.length === 0) return null;

                  return (
                    <div key={category} className="py-1">
                      <div className="text-[11px] font-sans uppercase tracking-[0.72px] font-semibold text-shade-40 px-3 pt-2.5 pb-1 select-none">
                        {category}
                      </div>

                      <div className="space-y-0.5">
                        {categoryActions.map((action) => {
                          const Icon = action.icon;
                          const isCurrentActive =
                            activeView === action.view && (!action.subTab || true);

                          return (
                            <button
                              key={action.id}
                              onClick={() => handleCommandSelect(action)}
                              className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-canvas-cream transition-colors text-left group"
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-2">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-pill bg-black/5 flex items-center justify-center text-ink group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                                  <Icon size={16} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-[13px] sm:text-[14px] font-sans font-medium text-ink truncate">
                                      {action.title}
                                    </p>
                                    {action.badge && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-pill bg-white border border-hairline-light text-shade-60 shrink-0">
                                        {action.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] sm:text-[12px] font-sans text-shade-50 truncate mt-0.5">
                                    {action.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {action.shortcut && (
                                  <kbd className="px-1.5 py-0.5 rounded bg-canvas-cream border border-hairline-light text-[11px] font-mono text-shade-50">
                                    {action.shortcut}
                                  </kbd>
                                )}
                                {action.external ? (
                                  <ExternalLink
                                    size={13}
                                    className="text-shade-40 group-hover:text-ink transition-colors"
                                  />
                                ) : (
                                  <ArrowRight
                                    size={14}
                                    className="text-shade-40 opacity-0 group-hover:opacity-100 transition-opacity"
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {filteredActions.length === 0 && (
                  <div className="py-10 text-center text-shade-50 text-[14px]">
                    No matching views found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2.5 bg-canvas-cream border-t border-hairline-light flex items-center justify-between text-[11px] font-mono text-shade-50">
                <span>Select to navigate • Keys 1-9 direct jump</span>
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
