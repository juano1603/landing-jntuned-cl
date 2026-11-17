import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function EncabezadoFormulario({ antetitulo, titulo, detalle }: { antetitulo: string; titulo: string; detalle: string }) {
  return (
    <div className="mb-6">
      <Link
        href="/admin/productos"
        className="text-suave -ml-2 flex h-10 w-fit items-center gap-1.5 rounded-full px-2 text-sm hover:text-white"
      >
        <ArrowLeft className="size-4" /> Mis productos
      </Link>
      <p className="eyebrow mt-3">{antetitulo}</p>
      <h1 className="font-display mt-3 text-3xl leading-none font-bold text-white uppercase sm:text-4xl">{titulo}</h1>
      <p className="text-suave mt-2 text-sm">{detalle}</p>
    </div>
  );
}
