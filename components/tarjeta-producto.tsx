import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { IconoWhatsapp } from "@/components/iconos";
import { CATEGORIAS, type Categoria } from "@/lib/categorias";
import { formatoPrecio } from "@/lib/formato";
import { enlaceWhatsapp, mensajeProducto } from "@/lib/site";
import { cn } from "@/lib/utils";

export type ProductoTarjeta = {
  id: string;
  slug: string;
  nombre: string;
  marca: string;
  categoria: Categoria;
  resumen: string;
  precio: number | null;
  precioAnterior: number | null;
  estado: "DISPONIBLE" | "A_PEDIDO" | "AGOTADO";
  nuevo: boolean;
  foto: string | null;
  alt: string;
};

/** Precio o "Consultar precio"; el anterior va tachado si es mayor. */
export function Precio({ p, grande = false }: { p: Pick<ProductoTarjeta, "precio" | "precioAnterior">; grande?: boolean }) {
  if (p.precio == null) {
    return (
      <p className={cn("font-display font-bold tracking-wide text-white uppercase", grande ? "text-3xl" : "text-xl")}>
        Consultar precio
      </p>
    );
  }
  const rebaja = p.precioAnterior && p.precioAnterior > p.precio ? p.precioAnterior : null;
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn("font-display font-bold text-white", grande ? "text-4xl" : "text-2xl")}>{formatoPrecio(p.precio)}</span>
      {rebaja && <span className="text-sm text-slate-500 line-through">{formatoPrecio(rebaja)}</span>}
    </p>
  );
}

export function TarjetaProducto({ producto: p, titulo = "h3" }: { producto: ProductoTarjeta; titulo?: "h2" | "h3" }) {
  const Titulo = titulo;
  const url = `/productos/${p.slug}`;
  const descuento =
    p.precio && p.precioAnterior && p.precioAnterior > p.precio
      ? Math.round((1 - p.precio / p.precioAnterior) * 100)
      : null;

  return (
    <article className={cn("bg-graphite flex h-full flex-col border border-white/5", p.estado === "AGOTADO" && "opacity-60")}>
      {/* Las fotos de catálogo vienen sobre blanco: se muestran en un panel claro. */}
      <Link href={url} className="group relative block aspect-square overflow-hidden bg-white" tabIndex={-1} aria-hidden>
        {p.foto ? (
          <Image
            src={p.foto}
            alt={p.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center text-slate-300">
            <Package className="size-12" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {p.nuevo && <Etiqueta className="bg-brand text-white">Nuevo</Etiqueta>}
          {descuento && <Etiqueta className="bg-ink text-white">-{descuento}%</Etiqueta>}
          {p.estado === "A_PEDIDO" && <Etiqueta className="bg-amber-400 text-ink">A pedido</Etiqueta>}
          {p.estado === "AGOTADO" && <Etiqueta className="bg-slate-500 text-white">Agotado</Etiqueta>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-brand-bright text-[11px] font-bold tracking-[0.2em] uppercase">
          {p.marca} · {CATEGORIAS[p.categoria].corto}
        </p>
        <Titulo className="font-display mt-1 text-xl leading-tight font-bold text-white uppercase">
          <Link href={url} className="hover:text-brand-bright transition-colors">
            {p.nombre}
          </Link>
        </Titulo>
        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{p.resumen}</p>
        <div className="mt-auto pt-4">
          <Precio p={p} />
          <a
            href={enlaceWhatsapp(mensajeProducto(p.nombre))}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-ink mt-3 flex h-11 items-center justify-center gap-2 bg-[#25D366] text-base font-bold tracking-wider uppercase transition-colors hover:bg-[#3ae07a]"
          >
            <IconoWhatsapp className="size-5" /> Consultar
          </a>
        </div>
      </div>
    </article>
  );
}

function Etiqueta({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={cn("font-display px-2 py-0.5 text-xs font-bold tracking-wider uppercase", className)}>{children}</span>
  );
}
