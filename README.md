# 💌 Wedding Invitation — U-jin & Yoonji

React + Vite + Tailwind CSS + Framer Motion 기반 모바일 청첩장 웹사이트

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── IntroSplash.tsx       # 인트로 스플래시 (네이비 배경, 애니메이션)
│   ├── HeroSection.tsx       # 히어로 (봉투+사진+왁스씰 레이어)
│   ├── InvitationSection.tsx # 초대장 텍스트
│   ├── CalendarSection.tsx   # 달력 + D-day
│   ├── GallerySection.tsx    # 3×3 갤러리 + 풀스크린 모달
│   ├── LocationSection.tsx   # 카카오맵 + 교통 안내
│   └── AccountSection.tsx    # 계좌 아코디언 + 공유 버튼
├── constants/
│   └── wedding.ts            # ⭐ 모든 콘텐츠 설정 (이름, 날짜, 장소, 계좌 등)
├── hooks/
│   └── index.ts              # useDday, useScrollLock
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 카카오 API 키를 입력하세요:

```
VITE_KAKAO_MAP_KEY=your_kakao_map_key
VITE_KAKAO_JS_KEY=your_kakao_js_key
```

> **카카오 개발자 콘솔**: https://developers.kakao.com/
> - 앱 등록 후 **JavaScript 키** 두 곳 모두에 사용
> - 카카오맵: 웹 플랫폼에 사이트 도메인 등록 필요
> - 카카오 공유: 카카오 로그인 > 카카오 링크 설정

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

### 4. 빌드

```bash
npm run build
```

---

## ✏️ 콘텐츠 수정

`src/constants/wedding.ts` 파일 하나에서 모든 내용을 수정할 수 있습니다:

```ts
export const WEDDING = {
  groomNameEn: "U-jin",
  brideNameEn: "Yoonji",
  groomNameKo: "안우진",
  brideNameKo: "최윤지",
  dateDisplay: "Sat, September 5th, 2026",
  // ...
};
```

### 이미지 교체

`ASSETS` 객체의 URL을 실제 파일 경로로 교체하세요:

```ts
export const ASSETS = {
  paperTexture: "/images/paper-texture.jpg",
  weddingPhoto: "/images/wedding-photo.jpg",
  envelopeMask: "/images/envelope-mask.png",
  waxSeal: "/images/wax-seal.png",
  gallery: [
    "/images/gallery/01.jpg",
    "/images/gallery/02.jpg",
    // ...
  ],
};
```

> ⚠️ Figma asset URL은 **7일 후 만료**됩니다. 배포 전에 반드시 실제 이미지로 교체하세요.

---

## 🎨 섹션별 특이사항

### IntroSplash
- `SAVE` → `The` → `DATE` 순서로 0.5초 간격 fade in
- 전체 등장 후 2초 유지 → fade out
- Framer Motion `layoutId`로 HeroSection과 공유 레이아웃 트랜지션

### HeroSection
- `z-index` 레이어: 배경(1) → 사진(2) → 왁스씰(3) → 텍스트(5)
- 사진은 봉투 마스크 안에서 translateY로 위로 올라오는 애니메이션
- 텍스트는 Intro에서 이어지는 shared layout transition

### CalendarSection
- 결혼식 날짜(`WEDDING_DATE`) 기준으로 자동 계산
- 당월 달력 자동 생성 + 전/후 달 faded 처리
- D-day 실시간 계산 (자정 기준)

### GallerySection
- 마지막 이미지에 "더보기+" dim overlay
- 모달: swipe(50px 이상) + 화살표 + X 버튼
- body scroll lock (스크롤 위치 복원)

### LocationSection
- `VITE_KAKAO_MAP_KEY` 있으면 실제 카카오맵, 없으면 정적 스크린샷 fallback
- 네비 버튼: 앱 deep link → 1.5초 후 웹 fallback

### AccountSection
- 신랑측/신부측 아코디언 독립 동작
- 복사 버튼: "복사" → "완료" → 1.5초 후 복귀
- 카카오 공유: `VITE_KAKAO_JS_KEY` 필요
- 링크 공유: `navigator.clipboard` + alert

---

## 🌐 배포

### Vercel

```bash
npm install -g vercel
vercel --prod
```

환경 변수는 Vercel 대시보드 > Settings > Environment Variables에서 설정

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
```

---

## 🔤 사용 폰트

| 용도 | 폰트 |
|------|------|
| SAVE / DATE 대형 타이포 | Cormorant Upright Light |
| The / & 스크립트 | Mrs Saint Delafield |
| 날짜, 소제목 | Cormorant Infant |
| 이름 (한/영) | Noto Serif KR |
| 본문 | Pretendard |

모든 폰트는 Google Fonts + jsDelivr CDN을 통해 자동 로드됩니다.

---

## v1.1 수정 내역

### 전체 레이아웃
- `position: fixed` 제거 → IntroSplash가 `375×812px` 블록으로 wrapper 내부에 위치
- 모든 absolute positioning이 375px wrapper 기준으로 동작
- `width: 100vw` 사용 금지 적용

### IntroSplash
- Figma 좌표 정확 적용: SAVE `left: 102.07px / bottom: 517px`, The `181.18px / 480.87px`, DATE `269.96px / 446.55px`
- 배경 `#041438` (Figma 정확 값)
- shared layoutId: `names`, `save`, `the`, `date`, `dateTagline`

### HeroSection
- z-index 레이어: z1 paper-texture BG / z2 photo / z3 envelope / z4 text
- `envelope.png` → width: 375px, position: absolute bottom:0, 사진 하단을 덮는 전체 overlay
- `hero-photo.png` → width 346px, height 268px, grayscale, 봉투 안에서 translateY 애니메이션
- 로컬 asset 경로: `/assets/hero-photo.png`, `/assets/envelope.png`, `/assets/paper-texture.png`

### CalendarSection
- D-day 텍스트 완전 제거

### AccountSection
- 구분선 1px 통일 (`border: 1px solid #e7dbc3`)
- 두 아코디언 사이 이중 선 방지: `margin-top: -1px`
- 화살표 아이콘: `lucide-react` ChevronDown / ChevronUp (size=20, strokeWidth=1.5, color=#777)

### Assets
로컬 이미지를 `public/assets/` 또는 `src/assets/`에 배치:
```
public/assets/
├── hero-photo.png
├── envelope.png
├── paper-texture.png
├── kakao-icon.svg
├── link-icon.svg
├── Gallery1.png ~ Gallery9.png
└── Gallery11.png ~ Gallery21.png
```
