async function load() {
  const { data } = await chrome.storage.local.get(["data"]);
  const todos = (data?.todos || []).filter(t => (t.status || "checking") !== "done");
  const ordered = todos.sort((a, b) => prRank(a.priority) - prRank(b.priority));
  document.getElementById("count").textContent = ordered.length;
  const listEl = document.getElementById("list");
  listEl.innerHTML = "";
  if (ordered.length === 0) {
    listEl.innerHTML = '<div class="empty">모두 처리되었어요 👏</div>';
    return;
  }
  ordered.slice(0, 6).forEach(t => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <span class="priority ${(t.priority || "P3").toLowerCase()}">${t.priority || "P3"}</span>
      <span class="title-text">${escapeHtml(t.title || "(제목 없음)")}</span>
    `;
    row.addEventListener("click", () => {
      if (t.source) chrome.tabs.create({ url: t.source });
    });
    listEl.appendChild(row);
  });
}

function prRank(p) { return { P1: 1, P2: 2, P3: 3, P4: 4 }[p] ?? 9; }
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

document.getElementById("refresh").addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "refresh" });
  await load();
});
document.getElementById("open-panel").addEventListener("click", async () => {
  try {
    const win = await chrome.windows.getCurrent();
    if (chrome.sidePanel?.open) {
      await chrome.sidePanel.open({ windowId: win.id });
    } else {
      // 사이드 패널 미지원 시 todo.html 새 탭으로
      chrome.tabs.create({ url: "https://cybang234.github.io/dana-prototypes/todo.html" });
    }
  } catch (e) {
    chrome.tabs.create({ url: "https://cybang234.github.io/dana-prototypes/todo.html" });
  }
  window.close();
});

load();
