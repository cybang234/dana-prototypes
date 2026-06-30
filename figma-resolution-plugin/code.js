figma.showUI(__html__, { width: 320, height: 560, title: 'Resolution Converter' });

// ─── 상수 ─────────────────────────────────────────────────────────────────────
const MAX_CONTENT_WIDTH = 568;
const BG_NEUTRAL_COLOR = { r: 0.9608, g: 0.9608, b: 0.9608 };
const BG_NEUTRAL_VARIABLE_ID = 'VariableID:09fbfd6cf0a6569e776904a31f44c74dbb60115c/60089:8';

// 모바일 전용 레이어 — 변환 시 제거 (이모지 prefix 포함)
const MOBILE_ONLY_PATTERNS = [
  'Status Bar', 'StatusBar', 'status bar',
  '🪩 Status Bar', '🪩Status Bar',           // 이모지 prefix 포함 상태바
  'Home Indicator', 'HomeIndicator', 'home indicator',
  '🏠 Home Indicator', '🏠Home Indicator',    // 이모지 prefix 포함 홈인디케이터
  '스테이터스바', '스테이터스', '상단 스테이터스', '🗂️ 상단',
  '홈 인디케이터', '홈인디케이터',
];

// 전역 Navigation 인스턴스 패턴
const GLOBAL_NAV_PATTERNS = ['🪣 Navigation'];

// Fixed 모드 Top Nav 패턴
const TOP_NAV_PATTERNS = ['Top Nav', 'TopNav', 'Top Navigation', 'TopNavigation'];

// 건드리면 안 되는 요소 (FAB, 플로팅 버튼 등)
const SKIP_PATTERNS = ['FAB', 'fab', 'Float', 'Floating', 'fixed', 'Fixed'];

// PC에서 제거할 FAB 아이콘 패턴 (스크롤 위로, 공유하기 등 모바일 전용 UX)
const PC_REMOVE_FAB_ICON_PATTERNS = [
  'Arrow Up', 'ArrowUp', '위로', 'ScrollTop', 'Scroll Top',
  'Share', 'share', '공유', 'Point 3 Connected', 'Split Path',
  'Arrow Top', 'Top Arrow', 'chevron-up', 'Chevron Up',
];

// PC에서 유지할 FAB 아이콘 패턴 (상담, CS 등 비즈니스 기능)
const PC_KEEP_FAB_ICON_PATTERNS = [
  '상담', 'chat', 'Chat', 'kakao', 'Kakao', 'CS', 'Customer',
  'Message', 'message', 'Talk', 'talk', 'Phone', 'phone', 'Help', 'help',
];

// 상품 카드 패턴 — 폰트 스케일업 제외 + isProductList 감지
const CARD_PATTERNS = ['상품카드', '카드ver', 'ProductCard', 'product-card', 'product_card', 'ItemCard', 'item-card'];

// 배너/KV 패턴 — 태블릿 이하에서 full-width로 처리
const BANNER_PATTERNS = [
  'KV', 'kv', 'Banner', 'banner', '배너',
  'Carousel', 'carousel', '캐러셀',
  'Hero', 'hero', 'Slide', 'slide',
  'Visual', 'visual', 'Promotion', 'promotion',
];

// 오늘의집 Navigation 컴포넌트 키
const NAV_COMPONENT_KEYS = {
  pc:     'ce8953d12dca53ff5a15ba3d0b51ee048b337a3f', // ≥1024px
  tablet: '28688442f06368a777bec5645e995a0ea70cd1fc', // ≥768px
  mobile: '4bceeae179ff33ae7ac17dbb808135ca5ce24b2e', // <768px
};

// 🗂️ 상단 스테이터스바 컴포넌트 키
const STATUS_BAR_COMPONENT_KEYS = {
  ios: '71e25f395d0dc1c7fb303b8a4bf63f878ff21995', // 플랫폼=iOS, 모드=Light (모바일/태블릿)
  pc:  '97d9a70abf78e0de3448ebdc7eea68474ec41340', // 🪩 Status Bar (web)
};

// ─── 가독성 보정 규칙 (Readability Rules) ────────────────────────────────────
const READABILITY = {
  MIN_FONT: 10,      // 절대 최소 폰트 사이즈
  MIN_SPACING: 4,    // 요소 간 최소 간격 (itemSpacing)
  PRODUCT_NAME_MAX_LINES: 1, // 상품카드 내 상품명: 항상 1줄 말줄임 (그리드 높이 통일)
};

// ─── ODS 타이포그래피 토큰 (Ohouse Design System) ───────────────────────────
// { size, weight, lh(lineHeight px), ls(letterSpacing px) }
// weight 400=Regular, 700=Bold (600 이상은 Bold 버킷으로 취급)
// Regular 계열 / Bold 계열 분리 저장 — 같은 weight 내에서 단계 적용
const ODS_TYPO_REGULAR = [
  { size: 10, lh: 14, ls: -0.3 },
  { size: 11, lh: 16, ls: -0.3 },
  { size: 12, lh: 16, ls: -0.3 },
  { size: 13, lh: 18, ls: -0.3 },
  { size: 14, lh: 20, ls: -0.3 },
  { size: 15, lh: 24, ls: -0.3 },
  { size: 16, lh: 20, ls: -0.3 },
  { size: 17, lh: 22, ls: -0.3 },
  { size: 18, lh: 24, ls: -0.3 },
  { size: 20, lh: 28, ls: -0.3 },
];
const ODS_TYPO_BOLD = [
  { size: 10, lh: 14, ls: -0.3 },
  { size: 11, lh: 16, ls: -0.3 },
  { size: 12, lh: 16, ls: -0.3 },
  { size: 13, lh: 18, ls: -0.3 },
  { size: 14, lh: 20, ls: -0.3 },
  { size: 15, lh: 24, ls: -0.3 },
  { size: 16, lh: 20, ls: -0.3 },
  { size: 17, lh: 26, ls: -0.3 }, // Heading17_Bold: lh 26 (Medium/Regular는 22)
  { size: 18, lh: 24, ls: -0.3 },
  { size: 20, lh: 28, ls: -0.3 },
  { size: 22, lh: 28, ls: -0.3 },
  { size: 24, lh: 32, ls: -0.3 },
  { size: 28, lh: 36, ls: -0.3 },
  { size: 32, lh: 40, ls: -0.3 },
  { size: 36, lh: 44, ls: -0.3 },
  { size: 40, lh: 48, ls: -0.3 },
];

// breakpoint별 스텝 수: Tablet=1, PC/Wide=2 (직접 매핑 없는 사이즈용 fallback)
function getFontSteps(targetWidth) {
  if (targetWidth >= 1440) return 2;
  if (targetWidth >= 768)  return 1;
  return 0;
}

// 폰트 사이즈 직접 매핑 테이블 [tablet_target, pc_target]
// 매핑에 없는 사이즈는 getFontSteps 스텝 기반 fallback
var FONT_SIZE_MAP = {
  24: [32, 32],
  20: [24, 24],
  16: [17, 18],
  15: [17, 18],
  14: [16, 17],
  13: [14, 14],
  12: [13, 13],
  11: [12, 12],
};
function getTargetFontSize(size, targetWidth) {
  var entry = FONT_SIZE_MAP[size];
  if (!entry) return null;
  return targetWidth >= 1440 ? entry[1] : entry[0];
}

function getSpacingSteps(targetWidth) {
  if (targetWidth >= 1440) return 2;
  if (targetWidth >= 768)  return 1;
  return 0;
}

// ODS 컴포넌트 Size 프로퍼티 전용 스텝 (padding보다 큰 폭으로 올림)
// Tablet: +2 (50→56), PC: +3 (50→60)
function getOdsSizeSteps(targetWidth) {
  if (targetWidth >= 1440) return 3;
  if (targetWidth >= 768)  return 2;
  return 0;
}

/// ODS 토큰 매핑: 현재 fontSize + fontWeight → N 단계 올린 ODS 토큰 반환
// returns { size, lh, ls } or null
function resolveOdsToken(fontSize, fontWeight, steps) {
  var scale = (fontWeight >= 600) ? ODS_TYPO_BOLD : ODS_TYPO_REGULAR;
  var idx = scale.findIndex(function(t) { return t.size >= fontSize; });
  if (idx === -1) idx = scale.length - 1;
  var newIdx = Math.min(idx + steps, scale.length - 1);
  return scale[newIdx];
}

// ODS 토큰 직접 조회: targetSize에 가장 가까운(이상) 토큰 반환
function resolveOdsByTarget(targetSize, fontWeight) {
  var scale = (fontWeight >= 600) ? ODS_TYPO_BOLD : ODS_TYPO_REGULAR;
  for (var i = 0; i < scale.length; i++) {
    if (scale[i].size >= targetSize) return scale[i];
  }
  return scale[scale.length - 1];
}

// 비율 기반 스페이싱 스케일업: value × (targetWidth/390)^0.4, 4px 그리드 스냅
function calcSpacing(value, targetWidth) {
  if (value <= 0) return value;
  var SOURCE_WIDTH = 390;
  if (targetWidth <= SOURCE_WIDTH) return value;
  var ratio = Math.pow(targetWidth / SOURCE_WIDTH, 0.4);
  var rawNew = value * ratio;
  var snapped = Math.round(rawNew / 4) * 4;
  return Math.max(snapped, value); // 절대 줄이지 않음
}

function getHorizontalPadding(width) {
  if (width >= 1024) return 60;
  if (width >= 768)  return 40;
  return 16;
}

function getNavBreakpoint(width) {
  if (width >= 1024) return 'pc';
  if (width >= 768)  return 'tablet';
  return 'mobile';
}

function isMobileOnly(node) {
  const nameLower = node.name.toLowerCase();
  return MOBILE_ONLY_PATTERNS.some(p => nameLower.includes(p.toLowerCase()));
}

function isSkippable(node) {
  return SKIP_PATTERNS.some(p => node.name.includes(p));
}

function isGlobalNav(node) {
  return GLOBAL_NAV_PATTERNS.some(p => node.name.includes(p));
}

// 노드 이름 + 하위 자식 이름을 모두 수집해서 아이콘 맥락 파악
function collectNodeNames(node) {
  const names = [node.name];
  if ('children' in node) {
    for (const child of node.children) {
      names.push(...collectNodeNames(child));
    }
  }
  return names;
}

// 배너/KV 요소 감지 — 이름 기반 휴리스틱
function looksLikeBanner(node) {
  return BANNER_PATTERNS.some(p => node.name.includes(p));
}

// PC(≥1024px)에서 제거해야 할 FAB인지 판단
// - KEEP 패턴이 하나라도 있으면 → 유지
// - REMOVE 패턴이 있으면 → 제거
// - 둘 다 없으면 → 기본 제거 (모바일 전용 UX로 간주)
function isMobileOnlyFAB(node) {
  const allNames = collectNodeNames(node).join(' ');
  if (PC_KEEP_FAB_ICON_PATTERNS.some(p => allNames.includes(p))) return false;
  if (PC_REMOVE_FAB_ICON_PATTERNS.some(p => allNames.includes(p))) return true;
  return true; // 판단 불가시 PC에서 제거
}

// HORIZONTAL AL 캐러셀/탭 감지: 내부 아이템 height ≤ 80px (필터 칩, 탭 아이템)
// 1→1→N wrapper 패턴(🪣 Tab/PC/true)도 최대 3단계까지 투시
function looksLikeHorizontalAlCarousel(frame) {
  if (frame.layoutMode !== 'HORIZONTAL' || !frame.children) return false;
  var candidate = frame;
  for (var depth = 0; depth < 4; depth++) {
    var vis = candidate.children.filter(function(c) { return !c.hidden; });
    if (vis.length >= 2) {
      var avgH = vis.reduce(function(s, c) { return s + c.height; }, 0) / vis.length;
      return avgH <= 80;
    }
    if (vis.length !== 1 || !vis[0].children) return false;
    candidate = vis[0];
  }
  return false;
}

// 탭 컨테이너에서 실제 탭 아이템 행을 찾고, 중간 wrapper들을 pathToFill에 수집
// returns: 실제 탭 아이템 행 (children이 ≥2개인 첫 번째 노드), null이면 직접 처리
function findActualTabRow(node, maxDepth, pathToFill) {
  if (!node || maxDepth <= 0 || !node.children) return null;
  var vis = node.children.filter(function(c) { return !c.hidden; });
  if (vis.length >= 2) return node; // 이 노드의 children이 실제 탭 아이템들
  if (vis.length === 1) {
    if (pathToFill) pathToFill.push(vis[0]);
    return findActualTabRow(vis[0], maxDepth - 1, pathToFill);
  }
  return null;
}

// HORIZONTAL AL 진짜 캐러셀 감지: 아이템 합산 너비 > 프레임 너비 (overflow)
function looksLikeAlCarouselOverflow(frame) {
  if (frame.layoutMode !== 'HORIZONTAL' || !frame.children) return false;
  var vis = frame.children.filter(function(c) { return !c.hidden; });
  if (vis.length < 2) return false;
  var totalW = vis.reduce(function(s, c) { return s + c.width; }, 0) +
               (vis.length - 1) * (frame.itemSpacing || 0);
  return totalW > frame.width + 20; // 아이템이 컨테이너를 벗어남
}

// 탭/칩 내부 HUG 처리: 탭 아이템(FRAME/GROUP/INSTANCE)을 AUTO로, TEXT를 WIDTH_AND_HEIGHT로
// isRoot=true 이면 컨테이너 자체(FILL 유지)는 건드리지 않음
function fixCarouselTextHug(node, isRoot) {
  if (!node) return;
  // 탭 아이템(FRAME/GROUP/INSTANCE): root가 아닐 때만 AUTO 설정
  if (!isRoot && (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'INSTANCE')) {
    try { node.layoutSizingHorizontal = 'AUTO'; } catch(_) {}
  }
  // TEXT 이면 HUG
  if (node.type === 'TEXT') {
    try { node.textAutoResize = 'WIDTH_AND_HEIGHT'; } catch(_) {}
    return; // TEXT는 자식 없음
  }
  if (!node.children) return;
  for (var i = 0; i < node.children.length; i++) {
    fixCarouselTextHug(node.children[i], false);
  }
}

// 모바일 기준 너비 추정: 컨테이너가 FILL로 자동 리사이즈된 경우 visibleCount 보정용
var APPROX_MOBILE_WIDTH = 390;

// NONE 레이아웃 캐러셀 아이템 비례 스케일
// 모바일 기준 visible count 유지, 최대 2배
function scaleNoneCarouselItems(frame, newContainerWidth, origFrameWidth, targetWidth) {
  var vis = (frame.children || []).filter(function(c) { return !c.hidden; });
  if (vis.length < 2) return;
  vis.sort(function(a, b) { return a.x - b.x; });
  var firstItem = vis[0];
  var secondItem = vis[1];
  var origItemW = firstItem.width;
  var gap = Math.max(0, secondItem.x - (firstItem.x + firstItem.width));
  if (origItemW <= 0) return;
  // 컨테이너가 FILL 자동 리사이즈로 origFrameWidth ≈ newContainerWidth이면
  // 모바일 기준 너비(390px)로 visibleCount 보정
  var effOrigW = origFrameWidth || frame.width;
  var visibleCount;
  if (targetWidth && targetWidth > 500 && Math.abs(effOrigW - newContainerWidth) < 30) {
    var approxMobileInner = newContainerWidth * APPROX_MOBILE_WIDTH / targetWidth;
    visibleCount = approxMobileInner / (origItemW + (gap || origItemW * 0.1));
  } else {
    visibleCount = effOrigW / (origItemW + (gap || origItemW * 0.1));
  }
  if (visibleCount < 0.3) return;
  var targetW = Math.min(
    Math.floor(newContainerWidth / visibleCount),
    Math.round(origItemW * 2)
  );
  if (Math.abs(targetW - origItemW) < 4) return;
  var newGap = Math.round(gap * (targetW / origItemW));
  var curX = firstItem.x;
  for (var i = 0; i < vis.length; i++) {
    try { vis[i].x = Math.round(curX); } catch(_) {}
    try { vis[i].resize(targetW, vis[i].height); } catch(_) {}
    curX += targetW + newGap;
  }
}

// AL 레이아웃 캐러셀 아이템 비례 스케일
function scaleAlCarouselItems(frame, newContainerWidth, origFrameWidth, targetWidth) {
  var vis = (frame.children || []).filter(function(c) { return !c.hidden; });
  if (vis.length < 2) return;
  var origFrameW = origFrameWidth || frame.width;
  var origItemW = vis[0].width;
  var gap = frame.itemSpacing || 0;
  if (origItemW <= 0) return;
  // 컨테이너가 FILL 자동 리사이즈로 origFrameW ≈ newContainerWidth이면
  // 모바일 기준 너비(390px)로 visibleCount 보정
  var visibleCount;
  if (targetWidth && targetWidth > 500 && Math.abs(origFrameW - newContainerWidth) < 30) {
    var approxMobileInner = newContainerWidth * APPROX_MOBILE_WIDTH / targetWidth;
    visibleCount = approxMobileInner / (origItemW + gap);
  } else {
    visibleCount = origFrameW / (origItemW + gap);
  }
  if (visibleCount < 0.3) return;
  var targetW = Math.min(
    Math.floor(newContainerWidth / visibleCount),
    Math.round(origItemW * 2)
  );
  if (Math.abs(targetW - origItemW) < 4) return;
  var scaleRatio = targetW / origItemW;
  for (var i = 0; i < vis.length; i++) {
    var origItemH = vis[i].height;
    var newItemH = Math.round(origItemH * scaleRatio);
    try { vis[i].layoutSizingHorizontal = 'FIXED'; } catch(_) {}
    // 너비 + 높이 비례 스케일 → 이미지 비율 유지
    try { vis[i].resize(targetW, newItemH); } catch(_) {}
    // 내부 이미지 프레임도 비례 스케일 (≥60px 너비/높이 ≥40px 조건)
    if (scaleRatio > 1.05 && vis[i].children) {
      for (var j = 0; j < vis[i].children.length; j++) {
        var kid = vis[i].children[j];
        if (!kid.hidden && kid.width >= 60 && kid.height >= 40) {
          var newKidW = Math.round(kid.width * scaleRatio);
          var newKidH = Math.round(kid.height * scaleRatio);
          try { kid.layoutSizingHorizontal = 'FIXED'; } catch(_) {}
          try { kid.resize(newKidW, newKidH); } catch(_) {}
        }
      }
    }
  }
}

