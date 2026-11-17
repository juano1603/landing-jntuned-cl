import Link from "next/link";

import { CatalogoProductos } from "@/components/catalogo-productos";
import { TituloSeccion } from "@/components/titulo-seccion";
import { aTarjeta, destacados } from "@/lib/productos";

/** Vitrina de la portada: destacados, nuevos y en stock primero. */
export async function Productos() {
  const productos = await destacados(8);
  if (productos.length === 0) return null;

  return (
    <section id="productos" className="scroll-mt-16 border-t border-white/10 py-20 sm:py-28" aria-labelledby="productos-title">
      <div className="section-shell">
        <TituloSeccion id="productos-title" antetitulo="Tienda" titulo="Productos">
          <Link
            href="/productos"
            className="font-display text-base font-semibold tracking-wider text-slate-300 uppercase transition-colors hover:text-white"
          >
            Ver todos →
          </Link>
        </TituloSeccion>
        <p className="-mt-6 mb-8 max-w-2xl text-slate-400 sm:-mt-10">
          ECUs FuelTech, sensores wideband, wastegates y turbos. Te lo vendemos, lo instalamos y lo dejamos mapeado.
        </p>
        <CatalogoProductos productos={productos.map(aTarjeta)} />
        <div className="mt-8 flex justify-center">
          <Link href="/productos" className="btn-secundario">
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
