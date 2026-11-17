import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Página no encontrada", robots: { index: false, follow: true } };

export default function NoEncontrada() {
  return (
    <section className="section-shell flex min-h-[80svh] flex-col justify-center pt-16">
      <p className="eyebrow">Error 404</p>
      <h1 className="font-display mt-2 text-6xl font-bold text-white uppercase sm:text-8xl">Fuera de mapa</h1>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn-primario">
          Volver al inicio
        </Link>
        <Link href="/productos" className="btn-secundario">
          Ver productos
        </Link>
      </div>
    </section>
  );
}