// 캐러셀/가로스크롤 감지: 자식들이 프레임 너비를 30px 이상 초과하면 true
function looksLikeCarousel(frame) {
  if (!frame.children || frame.children.length < 2) return false;
  const visible = frame.children.filter(c => !c.hidden);
  if (visible.length < 2) return false;
  const rightEdge = Math.max(...visible.map(c => c.x + c.width));
  return rightEdge > frame.width + 30;
}

// 수평 레이아웃 감지: 보이는 자식들이 수평으로 배치된 경우 true
// 1차: y 편차 30px 미만 (정렬이 완벽한 경우)
// 2차: x-span이 y편차의 3배 이상 (높이 차이 있어도 명백히 수평 배치인 경우)
//      ex) Commerce/Category 아이콘 행 — y=0/28/42 섞여 있어도 x-span=736px vs y편차=42px
function looksLikeHorizontalNone(frame) {
  if (!frame.children || frame.children.length < 2) return false;
  const visible = frame.children.filter(c => !c.hidden);
  if (visible.length < 2) return false;
  const ys = visible.map(c => c.y);
  const yRange = Math.max(...ys) - Math.min(...ys);
  if (yRange < 30) return true;
  // x-span (자식들의 오른쪽 끝 - 왼쪽 끝) vs y편차 비교
  const xStart = Math.min(...visible.map(c => c.x));
  const xEnd   = Math.max(...visible.map(c => c.x + c.width));
  const xSpan  = xEnd - xStart;
  return xSpan > yRange * 3 && xSpan > (frame.width || 100) * 0.4;
}

// 다단 그리드 감지: NONE 프레임 자식들이 2개 이상 x열 × 2개 이상 y행으로 배치된 경우
// (헤더 텍스트 1개 + 가로 스크롤 1행은 그리드로 판정하지 않음)
function looksLikeNoneGrid(frame) {
  if (frame.layoutMode !== 'NONE') return false;
  if (!frame.children || frame.children.length < 4) return false;
  const visible = frame.children.filter(c => !c.hidden);
  if (visible.length < 4) return false;

  // x 기준 컬럼 클러스터링 (50px 이상 떨어지면 별도 열)
  const xs = visible.map(c => c.x).sort((a, b) => a - b);
  const colStarts = [xs[0]];
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] - colStarts[colStarts.length - 1] > 50) colStarts.push(xs[i]);
  }
  if (colStarts.length < 2) return false;

  // 적어도 하나의 열에 2개 이상의 행(y값)이 있어야 진짜 그리드
  for (const colX of colStarts) {
    const colItems = visible.filter(c => Math.abs(c.x - colX) < 50);
    const uniqueYs = [...new Set(colItems.map(c => Math.round(c.y / 5) * 5))];
    if (uniqueYs.length >= 2) return true;
  }
  return false;
}

// NONE 프레임 내부 자식을 재귀적으로 targetWidth에 맞게 리사이즈 (keep 모드 Top Nav용)
// 레이아웃 모드 변경 없이 너비만 cascade 적용 — FRAME + INSTANCE 모두 처리, 아이콘/소형 요소는 제외
// 주의: 이미 변환된 프레임(outer가 widened, inner는 아직 mobile 너비)도 처리해야 하므로
// 비율 기반 대신 절대값(>100px)으로 판단 — 아이콘은 보통 60px 이하
function cascadeResizeWidth(frame, newWidth) {
  if (frame.width <= 0) return;
  try { frame.resize(newWidth, frame.height); } catch(_) {}
  if (!frame.children) return;
  var parentHasAL = frame.layoutMode && frame.layoutMode !== 'NONE';
  for (const child of frame.children) {
    // 100px 이하 = 아이콘/소형 요소, 재귀 대상 아님
    if (child.width <= 100 && child.height <= 100) continue;
    if (child.type === 'FRAME') {
      cascadeResizeWidth(child, newWidth);
      // resize 후 FILL 설정 — 부모가 늘어날 때 자식도 따라오도록
      try { child.layoutSizingHorizontal = 'FILL'; } catch(_) {}
    } else if (child.type === 'INSTANCE') {
      // INSTANCE는 재귀 불가 — 너비만 resize + FILL 설정
      try { child.resize(newWidth, child.height); } catch(_) {}
      try { child.layoutSizingHorizontal = 'FILL'; } catch(_) {}
    }
    // resize/FILL 후 autolayout 부모에서 ABSOLUTE로 변할 수 있으므로 명시 리셋
    if (parentHasAL) {
      try { child.layoutPositioning = 'AUTO'; } catch(_) {}
    }
  }
}

// NONE 프레임에서 자식의 x 위치로 암묵적 좌우 마진 감지 (paddingLeft 없는 경우 대응)
function getEffectivePadding(frame) {
  if (frame.layoutMode !== 'NONE') {
    return { left: frame.paddingLeft || 0, right: frame.paddingRight || 0 };
  }
  if (!frame.children || frame.children.length === 0) return { left: 0, right: 0 };
  const visible = frame.children.filter(c => !c.hidden);
  if (visible.length === 0) return { left: 0, right: 0 };
  const xs = visible.map(c => c.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  // 자식이 일관된 x 오프셋으로 배치된 경우만 마진으로 판단 (다단 그리드는 제외)
  if (minX <= 0 || maxX - minX > 20) return { left: 0, right: 0 };
  const rightEdges = visible.map(c => c.x + c.width);
  const maxRight = Math.max(...rightEdges);
  return {
    left: Math.round(minX),
    right: Math.max(0, Math.round(frame.width - maxRight)),
  };
}

// VERTICAL AL 전환 + 원본 간격 보존 (paddingTop + marginTop 적용)
function switchToVerticalAL(frame) {
  if (frame.layoutMode !== 'NONE') return; // 이미 AL이면 스킵
  if (!frame.children || frame.children.length === 0) return;
  if (looksLikeHorizontalNone(frame)) return; // 수평 배치 프레임은 건드리지 않음
  if (looksLikeNoneGrid(frame)) return;       // 다단 그리드는 건드리지 않음

  // 1. 변환 전: 자식들의 y 위치로 간격 측정
  const sorted = [...frame.children].sort((a, b) => a.y - b.y);

  // 첫 자식의 y = 상단 패딩
  const topPad = Math.max(0, sorted[0].y);
  // 하단 패딩 = 프레임 높이 - 마지막 자식 끝
  const lastChild = sorted[sorted.length - 1];
  const bottomPad = Math.max(0, frame.height - (lastChild.y + lastChild.height));

  // 자식 간 간격
  const gapMap = new Map();
  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = sorted[i - 1].y + sorted[i - 1].height;
    const gap = Math.max(0, sorted[i].y - prevEnd);
    gapMap.set(sorted[i].id, gap);
  }

  // 2. 자식 x 오프셋 감지 → paddingLeft/Right 및 counterAxisAlignItems 결정
  const frameCenterX = (frame.width || 0) / 2;
  const childXs = sorted.map(c => c.x);
  const minChildX = Math.min(...childXs);
  const maxChildX = Math.max(...childXs);

  // 수평 정렬 감지
  // - CENTER: 자식들의 가로 중심이 프레임 중심과 일치 (오차 10px 이내)
  // - MIN: 자식들이 왼쪽에 붙어있음
  const centeredCount = sorted.filter(c => {
    const childCenterX = c.x + c.width / 2;
    return Math.abs(childCenterX - frameCenterX) < 10;
  }).length;
  const isCentered = sorted.length > 0 && centeredCount >= Math.ceil(sorted.length * 0.6);

  let detectedPadLeft = 0, detectedPadRight = 0;
  let counterAlign = 'MIN';
  if (isCentered) {
    counterAlign = 'CENTER';
  } else if (minChildX > 0 && maxChildX - minChildX < 20) {
    // 모든 자식이 같은 x → 패딩으로 처리
    detectedPadLeft = Math.round(minChildX);
    const childRights = sorted.map(c => c.x + c.width);
    detectedPadRight = Math.max(0, Math.round(frame.width - Math.max(...childRights)));
  }

  // 3. VERTICAL AL 전환
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisAlignItems = 'MIN';
  frame.counterAxisAlignItems = counterAlign;
  frame.itemSpacing = 0;
  frame.paddingTop    = topPad;
  frame.paddingBottom = bottomPad;
  frame.paddingLeft   = detectedPadLeft;
  frame.paddingRight  = detectedPadRight;

  // 4. 자식을 y 오름차순으로 재정렬
  // (VERTICAL AL은 document order로 배치 — 원본 y 위치와 다를 수 있음)
  for (let i = 0; i < sorted.length; i++) {
    try { frame.insertChild(i, sorted[i]); } catch (_) {}
  }

  // 5. 자식 간 간격을 marginTop으로 복원
  // layoutPositioning='ABSOLUTE'(ignore auto layout)인 자식은 'AUTO'로 강제 리셋
  for (const child of frame.children) {
    try { child.layoutPositioning = 'AUTO'; } catch (_) {}
    const gap = gapMap.get(child.id);
    try { child.marginTop = gap && gap > 0 ? gap : 0; } catch (_) {}
  }
}

// 그리드 감지: HORIZONTAL wrap 이거나 자식이 동일 너비로 반복되는 경우
function looksLikeGrid(node) {
  if (!('children' in node) || node.children.length < 2) return false;
  if (node.layoutWrap === 'WRAP') return true;
  if (node.layoutMode === 'HORIZONTAL') {
    const childWidths = node.children.map(c => Math.round(c.width));
    const allSame = childWidths.every(w => w === childWidths[0]);
    if (allSame && node.children.length >= 2) return true;
  }
  return false;
}

/// 상품 리스트 감지: 같은 이름의 인스턴스가 2개 이상이고 height > 100px (필터 칩 제외)
function isProductList(node) {
  if (node.type !== 'FRAME' || !node.children || node.children.length < 2) return false;
  // 1) INSTANCE 기반 (기존 로직)
  const instances = node.children.filter(n => n.type === 'INSTANCE' && n.height > 100);
  if (instances.length >= 2) {
    const nameCounts = {};
    instances.forEach(n => { nameCounts[n.name] = (nameCounts[n.name] || 0) + 1; });
    if (Object.values(nameCounts).some(count => count >= 2)) return true;
  }
  // 2) FRAME 기반: CARD_PATTERNS 이름 + height > 100 + 2개 이상 → 상품카드ver2 등
  const cardFrames = node.children.filter(n =>
    n.type === 'FRAME' && n.height > 100 &&
    CARD_PATTERNS.some(function(p) { return n.name.indexOf(p) !== -1; })
  );
  return cardFrames.length >= 2;
}

// breakpoint별 그리드 컬럼 수 (상품 카드 2/3/4grid 대응)
function getGridConfig(targetWidth) {
  if (targetWidth >= 1024) return { cols: 4, gap: 16 };
  if (targetWidth >= 768)  return { cols: 2, gap: 16 }; // 태블릿: 2컬럼 FILL
  return { cols: 2, gap: 8 };
}

