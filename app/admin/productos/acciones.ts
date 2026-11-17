"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { EstadoProducto } from "@/generated/prisma/client";
import type { EstadoFormulario } from "@/app/admin/estado";
import { requerirAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { FotoInvalida, borrarFoto, subirFoto } from "@/lib/media/fotos";
import { productoFormSchema } from "@/lib/productos";
import { generarSlugUnico } from "@/lib/slug";

/**
 * Refresca todas las vistas públicas que muestran productos. Sin esto, el
 * admin edita, ve el cambio en el panel y NO en el sitio (que tiene ISR).
 */
function revalidar(slug?: string) {
  revalidatePath("/");
  revalidatePath("/productos");
  if (slug) revalidatePath(`/productos/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/productos");
}

function leerFormulario(datos: FormData) {
  return productoFormSchema.safeParse({
    nombre: datos.get("nombre"),
    marca: datos.get("marca"),
    categoria: datos.get("categoria"),
    resumen: datos.get("resumen"),
    descripcion: datos.get("descripcion") ?? "",
    precio: datos.get("precio") ?? "",
    precioAnterior: datos.get("precioAnterior") ?? "",
    estado: datos.get("estado"),
    destacado: datos.get("destacado") === "on",
    nuevo: datos.get("nuevo") === "on",
    orden: datos.get("orden") ?? "",
    seoTitulo: datos.get("seoTitulo") ?? "",
    seoDescripcion: datos.get("seoDescripcion") ?? "",
    palabrasClave: String(datos.get("palabrasClave") ?? "")
      .split(/[\n,]/)
      .map((l) => l.trim())
      .filter(Boolean),
  });
}

const errorDeValidacion = (error: { flatten: () => { fieldErrors: unknown } }): EstadoFormulario => ({
  error: "Revisa los campos marcados.",
  erroresPorCampo: error.flatten().fieldErrors as Record<string, string[]>,
});

/** `undefined` en Prisma significa "no tocar": se pasa null para que vaciar un campo de verdad lo borre. */
function aDatos(campos: ReturnType<typeof productoFormSchema.parse>) {
  return {
    ...campos,
    descripcion: campos.descripcion ?? null,
    precio: campos.precio ?? null,
    precioAnterior: campos.precioAnterior ?? null,
    seoTitulo: campos.seoTitulo ?? null,
    seoDescripcion: campos.seoDescripcion ?? null,
  };
}

/** Sube las fotos nuevas en el orden en que se eligieron. */
async function procesarFotos(datos: FormData, slug: string, desde: number) {
  const archivos = datos.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);

  const resultado: { url: string; pathname: string | null }[] = [];
  let i = desde;

  for (const archivo of archivos) resultado.push(await subirFoto(archivo, slug, i++));

  return resultado;
}

export async function crearProducto(_previo: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  await requerirAdmin();

  const validado = leerFormulario(datos);
  if (!validado.success) return errorDeValidacion(validado.error);
  const campos = validado.data;

  const slug = await generarSlugUnico(campos.nombre, async (c) => (await db.producto.count({ where: { slug: c } })) > 0);

  let fotos;
  try {
    fotos = await procesarFotos(datos, slug, 0);
  } catch (error) {
    if (error instanceof FotoInvalida) return { error: error.message };
    throw error;
  }

  if (fotos.length === 0) return { error: "Agrega al menos una foto." };

  await db.producto.create({
    data: {
      ...aDatos(campos),
      slug,
      imagenes: { create: fotos.map((f, orden) => ({ ...f, orden })) },
    },
  });

  revalidar(slug);
  redirect("/admin/productos?ok=creado");
}

export async function actualizarProducto(
  id: string,
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await requerirAdmin();

  const validado = leerFormulario(datos);
  if (!validado.success) return errorDeValidacion(validado.error);
  const campos = validado.data;

  const actual = await db.producto.findUnique({ where: { id }, include: { imagenes: true } });
  if (!actual) return { error: "Ese producto ya no existe." };

  // Fotos que se conservan, en el orden en que quedaron en el formulario.
  const conservadas = datos.getAll("existentes").map(String);
  const eliminadas = actual.imagenes.filter((img) => !conservadas.includes(img.id));

  let nuevas;
  try {
    nuevas = await procesarFotos(datos, actual.slug, actual.imagenes.length);
  } catch (error) {
    if (error instanceof FotoInvalida) return { error: error.message };
    throw error;
  }

  if (conservadas.length + nuevas.length === 0) return { error: "El producto tiene que quedar con al menos una foto." };

  await db.$transaction([
    db.producto.update({ where: { id }, data: aDatos(campos) }),
    db.productoImagen.deleteMany({ where: { id: { in: eliminadas.map((e) => e.id) } } }),
    ...conservadas.map((imgId, orden) => db.productoImagen.update({ where: { id: imgId }, data: { orden } })),
    db.productoImagen.createMany({
      data: nuevas.map((f, i) => ({ ...f, productoId: id, orden: conservadas.length + i })),
    }),
  ]);

  // Las fotos se borran DESPUÉS de guardar: si la escritura fallara, el
  // producto no quedaría apuntando a fotos inexistentes.
  await Promise.all(eliminadas.map((e) => borrarFoto(e)));

  revalidar(actual.slug);
  redirect("/admin/productos?ok=guardado");
}

/** Cambio rápido desde la tarjeta: disponible, a pedido o agotado. */
export async function cambiarEstado(id: string, estado: EstadoProducto) {
  await requerirAdmin();

  const actual = await db.producto.update({ where: { id }, data: { estado }, select: { slug: true } });

  revalidar(actual.slug);
}

/** Estrella de la tarjeta: los destacados salen primero en la portada. */
export async function alternarDestacado(id: string, destacado: boolean) {
  await requerirAdmin();

  const actual = await db.producto.update({ where: { id }, data: { destacado }, select: { slug: true } });

  revalidar(actual.slug);
}

export async function eliminarProducto(id: string) {
  await requerirAdmin();

  const producto = await db.producto.findUnique({ where: { id }, include: { imagenes: true } });
  if (!producto) return;

  await db.producto.delete({ where: { id } });

  await Promise.all(producto.imagenes.map((img) => borrarFoto(img)));
  revalidar(producto.slug);
}
