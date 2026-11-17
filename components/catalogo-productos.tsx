"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import { TarjetaProducto, type ProductoTarjeta } from "@/components/tarjeta-producto";
import { PESTANAS, type Pestana } from "@/lib/categorias";
import { cn } from "@/lib/utils";

/**
 * Grilla de productos con pestañas por categoría. Todo el catálogo viene en el
 * HTML (Google lo lee completo); las pestañas solo filtran en el navegador.
 */
export function CatalogoProductos({ productos, titulosH2 = false }: { productos: ProductoTarjeta[]; titulosH2?: boolean }) {
  const reducir = useReducedMotion();
  const [pestana, setPestana] = useState<Pestana>("TODO");

  // Solo se muestran las pestañas que tienen productos.
  const disponibles = PESTANAS.filter(
    (p) => p.categorias === null || productos.some((x) => (p.categorias as readonly string[]).includes(x.categoria)),
  );

  const visibles = useMemo(() => {
    const p = PESTANAS.find((x) => x.valor === pestana);
    if (!p?.categorias) return productos;
    return productos.filter((x) => (p.categorias as readonly string[]).includes(x.categoria));
  }, [productos, pestana]);

  return (
    <div>
      <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Categorías">
        <div className="flex w-max gap-2">
          {disponibles.map((p) => (
            <button
              key={p.valor}
              type="button"
              role="tab"
              aria-selected={pestana === p.valor}
              onClick={() => setPestana(p.valor)}
              className={cn(
                "font-display h-10 border px-4 text-sm font-semibold tracking-wider whitespace-nowrap uppercase transition-colors",
                pestana === p.valor
                  ? "bg-brand border-brand text-white"
                  : "border-white/15 text-slate-300 hover:border-white/40 hover:text-white",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <motion.ul layout={!reducir} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibles.map((p) => (
            <motion.li
              key={p.id}
              layout={!reducir}
              initial={reducir ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducir ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <TarjetaProducto producto={p} titulo={titulosH2 ? "h2" : "h3"} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
