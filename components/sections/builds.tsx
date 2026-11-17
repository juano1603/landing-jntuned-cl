import Image from "next/image";

import { Revelar } from "@/components/animado";
import { TituloSeccion } from "@/components/titulo-seccion";
import { BUILDS, type Build } from "@/lib/contenido";

export function Builds() {
  // Los builds con foto van como tarjeta grande; el resto, en una lista compacta debajo.
  const conFoto = BUILDS.filter((b) => b.foto);
  const sinFoto = BUILDS.filter((b) => !b.foto);

  return (
    <section id="builds" className="scroll-mt-16 py-20 sm:py-28" aria-labelledby="builds-title">
      <div className="section-shell">
        <TituloSeccion id="builds-title" antetitulo="Proyectos" titulo="Builds recientes" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {conFoto.map((b, i) => (
            <Revelar key={b.auto} retraso={i * 0.06}>
              <TarjetaBuild build={b} />
            </Revelar>
          ))}
        </div>
        {sinFoto.length > 0 && (
          <ul className="mt-3 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {sinFoto.map((b) => (
              <li key={b.auto} className="bg-carbon p-5">
                <p className="font-display text-xs font-semibold tracking-wider text-slate-500 uppercase">{b.tag}</p>
                <h3 className="font-display mt-1 text-xl leading-tight font-bold text-white uppercase">{b.auto}</h3>
                <p className="mt-1 text-sm text-slate-400">{b.motor}</p>
                <p className="font-display text-brand-bright mt-2 font-semibold tracking-wide uppercase">{b.resultado}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function TarjetaBuild({ build }: { build: Build }) {
  return (
    <article className="group bg-graphite relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:aspect-[3/4]">
      <Image
        src={`/img/trabajos/${build.foto}`}
        alt={`${build.auto} ${build.motor} — ${build.tag} JNTUNED Temuco`}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="from-ink via-ink/40 absolute inset-0 bg-gradient-to-t to-transparent" aria-hidden />

      <div className="absolute top-4 left-4 flex gap-2">
        {build.nuevo && (
          <span className="font-display bg-brand px-2.5 py-1 text-xs font-bold tracking-wider text-white uppercase">
            {typeof build.nuevo === "string" ? build.nuevo : "Nuevo"}
          </span>
        )}
        <span className="font-display bg-ink/80 px-2.5 py-1 text-xs font-semibold tracking-wider text-slate-200 uppercase backdrop-blur">
          {build.tag}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-2xl leading-tight font-bold text-white uppercase">{build.auto}</h3>
        <p className="mt-1 text-sm text-slate-400">{build.motor}</p>
        <p className="font-display text-brand-bright mt-3 border-t border-white/10 pt-3 text-lg font-semibold tracking-wide uppercase">
          {build.resultado}
        </p>
      </div>
    </article>
  );
}
