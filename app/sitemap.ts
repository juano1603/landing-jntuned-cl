import type { MetadataRoute } from "next";

import { db } from "@/lib/db";
import { siteUrl } from "@/lib/site";

// Se regenera cada hora: los productos nuevos entran al sitemap sin redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productos = await db.producto.findMany({ select: { slug: true, actualizadoEn: true } });

  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/productos`, changeFrequency: "weekly", priority: 0.9 },
    ...productos.map((p) => ({
      url: `${siteUrl}/productos/${p.slug}`,
      lastModified: p.actualizadoEn,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
