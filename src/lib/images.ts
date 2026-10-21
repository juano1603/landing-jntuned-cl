import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/trabajos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}',
  { eager: true },
);

// Busca una foto de src/assets/trabajos/ por nombre de archivo.
export function foto(nombre?: string): ImageMetadata | undefined {
  if (!nombre) return undefined;
  const img = files[`/src/assets/trabajos/${nombre}`]?.default;
  if (!img) throw new Error(`No existe la foto src/assets/trabajos/${nombre}`);
  return img;
}
