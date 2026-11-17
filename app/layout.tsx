import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { VercelInsights } from "@/components/vercel-insights";
import { negocio, siteUrl } from "@/lib/site";
import "./globals.css";

// next/font auto-hospeda las fuentes en build: no hay requests a Google.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

// Títulos condensados en mayúscula (estilo HPTuners).
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: negocio.titulo, template: `%s | ${negocio.nombre}` },
  description: negocio.descripcion,
  applicationName: negocio.nombre,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, "max-image-preview": "large" } as Metadata["robots"],
  verification: { google: "oS3prLjKMYkHMyJYvO7qthSdK2mNd8L4QXJpU22Cnl0" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteUrl,
    siteName: negocio.nombre,
    title: negocio.titulo,
    description: negocio.descripcion,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Nissan Primera P11 de JNTUNED en pista de drag" }],
  },
  twitter: { card: "summary_large_image", title: negocio.titulo, description: negocio.descripcion, images: ["/og-image.jpg"] },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  other: {
    "geo.region": "CL-AR",
    "geo.placename": "Temuco",
    "geo.position": `${negocio.geo.lat};${negocio.geo.lng}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${inter.variable} ${barlow.variable}`}>
      <body>
        {children}
        <Toaster position="top-center" richColors />
        <VercelInsights />
      </body>
    </html>
  );
}
