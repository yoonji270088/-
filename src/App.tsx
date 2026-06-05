import { useState, useEffect, useRef } from "react";
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

  // 새로고침 시 항상 최상단으로 + splash 시작
  useEffect(() => {
    window.scrollTo(0, 0);
    preloadImages([ASSETS.paperTexture, ASSETS.heroPhoto, ASSETS.envelope]);
  }, []);

  const handleSplashComplete = () => {
    setPhase("transitioning");
    setTimeout(() => setPhase("done"), 1400);
  };

  const isSplashVisible = phase === "splash" || phase === "transitioning";

  return (
    <div
      style={{
        width: "100%",
        minWidth: "320px",
        maxWidth: "430px",
        // minHeight는 유지하되 overflow는 지정하지 않음 → body 스크롤만 사용
        minHeight: "100dvh",
        position: "relative",
        backgroundColor: "#ecece9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeroSection phase={phase} />

      {/* 섹션들: 항상 DOM에 존재 — splash 중엔 숨김 */}
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
