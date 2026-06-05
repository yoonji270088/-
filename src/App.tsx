import { useState, useEffect, useRef, useCallback } from "react";
import HeroSection       from "./components/HeroSection";
import SplashOverlay     from "./components/SplashOverlay";
import InvitationSection from "./components/InvitationSection";
import CalendarSection   from "./components/CalendarSection";
import GallerySection    from "./components/GallerySection";
import LocationSection   from "./components/LocationSection";
import AccountSection    from "./components/AccountSection";
import { ASSETS } from "./constants/assets";

function preloadImages(srcs: string[]) {
  srcs.forEach(src => { const img = new Image(); img.src = src; });
}

export type Phase = "splash" | "transitioning" | "done";

export default function App() {
  const [phase, setPhase] = useState<Phase>("splash");
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    preloadImages([ASSETS.paperTexture, ASSETS.heroPhoto, ASSETS.envelope]);
  }, []);

  // useCallback으로 참조 고정 — SplashOverlay의 useEffect 재실행 방지
  const handleSplashComplete = useCallback(() => {
    setPhase("transitioning");
    setTimeout(() => {
      window.scrollTo(0, 0);
      setPhase("done");
    }, 1500);
  }, []);

  const isSplashVisible = phase === "splash" || phase === "transitioning";

  return (
    <div
      style={{
        width: "100%",
        minWidth: "320px",
        maxWidth: "430px",
        position: "relative",
        backgroundColor: "#ecece9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeroSection phase={phase} />

      <div
        ref={sectionsRef}
        style={{
          opacity: isSplashVisible ? 0 : 1,
          pointerEvents: isSplashVisible ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
      >
        <InvitationSection />
        <CalendarSection />
        <GallerySection />
        <LocationSection />
        <AccountSection />
      </div>

      {phase !== "done" && (
        <SplashOverlay phase={phase} onComplete={handleSplashComplete} />
      )}
    </div>
  );
}
