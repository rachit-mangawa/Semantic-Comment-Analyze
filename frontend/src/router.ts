export type RouteView = "overview" | "methodology" | "single" | "batch" | "architecture";

export interface RouteState {
  view: RouteView;
  subTab?: string;
}

/**
 * Parses the current URL hash or pathname into a structured RouteState.
 * Supports both hash routes (#/methodology, #/architecture/pipeline)
 * and pathname routes (/methodology, /architecture/pipeline).
 */
export function parseCurrentRoute(): RouteState {
  if (typeof window === "undefined") {
    return { view: "overview" };
  }

  const hash = window.location.hash.replace(/^#\/?/, "").trim();
  const raw = hash || window.location.pathname.replace(/^\//, "").trim();

  if (!raw) {
    return { view: "overview" };
  }

  const parts = raw.split("/").filter(Boolean);
  const primary = parts[0]?.toLowerCase();
  const subTab = parts[1]?.toLowerCase();

  switch (primary) {
    case "methodology":
    case "method":
      return { view: "methodology" };
    case "single":
    case "analyze":
    case "analysis":
      return { view: "single" };
    case "batch":
    case "streaming":
      return { view: "batch" };
    case "architecture":
    case "about":
    case "specs":
      return { view: "architecture", subTab: subTab || "overview" };
    case "overview":
    case "home":
    default:
      return { view: "overview" };
  }
}

/**
 * Navigates to a specific view and optional sub-tab by updating window.location.hash.
 * This ensures page reloads, browser history, and direct linking work without server-side redirects.
 */
export function navigateTo(view: RouteView, subTab?: string): void {
  if (typeof window === "undefined") return;

  const targetHash = subTab ? `#/${view}/${subTab}` : `#/${view}`;
  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash;
  }
  // Scroll to top on route change
  window.scrollTo({ top: 0, behavior: "smooth" });
}
