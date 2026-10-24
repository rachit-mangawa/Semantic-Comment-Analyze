import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, Info, Check, RefreshCw } from "lucide-react";

interface SampleCase {
  label: string;
  intent: string;
  baseConfidence: number;
  words: {
    word: string;
    drop: number; // confidence drop when occluded
    isKey: boolean;
  }[];
}

const SAMPLE_CASES: Record<string, SampleCase> = {
  bug: {
    label: "Bug Report",
    intent: "Bug Report",
    baseConfidence: 0.962,
    words: [
      { word: "The", drop: 0.002, isKey: false },
      { word: "application", drop: 0.045, isKey: false },
      { word: "crashes", drop: 0.482, isKey: true },
      { word: "every", drop: 0.015, isKey: false },
      { word: "time", drop: 0.008, isKey: false },
      { word: "I", drop: 0.001, isKey: false },
      { word: "try", drop: 0.012, isKey: false },
      { word: "to", drop: 0.002, isKey: false },
      { word: "export", drop: 0.065, isKey: false },
      { word: "reports", drop: 0.021, isKey: false },
      { word: "to", drop: 0.002, isKey: false },
      { word: "PDF", drop: 0.035, isKey: false },
      { word: "format.", drop: 0.019, isKey: false }
    ]
  },
  feature: {
    label: "Feature Request",
    intent: "Feature Request",
    baseConfidence: 0.941,
    words: [
      { word: "It", drop: 0.003, isKey: false },
      { word: "would", drop: 0.038, isKey: false },
      { word: "be", drop: 0.005, isKey: false },
      { word: "fantastic", drop: 0.092, isKey: false },
      { word: "if", drop: 0.015, isKey: false },
      { word: "we", drop: 0.004, isKey: false },
      { word: "could", drop: 0.052, isKey: false },
      { word: "add", drop: 0.285, isKey: true },
      { word: "support", drop: 0.041, isKey: false },
      { word: "for", drop: 0.002, isKey: false },
      { word: "webhook", drop: 0.245, isKey: true },
      { word: "integrations.", drop: 0.081, isKey: false }
    ]
  },
  complaint: {
    label: "Complaint",
    intent: "Complaint",
    baseConfidence: 0.955,
    words: [
      { word: "Your", drop: 0.008, isKey: false },
      { word: "system", drop: 0.031, isKey: false },
      { word: "charged", drop: 0.320, isKey: true },
      { word: "me", drop: 0.015, isKey: false },
      { word: "twice", drop: 0.265, isKey: true },
      { word: "and", drop: 0.001, isKey: false },
      { word: "nobody", drop: 0.095, isKey: false },
      { word: "responded", drop: 0.180, isKey: true },
      { word: "to", drop: 0.002, isKey: false },
      { word: "my", drop: 0.003, isKey: false },
      { word: "ticket.", drop: 0.042, isKey: false }
    ]
  },
  praise: {
    label: "Praise",
    intent: "Praise",
    baseConfidence: 0.985,
    words: [
      { word: "The", drop: 0.001, isKey: false },
      { word: "new", drop: 0.012, isKey: false },
      { word: "interface", drop: 0.041, isKey: false },
      { word: "is", drop: 0.003, isKey: false },
      { word: "clean", drop: 0.285, isKey: true },
      { word: "and", drop: 0.002, isKey: false },
      { word: "much", drop: 0.015, isKey: false },
      { word: "faster", drop: 0.380, isKey: true },
      { word: "now.", drop: 0.040, isKey: false }
    ]
  }
};

const INTENT_THEMES: Record<string, { bg: string; text: string; bar: string }> = {
  "Bug Report": { bg: "bg-red-500/10", text: "text-red-700", bar: "bg-red-500" },
  "Feature Request": { bg: "bg-purple-500/10", text: "text-purple-700", bar: "bg-purple-500" },
  "Complaint": { bg: "bg-orange-500/10", text: "text-orange-700", bar: "bg-orange-500" },
  "Praise": { bg: "bg-emerald-500/10", text: "text-emerald-700", bar: "bg-emerald-500" }
};

