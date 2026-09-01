# 기획전 개편 - 스페셜딜 / 타임특가 모듈 Spec (확정안)

**Figma fileKey**: `BB8U7aI5Sm5mn39ZFCqqDr` (기획전 개편 Master 26H2 브랜치)
**Section**: `14078:196440` (TimeDeal)
**모듈 2종**: 스페셜딜 `14241:63344` (375×448) / 타임특가 `14241:65000` (375×464, 2026-09-01 v2)
**더미데이터 프리뷰**: `ohouse-design/prototypes/specialdeal-timedeal-final/index.html`
**인터랙션 프로토타입**: https://cybang234.github.io/dana-prototypes/specialdeal-timedeal/ (소스: `ohouse-design/prototypes/specialdeal-timedeal/`, pixel-diff 스페셜딜 2.26% · 타임특가 1.11%(v2))

---

## 공통 ODS 토큰

### Foreground / Background
- `--foreground`: `#2f3438` (상품명·가격)
- `--foregroundWeak`: `#8c8c8c` (리뷰줄) / `#828c94` (배송정보)
- `--foregroundCritical`: `#f05656` (할인율)
- `--foregroundDisabled`: `#c1c1c1` (게이지 트랙)
- `--foregroundInverse`: `#ffffff` (배지 텍스트)
- `--accentRed`: `#ff4650` (게이지 fill·타이머 텍스트) / `#fd3d4a` (시계 아이콘·타임특가 배지)
- `--accentYellow`: `#ffc300` (별점 아이콘)
- `--border-thumbnail`: `rgba(0,0,0,0.05)` (썸네일 0.5px inner border)
- 섹션 타이틀: `#141414`

### Typography (Pretendard, letter -0.3 공통)
- `Heading17_Semibold` → 17/22, weight 600 (섹션 타이틀)
- `Body14L18_Semibold` → 14/18, weight 600 (타이머 텍스트, 할인율+가격)
- `Body14L18_Regular` → 14/18, weight 400 (chip 라벨)
- `Detail13L18_Regular` → 13/18, weight 400 (상품명)
- `Detail13L18_Semibold` → 13/18, weight 600 (브랜드명)
- `Detail12L16_Regular` → 12/16, weight 400 (리뷰줄·배송정보)
- `Detail12L20_Medium` → 12/20, weight 500 (타임특가 인상 예고 배지)

### 공통 요소
- **섹션 타이틀 (ODS Section, size=medium)**: h28, px16. 좌측 타이틀(17/22 SemiBold `#141414`) + 우측 Arrow Button 28×28 (전체보기 진입). 하단 여백 12
- **Chip (ODS Chip, size=sm)**: h32, r=full, 라벨 14/18. Solid = bg `#141414` + 흰 텍스트(선택), Normal = bg `#fff` + `#141414` + border `#e0e0e0`
- **Scrap Button (ODS)**: 24×24 흰색 아이콘, drop-shadow `0 4px 5px rgba(0,0,0,0.12)`, 썸네일 우하단 p8
- **썸네일 공통**: r8, inner border 0.5px `rgba(0,0,0,0.05)`, object-fit cover

---

## 공통: 카운트다운 게이지 (Countdown label)

두 모듈 동일. `I…;14241:62504` / `I…;14241:64884` (h=28, px=16)

- 구조 (세로 gap 8):
  1. **Progress bar container** 343×2 (좌우 풀블리드 - px16)
     - Track: 343×2, `#c1c1c1` (foregroundDisabled), r=full
     - Fill: h2, `#ff4650` (accentRed), 좌측 기준. 시안값 256px (≈74.6%)
     - **Fill 폭 = 남은시간 / 전체 딜 시간 비율.** 시간이 흐르면 좌→우 방향으로 줄어듦
  2. **Timer 행** (gap 4):
     - `[Icon] Clock` 16×16, `#fd3d4a` (ODS clock, 정적 — 스피너·펄스 아님)
     - 텍스트 "종료시간까지 `12:36:10` 남음" — 14/18 SemiBold, `#ff4650`, 요소 간 gap 2
