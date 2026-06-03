import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WEDDING } from "../constants/wedding";
import TypographyGroup from "./TypographyGroup";

interface Props {
  phase: "splash" | "transitioning" | "done";
  onComplete: () => void;
}

export default function IntroSplash({ phase, onComplete }: Props) {
  const [showSave, setShowSave] = useState(false);
  const [showThe,  setShowThe]  = useState(false);
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSave(true), 300);
    const t2 = setTimeout(() => setShowThe(true),  800);
    const t3 = setTimeout(() => setShowDate(true), 1300);
    const t4 = setTimeout(() => onComplete(),      3500);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  const isTransitioning = phase === "transitioning";

  return (
    <motion.div
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 1.3, ease: "easeInOut" }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        minHeight: "600px",
        backgroundColor: "#041438",
        zIndex: 20,
        pointerEvents: isTransitioning ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      {/* ── Names ── */}
      <motion.div
        layoutId="names"
        layout="position"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          position: "absolute",
          top: "clamp(130px, 30vh, 220px)",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
          color: "#dddcbc",
          zIndex: 5,
        }}
      >
        <span style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300, fontSize: "clamp(12px, 3.7vw, 16px)", whiteSpace: "nowrap" }}>
          {WEDDING.groomNameEn}
        </span>
        <span style={{ fontFamily: "'Mrs Saint Delafield', cursive", fontSize: "clamp(14px, 5vw, 21px)", lineHeight: 1 }}>
          &amp;
        </span>
        <span style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300, fontSize: "clamp(12px, 3.7vw, 16px)", whiteSpace: "nowrap" }}>
          {WEDDING.brideNameEn}
        </span>
      </motion.div>

      {/* ── SAVE / The / DATE ──
          Hero와 동일: left 50% + translateX(-50%)
          top도 Hero의 TypographyGroup top과 동일하게 맞춤
      ── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(174px, 46vh, 268px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
        }}
      >
        <TypographyGroup
          color="#dddcbc"
          showSave={showSave}
          showThe={showThe}
          showDate={showDate}
        />
      </div>

      {/* ── Date + Tagline ── */}
      <motion.div
        layoutId="dateTagline"
        layout="position"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: "absolute",
          bottom: "clamp(36px, 6vh, 60px)",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          textAlign: "center",
          color: "#dddcbc",
          paddingInline: "16px",
          zIndex: 4,
        }}
      >
        <p style={{ margin: 0, fontFamily: "'Cormorant Infant', serif", fontWeight: 600, fontSize: "clamp(15px, 4.8vw, 20px)", whiteSpace: "nowrap" }}>
          {WEDDING.dateDisplay}
        </p>
        <p style={{ margin: 0, fontFamily: "'Cormorant Infant', serif", fontWeight: 400, fontSize: "clamp(11px, 3.2vw, 14px)", lineHeight: 1.7 }}>
          {WEDDING.tagline1}<br />{WEDDING.tagline2}
        </p>
      </motion.div>
    </motion.div>
  );
}
