import type { NextConfig } from "next";

/** Endpoint de Vercel Analytics y Speed Insights. */
const VERCEL_INSIGHTS = "https://va.vercel-scripts.com";

/** Orígenes de imágenes: Vercel Blob (fotos de productos subidas desde el panel). */
const IMAGENES = "https://*.public.blob.vercel-storage.com";

/**
 * `'unsafe-inline'` en script-src es necesario por el JSON-LD y el bootstrap
 * de Next. Endurecerlo con nonces obligaría a renderizado dinámico en todo.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} ${VERCEL_INSIGHTS}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${IMAGENES}`,
  "font-src 'self' data:",
  "media-src 'self'",
  `connect-src 'self' ${VERCEL_INSIGHTS}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },

  // sharp trae binarios nativos: se deja fuera del bundle del servidor.
  serverExternalPackages: ["sharp"],

  experimental: {
    optimizePackageImports: ["radix-ui", "lucide-react"],
    // Las fotos de un producto se suben juntas desde el panel.
    serverActions: { bodySizeLimit: "40mb" },
  },

  // El sitio Astro anterior publicaba el sitemap en otra ruta, que quedó
  // registrada en Search Console.
  async redirects() {
    return [
      { source: "/sitemap-index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-0.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        // El service worker del panel tiene que actualizarse apenas cambie.
        source: "/admin-sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
