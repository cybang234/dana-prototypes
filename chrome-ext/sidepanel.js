let activeTab = "open";
let data = null;

async function load() {
  const stored = await chrome.storage.local.get(["data", "lastFetch"]);
  data = stored.data || { todos: [] };
  const lastFetch = stored.lastFetch;
  render();
  if (lastFetch) {
    const d = new Date(lastFetch);
    document.getElementById("last-sync").textContent =
      `마지막 동기화 · ${d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  }
}

function render() {
  const all = data.todos || [];
  const open = all.filter(t => (t.status || "checking") !== "done");
  const done = all.filter(t => (t.status || "checking") === "done");

  document.getElementById("open-count").textContent = open.length;
  document.getElementById("open-c").textContent = " " + open.length;
  document.getElementById("done-c").textContent = " " + done.length;

  document.querySelectorAll(".tab").forEach(t =>
    t.classList.toggle("on", t.dataset.tab === activeTab)
  );

  const list = activeTab === "done" ? done : open;
  const ordered = list.sort((a, b) => prRank(a.priority) - prRank(b.priority));

  const el = document.getElementById("list");
  el.innerHTML = "";
  if (ordered.length === 0) {
    el.innerHTML = '<div class="empty">모두 처리되었어요 👏</div>';
    return;
  }
  ordered.forEach(t => {
    const row = document.createElement("div");
    row.className = "row" + (t.status === "done" ? " done" : "");
    row.innerHTML = `
      <span class="checkbox ${t.status === "done" ? "checked" : ""}">
        <svg viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <span class="priority ${(t.priority || "P3").toLowerCase()}">${t.priority || "P3"}</span>
      <span class="title-text title">${escapeHtml(t.title || "(제목 없음)")}</span>
    `;
    row.querySelector(".checkbox").addEventListener("click", (e) => {
      e.stopPropagation();
      t.status = t.status === "done" ? "checking" : "done";
      chrome.storage.local.set({ data });
      render();
    });
    row.addEventListener("click", () => {
      if (t.source) chrome.tabs.create({ url: t.source });
    });
    el.appendChild(row);
  });
}

function prRank(p) { return { P1: 1, P2: 2, P3: 3, P4: 4 }[p] ?? 9; }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

document.querySelectorAll(".tab").forEach(t =>
  t.addEventListener("click", () => { activeTab = t.dataset.tab; render(); })
);
document.getElementById("refresh").addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "refresh" });
  await load();
});

load();
