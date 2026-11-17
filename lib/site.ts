/**
 * Datos del negocio en un solo lugar: header, footer, JSON-LD y mensajes de
 * WhatsApp salen de acá.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jntuned.cl";

export const negocio = {
  nombre: "JNTUNED",
  titulo: "JNTUNED | Reprogramación de ECU y Engine Swaps en Temuco",
  descripcion:
    "Reprogramación de ECU, seteo FuelTech y RaceTec, engine swaps y diagnóstico con datalog en Temuco, Chile. Venta de ECUs FuelTech, wideband, wastegates y turbos.",
  ciudad: "Temuco",
  region: "Araucanía",
  geo: { lat: -38.7359, lng: -72.5904 },
  instagramUrl: "https://www.instagram.com/jntuned_cl",
  instagram: "@jntuned_cl",
  /** Número en formato internacional sin "+" (ej. 56912345678). */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "56949257974",
} as const;

/** Enlace de WhatsApp con mensaje prellenado. */
export function enlaceWhatsapp(mensaje = "Hola JNTUNED, quiero cotizar un proyecto"): string {
  return `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Mensaje prellenado del botón de WhatsApp de cada producto. */
export function mensajeProducto(nombre: string) {
  return `Hola JNTUNED, quiero consultar por ${nombre}`;
}

export const NAVEGACION = [
  { href: "/#builds", label: "Builds" },
  { href: "/productos", label: "Productos" },
  { href: "/#trabajos", label: "Trabajos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#contacto", label: "Contacto" },
];
