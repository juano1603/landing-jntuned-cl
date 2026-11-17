import Image from "next/image";
import Link from "next/link";

import { STATS } from "@/lib/contenido";
import { enlaceWhatsapp } from "@/lib/site";

export function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden" aria-labelledby="hero-title">
      <Image
        src="/img/trabajos/nissan-primera-p11-drag.webp"
        alt="Nissan Primera P11 de JNTUNED acelerando en pista de drag"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[60%_center]"
      />
      <div className="from-ink via-ink/70 to-ink/10 absolute inset-0 bg-gradient-to-r" aria-hidden />
      <div className="from-ink to-ink/40 absolute inset-0 bg-gradient-to-t via-transparent" aria-hidden />

      <div className="section-shell relative pt-32 pb-16">
        <p className="font-display text-brand-bright mb-4 text-sm font-semibold tracking-[0.3em] uppercase">Temuco · Chile</p>
        <h1
          id="hero-title"
          className="font-display max-w-3xl text-5xl leading-[0.95] font-bold text-white uppercase sm:text-7xl lg:text-8xl"
        >
          Ingeniería aplicada <span className="text-brand-light">a tu motor</span>
        </h1>
        <p className="mt-5 max-w-md text-lg text-slate-300">Reprogramación de ECU, engine swaps y diagnóstico en Temuco.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={enlaceWhatsapp()} target="_blank" rel="noopener noreferrer" className="btn-primario">
            Cotizar proyecto
          </a>
          <Link href="/#builds" className="btn-secundario">
            Ver builds
          </Link>
        </div>

        <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/15 pt-6">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-bold text-white sm:text-4xl">{s.valor}</dd>
              <dd className="mt-1 text-xs tracking-wider text-slate-400 uppercase">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
