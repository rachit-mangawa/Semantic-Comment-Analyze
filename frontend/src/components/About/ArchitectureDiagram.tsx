import React, { useState } from "react";
import { Maximize2, Minimize2, ExternalLink, Download, Layers } from "lucide-react";

export const ArchitectureDiagram = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[12px] font-mono uppercase tracking-wider text-muted font-semibold">
            System Topology
          </span>
          <h2 className="text-3xl font-serif font-light text-ink tracking-tight mt-1">
            Data Flow & Subsystem Architecture
          </h2>
          <p className="text-[14px] text-body mt-1">
            Complete topology showing the decoupled flow from FastAPI ASGI Ingestion to Transformer Pipelines and Deterministic Evaluators.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href="/arch.svg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hairline bg-surface-card text-[13px] font-medium text-body hover:text-ink hover:bg-canvas-soft transition-colors shadow-sm"
          >
            <ExternalLink size={14} />
            <span>Open Vector SVG</span>
          </a>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hairline bg-surface-card text-[13px] font-medium text-body hover:text-ink hover:bg-canvas-soft transition-colors shadow-sm"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}</span>
          </button>
        </div>
      </div>

      <div
        className={`relative w-full border border-hairline rounded-2xl bg-white overflow-hidden p-6 md:p-10 flex items-center justify-center transition-all ${
          isFullscreen
            ? "fixed inset-4 z-50 h-[calc(100vh-2rem)] shadow-2xl bg-white/95 backdrop-blur-md"
            : "h-[620px] shadow-sm"
        }`}
      >
        <img
          src="/arch.svg"
          alt="Architecture Diagram"
          className="max-w-full max-h-full object-contain filter drop-shadow-sm select-none"
        />

        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-ink text-white hover:bg-black transition-colors shadow-lg"
            title="Close Fullscreen"
          >
            <Minimize2 size={18} />
          </button>
        )}
      </div>
    </section>
  );
};