- 타이머 포맷: `HH:MM:SS`, 1초 단위 갱신. **문구 상이 — 스페셜딜 "종료시간까지" / 타임특가 "종료까지"** (통일 여부 확인 필요). 24시간 초과 딜은 정책 확인 필요 (아래 주의사항)

---

## 모듈 1: 스페셜딜 (frame: `14241:63344`, 375×448)

> "단 하루 특가, 스페셜딜" — 카테고리 chip 필터 + 가로형 리스트 카드 3개 × 2컬럼 캐러셀

### 구조 (top → bottom)
1. **ModuleTitle** `I…;12962:96030` (h=84)
   - SectionTitle (h=28, px16): "단 하루 특가, 스페셜딜" + Arrow Button. 하단 12
   - **Filter** (h=32, 하단 12): chip strip, px16, gap 8, **overflow-x scroll**
     - 전체(solid) / 가구 / 가전·디지털 / 패브릭 / 주방용품 / 드레스룸 (normal)
     - chip 선택 시 해당 카테고리 상품으로 리스트 갱신 (랭킹 모듈과 동일하게 선택 chip 좌측 자동 스크롤 권장)
2. **Container** `I…;12962:89882` (gap=12)
   - **Countdown label** (h=28) — 공통 스펙
   - **Product list container** `I…;12962:89886` (h=324, px=16, gap=12, **가로 캐러셀 / overflow-clip**)
     - 페이지 단위: **Vertical 컬럼** w328 (= 375 − 16 − 12 − 19 peek) — 세로 gap 12, 카드 3개
     - 컬럼 간 gap 12 → 다음 페이지가 우측에 살짝 peek

### 가로형 ProductCard (328×100)
- 레이아웃: flex row, gap 12
- **썸네일** 100×100, r8 + Scrap 24 (우하단 p8)
- **텍스트 컨테이너** (flex 1, 세로 gap 2):
  - Title Container (h=56 고정, gap 2):
    - 상품명: 13/18 Regular `#2f3438`, **2줄 ellipsis** (브랜드명 사용 시: 브랜드 13/18 SemiBold 1줄 + 상품명 1줄 ellipsis)
    - 가격: 할인율 14/18 SemiBold `#f05656` + 판매가 14/18 SemiBold `#2f3438`, gap 4
  - 리뷰줄: ★12 `#ffc300` + 평점 · 리뷰 N — 12/16 `#8c8c8c`, gap 2
  - 배송정보: "무료배송" — 12/16 `#828c94` (h16 영역)

### HTML 골격
```html
<section class="specialdeal-module" data-id="14241:63344">
  <div class="section-title">
    <h2>단 하루 특가, 스페셜딜</h2>
    <button class="arrow-btn" aria-label="전체보기">→</button>
  </div>
  <div class="chip-strip">
    <button class="chip solid">전체</button>
    <button class="chip">가구</button>
    <button class="chip">가전·디지털</button>
    <button class="chip">패브릭</button>
    <button class="chip">주방용품</button>
    <button class="chip">드레스룸</button>
  </div>
  <div class="countdown">
    <div class="gauge"><i class="fill" style="width:74.6%"></i></div>
    <p class="timer"><span class="clock"></span>종료시간까지 <b>12:36:10</b> 남음</p>
  </div>
  <div class="carousel">                     <!-- overflow-x, px16, gap12 -->
    <div class="col">                        <!-- w328, 세로 gap12 -->
      <article class="hcard">
        <div class="thumb"><img><button class="scrap"></button></div>
        <div class="txt">
          <p class="name">상품명 2줄 ellipsis</p>
          <p class="price"><b class="rate">51%</b><b>225,000원</b></p>
          <p class="review">★ 4.6 · 리뷰 999,999</p>
          <p class="delivery">무료배송</p>
        </div>
      </article>
      <!-- ×3 -->
    </div>
    <!-- 컬럼 반복 -->
  </div>
</section>
```

