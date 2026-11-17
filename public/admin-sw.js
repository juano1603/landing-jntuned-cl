/*
 * Service worker del panel (app instalable). Alcance: /admin/.
 *
 * No guarda en caché las páginas del panel (tienen sesión y datos en vivo):
 * solo los archivos estáticos con hash de Next y una pantalla "sin conexión".
 */
const VERSION = "panel-v2";
const SIN_CONEXION = "/admin-app/sin-conexion.html";
const PRECARGA = [SIN_CONEXION, "/admin-app/icono-logo-192.png"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECARGA)));
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const { request } = evento;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegación: siempre a la red; si no hay, la pantalla sin conexión.
  if (request.mode === "navigate") {
    evento.respondWith(fetch(request).catch(() => caches.match(SIN_CONEXION)));
    return;
  }

  // Estáticos inmutables de Next: caché primero (abre más rápido).
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/admin-app/")) {
    evento.respondWith(
      caches.match(request).then(
        (guardado) =>
          guardado ??
          fetch(request).then((respuesta) => {
            if (respuesta.ok) {
              const copia = respuesta.clone();
              caches.open(VERSION).then((c) => c.put(request, copia));
            }
            return respuesta;
          }),
      ),
    );
  }
});
