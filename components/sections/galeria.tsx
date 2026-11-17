"use client";

import { Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Trabajo } from "@/lib/contenido";
import { cn } from "@/lib/utils";

type Item = Trabajo & { alt: string };

/**
 * Mosaico de trabajos con lightbox. Los videos de la grilla corren solos (sin
 * sonido) solo mientras están en pantalla, y nunca con movimiento reducido.
 */
export function Galeria({ items }: { items: Item[] }) {
  const [abierto, setAbierto] = useState<Item | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const grilla = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abierto) dialogo.current?.showModal();
  }, [abierto]);

  useEffect(() => {
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const videos = grilla.current?.querySelectorAll("video") ?? [];
    const observador = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && !reducir) v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.4 },
    );
    videos.forEach((v) => observador.observe(v));
    return () => observador.disconnect();
  }, []);

  return (
    <>
      <div ref={grilla} className="grid auto-rows-[180px] grid-flow-row-dense grid-cols-2 gap-2 sm:auto-rows-[240px] lg:grid-cols-4">
        {items.map((t) => (
          <button
            key={t.video ?? t.foto}
            type="button"
            onClick={() => setAbierto(t)}
            aria-label={`Ampliar ${t.video ? "video" : "foto"}: ${t.titulo}`}
            className={cn(
              "group bg-graphite focus-visible:ring-brand-light relative overflow-hidden text-left focus:outline-none focus-visible:ring-2",
              t.grande && "col-span-2 row-span-2",
            )}
          >
            {t.video ? (
              <>
                <video
                  src={`/videos/${t.video}.mp4`}
                  poster={`/videos/${t.video}.jpg`}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={t.alt}
                  className="size-full object-cover"
                />
                <span className="font-display bg-ink/80 absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 text-xs font-semibold tracking-wider text-white uppercase">
                  <Play className="size-2.5 fill-current" /> Video
                </span>
              </>
            ) : (
              <Image
                src={`/img/trabajos/${t.foto}`}
                alt={t.alt}
                fill
                sizes={t.grande ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                style={t.encuadre ? { objectPosition: t.encuadre } : undefined}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="from-ink/90 absolute inset-0 flex flex-col justify-end bg-gradient-to-t via-transparent to-transparent p-4 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
              <span className="font-display text-lg leading-tight font-bold text-white uppercase sm:text-xl">{t.titulo}</span>
              {t.detalle && <span className="text-brand-bright text-xs tracking-wider uppercase">{t.detalle}</span>}
            </div>
          </button>
        ))}
      </div>

      {abierto && (
        <dialog
          ref={dialogo}
          onClose={() => setAbierto(null)}
          onClick={(e) => e.target === dialogo.current && dialogo.current?.close()}
          className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/90"
        >
          <figure className="flex max-h-[90vh] max-w-[94vw] flex-col items-center">
            {abierto.video ? (
              <video src={`/videos/${abierto.video}.mp4`} controls autoPlay playsInline loop className="max-h-[84vh] max-w-[94vw]" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- tamaño natural dentro del lightbox
              <img src={`/img/trabajos/${abierto.foto}`} alt={abierto.alt} className="max-h-[84vh] max-w-[94vw] object-contain" />
            )}
            <figcaption className="font-display mt-3 text-center text-lg tracking-wider text-slate-200 uppercase">
              {abierto.titulo}
              {abierto.detalle ? ` — ${abierto.detalle}` : ""}
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={() => dialogo.current?.close()}
            aria-label="Cerrar"
            className="fixed top-4 right-4 flex size-11 items-center justify-center text-white"
          >
            <X className="size-7" />
          </button>
        </dialog>
      )}
    </>
  );
}
