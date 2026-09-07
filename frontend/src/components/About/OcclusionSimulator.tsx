import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      { word: "We", drop: 0.001, isKey: false },
      { word: "were", drop: 0.002, isKey: false },
      { word: "billed", drop: 0.385, isKey: true },
      { word: "twice", drop: 0.260, isKey: true },
      { word: "this", drop: 0.002, isKey: false },
      { word: "billing", drop: 0.095, isKey: false },
      { word: "cycle", drop: 0.015, isKey: false },
      { word: "and", drop: 0.001, isKey: false },
      { word: "customer", drop: 0.012, isKey: false },
      { word: "support", drop: 0.042, isKey: false },
      { word: "ignored", drop: 0.295, isKey: true },
      { word: "us.", drop: 0.005, isKey: false }
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

  return (
    <div className="surface-card-base mb-14 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
        <div>
          <span className="text-[12px] font-sans uppercase tracking-[0.72px] text-shade-50 font-medium">
            Explainable AI (XAI)
          </span>
          <h3 className="text-2xl font-display font-[330] text-ink mt-1">
            Token Occlusion Attribution Simulator
          </h3>
          <p className="text-[14px] text-shade-60 mt-1 font-sans">
            Leave-One-Out (LOO) token masking calculates exact marginal probability drop without surrogate models.
          </p>
        </div>

        {/* Case selector pill buttons with smooth sliding layoutId */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(SAMPLE_CASES).map(([key, item]) => {
            const isSelected = activeKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveKey(key);
                  setHoveredIdx(null);
                }}
                className={`relative px-4 py-2 rounded-pill text-[13px] font-sans font-medium transition-colors duration-150 ease-out active:scale-[0.97] select-none ${
                  isSelected
                    ? "text-white font-semibold shadow-sm"
                    : "bg-canvas-cream border border-hairline-light text-shade-60 hover:text-black hover:border-shade-40"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="occlusion-case-pill"
                    className="absolute inset-0 rounded-pill bg-black"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formula & Explanation Card */}
      <div className="bg-canvas-cream border border-hairline-light rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white border border-hairline-light rounded-pill text-ink shadow-sm">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-[11px] font-sans text-shade-50 uppercase tracking-[0.72px] font-medium">
              Attribution Formula
            </p>
            <p className="text-[14px] font-mono text-ink font-medium mt-0.5">
              Attribution ΔP = P(Intent | Sentence) − P(Intent | Sentence \ {"{word}"})
            </p>
          </div>
        </div>
        <span className="pill-tag-shade select-none">
          Exact Token Math (LOO)
        </span>
      </div>

      {/* Interactive Sentence Text Box */}
      <div>
        <label className="text-[12px] font-sans text-shade-50 uppercase tracking-[0.72px] block mb-2.5 font-medium">
          Hover over any word to occlude (mask) it in real time:
        </label>
        <div className="p-6 bg-canvas-cream border border-hairline-light rounded-lg flex flex-wrap gap-2 items-center text-[18px] leading-relaxed font-sans text-ink shadow-inner">
          {currentCase.words.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const alpha = Math.min(item.drop / maxDrop, 1);
            const intensityBg =
              alpha > 0.1
                ? `rgba(0, 0, 0, ${alpha * 0.15})`
                : "transparent";

            return (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  backgroundColor: isHovered
                    ? "#000000"
                    : intensityBg
                }}
                className={`px-3 py-1 rounded-pill cursor-pointer transition-all duration-150 relative select-none ${
                  isHovered
                    ? "text-white font-mono shadow-sm scale-105"
                    : "text-ink hover:text-black"
                } ${item.isKey ? "font-semibold underline decoration-dotted decoration-shade-40" : ""}`}
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
        <div className="bg-canvas-cream border border-hairline-light p-5 rounded-lg">
          <span className="text-[12px] font-sans uppercase tracking-[0.72px] text-shade-50 block mb-1 font-medium">
            Target Intent
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-[330] text-ink">
              {currentCase.intent}
            </span>
          </div>
          <p className="text-[13px] text-shade-60 mt-2 font-sans">
            Baseline Confidence: <strong className="text-ink font-mono tabular-nums">{(currentCase.baseConfidence * 100).toFixed(1)}%</strong>
          </p>
        </div>

        {/* Metric 2: Live Masking Inspector */}
        <div className="bg-canvas-cream border border-hairline-light p-5 rounded-lg">
          <span className="text-[12px] font-sans uppercase tracking-[0.72px] text-shade-50 block mb-1 font-medium">
            Active Mask Token
          </span>
          {activeWord ? (
            <div>
              <p className="text-xl font-mono font-bold text-ink">
                &ldquo;{activeWord.word}&rdquo;
              </p>
              <p className="text-[13px] text-shade-60 mt-2 font-sans">
                Confidence drops to: <strong className="text-ink font-mono tabular-nums">{(maskedProb * 100).toFixed(1)}%</strong>
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[14px] font-sans text-shade-50 italic">
                Hover any word above
              </p>
              <p className="text-[13px] text-shade-50 mt-2 font-sans">
                Simulates Leave-One-Out perturbation
              </p>
            </div>
          )}
        </div>

        {/* Metric 3: Delta Attribution */}
        <div className="bg-canvas-cream border border-hairline-light p-5 rounded-lg">
          <span className="text-[12px] font-sans uppercase tracking-[0.72px] text-shade-50 block mb-1 font-medium">
            Marginal Contribution (ΔP)
          </span>
          {activeWord ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-display font-[330] tabular-nums ${activeWord.drop > 0.1 ? "text-emerald-700" : "text-ink"}`}>
                  +{(activeWord.drop * 100).toFixed(1)}%
                </span>
                <span className="text-[12px] text-shade-50 font-sans">
                  attribution delta
                </span>
              </div>
              <div className="w-full bg-hairline-light rounded-pill h-2 mt-3 overflow-hidden">
                <div
                  className="bg-black h-full rounded-pill transition-[width] duration-200 ease-out"
                  style={{ width: `${Math.min((activeWord.drop / 0.5) * 100, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <span className="text-2xl font-mono font-bold text-shade-40 select-none">—</span>
              <p className="text-[13px] text-shade-50 mt-2 font-sans">
                Select a word to view attribution power
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
