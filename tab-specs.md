# 빅프로모션 기획전 - 6개 탭 본문 영역 Spec

**Figma fileKey**: `BB8U7aI5Sm5mn39ZFCqqDr`
**공통 구조**: Status Bar(94h) + 00_KV(516h) + Tab(44h) + 본문(가변). 본문은 y=654에서 시작.

---

## 공통 ODS 토큰 (모든 탭 공통)

### Foreground / Background
- `--foreground`: `#141414`
- `--background`: `#ffffff`
- `--backgroundWeak`: `#f5f5f5`
- `--foregroundWeak`: `#828c94` (Brand Name용) / `#8c8c8c` (Description용)
- `--foregroundBrand`: `#0aa5ff`
- `--accentBlue`: `#0079fa`
- `--accentRed`: `#fd3d4a`
- `--gray-100`: `#ededed`
- `--borderStrong`: `#141414`
- `--ods-section-header-description-color-2`: `#8c8c8c`
- `--ods-section-title-label-color-2`: `#141414`

### Typography (Pretendard)
- `Heading24_Bold` → 24/32, weight 700, letter -0.3
- `Heading20_Bold` → 20/28, weight 700, letter -0.3
- `Heading18_Bold` → 18/24, weight 700, letter -0.3
- `Heading17_Semibold` → 17/22, weight 600, letter -0.3
- `Body16_Regular` → 16/20, weight 400, letter -0.3
- `Body16L28_Medium` → 16/28, weight 500, letter -0.3
- `Body15L24_Bold` → 15/24, weight 700, letter -0.3
- `Body14_Regular` → 14/18, weight 400, letter -0.3
- `Body14_Semibold` → 14/18, weight 600, letter -0.3
- `Detail13_Regular` → 13/18, weight 400, letter -0.3
- `Detail12_Regular` → 12/16, weight 400, letter -0.3
- `Detail12_Medium` → 12/16, weight 500, letter -0.3
- `Detail10_Semibold` → 10/14, weight 600, letter -0.3

### Section Header Description (md variant)
- font-size 14, line-height 18, weight 400, letter -0.3

### Chip (ODS Chip)
- Solid: bg solid color (default text white), border transparent
- Normal: bg `#ffffff`, label `#141414`, border `#e0e0e0`

### Product Card (공통)
- 폭: 138px (추천/한샘/침대/특가), 120px (랭킹 1위 내부)
- 썸네일: 정사각 (138x138 또는 120x120), `border-radius: 8px` (medium)
- Content gap: 0 (각 sub 모듈이 Top Space 4~8px씩 포함)
- 구조: Thumbnail → Title(54h) → Price(28h) → Delivery Info(43h) → Delivery Option(24h)
- Title: Brand Name (12/16, foregroundWeak) + 상품명 (13/18, foreground, 2줄 ellipsis)
- Price: 할인율(18/24 Bold, accentRed) + 가격(18/24 Bold, foreground)
- Delivery Info: "[Asset] Departure Today" SVG + "평일 12:00까지 결제시" (12/16, foregroundBrand)
- Delivery Option: "무료배송" Badge (Square Badge gray-100 bg, 10/14 SemiBold)

---

## 탭 1: 추천 (frame: 8523:10543)

### 본문 영역
- **본문 시작 y**: 654
- **전체 본문 높이**: 1654 (frame 2308 - 654)
- **하위 본문 nodeIds**:
  - `8523:10582` - Recommend Bundle 1 (h=752, "[이름]님이 좋아할만한 상품")
  - Divider `8523:10599` (h=12)
  - `8523:10600` - Recommend Bundle 2 (h=433)
  - Divider `8523:10611` (h=12)
  - `8523:10612` - Recommend Bundle 3 (h=433)
  - Divider `8523:10623` (h=12)

