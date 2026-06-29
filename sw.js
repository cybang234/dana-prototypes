// Dana Todo · Service Worker
const VERSION = 'v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Push 이벤트 — 새 todo 알림
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Dana Todo', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || '🔥 새 할 일';
  const options = {
    body: data.body || '',
    icon: './assets/todo-icon-192.png',
    badge: './assets/todo-icon-192.png',
    data: { url: data.url || './todo.html' },
    tag: data.tag || 'dana-todo',
    requireInteraction: false,
    vibrate: [100, 50, 100]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// 알림 클릭 → 해당 URL 열기 (보통 슬랙 원본 또는 todo.html)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || './todo.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      // 기존 탭 있으면 focus
      for (const c of list) {
        if (c.url.includes(url) && 'focus' in c) return c.focus();
      }
      // 없으면 새 탭
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
