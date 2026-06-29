// Dana Todo Widget v2 — Scriptable
// 토스 article 스타일 + 회의 progress + 오늘 할 일
//
// 사용법:
// 1. iPhone Scriptable 앱에서 새 스크립트 생성
// 2. 이 코드 전체 복사 붙여넣기
// 3. 우상단 ▶ Run으로 미리보기
// 4. 홈화면 위젯 추가 → Scriptable → "Dana Todo" 선택 (Medium 또는 Large)

// ── 설정 ──
const DATA_URL = "https://cybang234.github.io/dana-prototypes/data/todos.json";
const FG = new Color("#141414");
const FG_MID = new Color("#4A4A4A");
const FG_WEAK = new Color("#8C8C8C");
const BG = new Color("#FFFFFF");
const CARD_BG = new Color("#F4F6FB");
const ACCENT = new Color("#0064FF");
const TRACK = new Color("#EFEFEF");

// ── 데이터: todos ──
let todos = [];
try {
  const req = new Request(DATA_URL);
  const data = await req.loadJSON();
  todos = (data.todos || []).slice(0, 3);
} catch (e) {
  todos = [
    { title: "브랜드 프로모션 시안 검토", priority: "P1" },
    { title: "UMS 푸시 알림 컨벤션 반영", priority: "P1" },
    { title: "대출 해지 퍼널 화면 마무리", priority: "P2" }
  ];
}
const totalCount = todos.length;

// ── 데이터: 오늘 회의 (iOS 캘린더) ──
const now = new Date();
const dayStart = new Date(now); dayStart.setHours(0,0,0,0);
const dayEnd = new Date(now); dayEnd.setHours(23,59,59,999);

let currentEvent = null;
let nextEvent = null;
let progress = 0;
let timeLeftMin = 0;

try {
  const events = await CalendarEvent.between(dayStart, dayEnd);
  // 진행 중 또는 다음 이벤트
  const sorted = events.sort((a,b) => a.startDate - b.startDate);
  currentEvent = sorted.find(e => e.startDate <= now && e.endDate > now);
  nextEvent = sorted.find(e => e.startDate > now);
  if (currentEvent) {
    const total = currentEvent.endDate - currentEvent.startDate;
    const elapsed = now - currentEvent.startDate;
    progress = Math.max(0, Math.min(1, elapsed / total));
    timeLeftMin = Math.round((currentEvent.endDate - now) / 60000);
  }
} catch (e) {
  // 캘린더 권한 없을 시 무시
}

// ── 위젯 생성 ──
const widget = new ListWidget();
widget.backgroundColor = BG;
widget.setPadding(14, 16, 14, 16);

// 헤더
const head = widget.addStack();
head.layoutHorizontally();
head.centerAlignContent();

const headTitle = head.addText("Todo Widget");
headTitle.font = Font.boldSystemFont(13);
headTitle.textColor = FG;

head.addSpacer();

const countBadge = head.addText(String(totalCount));
countBadge.font = Font.boldSystemFont(13);
countBadge.textColor = ACCENT;

widget.addSpacer(10);

// ── 회의 progress 영역 ──
const meetingStack = widget.addStack();
meetingStack.layoutVertically();
meetingStack.setPadding(8, 10, 10, 10);
meetingStack.backgroundColor = CARD_BG;
meetingStack.cornerRadius = 10;

