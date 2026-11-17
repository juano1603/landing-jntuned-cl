import type { Metadata } from "next";

import { CatalogoProductos } from "@/components/catalogo-productos";
import { TituloSeccion } from "@/components/titulo-seccion";
import { CATEGORIAS } from "@/lib/categorias";
import { jsonLdMigas, serializarJsonLd } from "@/lib/json-ld";
import { aTarjeta, listarCatalogo } from "@/lib/productos";
import { enlaceWhatsapp, siteUrl } from "@/lib/site";

export const revalidate = 300;

const titulo = "Productos FuelTech, Wideband y Turbos en Temuco";
const descripcion =
  "Venta de ECU FuelTech (FT300, FT450, FT550, FT600), sensores wideband, wastegates Turbosmart y PSR y turbos en Temuco y todo Chile. Instalación y mapa a medida.";

export const metadata: Metadata = {
  title: titulo,
  description: descripcion,
  alternates: { canonical: "/productos" },
  openGraph: { title: `${titulo} | JNTUNED`, description: descripcion, url: `${siteUrl}/productos` },
};

export default async function ProductosPage() {
  const productos = await listarCatalogo();
  const categorias = [...new Set(productos.map((p) => p.categoria))];

  const migas = jsonLdMigas([
    { nombre: "Inicio", url: siteUrl },
    { nombre: "Productos", url: `${siteUrl}/productos` },
  ]);

  return (
    <section className="pt-28 pb-20 sm:pt-32 sm:pb-28" aria-labelledby="catalogo-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializarJsonLd({ "@context": "https://schema.org", ...migas }) }}
      />
      <div className="section-shell">
        <TituloSeccion id="catalogo-title" as="h1" antetitulo="Tienda JNTUNED" titulo="Productos" />
        <p className="-mt-6 mb-10 max-w-2xl text-slate-400 sm:-mt-10">
          ECUs FuelTech, wideband, wastegates y turbos con despacho a todo Chile. Si lo compras con nosotros, lo instalamos y lo
          dejamos mapeado en Temuco. ¿Dudas de compatibilidad?{" "}
          <a href={enlaceWhatsapp("Hola JNTUNED, tengo una consulta sobre un producto")} target="_blank" rel="noopener noreferrer" className="text-brand-bright underline underline-offset-4">
            Escríbenos
          </a>
          .
        </p>

        {productos.length === 0 ? (
          <p className="text-slate-400">Pronto vas a ver acá nuestros productos.</p>
        ) : (
          <CatalogoProductos productos={productos.map(aTarjeta)} titulosH2 />
        )}

        {/* Texto con las búsquedas de cada categoría: Google indexa el texto visible. */}
        {categorias.length > 0 && (
          <div className="mt-16 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2">
            {categorias.map((c) => (
              <div key={c}>
                <h2 className="font-display text-lg font-bold text-white uppercase">{CATEGORIAS[c].label}</h2>
                <p className="mt-1 text-sm text-slate-400">{CATEGORIAS[c].seo}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
