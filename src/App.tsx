import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
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

  const handleSplashComplete = useCallback(() => {
    setPhase("transitioning");
    setTimeout(() => {
      window.scrollTo(0, 0);
      setPhase("done");
    }, 1500);
  }, []);

  const isSplashVisible = phase === "splash" || phase === "transitioning";

  return (
    <>
      {/* 스플래시 배경 — position:fixed로 전체 화면 덮음, 중앙 정렬과 무관 */}
      {phase !== "done" && (
        <motion.div
          animate={{ opacity: phase === "transitioning" ? 0 : 1 }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#041438",
            zIndex: 19,
            pointerEvents: "none",
          }}
        />
      )}

      {/* 메인 컨테이너 — 항상 margin:auto 중앙 정렬 */}
      <div
        style={{
          width: "100%",
          minWidth: "320px",
          maxWidth: "430px",
          margin: "0 auto",
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

        {/* 텍스트 오버레이 — position:absolute, 메인 컨테이너 기준 → Hero와 동일 좌표계 */}
        {phase !== "done" && (
          <SplashOverlay phase={phase} onComplete={handleSplashComplete} />
        )}
      </div>
    </>
  );
}
