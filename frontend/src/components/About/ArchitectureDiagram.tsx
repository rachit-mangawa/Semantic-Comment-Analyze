import React, { useState, useEffect } from "react";
import { Maximize2, Minimize2, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";


export const ArchitectureDiagram: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => setZoom(1);

  const baseUrl = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || "./";
  const rawSvgUrl = `${baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}arch.svg`;

  return (
    <div className="surface-card-base flex flex-col gap-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="eyebrow-cap">System Topology</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-emerald-50 text-emerald-800 border border-emerald-200 select-none">
              Vector Rendered
            </span>
          </div>
          <h3 className="section-heading mt-1">
            Data Flow &amp; Subsystem Architecture
          </h3>
          <p className="text-[14px] text-shade-60 mt-1 font-sans">
            End-to-end vector pipeline showing decoupled flow from FastAPI ASGI Ingestion to MiniLM embeddings, occlusion attribution, and deterministic routing.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Zoom controls */}
          <div className="inline-flex items-center p-1 rounded-pill bg-canvas-cream border border-hairline-light shadow-2xs">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.7}
              className="p-1.5 rounded-pill hover:bg-white text-shade-60 hover:text-ink disabled:opacity-40 transition-all active:scale-95"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-0.5 text-[11px] font-mono text-shade-60 hover:text-ink transition-colors tabular-nums"
              title="Reset Zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 2.1}
              className="p-1.5 rounded-pill hover:bg-white text-shade-60 hover:text-ink disabled:opacity-40 transition-all active:scale-95"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-pill hover:bg-white text-shade-50 hover:text-ink transition-all active:scale-95 border-l border-hairline-light ml-0.5 pl-1.5"
              title="Reset View"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Download Raw SVG */}
          <a
            href={rawSvgUrl}
            download="semantic-nlp-architecture.svg"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border border-hairline-light bg-canvas-cream text-[12px] font-sans font-medium text-shade-60 hover:text-ink hover:bg-white transition-all active:scale-95 shadow-2xs"
            title="Download SVG file"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Save SVG</span>
          </a>

          {/* Open in new tab */}
          <a
            href={rawSvgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border border-hairline-light bg-canvas-cream text-[12px] font-sans font-medium text-shade-60 hover:text-ink hover:bg-white transition-all active:scale-95 shadow-2xs"
            title="Open raw vector in new tab"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Open Raw</span>
          </a>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill border border-hairline-light bg-canvas-cream text-[12px] font-sans font-medium text-shade-60 hover:text-ink hover:bg-white transition-all active:scale-95 shadow-2xs"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isFullscreen ? "Exit" : "Expand"}</span>
          </button>
        </div>
      </div>

      {/* Normal Canvas View */}
      <div className="relative w-full border border-hairline-light rounded-xl bg-white overflow-hidden shadow-inner flex flex-col">
        {/* Subtle dot-grid paper background */}
        <div
          className="w-full h-[340px] sm:h-[480px] lg:h-[560px] overflow-auto p-3 sm:p-8 flex items-center justify-center transition-all bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:20px_20px]"
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              transition: "transform 150ms cubic-bezier(0, 0, 0.2, 1)",
            }}
            className="w-full max-w-[940px] flex items-center justify-center select-none min-w-[500px] sm:min-w-0"
          >
            <img
              src={rawSvgUrl}
              alt="System architecture diagram"
              className="w-full h-auto max-h-[300px] sm:max-h-[520px] drop-shadow-xs object-contain"
            />
          </div>

        </div>

        {/* Footer helper bar */}
        <div className="px-4 py-2.5 bg-canvas-cream/60 border-t border-hairline-light flex flex-wrap items-center justify-between text-[11px] font-mono text-shade-50">
          <span>Vector DOM Rendered • Zero Latency</span>
          <div className="flex items-center gap-3">
            <span>Scroll or drag horizontally if zoomed</span>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => setIsFullscreen(true)}
              className="text-ink hover:underline font-sans hidden sm:inline"
            >
              Open Fullscreen View
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full h-full bg-white rounded-2xl border border-hairline-light shadow-2xl flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline-light bg-canvas-cream/80">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-sans font-semibold text-ink">
                  System Subsystem Topology
                </span>
                <span className="text-[11px] font-mono text-shade-50 px-2 py-0.5 rounded-pill bg-white border border-hairline-light">
                  Scale: {Math.round(zoom * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom buttons in fullscreen */}
                <div className="inline-flex items-center p-0.5 rounded-pill bg-white border border-hairline-light shadow-xs">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 rounded-pill hover:bg-canvas-cream text-shade-60 hover:text-ink active:scale-95"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-2 py-0.5 text-[11px] font-mono text-shade-60 hover:text-ink"
                    title="Reset Zoom"
                  >
                    100%
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 rounded-pill hover:bg-canvas-cream text-shade-60 hover:text-ink active:scale-95"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-black text-white hover:bg-shade-80 text-[12px] font-sans font-medium transition-all active:scale-95 shadow-sm ml-2"
                  title="Close Fullscreen (Esc)"
                >
                  <Minimize2 size={13} />
                  <span>Exit Fullscreen</span>
                </button>
              </div>
            </div>

            {/* Fullscreen Content Area */}
            <div className="flex-1 overflow-auto p-6 sm:p-10 flex items-center justify-center bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:20px_20px]">
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 150ms cubic-bezier(0, 0, 0.2, 1)",
                }}
                className="w-full max-w-[1080px] flex items-center justify-center select-none"
              >
                <img
                  src={rawSvgUrl}
                  alt="System architecture diagram fullscreen"
                  className="w-full h-auto max-h-[82vh] drop-shadow-md object-contain"
                />
              </div>

            </div>

            {/* Bottom Bar Hint */}
            <div className="px-5 py-2 bg-canvas-cream/60 border-t border-hairline-light flex items-center justify-between text-[11px] font-mono text-shade-50">
              <span>Press ESC or click Exit to return</span>
              <span>100% Offline Client-Side Rendered</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ArchitectureDiagram;
