import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { InteractivePipeline } from "./InteractivePipeline";
import { OcclusionSimulator } from "./OcclusionSimulator";
import { BusinessHeuristicsMatrix } from "./BusinessHeuristicsMatrix";
import { BenchmarkComparison } from "./BenchmarkComparison";
import { ApiReferenceView } from "./ApiReferenceView";
import { HowItWorks } from "./HowItWorks";
import { TechStackGrid } from "./TechStackGrid";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Workflow,
  Cpu,
  ShieldCheck,
  Activity,
  Code2,
  LucideIcon
} from "lucide-react";

interface AboutViewProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
}

interface TabItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

export const AboutView: React.FC<AboutViewProps> = ({ initialTab = "overview", onTabChange }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const tabs: TabItem[] = [
    { id: "overview", label: "Architecture Blueprint", shortLabel: "Blueprint", icon: Layers },
    { id: "pipeline", label: "Inference Pipeline", shortLabel: "Pipeline", icon: Workflow },
    { id: "occlusion", label: "Occlusion XAI", shortLabel: "Occlusion", icon: Cpu },
    { id: "heuristics", label: "Business Heuristics", shortLabel: "Heuristics", icon: ShieldCheck },
    { id: "benchmarks", label: "Benchmarks", shortLabel: "Benchmarks", icon: Activity },
    { id: "api", label: "REST API Docs", shortLabel: "API Docs", icon: Code2 },
  ];

  return (
    <div className="page-container">
      {/* Universal Page Header with Apple HIG Typography */}
      <PageHeader
        eyebrow="System Specifications &amp; Whitepaper"
        title="Architecture &amp; Documentation"
        description="An explainable NLP architecture pairing a high-throughput logistic head over 384d all-MiniLM-L6-v2 embeddings, Leave-One-Out token occlusion attribution, and deterministic business routing on standard CPU."
        badge={
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 text-[11px] font-mono tracking-wider text-ink uppercase bg-canvas-soft border border-hairline rounded-full select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Technical Whitepaper</span>
          </span>
        }
      />

      {/* Unified Tab Navigation Bar with Icons & Active Sliding State */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-canvas-soft/90 border border-hairline rounded-2xl self-start shadow-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-sans font-medium transition-all duration-150 ease-out active:scale-[0.97] select-none ${
                isActive
                  ? "bg-surface-card text-ink font-semibold shadow-xs border border-hairline/80"
                  : "text-muted hover:text-ink hover:bg-canvas/50"
              }`}
            >
              <Icon
                size={14}
                strokeWidth={isActive ? 2 : 1.75}
                className={isActive ? "text-ink" : "text-muted"}
              />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic View Sections */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <ArchitectureDiagram />
            <HowItWorks />
            <TechStackGrid />
          </motion.div>
        )}

        {activeTab === "pipeline" && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <InteractivePipeline />
            <HowItWorks />
          </motion.div>
        )}

        {activeTab === "occlusion" && (
          <motion.div
            key="occlusion"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <OcclusionSimulator />
            <InteractivePipeline />
          </motion.div>
        )}

        {activeTab === "heuristics" && (
          <motion.div
            key="heuristics"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <BusinessHeuristicsMatrix />
          </motion.div>
        )}

        {activeTab === "benchmarks" && (
          <motion.div
            key="benchmarks"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <BenchmarkComparison />
          </motion.div>
        )}

        {activeTab === "api" && (
          <motion.div
            key="api"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <ApiReferenceView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
