import React from "react";
import { LayoutDashboard, Database, BookOpen, Cpu, Zap } from "lucide-react";

export type ViewType = "single" | "batch" | "about";

export const Sidebar = ({
  activeView,
  onViewChange,
}: {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}) => {
  return (
    <aside className="w-64 border-r border-hairline bg-surface-card flex flex-col shrink-0 h-screen overflow-y-auto">
      <div className="p-6 border-b border-hairline">
        <h1 className="font-serif text-[20px] font-medium text-ink tracking-tight">
          Semantic Analysis
        </h1>
        <p className="text-[13px] text-muted mt-1 font-sans">
          NLP Workspace
        </p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1.5">
        <button
          onClick={() => onViewChange("single")}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-sans font-medium transition-colors ${
            activeView === "single"
              ? "bg-surface-strong text-ink font-semibold shadow-sm"
              : "text-body hover:bg-canvas hover:text-ink"
          }`}
        >
          <LayoutDashboard size={18} />
          Single Analysis
        </button>

        <button
          onClick={() => onViewChange("batch")}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-sans font-medium transition-colors ${
            activeView === "batch"
              ? "bg-surface-strong text-ink font-semibold shadow-sm"
              : "text-body hover:bg-canvas hover:text-ink"
          }`}
        >
          <Database size={18} />
          Batch Processing
        </button>

        <button
          onClick={() => onViewChange("about")}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-sans font-medium transition-colors ${
            activeView === "about"
              ? "bg-surface-strong text-ink font-semibold shadow-sm"
              : "text-body hover:bg-canvas hover:text-ink"
          }`}
        >
          <BookOpen size={18} />
          Architecture & Docs
        </button>
      </nav>

      {/* Engine Status Indicator in Footer */}
      <div className="p-4 border-t border-hairline bg-canvas-soft">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase text-muted font-semibold tracking-wider">
              Local Engine
            </span>
          </div>
          <span className="text-[10px] font-mono text-ink bg-surface-card px-1.5 py-0.5 rounded border border-hairline">
            sub-4ms
          </span>
        </div>
        <div className="text-[11px] font-mono text-muted truncate">
          MiniLM-L6 • RoBERTa • Head
        </div>
      </div>
    </aside>
  );
};
