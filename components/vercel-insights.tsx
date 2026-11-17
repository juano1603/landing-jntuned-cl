"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";

/**
 * Fracción de visitas que envía métricas a Speed Insights: el plan Hobby
 * incluye 10.000 puntos de datos al mes entre todos los proyectos de la
 * cuenta y cada visita manda varias métricas.
 */
const TASA_MUESTREO_SPEED_INSIGHTS = 0.1;

/**
 * Analítica del sitio público. El panel de administración queda fuera a
 * propósito: son visitas internas que no dicen nada sobre cómo rinde el
 * sitio para los clientes.
 */
export function VercelInsights() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights sampleRate={TASA_MUESTREO_SPEED_INSIGHTS} />
    </>
  );
}
