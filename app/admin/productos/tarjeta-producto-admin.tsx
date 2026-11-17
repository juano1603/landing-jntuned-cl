"use client";

import { ExternalLink, Package, Pencil, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORIAS, type Categoria } from "@/lib/categorias";
import { formatoPrecio } from "@/lib/formato";
import { cn } from "@/lib/utils";

import { alternarDestacado, cambiarEstado, eliminarProducto } from "./acciones";

export type EstadoProducto = "DISPONIBLE" | "A_PEDIDO" | "AGOTADO";

export type ProductoPanel = {
  id: string;
  slug: string;
  nombre: string;
  marca: string;
  categoria: Categoria;
  precio: number | null;
  estado: EstadoProducto;
  destacado: boolean;
  nuevo: boolean;
  foto: string | null;
};

const ESTADOS: { valor: EstadoProducto; label: string; activo: string; punto: string }[] = [
  { valor: "DISPONIBLE", label: "Disponible", activo: "bg-emerald-500 text-white", punto: "bg-emerald-400" },
  { valor: "A_PEDIDO", label: "A pedido", activo: "bg-amber-400 text-ink", punto: "bg-amber-400" },
  { valor: "AGOTADO", label: "Agotado", activo: "bg-white text-ink", punto: "bg-slate-300" },
];

type Cambio = { id: string } & Partial<Pick<ProductoPanel, "estado" | "destacado">>;

export function TarjetaProductoAdmin({
  producto: p,
  onCambio,
}: {
  producto: ProductoPanel;
  onCambio: (cambio: Cambio, accion: () => Promise<void>) => void;
}) {
  const [confirmar, setConfirmar] = useState(false);
  const [eliminando, startEliminar] = useTransition();
  const estado = ESTADOS.find((e) => e.valor === p.estado)!;
  const agotado = p.estado === "AGOTADO";

  return (
    <article
      className={cn(
        "bg-graphite border-hairline group relative overflow-hidden rounded-3xl border shadow-[0_20px_50px_-30px_rgb(0_0_0/.8)] transition-opacity",
        eliminando && "pointer-events-none opacity-40",
      )}
    >
      {/* Foto sobre blanco (así vienen las fotos de catálogo) */}
      <div className="relative aspect-[16/10] overflow-hidden bg-white">
        {p.foto ? (
          <Image
            src={p.foto}
            alt={p.nombre}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={cn("object-contain p-3", agotado && "opacity-50 grayscale")}
          />
        ) : (
          <div className="grid size-full place-items-center text-slate-300">
            <Package className="size-10" />
          </div>
        )}

        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          <span className={cn("size-2 rounded-full", estado.punto)} />
          {estado.label}
        </span>
        {p.nuevo && (
          <span className="bg-brand absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white">Nuevo</span>
        )}

        <button
          type="button"
          aria-pressed={p.destacado}
          aria-label={p.destacado ? "Quitar de la portada" : "Mostrar en la portada"}
          title={p.destacado ? "Destacado en la portada" : "Mostrar en la portada"}
          onClick={() => {
            const destacado = !p.destacado;
            onCambio({ id: p.id, destacado }, async () => {
              await alternarDestacado(p.id, destacado);
              toast.success(destacado ? "Ahora sale primero en la portada" : "Quitado de destacados", { description: p.nombre });
            });
          }}
          className={cn(
            "absolute top-2 right-2 grid size-11 place-items-center rounded-full backdrop-blur transition-all active:scale-90",
            p.destacado ? "bg-brand text-white" : "bg-black/50 text-white/80 hover:text-white",
          )}
        >
          <Star className={cn("size-5", p.destacado && "fill-current")} />
        </button>
      </div>

      <div className="p-4 pt-3">
        <p className="text-brand-bright text-[11px] font-bold tracking-[0.2em] uppercase">
          {p.marca} · {CATEGORIAS[p.categoria].corto}
        </p>
        <h2 className="font-display mt-0.5 truncate text-xl font-bold text-white uppercase">{p.nombre}</h2>
        {p.precio == null ? (
          <p className="mt-1 text-sm">
            <span className="bg-brand/15 text-brand-bright rounded-md px-2 py-0.5 text-xs font-semibold">Sin precio</span>{" "}
            <span className="text-suave">· sale “Consultar precio”</span>
          </p>
        ) : (
          <p className="font-display mt-1 text-2xl font-bold text-white">{formatoPrecio(p.precio)}</p>
        )}

        {/* Cambio de estado en un toque */}
        <div className="bg-ink mt-4 grid grid-cols-3 gap-1 rounded-2xl p-1" role="radiogroup" aria-label="Estado">
          {ESTADOS.map((e) => (
            <button
              key={e.valor}
              type="button"
              role="radio"
              aria-checked={p.estado === e.valor}
              onClick={() => {
                if (p.estado === e.valor) return;
                onCambio({ id: p.id, estado: e.valor }, async () => {
                  await cambiarEstado(p.id, e.valor);
                  toast.success(`Marcado como ${e.label.toLowerCase()}`, { description: p.nombre });
                });
              }}
              className={cn(
                "h-10 rounded-xl text-xs font-bold transition-colors",
                p.estado === e.valor ? e.activo : "text-suave hover:bg-white/5 hover:text-white",
              )}
            >
              {e.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/admin/productos/${p.id}`}
            className="bg-steel inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-colors hover:bg-white/15"
          >
            <Pencil className="size-4" /> {p.precio == null ? "Poner precio" : "Editar"}
          </Link>
          <Link
            href={`/productos/${p.slug}`}
            target="_blank"
            aria-label="Ver en el sitio"
            title="Ver en el sitio"
            className="border-hairline text-suave grid size-11 place-items-center rounded-xl border transition-colors hover:text-white"
          >
            <ExternalLink className="size-4" />
          </Link>
          <button
            type="button"
            aria-label="Eliminar"
            title="Eliminar"
            onClick={() => setConfirmar(true)}
            className="border-hairline text-suave grid size-11 place-items-center rounded-xl border transition-colors hover:border-red-400/40 hover:text-red-300"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <Dialog open={confirmar} onOpenChange={setConfirmar}>
        <DialogContent className="bg-graphite border-hairline">
          <DialogHeader>
            <DialogTitle>¿Eliminar {p.nombre}?</DialogTitle>
            <DialogDescription>
              Se borra del sitio junto con sus fotos y no se puede deshacer.
              {!agotado && " Si solo no tienes stock, es mejor marcarlo como Agotado o A pedido."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <button type="button" className="border-hairline h-11 rounded-xl border px-5 text-sm text-white">
                Cancelar
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={() => {
                setConfirmar(false);
                startEliminar(async () => {
                  await eliminarProducto(p.id);
                  toast.success("Producto eliminado", { description: p.nombre });
                });
              }}
              className="h-11 rounded-xl bg-red-500/15 px-5 text-sm font-semibold text-red-300 hover:bg-red-500/25"
            >
              Eliminar
            </button>
            {!agotado && (
              <button
                type="button"
                onClick={() => {
                  setConfirmar(false);
                  onCambio({ id: p.id, estado: "AGOTADO" }, async () => {
                    await cambiarEstado(p.id, "AGOTADO");
                    toast.success("Marcado como agotado", { description: p.nombre });
                  });
                }}
                className="text-ink h-11 rounded-xl bg-white px-5 text-sm font-semibold"
              >
                Marcar como agotado
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}
