import { enlaceWhatsapp, negocio } from "@/lib/site";

export function Contacto() {
  return (
    <section id="contacto" className="scroll-mt-16 py-20 sm:py-28" aria-labelledby="contacto-title">
      <div className="section-shell flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow mb-2">Contacto</p>
          <h2 id="contacto-title" className="font-display text-5xl leading-[0.95] font-bold text-white uppercase sm:text-7xl">
            ¿Qué le hacemos
            <br />a tu auto?
          </h2>
          <p className="mt-5 text-slate-400">Temuco, Región de La Araucanía. Envíos de productos a todo Chile.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a href={enlaceWhatsapp()} target="_blank" rel="noopener noreferrer" className="btn-primario px-8 py-4 text-xl">
            Escríbenos por WhatsApp
          </a>
          <a href={negocio.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-secundario px-8 py-4 text-xl">
            {negocio.instagram}
          </a>
        </div>
      </div>
    </section>
  );
}
