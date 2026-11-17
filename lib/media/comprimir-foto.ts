/**
 * Achica una foto en el navegador antes de subirla.
 *
 * Vercel corta con 413 cualquier petición de más de 4,5 MB (sin importar el
 * `bodySizeLimit` de las Server Actions), y una foto de celular pesa 3–6 MB:
 * sin esto, guardar con fotos rompe el panel. El servidor igual la pasa por
 * sharp a 1600 px, así que reducirla aquí al mismo tamaño no pierde calidad.
 */

/** Tope práctico por petición (Vercel corta en 4,5 MB; se deja margen para los textos). */
export const MAX_SUBIDA = 4 * 1024 * 1024;

const LADO_MAX = 1600;
const CALIDAD = 0.82;

export async function comprimirFoto(archivo: File): Promise<File> {
  if (!archivo.type.startsWith("image/") || archivo.type === "image/gif") return archivo;

  try {
    // createImageBitmap respeta la orientación EXIF (fotos del celular giradas).
    const bitmap = await createImageBitmap(archivo, { imageOrientation: "from-image" });
    const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
    const ancho = Math.round(bitmap.width * escala);
    const alto = Math.round(bitmap.height * escala);

    const canvas = document.createElement("canvas");
    canvas.width = ancho;
    canvas.height = alto;
    const ctx = canvas.getContext("2d");
    if (!ctx) return archivo;
    ctx.drawImage(bitmap, 0, 0, ancho, alto);
    bitmap.close();

    // Safari antiguo no genera WebP (devuelve PNG): en ese caso, JPEG.
    let blob = await aBlob(canvas, "image/webp");
    if (!blob || blob.type !== "image/webp") blob = await aBlob(canvas, "image/jpeg");
    if (!blob || blob.size >= archivo.size) return archivo;

    const extension = blob.type === "image/webp" ? "webp" : "jpg";
    const nombre = archivo.name.replace(/\.[^.]+$/, "") || "foto";
    return new File([blob], `${nombre}.${extension}`, { type: blob.type, lastModified: Date.now() });
  } catch {
    // Formato que el navegador no sabe leer (p. ej. HEIC en Android): va tal cual.
    return archivo;
  }
}

function aBlob(canvas: HTMLCanvasElement, tipo: string): Promise<Blob | null> {
  return new Promise((resolver) => canvas.toBlob(resolver, tipo, CALIDAD));
}

export function megas(bytes: number) {
  return (bytes / 1024 / 1024).toLocaleString("es-CL", { maximumFractionDigits: 1 });
}