### CSS 핵심
```css
.section-title { display:flex; justify-content:space-between; align-items:center;
  padding:0 16px 12px; }
.section-title h2 { font:600 17px/22px Pretendard; letter-spacing:-0.3px; color:#141414; }
.chip-strip { display:flex; gap:8px; padding:0 16px 12px; overflow-x:auto; }
.chip { height:32px; padding:0 12px; border-radius:16px; font:400 14px/18px Pretendard;
  background:#fff; color:#141414; border:1px solid #e0e0e0; }
.chip.solid { background:#141414; color:#fff; border-color:transparent; }
.countdown { padding:0 16px; margin-bottom:12px; }
.gauge { height:2px; background:#c1c1c1; border-radius:1px; margin-bottom:8px; }
.gauge .fill { display:block; height:2px; background:#ff4650; }
.timer { display:flex; gap:4px; align-items:center;
  font:600 14px/18px Pretendard; color:#ff4650; }
.carousel { display:flex; gap:12px; padding:0 16px; overflow-x:auto; }
.col { display:flex; flex-direction:column; gap:12px; width:328px; flex:none; }
.hcard { display:flex; gap:12px; align-items:center; }
.hcard .thumb { position:relative; width:100px; height:100px; flex:none; }
.hcard .thumb img { width:100%; height:100%; object-fit:cover; border-radius:8px;
  box-shadow:inset 0 0 0 0.5px rgba(0,0,0,0.05); }
.hcard .name { font:400 13px/18px Pretendard; color:#2f3438;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.hcard .price { font:600 14px/18px Pretendard; color:#2f3438; display:flex; gap:4px; }
.hcard .rate { color:#f05656; }
.review, .delivery { font:400 12px/16px Pretendard; }
.review { color:#8c8c8c; } .delivery { color:#828c94; }
```

---

## 모듈 2: 타임특가 (frame: `14241:65000`, 375×464 · v2)

> "최저가 보장, 타임특가 세일" — 스페셜딜의 스페셜딜(5~8개 큐레이션). chip 없음, 카드 280 캐러셀 + 인상 예고 배지

### 구조 (top → bottom)
1. **ModuleTitle** `I…;14241:64500` (h=40 = 28 + 하단 12)
   - SectionTitle (h=28, px16): "최저가 보장, 타임특가 세일" + Arrow Button. **chip 필터 없음**
2. **Container** `I…;14241:64501` (gap=12)
   - **Countdown label** (h=28) — 공통 스펙
   - **Product list container** `I…;14241:64513` (h=384, **가로 캐러셀**)
     - 첫 카드 x=16, 카드 간 gap 12, 카드 w280 → 다음 카드 peek ≈ 67px (첫 화면 노출 1.25장)

### 세로형 ProductCard (280×384) — 2026-09-01 v2
- 레이아웃: 썸네일(280) + gap 8 + **쿠폰 다운로드 버튼(32)** + gap 8 + 텍스트(56)
- **썸네일** 280×280, r8, overflow-clip
  - **인상 예고 배지** `I…;14241:64127`: 썸네일 하단 풀폭 오버레이 (absolute bottom, w280, h28)
    - bg `#fd3d4a` (accentRed), padding 4, 텍스트 center
    - "내일 `34,000원` 더 비싸져요" — 12/20 Medium, `#fff`. **금액은 상품별 변수** (종료 후 정상가 − 현재가)
  - Scrap 24: 우하단, **배지 위로 bottom 28 + p8** (배지에 가리지 않음)
- **쿠폰 다운로드 버튼** (ODS Box Button): w280 × h32, r6, bg `#fff`, border 1px `#e0e0e0`
  - 콘텐츠 center: 다운로드 아이콘 14 (`arrow_down_to_bracket`) + gap 4 + "쿠폰 다운로드" Medium 14/18 `#141414`
  - 탭 동작(쿠폰 발급 → 완료 상태 전환) 정책 확인 필요
- **텍스트** (h56):
  - 상품명: 13/18 Regular `#2f3438`, **1줄 ellipsis**
  - 가격: 할인율 14/18 SemiBold `#f05656` + 판매가 14/18 SemiBold `#2f3438`, gap 4 (상품명과 gap 2)
  - 리뷰줄: ★12 + 평점 · 리뷰 N — 12/16 `#8c8c8c` (가격과 gap 2)
  - 배송정보 줄 없음 (스페셜딜과 차이)

