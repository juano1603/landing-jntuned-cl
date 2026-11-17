/** Marcas diacríticas combinantes (tildes, diéresis, la virgulilla de la ñ). */
const DIACRITICOS = /[̀-ͯ]/g;

/**
 * Genera un slug a partir de un texto.
 *
 * "Toyota Hilux 2020 SRV" → "toyota-hilux-2020-srv"
 *
 * NFD descompone cada letra acentuada en letra base + marca diacrítica; al
 * descartar esas marcas quedan solo las letras. Eso cubre tildes, diéresis y
 * también la ñ, que se descompone en n + virgulilla.
 */
export function generarSlug(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(DIACRITICOS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Devuelve un slug libre, agregando un sufijo numérico si el base ya existe.
 * `existe` consulta el almacenamiento y se inyecta para no acoplar esto al
 * repositorio.
 */
export async function generarSlugUnico(
  nombre: string,
  existe: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = generarSlug(nombre) || "auto";

  if (!(await existe(base))) return base;

  for (let i = 2; i < 100; i++) {
    const candidato = `${base}-${i}`;
    if (!(await existe(candidato))) return candidato;
  }

  // Salida de emergencia; en la práctica no se llega acá.
  return `${base}-${Date.now()}`;
}
