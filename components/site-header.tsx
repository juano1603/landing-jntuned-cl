"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { NAVEGACION, enlaceWhatsapp } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Transparente sobre el hero; sólido apenas se hace scroll. */
export function SiteHeader() {
  const [solido, setSolido] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const alScroll = () => setSolido(window.scrollY > 40);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        (solido || abierto) && "bg-ink/95 border-b border-white/10 backdrop-blur",
      )}
    >
      <div className="section-shell flex h-16 items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="JNTUNED inicio" onClick={() => setAbierto(false)}>
          <Image src="/logo-jntuned.png" alt="JNTUNED" width={140} height={27} priority className="h-6 w-auto sm:h-7" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {NAVEGACION.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-[15px] font-semibold tracking-wider text-slate-300 uppercase transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={enlaceWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display bg-brand hover:bg-brand-light hidden px-5 py-2 text-[15px] font-bold tracking-wider text-white uppercase transition-colors sm:inline-flex"
          >
            Cotizar
          </a>
          <button
            type="button"
            className="flex size-10 items-center justify-center text-slate-200 md:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav id="menu-movil" className="border-t border-white/10 px-4 py-4 md:hidden" aria-label="Menú móvil">
          {NAVEGACION.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setAbierto(false)}
              className="font-display block py-3 text-xl font-semibold tracking-wider text-slate-200 uppercase"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={enlaceWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display bg-brand mt-3 block py-3 text-center text-lg font-bold tracking-wider text-white uppercase"
          >
            Cotizar por WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