### 구조 (top → bottom)
1. **Recommend Bundle 1** `8523:10582` (h=752, py=32px)
   - Header Container `8523:10583` (h=54, px=16)
     - Header `8523:10586`: "[이름]님이 좋아할만한 상품" — Heading20_Bold, "[이름]"에 accentBlue `#0079fa`
     - Description `8523:10587`: "최근 둘러본 상품과 연관된 상품이에요" — Body16, color `#8c8c8c`, gap 6px
   - Recommend Item `8523:10588` (h=634, pt=16, px=16, gap=24)
     - Product Section 1 (h=297, w=343) → Product Row (w=427, gap=8, **overflow-x-auto**) → 3 cards (각 w=138)
     - Product Section 2 (h=297, w=343) → 동일 구조

2. **Recommend Bundle 2** `8523:10600` (h=433)
   - Header Container (h=56, Header만, gap=0)
     - Header: Heading18_Bold/Heading20_Bold 추정 (단일 헤더, 설명 X), h=28~56
   - Recommend Item `8523:10605` (h=313, pt=16, px=16)
     - Product Section 1 (h=297) → 3 cards

3. **Recommend Bundle 3** `8523:10612` (h=433)
   - 구조는 Bundle 2와 동일

### 자산
- `/Users/cy.bang/claude-practice/assets/kv-recommend.png`

### HTML 골격
```html
<div class="recommend-tab-body">
  <!-- Recommend Bundle 1 (with description) -->
  <section class="recommend-bundle" data-id="8523:10582">
    <div class="header-container">
      <div class="header-content">
        <h2 class="header">
          <span style="color: #0079fa;">채영</span>님이 좋아할만한 상품
        </h2>
        <p class="description">최근 둘러본 상품과 연관된 상품이에요</p>
      </div>
    </div>
    <div class="recommend-item" style="display:flex; flex-direction:column; gap:24px; overflow-x:auto; padding:16px;">
      <div class="product-section">
        <div class="product-row" style="width:427px; display:flex; gap:8px;">
          <article class="product-card">...</article>
          <article class="product-card">...</article>
          <article class="product-card">...</article>
        </div>
      </div>
      <div class="product-section">...</div>
    </div>
  </section>

  <hr class="divider" style="height:12px; border:0; background:#f5f5f5;">

  <!-- Recommend Bundle 2 (header only) -->
  <section class="recommend-bundle">
    <div class="header-container"><h2 class="header">...</h2></div>
    <div class="recommend-item">...</div>
  </section>
  ...
</div>
```

### CSS 핵심
```css
.recommend-bundle { padding: 32px 0; background: #fff; }
.header-container { padding: 0 16px; display: flex; flex-direction: column; gap: 6px; }
.header { font: 700 20px/28px Pretendard; letter-spacing: -0.3px; color: #141414; }
.description { font: 400 16px/20px Pretendard; letter-spacing: -0.3px; color: #8c8c8c; }
.product-card { width: 138px; display: flex; flex-direction: column; gap: 10px; }
.product-card .thumbnail { width: 138px; height: 138px; border-radius: 8px; }
.product-card .brand { font: 400 12px/16px Pretendard; color: #828c94; }
.product-card .name { font: 400 13px/18px Pretendard; color: #2f3438; }
.product-card .price-discount { font: 700 18px/24px Pretendard; color: #fd3d4a; }
.product-card .price-amount { font: 700 18px/24px Pretendard; color: #141414; }
.delivery-text { font: 400 12px/16px Pretendard; color: #0aa5ff; }
.free-shipping { background:#ededed; padding:3px 5px; border-radius:4px;
  font:600 10px/14px Pretendard; color:#8c8c8c; }
```

---

## 탭 2: 한샘 (frame: 8523:13200)

### 본문 영역
- **본문 시작 y**: 654
- **전체 본문 높이**: 790
- **본문 nodeId**: `8523:13265` - Recommend Bundle (h=790)

### 추가 ODS 토큰
- `--border-thumbnail`: `#0000000d`
- Section Header Description (md): font-size 14, line-height 18

