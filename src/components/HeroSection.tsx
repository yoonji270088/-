import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { WEDDING } from "../constants/wedding";
import { ASSETS } from "../constants/assets";
import { Phase } from "../App";

interface Props { phase: Phase; }

export default function HeroSection({ phase }: Props) {
  const photoControls = useAnimation();
  const photoStarted  = useRef(false);
  const namesRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const dateRef  = useRef<HTMLDivElement>(null);

  // 사진 등장 애니메이션 (transitioning 시작 시 1회)
  useEffect(() => {
    if ((phase === "transitioning" || phase === "done") && !photoStarted.current) {
      photoStarted.current = true;
      photoControls.start({ opacity: 1, y: 6, transition: { duration: 0.7, ease: "easeOut" } });
      const t = setTimeout(() => {
        photoControls.start({
          y: -60,
          transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
        });
      }, 700);
      return () => clearTimeout(t);
    }
  }, [phase, photoControls]);

  // hero 텍스트 visibility는 SplashOverlay의 전환 완료 시점에 맞춰
  // SplashOverlay에서 직접 getElementById로 제어함 → 여기선 done 폴백만 유지
  useEffect(() => {
    if (phase === "done") {
      if (namesRef.current) namesRef.current.style.visibility = "visible";
      if (groupRef.current) groupRef.current.style.visibility = "visible";
      if (dateRef.current)  dateRef.current.style.visibility  = "visible";
    }
  }, [phase]);

  return (
    <div
      style={{
        width: "100%",
        height: "100svh",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        containerType: "inline-size",
        willChange: "transform",
        backgroundColor: "#ecece9",
        backgroundImage: `url('${ASSETS.paperTexture}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        id="hero-names"
        ref={namesRef}
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
          visibility: "hidden",
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

      <div
        id="hero-group"
        ref={groupRef}
        style={{
          position: "absolute",
          zIndex: 4,
          top: "25.7cqw",
          left: "50%",
          transform: "translateX(-50%)",
          width: "74.7cqw",
          height: "41.3cqw",
          visibility: "hidden",
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

      <div
        id="hero-date"
        ref={dateRef}
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
          visibility: "hidden",
        }}
      >
        <p style={{ margin: 0, fontFamily: "'Cormorant Infant', serif", fontWeight: 600, fontSize: "4.9cqw", whiteSpace: "nowrap" }}>
          {WEDDING.dateDisplay}
        </p>
        <p style={{ margin: 0, marginTop: "6px", fontFamily: "'Cormorant Infant', serif", fontWeight: 400, fontSize: "3.3cqw", lineHeight: 1.2 }}>
          {WEDDING.tagline1}<br />{WEDDING.tagline2}
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0,
          width: "100%",
          height: "320px",
          zIndex: 2,
        }}
      >
        {/* 센터링 래퍼(transform)와 motion(y 애니메이션)을 분리 → GPU 레이어 충돌 방지 */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "88%", maxWidth: "330px",
          aspectRatio: "346 / 268",
          zIndex: 1, overflow: "hidden",
        }}>
          <motion.div
            animate={photoControls}
            initial={{ opacity: 0, y: 0 }}
            style={{ width: "100%", height: "100%" }}
          >
            <img
              src={ASSETS.heroPhoto}
              alt="Wedding photo"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "grayscale(100%)", display: "block" }}
            />
          </motion.div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 3, pointerEvents: "none", lineHeight: 0 }}>
          <img src={ASSETS.envelope} alt="" style={{ width: "100%", display: "block" }} />
        </div>
      </div>
    </div>
  );
}
