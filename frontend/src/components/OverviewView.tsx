"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RouteView } from "@/router";
import {
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  LayoutDashboard,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  FileSpreadsheet,
  Activity,
  Code2,
  FileText
} from "lucide-react";

interface OverviewViewProps {
  onNavigate: (view: RouteView, subTab?: string) => void;
}

const PRESET_DEMOS = [
  {
    id: "bug",
    label: "Bug Report",
    text: "The application crashes every time I click export on large PDF tables!",
    intent: "Bug Report",
    confidence: "96.2%",
    sentiment: "NEGATIVE",
    sentimentScore: "94.0%",
    tone: "Frustrated",
    urgency: "High",
    action: "Log Jira Ticket",
    keyTokens: ["crashes", "export", "PDF"],
  },
  {
    id: "feature",
    label: "Feature Request",
    text: "Please add automated webhook notifications for status updates.",
    intent: "Feature Request",
    confidence: "94.1%",
    sentiment: "POSITIVE",
    sentimentScore: "85.2%",
    tone: "Hopeful",
    urgency: "Low",
    action: "Add to Roadmap",
    keyTokens: ["webhook", "notifications", "automated"],
  },
  {
    id: "complaint",
    label: "Complaint",
    text: "We were billed twice this month and support has not responded after 48 hours.",
    intent: "Complaint",
    confidence: "95.5%",
    sentiment: "NEGATIVE",
    sentimentScore: "92.4%",
    tone: "Angry",
    urgency: "High",
    action: "Route to Support",
    keyTokens: ["billed", "twice", "support"],
  },
  {
    id: "praise",
    label: "Praise",
    text: "The new interface is clean, responsive, and much easier to navigate.",
    intent: "Praise",
    confidence: "98.5%",
    sentiment: "POSITIVE",
    sentimentScore: "97.1%",
    tone: "Appreciative",
    urgency: "Low",
    action: "Share with Team",
    keyTokens: ["clean", "responsive", "easier"],
  },
  {
    id: "question",
    label: "Question",
    text: "Where can I find historical API invoices and manage workspace team seats?",
    intent: "Question",
    confidence: "97.4%",
    sentiment: "NEUTRAL",
    sentimentScore: "88.1%",
    tone: "Inquisitive",
    urgency: "Low",
    action: "Route to Documentation",
    keyTokens: ["invoices", "manage", "seats"],
  },
];

