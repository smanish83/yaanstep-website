// Keeps the two draft pages available offline after the first visit. Network first when online, cached copy otherwise.
const CACHE = 'yaanstep-drafts-v1';
const PAGES = ['/maths-draft.html', '/reading-draft.html'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PAGES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !PAGES.includes(u.pathname)) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(u.pathname, copy)); return r; }).catch(() => caches.match(u.pathname)));
});
