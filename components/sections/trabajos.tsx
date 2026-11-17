import { TituloSeccion } from "@/components/titulo-seccion";
import { TRABAJOS } from "@/lib/contenido";
import { negocio } from "@/lib/site";

import { Galeria } from "./galeria";

export function Trabajos() {
  return (
    <section id="trabajos" className="bg-carbon scroll-mt-16 py-20 sm:py-28" aria-labelledby="trabajos-title">
      <div className="section-shell">
        <TituloSeccion id="trabajos-title" antetitulo="Galería" titulo="Trabajos">
          <a
            href={negocio.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-base font-semibold tracking-wider text-slate-300 uppercase transition-colors hover:text-white"
          >
            Más en Instagram →
          </a>
        </TituloSeccion>
        <Galeria
          items={TRABAJOS.map((t) => ({
            ...t,
            alt: `${t.titulo}${t.detalle ? ` — ${t.detalle}` : ""} | Trabajo JNTUNED Temuco`,
          }))}
        />
      </div>
    </section>
  );
}
