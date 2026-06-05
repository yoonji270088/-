import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { WEDDING } from "../constants/wedding";
import { ASSETS } from "../constants/assets";
import { Phase } from "../App";

interface Props { phase: Phase; }

export default function HeroSection({ phase }: Props) {
  const photoControls = useAnimation();
  const [textVisible, setTextVisible] = useState(false);

  const photoStarted = useRef(false);

  useEffect(() => {
    if ((phase === "transitioning" || phase === "done") && !photoStarted.current) {
      photoStarted.current = true;
      photoControls.start({ opacity: 1, top: "6px", transition: { duration: 0.7, ease: "easeOut" } });
      const t = setTimeout(() => {
        photoControls.start({
          top: "-60px",
          transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
        });
      }, 700);
      return () => clearTimeout(t);
    }
  }, [phase, photoControls]);

  useEffect(() => {
    if (phase === "done") setTextVisible(true);
  }, [phase]);

  // 375px 기준 설계값 → vw 비율로 반응형 적용
  // height:   180vw (675px @375) — clamp로 상하한
  // names:    top 18.7vw (70px @375)
  // group:    top 34.7vw (130px @375)
  // photo:    left 6%

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        containerType: "inline-size",
        backgroundColor: "#ecece9",
        backgroundImage: `url('${ASSETS.paperTexture}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Names — top 70px */}
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
          opacity: textVisible ? 1 : 0,
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

      {/* SAVE / The / DATE — top 130px */}
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
          opacity: textVisible ? 1 : 0,
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

      {/* Date + Tagline — bottom 41px */}
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
          opacity: textVisible ? 1 : 0,
        }}
      >
        <p style={{ margin: 0, fontFamily: "'Cormorant Infant', serif", fontWeight: 600, fontSize: "5.3cqw", whiteSpace: "nowrap" }}>
          {WEDDING.dateDisplay}
        </p>
        <p style={{ margin: 0, fontFamily: "'Cormorant Infant', serif", fontWeight: 400, fontSize: "3.7cqw", lineHeight: 1.2 }}>
          {WEDDING.tagline1}<br />{WEDDING.tagline2}
        </p>
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
