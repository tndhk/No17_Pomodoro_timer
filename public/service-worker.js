/* eslint-disable no-restricted-globals */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // デフォルト動作は何もしない（next-pwa がキャッシュ戦略を管理）
}); 