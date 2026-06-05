import { motion } from "framer-motion";
import { WEDDING } from "../constants/wedding";

export default function InvitationSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      style={{
        backgroundColor: "#f9f7f3",
        width: "100%",
        paddingTop: "120px",
        paddingBottom: "100px",
        paddingInline: "59px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "78px", width: "100%", alignItems: "center" }}>

        {/* 텍스트 블록: gap 36px */}
        <div style={{ display: "flex", flexDirection: "column", gap: "36px", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Cormorant Upright', serif", fontWeight: 400, fontSize: "28px", color: "#00226a", lineHeight: "normal", margin: 0, textAlign: "center" }}>Join us</p>
            <p style={{ fontFamily: "'Cormorant Upright', serif", fontWeight: 400, fontSize: "28px", color: "#00226a", lineHeight: "normal", margin: 0, textAlign: "center" }}>for our wedding</p>
          </div>
          <p style={{
            fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "14px",
            color: "#303030", opacity: 0.8, lineHeight: 1.6, margin: 0,
            textAlign: "center", whiteSpace: "pre-wrap", wordBreak: "keep-all",
          }}>
            {"저희의 결혼 소식이\n부담스럽지 않게 다가가길 바라며,\n편한 마음으로 오셔서\n축하해주시면 감사하겠습니다.\n\n혹여 참석이 어려우시더라도 부담 갖지 마시고,\n마음으로 축하해주시면 감사하겠습니다."}
          </p>
        </div>

        {/* 이름 블록: gap 24px */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {[
            { parents: `${WEDDING.groom.fatherKo} · ${WEDDING.groom.motherKo}의 ${WEDDING.groom.relation}`, role: WEDDING.groom.label, name: WEDDING.groomNameKo },
            { parents: `${WEDDING.bride.fatherKo} · ${WEDDING.bride.motherKo}의 ${WEDDING.bride.relation}`, role: WEDDING.bride.label, name: WEDDING.brideNameKo },
          ].map(({ parents, role, name }) => (
            <div key={name} style={{ display: "flex", gap: "50px", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300, fontSize: "13px", color: "rgba(0,0,0,0.8)", whiteSpace: "nowrap", margin: 0 }}>
                {parents}
              </p>
              <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", flexShrink: 0 }}>
                <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 300, fontSize: "12px", color: "rgba(0,0,0,0.5)", margin: 0, lineHeight: 1 }}>{role}</p>
                <p style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 400, fontSize: "16px", color: "#000", whiteSpace: "nowrap", margin: 0, lineHeight: 1 }}>{name}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
