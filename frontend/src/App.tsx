import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { OverviewView } from "@/components/OverviewView";
import { MethodologyView } from "@/components/MethodologyView";
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
  };

  const handleArchitectureTabChange = (tab: string) => {
    navigateTo("architecture", tab);
    setRoute({ view: "architecture", subTab: tab });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Navbar activeView={route.view} onViewChange={handleNavigate} />
      <main className="flex-1 w-full flex flex-col">
        <div className="flex-1">
          {route.view === "overview" ? (
            <OverviewView onNavigate={handleNavigate} />
          ) : route.view === "methodology" ? (
            <MethodologyView onNavigate={handleNavigate} />
          ) : route.view === "single" ? (
            <SingleAnalysisView />
          ) : route.view === "batch" ? (
            <BatchProcessingView />
          ) : (
            <AboutView
              initialTab={route.subTab || "overview"}
              onTabChange={handleArchitectureTabChange}
            />
          )}
        </div>
        <Footer
          activeView={route.view}
          activeSubTab={route.subTab}
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  );
}
