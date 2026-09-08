import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { OverviewView } from "@/components/OverviewView";
import { SingleAnalysisView } from "@/components/SingleAnalysisView";
import { BatchProcessingView } from "@/components/BatchProcessingView";
import { AboutView } from "@/components/About/AboutView";
import { Footer } from "@/components/Footer";
import { parseCurrentRoute, navigateTo, RouteView, RouteState } from "@/router";

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
        <AnimatePresence mode="wait">
          <motion.div
            key={route.view}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1"
          >
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
          </motion.div>
        </AnimatePresence>
        <Footer
          activeView={route.view}
          activeSubTab={route.subTab}
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  );
}