// 카드 내부 절대 배치 이미지 컨테이너 → STRETCH 제약 설정
// 썸네일 프레임 안의 absolute image frame이 카드 width 변화를 따라오게 함
function fixCardImageConstraints(card) {
  if (!card || !card.children) return;
  for (var i = 0; i < card.children.length; i++) {
    var child = card.children[i];
    // 썸네일 컨테이너 감지 (Thumbnail, Image, thumb 등)
    var isThumb = child.type === 'FRAME' && child.name &&
      (child.name.toLowerCase().indexOf('thumbnail') !== -1 ||
       child.name.toLowerCase().indexOf('card thumb') !== -1 ||
       child.name.toLowerCase().indexOf('image') !== -1);
    if (!isThumb) continue;
    // 썸네일 안의 absolute 배치 자식 프레임 중 IMAGE fill이 있는 것만 STRETCH 제약
    // Timer, badge, ToggleButton 등 소형 UI 요소는 건드리지 않음
    if (!child.children) continue;
    for (var j = 0; j < child.children.length; j++) {
      var imgFrame = child.children[j];
      if (imgFrame.type !== 'FRAME' || imgFrame.layoutPositioning === 'AUTO') continue;
      var hasImageFill = false;
      try {
        if (imgFrame.fills && imgFrame.fills.some(function(f) { return f.type === 'IMAGE'; })) {
          hasImageFill = true;
        }
        if (!hasImageFill && imgFrame.children) {
          for (var k = 0; k < imgFrame.children.length; k++) {
            var gc = imgFrame.children[k];
            if (gc.fills && gc.fills.some(function(f) { return f.type === 'IMAGE'; })) {
              hasImageFill = true; break;
            }
          }
        }
      } catch(_) {}
      if (hasImageFill) {
        try { imgFrame.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' }; } catch(_) {}
      }
    }
    // 썸네일 자체도 FILL로
    try { child.layoutSizingHorizontal = 'FILL'; } catch(_) {}
  }
}

// 이미지 fill scaleMode → FILL(크롭)로 변환
// findAll이 없는 노드(TEXT, INSTANCE 등)는 스킵
function fixImageFills(rootNode) {
  if (!rootNode || typeof rootNode.findAll !== 'function') return;
  try {
    const nodes = rootNode.findAll(n => {
      if (n.type === 'INSTANCE') return false; // INSTANCE 내부 쓰기 불가
      return n.fills && n.fills.length > 0 && n.fills.some(f => f.type === 'IMAGE');
    });
    for (const node of nodes) {
      try {
        node.fills = node.fills.map(f =>
          f.type === 'IMAGE' ? Object.assign({}, f, { scaleMode: 'FILL' }) : f
        );
      } catch (_) {}
    }
  } catch (_) {}
}

// 상품 카드 모듈(Web Module) 내부 규칙 적용
// - cardWidth: 카드 컨테이너 너비 (110~200px 클램핑)
// - Img 1:1 비율 유지, 상품명 2줄+말줄임, 가격/리뷰 FILL
function applyWebModuleRules(card, cardWidth) {
  const clampedW = Math.max(110, cardWidth); // 110px 최소 보장, 상한 없음

  // Web Module 프레임 탐색 (1~2 depth)
  const webModules = [];
  function findWebModules(node, maxDepth) {
    if (!node.children || maxDepth <= 0) return;
    for (var i = 0; i < node.children.length; i++) {
      var c = node.children[i];
      if (c.name && c.name.includes('Web Module')) {
        webModules.push(c);
      } else {
        findWebModules(c, maxDepth - 1);
      }
    }
  }
  findWebModules(card, 3);

  for (var wi = 0; wi < webModules.length; wi++) {
    var wm = webModules[wi];

    // Web Module 자체 너비 고정 (FIXED 먼저 설정해야 resize가 실제로 적용됨)
    try { wm.layoutSizingHorizontal = 'FIXED'; } catch (_) {}
    try { wm.resize(clampedW, wm.height); } catch (_) {}

    if (!wm.children) continue;
    for (var ci2 = 0; ci2 < wm.children.length; ci2++) {
      var sec = wm.children[ci2];
      var secName = sec.name || '';

      // Img 프레임: 1:1 비율
      if (secName === 'Img' || secName.toLowerCase() === 'img' || secName.toLowerCase().includes('thumbnail')) {
        try { sec.resize(clampedW, clampedW); } catch (_) {}
        if (sec.children) {
          for (var ii = 0; ii < sec.children.length; ii++) {
            try { sec.children[ii].resize(clampedW, clampedW); } catch (_) {}
          }
        }
        continue;
      }

      // 상품정보 프레임: FILL 처리 후 내부 탐색
      if (secName.includes('상품정보') || secName.includes('상품 정보') || secName.includes('product')) {
        try { sec.resize(clampedW, sec.height); sec.layoutSizingHorizontal = 'FILL'; } catch (_) {}
        applyProductInfoRules(sec, clampedW);
        continue;
      }
    }
  }
}

// 상품정보 프레임 내부 규칙 (상품명 2줄 말줄임, 가격/리뷰 FILL)
function applyProductInfoRules(node, width) {
  if (!node.children) return;
  for (var i = 0; i < node.children.length; i++) {
    var child = node.children[i];
    var name = child.name || '';

    // 상품명 텍스트: 이름 또는 fontSize>=12 (10px 브랜드명 제외) + 다줄 허용 텍스트
    const isProductNameText = child.type === 'TEXT' && (
      name.includes('상품명') || name.includes('product') || name.includes('name') ||
      (child.fontSize >= 12 && child.textAutoResize !== 'WIDTH_AND_HEIGHT')
    );
    if (isProductNameText) {
      try {
        child.layoutSizingHorizontal = 'FILL';
        child.maxLines = READABILITY.PRODUCT_NAME_MAX_LINES; // 1줄 말줄임
        child.textTruncation = 'ENDING';
        child.textAutoResize = 'HEIGHT';
      } catch (_) {}
      continue;
    }

    // 가격 / 리뷰 프레임: FILL
    if (child.type === 'FRAME' && (name.includes('가격') || name.includes('리뷰') || name.includes('price') || name.includes('review'))) {
      try { child.resize(width, child.height); child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
      continue;
    }

    // 중첩 컨테이너 재귀
    if ((child.type === 'FRAME' || child.type === 'GROUP') && child.children) {
      applyProductInfoRules(child, width);
    }
  }
}

// VERTICAL 컨테이너 안에 HORIZONTAL 카드 행들로 구성된 상품 그리드인지 감지
function isCardRowContainer(frame) {
  if (!frame.children || frame.layoutMode !== 'VERTICAL') return false;
  const visRows = frame.children.filter(function(c) { return !c.hidden && c.type === 'FRAME'; });
  if (visRows.length < 1) return false;
  var cardRowCount = 0;
  for (var i = 0; i < visRows.length; i++) {
    var row = visRows[i];
    if (row.layoutMode !== 'HORIZONTAL') continue;
    var kids = (row.children || []).filter(function(c) { return !c.hidden && c.type === 'FRAME'; });
    if (kids.length >= 1 && kids.some(function(k) {
      // 필터 칩(height ≤ 80px)은 카드 행으로 감지하지 않음
      return k.height > 80 && k.children && k.children.some(function(c) { return c.name && c.name.includes('Web Module'); });
    })) {
      cardRowCount++;
    }
  }
  // 절반 이상의 row가 Web Module 카드 행이면 해당
  return cardRowCount >= 1 && cardRowCount >= visRows.length * 0.5;
}

// HORIZONTAL 카드 행 구조 → 해상도별 HORIZONTAL WRAP 그리드로 재구조화
function convertCardRowsToGrid(container, containerWidth, targetWidth) {
  var gridCfg = getGridConfig(targetWidth);
  var cols = gridCfg.cols, gap = gridCfg.gap;
  var cardWidth = Math.max(110, Math.floor((containerWidth - (cols - 1) * gap) / cols));

  // 모든 카드 수집 (카드 행에서만)
  var allCards = [];
  var rowsToRemove = [];
  var rowChildren = [];
  for (var i = 0; i < container.children.length; i++) {
    var c = container.children[i];
    if (!c.hidden && c.type === 'FRAME' && c.layoutMode === 'HORIZONTAL') {
      rowChildren.push(c);
    }
  }
  for (var ri = 0; ri < rowChildren.length; ri++) {
    var row = rowChildren[ri];
    var rowCards = (row.children || []).filter(function(c) { return !c.hidden && c.type === 'FRAME'; });
    var isCardRow = rowCards.some(function(k) {
      return k.children && k.children.some(function(c) { return c.name && c.name.includes('Web Module'); });
    });
    if (isCardRow) {
      for (var ci = 0; ci < rowCards.length; ci++) {
        allCards.push(rowCards[ci]);
      }
      rowsToRemove.push(row);
    }
  }
  if (allCards.length === 0) return;

  // 카드를 컨테이너로 이동 (reparent)
  for (var ai = 0; ai < allCards.length; ai++) {
    try { container.appendChild(allCards[ai]); } catch (_) {}
  }
  // 빈 행 제거
  for (var rri = 0; rri < rowsToRemove.length; rri++) {
    try { rowsToRemove[rri].remove(); } catch (_) {}
  }

  // 컨테이너를 HORIZONTAL WRAP 그리드로 전환
  var origPadTop = container.paddingTop || 0;
  container.layoutMode = 'HORIZONTAL';
  container.layoutWrap = 'WRAP';
  container.primaryAxisAlignItems = 'MIN';
  container.counterAxisAlignItems = 'MIN';
  container.itemSpacing = gap;
  try { container.counterAxisSpacing = gap; } catch (_) {}
  container.paddingTop = origPadTop;
  container.paddingBottom = 0;
  container.primaryAxisSizingMode = 'FIXED';
  container.counterAxisSizingMode = 'AUTO';
  try { container.layoutSizingHorizontal = 'FILL'; } catch (_) {}

  // 카드 리사이즈 + Web Module 규칙 적용
  for (var cai = 0; cai < allCards.length; cai++) {
    var card = allCards[cai];
    try { card.layoutSizingHorizontal = 'FIXED'; } catch (_) {}
    try { card.primaryAxisSizingMode = 'AUTO'; } catch (_) {} // height HUG
    try { card.resize(cardWidth, card.height); } catch (_) {}
    applyWebModuleRules(card, cardWidth);
  }
}

// 상품 리스트 → 그리드 변환 (2컬럼: VERTICAL+HORIZONTAL FILL / 3+컬럼: WRAP 고정폭)
function convertToProductGrid(frame, containerWidth, targetWidth) {
  const { cols, gap } = getGridConfig(targetWidth);

  // row gap은 원본 보존, col gap은 항상 getGridConfig 기준값 사용 (원본 frame.itemSpacing이 클 수 있음)
  var origRowGap = gap;
  try { origRowGap = (frame.counterAxisSpacing > 0) ? frame.counterAxisSpacing : gap; } catch(_) {}
  const origPadTop    = frame.paddingTop    || 0;
  const origPadBottom = frame.paddingBottom || 0;

  const cards = [...frame.children].sort(function(a, b) { return (a.y - b.y) || (a.x - b.x); });

  // ── 2컬럼: VERTICAL 부모 + HORIZONTAL 행 + 카드 FILL ─────────────────────
  if (cols === 2) {
    frame.layoutMode = 'VERTICAL';
    frame.primaryAxisAlignItems = 'MIN';
    frame.counterAxisAlignItems = 'MIN';
    frame.itemSpacing = origRowGap;
    frame.paddingTop    = origPadTop;
    frame.paddingBottom = origPadBottom;
    frame.primaryAxisSizingMode = 'AUTO';   // 높이 HUG
    frame.counterAxisSizingMode = 'FIXED';
    try { frame.layoutSizingHorizontal = 'FILL'; } catch (_) {}

    for (var i = 0; i < cards.length; i += 2) {
      var rowCards = cards.slice(i, Math.min(i + 2, cards.length));

      // 행 프레임 생성
      var row = figma.createFrame();
      row.name = '_grid_row';
      row.layoutMode = 'HORIZONTAL';
      row.primaryAxisAlignItems = 'MIN';
      row.counterAxisAlignItems = 'MIN';
      row.itemSpacing = gap;
      row.paddingLeft = 0; row.paddingRight = 0; row.paddingTop = 0; row.paddingBottom = 0;
      row.primaryAxisSizingMode = 'FIXED';
      row.counterAxisSizingMode = 'AUTO';
      row.fills = [];
      frame.appendChild(row);

      for (var j = 0; j < rowCards.length; j++) {
        var card = rowCards[j];
        if (card.type === 'INSTANCE') {
          try {
            var detached = card.detachInstance();
            row.appendChild(detached);
            try { detached.layoutSizingHorizontal = 'FILL'; } catch(_) {}
            try { detached.primaryAxisSizingMode = 'AUTO'; } catch(_) {}
            fixImageFills(detached);
          } catch(_) {
            row.appendChild(card);
            try { card.layoutSizingHorizontal = 'FILL'; } catch(_) {}
          }
        } else {
          // FRAME 타입 카드 (스페셜오늘의딜 상품카드ver2 등)
          row.appendChild(card);
          try { card.layoutSizingHorizontal = 'FILL'; } catch(_) {}
          try { card.primaryAxisSizingMode = 'AUTO'; } catch(_) {}
          fixImageFills(card);
          fixCardImageConstraints(card); // 썸네일 내부 절대 배치 이미지 STRETCH
        }
      }
      // 행 FILL 설정 (frame append 후)
      try { row.layoutSizingHorizontal = 'FILL'; } catch(_) {}
    }
    return;
  }

  // ── 3+컬럼: WRAP 고정폭 (기존 로직) ────────────────────────────────────────
  const cardWidth = Math.floor((containerWidth - (cols - 1) * gap) / cols);

  frame.layoutMode = 'HORIZONTAL';
  frame.layoutWrap = 'WRAP';
  frame.primaryAxisAlignItems = 'MIN';
  frame.counterAxisAlignItems = 'MIN';
  frame.itemSpacing = gap;
  try { frame.counterAxisSpacing = gap; } catch (_) {}
  frame.paddingTop    = origPadTop;
  frame.paddingBottom = origPadBottom;
  frame.primaryAxisSizingMode = 'FIXED';
  frame.counterAxisSizingMode = 'AUTO';
  try { frame.layoutSizingHorizontal = 'FILL'; } catch (_) {}

  for (var ci = 0; ci < frame.children.length; ci++) {
    var card = frame.children[ci];
    if (card.type !== 'INSTANCE') {
      try { card.layoutSizingHorizontal = 'FIXED'; } catch (_) {}
      try { card.primaryAxisSizingMode = 'AUTO'; } catch (_) {}
      try { card.resize(cardWidth, card.height); } catch (_) {}
      applyWebModuleRules(card, cardWidth);
      continue;
    }
    var cardH = card.height;
    try {
      var detached = card.detachInstance();
      detached.resize(cardWidth, cardH);
      try { detached.layoutSizingHorizontal = 'FIXED'; } catch (_) {}
      try { detached.primaryAxisSizingMode = 'AUTO'; } catch (_) {}
      var THUMB_FILL_NAMES = ['image', 'Image', 'Overlay', 'overlay', 'bg', 'Bg', 'background', 'Background'];
      for (var di = 0; di < detached.children.length; di++) {
        var section = detached.children[di];
        if (section.name === 'Card Thumbnail' || section.name.includes('Thumbnail') || section.name.includes('thumb')) {
          section.resize(cardWidth, section.height);
          for (var dk = 0; dk < section.children.length; dk++) {
            var inner = section.children[dk];
            var shouldFill = THUMB_FILL_NAMES.some(function(n) { return inner.name.includes(n); })
              || (inner.type === 'RECTANGLE' && inner.fills && inner.fills.some(function(f) { return f.type === 'IMAGE'; }));
            if (shouldFill) {
              try { inner.resize(cardWidth, inner.height); } catch (_) {}
            }
          }
        }
      }
      fixImageFills(detached);
      applyWebModuleRules(detached, cardWidth);
    } catch (_) {
      try { card.resize(cardWidth, cardH); card.layoutSizingHorizontal = 'FIXED'; } catch (_) {}
    }
  }
}

// NONE 다단 그리드 → HORIZONTAL WRAP 변환
function convertNoneGridToWrap(frame, containerWidth, targetWidth) {
  const visible = frame.children.filter(c => !c.hidden);
  // x 기준 컬럼 수 및 간격 감지
  const xs = visible.map(c => c.x).sort((a, b) => a - b);
  const colStarts = [xs[0]];
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] - colStarts[colStarts.length - 1] > 50) colStarts.push(xs[i]);
  }
  const cols = colStarts.length;
  const firstColItems = visible.filter(c => Math.abs(c.x - colStarts[0]) < 20);
  const firstColWidth  = firstColItems.length > 0 ? firstColItems[0].width : Math.floor(containerWidth / cols);
  const gap = cols > 1 ? Math.max(8, colStarts[1] - (colStarts[0] + firstColWidth)) : 16;
  const colWidth = Math.floor((containerWidth - (cols - 1) * gap) / cols);

  // y 기준 행 높이 유지 (각 행 첫 번째 아이템의 height)
  frame.layoutMode = 'HORIZONTAL';
  frame.layoutWrap = 'WRAP';
  frame.primaryAxisAlignItems  = 'MIN';
  frame.counterAxisAlignItems  = 'MIN';
  frame.itemSpacing   = gap;
  try { frame.counterAxisSpacing = gap; } catch (_) {}
  frame.paddingTop    = 0;
  frame.paddingBottom = 0;
  frame.paddingLeft   = 0;
  frame.paddingRight  = 0;
  frame.primaryAxisSizingMode  = 'FIXED';
  frame.counterAxisSizingMode  = 'AUTO';
  try { frame.layoutSizingHorizontal = 'FILL'; } catch (_) {}

  for (const child of frame.children) {
    try { child.resize(colWidth, child.height); } catch (_) {}
    try { child.layoutSizingHorizontal = 'FIXED'; } catch (_) {}
    try { child.primaryAxisSizingMode = 'AUTO'; } catch (_) {} // height HUG
  }
}

// ─── 가독성 보정 패스 (Readability Pass) ─────────────────────────────────────
// opts: { scaleFont: bool, scaleSpacing: bool }
// Default(둘 다 false): 폰트·간격 변경 없음, 카드 truncation만 적용

function isInsideInstance(node) {
  let p = node.parent;
  while (p) {
    if (p.type === 'INSTANCE') return true;
    p = p.parent;
  }
  return false;
}