### 구조 (top → bottom)
1. **Recommend Bundle** `8523:13265` (h=790, py=32)
   - Header Container `8523:13266` (h=28, px=16)
     - Header `8523:13269`: Heading20_Bold (h=28, 단일 텍스트)
   - **Section Header** `8523:13271` (h=44, px=16, py=12 추정, gap=24)
     - 좌측: Custom thumbnail (44x44, border 1.5px #141414, rounded 50px, padding 2px, 내부 40px) + Section Title "최대 15% 할인" — Heading17_Semibold (가운데)
     - 우측: 4개 round thumbnail (각 44px, gap=2px 추정) — 한샘 제휴 브랜드들
   - Recommend Item `8523:13287` (h=634)
     - Product Section 1 (h=297) → 3 cards
     - Product Section 2 (h=297) → 3 cards
     - gap 16~40 사이 (Section Header 포함 시 총 678)

### 자산
- `/Users/cy.bang/claude-practice/assets/kv-hanssem.png`

### HTML 골격
```html
<section class="recommend-bundle" data-id="8523:13265">
  <div class="header-container" style="padding:0 16px;">
    <h2 class="header">[한샘 메인 헤더]</h2>
  </div>
  <div class="section-header" style="display:flex; align-items:center; gap:24px; padding:0 16px;">
    <div class="left-group" style="display:flex; align-items:center; gap:8px;">
      <div class="custom-title" style="border:1.5px solid #141414; padding:2px; border-radius:50px;">
        <img class="thumbnail" style="width:40px; height:40px; border-radius:50%;" />
      </div>
      <div class="center-container">
        <h3 class="section-title">[브랜드명]</h3>
        <p class="section-desc">최대 15% 할인</p>
      </div>
    </div>
    <div class="right-group" style="display:flex; gap:2px;">
      <div class="custom-title" style="padding:2px; border-radius:50px;"><img class="thumbnail" /></div>
      <div class="custom-title"><img /></div>
      <div class="custom-title"><img /></div>
      <div class="custom-title"><img /></div>
    </div>
  </div>
  <div class="recommend-item">
    <div class="product-section">...3 cards...</div>
    <div class="product-section">...3 cards...</div>
  </div>
</section>
```

### CSS 핵심
```css
.section-title { font: 600 17px/22px Pretendard; color: #141414; letter-spacing: -0.3px; }
.section-desc { font: 400 14px/18px Pretendard; color: #8c8c8c; letter-spacing: -0.3px; }
.custom-title.featured { border: 1.5px solid #141414; }
```

---

## 탭 3: 침대 (frame: 8523:14704)

### 본문 영역
- **본문 시작 y**: 654
- **전체 본문 높이**: 461
- **본문 nodeId**: `8523:14761` - Recommend Bundle

### 구조 (top → bottom)
1. **Recommend Bundle** `8523:14761` (h=461, py=32)
   - Header Container `8523:14762` (h=28, px=16): Header — Heading20_Bold
   - **Filter Container** `8523:16304` (h=56, py=12, px=16)
     - Chip Container `8523:16305` (w=343, h=32, gap=6)
       - Chip 1 (w=46, solid, 선택됨) — text 흰색 위 진한 bg
       - Chip 2 (w=70, normal)
       - Chip 3 (w=46, normal)
       - Chip 4 (w=46, normal)
       - Chip 5 (w=58, normal)
       - Chip 6 (w=97, normal, 마지막)
   - Recommend Item `8523:14767` (h=313, pt=16, px=16)
     - Product Section (h=297, w=343, **overflow-x scroll**) → 3 cards (w=138)

### 자산
- `/Users/cy.bang/claude-practice/assets/kv-bed.png`

### HTML 골격
```html
<section class="recommend-bundle" data-id="8523:14761">
  <div class="header-container"><h2 class="header">[침대 헤더]</h2></div>
  <div class="filter-container" style="padding:12px 16px;">
    <div class="chip-container" style="display:flex; gap:6px; height:32px;">
      <button class="chip chip-solid">전체</button>
      <button class="chip chip-normal">텍스트1</button>
      <button class="chip chip-normal">텍스트2</button>
      <button class="chip chip-normal">텍스트3</button>
      <button class="chip chip-normal">텍스트4</button>
      <button class="chip chip-normal">텍스트5</button>
    </div>
  </div>
  <div class="recommend-item">
    <div class="product-section" style="overflow-x:auto;">
      <div class="product-row" style="width:427px; display:flex; gap:8px;">
        <article class="product-card">...</article>
        ...
      </div>
    </div>
  </div>
</section>
```

### CSS 핵심
```css
.chip { height: 32px; padding: 0 12px; border-radius: 16px; font: 400 14px/18px Pretendard;
  letter-spacing: -0.3px; display: inline-flex; align-items: center; }
.chip-solid { background: #141414; color: #fff; border: 1px solid transparent; }
.chip-normal { background: #fff; color: #141414; border: 1px solid #e0e0e0; }
```

---

## 탭 4: 특가 (frame: 8523:17755)

### 본문 영역
- **본문 시작 y**: 654
- **전체 본문 높이**: 5338
- **본문 nodeIds (7개 Recommend Bundle)**:
  - `8523:17778` (y=654, h=810) — 첫 모듈, Header + Filter + Items
  - `8523:18071` (y=1476, h=810)
  - `8523:19738` (y=2298, h=810)
  - `8523:19428` (y=3120, h=406) — Header + Items only (필터 없음)
  - `8523:20359` (y=3538, h=810)
  - `8523:19118` (y=4360, h=810)
  - `8523:20049` (y=5182, h=810)

### 구조 (단일 모듈, 첫 모듈 `8523:17778` 기준)
1. **Recommend Bundle** (h=810, py=32)
   - Header Container `8523:18060` (h=58, px=16)
     - Header Content:
       - 가로 라인 (gap=6, items-center):
         - Title `8523:18063`: "집요한 특가" — Heading24_Bold (24/32), color foreground
         - Timer `8523:18064`: "12:36:10" — Heading20_Bold (20/28), color accentRed `#fd3d4a`
       - Description `8523:18065`: "단 24시간 최저가 도전!" — Body16, color `#8c8c8c`
   - Filter Container `8523:17783` (h=56) — Chip strip (침대 탭과 동일 구조)
   - Recommend Item `8523:18587` (h=632) → 2 Product Section × 3 cards

### 자산
- `/Users/cy.bang/claude-practice/assets/kv-deal.png`

### HTML 골격
```html
<section class="recommend-bundle deal" data-id="8523:17778">
  <div class="header-container" style="padding:0 16px;">
    <div class="header-content" style="display:flex; flex-direction:column; gap:6px;">
      <div class="title-row" style="display:flex; align-items:center; gap:6px;">
        <h2 class="title" style="font:700 24px/32px Pretendard;">집요한 특가</h2>
        <span class="timer" style="font:700 20px/28px Pretendard; color:#fd3d4a;">12:36:10</span>
      </div>
      <p class="description" style="font:400 16px/20px Pretendard; color:#8c8c8c;">단 24시간 최저가 도전!</p>
    </div>
  </div>
  <div class="filter-container">[chip strip 동일]</div>
  <div class="recommend-item">[2 sections × 3 cards]</div>
</section>
<!-- 6번 더 반복; 4번째는 Filter 없이 Header(58) + Items(284) = 406h -->
```

---

## 탭 5: 랭킹 (frame: 8523:16401)

### 본문 영역
- **본문 시작 y**: 654
- **전체 본문 높이**: 1314
- **본문 nodeIds**:
  - `8523:16450` (h=506) — 실시간 베스트 모듈 (5 column horizontal scroll)
  - Divider `8523:21443` (h=12)
  - `8523:21445` (h=796) — 브랜드 랭킹 모듈 (1위 펼침 + 2~5위 + 더보기)

### 추가 ODS 토큰
- `Heading24_Bold`: 24/32 Bold (h1)

### 구조 (top → bottom)

#### 5-1. 실시간 베스트 `8523:16450` (h=506, py=32)
- Header `8523:16451` (h=58, px=16)
  - "실시간 베스트" — Heading24_Bold (24/32, foreground)
  - "지금 구매가 가장 많은 상품이에요" — Body16, color `#8c8c8c`, gap 6px
- ChipStrip `8523:16456` (h=64, p=16, gap=10, **overflow-clip**)
  - Chip 1 (solid, w=82) + Chip 2~5 (normal, w=46/46/74/98)
- List Container `8523:16462` (h=320, **overflow-x scroll**)
  - List Content (w=1420) → 5 List Columns (각 w=280, h=320)
    - 각 Column: 4 Rows × 80h
      - Row: Rank text (w=20, 폰트 Heading17_Semibold 추정) + List Item (w=216, gap=16)
        - Thumbnail (60x60, rounded)
        - Info (w=148): Item Description (3줄, h=40~36) + Frame (h=18, gap=4): Discount + Price (Detail12)

#### 5-2. 브랜드 랭킹 `8523:21445` (h=796, py=32)
- Header `8523:21446`: "브랜드 랭킹" (Heading24_Bold) + "지금 주목받고 있는 브랜드에요" (Body16, #8c8c8c)
- List Column `8523:21459` (h=630, pt=20, pb=8, gap=12)
  - **Row_1 (확장형)** `8523:22121` (h=371, px=12)
    - Container `8523:22120` border 1.5 #141414 rounded 8 overflow-clip
      - Header Row `8523:21460` (h=76, pl=8 pr=16 py=8)
        - Rank "1" (w=20, h=60, Body15L24_Bold)
        - Thumbnail (40x40, border 1.5 #141414, rounded 80, padding 2)
        - Center: Brand name (Heading17_Semibold) + "최대 15% 할인" (md desc 14/18, #8c8c8c)
        - Chevron Up (20x20)
      - Recommend Item `8523:21989` (h=295, pl=16)
        - Product Row (w=427, gap=8, **overflow-x**) → 3 cards (w=120, h=279)
        - Product Card 변형: 폭 120px (138px 아님), 썸네일 120x120
  - **Rows 2~5** `8523:22233` (h=219, px=16)
    - 각 Row (h=54): Rank (15px Bold) + Thumbnail (32x32) + Brand name (Body16L28_Medium 16/28) + Chevron Down
    - Divider 1px (#e0e0e0 추정) 사이
- "랭킹 더보기" Box Button `8523:22325` (h=44, mx=16, variant subtle, size large)

### 자산
- `/Users/cy.bang/claude-practice/assets/kv-ranking.png`

### HTML 골격
```html
<!-- 5-1: 실시간 베스트 -->
<section class="best-module" data-id="8523:16450">
  <div class="header" style="padding:0 16px;">
    <h2 style="font:700 24px/32px Pretendard;">실시간 베스트</h2>
    <p style="font:400 16px/20px Pretendard; color:#8c8c8c;">지금 구매가 가장 많은 상품이에요</p>
  </div>
  <div class="chipstrip" style="display:flex; gap:10px; padding:16px; overflow-x:auto;">
    <button class="chip chip-solid">전체</button>
    <button class="chip chip-normal">텍스트</button>
    ...
  </div>
  <div class="list-container" style="overflow-x:auto;">
    <div class="list-content" style="width:1420px; display:flex;">
      <div class="list-column" style="width:280px;">
        <div class="row" style="display:flex; height:80px;">
          <span class="rank" style="width:20px; padding:18px 6px;">1</span>
          <div class="list-item">
            <div class="thumb" style="width:60px; height:60px; border-radius:8px;"></div>
            <div class="info" style="width:148px;">
              <p class="desc">상품명 2줄</p>
              <div class="price-row" style="display:flex; gap:4px;">
                <span class="discount">%</span><span class="price">원</span>
              </div>
            </div>
          </div>
        </div>
        ... 4 rows ...
      </div>
      ... 5 columns ...
    </div>
  </div>
</section>

<hr class="divider" style="height:12px; background:#f5f5f5; border:0;">

<!-- 5-2: 브랜드 랭킹 -->
<section class="brand-rank-module" data-id="8523:21445">
  <div class="header">
    <h2>브랜드 랭킹</h2>
    <p>지금 주목받고 있는 브랜드에요</p>
  </div>
  <div class="rank-1-expanded" style="border:1.5px solid #141414; border-radius:8px; margin:0 12px;">
    <div class="rank-1-header">
      <span class="rank">1</span>
      <div class="brand-thumb" style="width:40px; border:1.5px solid #141414; border-radius:80px;"></div>
      <div>
        <h3 style="font:600 17px/22px Pretendard;">한샘</h3>
        <p style="font:400 14px/18px; color:#8c8c8c;">최대 15% 할인</p>
      </div>
      <span class="chevron-up">▲</span>
    </div>
    <div class="rank-1-products" style="overflow-x:auto; padding-left:16px;">
      <div class="product-row" style="width:427px; display:flex; gap:8px;">
        <article class="product-card sm">...</article>
        <article class="product-card sm">...</article>
        <article class="product-card sm">...</article>
      </div>
    </div>
  </div>
  <div class="rank-rest" style="padding:0 16px;">
    <div class="rank-row" style="display:flex; height:54px;">
      <span class="rank">2</span>
      <div class="brand-thumb" style="width:32px;"></div>
      <span class="brand-name" style="font:500 16px/28px Pretendard;">한샘</span>
      <span class="chevron-down">▼</span>
    </div>
    <hr class="divider-1">
    <div class="rank-row">3 ...</div>
    <hr>
    <div class="rank-row">4 ...</div>
    <hr>
    <div class="rank-row">5 ...</div>
  </div>
  <div class="cta" style="padding:0 16px;">
    <button class="box-button subtle large">랭킹 더보기</button>
  </div>
</section>
```

### CSS 핵심
```css
.product-card.sm { width: 120px; }
.product-card.sm .thumbnail { width: 120px; height: 120px; }
.rank-1-expanded { padding: 0; overflow: clip; }
.box-button.subtle { background: #f5f5f5; color: #141414; height: 44px;
  border-radius: 8px; font: 700 15px/24px Pretendard; }
```

---

## 탭 6: 라이브 (frame: 8523:22406)

### 본문 영역
- **본문 시작 y**: 654
- **전체 본문 높이**: 832
- **본문 nodeIds**:
  - `8523:23678` (h=494) — 집요한라이브 모듈 (대형 KV 카드 + 4 thumb)
  - Divider `8523:23725` (h=12)
  - `8523:23727` (h=326) — 라이브 캘린더 + 알림받기 + Chip + 3 row

### 구조 (top → bottom)

#### 6-1. 집요한라이브 `8523:23678` (h=494, py=32)
- Header `8523:23679` (h=58, px=16)
  - 타이틀 `8523:23682` (w=122 h=32): **집요한라이브_로고_블랙** (vector 이미지, 2 svg)
  - Description `8523:23692`: "라이브에서 가장 좋은 혜택을 만나요" — Body16, #8c8c8c
- List Container `8523:23693` (h=372, p=16, gap=4)
  - **좌측 KV 카드** `8523:23694` (flex=1, h=340, p=16, rounded 8, overflow-clip)
    - Background: 이미지 + linear gradient (0deg, transparent 46.56% → rgba(0,0,0,0.2) 67.93%) 2겹
    - 상단 쿠폰: "6.8 월 20:00" — bg rgba(34,34,34,0.8) mix-blend-multiply, color white opacity 0.7, font 12/11 Medium, padding 8/9, rounded 6
    - 하단 info: gap=10
      - text (px=2): "시몬스 스마트팩 ~46%" — Title 20_Bold white + "오늘의집 단독 최저가" — Medium 14/20 white opacity 0.6
      - 버튼 `8523:23702`: bg `#ec0100` rounded 6, px=16 py=10 — "지금 방송 보기" (Medium 14/20 white) + Chevron Right
  - **우측 4 thumbnail** `8523:23705` (gap=4)
    - 각 thumb: aspect 134:134, rounded 8, object-cover

#### 6-2. 라이브 캘린더 `8523:23727` (h=326, py=32)
- Header `8523:23728` (h=32, px=16, w=343, justify-between)
  - Title `8523:23834`: "라이브 캘린더" — Heading24_Bold
  - "라이브 알림받기" Box Button `8523:24581` (variant normal, size extra-small, w=108 h=28)
    - Center: "라이브 알림받기" (label 14/18 Semibold 추정 또는 12/16)
    - Right: Bell icon (14x14)
- Filter Container `8523:23773` (h=56, py=12, px=16): Chip Container (gap=6) — 5 chips
- List Container `8523:23871` (h=174, py=12, px=16, gap=10)
  - Row 1 `8523:23972` (h=36, px=6 py=4): Square Badge gray subtle large + Frame (gap=12)
    - Brand 1 (gap=6): thumbnail 24x24 + name (Body16L28_Medium "베베앙")
    - Brand 2 (gap=6): thumbnail 24x24 + name "미마"
  - Divider 1px
  - Row 2 (h=36): Square Badge + thumbnail + "에싸"
  - Divider 1px
  - Row 3 (h=36): Square Badge + thumbnail + "미닉스"

### 자산
- `/Users/cy.bang/claude-practice/assets/kv-live.png`

### HTML 골격
```html
<!-- 6-1: 집요한라이브 -->
<section class="live-feature" data-id="8523:23678">
  <div class="header" style="padding:0 16px;">
    <h2 class="logo-image" style="width:122.35px; height:32px; background:url('집요한라이브_로고.svg') no-repeat;"></h2>
    <p style="font:400 16px/20px Pretendard; color:#8c8c8c;">라이브에서 가장 좋은 혜택을 만나요</p>
  </div>
  <div class="list-container" style="display:flex; gap:4px; padding:16px;">
    <div class="kv-card" style="flex:1; height:340px; padding:16px; border-radius:8px; overflow:clip; position:relative;
        background-image: linear-gradient(180deg, rgba(0,0,0,0) 46.56%, rgba(0,0,0,0.2) 67.94%), url('live-kv.jpg');
        background-size: cover; background-position:center;
        display:flex; flex-direction:column; justify-content:space-between;">
      <span class="coupon" style="background:rgba(34,34,34,0.8); color:white; opacity:0.7;
        padding:8px 8px 9px; border-radius:6px; font:500 12px/11px Pretendard;">6.8 월 20:00</span>
      <div class="info" style="display:flex; flex-direction:column; gap:10px;">
        <div class="text" style="padding:0 2px; color:white;">
          <p style="font:700 20px/28px Pretendard;">시몬스 스마트팩 ~46%</p>
          <p style="font:500 14px/20px Pretendard; opacity:0.6;">오늘의집 단독 최저가</p>
        </div>
        <button class="cta" style="background:#ec0100; border-radius:6px; padding:10px 16px;
          display:flex; justify-content:space-between; color:white; font:500 14px/20px Pretendard;">
          지금 방송 보기 <span class="chevron-right">▶</span>
        </button>
      </div>
    </div>
    <div class="thumb-stack" style="display:flex; flex-direction:column; gap:4px;">
      <div class="thumb" style="width:82px; height:82px; border-radius:8px;
        background-image:url('product.jpg'); background-size:cover;"></div>
      <div class="thumb">...</div>
      <div class="thumb">...</div>
      <div class="thumb">...</div>
    </div>
  </div>
</section>

<hr class="divider" style="height:12px; background:#f5f5f5; border:0;">

<!-- 6-2: 라이브 캘린더 -->
<section class="live-calendar" data-id="8523:23727">
  <div class="header" style="display:flex; justify-content:space-between; padding:0 16px;">
    <h2 style="font:700 24px/32px Pretendard;">라이브 캘린더</h2>
    <button class="box-button-xs" style="height:28px; padding:0 8px;
      border:1px solid #e0e0e0; background:#fff; border-radius:8px;
      display:inline-flex; gap:4px; align-items:center;
      font:600 14px/18px Pretendard; color:#141414;">
      라이브 알림받기 <span class="bell-icon">🔔</span>
    </button>
  </div>
  <div class="filter-container" style="padding:12px 16px;">
    <div class="chip-container" style="display:flex; gap:6px;">
      <button class="chip chip-solid">날짜1</button>
      <button class="chip chip-normal">날짜2</button>
      <button class="chip chip-normal">날짜3</button>
      <button class="chip chip-normal">날짜4</button>
      <button class="chip chip-normal">날짜5</button>
    </div>
  </div>
  <div class="calendar-list" style="padding:12px 16px; display:flex; flex-direction:column; gap:10px;">
    <div class="cal-row" style="display:flex; gap:16px; align-items:center; padding:4px 6px;">
      <span class="badge" style="background:#f5f5f5; color:#141414; padding:4px 6px;
        border-radius:4px; font:500 12px/16px Pretendard;">텍스트</span>
      <div class="brand-group" style="display:flex; gap:12px;">
        <div class="brand-item" style="display:flex; gap:6px; align-items:center;">
          <div class="thumb" style="width:24px; height:24px; border-radius:50%;"></div>
          <span style="font:500 16px/28px Pretendard;">베베앙</span>
        </div>
        <div class="brand-item">
          <div class="thumb"></div>
          <span>미마</span>
        </div>
      </div>
    </div>
    <hr class="divider-1" style="border:0; height:1px; background:#e0e0e0;">
    <div class="cal-row">... 에싸 ...</div>
    <hr>
    <div class="cal-row">... 미닉스 ...</div>
  </div>
</section>
```

### CSS 핵심
```css
.live-feature .cta { background: #ec0100; }
.live-feature .kv-card .coupon { mix-blend-mode: multiply; }
.box-button-xs { height: 28px; font-size: 14px; }
.cal-row .badge { background:#f5f5f5; color:#141414; }
```

---

## 추가 메모 (HTML 작성에 필요한 정보)

### 모든 탭 공통 컨테이너
```html
<main class="container" style="width:375px; background:#fff;">
  <header class="status-bar" style="height:94px;">...</header>
  <section class="kv" style="height:516px;">
    <img src="/assets/kv-{tabname}.png" style="width:100%; height:100%; object-fit:cover;">
  </section>
  <nav class="tab" style="height:44px;">
    <div class="tab-list">...7 tabs (각 53.57px)...</div>
    <hr class="divider" style="height:1px; background:#e0e0e0;">
  </nav>
  <section class="body">
    <!-- 탭별 본문 -->
  </section>
</main>
```

### 본문 사이 Divider
- 모든 모듈 사이 Divider는 `h=12, background:#f5f5f5 (또는 backgroundWeak)`
- 모듈 내 1px divider는 `background:#e0e0e0` (chip normal border 색과 동일)

### 작업 우선순위 결과
- 6개 탭 본문 모두 spec 추출 완료
- KV 자산 6개 모두 다운로드 완료 (각 770KB, 2x scale)
- 개별 상품 썸네일은 placeholder 처리 권장 (실제 이미지는 Code Connect Thumbnail 컴포넌트 사용)

### 누락/주의 사항
- 한샘 탭 1차 모듈 헤더 텍스트는 metadata에서 width 235로 추정 ("OOO 단독 혜택" 또는 "한샘 핵심 추천" 등). design_context로 추가 확인 권장 시 `8523:13266` 노드 사용
- 침대 탭 chip 텍스트는 실제 입력값 없음 (모두 "Text" placeholder). 실제 카테고리(예: 슈퍼싱글/퀸/킹)는 별도 입력 필요
- 특가 탭 7개 모듈 헤더 텍스트도 첫 모듈만 확정 ("집요한 특가" + 타이머 + "단 24시간 최저가 도전!"). 나머지 6개는 동일 구조에 다른 카테고리 텍스트로 추정
