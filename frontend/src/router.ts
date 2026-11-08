export type RouteView = "overview" | "methodology" | "single" | "batch" | "architecture";

export interface RouteState {
  view: RouteView;
  subTab?: string;
}

/**
 * Returns the base path if deployed in a repository subfolder (e.g. GitHub Pages "/Semantic-Comment-Analyze").
 */
export function getBasePath(): string {
  if (typeof window === "undefined") return "";
  const pathname = window.location.pathname;
  if (pathname.startsWith("/Semantic-Comment-Analyze")) {
    return "/Semantic-Comment-Analyze";
  }
  return "";
}

/**
 * Parses the current URL pathname into a structured RouteState.
 * Automatically cleans up any legacy hash-based routes (e.g. #/single -> /single).
 */
export function parseCurrentRoute(): RouteState {
  if (typeof window === "undefined") {
    return { view: "overview" };
  }

  const basePath = getBasePath();
  let pathname = window.location.pathname;

  // Handle and clean up legacy hash links (e.g., #/single -> /single)
  const hash = window.location.hash.replace(/^#\/?/, "").trim();
  if (hash) {
    const cleanSubPath = hash.startsWith("/") ? hash : `/${hash}`;
    const cleanPath = `${basePath}${cleanSubPath}`.replace(/\/+/g, "/");
    window.history.replaceState({}, "", cleanPath);
    pathname = cleanPath;
  }

  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length);
  }

  const raw = pathname.replace(/^\//, "").trim();

  if (!raw) {
    return { view: "overview" };
  }

  const parts = raw.split("/").filter(Boolean);
  const primary = parts[0]?.toLowerCase();
  const subTab = parts[1]?.toLowerCase();

  switch (primary) {
    case "methodology":
    case "method":
      return { view: "architecture", subTab: subTab || "pipeline" };
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
 * Navigates to a specific view and optional sub-tab using clean URLs (HTML5 History API).
 * Updates window.history without hash symbols (#).
 */
export function navigateTo(view: RouteView, subTab?: string): void {
  if (typeof window === "undefined") return;

  const basePath = getBasePath();
  const routePath =
    view === "overview"
      ? "/"
      : subTab
        ? `/${view}/${subTab}`
        : `/${view}`;

  const fullPath = `${basePath}${routePath}`.replace(/\/+/g, "/") || "/";

  if (window.location.pathname !== fullPath || window.location.hash) {
    window.history.pushState({}, "", fullPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  // Scroll to top on route change
  window.scrollTo({ top: 0, behavior: "smooth" });
}