### HTML 골격
```html
<section class="timedeal-module" data-id="14241:65000">
  <div class="section-title">
    <h2>최저가 보장, 타임특가 세일</h2>
    <button class="arrow-btn" aria-label="전체보기">→</button>
  </div>
  <div class="countdown"><!-- 공통 --></div>
  <div class="carousel">
    <article class="vcard">
      <div class="thumb">
        <img>
        <button class="scrap"></button>
        <div class="rise-badge">내일 34,000원 더 비싸져요</div>
      </div>
      <div class="txt">
        <p class="name">상품명 1줄 ellipsis</p>
        <p class="price"><b class="rate">51%</b><b>225,000원</b></p>
        <p class="review">★ 4.6 · 리뷰 999,999</p>
      </div>
    </article>
    <!-- 카드 반복 (5~8개) -->
  </div>
</section>
```

### CSS 핵심
```css
.vcard { width:280px; flex:none; display:flex; flex-direction:column; gap:4px; }
.vcard .thumb { position:relative; width:280px; height:280px;
  border-radius:8px; overflow:clip; }
.vcard .thumb img { width:100%; height:100%; object-fit:cover; }
.rise-badge { position:absolute; left:0; right:0; bottom:0; padding:4px;
  background:#fd3d4a; color:#fff; text-align:center;
  font:500 12px/20px Pretendard; letter-spacing:-0.3px; }
.vcard .scrap { position:absolute; right:8px; bottom:36px; }  /* 배지 28 + 8 */
.vcard .name { font:400 13px/18px Pretendard; color:#2f3438;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
```

---

## 인터랙션 / 모션 (프로토타입 검증 완료분)

- **진입 모션**: 모듈이 뷰포트에 **30% 이상 보일 때 1회 재생** — 게이지 fill 100% → 남은시간 비율까지 감소 (노출 전에는 100% 대기). Duration 1.6s, cubic-bezier(0.4, 0, 0.2, 1). 이후 실시간 카운트
- **숫자 롤링**: 타이머 숫자는 슬롯머신 롤링 — 변경된 자리만, 새 숫자가 위→아래로 떨어짐(카운트다운 직관). 0.28s, cubic-bezier(0.4, 0, 0.2, 1)
- **타이머**: 1초 단위 갱신, `HH:MM:SS`. 두 모듈은 동일 딜 종료시각 공유 시 동기화
- **게이지 fill**: 남은시간 비율로 감소. transition 불필요 (1초 step이면 시각적으로 연속)
- **핀 halo breathe (선택 적용)**: 프로토타입 A2 변형 — fill 끝점 핀의 바깥 원(r8@30%)이 opacity만 숨쉬듯 변화. 확정 정적 시안에는 핀 미포함이므로 **적용 여부 개발 협의 필요**
- **종료 상태 (Figma 미포함, 프로토타입 기준)**:
  - 타이머 영역: "오늘 딜 종료" 회색 처리
  - 타임특가 배지: 회색 bg + "정상가로 돌아갔어요" 등 문구 교체 (UX writing 확정 필요)
- **chip 선택** (스페셜딜): 선택 chip 좌측 자동 스크롤 + 리스트 갱신 (랭킹 모듈 인터랙션과 동일 패턴)

---

## 누락 / 주의 사항

- **배지 문구 법무 검토 전제**: "내일 N원 더 비싸져요"는 가격 인상 예고 표현 — 실제 인상 이행이 조건 (법무 컨펌 후 문구 확정). Figma 원문은 `{34,000}` 플레이스홀더
- **accentRed 이중값**: 게이지·타이머 텍스트는 `#ff4650`, 시계 아이콘·배지는 `#fd3d4a`로 바인딩이 갈려 있음 → 개발 전 **토큰 통일 확인 필요** (둘 다 `--accentRed` 별칭)
- **할인율 색상**: 이 모듈은 `foregroundCritical #f05656` (기존 탭 스펙의 `accentRed #fd3d4a` 18px Bold와 다름 — 카드 위계가 낮아진 확정값)
- 스페셜딜 2컬럼 캐러셀의 **스크롤 방식**(자유 스크롤 vs 페이지 스냅) Figma로 판단 불가 — 페이지 스냅 권장
- 타임특가 카드 수는 5~8개 큐레이션 전제. 마지막 카드 우측 여백 16 필요
- 타이머가 24시간 초과일 때 표기 정책(`DD일 HH:MM:SS` 등) 미정의
