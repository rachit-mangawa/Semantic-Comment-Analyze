import React, { useState } from "react";
import { Maximize2, Minimize2, ExternalLink } from "lucide-react";

export const ArchitectureDiagram = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="surface-card-base flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
        <div>
          <span className="eyebrow-cap">
            System Topology
          </span>
          <h3 className="section-heading mt-1">
            Data Flow &amp; Subsystem Architecture
          </h3>
          <p className="text-[14px] text-shade-60 mt-1 font-sans">
            Complete topology showing the decoupled flow from FastAPI ASGI Ingestion to Transformer Pipelines and Deterministic Evaluators.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href="/arch.svg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border border-hairline-light bg-canvas-cream text-[12px] font-sans font-medium text-shade-60 hover:text-ink hover:bg-white transition-all active:scale-95 shadow-xs"
          >
            <ExternalLink size={13} />
            <span>Open Vector SVG</span>
          </a>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border border-hairline-light bg-canvas-cream text-[12px] font-sans font-medium text-shade-60 hover:text-ink hover:bg-white transition-all active:scale-95 shadow-xs"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}</span>
          </button>
        </div>
      </div>

      <div
        className={`relative w-full border border-hairline-light rounded-xl bg-white overflow-hidden p-6 md:p-8 flex items-center justify-center transition-all ${
          isFullscreen
            ? "fixed inset-4 z-50 h-[calc(100vh-2rem)] shadow-2xl bg-white/95 backdrop-blur-md"
            : "h-[540px] shadow-inner"
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
            className="absolute top-6 right-6 p-2 rounded-pill bg-black text-white hover:bg-shade-80 transition-colors shadow-lg"
            title="Close Fullscreen"
          >
            <Minimize2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
