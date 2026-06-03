import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ASSETS } from "../constants/assets";
import { useScrollLock } from "../hooks";

function GalleryModal({ images, index, onClose, onNext, onPrev }: {
  images: string[]; index: number;
  onClose: () => void; onNext: () => void; onPrev: () => void;
}) {
  useScrollLock(true);
  const touchStartX = useRef<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{ position: "relative", width: "100%", maxWidth: "430px", padding: "0 48px" }}
        onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 50) dx < 0 ? onNext() : onPrev();
          touchStartX.current = null;
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={index} src={images[index]} alt={`Gallery ${index + 1}`}
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
            style={{ width: "100%", maxHeight: "72vh", objectFit: "contain", borderRadius: "2px", display: "block" }}
          />
        </AnimatePresence>
        {index > 0 && (
          <button onClick={onPrev} style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.5)", border: "none", color: "white", fontSize: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
        )}
        {index < images.length - 1 && (
          <button onClick={onNext} style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.5)", border: "none", color: "white", fontSize: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        )}
      </div>
      <button onClick={onClose} style={{ position: "fixed", top: "20px", right: "20px", width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", border: "none", color: "white", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
        {images.map((_, i) => (
          <div key={i} style={{ width: i === index ? "16px" : "6px", height: "6px", borderRadius: "3px", backgroundColor: "white", opacity: i === index ? 1 : 0.4, transition: "all 0.2s" }} />
        ))}
      </div>
    </motion.div>
  );
}

export default function GallerySection() {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
        backgroundColor: "#f9f7f3",
        width: "100%",
        paddingTop: "100px",
        paddingBottom: "80px",
        paddingInline: "clamp(12px, 3.2vw, 20px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}>
        <p style={{ fontFamily: "'Cormorant Upright', serif", fontWeight: 400, fontSize: "clamp(22px, 7.5vw, 30px)", color: "#00226a", textAlign: "center", margin: 0 }}>
          Gallery
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", width: "100%" }}>
          {ASSETS.galleryGrid.map((src, i) => {
            const isLast = i === ASSETS.galleryGrid.length - 1;
            return (
              <div
                key={i}
                onClick={() => setModalIndex(i)}
                style={{
                  position: "relative",
                  height: "142px",
                  backgroundColor: "#c3c3c3",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <img src={src} alt={`Gallery ${i + 1}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                {isLast && (
                  <>
                    <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.44)" }} />
                    <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: "12px", color: "white", whiteSpace: "nowrap", margin: 0 }}>더보기+</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
      <AnimatePresence>
        {modalIndex !== null && (
          <GalleryModal
            images={ASSETS.galleryAll}
            index={modalIndex}
            onClose={() => setModalIndex(null)}
            onNext={() => setModalIndex(p => p !== null ? Math.min(p + 1, ASSETS.galleryAll.length - 1) : null)}
            onPrev={() => setModalIndex(p => p !== null ? Math.max(p - 1, 0) : null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
