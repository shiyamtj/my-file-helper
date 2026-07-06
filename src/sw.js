const CACHE_NAME = 'my-file-helper-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    self.registration.scope.then ? Promise.resolve() : Promise.resolve()
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const scopeUrl = new URL(self.registration.scope);
  const appBase = scopeUrl.pathname.endsWith('/') ? scopeUrl.pathname : `${scopeUrl.pathname}/`;
  const appShell = [appBase, `${appBase}index.html`];

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(appBase, copy);
            cache.put(`${appBase}index.html`, copy);
          });
          return response;
        })
        .catch(() =>
          caches.match(appBase).then((cached) => cached || caches.match(`${appBase}index.html`))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});
