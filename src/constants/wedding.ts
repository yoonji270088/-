export const WEDDING_DATE = new Date("2026-09-05T12:30:00");

export const WEDDING = {
  groomNameEn: "U-jin",
  brideNameEn: "Yoonji",
  groomNameKo: "안우진",
  brideNameKo: "최윤지",
  dateDisplay: "Sat, September 5th, 2026",
  dateKo: "2026년 9월 5일 토요일 오후 12시 30분",
  dateNumeric: "2026.09.05",
  venue: "티웨딩 평택",
  venueFloor: "평택 티웨딩홀 5층",
  address: "경기도 평택시 평택5로 34번길 6-5 (합정동 965-5번지)",
  tagline1: "Forever begins with a single step,",
  tagline2: "And love guides us every step of the way.",
  groom: {
    fatherKo: "안창용", motherKo: "하민호", relation: "장남", label: "신랑",
    accounts: [
      { name: "안우진", bank: "농협은행", number: "356-0749-1482-13" },
      { name: "안창용", bank: "농협은행", number: "171683-52-066010" },
      { name: "하민호", bank: "농협은행", number: "171683-52-047117" },
    ],
  },
  bride: {
    fatherKo: "최덕선", motherKo: "김용선", relation: "장녀", label: "신부",
    accounts: [
      { name: "최윤지", bank: "카카오뱅크", number: "3333-10-0442659" },
      { name: "최덕선", bank: "우리은행",   number: "1002-049-102340" },
      { name: "김용선", bank: "농협은행",   number: "100104-52-180328" },
    ],
  },
  location: { placeId: "26796717", placeName: "티웨딩홀", address: "경기도 평택시 평택5로34번길 6-5" },
  naviLinks: {
    // 카카오: place ID로 장소 열기 → 앱 내 길찾기 버튼으로 현재위치→목적지 안내
    kakaoNavi:    "kakaomap://look?p=26796717",
    kakaoNaviWeb: "https://place.map.kakao.com/26796717",
    // 티맵: 주소 기반 경로 — 출발지 현재위치 자동, 도착지 티웨딩홀
    tmap:    "tmap://route?goalname=티웨딩홀+평택&goaladdr=경기도+평택시+평택5로34번길+6-5",
    tmapWeb: "https://tmap.life/route?goalname=%ED%8B%B0%EC%9B%A8%EB%94%A9%ED%99%80+%ED%8F%89%ED%83%9D&goaladdr=%EA%B2%BD%EA%B8%B0%EB%8F%84+%ED%8F%89%ED%83%9D%EC%8B%9C+%ED%8F%89%ED%83%9D5%EB%A1%9C34%EB%B2%88%EA%B8%B8+6-5",
    // 네이버: 장소명 검색
    naverMap:    "nmap://search?query=티웨딩+평택&appname=wedding",
    naverMapWeb: "https://map.naver.com/v5/search/티웨딩+평택",
  },
};
