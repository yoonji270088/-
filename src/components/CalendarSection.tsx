import { motion } from "framer-motion";
import { WEDDING, WEDDING_DATE } from "../constants/wedding";

function buildCalendarWeeks(year: number, month: number) {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevTotal   = new Date(year, month, 0).getDate();

  type Cell = { day: number; type: "prev" | "cur" | "next" };
  const cells: Cell[] = [];

  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevTotal - i, type: "prev" });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, type: "cur" });
  const rem = 7 - (cells.length % 7 || 7);
  for (let i = 1; i <= rem; i++)
    cells.push({ day: i, type: "next" });

  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  while (weeks.length && weeks[weeks.length - 1].every(c => c.type !== "cur")) weeks.pop();
  return weeks;
}

export default function CalendarSection() {
  const year       = WEDDING_DATE.getFullYear();
  const month      = WEDDING_DATE.getMonth();
  const weddingDay = WEDDING_DATE.getDate();
  const weeks      = buildCalendarWeeks(year, month);
  const weekdays   = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      style={{
        backgroundColor: "#041438",
        width: "100%",
        paddingTop: "80px",
        paddingBottom: "80px",
        paddingInline: "clamp(16px, 4vw, 24px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(14px, 4vw, 20px)",
      }}
    >
      <div style={{ textAlign: "center", color: "white" }}>
        <p style={{ fontFamily: "'Cormorant Infant', serif", fontWeight: 500, fontSize: "clamp(22px, 7.5vw, 30px)", lineHeight: 1.5, opacity: 0.85, margin: 0 }}>
          {WEDDING.dateNumeric}
        </p>
        <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 300, fontSize: "clamp(12px, 3.7vw, 15px)", lineHeight: 1.7, opacity: 0.6, margin: 0 }}>
          {WEDDING.dateKo}
        </p>
        <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 300, fontSize: "clamp(12px, 3.7vw, 15px)", lineHeight: 1.7, opacity: 0.6, margin: 0 }}>
          {WEDDING.venueFloor}
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex" }}>
          {weekdays.map(d => (
            <p key={d} style={{ flex: 1, textAlign: "center", margin: 0, fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "clamp(11px, 3.2vw, 13px)", color: "white", opacity: 0.75, padding: "6px 0" }}>{d}</p>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex" }}>
            {week.map((cell, di) => {
              const isWedding = cell.type === "cur" && cell.day === weddingDay;
              const isFaded   = cell.type !== "cur";
              return (
                <div key={di} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "5px 0" }}>
                  {isWedding && (
                    <div style={{ position: "absolute", width: "clamp(24px, 7.5vw, 32px)", height: "clamp(24px, 7.5vw, 32px)", borderRadius: "50%", backgroundColor: "#dddcbc" }} />
                  )}
                  <p style={{ position: "relative", margin: 0, fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "clamp(11px, 3.2vw, 13px)", textAlign: "center", color: isWedding ? "#041438" : "white", opacity: isFaded ? 0.28 : 0.82 }}>{cell.day}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
