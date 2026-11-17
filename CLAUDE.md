# CLAUDE.md — JNTUNED

Lo general (stack, reglas, Vercel, entorno) está en `C:\Proyectos_Personales\CLAUDE.md`.
Aquí solo va lo propio de este proyecto.

## Cliente

**JNTUNED** (Juan, el dueño del proyecto): reprogramación de ECU (FuelTech, RaceTec, Tactrix,
HP Tuners), engine swaps, diagnóstico con datalog y venta de productos de performance.
Temuco, Araucanía. Sitio publicado en **https://jntuned.cl** (sin www: `www` redirige 308).

- WhatsApp: **+56 9 4925 7974** (`56949257974`, fallback en `lib/site.ts`).
- Instagram: `@jntuned_cl`.
- Google Search Console: propiedad de **dominio** `jntuned.cl` (TXT en el DNS de Vercel). La
  etiqueta `google-site-verification` también va en `app/layout.tsx`.

## Identidad (estilo HPTuners)

- Fondo casi negro `ink #07090d`, `carbon`, `graphite`, `steel`; acento azul `brand #2563eb`
  (`brand-light #3b82f6`, `brand-bright #60a5fa`). Tokens en `app/globals.css`.
- Títulos **Barlow Condensed** en mayúscula (`font-display`), texto **Inter**. Botones rectos
  (`.btn-primario`, `.btn-secundario`). Poco texto: una línea por tarjeta.
- Logo `public/logo-jntuned.png` (gris claro sobre transparente: va directo sobre el fondo oscuro).

## Landing (`app/(public)/page.tsx`)

Hero (foto del P11) → Builds → **Productos** (vitrina desde la BD) → Trabajos (galería con
lightbox y videos) → Servicios → Equipos → Contacto. Builds, trabajos, servicios y stats se
editan en **`lib/contenido.ts`** (no pasan por el panel). Fotos en `public/img/trabajos/*.webp`
(1600 px); videos en `public/videos/` (mp4 720p sin audio + jpg de portada).

## Tienda

- `/productos`: catálogo completo con pestañas (FuelTech, Wideband, Wastegates, Turbos).
- `/productos/[slug]`: ficha con galería, precio o **"Consultar precio"** si `precio` es null,
  botón de WhatsApp con el nombre del producto, JSON-LD `Product` (el `Offer` solo va si hay
  precio) + `BreadcrumbList`. ISR on-demand (`generateStaticParams` vacío).
- SEO de productos: título/descripción automáticos (`lib/productos.ts`: `tituloSeo`,
  `descripcionSeo`) o los del panel; textos por categoría con las búsquedas en `lib/categorias.ts`.
  Las palabras clave van en texto visible y `alt`, nunca en `meta keywords`.
- Las fotos iniciales salieron del catálogo del proveedor de Juan. **No mencionar al proveedor
  en ninguna parte** y **no usar fotos con su marca de agua** (no se editan: se pide foto propia).
- Carrito y pago online: fase siguiente.

## Panel `/admin` (PWA, calcado de `automotriz_flores-cl`)

- **Productos** (CRUD de `Producto` + `ProductoImagen`): resumen por estado y "Sin precio",
  buscador, pestañas por categoría, estado en un toque (Disponible / A pedido / Agotado),
  estrella de destacado, formulario con precio opcional, sección plegable "Google" con vista
  previa del resultado de búsqueda.
- Fotos a Blob `productos/<slug>/...`; sin token, a `public/uploads` (ignorado por git). Las del
  seed (`/img/productos/...`) son archivos del repo y nunca se borran.
- Manifest `public/admin-app/manifest.webmanifest`, service worker `public/admin-sw.js`.

## Desarrollo

```bash
npm run db:up          # Postgres 16 en Docker, puerto 5439 (contenedor jntuned-pg)
npm run db:migrate
SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... SEED_PRODUCTOS=1 npm run db:seed
npm run dev
```

`SEED_PRODUCTOS=1` carga los 16 productos iniciales **sin precio**; el upsert no pisa lo editado.

## Publicación (pendiente: el sitio en producción todavía es el Astro de `master`)

1. Vercel → proyecto `landing-jntuned-cl` → **Framework Preset: Next.js** (hoy está en Astro).
2. Neon desde Marketplace + Blob **público**; `AUTH_SECRET`, `AUTH_TRUST_HOST=true`.
   No poner `NEXT_PUBLIC_SITE_URL` (el fallback ya es `https://jntuned.cl`).
3. Primer deploy con `SEED_EN_BUILD=1`, `SEED_PRODUCTOS=1`, `SEED_ADMIN_EMAIL`,
   `SEED_ADMIN_PASSWORD`; después borrar las `SEED_*` y redesplegar.
4. Search Console: reenviar el sitemap como `sitemap.xml` (`/sitemap-index.xml` redirige).

## Pendiente del cliente

- Precios de los productos (desde el panel).
- Fotos de los builds sin foto (Legacy GT, Evo, Legacy BP5, Swift).
