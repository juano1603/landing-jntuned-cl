import { Activity, Cog, Wrench, Zap } from "lucide-react";

import { Revelar } from "@/components/animado";
import { TituloSeccion } from "@/components/titulo-seccion";
import { SERVICIOS, type Servicio } from "@/lib/contenido";

const ICONOS: Record<Servicio["icono"], React.ComponentType<{ className?: string }>> = {
  ecu: Zap,
  swap: Cog,
  datalog: Activity,
  hardware: Wrench,
};

export function Servicios() {
  return (
    <section id="servicios" className="scroll-mt-16 py-20 sm:py-28" aria-labelledby="servicios-title">
      <div className="section-shell">
        <TituloSeccion id="servicios-title" antetitulo="Qué hacemos" titulo="Servicios" />
        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICIOS.map((s, i) => {
            const Icono = ICONOS[s.icono];
            return (
              <Revelar key={s.titulo} retraso={i * 0.06} className="bg-ink">
                <article className="hover:bg-carbon relative h-full p-7 transition-colors">
                  {s.nuevo && (
                    <span className="font-display bg-brand absolute top-5 right-5 px-2.5 py-1 text-xs font-bold tracking-wider text-white uppercase">
                      {typeof s.nuevo === "string" ? s.nuevo : "Nuevo"}
                    </span>
                  )}
                  <Icono className="text-brand-light size-7" />
                  <h3 className="font-display mt-6 text-2xl font-bold text-white uppercase">{s.titulo}</h3>
                  <p className="mt-2 text-sm text-slate-400">{s.linea}</p>
                </article>
              </Revelar>
            );
          })}
        </div>
      </div>
    </section>
  );
}