export const OcclusionSimulator = () => {
  const [activeKey, setActiveKey] = useState<string>("bug");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const currentCase = SAMPLE_CASES[activeKey];
  const activeWord = hoveredIdx !== null ? currentCase.words[hoveredIdx] : null;

  // Masked probability calculation
  const maskedProb = activeWord
    ? Math.max(0, currentCase.baseConfidence - activeWord.drop)
    : currentCase.baseConfidence;

  const maxDrop = Math.max(...currentCase.words.map((w) => w.drop), 0.01);
  const theme = INTENT_THEMES[currentCase.intent] || {
    bg: "bg-blue-500/10",
    text: "text-blue-700",
    bar: "bg-blue-500"
  };

  return (
    <div className="bg-surface-card border border-hairline rounded-2xl p-6 md:p-8 mb-16 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-hairline">
        <div>
          <span className="text-[12px] font-mono uppercase tracking-wider text-muted font-semibold">
            Explainable AI (XAI)
          </span>
          <h3 className="text-2xl font-serif font-light text-ink mt-1">
            Token Occlusion Attribution Simulator
          </h3>
          <p className="text-[14px] text-body mt-1">
            Leave-One-Out (LOO) token masking calculates the exact marginal probability drop without surrogate models.
          </p>
        </div>

        {/* Case selector tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(SAMPLE_CASES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                setActiveKey(key);
                setHoveredIdx(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-sans font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out enabled:active:scale-[0.96] ${
                activeKey === key
                  ? "bg-ink text-white font-semibold shadow-xs"
                  : "bg-canvas-soft border border-hairline text-body hover:bg-canvas"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Formula & Explanation Alert */}
      <div className="bg-canvas-soft border border-hairline rounded-xl p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-surface-card border border-hairline rounded-lg text-ink shadow-2xs">
            <Sparkles size={18} strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[12px] font-mono text-muted uppercase tracking-wider font-semibold">
              Mathematical Attribution Formula
            </p>
            <p className="text-[15px] font-serif text-ink font-medium">
              Attribution ΔP = P(Intent | Full Sentence) − P(Intent | Sentence \ {`{word}`})
            </p>
          </div>
        </div>
        <span className="text-[12px] font-mono text-muted bg-surface-card px-2.5 py-1 rounded border border-hairline select-none">
          Exact Token Math (LOO)
        </span>
      </div>

      {/* Interactive Sentence Text Box */}
      <div className="mb-6">
        <label className="text-[12px] font-mono text-muted uppercase tracking-wider block mb-2 font-semibold">
          Hover over any word to occlude (mask) it in real time:
        </label>
        <div className="p-6 bg-canvas-soft border border-hairline rounded-2xl flex flex-wrap gap-2 items-center text-[18px] leading-relaxed font-sans text-ink shadow-inner">
          {currentCase.words.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const alpha = Math.min(item.drop / maxDrop, 1);
            const intensityBg =
              alpha > 0.1
                ? `rgba(239, 68, 68, ${alpha * 0.45})`
                : "transparent";

            return (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  backgroundColor: isHovered
                    ? "#0c0a09"
                    : intensityBg
                }}
                className={`px-2 py-0.5 rounded-md cursor-pointer transition-[color,background-color] duration-150 relative select-none ${
                  isHovered
                    ? "text-white font-mono shadow-xs"
                    : "text-ink hover:text-black"
                } ${item.isKey ? "font-semibold underline decoration-dotted decoration-muted" : ""}`}
                title={`Marginal drop: +${(item.drop * 100).toFixed(1)}%`}
              >
                {isHovered ? `[MASK: ${item.word}]` : item.word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Real-time Math Inspector Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-canvas-soft border border-hairline p-5 rounded-xl">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">
            Target Intent
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif font-medium text-ink">
              {currentCase.intent}
            </span>
          </div>
          <p className="text-[12px] text-muted mt-2">
            Baseline Confidence: <strong className="text-ink font-mono tabular-nums">{(currentCase.baseConfidence * 100).toFixed(1)}%</strong>
          </p>
        </div>

        {/* Metric 2: Live Masking Inspector */}
        <div className="bg-canvas-soft border border-hairline p-5 rounded-xl">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">
            Active Mask Token
          </span>
          {activeWord ? (
            <div>
              <p className="text-xl font-mono font-bold text-ink">
                &ldquo;{activeWord.word}&rdquo;
              </p>
              <p className="text-[12px] text-muted mt-2">
                Confidence drops to: <strong className="text-ink font-mono tabular-nums">{(maskedProb * 100).toFixed(1)}%</strong>
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[15px] font-sans text-muted italic">
                Hover any word above
              </p>
              <p className="text-[12px] text-muted mt-2">
                Simulates Leave-One-Out perturbation
              </p>
            </div>
          )}
        </div>

        {/* Metric 3: Delta Attribution */}
        <div className="bg-canvas-soft border border-hairline p-5 rounded-xl">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">
            Marginal Contribution (ΔP)
          </span>
          {activeWord ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-mono font-bold tabular-nums ${activeWord.drop > 0.1 ? "text-emerald-700" : "text-ink"}`}>
                  +{(activeWord.drop * 100).toFixed(1)}%
                </span>
                <span className="text-[11px] text-muted font-sans font-medium">
                  attribution delta
                </span>
              </div>
              <div className="w-full bg-hairline rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-ink h-full rounded-full transition-[width] duration-200 ease-out"
                  style={{ width: `${Math.min((activeWord.drop / 0.5) * 100, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <span className="text-2xl font-mono font-bold text-muted select-none">—</span>
              <p className="text-[12px] text-muted mt-2">
                Select a word to view attribution power
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
