import "server-only";

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { del, put } from "@vercel/blob";
import sharp from "sharp";

/**
 * Subida y normalización de las fotos de los productos.
 *
 * En la base solo se guarda la URL pública y el pathname (para poder borrar).
 * Todas se normalizan a WebP de 1600 px de ancho: es lo que se ve bien en la
 * galería a pantalla completa sin castigar la carga en móvil.
 *
 * Sin `BLOB_READ_WRITE_TOKEN` (desarrollo local) las fotos se escriben en
 * `public/uploads`, para poder probar el panel sin cuenta de Vercel.
 */
const MAX_BYTES = 12 * 1024 * 1024;
const ANCHO = 1600;

export class FotoInvalida extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "FotoInvalida";
  }
}

async function normalizar(entrada: Buffer): Promise<Buffer> {
  try {
    return await sharp(entrada)
      // Aplica la orientación del EXIF: sin esto, las fotos de celular salen
      // giradas.
      .rotate()
      .resize({ width: ANCHO, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    // Cubre el caso del .pdf renombrado a .jpg, que el MIME no detecta.
    throw new FotoInvalida("Uno de los archivos no es una imagen válida.");
  }
}

async function guardar(nombre: string, datos: Buffer) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(nombre, datos, {
      access: "public",
      contentType: "image/webp",
    });
    return { url: blob.url, pathname: blob.pathname };
  }

  const destino = path.join(process.cwd(), "public", "uploads", nombre);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, datos);
  return { url: `/uploads/${nombre}`, pathname: null };
}

async function validarYNormalizar(archivo: File) {
  if (!archivo.type.startsWith("image/")) {
    throw new FotoInvalida("Solo se aceptan imágenes (JPG, PNG, WebP, HEIC).");
  }
  if (archivo.size > MAX_BYTES) {
    throw new FotoInvalida("Una de las imágenes supera los 12 MB.");
  }
  return normalizar(Buffer.from(await archivo.arrayBuffer()));
}

/** Sube un archivo que llegó desde el formulario del panel. */
export async function subirFoto(archivo: File, slug: string, indice: number) {
  const datos = await validarYNormalizar(archivo);
  // El timestamp cambia la URL en cada subida: no hay caché de CDN que invalidar.
  return guardar(`productos/${slug}/${Date.now()}-${indice}.webp`, datos);
}

/**
 * Borra una foto: en Blob por su pathname; las subidas locales (sin Blob) no
 * tienen pathname y se reconocen por la URL `/uploads/...`. Las fotos del seed
 * (`/img/productos/...`) son archivos del repo y nunca se borran.
 */
export async function borrarFoto(foto: { url: string; pathname: string | null }) {
  if (foto.pathname) {
    if (process.env.BLOB_READ_WRITE_TOKEN) await del(foto.pathname).catch(() => {});
    return;
  }
  if (process.env.BLOB_READ_WRITE_TOKEN || !foto.url.startsWith("/uploads/")) return;
  await rm(path.join(process.cwd(), "public", ...foto.url.split("/").filter(Boolean)), { force: true }).catch(() => {});
}
