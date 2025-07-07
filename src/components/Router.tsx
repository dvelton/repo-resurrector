import { useState, useEffect } from "react";
import { HomePage } from "@/pages/HomePage";
import { ExplorePage } from "@/pages/ExplorePage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { AdoptedPage } from "@/pages/AdoptedPage";

type Route = "/" | "/explore" | "/leaderboard" | "/adopted";

export function Router() {
  const [currentRoute, setCurrentRoute] = useState<Route>("/");

  useEffect(() => {
    // Simple client-side routing
    const handleRouteChange = () => {
      const path = window.location.pathname;
      
      if (
        path === "/" ||
        path === "/explore" ||
        path === "/leaderboard" ||
        path === "/adopted"
      ) {
        setCurrentRoute(path as Route);
      } else {
        // Default to home for unknown routes
        setCurrentRoute("/");
      }
    };

    handleRouteChange();
    
    // Listen for popstate events (browser back/forward buttons)
    window.addEventListener("popstate", handleRouteChange);
    
    // Add click event delegation for links
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (
        link &&
        !link.getAttribute("target") &&
        !link.getAttribute("rel")?.includes("external") &&
        link.getAttribute("href")?.startsWith("/")
      ) {
        e.preventDefault();
        const href = link.getAttribute("href") as string;
        window.history.pushState({}, "", href);
        handleRouteChange();
      }
    });
    
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  switch (currentRoute) {
    case "/":
      return <HomePage />;
    case "/explore":
      return <ExplorePage />;
    case "/leaderboard":
      return <LeaderboardPage />;
    case "/adopted":
      return <AdoptedPage />;
    default:
      return <HomePage />;
  }
}