async function applyReadabilityPass(rootNode, targetWidth, opts, sourceFrame) {
  opts = opts || {};
  const scaleFont    = !!opts.scaleFont;
  const scaleSpacing = !!opts.scaleFont; // font ON 시 spacing도 자동 적용

  if (!rootNode || typeof rootNode.findAll !== 'function') return;

  // ── 1. ODS 폰트 토큰 적용 (토글 ON 시만) ──
  if (scaleFont) {
    var _steps = getFontSteps(targetWidth);

    // 파일 전체(모든 페이지) 텍스트에서 textStyleId 수집 → { size: { bold, semibold, medium, regular } } 맵
    // weight를 그대로 유지하면서 사이즈만 스텝업
    var _stylesBySize = {};

    // weight 키 분류: 4-way (bold / semibold / medium / regular)
    function _getWeightKey(styleName) {
      var s = styleName || '';
      if (/\b(extrabold|black|heavy)\b/i.test(s) || (/bold/i.test(s) && !/semibold/i.test(s))) return 'bold';
      if (/semibold/i.test(s)) return 'semibold';
      if (/medium/i.test(s)) return 'medium';
      return 'regular';
    }

    // 1순위: 로컬 텍스트 스타일 전체 수집 (라이브러리에서 import된 로컬 스타일 포함)
    try {
      var _localStyles = figma.getLocalTextStyles();
      for (var _lsi = 0; _lsi < _localStyles.length; _lsi++) {
        try {
          var _ls = _localStyles[_lsi];
          if (!_ls || typeof _ls.fontSize !== 'number') continue;
          var _lsfs = _ls.fontSize;
          var _lswk = _getWeightKey((_ls.fontName && _ls.fontName.style) || '');
          if (!_stylesBySize[_lsfs]) _stylesBySize[_lsfs] = {};
          if (!_stylesBySize[_lsfs][_lswk]) _stylesBySize[_lsfs][_lswk] = _ls.id;
        } catch (_) {}
      }
    } catch (_) {}

    // 2순위: 파일 전체 텍스트 노드 스캔 (라이브러리 스타일 보완 - 노드에 바인딩된 ID 수집)
    try {
      var _allPages = figma.root.children;
      for (var _pi2 = 0; _pi2 < _allPages.length; _pi2++) {
        try {
          var _scanNodes = _allPages[_pi2].findAll(function(n) { return n.type === 'TEXT'; });
          for (var _si = 0; _si < _scanNodes.length; _si++) {
            try {
              var _sid = _scanNodes[_si].textStyleId;
              if (!_sid || typeof _sid !== 'string' || _sid === '') continue;
              var _style = figma.getStyleById(_sid);
              if (!_style || _style.type !== 'TEXT') continue;
              var _sfs = _style.fontSize;
              if (typeof _sfs !== 'number') continue;
              var _wk = _getWeightKey((_style.fontName && _style.fontName.style) || '');
              if (!_stylesBySize[_sfs]) _stylesBySize[_sfs] = {};
              if (!_stylesBySize[_sfs][_wk]) _stylesBySize[_sfs][_wk] = _sid;
            } catch (_) {}
          }
        } catch (_) {}
      }
    } catch (_) {}

    // weight key → 오름차순 사이즈 배열
    function _getSizeArr(wk) {
      return Object.keys(_stylesBySize).filter(function(k) { return _stylesBySize[k][wk]; }).map(Number).sort(function(a,b){return a-b;});
    }

    // fontSize + weightKey + steps → styleId (동일 weight만, 없으면 null → raw fallback)
    function _resolveStyleId(fs, wk, n) {
      var arr = _getSizeArr(wk);
      if (arr.length === 0) return null;
      var idx = -1;
      for (var i = 0; i < arr.length; i++) { if (arr[i] >= fs) { idx = i; break; } }
      if (idx === -1) return null;
      var ti = Math.min(idx + n, arr.length - 1);
      if (n > 0 && arr[ti] <= fs) return null;
      return _stylesBySize[arr[ti]][wk] || null;
    }

    // targetSize 직접 지정 → styleId (동일 weight + 정확한 사이즈 일치만)
    // 파일에 해당 사이즈 스타일 없으면 null → raw fallback에서 fontSize 직접 설정
    function _resolveStyleIdByTarget(targetFs, wk) {
      var arr = _getSizeArr(wk);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === targetFs) return _stylesBySize[arr[i]][wk] || null;
      }
      return null;
    }

    // Status Bar 내부 텍스트 여부 확인
    function _isInsideStatusBar(node) {
      var p = node.parent;
      var depth = 0;
      while (p && depth < 8) {
        var nm = p.name || '';
        if (nm.indexOf('Status Bar') !== -1 || nm.indexOf('StatusBar') !== -1 ||
            nm.indexOf('status bar') !== -1 || nm.indexOf('🪩') !== -1) return true;
        p = p.parent;
        depth++;
      }
      return false;
    }

    // 상품카드 내부 텍스트 여부 확인 — 카드 안 텍스트는 폰트 스케일업 스킵
    // CARD_PATTERNS — 전역 상수 사용
    function _isInsideProductCard(node) {
      var p = node.parent;
      var depth = 0;
      while (p && depth < 10) {
        var nm = p.name || '';
        if (CARD_PATTERNS.some(function(pat) { return nm.indexOf(pat) !== -1; })) return true;
        p = p.parent;
        depth++;
      }
      return false;
    }

    // 네비게이션(웹 Global Nav) 내부 텍스트 여부 확인 — nav 텍스트는 스케일업 스킵
    function _isInsideNav(node) {
      var p = node.parent;
      var depth = 0;
      while (p && depth < 10) {
        var nm = p.name || '';
        if (GLOBAL_NAV_PATTERNS.some(function(pat) { return nm.indexOf(pat) !== -1; })) return true;
        // 'Top Navigation' / 'TopNavigation Section' 같은 페이지 섹션은 제외 (Navigation 포함이지만 nav 아님)
        if (nm.indexOf('Navigation') !== -1 && nm.indexOf('Top') === -1) return true;
        if (nm.indexOf('Navigator') !== -1 && nm.indexOf('Top') === -1) return true;
        if (nm.indexOf('TabBar') !== -1) return true;
        p = p.parent;
        depth++;
      }
      return false;
    }

    var _textNodes = rootNode.findAll(function(n) { return n.type === 'TEXT'; });

    // 폰트 일괄 로드
    var _fontSet = new Set();
    for (var _fi = 0; _fi < _textNodes.length; _fi++) {
      try {
        var _fn = _textNodes[_fi].fontName;
        if (_fn && typeof _fn === 'object' && _fn.family) _fontSet.add(JSON.stringify(_fn));
      } catch (_) {}
    }
    await Promise.allSettled(Array.from(_fontSet).map(function(f) { return figma.loadFontAsync(JSON.parse(f)); }));

    var _modified = 0, _skipped = 0, _fallback = 0;
    for (var _ti = 0; _ti < _textNodes.length; _ti++) {
      var _text = _textNodes[_ti];
      try {
        // Status Bar / Navigation / 상품카드 안의 텍스트는 건드리지 않음
        if (_isInsideStatusBar(_text)) { _skipped++; continue; }
        if (_isInsideNav(_text)) { _skipped++; continue; }
        if (_isInsideProductCard(_text)) { _skipped++; continue; }

        var _fs = _text.fontSize;
        if (typeof _fs !== 'number') { _skipped++; continue; }

        var _wKey = 'regular', _fw = 400;
        try {
          var _tfn = _text.fontName;
          if (_tfn && typeof _tfn === 'object' && _tfn.style) {
            _wKey = _getWeightKey(_tfn.style);
            _fw = (_wKey === 'bold') ? 700 : (_wKey === 'semibold') ? 600 : (_wKey === 'medium') ? 500 : 400;
          }
        } catch (_) {}

        // 타겟 사이즈 결정: 직접 매핑 우선, 없으면 스텝 기반
        var _targetFs = getTargetFontSize(_fs, targetWidth);

        // 1순위: textStyleId 바인딩
        var _styleId = _targetFs
          ? _resolveStyleIdByTarget(_targetFs, _wKey)
          : _resolveStyleId(_fs, _wKey, _steps);
        if (_styleId) {
          try { _text.textStyleId = _styleId; _modified++; continue; } catch (_) {}
        }

        // 2순위 fallback: raw값
        if (_targetFs) {
          // FONT_SIZE_MAP에 명시된 타겟: ODS 스타일 없으면 fontSize 직접 설정
          // (resolveOdsByTarget 거치면 17→18처럼 올라갈 수 있어서 직접 처리)
          if (_targetFs === _fs) { _skipped++; continue; }
          _text.fontSize = _targetFs;
          var _tTok = resolveOdsByTarget(_targetFs, _fw);
          if (_tTok) {
            try { _text.lineHeight    = { unit: 'PIXELS', value: _tTok.lh }; } catch (_) {}
            try { _text.letterSpacing = { unit: 'PIXELS', value: _tTok.ls }; } catch (_) {}
          }
          _fallback++; _modified++;
        } else {
          var _token = resolveOdsToken(_fs, _fw, _steps);
          if (!_token || _token.size === _fs) { _skipped++; continue; }
          _text.fontSize = _token.size;
          try { _text.lineHeight    = { unit: 'PIXELS', value: _token.lh }; } catch (_) {}
          try { _text.letterSpacing = { unit: 'PIXELS', value: _token.ls }; } catch (_) {}
          _fallback++; _modified++;
        }
      } catch (_) { _skipped++; }
    }

    var _scannedSizes = Object.keys(_stylesBySize).map(Number).sort(function(a,b){return a-b;});
    figma.notify('ODS 적용: ' + _modified + '개 (바인딩 ' + (_modified - _fallback) + '개 / raw ' + _fallback + '개) | 스캔된 스타일 사이즈: [' + _scannedSizes.join(',') + ']', { timeout: 8000 });
  }

  // ── 2. 마진/패딩/갭 스텝업 (토글 ON 시만) ──
  if (scaleSpacing) {
    if (targetWidth > 390) {
      // 아이콘 프레임: clip + 소형(36px 이하) → 건드리지 않음
      var _isIconFrame = function(n) {
        try { return !!(n.clipsContent && n.width <= 36 && n.height <= 36); } catch(_) { return false; }
      }
      // ODS UI 컴포넌트 이름 패턴 (내부 padding/gap 건드리지 않음)
      var ODS_COMP_PATTERNS = ['🌀','Checkbox','Check Box','BoxButton','Box Button','Chip','Tag','Badge','Toast','Snackbar','Bottom Sheet','BottomSheet','Spinner','Loading','Radio','Toggle','Switch'];
      var _isODSComp = function(n) {
        if (n.type !== 'INSTANCE') return false;
        var nm = n.name || '';
        // 이름 직접 매칭
        if (ODS_COMP_PATTERNS.some(function(p) { return nm.indexOf(p) !== -1; })) return true;
        // ODS Variant 인스턴스: "Size=50, color=primary1, State=Enabled, BG=off" 패턴
        if (/\bSize=\d+/.test(nm) && /\bcolor=/.test(nm) && /\bState=/.test(nm)) return true;
        // 컴포넌트 SET 이름으로 재체크 (외부 라이브러리)
        try {
          var mc = n.mainComponent;
          var setNm = (mc && mc.parent && mc.parent.name) || '';
          if (ODS_COMP_PATTERNS.some(function(p) { return setNm.indexOf(p) !== -1; })) return true;
        } catch(_) {}
        return false;
      };
      // Navigation / Status Bar / 상품카드 내부: spacing 건드리지 않음
      var PROTECTED_ANCESTOR = ['Status Bar','StatusBar','Home Indicator','🪣 Navigation'];
      var _isInProtectedArea = function(n) {
        var p = n;
        var _d = 0;
        while (p && _d < 12) {
          var nm = p.name || '';
          if (PROTECTED_ANCESTOR.some(function(s) { return nm.indexOf(s) !== -1; })) return true;
          // 네비게이션 컴포넌트 전체 보호
          if (nm.indexOf('Navigation') !== -1 || nm.indexOf('Navigator') !== -1) return true;
          // 상품카드 내부 gap/padding 보호
          if (CARD_PATTERNS.some(function(s) { return nm.indexOf(s) !== -1; })) return true;
          p = p.parent; _d++;
        }
        return false;
      };
      // ODS 컴포넌트 내부인지
      var _isInsideODS = function(n) {
        var p = n.parent;
        var _d = 0;
        while (p && _d < 10) {
          if (_isODSComp(p)) return true;
          p = p.parent; _d++;
        }
        return false;
      };
      var _isSpacingTarget = function(n) {
        if (!['FRAME','COMPONENT','INSTANCE'].includes(n.type)) return false;
        if (_isIconFrame(n)) return false;
        if (_isODSComp(n)) return false;
        if (_isInsideODS(n)) return false;
        if (_isInProtectedArea(n)) return false;
        return true;
      };

      // gap(itemSpacing): 스케일업 — omc_bp_padLR='1' 마커 프레임(그리드 컨테이너)은 스킵
      const allFrames = rootNode.findAll(function(n) { return _isSpacingTarget(n); });
      for (var _sf = 0; _sf < allFrames.length; _sf++) {
        var _fr = allFrames[_sf];
        try {
          var _hasBpMarker = false;
          try { _hasBpMarker = _fr.getPluginData('omc_bp_padLR') === '1'; } catch(_) {}
          if (_hasBpMarker) continue; // 그리드 컨테이너 gap은 건드리지 않음
          if (_fr.itemSpacing > 0) _fr.itemSpacing = calcSpacing(_fr.itemSpacing, targetWidth);
        } catch(_) {}
      }

      // padding: rootNode 직속 섹션 제외, 컴포넌트 내부만
      // omc_bp_padLR='1' 마커가 있는 프레임 = 변환 중 명시적으로 세팅된 외부 컨테이너 → 4방향 모두 스킵
      const innerFrames = rootNode.findAll(function(n) { return _isSpacingTarget(n) && n.parent !== rootNode; });
      for (var _if2 = 0; _if2 < innerFrames.length; _if2++) {
        var _fr2 = innerFrames[_if2];
        try {
          var _bpP = false;
          try { _bpP = _fr2.getPluginData('omc_bp_padLR') === '1'; } catch(_e2) {}
          // 외부 컨테이너(omc_bp_padLR='1')는 상하좌우 모두 건드리지 않음
          if (_bpP) continue;
          if (_fr2.paddingTop    > 0) _fr2.paddingTop    = calcSpacing(_fr2.paddingTop,    targetWidth);
          if (_fr2.paddingBottom > 0) _fr2.paddingBottom = calcSpacing(_fr2.paddingBottom, targetWidth);
          if (_fr2.paddingLeft   > 0) _fr2.paddingLeft   = calcSpacing(_fr2.paddingLeft,   targetWidth);
          if (_fr2.paddingRight  > 0) _fr2.paddingRight  = calcSpacing(_fr2.paddingRight,  targetWidth);
        } catch (_) {}
      }

      // ODS 컴포넌트 Size 프로퍼티 스텝업 (Size=50 → 56 → 60 → 64)
      // 카드 내부 ODS 컴포넌트(뱃지, 버튼 등)는 절대 건드리지 않음
      var ODS_SIZES = [36, 40, 44, 48, 50, 52, 56, 60, 64];
      var sizeInstances = rootNode.findAll(function(n) { return _isODSComp(n) && !_isInProtectedArea(n); });
      for (var _oi = 0; _oi < sizeInstances.length; _oi++) {
        var _inst = sizeInstances[_oi];
        try {
          var _props = _inst.componentProperties;
          if (!_props) continue;
          var _sizeKey = null;
          var _pkeys = Object.keys(_props);
          for (var _pk = 0; _pk < _pkeys.length; _pk++) {
            if (/^size(#.*)?$/i.test(_pkeys[_pk])) { _sizeKey = _pkeys[_pk]; break; }
          }
          if (!_sizeKey) continue;
          var _sizeVal = _props[_sizeKey].value;
          var _sizeNum = parseInt(_sizeVal, 10);
          if (isNaN(_sizeNum)) continue;
          var _si2 = ODS_SIZES.indexOf(_sizeNum);
          if (_si2 === -1) {
            // 가장 가까운 값 찾기
            for (var _sx = 0; _sx < ODS_SIZES.length; _sx++) { if (ODS_SIZES[_sx] >= _sizeNum) { _si2 = _sx; break; } }
          }
          if (_si2 === -1) continue;
          var _newSi = Math.min(_si2 + getOdsSizeSteps(targetWidth), ODS_SIZES.length - 1);
          if (ODS_SIZES[_newSi] === _sizeNum) continue;
          try { _inst.setProperties({ [_sizeKey]: String(ODS_SIZES[_newSi]) }); } catch(_) {}
        } catch(_) {}
      }
    }
  }

  // ── 3. 상품 카드 텍스트 truncation (항상 적용) ──
  // textTruncation/maxLines 변경도 Figma Plugin API에서 폰트 로드 필요 → scaleFont 여부 무관하게 사전 로드
  const PRICE_PATTERNS = ['₩', '원', '%', 'price', 'Price', '가격', '할인'];
  try {
    const allText = rootNode.findAll(n => n.type === 'TEXT');
    // 폰트 로드 (scaleFont=false여도 truncation을 위해 필요)
    const _truncFontSet = new Set();
    for (const t of allText) {
      try {
        const fn = t.fontName;
        if (fn && typeof fn === 'object' && fn.family) _truncFontSet.add(JSON.stringify(fn));
      } catch(_) {}
    }
    await Promise.allSettled(Array.from(_truncFontSet).map(function(f) { return figma.loadFontAsync(JSON.parse(f)); }));
    for (const t of allText) {
      try {
        let isInCard = false;
        let p = t.parent;
        let depth = 0;
        while (p && depth < 6) {
          if (p.type === 'FRAME' && isProductList(p)) { isInCard = true; break; }
          p = p.parent;
          depth++;
        }
        if (!isInCard) continue;

        const chars = t.characters || '';
        const isPrice = PRICE_PATTERNS.some(pat => chars.includes(pat) || t.name.includes(pat));
        if (isPrice) continue;

        const fs = typeof t.fontSize === 'number' ? t.fontSize : 14;
        if (fs >= 12 && fs <= 18 && chars.length > 5) {
          t.textTruncation = 'ENDING';
          t.maxLines = READABILITY.PRODUCT_NAME_MAX_LINES; // 1줄
          // FILL 너비 텍스트는 텍스트 자동 리사이즈를 HEIGHT로 설정 (1줄 고정)
          try { if (t.layoutSizingHorizontal === 'FILL') t.textAutoResize = 'HEIGHT'; } catch(_) {}
        }
      } catch (_) {}
    }
  } catch (_) {}
}

// ─── 선택 프레임 정보 ────────────────────────────────────────────────────────
function sendSelectionInfo() {
  try {
    const frames = figma.currentPage.selection.filter(n => n.type === 'FRAME');
    figma.ui.postMessage({
      type: 'selection',
      count: frames.length,
      names: frames.map(f => f.name),
      sizes: frames.map(f => ({ w: Math.round(f.width), h: Math.round(f.height) })),
    });
  } catch (_) {}
}
figma.on('selectionchange', sendSelectionInfo);
sendSelectionInfo();

// ─── 메시지 핸들러 ───────────────────────────────────────────────────────────
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'close') { figma.closePlugin(); return; }
  if (msg.type !== 'convert') return;

  const frames = figma.currentPage.selection.filter(n => n.type === 'FRAME');
  if (frames.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '변환할 프레임을 선택해주세요.' });
    return;
  }

  const targets = msg.targets; // [{ w, h, label }]
  const { layoutMode } = msg;
  const navMode = msg.navMode || 'replace'; // 'replace' | 'keep'
  const opts = { scaleFont: !!msg.scaleFont };
  const warnings = [];
  let converted = 0;
  const createdNodes = [];

  for (const frame of frames) {
    // 원본 바로 오른쪽 200px에서 시작, 순서대로 오른쪽으로 쌓기
    let nextX = frame.x + frame.width + 200;
    const startY = frame.y;

    for (const target of targets) {
      const targetWidth  = Number(target.w);
      const targetHeight = Number(target.h);
      const label = target.label;
      const beforeCount = figma.currentPage.children.length;

      try {
        if (layoutMode === 'responsive') {
          await convertResponsive(frame, targetWidth, targetHeight, label, warnings, nextX, startY, navMode, opts);
        } else {
          await convertFixed(frame, targetWidth, targetHeight, label, nextX, startY, opts);
        }
        // 새로 생성된 노드 수집 (가장 마지막에 추가된 것)
        const afterChildren = figma.currentPage.children;
        for (let i = beforeCount; i < afterChildren.length; i++) {
          createdNodes.push(afterChildren[i]);
        }
        nextX += targetWidth + 200;
        converted++;
      } catch (err) {
        figma.ui.postMessage({
          type: 'error',
          message: `오류 (${label}): ${err.message}\n${err.stack || ''}`,
        });
      }
    }
  }

  // 변환 완료 후 결과 프레임으로 뷰포트 이동
  if (createdNodes.length > 0) {
    figma.viewport.scrollAndZoomIntoView(createdNodes);
  }

  if (converted > 0) {
    let successMsg = `${converted}개 변환 완료!`;
    if (warnings.length > 0) {
      successMsg += `\n\n⚠️ 수동 검토 필요 (${warnings.length}건):\n` + warnings.join('\n');
    }
    figma.ui.postMessage({ type: 'success', message: successMsg });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE 모드 — Safe
// ═══════════════════════════════════════════════════════════════════════════════
async function convertResponsive(frame, targetWidth, targetHeight, label, warnings, startX, startY, navMode, opts) {
  navMode = navMode || 'replace'; // 'replace': 웹 Nav 교체 | 'keep': 모바일 Nav 유지
  // PC(≥1024px)는 keep 모드여도 웹 Nav 강제 적용
  if (targetWidth >= 1024) navMode = 'replace';
  const navBP      = getNavBreakpoint(targetWidth);
  const padding    = getHorizontalPadding(targetWidth);
  const innerWidth = targetWidth - padding * 2;

  // 1. 클론
  const content = frame.clone();
  content.name = `${frame.name} — ${label}`;
  content.x = (startX !== undefined) ? startX : frame.x + frame.width + 200;
  content.y = (startY !== undefined) ? startY : frame.y;

  // 2. 모바일 전용 레이어 제거 (상태바, 홈인디케이터 등)
  // keep 모드: Status Bar + Home Indicator는 원본 그대로 유지
  const hasHomeIndicator = content.findAll(n =>
    ['Home Indicator', 'HomeIndicator', 'home indicator',
     '🏠 Home Indicator', '🏠Home Indicator',
     '홈 인디케이터', '홈인디케이터'].some(p => n.name.includes(p))
  ).length > 0;
  if (navMode === 'replace') {
    const toRemove = content.findAll(n => isMobileOnly(n));
    for (const n of toRemove) { try { n.remove(); } catch (_) {} }
  }

  // 3. 네비게이션 처리 — navMode에 따라 분기
  // replace 모드에서 유지된 page-specific Top Nav ID 추적
  const keptTopNavIds = new Set();

  if (navMode === 'replace') {
    // replace: 기존 Top Navigation + 하단 탭바 모두 제거 → 웹 Global Nav로 교체
    // 단, 타이틀/프로그레스바가 있는 page-specific Top Nav는 status bar만 제거하고 유지
    const mobileNavs = content.findAll(n =>
      TOP_NAV_PATTERNS.some(p => n.name.includes(p))
      || n.name.includes('Navigator') || n.name.includes('TabBar') || n.name.includes('BottomNav')
    );
    const mobileNavRoots = mobileNavs.filter(n => !mobileNavs.some(m => m !== n && isAncestor(m, n)));
    for (const n of mobileNavRoots) {
      // page-specific Top Nav 판별: 프로그레스바(같은 y에 2개 이상 사각형, height≤15)만 기준
      // TEXT는 인스턴스 내부까지 탐색되므로 제외
      const rects = n.findAll(r => {
        if (!((r.type === 'RECTANGLE' || r.type === 'ROUNDED_RECTANGLE') && !r.hidden && r.height <= 15)) return false;
        // INSTANCE 내부 요소 제외 — Status Bar 배터리 사각형 오탐 방지
        let p = r.parent;
        while (p && p !== n) {
          if (p.type === 'INSTANCE') return false;
          p = p.parent;
        }
        return true;
      });
      const hasProgressBar = rects.length >= 2 && (() => {
        const ys = rects.map(r => Math.round(r.absoluteTransform ? r.absoluteTransform[1][2] : r.y));
        return new Set(ys).size < ys.length; // 같은 y에 2개 이상
      })();

      if (hasProgressBar) {
        // page-specific: status bar 서브프레임만 제거, 나머지 유지
        const statusBars = n.findAll(m => {
          if (m.type !== 'FRAME') return false;
          if (m.height > 60) return false;
          if (m.y !== 0) return false;
          // 실질적인 콘텐츠(텍스트, 복잡한 children) 없는 빈 프레임
          const visibleKids = m.children ? m.children.filter(c => !c.hidden && c.type !== 'VECTOR') : [];
          return visibleKids.length === 0;
        });
        for (const sb of statusBars) { try { sb.remove(); } catch(_) {} }
        keptTopNavIds.add(n.id);
      } else {
        try { n.remove(); } catch (_) {}
      }
    }
  } else {
    // keep: 하단 탭바만 제거, Top Navigation 유지
    const bottomNavs = content.findAll(n =>
      (n.name.includes('Navigator') || n.name.includes('TabBar') || n.name.includes('BottomNav'))
      && !TOP_NAV_PATTERNS.some(p => n.name.includes(p)) // Top Navigation 제외
    );
    const bottomNavRoots = bottomNavs.filter(n => !bottomNavs.some(m => m !== n && isAncestor(m, n)));
    for (const n of bottomNavRoots) { try { n.remove(); } catch (_) {} }
  }

  // 4. 기존 🪣 Navigation 제거 (중복 방지)
  const existingNavs = content.findAll(n => isGlobalNav(n));
  for (const n of existingNavs) { try { n.remove(); } catch (_) {} }

  const useMaxWidth = targetWidth >= 1256; // ≥1256px: 콘텐츠 최대 1136px

  // 5. 루트 프레임 AL 전환 + targetWidth 고정, 높이 HUG
  switchToVerticalAL(content);
  content.primaryAxisSizingMode = 'AUTO';   // 높이 HUG
  content.counterAxisSizingMode = 'FIXED';
  // useMaxWidth: content padding=0, CENTER 정렬 + child maxWidth=1136
  // → Figma가 (frameWidth-1136)/2 자동 배분. 1440px기준 152px/side, 1256px기준 60px/side(최소)
  content.counterAxisAlignItems = useMaxWidth ? 'CENTER' : 'MIN';
  content.paddingLeft  = 0;
  content.paddingRight = 0;
  content.paddingTop   = 0;
  content.paddingBottom = 0;
  content.resize(targetWidth, content.height);

  if (navMode === 'replace') {
    // 6. 🪣 Navigation 추가 (전체 너비)
    try {
      const newComp = await figma.importComponentByKeyAsync(NAV_COMPONENT_KEYS[navBP]);
      const navInst = newComp.createInstance();
      content.insertChild(0, navInst);
      navInst.resize(targetWidth, navInst.height);
      try { navInst.layoutSizingHorizontal = 'FILL'; navInst.layoutSizingVertical = 'FIXED'; } catch (_) {}
    } catch (e) {
      warnings.push(`Navigation 컴포넌트 추가 실패 (${navBP}). 수동 추가 필요.`);
    }

    // 7. 🗂️ 상단 스테이터스바 추가 (nav 위) — Tablet만 추가, PC는 status bar 없음
    if (targetWidth < 1024) {
      const sbKey = STATUS_BAR_COMPONENT_KEYS.pc;
      try {
        const sbComp = await figma.importComponentByKeyAsync(sbKey);
        const sbInst = sbComp.createInstance();
        content.insertChild(0, sbInst);
        sbInst.resize(targetWidth, sbInst.height);
        try { sbInst.layoutSizingHorizontal = 'FILL'; sbInst.layoutSizingVertical = 'FIXED'; } catch (_) {}
      } catch (e) {
        warnings.push(`Status bar 컴포넌트 추가 실패. 수동 추가 필요.`);
      }
    }
  }
  // keep 모드: 웹 Nav/StatusBar 추가 안 함 — 모바일 Top Navigation 그대로 유지

  // 7. 직계 자식 처리
  const parentHasAL = content.layoutMode !== 'NONE';
  for (const child of content.children) {
    if (isGlobalNav(child)) continue;

    if (isSkippable(child)) {
      if (targetWidth >= 1024 && isMobileOnlyFAB(child)) {
        // PC: 스크롤 위로/공유하기 등 모바일 전용 FAB 제거
        try { child.remove(); } catch (_) {}
        continue;
      }
      // Tablet/Mobile 또는 PC의 상담하기 등: 절대값 위치 그대로 유지
      try { child.layoutSizingHorizontal = 'FIXED'; child.layoutSizingVertical = 'FIXED'; } catch (_) {}
      continue;
    }

    if (looksLikeGrid(child)) {
      warnings.push(`"${child.name}" — 그리드 구조 감지. 열 수 및 너비를 수동 확인하세요.`);
    }

    // CTA 섹션 판별: 루프 스코프에서 선언 (FRAME/INSTANCE 공통 사용)
    const isCTASection = ['CTA', 'cta', 'Button_Area', '버튼영역'].some(p => child.name.includes(p));

    // keep 모드: Top Nav 이름 포함 요소(FRAME/INSTANCE 모두)는 width만 resize, 내부 보존
    if (navMode === 'keep' && TOP_NAV_PATTERNS.some(p => child.name.includes(p))) {
      // useMaxWidth: wrapper inner(targetWidth-120) 기준, maxWidth 없음(wrapper에서 FILL 처리)
      const effectiveW = useMaxWidth ? (targetWidth - padding * 2) : targetWidth;
      try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
      if (child.type === 'FRAME') cascadeResizeWidth(child, effectiveW);
      else { try { child.resize(effectiveW, child.height); } catch(_) {} }
      fixImageFills(child);

      // keep 모드: 타이틀/헤더 영역 L/R padding 보호 + height HUG 보정
      if (child.type === 'FRAME') {
        // L/R padding: 텍스트 포함 프레임은 spacing scale에서 건드리지 않도록 마킹
        const keepTitleFrames = child.findAll(function(n) {
          return n.type === 'FRAME' && n.layoutMode !== 'NONE' &&
            n.findAll(function(c) { return c.type === 'TEXT' && !c.hidden; }).length > 0;
        });
        for (var _kti = 0; _kti < keepTitleFrames.length; _kti++) {
          try { keepTitleFrames[_kti].setPluginData('omc_bp_padLR', '1'); } catch(_) {}
        }
        // HUG 보정: FIXED/FILL height인 텍스트 포함 프레임 → HUG
        const keepHugTargets = child.findAll(function(n) {
          return n.type === 'FRAME' && n.layoutMode !== 'NONE' &&
            n.layoutSizingVertical !== 'HUG' &&
            n.findAll(function(c) { return c.type === 'TEXT' && !c.hidden; }).length > 0 &&
            !n.name.includes('Status Bar') && !n.name.includes('TopNavigation');
        });
        for (var _khi = 0; _khi < keepHugTargets.length; _khi++) {
          try { keepHugTargets[_khi].counterAxisSizingMode = 'AUTO'; } catch(_) {}
          try { keepHugTargets[_khi].layoutSizingVertical = 'HUG'; } catch(_) {}
        }
      }

      continue;
    }

    if (child.type === 'FRAME') {
      // replace 모드에서 page-specific으로 유지된 Top Navigation
      const isKeptTopNav = keptTopNavIds.has(child.id);
      if (isKeptTopNav) {
        // absolute(ignore auto layout) 상태일 수 있으므로 명시 리셋
        try { child.layoutPositioning = 'AUTO'; } catch (_) {}
        // useMaxWidth: wrapper(60px 패딩, inner=targetWidth-120)에 들어가므로 wrapper inner 기준으로 cascade
        const effectiveW = useMaxWidth ? (targetWidth - padding * 2) : targetWidth;
        cascadeResizeWidth(child, effectiveW);
        try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
        // maxWidth 설정 안 함 → wrapper로 이동 후 FILL 대응
        fixImageFills(child);

        // replace 모드: 프로그레스바/타이틀 마진 보정 (Left Icons/닫기버튼 유지)
        if (navMode === 'replace') {
          // TopNavigation Section: 프로그레스바 마진 보정
          const navSections = child.findAll(n =>
            n.type === 'FRAME' && n.name.includes('TopNavigation Section')
          );
          for (const sec of navSections) {
            if (sec.layoutMode !== 'NONE') {
              // useMaxWidth: sec 자체는 maxWidth=1136 컨테이너 안 → padding 불필요
              const secPad = useMaxWidth ? 0 : padding;
              try { sec.paddingLeft = secPad; sec.paddingRight = secPad; } catch(_) {}
              try { sec.setPluginData('omc_bp_padLR', '1'); } catch(_) {}
              for (const kid of sec.children) {
                if (kid.hidden) continue;
                const isNavSideGroup = kid.name.includes('Left Icons') || kid.name.includes('Right Icons');
                if (!isNavSideGroup) {
                  try { kid.layoutSizingHorizontal = 'FILL'; } catch(_) {}
                }
              }
            } else {
              for (const kid of sec.children) {
                if (kid.hidden) continue;
                if (!useMaxWidth) {
                  try { kid.x = padding; } catch(_) {}
                  try { kid.resize(Math.max(1, effectiveW - padding * 2), kid.height); } catch(_) {}
                }
              }
            }
          }

          // 타이틀 영역 (텍스트 포함 프레임) 좌측 마진 보정
          // useMaxWidth: CENTER+maxWidth로 마진 확보 → 별도 padding 불필요
          if (!useMaxWidth) {
            const titleContainers = child.findAll(n =>
              n.type === 'FRAME' && n.layoutMode !== 'NONE' &&
              n.findAll(c => c.type === 'TEXT' && !c.hidden).length > 0
            );
            for (const tf of titleContainers) {
              try {
                if ((tf.paddingLeft || 0) < padding) {
                  tf.paddingLeft = padding;
                  tf.paddingRight = padding;
                  try { tf.setPluginData('omc_bp_padLR', '1'); } catch(_) {}
                }
              } catch(_) {}
            }
          }
        }

        // navMode 무관: 타이틀/헤더 영역의 height HUG 보정
        // FIXED 또는 FILL로 고정된 텍스트 포함 프레임 → HUG로 변환
        {
          const hugTargets = child.findAll(n =>
            n.type === 'FRAME' && n.layoutMode !== 'NONE' &&
            n.layoutSizingVertical !== 'HUG' &&
            n.findAll(c => c.type === 'TEXT' && !c.hidden).length > 0 &&
            !n.name.includes('Status Bar') && !n.name.includes('TopNavigation')
          );
          for (const hf of hugTargets) {
            try { hf.counterAxisSizingMode = 'AUTO'; } catch(_) {}
            try { hf.layoutSizingVertical = 'HUG'; } catch(_) {}
          }
        }

        continue;
      }

      // switchToVerticalAL 전에 유효 패딩 캡처
      // (명시적 paddingLeft 또는 자식 x 오프셋으로 암묵적 마진 모두 감지)
      const { left: origPadL, right: origPadR } = getEffectivePadding(child);

      switchToVerticalAL(child);

      // 원본에 좌우 패딩/마진이 있었던 섹션만 breakpoint 패딩으로 업데이트
      // keep 모드: 원본 마진 그대로 유지
      if (navMode !== 'keep') {
        if (useMaxWidth) {
          if (isCTASection) {
            // CTA: full-width + 60px 패딩 (내부 콘텐츠는 processInnerChildren에서 maxWidth=1136)
            child.paddingLeft  = padding;  // 60px
            child.paddingRight = padding;
            try { child.counterAxisAlignItems = 'CENTER'; } catch (_) {}
            try { child.setPluginData('omc_bp_padLR', '1'); } catch (_) {}
          } else {
            // 일반 섹션: padding 0 + maxWidth=1136으로 content CENTER 정렬에서 자동 중앙 배치
            child.paddingLeft  = 0;
            child.paddingRight = 0;
          }
        } else if (origPadL > 0 || origPadR > 0) {
          child.paddingLeft  = padding;  // 태블릿 40px / PC 60px
          child.paddingRight = padding;
          try { child.setPluginData('omc_bp_padLR', '1'); } catch (_) {}
        }
      }

      child.paddingTop    = 0;
      child.paddingBottom = 0;
      child.primaryAxisSizingMode = 'AUTO';  // 높이 HUG
      child.counterAxisSizingMode = 'AUTO';
    }

    // INSTANCE 직계 자식 패딩 업데이트
    // keep 모드: 원본 마진 그대로 유지
    if (child.type === 'INSTANCE' && navMode !== 'keep') {
      try {
        const instPadL = child.paddingLeft || 0;
        const instPadR = child.paddingRight || 0;
        if (instPadL > 0 || instPadR > 0) {
          // useMaxWidth: child 자체 padding 0 (CENTER+maxWidth로 마진 확보)
          // 일반: breakpoint padding 적용
          child.paddingLeft  = useMaxWidth ? 0 : padding;
          child.paddingRight = useMaxWidth ? 0 : padding;
          if (!useMaxWidth) { try { child.setPluginData('omc_bp_padLR', '1'); } catch (_) {} }
        }
      } catch (_) {}
    }

    // FILL로 늘리고, INSTANCE는 maxWidth=1136 적용
    // FRAME 섹션은 _content_sections_ wrapper에 묶어서 60px 마진 확보 → maxWidth 불필요
    // Status Bar / Home Indicator는 full-width
    try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
    if (useMaxWidth && !isMobileOnly(child) && child.type !== 'FRAME') {
      try { child.maxWidth = 1136; } catch (_) {}
    }

    if (child.type === 'FRAME') {
      // 실제 적용된 패딩 기반으로 effectiveInner 계산
      const appliedPadL = child.paddingLeft || 0;
      const appliedPadR = child.paddingRight || 0;
      const effectiveInner = useMaxWidth ? 1136 : targetWidth - appliedPadL - appliedPadR;
      processInnerChildren(child, effectiveInner, targetWidth, warnings, 0, navMode, useMaxWidth);
    }

    // autolayout 부모에서 처리 도중 ABSOLUTE(ignore auto layout)가 될 수 있으므로 명시 리셋
    // isSkippable(FAB 등)은 위에서 continue → 여기 도달 안 함 → 의도적 ABSOLUTE 보호됨
    if (parentHasAL) {
      try { child.layoutPositioning = 'AUTO'; } catch(_) {}
    }

    fixImageFills(child);
  }

  // ── useMaxWidth 후처리: 섹션 내부 sub-FRAME의 원본 모바일 좌우 padding 클리어 ──
  // 대상: 직계 자식 제외한 FRAME만 (INSTANCE는 UI 컴포넌트 내부 → 건드리지 않음)
  // 웹 Nav 내부 요소도 제외 (Nav 레이아웃 보호)
  if (useMaxWidth) {
    const allDesc = content.findAll(n => n.type === 'FRAME');
    for (const n of allDesc) {
      if (isMobileOnly(n)) continue;              // StatusBar/HomeIndicator 제외
      if (isGlobalNav(n)) continue;               // 웹 Nav 루트 제외
      if (n.name === '_auto_spacer') continue;    // spacer 제외
      if (n.parent === content) continue;         // 직계 자식(섹션) 제외
      // 웹 Nav 내부 요소 제외 (ancestor 체크)
      let inNav = false;
      let anc = n.parent;
      while (anc && anc !== content) {
        if (isGlobalNav(anc)) { inNav = true; break; }
        anc = anc.parent;
      }
      if (inNav) continue;
      try { n.paddingLeft  = 0; } catch (_) {}
      try { n.paddingRight = 0; } catch (_) {}
    }
  }

  // ── useMaxWidth: 컨텐츠 섹션들을 _content_sections_ wrapper로 묶기 ──
  // CTA / StatusBar / GlobalNav 제외한 FRAME 섹션을 60px 패딩 wrapper에 통합
  if (useMaxWidth) {
    const CTA_WRAP_PATTERNS = ['CTA', 'cta', 'Button_Area', '버튼영역'];
    const toWrap = [];
    let wrapInsertIdx = 0; // wrapper 삽입 위치 (마지막 Nav/StatusBar 다음)

    for (let i = 0; i < content.children.length; i++) {
      const c = content.children[i];
      if (isMobileOnly(c) || isGlobalNav(c)) { wrapInsertIdx = i + 1; continue; }
      if (c.name === '_auto_spacer') continue;
      if (CTA_WRAP_PATTERNS.some(p => c.name.includes(p))) continue;
      if (isSkippable(c)) continue;
      if (c.type === 'FRAME' || c.type === 'INSTANCE') toWrap.push(c);
      // FRAME + INSTANCE 모두 wrapper로 이동 (maxWidth=1136 적용)
    }

    if (toWrap.length > 0) {
      const wrapper = figma.createFrame();
      wrapper.name = '_content_sections_';
      wrapper.fills = [];
      wrapper.clipsContent = false;
      wrapper.layoutMode = 'VERTICAL';
      wrapper.primaryAxisAlignItems  = 'MIN';
      wrapper.counterAxisAlignItems  = 'CENTER';
      wrapper.itemSpacing   = 0;
      wrapper.paddingLeft   = padding;  // 60px
      wrapper.paddingRight  = padding;
      wrapper.paddingTop    = 0;
      wrapper.paddingBottom = 0;
      wrapper.primaryAxisSizingMode = 'AUTO';   // 높이 HUG
      wrapper.counterAxisSizingMode = 'FIXED';
      wrapper.resize(targetWidth, 100);         // 임시 높이 (HUG 후 자동 조정)

      content.insertChild(wrapInsertIdx, wrapper);
      try { wrapper.layoutSizingHorizontal = 'FILL'; } catch (_) {}

      // 섹션들을 wrapper로 이동 + FILL + maxWidth=1136
      for (const sec of toWrap) {
        wrapper.appendChild(sec);
        try { sec.layoutSizingHorizontal = 'FILL'; } catch (_) {}
        // wrapper CENTER + maxWidth=1136 → 1440px 기준 (1440-120)/2-1136/2=92px 양쪽 여백
        try { sec.maxWidth = 1136; } catch (_) {}
      }
    }
  }

  // ── 가독성 보정 패스 (폰트/간격 스텝업 + 카드 텍스트 truncation) ──
  await applyReadabilityPass(content, targetWidth, opts, frame);

  // ── 최소 높이 보장 + CTA 자동 간격 (content ↔ CTA 사이 FILL spacer) ──
  const CTA_CHILD_PATTERNS = ['CTA', 'cta', 'Button_Area', '버튼영역'];
  let ctaChild = null;
  for (let i = content.children.length - 1; i >= 0; i--) {
    const c = content.children[i];
    if (CTA_CHILD_PATTERNS.some(p => c.name.includes(p))) { ctaChild = c; break; }
  }

  if (ctaChild) {
    // CTA 바로 앞에 FILL spacer 삽입
    const spacer = figma.createFrame();
    spacer.name = '_auto_spacer';
    spacer.fills = [];
    spacer.resize(1, 1);
    let ctaIdx = -1;
    for (let i = 0; i < content.children.length; i++) {
      if (content.children[i].id === ctaChild.id) { ctaIdx = i; break; }
    }
    content.insertChild(ctaIdx, spacer);
    try { spacer.layoutSizingHorizontal = 'FILL'; } catch (_) {}
  }

  // 하단 여백: CTA 없으면 paddingBottom, CTA 있으면 CTA 자체에 하단 여백
  // keep 모드 + 인디케이터 없음: 20px 추가 / keep 모드 + 인디케이터 있음: 패딩 불필요
  const bottomPad = navMode === 'keep' ? (hasHomeIndicator ? 0 : 20) : 20;
  if (bottomPad > 0) {
    if (!ctaChild) {
      content.paddingBottom = bottomPad;
    } else {
      try { ctaChild.paddingBottom = (ctaChild.paddingBottom || 0) + bottomPad; } catch(_) {}
    }
  }

  // parent를 FIXED 높이로 전환 후 spacer FILL 적용 (FILL vertical은 parent FIXED 후 효과)
  const minH = Math.max(content.height, targetHeight);
  content.primaryAxisSizingMode = 'FIXED';
  content.resize(targetWidth, minH);

  if (ctaChild) {
    const spacerNode = content.children.find(c => c.name === '_auto_spacer');
    if (spacerNode) {
      try { spacerNode.layoutSizingVertical = 'FILL'; } catch (_) {}
    }
  }
}

// 내부 자식 재귀 처리: FILL + 상품 그리드 자동 변환 (최대 3단계)
function processInnerChildren(parentFrame, containerWidth, targetWidth, warnings, depth, navMode, useMaxWidth) {
  if (!parentFrame.children || (depth || 0) > 5) return;

  const parentHasAL = parentFrame.layoutMode !== 'NONE';
  const bpPadding = getHorizontalPadding(targetWidth); // breakpoint별 좌우 패딩

  for (const child of [...parentFrame.children]) {
    if (isSkippable(child)) continue;

    // 상품 리스트 감지 → WRAP 그리드 변환 (재귀 불필요)
    if (isProductList(child)) {
      // useMaxWidth=true: 외부 컨테이너가 이미 max-width 기준 패딩 처리 → 제품 리스트 자체 패딩 제거
      // useMaxWidth=false: 원본 패딩이 있으면 breakpoint 패딩으로 교체
      const origPadL = child.paddingLeft || 0;
      const origPadR = child.paddingRight || 0;
      let gridPadL = 0;
      let gridPadR = 0;
      if (navMode !== 'keep' && !useMaxWidth && (origPadL > 0 || origPadR > 0)) {
        gridPadL = bpPadding;
        gridPadR = bpPadding;
      } else if (navMode === 'keep') {
        // keep 모드: 원본 마진 그대로 유지
        gridPadL = origPadL;
        gridPadR = origPadR;
      }
      child.paddingLeft  = gridPadL;
      child.paddingRight = gridPadR;
      // 외부 마진 보호 마커 — spacing scale에서 이 프레임의 패딩/gap 건드리지 않음
      try { child.setPluginData('omc_bp_padLR', '1'); } catch(_) {}
      // 패딩 적용 후 남은 inner width로 그리드 계산
      const gridInnerWidth = containerWidth - gridPadL - gridPadR;
      convertToProductGrid(child, gridInnerWidth, targetWidth);
      continue;
    }

    if (child.type === 'FRAME') {
      const isHorizNone = child.layoutMode === 'NONE' && looksLikeHorizontalNone(child);
      const isGridNone  = child.layoutMode === 'NONE' && looksLikeNoneGrid(child);
      const isProductRows = isCardRowContainer(child);

      // 카드 행 구조 감지 → WRAP 그리드 재구조화
      if (isProductRows) {
        if (parentHasAL) {
          try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
        } else {
          try { child.resize(containerWidth, child.height); } catch (_) {}
        }
        try { child.setPluginData('omc_bp_padLR', '1'); } catch (_) {}
        const innerW = containerWidth - (child.paddingLeft || 0) - (child.paddingRight || 0);
        convertCardRowsToGrid(child, innerW, targetWidth);
        continue;
      }

      if (isHorizNone) {
        // 수평 NONE 프레임 처리
        const _horizVis = child.children.filter(c => !c.hidden);
        // 아이템 너비 균일 여부 (±20% 이내)
        const _allSameW = _horizVis.length >= 2 && (function() {
          const refW = _horizVis[0].width;
          return _horizVis.every(c => Math.abs(c.width - refW) <= refW * 0.2);
        })();
        // 균일 너비 아이템 (아이콘/메뉴 타일) → HORIZONTAL AL FILL 그리드로 변환
        // 이렇게 하면 overflow 캐러셀이든 같은 x에 겹친 슬라이더든 모두 정렬됨
        if (_allSameW && _horizVis[0].width >= 60) {
          if (parentHasAL) {
            try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
          } else {
            try { child.resize(containerWidth, child.height); } catch (_) {}
          }
          const _sorted = [..._horizVis].sort((a, b) => a.x - b.x);
          const _lm = Math.max(0, Math.round(_sorted[0].x));
          const _rm = Math.max(0, Math.round((child.width || containerWidth) - (_sorted[_sorted.length-1].x + _sorted[_sorted.length-1].width)));
          try {
            child.layoutMode            = 'HORIZONTAL';
            child.primaryAxisSizingMode = 'FIXED';
            child.counterAxisSizingMode = 'AUTO';
            child.primaryAxisAlignItems = 'MIN';
            child.counterAxisAlignItems = 'CENTER';
            child.itemSpacing           = 0;
            child.paddingLeft           = _lm;
            child.paddingRight          = _rm;
            child.paddingTop            = 0;
            child.paddingBottom         = 0;
            for (let _si = 0; _si < _sorted.length; _si++) {
              try { child.insertChild(_si, _sorted[_si]); } catch(_) {}
            }
            for (const _item of _sorted) {
              try { _item.layoutSizingHorizontal = 'FILL'; } catch(_) {}
            }
          } catch(_) {}
          continue; // 내부 재귀 스킵
        }
        // 캐러셀(overflow, 크기 다양) → 비례 스케일 또는 컨테이너만 확장
        if (looksLikeCarousel(child)) {
          const origCarouselW = child.width;
          if (parentHasAL) {
            try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
          } else {
            try { child.resize(containerWidth, child.height); } catch (_) {}
          }
          scaleNoneCarouselItems(child, containerWidth, origCarouselW, targetWidth);
          continue;
        }

        // 소형 요소(아이콘/배지 등) STRETCH 제약 해제 — FILL 적용 전에 처리해야 효과적
        for (const kid of child.children) {
          if (!kid.hidden && kid.width < 60 && kid.height < 60) {
            try {
              const vc = kid.constraints ? kid.constraints.vertical : 'MIN';
              kid.constraints = { horizontal: 'MIN', vertical: vc };
            } catch(_) {}
          }
        }

        const visKids = child.children.filter(c => !c.hidden && !isSkippable(c));
        const origW = child.width || 1;
        // 아이템들의 실제 x-span (겹침 구조도 올바르게 판단)
        const _kidXStart = visKids.length ? Math.min(...visKids.map(c => c.x)) : 0;
        const _kidXEnd   = visKids.length ? Math.max(...visKids.map(c => c.x + c.width)) : 0;
        const _kidXSpan  = _kidXEnd - _kidXStart;
        // 아이콘 그리드 행 감지: 2개 이상, 아이콘급(60px 이상) 아이템들이 컨테이너 안에 배치된 경우
        // (overflow 캐러셀은 looksLikeCarousel에서 이미 분기됨 → 여기서는 non-overflow만)
        const isGridRow = visKids.length >= 2
          && _kidXSpan <= origW * 1.05   // 아이템들이 컨테이너 안에 있음
          && visKids.every(c => c.width >= 60);

        if (parentHasAL) {
          try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
        } else {
          try { child.resize(containerWidth, child.height); } catch (_) {}
        }

        if (isGridRow && origW > 0) {
          // 숏컷/메뉴 그리드 행: NONE → HORIZONTAL AL 변환 후 각 item FILL
          const sorted = [...visKids].sort((a, b) => a.x - b.x);
          const leftMargin  = Math.round(sorted[0].x);
          const rightMargin = Math.max(0, Math.round(origW - _kidXEnd));
          try {
            child.layoutMode             = 'HORIZONTAL';
            child.primaryAxisSizingMode  = 'FIXED';
            child.counterAxisSizingMode  = 'AUTO';
            child.primaryAxisAlignItems  = 'MIN';
            child.counterAxisAlignItems  = 'CENTER';
            child.itemSpacing            = 0;
            child.paddingLeft            = leftMargin;
            child.paddingRight           = rightMargin;
            child.paddingTop             = 0;
            child.paddingBottom          = 0;
            for (let i = 0; i < sorted.length; i++) {
              try { child.insertChild(i, sorted[i]); } catch(_) {}
            }
            for (const item of sorted) {
              try { item.layoutSizingHorizontal = 'FILL'; } catch(_) {}
            }
          } catch(_) {}
        }
        // 내부 재귀 없이 컨테이너만 조정

      } else if (isGridNone) {
        // 다단 그리드 (퀵필터 등): AL 전환 없이 크기만 맞춤 (내부 2열 구조 유지)
        child.primaryAxisSizingMode = 'AUTO';
        child.counterAxisSizingMode = 'AUTO';
        if (parentHasAL) {
          try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
        } else {
          try { child.resize(containerWidth, child.height); } catch (_) {}
        }
        // 내부 재귀 스킵 — 다단 그리드 내부 구조 그대로 유지

      } else if (child.layoutMode === 'HORIZONTAL' && looksLikeHorizontalAlCarousel(child)) {
        // HORIZONTAL AL 탭/필터 칩 행: 컨테이너만 확장, 내부 아이템 건드리지 않음
        if (parentHasAL) {
          try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
        } else {
          try { child.resize(containerWidth, child.height); } catch (_) {}
        }
        // 실제 탭 아이템 행 탐색 (1→1→N wrapper 패턴 대응, 최대 3단계)
        var _tabPathToFill = [];
        var _actualTabRow = findActualTabRow(child, 3, _tabPathToFill);
        // 중간 wrapper 노드들 FILL 처리 (AUTO가 잘못 설정되는 것 방지)
        for (var _pi = 0; _pi < _tabPathToFill.length; _pi++) {
          try { _tabPathToFill[_pi].layoutSizingHorizontal = 'FILL'; } catch (_) {}
        }
        if (_actualTabRow) {
          // 실제 탭 행에 FILL + HUG 처리 적용
          try { _actualTabRow.layoutSizingHorizontal = 'FILL'; } catch (_) {}
          try { _actualTabRow.itemSpacing = Math.max(_actualTabRow.itemSpacing || 0, 8); } catch (_) {}
          fixCarouselTextHug(_actualTabRow, true); // isRoot=true: 탭 행 자체는 건드리지 않고 아이템만
        } else {
          // child 자체에 바로 2+ 탭 아이템이 있는 경우
          try { child.itemSpacing = Math.max(child.itemSpacing || 0, 8); } catch (_) {}
          fixCarouselTextHug(child, true);
        }
        // 재귀 스킵 (내부 구조 그대로 유지)

      } else if (child.layoutMode === 'HORIZONTAL' && looksLikeAlCarouselOverflow(child)) {
        // HORIZONTAL AL overflow 프레임
        // 아이템이 모두 같은 너비(±20%)면 → 균등 FILL 그리드로 처리 (숏컷/메뉴 행)
        // 그 외 → 비례 스케일 (실제 캐러셀)
        var _alVis = child.children.filter(function(c) { return !c.hidden; });
        var _alAllSameW = _alVis.length >= 2 && (function() {
          var refW = _alVis[0].width;
          return _alVis.every(function(c) { return Math.abs(c.width - refW) <= refW * 0.2; });
        })();
        if (parentHasAL) {
          try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
        } else {
          try { child.resize(containerWidth, child.height); } catch (_) {}
        }
        if (_alAllSameW && _alVis[0].width >= 60) {
          // 균등 FILL 그리드: 각 아이템을 FILL로 설정
          try { child.itemSpacing = 0; } catch(_) {}
          for (var _gi = 0; _gi < _alVis.length; _gi++) {
            try { _alVis[_gi].layoutSizingHorizontal = 'FILL'; } catch(_) {}
          }
        } else {
          // 실제 캐러셀: 비례 스케일
          var origAlCarouselW = child.width;
          scaleAlCarouselItems(child, containerWidth, origAlCarouselW, targetWidth);
        }
        // 재귀 스킵 (캐러셀/그리드 내부 구조 그대로 유지)

      } else {
        // FRAME: VERTICAL AL 전환 + FILL/resize (간격 보존)
        // switchToVerticalAL 전에 유효 패딩 캡처 (x 오프셋 기반 암묵적 마진 포함)
        const { left: effPadL0, right: effPadR0 } = getEffectivePadding(child);
        // HORIZONTAL 프레임이 컴팩트(컨테이너의 70% 미만) → FILL 강제 적용 안 함
        const origChildWidth = child.width;
        const isCompactHorizontal = child.layoutMode === 'HORIZONTAL'
          && origChildWidth < containerWidth * 0.7
          && origChildWidth < 250;  // 절대값 250px 미만인 경우만 compact (아이콘/단순 레이블 그룹)
        switchToVerticalAL(child);
        child.primaryAxisSizingMode = 'AUTO';  // 높이 HUG
        child.counterAxisSizingMode = 'AUTO';
        // switchToVerticalAL이 첫 자식의 y값을 paddingTop으로 설정 → 큰 값만 제거
        // 24px 이하의 정상 패딩(py-[6px] 등)은 보존, 모바일 헤더 오프셋(44-98px)만 클리어
        if ((child.paddingTop    || 0) > 24) child.paddingTop    = 0;
        if ((child.paddingBottom || 0) > 24) child.paddingBottom = 0;

        // 명시적 padding 또는 x 오프셋 마진이 있었으면 breakpoint 패딩으로 업데이트
        // keep 모드: 원본 마진 그대로 유지
        let childPadL = child.paddingLeft || 0;
        let childPadR = child.paddingRight || 0;
        if (navMode !== 'keep' && (effPadL0 > 0 || effPadR0 > 0)) {
          child.paddingLeft  = bpPadding;
          child.paddingRight = bpPadding;
          childPadL = bpPadding;
          childPadR = bpPadding;
        }

        if (!isCompactHorizontal) {
          if (parentHasAL) {
            try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
            // useMaxWidth + depth=0: 섹션 내 직계 콘텐츠를 1136px로 제한 (60px 마진 확보)
            if (useMaxWidth && (depth || 0) === 0) {
              try { child.maxWidth = 1136; } catch (_) {}
            }
          } else {
            try { child.resize(containerWidth, child.height); } catch (_) {}
          }
        }

        // 내부로 재귀: 실제 적용된 패딩 기준으로 inner width 계산
        const childInnerWidth = containerWidth - childPadL - childPadR;
        processInnerChildren(child, childInnerWidth, targetWidth, warnings, (depth || 0) + 1, navMode, useMaxWidth);
        // HORIZONTAL AL 카드 행도 Web Module 규칙 적용 (isGridRow 경로를 타지 않으므로 여기서 처리)
        applyWebModuleRules(child, childInnerWidth);
      }

    } else {
      // INSTANCE, GROUP 등: 60px 초과면 FILL/resize, 이하면 아이콘으로 HUG 유지
      const isIcon = child.width <= 60 && child.height <= 60;
      // TEXT 노드가 WIDTH_AND_HEIGHT(HUG) 모드면 → 원본 HUG 유지, FILL 강제 적용 안 함
      const isHugText = child.type === 'TEXT' && child.textAutoResize === 'WIDTH_AND_HEIGHT';

      if (parentHasAL) {
        if (isIcon || isHugText) {
          try { child.layoutSizingHorizontal = 'HUG'; } catch (_) {
            try { child.layoutSizingHorizontal = 'FIXED'; } catch(_) {}
          }
        } else {
          try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {}
          if (useMaxWidth && (depth || 0) === 0) {
            try { child.maxWidth = 1136; } catch (_) {}
          }
        }
      }

      // 아이콘/HUG 텍스트 제외하고 resize
      // NONE-layout 부모 안에 있을 때 부모 프레임 실제 너비를 초과하지 않도록 캡핑
      // (그리드 컬럼 안의 INSTANCE가 컨테이너 전체 너비로 리사이즈되는 버그 방지)
      if (!isIcon && !isHugText) {
        const maxW = (!parentHasAL && parentFrame.width > 0)
          ? Math.min(containerWidth, parentFrame.width)
          : containerWidth;
        try { child.resize(maxW, child.height); } catch (_) {}
      }
    }

    // autolayout 부모에서 처리 도중 ABSOLUTE(ignore auto layout)가 될 수 있으므로 명시 리셋
    // isSkippable(FAB 등)은 위에서 continue → 여기 도달 안 함 → 의도적 ABSOLUTE 보호됨
    if (parentHasAL) {
      try { child.layoutPositioning = 'AUTO'; } catch(_) {}
    }
  }
}

// 조상 노드 여부 확인
function isAncestor(ancestor, node) {
  let current = node.parent;
  while (current) {
    if (current === ancestor) return true;
    current = current.parent;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIXED 모드 — Safe (max 568px 중앙 정렬)
// ═══════════════════════════════════════════════════════════════════════════════
async function convertFixed(frame, targetWidth, targetHeight, label, startX, startY, opts) {
  const contentWidth = Math.min(targetWidth, MAX_CONTENT_WIDTH);

  // 1. wrapper 생성
  const wrapper = figma.createFrame();
  wrapper.name = `${frame.name} — ${label}`;
  wrapper.clipsContent = true;
  wrapper.x = (startX !== undefined) ? startX : frame.x + frame.width + 200;
  wrapper.y = (startY !== undefined) ? startY : frame.y;

  try {
    const bgVar = await figma.variables.getVariableByIdAsync(BG_NEUTRAL_VARIABLE_ID);
    wrapper.fills = bgVar
      ? [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: BG_NEUTRAL_COLOR }, 'color', bgVar)]
      : [{ type: 'SOLID', color: BG_NEUTRAL_COLOR }];
  } catch (_) {
    wrapper.fills = [{ type: 'SOLID', color: BG_NEUTRAL_COLOR }];
  }

  // 2. 클론 → wrapper에 append
  const content = frame.clone();
  content.name = frame.name;
  wrapper.appendChild(content);

  // 3. 모바일 전용 레이어 제거
  // Tablet(<1024): Status Bar는 content 안에 유지 (iOS 스타일), Home Indicator만 제거
  const STATUS_BAR_ONLY_PATTERNS = [
    'Status Bar', 'StatusBar', 'status bar',
    '🪩 Status Bar', '🪩Status Bar',
    '스테이터스바', '스테이터스', '상단 스테이터스', '🗂️ 상단',
  ];

  // PC: Status Bar 제거 전 높이 기록 → 형제 프레임 paddingTop 보정에 사용
  let removedStatusBarHeight = 0;
  if (targetWidth >= 1024) {
    const statusBarNodes = content.findAll(n =>
      isMobileOnly(n) && STATUS_BAR_ONLY_PATTERNS.some(p => n.name.includes(p))
    );
    for (const sb of statusBarNodes) {
      // 직계 자식만 (중첩 상태바 중복 합산 방지)
      if (sb.parent === content || (sb.parent && sb.parent.parent === content)) {
        removedStatusBarHeight = Math.max(removedStatusBarHeight, sb.height);
      }
    }
  }

  const toRemove = content.findAll(n => {
    if (!isMobileOnly(n)) return false;
    // Fixed 모드: Tablet(<1024)에서는 Status Bar 유지, PC(≥1024)에서는 제거
    if (targetWidth < 1024) {
      if (STATUS_BAR_ONLY_PATTERNS.some(p => n.name.toLowerCase().includes(p.toLowerCase()))) return false;
    }
    return true;
  });
  for (const n of toRemove) { try { n.remove(); } catch (_) {} }

  // 3-2. PC: Status Bar 제거로 인한 paddingTop 보정
  // Status Bar 높이만큼 상단 패딩이 과도하게 남은 형제 프레임 수정
  if (removedStatusBarHeight > 0) {
    for (const child of content.children) {
      try {
        if (child.paddingTop >= removedStatusBarHeight) {
          child.paddingTop = Math.max(0, child.paddingTop - removedStatusBarHeight);
        }
      } catch (_) {}
    }
  }

  // 3-1. 상태바 제거 후 남은 빈 wrapper 프레임 정리 (height ≤ 60, 자식 없음)
  try {
    const emptyWrappers = content.findAll(n =>
      n.type === 'FRAME' && n.height <= 60 &&
      (!n.children || n.children.filter(c => !c.hidden).length === 0) &&
      !n.name.includes('spacer') && !n.name.includes('Spacer')
    );
    for (const w of emptyWrappers) { try { w.remove(); } catch(_) {} }
  } catch(_) {}

  // 4. AL 전환 전에 자식들을 y 위치 순으로 정렬
  // NONE 레이아웃에서는 y로 시각적 위치가 결정되지만, AL 전환 후에는 트리 순서로 배치됨
  // → y 기준으로 미리 정렬해야 상단 Nav/Statusbar가 올바른 위치에 유지됨
  if (content.layoutMode === 'NONE') {
    const sorted = [...content.children].sort((a, b) => a.y - b.y);
    for (let i = 0; i < sorted.length; i++) {
      try { content.insertChild(i, sorted[i]); } catch(_) {}
    }
  }

  // 5. 콘텐츠 Auto Layout 전환
  if (content.layoutMode === 'NONE') {
    content.layoutMode = 'VERTICAL';
    content.primaryAxisAlignItems = 'MIN';
    content.counterAxisAlignItems = 'MIN';
    content.itemSpacing = 0;
  }
  content.primaryAxisSizingMode = 'FIXED';
  content.counterAxisSizingMode = 'FIXED';
  content.paddingLeft = 0;
  content.paddingRight = 0;
  content.paddingTop = 0;
  content.paddingBottom = 0;
  content.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  // 6. Top Nav 처리: page-specific 여부 판별 후 분기
  const topNavNode = content.findChild(n => TOP_NAV_PATTERNS.some(p => n.name.includes(p)));
  if (topNavNode && topNavNode.type === 'FRAME') {
    const rects = topNavNode.findAll(r => {
      if (!((r.type === 'RECTANGLE' || r.type === 'ROUNDED_RECTANGLE') && !r.hidden && r.height <= 15)) return false;
      // INSTANCE 내부 요소 제외 — Status Bar 배터리 사각형 오탐 방지
      let p = r.parent;
      while (p && p !== topNavNode) {
        if (p.type === 'INSTANCE') return false;
        p = p.parent;
      }
      return true;
    });
    const hasProgressBar = rects.length >= 2 && (() => {
      const ys = rects.map(r => Math.round(r.absoluteTransform ? r.absoluteTransform[1][2] : r.y));
      return new Set(ys).size < ys.length;
    })();

    // cascade resize (내부 sub-frame들도 contentWidth로)
    cascadeResizeWidth(topNavNode, contentWidth);
    try { topNavNode.layoutSizingHorizontal = 'FILL'; } catch(_) {}

    if (hasProgressBar) {
      // page-specific: 프로그레스바/타이틀 마진 보정
      const navSections = topNavNode.findAll(n =>
        n.type === 'FRAME' && n.name.includes('TopNavigation Section')
      );
      for (const sec of navSections) {
        if (sec.layoutMode !== 'NONE') {
          try { sec.paddingLeft = 16; sec.paddingRight = 16; } catch(_) {}
          for (const kid of sec.children) {
            if (kid.hidden) continue;
            const isNavSideGroup = kid.name.includes('Left Icons') || kid.name.includes('Right Icons');
            if (!isNavSideGroup) {
              try { kid.layoutSizingHorizontal = 'FILL'; } catch(_) {}
            }
          }
        } else {
          for (const kid of sec.children) {
            if (kid.hidden) continue;
            try { kid.x = 16; } catch(_) {}
            try { kid.resize(Math.max(1, contentWidth - 32), kid.height); } catch(_) {}
          }
        }
      }
      // 타이틀 텍스트 마진 보정
      topNavNode.findAll(n =>
        n.type === 'FRAME' && n.children && n.children.some(c => c.type === 'TEXT' && !c.hidden)
      ).forEach(tf => {
        for (const t of tf.children) {
          if (t.type === 'TEXT' && !t.hidden && t.x < 16) {
            try { t.x = 16; } catch(_) {}
          }
        }
      });
    }
  }

  // 7. 직계 자식 + 재귀로 내부 모두 contentWidth에 맞게 FILL
  content.resize(contentWidth, targetHeight);
  fixedFillChildren(content, contentWidth);

  // 7-1. CTA 앞에 _auto_spacer 삽입 (없을 때만) — 콘텐츠와 CTA 사이 FILL 갭
  const CTA_PATTERNS_FIXED = ['CTA', 'cta', 'Button_Area', '버튼영역'];
  let ctaNodeFixed = null;
  for (let i = content.children.length - 1; i >= 0; i--) {
    if (CTA_PATTERNS_FIXED.some(p => content.children[i].name.includes(p))) {
      ctaNodeFixed = content.children[i]; break;
    }
  }
  if (ctaNodeFixed) {
    const hasExistingSpacer = content.children.some(c => c.name === '_auto_spacer');
    if (!hasExistingSpacer) {
      const spacer = figma.createFrame();
      spacer.name = '_auto_spacer';
      spacer.fills = [];
      spacer.resize(1, 1);
      let ctaIdx = -1;
      for (let i = 0; i < content.children.length; i++) {
        if (content.children[i].id === ctaNodeFixed.id) { ctaIdx = i; break; }
      }
      content.insertChild(ctaIdx, spacer);
      try { spacer.layoutSizingHorizontal = 'FILL'; } catch (_) {}
      try { spacer.layoutSizingVertical = 'FILL'; } catch (_) {}
    } else {
      // 기존 spacer가 있으면 FILL 복원
      const existingSpacer = content.children.find(c => c.name === '_auto_spacer');
      if (existingSpacer) {
        try { existingSpacer.layoutSizingHorizontal = 'FILL'; } catch (_) {}
        try { existingSpacer.layoutSizingVertical = 'FILL'; } catch (_) {}
      }
    }
  }

  // CTA 하단 20px 여백 (Fixed 모드)
  if (ctaNodeFixed) {
    try { ctaNodeFixed.paddingBottom = (ctaNodeFixed.paddingBottom || 0) + 20; } catch(_) {}
  }

  // 가독성 보정 패스
  await applyReadabilityPass(content, targetWidth, opts, frame);

  // 8. 🗂️ 상단 스테이터스바
  // Tablet(<1024): iOS 상태바는 content 내에 이미 유지됨 (step 3에서 제거 안 함)
  // PC(≥1024): status bar 없음

  // 9. 중앙 정렬 + wrapper 확정
  content.x = Math.round((targetWidth - contentWidth) / 2);
  content.y = 0;
  wrapper.resize(targetWidth, targetHeight);
}

// ─── Fixed 모드 내부 재귀 fill ───────────────────────────────────────────────
// content 내부 모든 FRAME/INSTANCE를 contentWidth로 재귀 처리
// - Top Nav 패턴은 스킵 (이미 처리됨)
// - FAB/Floating은 절대값 위치 유지
// - INSTANCE: resize만 (AL 못 건드림)
// - FRAME: AL 전환 후 FILL + 재귀
function fixedFillChildren(parentNode, targetW, depth) {
  if (!('children' in parentNode) || (depth || 0) > 5) return;
  const hasAL = parentNode.layoutMode && parentNode.layoutMode !== 'NONE';

  for (const child of [...parentNode.children]) {
    if (isSkippable(child)) continue;
    if (TOP_NAV_PATTERNS.some(p => child.name.includes(p))) continue; // 이미 처리
    if (child.name === '_auto_spacer') continue; // spacer는 FILL 상태 그대로 유지

    if (child.type === 'INSTANCE') {
      const instH = child.height;
      const instW = child.width;
      // Card Thumbnail이 있는 인스턴스(상품 카드 등) → detach 후 썸네일 resize
      const hasThumb = 'children' in child && child.findAll &&
        child.findAll(n => n.name.includes('Thumbnail') || n.name.includes('thumb')).length > 0;
      if (hasThumb) {
        // NONE 레이아웃 부모 안에 절대 배치된 카드: 부모 너비에 비례해 리사이즈
        // AL 부모면 targetW(contentWidth) 전체로 FILL
        const parentW = (!hasAL && parentNode.width > 0) ? parentNode.width : 0;
        const cardTargetW = (!hasAL && parentW > 0)
          ? Math.round(instW * (targetW / parentW))
          : targetW;
        try {
          const detached = child.detachInstance();

          // [Fix2] 썸네일 비율 계산 먼저 (1:1이면 height도 함께 조정, 최대 200px)
          const THUMB_MAX_SIZE = 200;
          var newCardH = instH;
          var THUMB_FILL_NAMES = ['image','Image','Overlay','overlay','bg','Bg','background','Background'];
          for (var _pi = 0; _pi < detached.children.length; _pi++) {
            var _ps = detached.children[_pi];
            if (_ps.name.includes('Thumbnail') || _ps.name.includes('thumb')) {
              const isSquare = _ps.height > 0 && Math.abs(_ps.width / _ps.height - 1) < 0.15;
              if (isSquare && _ps.width > 0) {
                const rawThH = Math.round(_ps.height * (cardTargetW / _ps.width));
                const newThH = Math.min(rawThH, THUMB_MAX_SIZE);
                newCardH = instH + (newThH - _ps.height);
              }
              break;
            }
          }
          detached.resize(cardTargetW, Math.max(newCardH, 10));

          // 각 섹션 처리
          for (var di = 0; di < detached.children.length; di++) {
            var section = detached.children[di];
            if (section.name.includes('Thumbnail') || section.name.includes('thumb')) {
              // [Fix2] 썸네일: 1:1이면 height도 비례 조정, max 200px
              const isSquare = section.height > 0 && Math.abs(section.width / section.height - 1) < 0.15;
              const rawThumbH = (isSquare && section.width > 0)
                ? Math.round(section.height * (cardTargetW / section.width))
                : section.height;
              const newThumbH = Math.min(rawThumbH, THUMB_MAX_SIZE);
              const newThumbW = (isSquare && rawThumbH > THUMB_MAX_SIZE)
                ? THUMB_MAX_SIZE  // 높이가 capped되면 너비도 1:1로 맞춤
                : cardTargetW;
              try { section.resize(newThumbW, newThumbH); } catch(_) {}
              for (var dk = 0; dk < section.children.length; dk++) {
                var inner = section.children[dk];
                var shouldFill = THUMB_FILL_NAMES.some(function(n) { return inner.name.includes(n); })
                  || (inner.type === 'RECTANGLE' && inner.fills && inner.fills.some(function(f) { return f.type === 'IMAGE'; }));
                if (shouldFill) { try { inner.resize(newThumbW, newThumbH); } catch(_) {} }
              }
            } else {
              // [Fix3] 콘텐츠 섹션: NONE → AL 변환 후 재귀 처리 (뱃지 HUG 등 포함)
              if (section.layoutMode === 'NONE') {
                switchToVerticalAL(section);
                section.paddingTop = 0; section.paddingBottom = 0;
                section.paddingLeft = 0; section.paddingRight = 0;
              }
              if (section.layoutMode && section.layoutMode !== 'NONE') {
                section.primaryAxisSizingMode = 'AUTO';
                section.counterAxisSizingMode = 'FIXED';
              }
              try { section.resize(cardTargetW, section.height); } catch(_) {}
              fixedFillChildren(section, cardTargetW, (depth || 0) + 1);
            }
          }
          fixImageFills(detached);
          if (hasAL) {
            try { detached.layoutSizingHorizontal = 'FILL'; detached.layoutSizingVertical = 'FIXED'; } catch (_) {}
          }
        } catch (_) {
          try { child.resize(cardTargetW, instH); } catch (_) {}
          if (hasAL) { try { child.layoutSizingHorizontal = 'FILL'; child.layoutSizingVertical = 'FIXED'; } catch (_) {} }
        }
        } else {
        // [Fix1] 일반 INSTANCE: 뱃지(HUG 텍스트 포함)이거나 아이콘이면 HUG 유지
        const isIconInst = child.width <= 60 && child.height <= 60;
        // 뱃지: width 200px 미만이고 HUG 텍스트가 직접 들어있는 소형 INSTANCE
        // → 200px 이상이면 섹션 레벨(KV, GNB 등)으로 간주해 detach 처리
        const hasBadgeText = child.width < 200 && 'findAll' in child &&
          child.findAll(n => n.type === 'TEXT' && n.textAutoResize === 'WIDTH_AND_HEIGHT').length > 0;
        const isHugInst = isIconInst || hasBadgeText;

        if (isHugInst) {
          // 아이콘/뱃지: HUG 유지
          if (hasAL) {
            try { child.layoutSizingHorizontal = 'HUG'; } catch (_) {
              try { child.layoutSizingHorizontal = 'FIXED'; } catch(_) {}
            }
          }
        } else {
          // 섹션 레벨 INSTANCE (KV, GNB, 카드 목록 등): detach 후 내부 재귀 처리
          try {
            const detachedSect = child.detachInstance();
            if (hasAL) {
              try { detachedSect.layoutSizingHorizontal = 'FILL'; detachedSect.layoutSizingVertical = 'FIXED'; } catch(_) {}
            } else {
              try { detachedSect.resize(targetW, detachedSect.height); } catch(_) {}
            }
            if (detachedSect.layoutMode === 'NONE') {
              switchToVerticalAL(detachedSect);
              detachedSect.paddingTop = 0; detachedSect.paddingBottom = 0;
              detachedSect.paddingLeft = 0; detachedSect.paddingRight = 0;
            }
            if (detachedSect.layoutMode && detachedSect.layoutMode !== 'NONE') {
              detachedSect.primaryAxisSizingMode = 'AUTO';
              detachedSect.counterAxisSizingMode = 'FIXED';
            }
            fixedFillChildren(detachedSect, targetW, (depth || 0) + 1);
          } catch(_) {
            // detach 실패 시 resize만
            if (hasAL) {
              try { child.layoutSizingHorizontal = 'FILL'; child.layoutSizingVertical = 'FIXED'; } catch (_) {}
            } else {
              try { child.resize(targetW, instH); } catch (_) {}
            }
          }
        }
      }

    } else if (child.type === 'FRAME') {
      // 썸네일+정보 카드 패턴 우선 감지 (ToggleButton/Badge 오버레이 때문에 yRange 크더라도 처리)
      const _cardThumb = child.layoutMode === 'NONE' && child.children &&
        child.children.find(k => k.name.includes('썸네일') || k.name.includes('Thumbnail') || k.name.toLowerCase().includes('thumb'));
      const _cardInfo  = child.layoutMode === 'NONE' && child.children &&
        child.children.find(k => k.name.includes('상품정보') || k.name.includes('productInfo'));
      const isCardLayout = !!(child.layoutMode === 'NONE' && _cardThumb && _cardInfo);

      const isHorizNone = !isCardLayout && child.layoutMode === 'NONE' && looksLikeHorizontalNone(child);
      const isGridNone  = child.layoutMode === 'NONE' && looksLikeNoneGrid(child);

      if (isCardLayout || isHorizNone || isGridNone) {
        const THUMB_MAX_SIZE = 200;
        const visKids = [...child.children].filter(c => !c.hidden);

        // 카드 썸네일(좌) + 정보(우) 구조 감지
        const thumbKid = (isCardLayout || isHorizNone) ? visKids.find(k =>
          k.name.includes('썸네일') || k.name.includes('Thumbnail') || k.name.toLowerCase().includes('thumb')
        ) : null;
        const infoKid = (isCardLayout || isHorizNone) ? visKids.find(k =>
          k.name.includes('상품정보') || k.name.includes('productInfo')
        ) : null;

        // 원본 크기/위치 기록 (resize 전)
        const thumbOrigW = thumbKid ? thumbKid.width : 0;
        const thumbOrigH = thumbKid ? thumbKid.height : 0;
        const thumbOrigX = thumbKid ? thumbKid.x : 0;
        const thumbOrigY = thumbKid ? thumbKid.y : 0;
        const infoOrigX  = infoKid  ? infoKid.x  : 0;
        const infoOrigH  = infoKid  ? infoKid.height : 0;

        // 썸네일 내부 오버레이(Badge, Toggle) 위치 기록
        var thumbOverlaySnaps = [];
        if (thumbKid && 'children' in thumbKid) {
          thumbOverlaySnaps = [...thumbKid.children].map(ic => {
            // isImg = 실제 배경 이미지 레이어 여부
            // ✓ RECTANGLE/FRAME with IMAGE fill
            // ✓ 이름이 정확히 'img', 'image', 'photo', 'bg' 등 (단순 이름)
            // ✗ "Image Badge Container" 같은 복합 이름은 제외 (배지/아이콘 컨테이너)
            const nameLower = ic.name.toLowerCase().trim();
            const isExactImgName = /^(img|image|photo|bg|background|thumb|thumbnail)$/.test(nameLower);
            const hasImageFill = (ic.type === 'RECTANGLE' || ic.type === 'FRAME' || ic.type === 'VECTOR')
              && ic.fills && ic.fills.some(f => f.type === 'IMAGE');
            // children이 있는 프레임은 배지/아이콘 컨테이너로 판단 → isImg=false
            const hasComplexChildren = 'children' in ic && ic.children && ic.children.length > 0;
            return {
              node: ic, x: ic.x, y: ic.y, w: ic.width, h: ic.height,
              isImg: !hasComplexChildren && (isExactImgName || hasImageFill)
            };
          });
        }

        // 카드 프레임 resize (FILL or 명시)
        if (hasAL) {
          try { child.layoutSizingHorizontal = 'FILL'; child.layoutSizingVertical = 'FIXED'; } catch (_) {}
        } else {
          try { child.resize(targetW, child.height); } catch (_) {}
        }

        if (isCardLayout || isHorizNone) {
          // ── 썸네일 복원 ─────────────────────────────────────────────
          // 비율(1:1) 유지 + 최대 200px. 인스턴스라서 constraints 못 믿음 → detach 후 resize
          if (thumbKid) {
            const isSquare = thumbOrigH > 0 && Math.abs(thumbOrigW / thumbOrigH - 1) < 0.15;
            const thumbFinalW = Math.min(thumbOrigW, THUMB_MAX_SIZE);
            const thumbFinalH = Math.min(isSquare ? thumbOrigW : thumbOrigH, THUMB_MAX_SIZE);
            var thumbTarget = thumbKid;
            // 인스턴스면 detach해서 resize 권한 확보
            if (thumbKid.type === 'INSTANCE') {
              try { thumbTarget = thumbKid.detachInstance(); } catch(_) { thumbTarget = thumbKid; }
            }
            // 위치·크기 복원
            try { thumbTarget.x = thumbOrigX; thumbTarget.y = thumbOrigY; } catch(_) {}
            try { thumbTarget.resize(thumbFinalW, thumbFinalH); } catch(_) {}
            try { thumbTarget.constraints = { horizontal: 'MIN', vertical: 'MIN' }; } catch(_) {}

            // AL 레이아웃 썸네일: 패딩을 resize 비율로 스케일 (40px→ 원본 크기 대비 비율 유지)
            if (thumbTarget.layoutMode !== 'NONE' && thumbOrigW > 0) {
              const scaleRatio = thumbFinalW / thumbOrigW;
              try { thumbTarget.paddingLeft   = Math.round((thumbTarget.paddingLeft   || 0) * scaleRatio); } catch(_) {}
              try { thumbTarget.paddingRight  = Math.round((thumbTarget.paddingRight  || 0) * scaleRatio); } catch(_) {}
              try { thumbTarget.paddingTop    = Math.round((thumbTarget.paddingTop    || 0) * scaleRatio); } catch(_) {}
              try { thumbTarget.paddingBottom = Math.round((thumbTarget.paddingBottom || 0) * scaleRatio); } catch(_) {}
              try { thumbTarget.itemSpacing   = Math.round((thumbTarget.itemSpacing   || 0) * scaleRatio); } catch(_) {}
            }

            // 썸네일 내부 처리
            // img → 썸네일 크기에 맞게 resize
            // overlay(Badge, Toggle) → 원본 x,y 복원, 크기 유지 (내부 마진 건드리지 않음)
            // ※ detach 후 노드 ID가 바뀌므로 인덱스로 매칭
            if ('children' in thumbTarget) {
              const thumbChildren = [...thumbTarget.children];
              for (let ci = 0; ci < thumbChildren.length; ci++) {
                const ic = thumbChildren[ci];
                // 이름으로 먼저 매칭, 없으면 인덱스로 fallback
                const snap = thumbOverlaySnaps.find(s => s.node.name === ic.name)
                          || thumbOverlaySnaps[ci];
                if (!snap) continue;
                if (snap.isImg) {
                  try { ic.resize(thumbFinalW, thumbFinalH); ic.x = 0; ic.y = 0; } catch(_) {}
                  try { ic.constraints = { horizontal: 'SCALE', vertical: 'SCALE' }; } catch(_) {}
                } else {
                  // Badge/Toggle: 원본 위치 복원 (크기·내부 마진 건드리지 않음)
                  try { ic.x = snap.x; ic.y = snap.y; } catch(_) {}
                  try { ic.constraints = { horizontal: 'MIN', vertical: 'MIN' }; } catch(_) {}
                }
              }
            }
          }

          // ── 상품정보 복원 ─────────────────────────────────────────────
          if (infoKid) {
            const infoTargetW = Math.max(10, targetW - infoOrigX);
            try { infoKid.resize(infoTargetW, infoOrigH); } catch(_) {}
            try { infoKid.constraints = { horizontal: 'STRETCH', vertical: 'MIN' }; } catch(_) {}
            fixedFillChildren(infoKid, infoTargetW, (depth || 0) + 1);
          }
        }
      } else {
        if (child.layoutMode === 'NONE') {
          switchToVerticalAL(child);
          child.paddingTop    = 0;
          child.paddingBottom = 0;
          child.paddingLeft   = 0;
          child.paddingRight  = 0;
        }
        child.primaryAxisSizingMode = 'AUTO';
        child.counterAxisSizingMode = 'FIXED';

        if (hasAL) {
          try { child.layoutSizingHorizontal = 'FILL'; child.layoutSizingVertical = 'FIXED'; } catch (_) {}
        } else {
          try { child.resize(targetW, child.height); } catch (_) {}
        }

        fixedFillChildren(child, targetW, (depth || 0) + 1);
      }

    } else {
      // TEXT, GROUP, VECTOR 등
      const isSmall = child.width <= 60 && child.height <= 60;
      const isHugText = child.type === 'TEXT' && child.textAutoResize === 'WIDTH_AND_HEIGHT';
      if (hasAL) {
        if (!isSmall && !isHugText) { try { child.layoutSizingHorizontal = 'FILL'; } catch (_) {} }
      } else {
        if (!isSmall && !isHugText) { try { child.resize(targetW, child.height); } catch (_) {} }
      }
    }
  }
}

// ─── Top Nav → Auto Layout 변환 ──────────────────────────────────────────────
function convertTopNavToAutoLayout(navFrame, navWidth) {
  const children = [...navFrame.children];
  const texts = children.filter(n => n.type === 'TEXT');
  const icons = children.filter(n => n.type !== 'TEXT');
  const navCenterX = navWidth / 2;

  const titleNode = texts.reduce((closest, n) => {
    if (!closest) return n;
    return Math.abs((n.x + n.width / 2) - navCenterX) < Math.abs((closest.x + closest.width / 2) - navCenterX) ? n : closest;
  }, null);

  const leftIcons  = icons.filter(n => n.x + n.width / 2 < navCenterX);
  const rightIcons = icons.filter(n => n.x + n.width / 2 >= navCenterX);

  navFrame.layoutMode = 'HORIZONTAL';
  navFrame.primaryAxisAlignItems = 'SPACE_BETWEEN';
  navFrame.counterAxisAlignItems = 'CENTER';
  navFrame.paddingLeft = 16;
  navFrame.paddingRight = 16;
  navFrame.paddingTop = 0;
  navFrame.paddingBottom = 0;
  navFrame.itemSpacing = 0;
  navFrame.primaryAxisSizingMode = 'FIXED';
  navFrame.counterAxisSizingMode = 'FIXED';
  navFrame.resize(navWidth, navFrame.height);

  const sideW = Math.max(
    leftIcons.length  > 0 ? 24 * leftIcons.length  + 14 * (leftIcons.length  - 1) : 24,
    rightIcons.length > 0 ? 24 * rightIcons.length + 14 * (rightIcons.length - 1) : 24
  );

  const leftFrame = figma.createFrame();
  leftFrame.name = 'Left Icons';
  leftFrame.layoutMode = 'HORIZONTAL';
  leftFrame.primaryAxisAlignItems = 'MIN';
  leftFrame.counterAxisAlignItems = 'CENTER';
  leftFrame.itemSpacing = 14;
  leftFrame.fills = [];
  leftFrame.resize(sideW, navFrame.height);

  const centerFrame = figma.createFrame();
  centerFrame.name = 'Center';
  centerFrame.layoutMode = 'HORIZONTAL';
  centerFrame.primaryAxisAlignItems = 'CENTER';
  centerFrame.counterAxisAlignItems = 'CENTER';
  centerFrame.fills = [];
  centerFrame.resize(navWidth - sideW * 2 - 32, navFrame.height);

  const rightFrame = figma.createFrame();
  rightFrame.name = 'Right Icons';
  rightFrame.layoutMode = 'HORIZONTAL';
  rightFrame.primaryAxisAlignItems = 'MAX';
  rightFrame.counterAxisAlignItems = 'CENTER';
  rightFrame.itemSpacing = 14;
  rightFrame.fills = [];
  rightFrame.resize(sideW, navFrame.height);

  navFrame.appendChild(leftFrame);
  for (const icon of leftIcons) {
    leftFrame.appendChild(icon);
    try { icon.layoutSizingHorizontal = 'FIXED'; icon.layoutSizingVertical = 'FIXED'; } catch (_) {}
  }

  navFrame.appendChild(centerFrame);
  if (titleNode) {
    centerFrame.appendChild(titleNode);
    try { titleNode.textAlignHorizontal = 'CENTER'; titleNode.layoutSizingHorizontal = 'FILL'; } catch (_) {}
  }

  navFrame.appendChild(rightFrame);
  for (const icon of rightIcons) {
    rightFrame.appendChild(icon);
    try { icon.layoutSizingHorizontal = 'FIXED'; icon.layoutSizingVertical = 'FIXED'; } catch (_) {}
  }

  try {
    leftFrame.layoutSizingHorizontal = 'FIXED';
    leftFrame.layoutSizingVertical = 'FILL';
    centerFrame.layoutSizingHorizontal = 'FILL';
    centerFrame.layoutSizingVertical = 'FILL';
    rightFrame.layoutSizingHorizontal = 'FIXED';
    rightFrame.layoutSizingVertical = 'FILL';
  } catch (_) {}
}
