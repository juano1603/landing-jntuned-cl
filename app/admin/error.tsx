"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

/**
 * Si algo falla en el panel (p. ej. se corta la conexión al guardar), se
 * muestra esto en vez de la pantalla de "Application error" de Next.
 */
export default function ErrorPanel({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-display text-brand text-sm font-bold uppercase">Algo salió mal</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-white uppercase">No se pudo completar</h1>
      <p className="text-suave mt-3 text-sm">
        Revisa tu conexión e inténtalo de nuevo. Si estabas subiendo fotos, prueba con menos a la vez.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={reset}
          className="bg-brand hover:bg-brand-light inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 font-bold text-white"
        >
          <RotateCcw className="size-4" /> Reintentar
        </button>
        <Link
          href="/admin"
          className="border-hairline inline-flex h-12 items-center justify-center rounded-2xl border px-6 font-semibold text-white"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