const INTENT_THEMES: Record<string, { bg: string; text: string; hex: string; border: string }> = {
  "Bug Report": { bg: "bg-red-500/10", text: "text-red-700", hex: "#ef4444", border: "border-red-500/20" },
  "Complaint": { bg: "bg-orange-500/10", text: "text-orange-700", hex: "#f97316", border: "border-orange-500/20" },
  "Feature Request": { bg: "bg-purple-500/10", text: "text-purple-700", hex: "#8b5cf6", border: "border-purple-500/20" },
  "Praise": { bg: "bg-emerald-500/10", text: "text-emerald-700", hex: "#22c55e", border: "border-emerald-500/20" },
  "Question": { bg: "bg-blue-500/10", text: "text-blue-700", hex: "#3b82f6", border: "border-blue-500/20" },
};

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const [selectedDemo, setSelectedDemo] = useState(PRESET_DEMOS[0]);

  const activeTheme = INTENT_THEMES[selectedDemo.intent] || {
    bg: "bg-surface-strong",
    text: "text-ink",
    hex: "#0c0a09",
    border: "border-hairline",
  };

  return (
    <div className="page-container">
      {/* Universal Page Header with Apple HIG Typography */}
      <PageHeader
        eyebrow="Semantic Intelligence Platform"
        title="Platform Overview"
        description="A self-contained NLP pipeline combining fast dense vector embeddings, Twitter-RoBERTa sentiment polarity, zero-surrogate Leave-One-Out token occlusion math, and deterministic business heuristics on standard CPU."
        badge={
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 text-[11px] font-mono tracking-wider text-ink uppercase bg-canvas-soft border border-hairline rounded-full select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Local CPU Inference</span>
          </span>
        }
      />

      {/* Hero Showcase (Apple-Inspired Double-Bezel Card) */}
      <div className="bg-surface-card border border-hairline rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs relative overflow-hidden transition-all duration-200">
        
        {/* Top Badges & System Telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-hairline">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-mono font-medium tracking-tight text-ink bg-canvas-soft border border-hairline rounded-full select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pipeline: Online</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono tracking-tight text-muted bg-canvas-soft border border-hairline rounded-full select-none">
              <Zap size={13} strokeWidth={2} className="text-amber-600" />
              <span>In-Memory Model</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono tracking-tight text-muted bg-canvas-soft border border-hairline rounded-full select-none">
              <Cpu size={13} strokeWidth={1.75} />
              <span>384d Dense Space</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-mono text-muted select-none">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Zero External Cloud API Calls</span>
          </div>
        </div>

        {/* Hero Title & Primary CTAs */}
        <div className="py-10 max-w-3xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ink tracking-tight leading-[1.12] mb-5 text-balance">
            Explainable semantic intelligence for customer feedback.
          </h2>
          <p className="text-[16px] sm:text-[17px] font-sans text-body leading-relaxed max-w-2xl text-pretty mb-8">
            Intent classification, Twitter-RoBERTa sentiment polarity, and word-level occlusion heatmaps without black-box LLM dependencies or recurring token billing.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onNavigate("single")}
              className="inline-flex items-center gap-3 pl-5 pr-4 py-3 rounded-xl font-sans text-[14px] font-medium bg-ink text-canvas hover:bg-black transition-all duration-150 ease-out active:scale-[0.97] shadow-sm group"
            >
              <span>Analyze Single Comment</span>
              <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={13} strokeWidth={2} />
              </span>
            </button>

            <button
              onClick={() => onNavigate("batch")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-sans text-[14px] font-medium bg-canvas-soft border border-hairline text-ink hover:bg-canvas transition-all duration-150 ease-out active:scale-[0.97]"
            >
              <FileSpreadsheet size={16} strokeWidth={1.75} />
              <span>Stream Batch CSV</span>
            </button>

            <button
              onClick={() => onNavigate("methodology")}
              className="inline-flex items-center gap-1.5 px-4 py-3 text-[14px] font-sans font-medium text-body hover:text-ink transition-colors active:scale-[0.97]"
            >
              <span>Explore Methodology</span>
              <ArrowUpRight size={15} strokeWidth={1.75} className="text-muted" />
            </button>
          </div>
        </div>

        {/* Live Interactive Triage Simulator */}
        <div className="mt-2 pt-8 border-t border-hairline">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-amber-600" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-semibold">
                  Live Triage Preview
                </span>
              </div>
              <p className="text-[14px] font-sans text-body">
                Select a sample comment below to observe the deterministic triage pipeline in action:
              </p>
            </div>
            <span className="text-[11px] font-mono text-muted bg-canvas-soft border border-hairline px-3 py-1 rounded-full self-start sm:self-auto select-none">
              O(1) Matrix Evaluation
            </span>
          </div>

          {/* Sample selector chips (All 5 classes represented) */}
          <div className="flex flex-wrap gap-2 mb-5">
            {PRESET_DEMOS.map((demo) => {
              const isSelected = selectedDemo.id === demo.id;
              return (
                <button
                  key={demo.id}
                  onClick={() => setSelectedDemo(demo)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-sans font-medium transition-all duration-150 ease-out active:scale-[0.96] ${
                    isSelected
                      ? "bg-ink text-white font-semibold shadow-xs"
                      : "bg-canvas-soft border border-hairline text-body hover:border-hairline-strong hover:text-ink"
                  }`}
                >
                  {demo.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Verdict Preview Card (Apple Inspector Surface) */}
          <div className="bg-canvas-soft/80 border border-hairline rounded-2xl p-6 sm:p-7 flex flex-col gap-5">
            <p className="text-[16px] sm:text-[17px] font-sans text-ink leading-relaxed font-normal">
              &ldquo;{selectedDemo.text}&rdquo;
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-hairline/80">
              {/* Intent Cell */}
              <div className="flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-muted" />
                  <span>Primary Intent</span>
                </span>
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-sans font-semibold border ${activeTheme.bg} ${activeTheme.text} ${activeTheme.border}`}
                  >
                    {selectedDemo.intent}
                  </span>
                  <span className="text-[11px] font-mono text-muted block mt-1.5 tabular-nums">
                    {selectedDemo.confidence} confidence
                  </span>
                </div>
              </div>

              {/* Sentiment Cell */}
              <div className="flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1.5">
                  <Activity size={12} className="text-muted" />
                  <span>Sentiment</span>
                </span>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-mono font-medium ${
                      selectedDemo.sentiment === "POSITIVE"
                        ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                        : selectedDemo.sentiment === "NEGATIVE"
                        ? "text-red-700 bg-red-50 border border-red-200"
                        : "text-blue-700 bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedDemo.sentiment === "POSITIVE"
                          ? "bg-emerald-600"
                          : selectedDemo.sentiment === "NEGATIVE"
                          ? "bg-red-600"
                          : "bg-blue-600"
                      }`}
                    />
                    {selectedDemo.sentiment}
                  </span>
                  <span className="text-[11px] font-mono text-muted block mt-1.5 tabular-nums">
                    {selectedDemo.sentimentScore} intensity
                  </span>
                </div>
              </div>

              {/* Tone & Urgency Cell */}
              <div className="flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-muted" />
                  <span>Tone &amp; Urgency</span>
                </span>
                <div>
                  <p className="text-[14px] font-serif font-medium text-ink">
                    {selectedDemo.tone}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-mono mt-1 ${
                      selectedDemo.urgency === "High" ? "text-red-700 font-semibold" : "text-emerald-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedDemo.urgency === "High" ? "bg-red-600" : "bg-emerald-600"
                      }`}
                    />
                    {selectedDemo.urgency} Urgency
                  </span>
                </div>
              </div>

              {/* Action Cell */}
              <div className="flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-muted" />
                  <span>Operational Route</span>
                </span>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium bg-surface-card border border-hairline px-3 py-1.5 rounded-lg text-ink shadow-2xs">
                    <span>{selectedDemo.action}</span>
                  </span>
                  <span className="text-[11px] font-mono text-muted block mt-1.5">
                    Standard Operating Procedure
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars (Bento Grid) */}
      <div>
        <div className="mb-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-muted block mb-1 select-none">
            Technical Foundations
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-ink tracking-tight">
            Engine Architecture at a Glance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-surface-card border border-hairline rounded-2xl p-7 shadow-xs flex flex-col justify-between hover:border-hairline-strong transition-all duration-150">
            <div>
              <div className="w-10 h-10 rounded-xl bg-canvas-soft border border-hairline flex items-center justify-center text-ink mb-4 shadow-2xs">
                <Zap size={18} strokeWidth={2} />
              </div>
              <h4 className="font-serif text-xl font-medium text-ink mb-2">
                CPU-Native Inference
              </h4>
              <p className="text-[14px] text-body leading-relaxed">
                Uses an <code className="text-xs font-mono bg-canvas-soft px-1.5 py-0.5 rounded border border-hairline">all-MiniLM-L6-v2</code> SentenceTransformer backbone paired with an L2-regularized logistic classification head.
              </p>
            </div>
            <div className="pt-6 border-t border-hairline mt-6 flex items-center justify-between text-[12px] font-mono text-muted">
              <span>Execution</span>
              <strong className="text-ink">In-Memory Model Pipeline</strong>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-surface-card border border-hairline rounded-2xl p-7 shadow-xs flex flex-col justify-between hover:border-hairline-strong transition-all duration-150">
            <div>
              <div className="w-10 h-10 rounded-xl bg-canvas-soft border border-hairline flex items-center justify-center text-ink mb-4 shadow-2xs">
                <Layers size={18} strokeWidth={1.75} />
              </div>
              <h4 className="font-serif text-xl font-medium text-ink mb-2">
                Leave-One-Out Token XAI
              </h4>
              <p className="text-[14px] text-body leading-relaxed">
                Evaluates exact word-level attribution without surrogate SHAP/LIME approximations by measuring marginal probability delta (<span className="font-mono text-xs">ΔP</span>) across masked token permutations.
              </p>
            </div>
            <div className="pt-6 border-t border-hairline mt-6 flex items-center justify-between text-[12px] font-mono text-muted">
              <span>Explainability</span>
              <strong className="text-ink">Zero-Surrogate Math</strong>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-surface-card border border-hairline rounded-2xl p-7 shadow-xs flex flex-col justify-between hover:border-hairline-strong transition-all duration-150">
            <div>
              <div className="w-10 h-10 rounded-xl bg-canvas-soft border border-hairline flex items-center justify-center text-ink mb-4 shadow-2xs">
                <Database size={18} strokeWidth={1.75} />
              </div>
              <h4 className="font-serif text-xl font-medium text-ink mb-2">
                Constant-Memory Streaming
              </h4>
              <p className="text-[14px] text-body leading-relaxed">
                Processes massive CSV archives through chunked HTTP streaming generators in 32-sample batches, maintaining a constant ~45MB RAM footprint on standard server hardware.
              </p>
            </div>
            <div className="pt-6 border-t border-hairline mt-6 flex items-center justify-between text-[12px] font-mono text-muted">
              <span>Memory Footprint</span>
              <strong className="text-ink tabular-nums">~45MB Constant RAM</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Navigation Cards (Balanced 4-Pillar Grid) */}
      <div>
        <div className="mb-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-muted block mb-1 select-none">
            Workspace Navigation
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-ink tracking-tight">
            Explore Platform Capabilities
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Single Analysis */}
          <button
            onClick={() => onNavigate("single")}
            className="p-6 rounded-2xl bg-surface-card border border-hairline text-left hover:border-hairline-strong transition-all duration-150 ease-out active:scale-[0.98] shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-canvas-soft border border-hairline flex items-center justify-center text-ink mb-4 group-hover:bg-ink group-hover:text-white transition-colors">
                <Zap size={16} strokeWidth={1.75} />
              </div>
              <h4 className="text-[16px] font-serif font-medium text-ink mb-1.5 flex items-center justify-between">
                <span>Single Analysis</span>
                <ArrowRight size={14} className="text-muted group-hover:text-ink group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-[13px] text-body leading-relaxed text-pretty">
                Inspect individual comments with word-level occlusion heatmaps, multi-intent radar charts, and SOP triage.
              </p>
            </div>
            <span className="text-[11px] font-mono text-muted mt-5 block pt-3 border-t border-hairline/60">
              Interactive Sandbox →
            </span>
          </button>

          {/* Card 2: Batch Processing */}
          <button
            onClick={() => onNavigate("batch")}
            className="p-6 rounded-2xl bg-surface-card border border-hairline text-left hover:border-hairline-strong transition-all duration-150 ease-out active:scale-[0.98] shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-canvas-soft border border-hairline flex items-center justify-center text-ink mb-4 group-hover:bg-ink group-hover:text-white transition-colors">
                <Database size={16} strokeWidth={1.75} />
              </div>
              <h4 className="text-[16px] font-serif font-medium text-ink mb-1.5 flex items-center justify-between">
                <span>Batch Streaming</span>
                <ArrowRight size={14} className="text-muted group-hover:text-ink group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-[13px] text-body leading-relaxed text-pretty">
                Upload or stream multi-thousand row CSV feedback datasets with live counters and formatted downloads.
              </p>
            </div>
            <span className="text-[11px] font-mono text-muted mt-5 block pt-3 border-t border-hairline/60">
              Streaming Engine →
            </span>
          </button>

          {/* Card 3: Methodology */}
          <button
            onClick={() => onNavigate("methodology")}
            className="p-6 rounded-2xl bg-surface-card border border-hairline text-left hover:border-hairline-strong transition-all duration-150 ease-out active:scale-[0.98] shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-canvas-soft border border-hairline flex items-center justify-center text-ink mb-4 group-hover:bg-ink group-hover:text-white transition-colors">
                <BookOpen size={16} strokeWidth={1.75} />
              </div>
              <h4 className="text-[16px] font-serif font-medium text-ink mb-1.5 flex items-center justify-between">
                <span>Methodology &amp; ML</span>
                <ArrowRight size={14} className="text-muted group-hover:text-ink group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-[13px] text-body leading-relaxed text-pretty">
                Learn the mathematics of Leave-One-Out occlusion, Cardiff Twitter-RoBERTa sentiment, and SOP triage.
              </p>
            </div>
            <span className="text-[11px] font-mono text-muted mt-5 block pt-3 border-t border-hairline/60">
              Read Methodology →
            </span>
          </button>

          {/* Card 4: Architecture & Docs */}
          <button
            onClick={() => onNavigate("architecture")}
            className="p-6 rounded-2xl bg-surface-card border border-hairline text-left hover:border-hairline-strong transition-all duration-150 ease-out active:scale-[0.98] shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-canvas-soft border border-hairline flex items-center justify-center text-ink mb-4 group-hover:bg-ink group-hover:text-white transition-colors">
                <Layers size={16} strokeWidth={1.75} />
              </div>
              <h4 className="text-[16px] font-serif font-medium text-ink mb-1.5 flex items-center justify-between">
                <span>Docs &amp; Specs</span>
                <ArrowRight size={14} className="text-muted group-hover:text-ink group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-[13px] text-body leading-relaxed text-pretty">
                Explore interactive system blueprints, benchmarks against LLM APIs, and REST API Swagger endpoints.
              </p>
            </div>
            <span className="text-[11px] font-mono text-muted mt-5 block pt-3 border-t border-hairline/60">
              System Whitepaper →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
