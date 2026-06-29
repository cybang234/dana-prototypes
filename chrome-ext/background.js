// Dana Todo — Background Service Worker
// 슬랙 todos.json polling + Chrome 푸시 알림

const DATA_URL = "https://cybang234.github.io/dana-prototypes/data/todos.json";
const POLL_INTERVAL_MIN = 5;

// 알람 등록 + 사이드 패널 동작
chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create("poll", { periodInMinutes: POLL_INTERVAL_MIN });
  // 아이콘 클릭 시 popup 대신 사이드 패널 열기 옵션
  // (popup도 같이 쓰려면 false 유지)
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
  await fetchAndNotify();
});

chrome.runtime.onStartup.addListener(fetchAndNotify);

// Polling
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "poll") {
    await fetchAndNotify();
  }
});

// 메시지로 강제 새로고침 요청 받기 (popup/sidepanel에서)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "refresh") {
    fetchAndNotify().then((data) => sendResponse({ ok: true, data }));
    return true;
  }
});

async function fetchAndNotify() {
  try {
    const res = await fetch(DATA_URL + "?t=" + Date.now());
    const data = await res.json();
    const todos = data.todos || [];
    const openCount = todos.filter(t => (t.status || "checking") !== "done").length;

    // 아이콘 배지 카운트
    chrome.action.setBadgeText({ text: openCount > 0 ? String(openCount) : "" });
    chrome.action.setBadgeBackgroundColor({ color: "#FF3B30" });

    // 새로운 todo 감지 → 알림
    const stored = await chrome.storage.local.get(["knownIds"]);
    const known = stored.knownIds || [];
    const currentIds = todos.map(t => t.id);
    const newOnes = todos.filter(t => !known.includes(t.id));

    for (const t of newOnes) {
      chrome.notifications.create(`new-${t.id}`, {
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon-128.png"),
        title: `🔥 새 할 일 · ${t.priority || "P3"}`,
        message: t.title || "(제목 없음)",
        contextMessage: t.team ? `${t.team} · ${t.requester || ""}`.trim() : "",
        priority: 2
      });
    }

    await chrome.storage.local.set({
      knownIds: currentIds,
      lastFetch: Date.now(),
      data
    });
    return data;
  } catch (e) {
    console.error("Fetch failed", e);
    return null;
  }
}

// 알림 클릭 → 사이드 패널 열기 + 원본 슬랙 이동 (todo source가 있으면 새 탭)
chrome.notifications.onClicked.addListener(async (notificationId) => {
  const id = notificationId.replace("new-", "");
  const stored = await chrome.storage.local.get(["data"]);
  const todo = stored.data?.todos?.find(t => t.id === id);
  if (todo?.source) {
    chrome.tabs.create({ url: todo.source });
  } else {
    // 현재 윈도우에 사이드 패널 열기
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    }
  }
  chrome.notifications.clear(notificationId);
});
