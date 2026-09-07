"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { 
  Sparkles, 
  Send, 
  Trash2, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  Copy,
  Check
} from "lucide-react";

type ExplainabilityData = { word: string; contribution: number; primary_intent: string }[];

type AnalysisResult = {
  intent: {
    top_intent: string;
    top_confidence: number;
    labels: string[];
    scores: number[];
    all_intents: Record<string, number>;
  };
  sentiment: { label: string; score: number };
  explainability: ExplainabilityData;
  tone?: string;
  urgency?: string;
  recommended_action?: string;
};

const INTENT_COLORS: Record<string, { rgb: string; hex: string; text: string; bg: string }> = {
  "Bug Report": { rgb: "239, 68, 68", hex: "#ef4444", text: "text-red-700", bg: "bg-red-500/10" },
  "Complaint": { rgb: "249, 115, 22", hex: "#f97316", text: "text-orange-700", bg: "bg-orange-500/10" },
  "Feature Request": { rgb: "139, 92, 246", hex: "#8b5cf6", text: "text-purple-700", bg: "bg-purple-500/10" },
  "Praise": { rgb: "34, 197, 94", hex: "#22c55e", text: "text-emerald-700", bg: "bg-emerald-500/10" },
  "Question": { rgb: "59, 130, 246", hex: "#3b82f6", text: "text-blue-700", bg: "bg-blue-500/10" },
};

const PRESETS = [
  { label: "Bug Report", text: "The app crashes every time I click export on large PDF tables!" },
  { label: "Feature Request", text: "Please add automated webhook notifications for status updates." },
  { label: "Complaint", text: "We were billed twice this month and support has not responded." },
  { label: "Praise", text: "The new interface is clean, responsive, and much easier to navigate." },
  { label: "Question", text: "Where can I download past invoices and manage team seats?" },
];

const INTENTS = ["Bug Report", "Complaint", "Feature Request", "Praise", "Question"];

