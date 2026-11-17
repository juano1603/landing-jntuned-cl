"use client";

import { Package, Plus, Search, Star, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useMemo, useOptimistic, useState, useTransition } from "react";

import { InstalarApp } from "@/app/admin/instalar-app";
import { PESTANAS, type Pestana } from "@/lib/categorias";
import { cn } from "@/lib/utils";

import { TarjetaProductoAdmin, type ProductoPanel } from "./tarjeta-producto-admin";

type Filtro = "TODOS" | "SIN_PRECIO" | ProductoPanel["estado"];
type Cambio = { id: string } & Partial<Pick<ProductoPanel, "estado" | "destacado">>;

export function PanelProductos({ productos }: { productos: ProductoPanel[] }) {
  const reducir = useReducedMotion();
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [pestana, setPestana] = useState<Pestana>("TODO");
  const [busqueda, setBusqueda] = useState("");
  const [, startTransition] = useTransition();

  // Los cambios rápidos (estado, estrella) se ven al tiro, antes de que
  // responda el servidor.
  const [lista, aplicar] = useOptimistic(productos, (actual, cambio: Cambio) =>
    actual.map((p) => (p.id === cambio.id ? { ...p, ...cambio } : p)),
  );

  const cuenta = useMemo(
    () => ({
      DISPONIBLE: lista.filter((p) => p.estado === "DISPONIBLE").length,
      A_PEDIDO: lista.filter((p) => p.estado === "A_PEDIDO").length,
      AGOTADO: lista.filter((p) => p.estado === "AGOTADO").length,
      sinPrecio: lista.filter((p) => p.precio == null).length,
      destacados: lista.filter((p) => p.destacado && p.estado !== "AGOTADO").length,
    }),
    [lista],
  );

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const categorias = PESTANAS.find((p) => p.valor === pestana)?.categorias as readonly string[] | null;
    return lista
      .filter((p) =>
        filtro === "TODOS" ? true : filtro === "SIN_PRECIO" ? p.precio == null : p.estado === filtro,
      )
      .filter((p) => !categorias || categorias.includes(p.categoria))
      .filter((p) => !q || `${p.marca} ${p.nombre}`.toLowerCase().includes(q));
  }, [lista, filtro, pestana, busqueda]);

  function cambiar(cambio: Cambio, accion: () => Promise<void>) {
    startTransition(async () => {
      aplicar(cambio);
      await accion();
    });
  }

  const alternar = (f: Filtro) => setFiltro(filtro === f ? "TODOS" : f);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Tienda</p>
          <h1 className="font-display mt-3 text-4xl leading-none font-bold text-white uppercase sm:text-5xl">Tus productos</h1>
          <p className="text-suave mt-2 text-sm">Todo lo que cambies acá se ve al instante en el sitio.</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-brand hover:bg-brand-light hidden h-12 shrink-0 items-center gap-2 rounded-xl px-6 font-semibold text-white transition-colors md:inline-flex"
        >
          <Plus className="size-5" /> Agregar producto
        </Link>
      </div>

      <InstalarApp />

      {/* Resumen: también sirve de filtro */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Resumen valor={cuenta.DISPONIBLE} label="Disponibles" tono="verde" activo={filtro === "DISPONIBLE"} onClick={() => alternar("DISPONIBLE")} />
        <Resumen valor={cuenta.A_PEDIDO} label="A pedido" tono="ambar" activo={filtro === "A_PEDIDO"} onClick={() => alternar("A_PEDIDO")} />
        <Resumen valor={cuenta.AGOTADO} label="Agotados" tono="gris" activo={filtro === "AGOTADO"} onClick={() => alternar("AGOTADO")} />
        <Resumen valor={cuenta.sinPrecio} label="Sin precio" tono="azul" activo={filtro === "SIN_PRECIO"} onClick={() => alternar("SIN_PRECIO")} />
      </div>
      <p className="text-suave mt-3 flex items-center gap-1.5 text-xs">
        <Star className="text-brand-bright size-3.5 fill-current" />
        {cuenta.destacados === 0
          ? "Toca la estrella de un producto para mostrarlo primero en la portada."
          : `${cuenta.destacados} ${cuenta.destacados === 1 ? "destacado" : "destacados"} en la portada (se muestran hasta 8).`}
        {cuenta.sinPrecio > 0 && " Los que no tienen precio dicen \"Consultar precio\"."}
      </p>

      {/* Búsqueda y categorías */}
      <div className="bg-ink/85 sticky top-[calc(4rem+env(safe-area-inset-top))] z-20 -mx-4 mt-6 space-y-3 px-4 py-3 backdrop-blur-xl">
        <label className="relative block">
          <Search className="text-suave pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto o marca"
            className="bg-graphite border-hairline focus:border-brand h-12 w-full rounded-2xl border pr-10 pl-11 text-base text-white outline-none placeholder:text-white/30"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              aria-label="Borrar búsqueda"
              className="text-suave absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="-mx-4 overflow-x-auto px-4" role="tablist" aria-label="Categorías">
          <div className="bg-graphite border-hairline flex w-max rounded-2xl border p-1">
            {PESTANAS.map((p) => (
              <button
                key={p.valor}
                type="button"
                role="tab"
                aria-selected={pestana === p.valor}
                onClick={() => setPestana(p.valor)}
                className={cn(
                  "relative h-10 rounded-xl px-4 text-sm font-semibold whitespace-nowrap transition-colors",
                  pestana === p.valor ? "text-white" : "text-suave hover:text-white",
                )}
              >
                {pestana === p.valor && (
                  <motion.span
                    layoutId="pestana-activa"
                    className="bg-steel absolute inset-0 rounded-xl"
                    transition={{ type: "spring", bounce: 0.15, duration: reducir ? 0 : 0.4 }}
                  />
                )}
                <span className="relative">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="border-hairline mt-4 rounded-3xl border border-dashed px-6 py-16 text-center">
          <Package className="text-brand-bright mx-auto size-12" />
          <p className="mt-4 font-semibold text-white">
            {busqueda ? `No hay productos que coincidan con "${busqueda}".` : "No hay productos en esta vista."}
          </p>
          {lista.length === 0 && (
            <Link
              href="/admin/productos/nuevo"
              className="bg-brand hover:bg-brand-light mt-6 inline-flex h-12 items-center gap-2 rounded-xl px-6 font-semibold text-white"
            >
              <Plus className="size-5" /> Agregar el primero
            </Link>
          )}
        </div>
      ) : (
        <motion.ul layout={!reducir} className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibles.map((p) => (
              <motion.li
                key={p.id}
                layout={!reducir}
                initial={reducir ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducir ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <TarjetaProductoAdmin producto={p} onCambio={cambiar} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

const TONOS = {
  verde: { punto: "bg-emerald-400", activo: "border-emerald-400/60 bg-emerald-400/10" },
  ambar: { punto: "bg-amber-400", activo: "border-amber-400/60 bg-amber-400/10" },
  gris: { punto: "bg-slate-400", activo: "border-white/40 bg-white/10" },
  azul: { punto: "bg-brand-light", activo: "border-brand-light/60 bg-brand/10" },
};

function Resumen({
  valor,
  label,
  tono,
  activo,
  onClick,
}: {
  valor: number;
  label: string;
  tono: keyof typeof TONOS;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={cn(
        "bg-graphite border-hairline relative overflow-hidden rounded-2xl border p-4 text-left transition-colors active:scale-[0.98]",
        activo && TONOS[tono].activo,
      )}
    >
      <span className="text-suave flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase sm:text-xs">
        <span className={cn("size-2 shrink-0 rounded-full", TONOS[tono].punto)} />
        {label}
      </span>
      <motion.span
        key={valor}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display mt-1 block text-4xl font-bold text-white tabular-nums"
      >
        {valor}
      </motion.span>
    </button>
  );
}
