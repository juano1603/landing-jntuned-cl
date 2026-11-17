import { EQUIPOS } from "@/lib/contenido";

export function Equipos() {
  return (
    <section id="equipos" className="scroll-mt-16 border-y border-white/10 py-14" aria-labelledby="equipos-title">
      <div className="section-shell">
        <h2 id="equipos-title" className="font-display mb-8 text-sm font-semibold tracking-[0.3em] text-slate-500 uppercase">
          Equipos con los que trabajamos
        </h2>
        <ul className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {EQUIPOS.map((e) => (
            <li key={e.nombre}>
              <p className="font-display text-3xl font-bold text-white uppercase">{e.nombre}</p>
              <p className="text-xs tracking-wider text-slate-500 uppercase">{e.tipo}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
