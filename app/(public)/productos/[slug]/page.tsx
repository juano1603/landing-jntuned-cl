import { ChevronRight, Truck, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { IconoWhatsapp } from "@/components/iconos";
import { Precio, TarjetaProducto } from "@/components/tarjeta-producto";
import { CATEGORIAS } from "@/lib/categorias";
import { etiquetas } from "@/lib/formato";
import { jsonLdProducto, serializarJsonLd } from "@/lib/json-ld";
import {
  aTarjeta,
  altProducto,
  descripcionSeo,
  obtenerPorSlug,
  relacionados,
  tituloSeo,
} from "@/lib/productos";
import { enlaceWhatsapp, mensajeProducto, siteUrl } from "@/lib/site";

import { FotosProducto } from "./fotos-producto";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

// Sin fichas en build: cada una se genera en su primera visita y queda en
// caché (ISR) hasta que el panel la revalide.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await obtenerPorSlug(slug);
  if (!p) return { title: "Producto no encontrado", robots: { index: false } };

  const titulo = tituloSeo(p);
  const descripcion = descripcionSeo(p);
  const foto = p.imagenes[0]?.url;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: `/productos/${p.slug}` },
    openGraph: {
      type: "website",
      title: `${titulo} | JNTUNED`,
      description: descripcion,
      url: `${siteUrl}/productos/${p.slug}`,
      ...(foto && { images: [{ url: foto, alt: altProducto(p) }] }),
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const p = await obtenerPorSlug(slug);
  if (!p) notFound();

  const otros = await relacionados(p);
  const categoria = CATEGORIAS[p.categoria];

  return (
    <article className="pt-24 pb-20 sm:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializarJsonLd(jsonLdProducto(p, descripcionSeo(p))) }}
      />
      <div className="section-shell">
        <nav aria-label="Migas" className="mb-6 flex flex-wrap items-center gap-1 text-xs tracking-wider text-slate-500 uppercase">
          <Link href="/" className="hover:text-white">
            Inicio
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/productos" className="hover:text-white">
            Productos
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-slate-300">{p.nombre}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <FotosProducto fotos={p.imagenes.map((img, i) => ({ url: img.url, alt: altProducto(p, i) }))} />

          <div>
            <p className="text-brand-bright text-xs font-bold tracking-[0.2em] uppercase">
              {p.marca} · {categoria.label}
            </p>
            <h1 className="font-display mt-2 text-4xl leading-none font-bold text-white uppercase sm:text-5xl">{p.nombre}</h1>
            <p className="mt-4 text-lg text-slate-300">{p.resumen}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Precio p={p} grande />
              {p.nuevo && <Etiqueta className="bg-brand text-white">Nuevo</Etiqueta>}
              {p.estado !== "DISPONIBLE" && (
                <Etiqueta className={p.estado === "A_PEDIDO" ? "text-ink bg-amber-400" : "bg-slate-500 text-white"}>
                  {etiquetas.estado[p.estado]}
                </Etiqueta>
              )}
            </div>

            <a
              href={enlaceWhatsapp(mensajeProducto(p.nombre))}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-ink mt-6 flex h-14 items-center justify-center gap-2 bg-[#25D366] text-lg font-bold tracking-wider uppercase transition-colors hover:bg-[#3ae07a] sm:w-fit sm:px-10"
            >
              <IconoWhatsapp className="size-6" />
              {p.precio == null ? "Consultar precio por WhatsApp" : "Comprar por WhatsApp"}
            </a>

            <ul className="mt-8 grid gap-3 border-t border-white/10 pt-6 text-sm text-slate-300 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <Wrench className="text-brand-light mt-0.5 size-5 shrink-0" />
                Instalación y mapa en nuestro taller de Temuco.
              </li>
              <li className="flex items-start gap-3">
                <Truck className="text-brand-light mt-0.5 size-5 shrink-0" />
                Despacho a todo Chile.
              </li>
            </ul>

            {p.descripcion && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <h2 className="font-display text-xl font-bold text-white uppercase">Descripción</h2>
                <div className="mt-3 space-y-3 text-slate-400">
                  {p.descripcion.split(/\n{2,}/).map((parrafo) => (
                    <p key={parrafo} className="whitespace-pre-line">
                      {parrafo}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Línea con las búsquedas de la categoría y las palabras clave del panel. */}
            <p className="mt-8 text-sm text-slate-500">
              {categoria.seo}
              {p.palabrasClave.length > 0 && ` También nos buscan por: ${p.palabrasClave.join(", ")}.`}
            </p>
          </div>
        </div>

        {otros.length > 0 && (
          <section className="mt-20" aria-labelledby="relacionados-title">
            <h2 id="relacionados-title" className="font-display mb-6 text-3xl font-bold text-white uppercase">
              Más {categoria.label.toLowerCase()}
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {otros.map((o) => (
                <li key={o.id}>
                  <TarjetaProducto producto={aTarjeta(o)} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}

function Etiqueta({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`font-display px-2.5 py-1 text-sm font-bold tracking-wider uppercase ${className}`}>{children}</span>;
}
