import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { WEDDING } from "../constants/wedding";
import { ASSETS } from "../constants/assets";

// phase prop 완전 제거 — 외부 커스텀 이벤트로만 제어
export default function HeroSection() {
  const photoControls = useAnimation();
  const photoStarted = useRef(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SplashOverlay가 "hero-start" 이벤트를 발행하면 사진 애니메이션 시작
    const onStart = () => {
      if (photoStarted.current) return;
      photoStarted.current = true;
      photoControls.start({ opacity: 1, top: "6px", transition: { duration: 0.7, ease: "easeOut" } });
      setTimeout(() => {
        photoControls.start({
          top: "-60px",
          transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
        });
      }, 700);
    };

    // SplashOverlay가 "hero-text-show" 이벤트를 발행하면 텍스트 표시
    const onTextShow = () => {
      if (textRef.current) {
        textRef.current.style.visibility = "visible";
      }
    };

    window.addEventListener("hero-start", onStart);
    window.addEventListener("hero-text-show", onTextShow);
    return () => {
      window.removeEventListener("hero-start", onStart);
      window.removeEventListener("hero-text-show", onTextShow);
    };
  }, [photoControls]);

  return (
    <div
      style={{
        width: "100%",
        height: "100svh",
        position: "relative",
        overflow: "clip",
        flexShrink: 0,
        containerType: "inline-size",
        backgroundColor: "#ecece9",
        backgroundImage: `url('${ASSETS.paperTexture}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 텍스트 3개를 하나의 ref div로 감싸서 리렌더 없이 visibility 토글 */}
      <div ref={textRef} style={{ visibility: "hidden" }}>

        {/* Names */}
        <div
          id="hero-names"
          style={{
            position: "absolute",
            zIndex: 5,
            top: "14.7cqw",
            left: 0, right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            color: "#00226a",
          }}
        >
          <span style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 400, fontSize: "4cqw", whiteSpace: "nowrap" }}>
            {WEDDING.groomNameEn}
          </span>
          <span style={{ fontFamily: "'Mrs Saint Delafield', cursive", fontSize: "5.6cqw", lineHeight: 1 }}>
            &amp;
          </span>
          <span style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 400, fontSize: "4cqw", whiteSpace: "nowrap" }}>
            {WEDDING.brideNameEn}
          </span>
        </div>

        {/* SAVE / The / DATE */}
        <div
          id="hero-group"
          style={{
            position: "absolute",
            zIndex: 4,
            top: "25.7cqw",
            left: "50%",
            transform: "translateX(-50%)",
            width: "74.7cqw",
            height: "41.3cqw",
          }}
        >
          {(["SAVE", "The", "DATE"] as const).map((word) => (
            <p key={word} style={{
              margin: 0, lineHeight: 1, whiteSpace: "nowrap",
              position: "absolute", color: "#00226a",
              fontFamily: word === "The" ? "'Mrs Saint Delafield', cursive" : "'Cormorant Upright', serif",
              fontWeight: word === "The" ? undefined : 300,
              fontSize: "14.9cqw",
              ...(word === "SAVE" && { top: 0, left: 0 }),
              ...(word === "The"  && { top: "37%", left: "39%" }),
              ...(word === "DATE" && { top: "58%", right: 0 }),
            }}>
              {word}
            </p>
          ))}
        </div>

        {/* Date + Tagline */}
        <div
          id="hero-date"
          style={{
            position: "absolute",
            zIndex: 4,
            bottom: "10.9cqw",
            left: 0, right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            textAlign: "center",
            color: "#00226a",
            paddingInline: "16px",
          }}
        >
          <p style={{ margin: 0, fontFamily: "'Cormorant Infant', serif", fontWeight: 600, fontSize: "5.3cqw", whiteSpace: "nowrap" }}>
            {WEDDING.dateDisplay}
          </p>
          <p style={{ margin: 0, fontFamily: "'Cormorant Infant', serif", fontWeight: 400, fontSize: "3.7cqw", lineHeight: 1.2 }}>
            {WEDDING.tagline1}<br />{WEDDING.tagline2}
          </p>
        </div>

      </div>

      {/* Photo + Envelope */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0,
          width: "100%",
          height: "320px",
          zIndex: 2,
        }}
      >
        <motion.div
          animate={photoControls}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: "0%",
            opacity: 0,
            width: "88%", maxWidth: "330px",
            aspectRatio: "346 / 268",
            zIndex: 1, overflow: "hidden",
          }}
        >
          <img
            src={ASSETS.heroPhoto}
            alt="Wedding photo"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "grayscale(100%)", display: "block" }}
          />
        </motion.div>

        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 3, pointerEvents: "none", lineHeight: 0 }}>
          <img src={ASSETS.envelope} alt="" style={{ width: "100%", display: "block" }} />
        </div>
      </div>
    </div>
  );
}
