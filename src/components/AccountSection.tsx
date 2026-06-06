import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { WEDDING } from "../constants/wedding";
import { ASSETS } from "../constants/assets";

declare global { interface Window { Kakao: any; } }

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handle} style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "12px", color: copied ? "#00226a" : "#766b52", backgroundColor: "transparent", border: `1px solid ${copied ? "#00226a" : "#c8bfa8"}`, borderRadius: "4px", padding: "2px 8px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", flexShrink: 0 }}>
      {copied ? "완료" : "복사"}
    </button>
  );
}

function AccordionGroup({ label, accounts }: { label: string; accounts: { bank: string; number: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ backgroundColor: "#fffdf8", border: "1px solid #e7dbc3", width: "clamp(260px, 80vw, 320px)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", height: "48px", paddingLeft: "20px", paddingRight: "12px",
          backgroundColor: "transparent", border: "none",
          borderBottom: open ? "1px solid #eae7e1" : "none",
          cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "14px", color: "#121212" }}>{label}</span>
        {open ? <ChevronUp size={20} strokeWidth={1.5} color="#777" /> : <ChevronDown size={20} strokeWidth={1.5} color="#777" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {accounts.map((acc, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 14px 20px", borderTop: i > 0 ? "1px solid #eae7e1" : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "12px", color: "#888", lineHeight: "18px", margin: 0 }}>{acc.bank} | {acc.name}</p>
                  <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "14px", color: "#121212", lineHeight: "22px", margin: 0 }}>{acc.number}</p>
                </div>
                <CopyButton text={acc.number} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AccountSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const triggered = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          controls.start({ opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } });
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [controls]);

const SHARE_URL = "https://uginyoonji.vercel.app";

const handleKakaoShare = () => {
  const key = import.meta.env.VITE_KAKAO_JS_KEY;
  if (!key) { alert("카카오 공유 키가 설정되지 않았습니다."); return; }
  if (!window.Kakao) { alert("카카오 SDK 로드 실패. 잠시 후 다시 시도해주세요."); return; }
  if (!window.Kakao.isInitialized()) window.Kakao.init(key);

  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: `${WEDDING.groomNameKo} ♥ ${WEDDING.brideNameKo} 결혼합니다`,
      description: `${WEDDING.dateKo}\n${WEDDING.venue}`,
      imageUrl: `${SHARE_URL}/og-image.png`,
      link: { mobileWebUrl: SHARE_URL, webUrl: SHARE_URL },
    },
    buttons: [
      { title: "청첩장 보기", link: { mobileWebUrl: SHARE_URL, webUrl: SHARE_URL } },
    ],
  });
};

  const handleLinkShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
    alert("링크가 복사되었습니다.");
  };

  return (
    <motion.div
      ref={sectionRef}
      animate={controls}
      initial={{ opacity: 0, y: 40 }}
      style={{
        backgroundColor: "#f5f2eb", width: "100%",
        paddingTop: "80px",
        paddingBottom: "80px",
        paddingInline: "clamp(24px, 7vw, 48px)",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "74px",
      }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(16px, 5vw, 28px)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <p style={{ fontFamily: "'Cormorant Upright', serif", fontWeight: 400, fontSize: "14px", color: "#334e88", opacity: 0.8, textAlign: "center", margin: 0 }}>Account</p>
          <p style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 600, fontSize: "clamp(14px, 4.3vw, 18px)", color: "#00226a", textAlign: "center", margin: 0 }}>마음 전하실 곳</p>
        </div>
        <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "14px", color: "#303030", opacity: 0.8, lineHeight: 1.8, textAlign: "center", maxWidth: "280px", margin: 0 }}>
          멀리서도 축하의 마음을<br />전하고 싶으신 분들을 위해<br />계좌번호를 안내드립니다.<br /><br />
          소중한 축하를 보내주셔서 감사드리며,<br />따뜻한 마음에 깊이 감사드립니다.
        </p>
      </div>

      {/* Accordions */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <AccordionGroup label="신랑측" accounts={WEDDING.groom.accounts} />
        <div style={{ marginTop: "-1px" }}>
          <AccordionGroup label="신부측" accounts={WEDDING.bride.accounts} />
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <button onClick={handleKakaoShare} style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#efe7d7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={ASSETS.kakaoIcon} alt="카카오 공유" style={{ width: "28px", height: "28px" }} />
          </button>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "13px", color: "#766b52", opacity: 0.8, margin: 0 }}>Kakao</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <button onClick={handleLinkShare} style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#efe7d7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={ASSETS.linkIcon} alt="링크 공유" style={{ width: "28px", height: "28px" }} />
          </button>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "13px", color: "#766b52", opacity: 0.8, margin: 0 }}>Link</p>
        </div>
      </div>
    </motion.div>
  );
}
