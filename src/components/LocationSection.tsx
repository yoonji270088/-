import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { WEDDING } from "../constants/wedding";

declare global { interface Window { kakao: any; } }

function KakaoMap({ onCoords }: { onCoords?: (lat: number, lng: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized  = useRef(false);
  const key     = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined;
  const placeId = WEDDING.location.placeId;
  const name    = WEDDING.location.placeName;
  const address = WEDDING.location.address;

  useEffect(() => {
    if (!key) return;

    const initMap = () => {
      if (initialized.current || !containerRef.current) return;
      initialized.current = true;

      window.kakao.maps.load(() => {
        if (!containerRef.current) return;

        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(
          name,
          (results: any[], status: string) => {
            if (status !== window.kakao.maps.services.Status.OK || !containerRef.current) return;

            const place = results.find((r: any) => r.id === placeId) ?? results[0];
            if (!place) return;

            const lat = parseFloat(place.y);
            const lng = parseFloat(place.x);

                      // 부모에 좌표 전달 → 네비 링크에 사용
            onCoords?.(lat, lng);

            const center = new window.kakao.maps.LatLng(lat, lng);
            const map = new window.kakao.maps.Map(containerRef.current, { center, level: 4 });
            new window.kakao.maps.Marker({ map, position: center, title: place.place_name });
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:6px 10px;font-family:'Pretendard',sans-serif;">
                <div style="font-size:13px;font-weight:600;white-space:nowrap;">${place.place_name}</div>
                <div style="font-size:11px;color:#666;margin-top:2px;white-space:nowrap;">${place.road_address_name || address}</div>
              </div>`,
            });
            infowindow.open(map, new window.kakao.maps.Marker({ position: center }));
          },
        );
      });
    };

    if (window.kakao?.maps?.services) { initMap(); return; }

    if (document.getElementById("kakao-map-sdk")) {
      window.addEventListener("kakaoMapReady", initMap, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    // services 라이브러리 포함 → Places API 사용 가능
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => { window.dispatchEvent(new Event("kakaoMapReady")); initMap(); };
    document.head.appendChild(script);
    window.addEventListener("kakaoMapReady", initMap, { once: true });
  }, [key]);

  // API key 없을 때: 카카오맵 place 페이지 iframe embed
  if (!key) {
    return (
      <div style={{
        width: "100%", height: "clamp(180px, 52vw, 230px)",
        borderRadius: "6px", overflow: "hidden",
        border: "1px solid #e4ddd0",
      }}>
        <iframe
          title="지도"
          src={`https://place.map.kakao.com/${placeId}`}
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", height: "clamp(180px, 52vw, 230px)",
        borderRadius: "6px", overflow: "hidden",
        border: "1px solid #e4ddd0",
      }}
    />
  );
}

function NaviBtn({ label, deepLink, webLink }: { label: string; deepLink: string; webLink: string }) {
  return (
    <button
      onClick={() => {
        const isKakaoInApp = /KAKAOTALK/i.test(navigator.userAgent);

        if (isKakaoInApp) {
          // 카카오 인앱브라우저: 웹 먼저 열기 → 인앱브라우저 탭 유지
          // 각 웹페이지(카카오맵/네이버/티맵)에서 앱으로 연결됨
          window.open(webLink, "_blank");
          return;
        }

        // 일반 브라우저: iframe으로 deep link 시도 → 현재 페이지 유지
        const iframe = document.createElement("iframe");
        iframe.style.cssText = "display:none;width:0;height:0;border:none;";
        iframe.src = deepLink;
        document.body.appendChild(iframe);
        setTimeout(() => { iframe.parentNode?.removeChild(iframe); }, 1000);

        // 앱 열리면 visibilitychange 발생 → fallback 취소
        let appOpened = false;
        const onHide = () => { appOpened = true; };
        document.addEventListener("visibilitychange", onHide, { once: true });
        setTimeout(() => {
          document.removeEventListener("visibilitychange", onHide);
          if (!appOpened) window.open(webLink, "_blank");
        }, 1800);
      }}
      style={{
        flex: 1, height: "34px",
        backgroundColor: "#ece8df", borderRadius: "999px",
        fontFamily: "'Pretendard', sans-serif", fontWeight: 400,
        fontSize: "clamp(12px, 3.5vw, 14px)", color: "#444",
        whiteSpace: "nowrap", border: "none", cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export default function LocationSection() {
  const { naviLinks } = WEDDING;
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Places API 좌표 기반 링크 (있으면 우선 사용)
  const tmapLink    = coords
    ? `tmap://route?goalname=티웨딩홀&goaly=${coords.lat}&goalx=${coords.lng}`
    : naviLinks.tmap;
  const kakaoLink   = coords
    ? `kakaomap://route?ep=${coords.lng},${coords.lat}&ename=티웨딩%20평택&by=CAR`
    : naviLinks.kakaoNavi;
  const controls = useAnimation();
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
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

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial={{ opacity: 0, y: 40 }}
      style={{
        backgroundColor: "#f9f7f3", width: "100%",
        paddingTop: "40px",
        paddingBottom: "80px",
        paddingInline: "clamp(16px, 4vw, 24px)",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "36px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(10px, 3vw, 18px)", width: "100%" }}>
        <p style={{ fontFamily: "'Cormorant Upright', serif", fontWeight: 400, fontSize: "14px", color: "#334e88", opacity: 0.8, textAlign: "center", margin: 0 }}>Location</p>
        <p style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 600, fontSize: "clamp(14px, 4.3vw, 18px)", color: "#00226a", textAlign: "center", margin: 0 }}>{WEDDING.venue}</p>
        <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "clamp(12px, 3.5vw, 14px)", color: "#303030", opacity: 0.8, lineHeight: 1.7, textAlign: "center", margin: 0 }}>{WEDDING.address}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "10px" }}>
        <KakaoMap onCoords={(lat, lng) => setCoords({ lat, lng })} />
        <div style={{ display: "flex", gap: "6px", width: "100%" }}>
          <NaviBtn label="티맵"       deepLink={tmapLink}           webLink={naviLinks.tmapWeb} />
          <NaviBtn label="카카오내비"  deepLink={kakaoLink}          webLink={naviLinks.kakaoNaviWeb} />
          <NaviBtn label="네이버지도"  deepLink={naviLinks.naverMap} webLink={naviLinks.naverMapWeb} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "380px", gap: "28px" }}>
        {/* 지하철 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: "clamp(13px, 4vw, 16px)", color: "#000", margin: 0 }}>지하철</p>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: "clamp(12px, 3.5vw, 14px)", color: "#333", opacity: 0.85, lineHeight: 1.6, margin: 0 }}>1호선 평택역 1번출구</p>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "clamp(12px, 3.5vw, 14px)", color: "#323232", opacity: 0.7, lineHeight: 1.7, margin: 0 }}>{"평택역/AKPLAZA 정류장에서 '평택시청' 방면 시내버스 이용\n→ 시청앞 또는 평택고 정류장 하차"}</p>
        </div>

        {/* 버스 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: "clamp(13px, 4vw, 16px)", color: "#000", margin: 0 }}>버스</p>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: "clamp(12px, 3.5vw, 14px)", color: "#333", opacity: 0.85, lineHeight: 1.6, margin: 0 }}>시청 앞 또는 평택고 정류장 하차</p>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "clamp(12px, 3.5vw, 14px)", color: "#323232", opacity: 0.7, lineHeight: 1.7, margin: 0 }}>{"평택역/AKPLAZA 정류장에서 '평택시청' 방면 시내버스 이용\n→ 시청앞 또는 평택고 정류장 하차"}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ display: "inline-block", backgroundColor: "#4CAF50", color: "white", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: "11px", padding: "2px 6px", borderRadius: "3px", width: "fit-content" }}>일반버스</span>
            <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "clamp(11px, 3.2vw, 13px)", color: "#323232", opacity: 0.7, lineHeight: 1.7, margin: 0 }}>310-1, 320, 320-1, 80, 80-1, 91, 98, 98-1, 1108, 1150, 1215, 1220, 1311, 1361, 1372, 1502, 1522, 1731, 순환111, 마을 10</p>
          </div>
        </div>

        {/* 자가용 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: "clamp(13px, 4vw, 16px)", color: "#000", margin: 0 }}>자가용</p>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: "clamp(12px, 3.5vw, 14px)", color: "#333", opacity: 0.85, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{'네비게이션 : "T웨딩홀", "티웨딩홀"\n또는 "0316562222" 입력'}</p>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "clamp(12px, 3.5vw, 14px)", color: "#323232", opacity: 0.7, lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>{'네비게이션 주소\n: "합정동 965-5" 또는 "평택5로 34번길 6-5" 입력'}</p>
        </div>

        {/* 주차장 안내 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: "clamp(13px, 4vw, 16px)", color: "#000", margin: 0 }}>주차장 안내</p>
          <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {["티웨딩홀 지하 4층 ~ 지상 3층", "평택시청 주차장", "배미공원 지하 공영주차장", "공설운동장 주차장"].map((item) => (
              <li key={item} style={{ listStyleType: "disc", fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: "clamp(12px, 3.5vw, 14px)", color: "#323232", opacity: 0.7, lineHeight: 1.7 }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
