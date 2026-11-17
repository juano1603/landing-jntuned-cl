"use client";

import { Download, Share, SquarePlus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type EventoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const CLAVE = "panel-instalar-cerrado";

/**
 * Invita a instalar el panel como app. En Android/Chrome usa el diálogo
 * nativo; en iPhone (Safari no lo tiene) explica los dos toques necesarios.
 */
export function InstalarApp() {
  const [evento, setEvento] = useState<EventoInstalar | null>(null);
  const [esIos, setEsIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const instalada =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    let cerrado = false;
    try {
      cerrado = localStorage.getItem(CLAVE) === "1";
    } catch {}
    if (instalada || cerrado) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setEsIos(ios);
    if (ios) setVisible(true);

    const alOfrecer = (e: Event) => {
      e.preventDefault();
      setEvento(e as EventoInstalar);
      setVisible(true);
    };
    const alInstalar = () => setVisible(false);
    window.addEventListener("beforeinstallprompt", alOfrecer);
    window.addEventListener("appinstalled", alInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", alOfrecer);
      window.removeEventListener("appinstalled", alInstalar);
    };
  }, []);

  function cerrar() {
    setVisible(false);
    try {
      localStorage.setItem(CLAVE, "1");
    } catch {}
  }

  async function instalar() {
    if (!evento) return;
    await evento.prompt();
    const { outcome } = await evento.userChoice;
    if (outcome === "accepted") setVisible(false);
    setEvento(null);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="from-brand to-brand-deep relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white">
            
            <button
              type="button"
              onClick={cerrar}
              aria-label="No mostrar más"
              className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/15 hover:bg-black/25"
            >
              <X className="size-4" />
            </button>
            <p className="font-display pr-10 text-xl font-bold uppercase">Instala el panel en tu celular</p>
            {esIos ? (
              <p className="mt-2 text-sm leading-relaxed text-white/90">
                Toca <Share className="mx-0.5 inline size-4 align-[-3px]" /> <b>Compartir</b> abajo en Safari y luego{" "}
                <SquarePlus className="mx-0.5 inline size-4 align-[-3px]" /> <b>Agregar a inicio</b>. Queda como una
                app más, con su ícono.
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  Queda con su ícono en la pantalla de inicio y se abre directo, sin buscar la página.
                </p>
                <button
                  type="button"
                  onClick={instalar}
                  className="text-brand mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold"
                >
                  <Download className="size-4" /> Instalar app
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
