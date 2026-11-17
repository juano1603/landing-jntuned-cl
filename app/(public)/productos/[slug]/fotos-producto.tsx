"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Foto principal sobre fondo claro + miniaturas para cambiarla. */
export function FotosProducto({ fotos }: { fotos: { url: string; alt: string }[] }) {
  const [actual, setActual] = useState(0);
  const foto = fotos[actual];
  if (!foto) return <div className="aspect-square bg-white" />;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image src={foto.url} alt={foto.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-6" />
      </div>
      {fotos.length > 1 && (
        <ul className="mt-2 grid grid-cols-5 gap-2">
          {fotos.map((f, i) => (
            <li key={f.url}>
              <button
                type="button"
                onClick={() => setActual(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === actual}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden border-2 bg-white transition-colors",
                  i === actual ? "border-brand-light" : "border-transparent hover:border-white/40",
                )}
              >
                <Image src={f.url} alt="" fill sizes="20vw" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
