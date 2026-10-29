import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { OverviewView } from "@/components/OverviewView";
import { Footer } from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { parseCurrentRoute, navigateTo, RouteView, RouteState } from "@/router";

// Code splitting per vercel-react-best-practices bundle-dynamic-imports
const SingleAnalysisView = lazy(() =>
  import("@/components/SingleAnalysisView").then((m) => ({ default: m.SingleAnalysisView }))
);
const BatchProcessingView = lazy(() =>
  import("@/components/BatchProcessingView").then((m) => ({ default: m.BatchProcessingView }))
);
const AboutView = lazy(() =>
  import("@/components/About/AboutView").then((m) => ({ default: m.AboutView }))
);

const RouteLoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[320px]" aria-label="Loading view">
    <div className="w-6 h-6 rounded-full border-2 border-ink border-t-transparent animate-spin" />
  </div>
);

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => parseCurrentRoute());

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(parseCurrentRoute());
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const handleNavigate = (view: RouteView, subTab?: string) => {
    navigateTo(view, subTab);
    setRoute({ view, subTab });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleArchitectureTabChange = (tab: string) => {
    navigateTo("architecture", tab);
    setRoute({ view: "architecture", subTab: tab });
  };

  return (
    <div className="min-h-screen bg-canvas-cream text-ink flex flex-col font-sans selection:bg-black selection:text-white">
      <Navbar activeView={route.view} onViewChange={handleNavigate} />
      <main className="flex-1 w-full flex flex-col">
        <ErrorBoundary key={route.view}>
          <AnimatePresence mode="wait">
            <motion.div
              key={route.view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1"
            >
              <Suspense fallback={<RouteLoadingFallback />}>
                {route.view === "overview" ? (
                  <OverviewView onNavigate={handleNavigate} />
                ) : route.view === "single" ? (
                  <SingleAnalysisView />
                ) : route.view === "batch" ? (
                  <BatchProcessingView />
                ) : (
                  <AboutView
                    initialTab={route.subTab || (route.view === "methodology" ? "pipeline" : "overview")}
                    onTabChange={handleArchitectureTabChange}
                  />
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
        <Footer
          activeView={route.view}
          activeSubTab={route.subTab}
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  );
}
