"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { RouteView } from "@/router";
import {
  Zap,
  Layers,
  ArrowRight,
  Database,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Activity,
  ArrowUpRight,
  Shuffle,
  Copy,
  Check,
  Edit3,
  SlidersHorizontal,
  Cpu,
  Terminal,
  Play,
  Pause,
  ArrowDownRight,
} from "lucide-react";


interface OverviewViewProps {
  onNavigate: (view: RouteView, subTab?: string) => void;
}

interface DemoScenario {
  id: string;
  label: string;
  text: string;
  intent: string;
  confidence: number; // e.g. 96.2
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  sentimentScore: number; // e.g. 94.0
  tone: string;
  urgency: "High" | "Medium" | "Low";
  action: string;
  tokens: { word: string; drop: number; isKey?: boolean }[];
}

const PRESET_DEMOS: DemoScenario[] = [
  {
    id: "bug",
    label: "Bug Report",
    text: "The application crashes every time I click export on large PDF tables!",
    intent: "Bug Report",
    confidence: 96.2,
    sentiment: "NEGATIVE",
    sentimentScore: 94.0,
    tone: "Frustrated",
    urgency: "High",
    action: "Log Jira Ticket",
    tokens: [
      { word: "The", drop: 0.2 },
      { word: "application", drop: 4.5 },
      { word: "crashes", drop: 48.2, isKey: true },
      { word: "every", drop: 1.5 },
      { word: "time", drop: 0.8 },
      { word: "I", drop: 0.1 },
      { word: "click", drop: 3.2 },
      { word: "export", drop: 6.5, isKey: true },
      { word: "on", drop: 0.2 },
      { word: "large", drop: 1.1 },
      { word: "PDF", drop: 3.5 },
      { word: "tables!", drop: 2.4 },
    ],
  },
  {
    id: "feature",
    label: "Feature Request",
    text: "Please add automated webhook notifications for ticket status updates.",
    intent: "Feature Request",
    confidence: 94.1,
    sentiment: "POSITIVE",
    sentimentScore: 85.2,
    tone: "Constructive",
    urgency: "Low",
    action: "Add to Roadmap",
    tokens: [
      { word: "Please", drop: 3.1 },
      { word: "add", drop: 28.5, isKey: true },
      { word: "automated", drop: 8.4 },
      { word: "webhook", drop: 24.5, isKey: true },
      { word: "notifications", drop: 14.2, isKey: true },
      { word: "for", drop: 0.2 },
      { word: "ticket", drop: 1.8 },
      { word: "status", drop: 2.1 },
      { word: "updates.", drop: 4.0 },
    ],
  },
  {
    id: "complaint",
    label: "Billing Issue",
    text: "We were billed twice this month and support has not responded after 48 hours.",
    intent: "Complaint",
    confidence: 95.5,
    sentiment: "NEGATIVE",
    sentimentScore: 92.4,
    tone: "Angry",
    urgency: "High",
    action: "Route to Priority Support",
    tokens: [
      { word: "We", drop: 0.1 },
      { word: "were", drop: 0.2 },
      { word: "billed", drop: 38.5, isKey: true },
      { word: "twice", drop: 26.0, isKey: true },
      { word: "this", drop: 0.2 },
      { word: "month", drop: 1.5 },
      { word: "and", drop: 0.1 },
      { word: "support", drop: 4.2 },
      { word: "has", drop: 0.4 },
      { word: "not", drop: 18.0, isKey: true },
      { word: "responded", drop: 14.5, isKey: true },
      { word: "after", drop: 0.8 },
      { word: "48", drop: 5.1 },
      { word: "hours.", drop: 2.3 },
    ],
  },
  {
    id: "praise",
    label: "Customer Praise",
    text: "The new interface is clean, responsive, and significantly faster than before.",
    intent: "Praise",
    confidence: 98.5,
    sentiment: "POSITIVE",
    sentimentScore: 97.1,
    tone: "Delighted",
    urgency: "Low",
    action: "Share with Engineering",
    tokens: [
      { word: "The", drop: 0.1 },
      { word: "new", drop: 1.2 },
      { word: "interface", drop: 4.1 },
      { word: "is", drop: 0.3 },
      { word: "clean,", drop: 28.5, isKey: true },
      { word: "responsive,", drop: 24.2, isKey: true },
      { word: "and", drop: 0.2 },
      { word: "significantly", drop: 8.5 },
      { word: "faster", drop: 38.0, isKey: true },
      { word: "than", drop: 0.5 },
      { word: "before.", drop: 1.4 },
    ],
  },
  {
    id: "question",
    label: "Account Question",
    text: "Where can I find historical API invoices and manage workspace team seats?",
    intent: "Question",
    confidence: 97.4,
    sentiment: "NEUTRAL",
    sentimentScore: 88.1,
    tone: "Inquisitive",
    urgency: "Low",
    action: "Route to Billing FAQ",
    tokens: [
      { word: "Where", drop: 32.5, isKey: true },
      { word: "can", drop: 12.1 },
      { word: "I", drop: 0.5 },
      { word: "find", drop: 16.4, isKey: true },
      { word: "historical", drop: 4.2 },
      { word: "API", drop: 8.5 },
      { word: "invoices", drop: 18.2, isKey: true },
      { word: "and", drop: 0.2 },
      { word: "manage", drop: 14.5 },
      { word: "workspace", drop: 3.1 },
      { word: "team", drop: 4.5 },
      { word: "seats?", drop: 6.2 },
    ],
  },
  {
    id: "performance",
    label: "Performance Lag",
    text: "Query latency exceeds 3 seconds whenever filtering by multiple custom tag attributes.",
    intent: "Bug Report",
    confidence: 92.8,
    sentiment: "NEGATIVE",
    sentimentScore: 89.4,
    tone: "Frustrated",
    urgency: "High",
    action: "Log Performance Degradation",
    tokens: [
      { word: "Query", drop: 4.2 },
      { word: "latency", drop: 26.5, isKey: true },
      { word: "exceeds", drop: 18.2, isKey: true },
      { word: "3", drop: 12.0 },
      { word: "seconds", drop: 8.4 },
      { word: "whenever", drop: 2.1 },
      { word: "filtering", drop: 5.5 },
      { word: "by", drop: 0.1 },
      { word: "multiple", drop: 1.2 },
      { word: "custom", drop: 0.8 },
      { word: "tag", drop: 1.4 },
      { word: "attributes.", drop: 2.0 },
    ],
  },
];

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const [selectedDemo, setSelectedDemo] = useState<DemoScenario>(PRESET_DEMOS[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [customInput, setCustomInput] = useState(PRESET_DEMOS[0].text);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroDemo = PRESET_DEMOS[heroIndex];

const handleInspectInSandbox = () => {
    handleSelectPreset(heroDemo);
    const sandboxEl = document.getElementById("benchmark-sandbox");
    if (sandboxEl) {
      sandboxEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectPreset = (demo: DemoScenario) => {
    setSelectedDemo(demo);
    setCustomInput(demo.text);
    setIsEditing(false);
    setHoveredTokenIdx(null);
  };

  const handleShuffle = () => {
    const currentIndex = PRESET_DEMOS.findIndex((d) => d.id === selectedDemo.id);
    const nextIndex = (currentIndex + 1) % PRESET_DEMOS.length;
    handleSelectPreset(PRESET_DEMOS[nextIndex]);
  };

  const handleCopyJSON = () => {
    const payload = {
      comment: isEditing ? customInput : selectedDemo.text,
      verdict: {
        intent: selectedDemo.intent,
        confidence: `${selectedDemo.confidence}%`,
        sentiment: selectedDemo.sentiment,
        sentimentScore: `${selectedDemo.sentimentScore}%`,
        tone: selectedDemo.tone,
        urgency: selectedDemo.urgency,
        recommendedAction: selectedDemo.action,
      },
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToWorkbench = () => {
    const textToSend = isEditing ? customInput : selectedDemo.text;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("analyze_prefill", textToSend);
    }
    onNavigate("single");
  };

  return (
    <div className="page-container">
      {/* Light Editorial Canvas Hero matching the website palette (canvas-cream, aloe-10 & pistachio-10) */}
      <section className="relative overflow-hidden bg-white text-ink rounded-xl sm:rounded-2xl p-6 sm:p-10 lg:p-12 border border-hairline-light shadow-sm transition-all duration-200 mt-1 sm:mt-2">
        {/* Soft ambient aloe & pistachio glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-aloe-10/50 via-pistachio-10/25 to-transparent pointer-events-none rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-aloe-10/25 via-transparent to-transparent pointer-events-none rounded-full blur-2xl -z-0" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch relative z-10">
          {/* Left Column: Spacious Display Headline, Narrative & Hardware Metrics */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* pill-tag-mint component per DESIGN.md */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-pill bg-aloe-10 text-ink border border-emerald-300/50 shadow-xs mb-5 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-800" />
                <span className="text-[12px] font-sans font-semibold uppercase tracking-[0.72px] text-emerald-950">
                  Deterministic Local NLP • CPU-Native
                </span>
              </div>

              {/* Display Headline per DESIGN.md (Inter Tight, weight 330) */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[60px] font-[330] text-ink tracking-[-0.03em] leading-[1.08] text-balance mb-5">
                Triage feedback, <br className="hidden sm:inline" />
                <span className="text-shade-50">down to the token.</span>
              </h1>

              {/* Editorial Narrative (body-lg, Inter 420) */}
              <p className="text-[17px] sm:text-[18px] font-sans text-shade-60 font-[420] leading-relaxed max-w-xl text-pretty mb-8">
                Continuous 384-dimensional dense embeddings paired with microsecond logistic classification and Leave-One-Out token attribution on commodity CPU. Zero cloud API calls, zero token invoices, and complete on-premise data privacy.
              </p>

              {/* Button components: Primary pill & Outline pill */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 mb-8">
                {/* button-primary-pill: Primary Featured CTA */}
                <button
                  onClick={() => onNavigate("single")}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-pill bg-ink text-white hover:bg-shade-70 text-[15px] font-sans font-medium transition-all duration-150 active:scale-[0.98] shadow-sm select-none"
                >
                  <span>Analyze Single Comment</span>
                  <ArrowRight size={15} strokeWidth={2.25} />
                </button>

                {/* button-outline-on-light: Clean Secondary CTA */}
                <button
                  onClick={() => onNavigate("batch")}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-pill bg-canvas-cream text-ink border border-hairline-light hover:border-shade-40 hover:bg-white text-[15px] font-sans font-medium transition-all duration-150 active:scale-[0.98] shadow-xs select-none"
                >
                  <span>Stream Batch CSV</span>
                  <FileSpreadsheet size={15} strokeWidth={1.75} />
                </button>

                {/* Architecture Blueprint Navigation */}
                <button
                  onClick={() => onNavigate("architecture", "pipeline")}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-shade-60 hover:text-ink text-[14px] font-sans font-medium transition-colors select-none"
                >
                  <span>Architecture Specs</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* Hardware Guarantees Metric Strip on Light Canvas */}
            <div className="pt-6 border-t border-hairline-light grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <span className="text-[11px] font-mono text-shade-50 uppercase tracking-wider block mb-1">Inference</span>
                <span className="text-[15px] sm:text-[16px] font-mono font-semibold text-emerald-800 bg-aloe-10/70 border border-emerald-300/50 px-2 py-0.5 rounded tabular-nums inline-block">
                  ~12.4ms CPU
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-shade-50 uppercase tracking-wider block mb-1">Vector Space</span>
                <span className="text-[15px] sm:text-[16px] font-mono font-semibold text-ink tabular-nums">
                  384d Dense
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-shade-50 uppercase tracking-wider block mb-1">Throughput</span>
                <span className="text-[15px] sm:text-[16px] font-mono font-semibold text-ink tabular-nums">
                  280+ req/s
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-shade-50 uppercase tracking-wider block mb-1">Privacy</span>
                <span className="text-[15px] sm:text-[16px] font-mono font-semibold text-ink tabular-nums">
                  100% Offline
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Proportionate XAI Showcase Console */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-canvas-cream/80 border border-hairline-light rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4 relative overflow-hidden backdrop-blur-xs flex-1">
              {/* Header: Title and Scenario Tabs */}
              <div className="flex flex-col gap-2.5 pb-3 border-b border-hairline-light">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider">
                  <span className="flex items-center gap-2 text-ink font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Explainable XAI Showcase</span>
                  </span>
                  <span className="text-shade-50 font-medium">MiniLM-L6-v2</span>
                </div>

                {/* Scenario Tabs */}
                <div className="grid grid-cols-4 gap-1 p-1 rounded-full bg-white border border-hairline-light shadow-2xs mt-1">
                  {[
                    { label: "Bug Report", short: "Bug", idx: 0 },
                    { label: "Feature", short: "Feature", idx: 1 },
                    { label: "Billing", short: "Billing", idx: 2 },
                    { label: "Praise", short: "Praise", idx: 3 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setHeroIndex(item.idx)}
                      className={`py-1 rounded-full text-[11px] font-sans text-center transition-all duration-150 select-none truncate ${
                        heroIndex === item.idx
                          ? "bg-ink text-white font-semibold shadow-xs"
                          : "text-shade-60 hover:text-ink font-medium"
                      }`}
                    >
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="sm:hidden">{item.short}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Comment with Interactive Token Heatmap Chips */}
              <div className="bg-white border border-hairline-light rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-2xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-shade-50 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <Sparkles size={11} className="text-amber-600" />
                    <span>Input Token Permutations</span>
                  </span>
                  <span>Hover for ΔP</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroDemo.id}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-wrap gap-1.5 sm:gap-2 leading-relaxed text-[14px]"
                  >
                    {heroDemo.tokens.map((token, tIdx) => {
                      const isHigh = token.drop > 10;
                      const isMedium = token.drop > 3.5;
                      return (
                        <span
                          key={tIdx}
                          title={`${token.word}: marginal attribution drop ΔP -${token.drop.toFixed(1)}%`}
                          className={`px-2 py-0.5 rounded cursor-default transition-all duration-150 relative group ${
                            isHigh
                              ? "bg-rose-50 text-rose-800 border border-rose-300 font-semibold shadow-2xs"
                              : isMedium
                              ? "bg-amber-50 text-amber-900 border border-amber-300 font-medium"
                              : "text-shade-70 hover:bg-zinc-100"
                          }`}
                        >
                          {token.word}
                          {isHigh && (
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-ink text-white text-[10px] font-mono py-0.5 px-2 rounded shadow-sm whitespace-nowrap z-20 font-semibold">
                              ΔP -{token.drop.toFixed(1)}%
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                {/* Key Occlusion Insight Banner */}
                {(() => {
                  const topToken = [...heroDemo.tokens].sort((a, b) => b.drop - a.drop)[0];
                  return (
                    <div className="pt-2.5 border-t border-hairline-light/70 flex items-center justify-between text-[11px] font-mono text-shade-60">
                      <span>Primary Feature Driver:</span>
                      <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        "{topToken.word}" → -{topToken.drop.toFixed(1)}% ΔP
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Verdict Summary Cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroDemo.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="grid grid-cols-2 gap-2.5 text-left"
                >
                  {/* Card 1: Intent & Action */}
                  <div className="bg-white border border-hairline-light rounded-xl p-3 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-shade-50 block mb-1">
                      Intent &amp; Routing
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] font-sans font-semibold text-ink">
                          {heroDemo.intent}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-800 bg-aloe-10 border border-emerald-200 font-semibold tabular-nums px-1.5 py-0.5 rounded-full">
                          {heroDemo.confidence}%
                        </span>
                      </div>
                      <span className="text-[11px] font-sans text-shade-60 flex items-center gap-1 mt-1 truncate">
                        <span>→ {heroDemo.action}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Urgency & Sentiment */}
                  <div className="bg-white border border-hairline-light rounded-xl p-3 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-shade-50 block mb-1">
                      Urgency &amp; Sentiment
                    </span>
                    <div>
                      <div className="text-[14px] font-sans font-semibold text-ink flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            heroDemo.urgency === "High" ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                        />
                        <span>{heroDemo.urgency} Priority</span>
                      </div>
                      <span className="text-[11px] font-sans text-shade-60 flex items-center gap-1.5 mt-1 truncate">
                        <span>{heroDemo.sentiment}</span>
                        <span>•</span>
                        <span>{heroDemo.tone}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-hairline-light flex items-center justify-between text-[11px] font-mono">
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("analyze_prefill", heroDemo.text);
                    }
                    onNavigate("single");
                  }}
                  className="inline-flex items-center gap-1.5 text-ink hover:text-emerald-800 font-sans font-semibold transition-colors group select-none"
                >
                  <span>Test in Workbench</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={handleInspectInSandbox}
                  className="text-shade-50 hover:text-ink transition-colors font-sans select-none"
                >
                  Full Sandbox ↘
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Interactive Triage Playground Section */}
      <section id="benchmark-sandbox" className="surface-card-base flex flex-col gap-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-hairline-light">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={15} className="text-amber-600" />
              <span className="eyebrow-cap">
                Interactive Benchmark Sandbox
              </span>
            </div>
            <h2 className="section-heading text-2xl font-[330]">
              Real-Time Inference Playground
            </h2>
            <p className="text-[14px] font-sans text-shade-60 mt-1">
              Select a customer scenario, shuffle inputs, or type custom feedback to inspect live token attribution:
            </p>
          </div>

          {/* Interactive Control Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[12px] font-sans text-shade-60 hover:text-ink bg-canvas-cream hover:bg-white border border-hairline-light transition-all active:scale-[0.97] shadow-xs select-none"
              title="Shuffle through realistic sample cases"
            >
              <Shuffle size={13} className="text-shade-50" />
              <span>Shuffle Case</span>
            </button>

            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[12px] font-sans transition-all active:scale-[0.97] select-none ${
                isEditing
                  ? "bg-black text-white font-medium shadow-sm"
                  : "bg-canvas-cream hover:bg-white border border-hairline-light text-shade-60 hover:text-ink"
              }`}
              title="Type your own custom comment"
            >
              <Edit3 size={13} />
              <span>{isEditing ? "Done Editing" : "Custom Text"}</span>
            </button>

            <button
              onClick={() => setShowHeatmap((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[12px] font-sans transition-all active:scale-[0.97] select-none ${
                showHeatmap
                  ? "bg-canvas-cream border border-shade-40 text-ink font-medium"
                  : "bg-canvas-cream border border-hairline-light text-shade-50 hover:text-ink"
              }`}
              title="Toggle token importance attribution highlights"
            >
              <SlidersHorizontal size={13} />
              <span>Token Heatmap</span>
            </button>
          </div>
        </div>

        {/* Preset Selector Chips with smooth sliding pill layoutId */}
        <div className="flex flex-wrap gap-2 mb-5">
          {PRESET_DEMOS.map((demo) => {
            const isSelected = selectedDemo.id === demo.id && !isEditing;
            return (
              <button
                key={demo.id}
                onClick={() => handleSelectPreset(demo)}
                className={`relative px-3.5 py-1.5 rounded-pill text-[13px] font-sans font-medium transition-colors duration-150 ease-out active:scale-[0.97] select-none ${
                  isSelected
                    ? "text-white font-semibold shadow-sm"
                    : "bg-canvas-cream border border-hairline-light text-shade-60 hover:text-black hover:border-shade-40"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="overview-preset-pill"
                    className="absolute inset-0 rounded-pill bg-black"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{demo.label}</span>
              </button>
            );
          })}
        </div>

        {/* Verdict Preview Surface Card */}
        <div className="bg-canvas-cream border border-hairline-light rounded-xl p-6 sm:p-7 flex flex-col gap-6 shadow-inner transition-all">
          {/* Comment View / Edit Box */}
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-sans uppercase tracking-[0.72px] text-shade-50 font-semibold">
                Type or paste custom feedback to triage:
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows={3}
                className="w-full p-4 bg-white border border-hairline-light rounded-lg text-ink font-sans text-[16px] focus:outline-none focus:border-black transition-all resize-none shadow-sm"
                placeholder="Enter feedback statement..."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans uppercase tracking-[0.72px] text-shade-50 font-semibold select-none">
                  Statement Under Analysis
                </span>
                {showHeatmap && (
                  <span className="text-[11px] font-mono text-shade-50 select-none">
                    Hover words to inspect marginal attribution (ΔP)
                  </span>
                )}
              </div>

              {showHeatmap ? (
                <div className="flex flex-wrap gap-1.5 leading-relaxed text-[17px] sm:text-[19px] font-sans text-ink select-text py-1">
                  {selectedDemo.tokens.map((token, idx) => {
                    const isHovered = hoveredTokenIdx === idx;
                    const isSignificant = token.drop >= 10;
                    return (
                      <span
                        key={idx}
                        onMouseEnter={() => setHoveredTokenIdx(idx)}
                        onMouseLeave={() => setHoveredTokenIdx(null)}
                        onClick={() => setHoveredTokenIdx(hoveredTokenIdx === idx ? null : idx)}
                        className={`relative px-1.5 py-0.5 rounded cursor-pointer transition-all duration-150 ${
                          isSignificant
                            ? "bg-amber-100/70 border border-amber-300/60 font-medium text-ink"
                            : "hover:bg-black/5"
                        } ${isHovered ? "ring-2 ring-black bg-white shadow-xs" : ""}`}
                        title={`Occlusion Impact: -${token.drop.toFixed(1)}% drop if masked`}
                      >
                        {token.word}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.span
                              initial={{ opacity: 0, y: 3, scale: 0.94 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.94 }}
                              transition={{ duration: 0.14 }}
                              className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-pill bg-black text-white text-[10px] font-mono whitespace-nowrap shadow-md z-20 pointer-events-none"
                            >
                              ΔP: -{token.drop.toFixed(1)}%
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="font-display text-[18px] sm:text-[20px] font-[330] text-ink leading-relaxed">
                  &ldquo;{selectedDemo.text}&rdquo;
                </p>
              )}
            </div>
          )}

            {/* Structured Verdict Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-5 border-t border-hairline-light">
              {/* Intent Cell */}
              <div className="flex flex-col justify-between">
                <span className="text-[11px] font-sans uppercase tracking-[0.72px] text-shade-50 mb-2 flex items-center gap-1.5 font-medium">
                  <Sparkles size={12} className="text-amber-600" />
                  <span>Primary Intent</span>
                </span>
                <div>
                  <span className="inline-flex items-center px-3.5 py-1 rounded-pill text-[13px] font-sans font-semibold bg-white border border-hairline-light text-ink shadow-sm">
                    {selectedDemo.intent}
                  </span>
                  {/* Dynamic Progress Bar */}
                  <div className="mt-2.5">
                    <div className="w-full bg-hairline-light h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-black h-full rounded-full transition-all duration-300"
                        style={{ width: `${selectedDemo.confidence}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-shade-50 block mt-1.5 tabular-nums">
                      {selectedDemo.confidence}% calibrated confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Sentiment Cell */}
              <div className="flex flex-col justify-between">
                <span className="text-[11px] font-sans uppercase tracking-[0.72px] text-shade-50 mb-2 flex items-center gap-1.5 font-medium">
                  <Activity size={12} className="text-shade-40" />
                  <span>Sentiment Polarity</span>
                </span>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[12px] font-mono font-medium bg-white border border-hairline-light text-ink shadow-sm">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedDemo.sentiment === "POSITIVE"
                          ? "bg-emerald-600"
                          : selectedDemo.sentiment === "NEGATIVE"
                          ? "bg-rose-600"
                          : "bg-blue-600"
                      }`}
                    />
                    {selectedDemo.sentiment}
                  </span>
                  {/* Dynamic Sentiment Meter */}
                  <div className="mt-2.5">
                    <div className="w-full bg-hairline-light h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          selectedDemo.sentiment === "POSITIVE"
                            ? "bg-emerald-600"
                            : selectedDemo.sentiment === "NEGATIVE"
                            ? "bg-rose-600"
                            : "bg-blue-600"
                        }`}
                        style={{ width: `${selectedDemo.sentimentScore}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-shade-50 block mt-1.5 tabular-nums">
                      {selectedDemo.sentimentScore}% polarity intensity
                    </span>
                  </div>
                </div>
              </div>

              {/* Tone & Urgency Cell */}
              <div className="flex flex-col justify-between">
                <span className="text-[11px] font-sans uppercase tracking-[0.72px] text-shade-50 mb-2 flex items-center gap-1.5 font-medium">
                  <ShieldCheck size={12} className="text-shade-40" />
                  <span>Tone &amp; Urgency</span>
                </span>
                <div>
                  <p className="font-display text-[16px] font-[330] text-ink">
                    {selectedDemo.tone}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[12px] font-mono mt-1 ${
                      selectedDemo.urgency === "High"
                        ? "text-rose-700 font-semibold"
                        : "text-emerald-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedDemo.urgency === "High" ? "bg-rose-600" : "bg-emerald-600"
                      }`}
                    />
                    {selectedDemo.urgency} Urgency
                  </span>
                </div>
              </div>

              {/* Action Cell */}
              <div className="flex flex-col justify-between">
                <span className="text-[11px] font-sans uppercase tracking-[0.72px] text-shade-50 mb-2 flex items-center gap-1.5 font-medium">
                  <ArrowRight size={12} className="text-shade-40" />
                  <span>Operational Route</span>
                </span>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-medium bg-white border border-hairline-light px-3.5 py-1.5 rounded-pill text-ink shadow-sm">
                    <span>{selectedDemo.action}</span>
                  </span>
                  <span className="text-[11px] font-sans text-shade-50 block mt-1.5">
                    Deterministic SOP Dispatch
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Playground Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-hairline-light text-[12px] font-sans">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJSON}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-pill bg-white border border-hairline-light text-shade-60 hover:text-ink active:scale-[0.96] transition-all shadow-xs w-full sm:w-auto"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1.5 text-emerald-700 font-medium"
                      >
                        <Check size={12} className="text-emerald-600" />
                        <span>Copied JSON!</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1.5"
                      >
                        <Copy size={12} />
                        <span>Copy Triage JSON</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => onNavigate("architecture", "occlusion")}
                  className="text-shade-50 hover:text-ink transition-colors underline-offset-4 hover:underline text-center sm:text-left py-1"
                >
                  View Occlusion Math →
                </button>
                <button
                  onClick={handleSendToWorkbench}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-black text-white font-medium hover:bg-shade-80 active:scale-95 transition-all shadow-xs w-full sm:w-auto"
                >
                  <span>Open in Single Workbench</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </section>

      {/* Technical Foundations (Bento Grid on White Surface Cards) */}
      <section className="pt-6">
        <div className="mb-6">
          <span className="text-[12px] font-sans uppercase tracking-[0.72px] font-semibold text-shade-50 block mb-1 select-none">
            Architectural Blueprint
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-[330] text-ink tracking-tight">
            Engine Architecture at a Glance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="surface-card-base flex flex-col justify-between hover:border-shade-40 transition-colors duration-150"
          >
            <div>
              <div className="w-11 h-11 rounded-pill bg-canvas-cream border border-hairline-light flex items-center justify-center text-ink mb-5 shadow-sm">
                <Zap size={20} strokeWidth={2} />
              </div>
              <h3 className="font-display text-2xl font-[330] text-ink mb-2.5">
                CPU-Native Inference
              </h3>
              <p className="text-[14px] text-shade-60 font-sans leading-relaxed">
                Uses an <code className="text-xs font-mono bg-canvas-cream px-2 py-0.5 rounded-pill border border-hairline-light text-ink">all-MiniLM-L6-v2</code> transformer embedding backbone paired with an L2-regularized logistic classification head.
              </p>
            </div>
            <div className="pt-6 border-t border-hairline-light mt-6 flex items-center justify-between text-[12px] font-mono text-shade-50">
              <span>Execution</span>
              <strong className="text-ink">In-Memory Pipeline</strong>
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="surface-card-base flex flex-col justify-between hover:border-shade-40 transition-colors duration-150"
          >
            <div>
              <div className="w-11 h-11 rounded-pill bg-canvas-cream border border-hairline-light flex items-center justify-center text-ink mb-5 shadow-sm">
                <Layers size={20} strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-2xl font-[330] text-ink mb-2.5">
                Leave-One-Out Token XAI
              </h3>
              <p className="text-[14px] text-shade-60 font-sans leading-relaxed">
                Evaluates exact word-level attribution without surrogate SHAP/LIME approximations by measuring marginal probability delta (<span className="font-mono text-xs text-ink font-bold">ΔP</span>) across masked token permutations.
              </p>
            </div>
            <div className="pt-6 border-t border-hairline-light mt-6 flex items-center justify-between text-[12px] font-mono text-shade-50">
              <span>Explainability</span>
              <strong className="text-ink">Zero-Surrogate Math</strong>
            </div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="surface-card-base flex flex-col justify-between hover:border-shade-40 transition-colors duration-150"
          >
            <div>
              <div className="w-11 h-11 rounded-pill bg-canvas-cream border border-hairline-light flex items-center justify-center text-ink mb-5 shadow-sm">
                <Database size={20} strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-2xl font-[330] text-ink mb-2.5">
                Constant-Memory Streaming
              </h3>
              <p className="text-[14px] text-shade-60 font-sans leading-relaxed">
                Processes massive CSV archives through chunked HTTP streaming generators in 32-sample batches, maintaining a constant ~45MB RAM footprint on standard server hardware.
              </p>
            </div>
            <div className="pt-6 border-t border-hairline-light mt-6 flex items-center justify-between text-[12px] font-mono text-shade-50">
              <span>Streaming</span>
              <strong className="text-ink">~45MB RAM Bound</strong>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Direct Workspace Router Strip */}
      <section className="surface-card-base flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[12px] font-sans uppercase tracking-[0.72px] font-semibold text-emerald-800 block mb-1">
            Production Ready
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-[330] text-ink">
            Ready to test live comments or batch streams?
          </h2>
          <p className="text-[14px] font-sans text-shade-60 mt-1">
            Access the real-time inference workbench or upload a customer ticket CSV.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            variant="aloe"
            size="md"
            onClick={() => onNavigate("single")}
          >
            Open Single Workbench
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate("batch")}
          >
            Launch Batch Processor
          </Button>
        </div>
      </section>
    </div>
  );
};
