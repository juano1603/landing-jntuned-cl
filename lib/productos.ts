import "server-only";

import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { CATEGORIAS } from "@/lib/categorias";
import { db } from "@/lib/db";
import { negocio } from "@/lib/site";

/** Incluye siempre las fotos ordenadas: ninguna vista muestra un producto sin ellas. */
const conImagenes = {
  imagenes: { orderBy: { orden: "asc" } },
} satisfies Prisma.ProductoInclude;

export type ProductoConImagenes = Prisma.ProductoGetPayload<{ include: typeof conImagenes }>;

/** Orden de vitrina: destacados y nuevos primero, después el orden manual. */
const ordenVitrina: Prisma.ProductoOrderByWithRelationInput[] = [
  { destacado: "desc" },
  { nuevo: "desc" },
  { orden: "asc" },
  { creadoEn: "desc" },
];

/** Catálogo público: los agotados van al final, pero se muestran (sirven para SEO). */
export async function listarCatalogo() {
  const productos = await db.producto.findMany({ include: conImagenes, orderBy: ordenVitrina });
  return [...productos.filter((p) => p.estado !== "AGOTADO"), ...productos.filter((p) => p.estado === "AGOTADO")];
}

export function destacados(limite = 8) {
  return db.producto.findMany({
    where: { estado: { not: "AGOTADO" } },
    include: conImagenes,
    orderBy: ordenVitrina,
    take: limite,
  });
}

export function obtenerPorSlug(slug: string) {
  return db.producto.findUnique({ where: { slug }, include: conImagenes });
}

export function obtenerPorId(id: string) {
  return db.producto.findUnique({ where: { id }, include: conImagenes });
}

export function relacionados(producto: { id: string; categoria: ProductoConImagenes["categoria"] }, limite = 4) {
  return db.producto.findMany({
    where: { id: { not: producto.id }, categoria: producto.categoria, estado: { not: "AGOTADO" } },
    include: conImagenes,
    orderBy: ordenVitrina,
    take: limite,
  });
}

// --- SEO ------------------------------------------------------------------------

type DatosSeo = Pick<ProductoConImagenes, "nombre" | "marca" | "categoria" | "resumen" | "seoTitulo" | "seoDescripcion">;

/** "FuelTech FT450 en Temuco · Venta e instalación" (la plantilla del layout agrega "| JNTUNED"). */
export function tituloSeo(p: DatosSeo) {
  return p.seoTitulo?.trim() || `${p.nombre} en Temuco · Venta e instalación`;
}

export function descripcionSeo(p: DatosSeo) {
  if (p.seoDescripcion?.trim()) return p.seoDescripcion.trim();
  return `${p.nombre} ${p.marca !== p.nombre.split(" ")[0] ? `${p.marca} ` : ""}en ${negocio.ciudad}: ${p.resumen} ${CATEGORIAS[p.categoria].seo}`.slice(0, 300);
}

/** Texto alternativo de las fotos: nombre + palabras clave, sin repetir. */
export function altProducto(p: Pick<ProductoConImagenes, "nombre" | "categoria" | "palabrasClave">, indice = 0) {
  const extra = p.palabrasClave[0] ?? `${CATEGORIAS[p.categoria].singular} en Temuco`;
  return indice === 0 ? `${p.nombre} — ${extra}` : `${p.nombre}, foto ${indice + 1}`;
}

/** Datos planos para la tarjeta (se pasan a componentes de cliente). */
export function aTarjeta(p: ProductoConImagenes) {
  return {
    id: p.id,
    slug: p.slug,
    nombre: p.nombre,
    marca: p.marca,
    categoria: p.categoria,
    resumen: p.resumen,
    precio: p.precio,
    precioAnterior: p.precioAnterior,
    estado: p.estado,
    nuevo: p.nuevo,
    foto: p.imagenes[0]?.url ?? null,
    alt: altProducto(p),
  };
}

// --- Formulario del panel -------------------------------------------------------

const opcional = z
  .string()
  .trim()
  .transform((v) => v || null)
  .nullable()
  .optional();

/** Acepta "799.900" o "$ 799900"; vacío = sin precio ("Consultar precio"). */
const precioOpcional = z.preprocess(
  (v) => (typeof v === "string" ? v.replace(/[^\d]/g, "") || undefined : v),
  z.coerce.number({ message: "Precio inválido" }).int().min(1_000, "Precio inválido").max(100_000_000, "Precio inválido").optional(),
);

export const productoFormSchema = z.object({
  nombre: z.string().trim().min(2, "Requerido").max(90),
  marca: z.string().trim().min(1, "Requerido").max(40),
  categoria: z.enum(Object.keys(CATEGORIAS) as [keyof typeof CATEGORIAS, ...(keyof typeof CATEGORIAS)[]]),
  resumen: z.string().trim().min(5, "Escribe una línea corta").max(140, "Máximo 140 caracteres"),
  descripcion: opcional,
  precio: precioOpcional,
  precioAnterior: precioOpcional,
  estado: z.enum(["DISPONIBLE", "A_PEDIDO", "AGOTADO"]),
  destacado: z.boolean(),
  nuevo: z.boolean(),
  orden: z.preprocess((v) => (v === "" || v == null ? 0 : v), z.coerce.number().int().min(0).max(999)),
  seoTitulo: opcional.pipe(z.string().max(70, "Máximo 70 caracteres").nullable().optional()),
  seoDescripcion: opcional.pipe(z.string().max(160, "Máximo 160 caracteres").nullable().optional()),
  palabrasClave: z.array(z.string().trim().min(1).max(60)).max(10).default([]),
});

export type ProductoForm = z.infer<typeof productoFormSchema>;