if (currentEvent) {
  const labelStack = meetingStack.addStack();
  labelStack.layoutHorizontally();
  const tag = labelStack.addText("🔵 진행 중");
  tag.font = Font.boldSystemFont(10);
  tag.textColor = ACCENT;
  labelStack.addSpacer();
  const left = labelStack.addText(`${timeLeftMin}분 남음`);
  left.font = Font.mediumSystemFont(10);
  left.textColor = FG_WEAK;

  meetingStack.addSpacer(4);

  const title = meetingStack.addText(currentEvent.title);
  title.font = Font.boldSystemFont(13);
  title.textColor = FG;
  title.lineLimit = 1;

  meetingStack.addSpacer(6);

  // Progress bar — DrawContext 로 그리기
  const barW = 280, barH = 6;
  const dc = new DrawContext();
  dc.size = new Size(barW, barH);
  dc.opaque = false;
  dc.respectScreenScale = true;
  // track
  const trackPath = new Path();
  trackPath.addRoundedRect(new Rect(0, 0, barW, barH), barH/2, barH/2);
  dc.addPath(trackPath);
  dc.setFillColor(TRACK);
  dc.fillPath();
  // fill
  const fillW = Math.max(barH, barW * progress);
  const fillPath = new Path();
  fillPath.addRoundedRect(new Rect(0, 0, fillW, barH), barH/2, barH/2);
  dc.addPath(fillPath);
  dc.setFillColor(FG);
  dc.fillPath();
  const img = dc.getImage();
  meetingStack.addImage(img);
} else if (nextEvent) {
  const tag = meetingStack.addText("⚪️ 다음 회의");
  tag.font = Font.boldSystemFont(10);
  tag.textColor = FG_WEAK;

  meetingStack.addSpacer(4);

  const title = meetingStack.addText(nextEvent.title);
  title.font = Font.boldSystemFont(13);
  title.textColor = FG;
  title.lineLimit = 1;

  meetingStack.addSpacer(2);

  const startStr = nextEvent.startDate.toLocaleTimeString('ko-KR', { hour:'2-digit', minute:'2-digit', hour12: false });
  const mins = Math.round((nextEvent.startDate - now) / 60000);
  const sub = meetingStack.addText(`${startStr} · ${mins}분 후`);
  sub.font = Font.mediumSystemFont(11);
  sub.textColor = FG_WEAK;
} else {
  const tag = meetingStack.addText("🌿 회의 없음");
  tag.font = Font.boldSystemFont(11);
  tag.textColor = FG_WEAK;
  meetingStack.addSpacer(2);
  const sub = meetingStack.addText("오늘 일정 끝났어요");
  sub.font = Font.mediumSystemFont(11);
  sub.textColor = FG_WEAK;
}

widget.addSpacer(10);

// ── 오늘 할 일 카드 ──
if (todos.length === 0) {
  const empty = widget.addText("모두 처리되었어요 👏");
  empty.font = Font.mediumSystemFont(12);
  empty.textColor = FG_WEAK;
} else {
  for (let i = 0; i < todos.length; i++) {
    const t = todos[i];
    const card = widget.addStack();
    card.layoutHorizontally();
    card.centerAlignContent();
    card.setPadding(6, 0, 6, 0);

    // priority dot
    const pri = card.addText(prioritySymbol(t.priority));
    pri.font = Font.boldSystemFont(12);

    card.addSpacer(8);

    const txt = card.addText(t.title);
    txt.font = Font.mediumSystemFont(12);
    txt.textColor = FG;
    txt.lineLimit = 1;

    if (i < todos.length - 1) {
      widget.addSpacer(2);
      // 행 사이 옅은 구분선
      const sep = widget.addStack();
      sep.backgroundColor = new Color("#F2F2F2");
      sep.size = new Size(0, 1);
      sep.addSpacer();
      widget.addSpacer(2);
    }
  }
}

function prioritySymbol(p) {
  switch (p) {
    case "P1": return "🔴";
    case "P2": return "🟠";
    case "P3": return "🟡";
    case "P4": return "⚪️";
    default:   return "•";
  }
}

// ── 갱신 트리거: 1분 뒤 다시 (progress 빠른 갱신용) ──
widget.refreshAfterDate = new Date(Date.now() + 60_000);

// ── 위젯 출력 ──
Script.setWidget(widget);
if (config.runsInApp) {
  widget.presentMedium();
}
Script.complete();