const WordContributionHeatmap = ({ data }: { data: ExplainabilityData }) => {
  if (!data || data.length === 0) return null;
  const maxAbs = Math.max(...data.map(d => Math.abs(d.contribution)), 0.001);

  return (
    <div className="flex flex-col gap-4">
      <div className="leading-relaxed whitespace-pre-wrap text-[16px] p-6 bg-canvas-cream rounded-lg border border-hairline-light font-sans text-ink flex flex-wrap gap-x-1.5 gap-y-2 select-text shadow-inner">
        {data.map((item, idx) => {
          const alpha = Math.min(Math.abs(item.contribution) / maxAbs, 1);
          const colorMeta = INTENT_COLORS[item.primary_intent];
          const bgColor = colorMeta && item.contribution > 0 ? `rgba(${colorMeta.rgb}, ${Math.max(alpha * 0.45, 0.08)})` : "transparent";

          return (
            <span
              key={idx}
              style={{ backgroundColor: alpha > 0.04 ? bgColor : "transparent" }}
              className={`px-2 py-0.5 rounded-pill transition-all cursor-default relative group ${
                alpha > 0.25 ? "font-semibold underline decoration-dotted decoration-shade-40" : ""
              }`}
              title={`${item.word} → ${item.primary_intent} (ΔP: +${(item.contribution * 100).toFixed(1)}%)`}
            >
              {item.word}
            </span>
          );
        })}
      </div>

      {/* Categorical Intent Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-hairline-light text-[12px] font-mono text-shade-50">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="font-semibold uppercase tracking-wider text-shade-50">Token Attribution:</span>
          {Object.entries(INTENT_COLORS).map(([intent, meta]) => (
            <div key={intent} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.hex }} />
              <span className="text-shade-60 font-sans text-[13px]">{intent}</span>
            </div>
          ))}
        </div>
        <span>Hover words to view marginal drop</span>
      </div>
    </div>
  );
};

export const SingleAnalysisView = () => {
  const [text, setText] = useState("");
  const [threshold, setThreshold] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefill = sessionStorage.getItem("analyze_prefill");
      if (prefill) {
        setText(prefill);
        sessionStorage.removeItem("analyze_prefill");
      }
    }
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    const startTime = performance.now();

    try {
      const res = await fetch("/semantic/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, threshold, include_explanation: true }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setLatencyMs(Math.round(performance.now() - startTime));
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to connect to API.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const loadPreset = (presetText: string) => {
    setText(presetText);
    setError("");
  };

  const handleCopySummary = () => {
    if (!result) return;
    const topConfidence = ((result.intent.all_intents[result.intent.top_intent] || 0) * 100).toFixed(1);
    const summary = `Primary Intent: ${result.intent.top_intent} (${topConfidence}%) | Sentiment: ${result.sentiment.label} (${(result.sentiment.score * 100).toFixed(1)}%) | Tone: ${result.tone || "Neutral"} | Urgency: ${result.urgency || "Low"} | Recommended Action: ${result.recommended_action || "Monitor"}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSentimentData = () => {
    if (!result) return [];
    const { label, score } = result.sentiment;
    return [
      { name: "Positive", value: label === "POSITIVE" ? score : 0, color: "#16a34a" },
      { name: "Neutral", value: label === "NEUTRAL" ? score : 0, color: "#a1a1aa" },
      { name: "Negative", value: label === "NEGATIVE" ? score : 0, color: "#dc2626" },
    ];
  };

  const getRadarData = () => {
    if (!result || !result.intent.all_intents) return [];
    return INTENTS.map((intent) => ({
      subject: intent,
      A: Math.round((result.intent.all_intents[intent] || 0) * 100),
    }));
  };

  const topMeta = result ? INTENT_COLORS[result.intent.top_intent] || { rgb: "0,0,0", hex: "#000000" } : null;

  return (
    <div className="page-container">
      {/* Transactional Page Header */}
      <PageHeader
        eyebrow="Interactive Workspace"
        title="Single Comment Analysis"
        description="Inspect deterministic multi-class intent classification, sentiment intensity, and token-level occlusion attribution in real-time."
        badge={
          <span className="pill-tag-mint select-none">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            <span>Real-time XAI Sandbox</span>
          </span>
        }
      />

      {/* Input Surface Card (Level 3 Elevation) */}
      <div className="surface-card-base">
        {/* Preset Chips */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[12px] font-sans uppercase text-shade-50 tracking-[0.72px] font-medium">
              Realistic Sample Inputs:
            </span>
            {text && (
              <button
                onClick={() => setText("")}
                className="text-[12px] font-sans text-shade-50 hover:text-ink flex items-center gap-1.5 transition-colors p-1"
                title="Clear current text"
              >
                <Trash2 size={13} />
                <span>Clear text</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const isSelected = text === preset.text;
              return (
                <button
                  key={preset.label}
                  onClick={() => loadPreset(preset.text)}
                  className={`relative px-4 py-2 rounded-pill text-[13px] font-sans font-medium transition-colors duration-150 ease-out active:scale-[0.97] select-none ${
                    isSelected
                      ? "text-white shadow-sm"
                      : "bg-canvas-cream border border-hairline-light text-shade-60 hover:text-black hover:border-shade-40"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="single-preset-pill"
                      className="absolute inset-0 rounded-pill bg-black"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste customer feedback, support ticket, or review text here... (Ctrl+Enter to analyze)"
            className="w-full bg-canvas-cream rounded-md p-4 text-[15px] font-sans text-ink border border-hairline-light focus:border-black focus:bg-white focus:outline-none transition-colors duration-150 resize-none shadow-inner leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2.5 text-[12px] font-mono text-shade-50">
            <span>Press <kbd className="bg-white px-2 py-0.5 rounded border border-hairline-light text-ink">Ctrl</kbd> + <kbd className="bg-white px-2 py-0.5 rounded border border-hairline-light text-ink">Enter</kbd></span>
            <span className="tabular-nums">{text.length} characters • {text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
          </div>
        </div>

        {/* Integrated Controls & Configuration Toolbar */}
        <div className="mt-5 pt-4 border-t border-hairline-light flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-canvas-cream/50 p-3.5 sm:p-4 rounded-xl border border-hairline-light">
          {/* Left: Slider + Value + Quick Preset Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1">
            <div className="flex items-center gap-2.5 shrink-0">
              <SlidersHorizontal size={15} className="text-shade-50 shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-sans font-medium text-ink">Threshold:</span>
                <span className="text-[12px] font-mono font-bold text-ink tabular-nums px-2 py-0.5 rounded bg-white border border-hairline-light shadow-xs">
                  {threshold.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Slider track */}
            <div className="w-full sm:w-40 shrink-0">
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer block"
                title={`Confidence threshold: ${threshold.toFixed(2)}`}
              />
            </div>

            {/* Quick Presets to eliminate empty dead space with rich utility */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { label: "Permissive", val: 0.35 },
                { label: "Balanced", val: 0.50 },
                { label: "Strict", val: 0.75 },
              ].map((p) => {
                const isCurrent = Math.abs(threshold - p.val) < 0.02;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setThreshold(p.val)}
                    className={`px-2.5 py-1 rounded-pill text-[11px] font-sans transition-all active:scale-95 ${
                      isCurrent
                        ? "bg-black text-white font-semibold shadow-xs"
                        : "bg-white border border-hairline-light text-shade-60 hover:text-black hover:border-shade-40"
                    }`}
                  >
                    {p.label} ({p.val})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Submit Button */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              icon={
                loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Send size={15} />
                )
              }
            >
              {loading ? "Running Pipeline..." : "Run Semantic Analysis"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-[13px] flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {result && topMeta ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-8"
          >
            {/* Primary Verdict Banner */}
            <div className="surface-card-base">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
                <div>
                  <span className="text-[12px] font-sans uppercase text-shade-50 tracking-[0.72px] block mb-1.5 font-medium">
                    Primary Verdict
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="px-4 py-1.5 rounded-pill text-[16px] font-sans font-semibold border flex items-center gap-2"
                      style={{
                        borderColor: topMeta.hex,
                        backgroundColor: `rgba(${topMeta.rgb}, 0.1)`,
                        color: topMeta.hex
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: topMeta.hex }} />
                      {result.intent.top_intent}
                    </span>
                    <span className="text-3xl font-display font-[330] text-ink tabular-nums">
                      {((result.intent.all_intents[result.intent.top_intent] || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {latencyMs && (
                    <span className="flex items-center gap-1.5 text-[12px] font-mono text-shade-60 bg-canvas-cream border border-hairline-light px-3.5 py-1.5 rounded-pill select-none">
                      <Clock size={13} />
                      <span className="tabular-nums">{latencyMs}ms latency</span>
                    </span>
                  )}
                  <span className="text-[12px] font-sans font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-pill flex items-center gap-1.5 select-none">
                    <CheckCircle2 size={13} />
                    <span>Deterministic Head Match</span>
                  </span>

                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border border-hairline-light bg-canvas-cream text-[12px] font-sans font-medium text-shade-70 hover:text-ink hover:bg-white transition-all active:scale-95"
                    title="Copy analysis summary to clipboard"
                  >
                    {copied ? (
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <Check size={13} strokeWidth={2} />
                        <span>Copied Summary</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Copy size={13} />
                        <span>Copy Summary</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Heuristics Context Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="bg-canvas-cream p-5 rounded-lg border border-hairline-light">
                  <span className="text-[12px] font-sans uppercase text-shade-50 tracking-[0.72px] block mb-1 font-medium">
                    Customer Tone
                  </span>
                  <p className="text-xl font-display font-[330] text-ink">
                    {result.tone || "Neutral"}
                  </p>
                </div>

                <div className="bg-canvas-cream p-5 rounded-lg border border-hairline-light">
                  <span className="text-[12px] font-sans uppercase text-shade-50 tracking-[0.72px] block mb-1 font-medium">
                    Urgency Priority
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        result.urgency === "High"
                          ? "bg-rose-500 animate-pulse"
                          : result.urgency === "Medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <p className="text-xl font-display font-[330] text-ink">
                      {result.urgency || "Low"}
                    </p>
                  </div>
                </div>

                <div className="bg-canvas-cream p-5 rounded-lg border border-hairline-light">
                  <span className="text-[12px] font-sans uppercase text-shade-50 tracking-[0.72px] block mb-1 font-medium">
                    Recommended Action
                  </span>
                  <p className="text-[16px] font-sans font-semibold text-ink flex items-center gap-1.5">
                    <ArrowRight size={15} className="text-shade-40 shrink-0" />
                    <span>{result.recommended_action || "Monitor"}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Word Contribution Heatmap Surface */}
            <div className="surface-card-base">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[12px] font-sans uppercase text-shade-50 tracking-[0.72px] block font-medium">
                    Explainable AI (XAI)
                  </span>
                  <h3 className="text-2xl font-display font-[330] text-ink mt-0.5">
                    Word-Level Contribution Heatmap
                  </h3>
                </div>
                <span className="pill-tag-shade">
                  Leave-One-Out Math
                </span>
              </div>
              <WordContributionHeatmap data={result.explainability} />
            </div>

            {/* Diagnostics: Radar Chart & Sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="surface-card-base">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-sans uppercase text-shade-50 tracking-[0.72px] font-medium">
                    All Intents
                  </span>
                  <span className="text-[12px] font-mono text-shade-50">5-Class Distribution</span>
                </div>
                <h4 className="text-xl font-display font-[330] text-ink mb-4">
                  Multi-Intent Radar
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData()}>
                      <PolarGrid stroke="#e4e4e7" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#71717a", fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Intent Confidence"
                        dataKey="A"
                        stroke="#000000"
                        fill="#000000"
                        fillOpacity={0.12}
                      />
                      <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #e4e4e7", boxShadow: "0 8px 8px rgba(0,0,0,0.03)" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sentiment Breakdown */}
              <div className="surface-card-base">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-sans uppercase text-shade-50 tracking-[0.72px] font-medium">
                    Twitter-RoBERTa
                  </span>
                  <span className="text-[12px] font-mono text-shade-50">Polarity Score</span>
                </div>
                <h4 className="text-xl font-display font-[330] text-ink mb-4">
                  Sentiment Breakdown
                </h4>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={getSentimentData()} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#71717a", fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #e4e4e7", boxShadow: "0 8px 8px rgba(0,0,0,0.03)" }} />
                      <Bar dataKey="value" radius={[6, 6, 6, 6]} maxBarSize={45}>
                        {getSentimentData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="surface-card-base flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-hairline-light">
              <div>
                <span className="text-[11px] font-sans uppercase tracking-[0.72px] font-semibold text-shade-50 block mb-1">
                  Workbench Ready
                </span>
                <h4 className="font-display text-2xl font-[330] text-ink">
                  Select a starter scenario or analyze custom text
                </h4>
              </div>
              <span className="text-[12px] font-mono text-shade-50 bg-canvas-cream border border-hairline-light px-3 py-1 rounded-pill self-start sm:self-auto select-none">
                Deterministic XAI Head
              </span>
            </div>

            {/* 3 Interactive Starter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRESETS.slice(0, 3).map((p) => (
                <div
                  key={p.label}
                  onClick={() => loadPreset(p.text)}
                  className="p-5 rounded-xl bg-canvas-cream hover:bg-white border border-hairline-light hover:border-black/30 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill text-[11px] font-sans font-semibold bg-white border border-hairline-light text-ink mb-3 group-hover:bg-black group-hover:text-white transition-colors">
                      {p.label}
                    </span>
                    <p className="text-[13px] font-sans text-shade-60 line-clamp-3 leading-relaxed">
                      &ldquo;{p.text}&rdquo;
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-hairline-light flex items-center justify-between text-[12px] font-sans text-shade-60 group-hover:text-ink">
                    <span>Load sample</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
