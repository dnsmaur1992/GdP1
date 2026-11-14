// Service Worker: App offline verfügbar machen.
// Die Seite selbst wird immer zuerst frisch vom Server geholt (am HTTP-Cache vorbei),
// nur offline kommt sie aus dem Speicher. VERSION bei jeder neuen Version erhöhen.
const VERSION = "nibble-v9";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/logo.svg",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.pathname.endsWith("version.json")) {            // Update-Prüfung: nie aus dem Cache
    e.respondWith(fetch(req, { cache: "no-store" }));
    return;
  }
  if (req.mode === "navigate") {                          // Seite: erst Netz ohne HTTP-Cache, offline aus dem Speicher
    e.respondWith(fetch(req.url, { cache: "no-store" }).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put("index.html", copy));
      return res;
    }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
