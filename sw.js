'use strict';
// Changer cette version si les fichiers mis en cache sont modifiés.
const CACHE_PREFIX = 'code-secret:' + self.registration.scope + ':';
const CACHE_NAME = CACHE_PREFIX + 'v1';
const FILES = [
  'index.html', 'style.css', 'game.js', 'api.js', 'app.js', 'pwa.js',
  'manifest.webmanifest', 'assets/icon-192.png', 'assets/icon-512.png',
  'assets/icon-maskable-512.png', 'assets/apple-touch-icon.png', 'assets/qr-code-secret.png'
];
const ROOT = new URL('./', self.location.href);
const PAGE = new URL('index.html', ROOT).href;
const ALLOWED = new Set(FILES.map(file => new URL(file, ROOT).href));

self.addEventListener('install', event => {
  // Les fichiers sont disponibles ensemble, sans remplacer une partie déjà ouverte.
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== ROOT.origin) return;
  const isPage = event.request.mode === 'navigate' &&
    (url.pathname === ROOT.pathname || url.pathname === new URL(PAGE).pathname);
  url.search = '';
  url.hash = '';
  const key = isPage ? PAGE : url.href;
  if (!isPage && !ALLOWED.has(key)) return;
  // Priorité au réseau ; repli sur les seuls fichiers du jeu en cas de coupure.
  // Le paramètre ?test=1 reste dans l’adresse : il active la même API, même hors ligne.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        await cache.put(key, response.clone());
        return response;
      }
      return await cache.match(key) || response;
    } catch {
      return await cache.match(key) || Response.error();
    }
  })());
});
