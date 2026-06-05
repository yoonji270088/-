import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { WEDDING } from "../constants/wedding";
import { Phase } from "../App";

interface Props {
  phase: Phase;
  onComplete: () => void;
}

export default function SplashOverlay({ phase, onComplete }: Props) {
  const [showSave, setShowSave] = useState(false);
  const [showThe,  setShowThe]  = useState(false);
  const [showDate, setShowDate] = useState(false);

  const namesCtrl = useAnimation();
  const groupCtrl = useAnimation();
  const dateCtrl  = useAnimation();

  const namesRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const dateRef  = useRef<HTMLDivElement>(null);

  // 스크롤 잠금
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Names, Date fade-in
  useEffect(() => {
    namesCtrl.start({ opacity: 1, transition: { duration: 0.6, delay: 0.1 } });
    dateCtrl.start({ opacity: 1, transition: { duration: 0.6, delay: 0.3 } });
  }, [namesCtrl, dateCtrl]);

  // stagger
  useEffect(() => {
    const t1 = setTimeout(() => setShowSave(true), 300);
    const t2 = setTimeout(() => setShowThe(true), 800);
    const t3 = setTimeout(() => setShowDate(true), 1300);
    const t4 = setTimeout(() => onComplete(), 3500);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  // transitioning → Hero 위치로 이동
  useEffect(() => {
    if (phase !== "transitioning") return;

    const heroNames = document.getElementById("hero-names");
    const heroGroup = document.getElementById("hero-group");
    const heroDate  = document.getElementById("hero-date");
    if (!heroNames || !heroGroup || !heroDate) return;
    if (!namesRef.current || !groupRef.current || !dateRef.current) return;

    const dur = 1.3;
    const ease = [0.4, 0, 0.2, 1] as [number, number, number, number];

    // 각 ref 요소 기준으로 delta 계산 (wrapper 기준이 아닌 실제 요소 기준)
    const namesR = namesRef.current.getBoundingClientRect();
    const groupR = groupRef.current.getBoundingClientRect();
    const dateR  = dateRef.current.getBoundingClientRect();

    const namesDx = heroNames.getBoundingClientRect().left - namesR.left;
    const namesDy = heroNames.getBoundingClientRect().top  - namesR.top;
    const groupDx = heroGroup.getBoundingClientRect().left - groupR.left;
    const groupDy = heroGroup.getBoundingClientRect().top  - groupR.top;
    const dateDx  = heroDate.getBoundingClientRect().left  - dateR.left;
    const dateDy  = heroDate.getBoundingClientRect().top   - dateR.top;

    namesCtrl.start({ x: namesDx, y: namesDy, color: "#00226a", transition: { duration: dur, ease } });
    groupCtrl.start({ x: groupDx, y: groupDy, transition: { duration: dur, ease } });
    dateCtrl.start({ x: dateDx,  y: dateDy,  color: "#00226a", transition: { duration: dur, ease } });

    groupRef.current.querySelectorAll("p").forEach((p) => {
      (p as HTMLElement).style.transition = "color 1.1s ease-in-out";
      (p as HTMLElement).style.color = "#00226a";
    });
  }, [phase, namesCtrl, groupCtrl, dateCtrl]);

  const isTransitioning = phase === "transitioning";
  const fontSize = "14.9cqw";

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 20,
        overflow: "hidden",
        pointerEvents: isTransitioning ? "none" : "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* 네이비 배경 */}
      <motion.div
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1.3, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0, backgroundColor: "#041438" }}
      />

      {/* 내부 컨테이너 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "430px",
          minWidth: "320px",
          height: "100%",
          containerType: "inline-size",
        }}
      >

        {/* Names */}
        <motion.div
          ref={namesRef}
          animate={namesCtrl}
          initial={{ opacity: 0 }}
          style={{
            position: "absolute",
            top: "24vh",
            left: 0, right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            color: "#dddcbc",
            zIndex: 2,
          }}
        >
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300, fontSize: "4cqw", whiteSpace: "nowrap" }}
          >
            {WEDDING.groomNameEn}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "'Mrs Saint Delafield', cursive", fontSize: "5.6cqw", lineHeight: 1 }}
          >
            &amp;
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300, fontSize: "4cqw", whiteSpace: "nowrap" }}
          >
            {WEDDING.brideNameEn}
          </motion.span>
        </motion.div>

        {/* SAVE / The / DATE — groupCtrl을 wrapper가 아닌 실제 요소(groupRef)에 직접 적용 */}
        <div
          style={{
            position: "absolute",
            top: "60cqw",
            left: 0, right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <motion.div
            ref={groupRef}
            animate={groupCtrl}
            style={{
              position: "relative",
              width: "74.7cqw",
              height: "41.3cqw",
              flexShrink: 0,
            }}
          >
            {showSave && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ margin: 0, lineHeight: 1, whiteSpace: "nowrap", position: "absolute",
                  top: 0, left: 0, color: "#dddcbc",
                  fontFamily: "'Cormorant Upright', serif", fontWeight: 300, fontSize }}
              >SAVE</motion.p>
            )}
            {showThe && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ margin: 0, lineHeight: 1, whiteSpace: "nowrap", position: "absolute",
                  top: "37%", left: "39%", color: "#dddcbc",
                  fontFamily: "'Mrs Saint Delafield', cursive", fontSize }}
              >The</motion.p>
            )}
            {showDate && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ margin: 0, lineHeight: 1, whiteSpace: "nowrap", position: "absolute",
                  top: "58%", right: 0, color: "#dddcbc",
                  fontFamily: "'Cormorant Upright', serif", fontWeight: 300, fontSize }}
              >DATE</motion.p>
            )}
          </motion.div>
        </div>

        {/* Date + Tagline */}
        <motion.div
          ref={dateRef}
          animate={dateCtrl}
          initial={{ opacity: 0 }}
          style={{
            position: "absolute",
            bottom: "clamp(36px, 6vh, 60px)",
            left: 0, right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            textAlign: "center",
            color: "#dddcbc",
            paddingInline: "16px",
            zIndex: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p style={{ margin: 0, fontFamily: "'Cormorant Infant', serif", fontWeight: 600, fontSize: "4.9cqw", whiteSpace: "nowrap" }}>
              {WEDDING.dateDisplay}
            </p>
            <p style={{ margin: 0, marginTop: "6px", fontFamily: "'Cormorant Infant', serif", fontWeight: 400, fontSize: "3.3cqw", lineHeight: 1.2 }}>
              {WEDDING.tagline1}<br />{WEDDING.tagline2}
            </p>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
