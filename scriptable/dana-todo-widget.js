// Dana Todo Widget — Scriptable
// 토스 article 스타일 알림센터/홈화면 위젯
//
// 사용법:
// 1. iPhone에 Scriptable 설치
// 2. Scriptable 앱 → + → 새 스크립트 → 이름 "Dana Todo"
// 3. 이 파일 내용 전체 복사해서 붙여넣기
// 4. 우상단 ▶ Run 눌러서 작동 확인
// 5. 홈화면 길게 누름 → 위젯 추가 → Scriptable → "Dana Todo" 선택
//
// 데이터 소스: GitHub Pages todos.json (URL은 아래 DATA_URL 수정)

const DATA_URL = "https://cybang234.github.io/dana-prototypes/data/todos.json";
const ACCENT = new Color("#FF6B6B");        // 토스 article 위젯 이모지 톤
const BG = new Color("#FFFFFF");
const FG = new Color("#141414");
const FG_WEAK = new Color("#8C8C8C");
const CARD_BG = new Color("#F4F6FF");

// ── 데이터 fetch ──
let todos = [];
try {
  const req = new Request(DATA_URL);
  const data = await req.loadJSON();
  todos = (data.todos || []).slice(0, 3);
} catch (e) {
  // 데이터 fetch 실패 시 mock
  todos = [
    { title: "브랜드 프로모션 시안 검토", priority: "P1" },
    { title: "UMS 푸시 알림 컨벤션 반영", priority: "P1" },
    { title: "대출 해지 퍼널 화면 마무리", priority: "P2" }
  ];
}

const totalCount = todos.length || 0;

// ── 위젯 생성 ──
const widget = new ListWidget();
widget.backgroundColor = BG;
widget.setPadding(14, 16, 14, 16);

// 헤더 (Todo Widget · 새 할 일 N개)
const headerStack = widget.addStack();
headerStack.layoutHorizontally();
headerStack.centerAlignContent();

const titleText = headerStack.addText("Todo Widget");
titleText.font = Font.boldSystemFont(13);
titleText.textColor = FG;

headerStack.addSpacer();

const countText = headerStack.addText(`${totalCount}`);
countText.font = Font.boldSystemFont(13);
countText.textColor = ACCENT;

widget.addSpacer(10);

// ── 카드 리스트 ──
if (todos.length === 0) {
  const empty = widget.addText("모두 처리되었어요 👏");
  empty.font = Font.systemFont(12);
  empty.textColor = FG_WEAK;
} else {
  for (let i = 0; i < todos.length; i++) {
    const t = todos[i];
    const card = widget.addStack();
    card.backgroundColor = CARD_BG;
    card.cornerRadius = 12;
    card.setPadding(10, 12, 10, 12);
    card.layoutHorizontally();
    card.centerAlignContent();

    // 좌측 이모지 (체크 도장 같은 느낌)
    const emoji = card.addText("🔥");
    emoji.font = Font.systemFont(18);

    card.addSpacer(8);

    // 텍스트 영역 (vertical)
    const textCol = card.addStack();
    textCol.layoutVertically();

    const label = textCol.addText(`새 할 일 1개`);
    label.font = Font.boldSystemFont(12);
    label.textColor = FG;

    textCol.addSpacer(2);

    const title = textCol.addText(t.title);
    title.font = Font.systemFont(12);
    title.textColor = new Color("#4A4A4A");
    title.lineLimit = 1;

    if (i < todos.length - 1) widget.addSpacer(6);
  }
}

// ── 위젯 출력 ──
Script.setWidget(widget);
widget.presentMedium(); // 디버그용 — 실제 위젯 설치 후 이 줄 제거
Script.complete();
