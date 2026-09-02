"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
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
  Layers,
  Activity,
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
      <div className="leading-relaxed whitespace-pre-wrap text-[16px] p-6 bg-canvas-soft rounded-xl border border-hairline font-sans text-ink flex flex-wrap gap-x-1.5 gap-y-2 select-text">
        {data.map((item, idx) => {
          const alpha = Math.min(Math.abs(item.contribution) / maxAbs, 1);
          const colorMeta = INTENT_COLORS[item.primary_intent];
          const bgColor = colorMeta && item.contribution > 0 ? `rgba(${colorMeta.rgb}, ${Math.max(alpha * 0.5, 0.08)})` : "transparent";

          return (
            <span
              key={idx}
              style={{ backgroundColor: alpha > 0.04 ? bgColor : "transparent" }}
              className={`px-1.5 py-0.5 rounded transition-all cursor-default relative group ${
                alpha > 0.25 ? "font-semibold underline decoration-dotted decoration-muted" : ""
              }`}
              title={`${item.word} → ${item.primary_intent} (ΔP: +${(item.contribution * 100).toFixed(1)}%)`}
            >
              {item.word}
            </span>
          );
        })}
      </div>

      {/* Categorical Intent Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-hairline text-[12px] font-mono text-muted">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="font-semibold uppercase tracking-wider text-muted">Token Attribution:</span>
          {Object.entries(INTENT_COLORS).map(([intent, meta]) => (
            <div key={intent} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.hex }} />
              <span className="text-body font-sans text-[13px]">{intent}</span>
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
      { name: "Neutral", value: label === "NEUTRAL" ? score : 0, color: "#a8a29e" },
      { name: "Negative", value: label === "NEGATIVE" ? score : 0, color: "#dc2626" },
    ];
  };

  const getRadarData = () => {
    if (!result || !result.intent.all_intents) return [];
    return INTENTS.map((intent) => ({
      subject: intent,
      A: (result.intent.all_intents[intent] || 0) * 100,
      fullMark: 100,
    }));
  };

  const topIntent = result?.intent.top_intent || "";
  const topMeta = INTENT_COLORS[topIntent] || { hex: "#292524", text: "text-ink", bg: "bg-surface-strong" };

  return (
    <div className="page-container">
      {/* Universal Page Header */}
      <PageHeader
        eyebrow="Real-Time NLP Inference"
        title="Single Comment Analysis"
        description="Evaluate customer feedback against the intent classifier, RoBERTa sentiment model, and token occlusion explainability engine."
        badge={
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-wider text-ink uppercase bg-canvas-soft border border-hairline rounded-md tabular-nums select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Interactive Sandbox
          </span>
        }
      />

      {/* Input Card (Focal Point) */}
      <div className="bg-surface-card border border-hairline rounded-2xl p-6 shadow-xs">
        {/* Preset Chips */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-muted tracking-wider font-semibold">
              Try a realistic sample:
            </span>
            {text && (
              <button
                onClick={() => setText("")}
                className="text-[12px] font-mono text-muted hover:text-ink flex items-center gap-1.5 transition-colors enabled:active:scale-[0.96] p-1 -m-1"
                title="Clear current text"
              >
                <Trash2 size={12} strokeWidth={1.75} />
                <span>Clear</span>
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
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-sans font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out enabled:active:scale-[0.96] ${
                    isSelected
                      ? "bg-surface-strong border-ink text-ink font-semibold shadow-xs"
                      : "bg-canvas-soft border border-hairline text-body hover:border-hairline-strong hover:text-ink"
                  }`}
                >
                  {preset.label}
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
            className="w-full bg-canvas-soft rounded-xl p-4 text-[15px] font-sans text-ink border border-hairline focus:border-ink focus:bg-white focus:outline-none transition-[border-color,background-color] duration-150 resize-none shadow-inner leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2 text-[12px] font-mono text-muted">
            <span>Press <kbd className="bg-surface-strong px-1.5 py-0.5 rounded border border-hairline text-ink">Ctrl</kbd> + <kbd className="bg-surface-strong px-1.5 py-0.5 rounded border border-hairline text-ink">Enter</kbd></span>
            <span className="tabular-nums">{text.length} characters • {text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
          </div>
        </div>

        {/* Controls row */}
        <div className="mt-5 pt-4 border-t border-hairline flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Threshold Slider */}
          <div className="flex items-center gap-4 flex-1 max-w-xs">
            <SlidersHorizontal size={16} strokeWidth={1.75} className="text-muted shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-[12px] font-mono mb-1">
                <span className="text-muted">Confidence Threshold</span>
                <span className="font-bold text-ink tabular-nums">{threshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-ink cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="flex items-center justify-center gap-2 pl-5 pr-6 py-2.5 rounded-xl font-sans text-[14px] font-medium bg-ink text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-[background-color,transform,opacity] duration-150 ease-out enabled:active:scale-[0.96] shadow-sm"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Send size={15} strokeWidth={1.75} />
                <span>Run Semantic Analysis</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
            <AlertCircle size={16} strokeWidth={1.75} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-8"
          >
            {/* Primary Verdict Banner (Focal Point) */}
            <div className="bg-surface-card border border-hairline rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline">
                <div>
                  <span className="text-[11px] font-mono uppercase text-muted tracking-wider block mb-1">
                    Primary Verdict
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3.5 py-1.5 rounded-full text-[16px] font-sans font-semibold border flex items-center gap-2"
                      style={{
                        borderColor: topMeta.hex,
                        backgroundColor: `rgba(${topMeta.rgb}, 0.1)`,
                        color: topMeta.hex
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: topMeta.hex }} />
                      {result.intent.top_intent}
                    </span>
                    <span className="text-2xl font-mono font-bold text-ink tabular-nums">
                      {((result.intent.all_intents[result.intent.top_intent] || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {latencyMs && (
                    <span className="flex items-center gap-1.5 text-[12px] font-mono text-muted bg-canvas-soft border border-hairline px-3 py-1.5 rounded-lg select-none">
                      <Clock size={13} strokeWidth={1.75} />
                      <span className="tabular-nums">{latencyMs}ms latency</span>
                    </span>
                  )}
                  <span className="text-[12px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 select-none">
                    <CheckCircle2 size={13} strokeWidth={1.75} />
                    <span>Deterministic SOP Match</span>
                  </span>

                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-lg border border-hairline bg-canvas-soft text-[12px] font-mono text-body hover:text-ink hover:bg-canvas transition-[color,background-color,border-color,transform] duration-150 ease-out enabled:active:scale-[0.96]"
                    title="Copy analysis summary to clipboard"
                  >
                    {copied ? (
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <Check size={13} strokeWidth={2} />
                        <span>Copied Summary</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Copy size={13} strokeWidth={1.75} />
                        <span>Copy Summary</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Heuristics Context Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="bg-canvas-soft p-4 rounded-xl border border-hairline">
                  <span className="text-[11px] font-mono uppercase text-muted block mb-1">
                    Customer Tone
                  </span>
                  <p className="text-xl font-serif font-medium text-ink">
                    {result.tone || "Neutral"}
                  </p>
                </div>

                <div className="bg-canvas-soft p-4 rounded-xl border border-hairline">
                  <span className="text-[11px] font-mono uppercase text-muted block mb-1">
                    Urgency Priority
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        result.urgency === "High"
                          ? "bg-red-500 animate-pulse"
                          : result.urgency === "Medium"
                          ? "bg-orange-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <p className="text-xl font-serif font-medium text-ink">
                      {result.urgency || "Low"}
                    </p>
                  </div>
                </div>

                <div className="bg-canvas-soft p-4 rounded-xl border border-hairline">
                  <span className="text-[11px] font-mono uppercase text-muted block mb-1">
                    Recommended Action
                  </span>
                  <p className="text-[16px] font-sans font-semibold text-ink flex items-center gap-1.5">
                    <ArrowRight size={15} className="text-muted shrink-0" />
                    <span>{result.recommended_action || "Monitor"}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Feature: Word Contribution Heatmap */}
            <div className="bg-surface-card border border-hairline rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-muted tracking-wider block font-semibold">
                    Explainable AI (XAI)
                  </span>
                  <h3 className="text-xl font-serif font-medium text-ink mt-0.5">
                    Word-Level Contribution Heatmap
                  </h3>
                </div>
                <span className="text-[12px] font-mono text-muted bg-canvas-soft border border-hairline px-2.5 py-1 rounded">
                  Leave-One-Out Math
                </span>
              </div>
              <WordContributionHeatmap data={result.explainability} />
            </div>

            {/* Secondary Diagnostics: Radar Chart & Sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="bg-surface-card border border-hairline rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase text-muted tracking-wider font-semibold">
                    All Intents
                  </span>
                  <span className="text-[12px] font-mono text-muted">5-Class Distribution</span>
                </div>
                <h4 className="text-lg font-serif font-medium text-ink mb-4">
                  Multi-Intent Radar
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData()}>
                      <PolarGrid stroke="#e7e5e4" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#777169", fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Intent Confidence"
                        dataKey="A"
                        stroke="#0c0a09"
                        fill="#0c0a09"
                        fillOpacity={0.15}
                      />
                      <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #e7e5e4" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sentiment Breakdown */}
              <div className="bg-surface-card border border-hairline rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase text-muted tracking-wider font-semibold">
                    Twitter-RoBERTa
                  </span>
                  <span className="text-[12px] font-mono text-muted">Polarity Score</span>
                </div>
                <h4 className="text-lg font-serif font-medium text-ink mb-4">
                  Sentiment Breakdown
                </h4>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={getSentimentData()} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#777169", fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #e7e5e4" }} />
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
          <div className="border border-dashed border-hairline-strong rounded-2xl p-10 text-center bg-canvas-soft/50">
            <p className="text-[16px] font-serif text-ink mb-1">
              No Analysis Running Yet
            </p>
            <p className="text-[14px] text-body mb-4">
              Select one of the sample feedback prompts above or paste custom text to evaluate intent, tone, and word contributions.
            </p>
            <button
              onClick={() => loadPreset(PRESETS[0].text)}
              className="text-[13px] font-mono text-ink bg-surface-card border border-hairline px-3 py-1.5 rounded-lg hover:bg-canvas transition-colors"
            >
              Load Sample Bug Report
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
