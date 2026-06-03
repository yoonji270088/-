import { motion, AnimatePresence } from "framer-motion";

interface Props {
  color: string;
  colorTransition?: boolean; // true면 color 변화에 animate transition 적용
  showSave?: boolean;
  showThe?:  boolean;
  showDate?: boolean;
}

export default function TypographyGroup({
  color,
  colorTransition = false,
  showSave = true,
  showThe  = true,
  showDate = true,
}: Props) {
  const fontSize = "clamp(44px, 14.9vw, 64px)";
  const colorAnim = colorTransition
    ? { color }
    : undefined;
  const colorStyle = colorTransition
    ? {}
    : { color };
  const colorTransitionProp = colorTransition
    ? { duration: 1.0, ease: "easeInOut" }
    : undefined;

  const base: React.CSSProperties = {
    margin: 0,
    lineHeight: 1,
    whiteSpace: "nowrap",
    position: "absolute",
    ...colorStyle,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "clamp(240px, 72vw, 310px)",
        height: "clamp(120px, 40vw, 172px)",
      }}
    >
      {/* SAVE */}
      <AnimatePresence>
        {showSave && (
          <motion.p
            layoutId="save"
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, ...colorAnim }}
            transition={{ duration: 0.5, ...colorTransitionProp }}
            style={{ ...base, fontFamily: "'Cormorant Upright', serif", fontWeight: 300, fontSize, top: 0, left: 0 }}
          >
            SAVE
          </motion.p>
        )}
      </AnimatePresence>

      {/* The */}
      <AnimatePresence>
        {showThe && (
          <motion.p
            layoutId="the"
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, ...colorAnim }}
            transition={{ duration: 0.5, ...colorTransitionProp }}
            style={{ ...base, fontFamily: "'Mrs Saint Delafield', cursive", fontSize, top: "37%", left: "39%" }}
          >
            The
          </motion.p>
        )}
      </AnimatePresence>

      {/* DATE */}
      <AnimatePresence>
        {showDate && (
          <motion.p
            layoutId="date"
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, ...colorAnim }}
            transition={{ duration: 0.5, ...colorTransitionProp }}
            style={{ ...base, fontFamily: "'Cormorant Upright', serif", fontWeight: 300, fontSize, top: "58%", right: 0 }}
          >
            DATE
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
