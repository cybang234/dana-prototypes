# 신분증 촬영 인식중 인터랙션 · 개발 핸드오프

**대상 화면** — 오늘의집머니 · 계좌등록 · 신분증 촬영
**Figma** — [Taking](https://www.figma.com/design/0rOp9kL9wQD7lwXGZyfTxo/-26H2--%EC%98%A4%EB%8A%98%EC%9D%98%EC%A7%91%EB%A8%B8%EB%8B%88?node-id=21178-67923) · [Scanning](https://www.figma.com/design/0rOp9kL9wQD7lwXGZyfTxo/-26H2--%EC%98%A4%EB%8A%98%EC%9D%98%EC%A7%91%EB%A8%B8%EB%8B%88?node-id=21186-68052)
**프로토타입** — https://cybang234.github.io/dana-prototypes/id-scan.html
**작성일** — 2026-07-10

---

## 1. 개요

카메라 뷰에 신분증을 올려놓으면 자동 인식이 시작되는 화면. 두 가지 상태를 갖는다.

| 상태 | 트리거 | 시각적 표현 |
|---|---|---|
| **Idle · Taking** (대기) | 진입 직후 | 프레임 흰 outline · 정적 |
| **Scanning · 인식중** | 프레임 안 신분증 감지 | 프레임 outline 투명 + **그라디언트 stroke 회전 + glow pulse** |

상태 전환은 `document.body.dataset.case` 값 조정으로 이뤄진다.
```js
document.body.dataset.case = 'E';    // 인식중 진입
document.body.dataset.case = 'idle'; // 다시 대기
```

> 프로덕션 코드에서는 `data-scan-state="idle"` / `"scanning"` 등 도메인 어휘로 리네이밍하는 것을 권장. CSS 셀렉터도 함께 변경.

---

## 2. 인식중 인터랙션 스펙

### 2.1 그라디언트 stroke

**컬러 팔레트 (conic gradient)**
| 각도 | 컬러 | 역할 |
|---|---|---|
| 0° / 180° / 360° | `#00A1FF` | 진한 파랑 스팟 (Figma 원본 컬러) |
| 45° / 135° / 225° / 315° | `#BAE6FD` | 파스텔 톤 브릿지 |
| 90° / 270° | `#FFFFFF` | 화이트 하이라이트 |

**애니메이션**
- 회전: **4.5s linear infinite** (`--gs-rot` 0° → 360°)
- glow(box-shadow) 호흡: **3.6s ease-in-out infinite**
  - base: `0 0 6px rgba(0,161,255,0.15)`
  - peak: `0 0 14px rgba(0,161,255,0.32)`
- 두 주기 비율 5 : 4 (일부러 어긋나서 살아있는 인상)

### 2.2 프레임 규격

| 속성 | 값 |
|---|---|
| 크기 | 335 × 208 |
| border-radius | 8 |
| stroke 두께 | 2px (idle) → 2.5px conic (scanning) |
| stroke 위치 | `outline-offset: -2px` (안쪽) |
| overflow | hidden |

### 2.3 가이드 텍스트

| 상태 | 문구 |
|---|---|
| Idle | "신분증을 자동으로 촬영할게요." / "표시된 영역에 신분증을 놓아주세요." |
| Scanning | "신분증을 인식하고 있어요" / "잠시만 기다려주세요" |

폰트 — Pretendard Medium 16 / lh 24 / letter-spacing -0.3 / 컬러 흰색.

---

## 3. 구현 핵심

### 3.1 Conic gradient border · mask trick

프레임 border를 conic gradient로 표시하려면 mask로 안쪽을 뚫는 트릭이 필요하다.

```css
@property --gs-rot {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.gradient-stroke {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  padding: 2.5px;                    /* stroke 두께 */
  background: conic-gradient(from var(--gs-rot),
    #00A1FF 0deg, #BAE6FD 45deg, #FFFFFF 90deg, #BAE6FD 135deg,
    #00A1FF 180deg, #BAE6FD 225deg, #FFFFFF 270deg, #BAE6FD 315deg,
    #00A1FF 360deg);
  /* mask로 padding-box 안쪽을 뚫어 border만 표시 */
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
  animation: gradient-rotate 4.5s linear infinite;
}
@keyframes gradient-rotate {
  to { --gs-rot: 360deg; }
}
```

**왜 `@property`가 필요한가?**
CSS custom property를 typed로 등록해야 `conic-gradient(from var(--gs-rot))` 안의 `var`가 애니메이션 대상이 된다. 미등록 시 회전 없이 static.

### 3.2 프레임 outline vs border

프레임 border area 뒤에 딤 오버레이(`rgba(0,0,0,0.4)`)가 있어 `border-color: transparent`로 하면 검정 반투명 링이 남는다.
→ `border` 대신 **`outline: 2px solid #FFF; outline-offset: -2px;`** 를 사용.

- outline은 box model 밖 → layout에 영향 없음
- `outline-offset: -2px` → 요소 안쪽으로 그림
- border area 자체가 없어져 뒤 딤이 새어나올 공간 없음

### 3.3 프레임 안 배경 이미지 (딤 뚫린 효과)

전체 화면 딤 상태에서도 프레임 안쪽만 카메라 뷰가 원본으로 노출되어야 한다.

```html
<div class="id-frame">
  <div class="frame-bg">          <!-- 프레임 안에 배경 이미지 재현 -->
    <img src="..." />
  </div>
  <div class="gradient-stroke" /> <!-- 인식중 stroke -->
</div>
```

`frame-bg`는 프레임 좌표계 안에서 전체 카메라 뷰와 정확히 일치하는 위치로 오프셋. Figma에서는 `left: 50%; top: -266px; transform: translateX(-50%); width: 464.177px;` 그대로.

**실제 카메라 통합 시** — `frame-bg`는 프로토타입용. 실제 앱에서는 카메라 프리뷰가 이미 전체 화면 뒤에 깔려 있으므로 딤을 SVG mask/clip-path로 뚫어 프레임 자리만 원본 노출시키는 편이 더 자연스러움.

---

## 4. HTML 구조 (핵심 뼈대)

```html
<body data-case="idle">
  <div class="phone">
    <div class="camera-bg"><img src="..." /></div>
    <div class="dim-overlay"></div>

    <div class="top-nav">
      <div class="status-bar">...</div>
      <div class="nav-white">
        <button class="nav-back">← </button>
        <h1 class="nav-title">신분증 선택</h1>
      </div>
    </div>

    <div class="instructions">
      <div class="guide-text">
        <div class="guide-idle">...</div>
        <div class="guide-scanning">...</div>
      </div>

      <div class="id-frame">
        <div class="frame-bg"><img src="..." /></div>
        <div class="gradient-stroke"></div>
      </div>

      <div class="info">
        <div class="warning">⚠ 다음과 같은 신분증은 사용할 수 없어요</div>
        <ul>
          <li>신분증 사본 (예: 출력물, 휴대폰 확인 촬영 등)</li>
          <li>정보 확인이 어렵거나 훼손된 신분증</li>
          <li>유효기간이 지난 신분증</li>
        </ul>
      </div>
    </div>
  </div>
</body>
```

---

## 5. 상태 전환 훅

카메라 프리뷰에서 신분증 프레임을 감지했을 때 호출.

```js
// 인식 시작 (신분증이 프레임 영역에 놓임)
function onIdDetected() {
  document.body.dataset.case = 'E';
  // 필요 시 audio/haptic feedback
}

// 인식 완료 → 다음 스텝(캡처/전송)으로
function onIdCaptured() {
  document.body.dataset.case = 'idle';
  // 다음 화면 라우팅
}

// 취소·백그라운드 진입 → 대기 상태 복귀
function onCancel() {
  document.body.dataset.case = 'idle';
}
```

**감지 로직 자체는 이 프로토타입 범위 밖.**
- iOS: Vision framework `VNDetectRectanglesRequest` / `VNDocumentCameraViewController`
- Android: ML Kit `DocumentScanner` 또는 CameraX + custom edge detection
- 웹 폴백: `getUserMedia` + OpenCV.js edge/contour detection

---

## 6. 접근성 · 성능

### 6.1 모션 감소

이미 `@media (prefers-reduced-motion: reduce)` 로 애니메이션 정지 대응. 회전·glow 제거 후 정적 outline `#00A1FF`.

### 6.2 접근성 라벨

인식중 상태 진입 시 스크린리더 대응 위해 `aria-live` 영역에서 상태를 알림.

```html
<div class="a11y-live" aria-live="polite" aria-atomic="true">
  <span class="visually-hidden" data-a11y-text></span>
</div>
```
```js
const liveEl = document.querySelector('[data-a11y-text]');
function setCase(c) {
  document.body.dataset.case = c;
  liveEl.textContent = c === 'E' ? '신분증을 인식하고 있어요' : '';
}
```

### 6.3 성능

- `conic-gradient` + `@property` 애니메이션은 컴포지트 레이어에서 처리되지만 iOS 저사양 기기에서 리페인트 발생 가능.
- 검토: `will-change: background` 를 `.gradient-stroke` 에 추가 (필요 시)
- 인식이 3초 넘게 안 될 경우 애니메이션 자동 중단 → CPU/배터리 절약 권장.

---

## 7. 브라우저 지원

| 기술 | 최소 지원 | 비고 |
|---|---|---|
| `@property` | Safari 16.4+, Chrome 85+ | conic 회전 애니메이션에 필수 |
| `mask-composite: exclude` | Safari 15.4+, Chrome 120+ | -webkit- prefix 병용 |
| `conic-gradient` | Safari 12.1+, Chrome 69+ | ✓ |
| `outline-offset` (음수) | 전 브라우저 | ✓ |
| `prefers-reduced-motion` | 전 브라우저 | ✓ |

**폴백** — `@property` 미지원 브라우저(예: iOS 15)에서는 stroke가 회전 없이 정적 conic으로 표시됨. glow는 정상 동작. 시각적으로 크게 어색하지 않음. 필요 시 `@supports (background: conic-gradient(from var(--x)))` 로 케이스 분기.

---

## 8. 컬러 · 타이포 토큰 정리

### 컬러
| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg` | `#FFFFFF` | Status bar / TopNav 배경 |
| `--fg-strong` | `#2F3438` | Nav 제목 · 아이콘 |
| `--border-inverse` | `#FFFFFF` | 프레임 idle outline |
| `--fg-inverse` | `#FFFFFF` | 가이드 텍스트 · 경고 텍스트 |
| `--fg-disabled` | `#C1C1C1` | 리스트 텍스트 |
| `--dim` | `rgba(0,0,0,0.4)` | 카메라 뷰 딤 |
| (인식중 stroke) | `#00A1FF` / `#BAE6FD` / `#FFFFFF` | conic gradient stops |

### 타이포 (Pretendard)
| 스타일 | 크기/lh | weight | letter-spacing |
|---|---|---|---|
| Body16 Medium (가이드) | 16 / 24 | 500 | -0.3 |
| Detail13 Medium (경고) | 13 / 18 | 500 | -0.3 |
| Detail12 Regular (리스트) | 12 / 20 | 400 | -0.3 |
| Body16 Bold (Nav 제목) | 16 / 20 | 700 | -0.3 |

---

## 9. 파일

```
/id-scan.html                     ← 프로토타입 전체
/assets/id-scan-bg.png           ← 카메라 배경 시뮬 (프로덕션에서는 실제 카메라 프리뷰로 대체)
/docs/id-scan-handoff.md         ← 이 문서
```

우측 상단 데모 패널은 QA·리뷰용. 프로덕션 반영 시 `<aside class="demo-panel">` 블록과 하단 `<script>` 데모 스위처 제거.

---

## 10. 미해결·확인 필요

- [ ] 인식 성공 후 화면 전환 애니메이션 (스캔 → 확인 시퀀스) 시안 필요
- [ ] 실패/재시도 상태 (인식 3회 실패 등) 시안 필요
- [ ] iOS 15 이하 폴백 정책 확정 (정적 conic vs 단색 outline)
- [ ] 진동/사운드 피드백 여부 · 디자인 결정 필요

**Contact** — Dana (Product Designer)
