/* Würfeltafel – Service Worker
   Hält die App offline verfügbar. Bei jeder Änderung an Dateien CACHE_VERSION erhöhen. */
const CACHE_VERSION = "v1";
const CACHE = "wuerfeltafel-" + CACHE_VERSION;
const SHELL = [
  "/",
  "/404.html",
  "/manifest.webmanifest",
  "/assets/css/app.css",
  "/assets/js/app.js",
  "/assets/fonts/alegreya-latin-400-normal.woff2",
  "/assets/fonts/alegreya-latin-400-italic.woff2",
  "/assets/fonts/alegreya-latin-500-normal.woff2",
  "/assets/fonts/alegreya-latin-700-normal.woff2",
  "/assets/fonts/alegreya-sc-latin-500-normal.woff2",
  "/assets/fonts/alegreya-sc-latin-700-normal.woff2",
  "/assets/icons/favicon.svg",
  "/assets/icons/icon-192.png",
  "/assets/icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("wuerfeltafel-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Seiten: zuerst Netz (damit Updates ankommen), offline aus dem Cache
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && url.pathname === "/") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put("/", copy));
          }
          return res;
        })
        .catch(() => caches.match(url.pathname === "/" || url.pathname === "/index.html" ? "/" : "/404.html")
          .then((r) => r || caches.match("/")))
    );
    return;
  }

  // Dateien: Cache zuerst, im Hintergrund aktualisieren
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
