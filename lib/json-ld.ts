import { CATEGORIAS } from "./categorias";
import { negocio, siteUrl } from "./site";

/**
 * Datos estructurados schema.org. Validar con el Rich Results Test de Google
 * antes de cada entrega.
 */
const absoluta = (url: string) => (url.startsWith("http") ? url : `${siteUrl}${url}`);

export function jsonLdNegocio(servicios: { titulo: string; linea: string }[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoRepair",
        "@id": `${siteUrl}/#negocio`,
        name: negocio.nombre,
        description: negocio.descripcion,
        url: siteUrl,
        logo: `${siteUrl}/logo-jntuned.png`,
        image: `${siteUrl}/og-image.jpg`,
        telephone: `+${negocio.whatsapp}`,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: negocio.ciudad,
          addressRegion: negocio.region,
          addressCountry: "CL",
        },
        geo: { "@type": "GeoCoordinates", latitude: negocio.geo.lat, longitude: negocio.geo.lng },
        areaServed: [
          { "@type": "City", name: "Temuco" },
          { "@type": "AdministrativeArea", name: "Región de La Araucanía" },
          { "@type": "Country", name: "Chile" },
        ],
        sameAs: [negocio.instagramUrl],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios",
          itemListElement: servicios.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.titulo, description: s.linea },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#web`,
        url: siteUrl,
        name: negocio.nombre,
        inLanguage: "es-CL",
        publisher: { "@id": `${siteUrl}/#negocio` },
      },
    ],
  };
}

type ProductoLd = {
  slug: string;
  nombre: string;
  marca: string;
  categoria: keyof typeof CATEGORIAS;
  precio: number | null;
  estado: "DISPONIBLE" | "A_PEDIDO" | "AGOTADO";
  imagenes: { url: string }[];
};

/**
 * Ficha de producto. El `Offer` va solo si hay precio: Google rechaza ofertas
 * sin precio, y un precio inventado sería peor.
 */
export function jsonLdProducto(p: ProductoLd, descripcion: string) {
  const url = `${siteUrl}/productos/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: p.nombre,
        description: descripcion,
        brand: { "@type": "Brand", name: p.marca },
        category: CATEGORIAS[p.categoria].label,
        image: p.imagenes.map((i) => absoluta(i.url)),
        url,
        ...(p.precio != null && {
          offers: {
            "@type": "Offer",
            price: p.precio,
            priceCurrency: "CLP",
            url,
            itemCondition: "https://schema.org/NewCondition",
            availability:
              p.estado === "AGOTADO"
                ? "https://schema.org/OutOfStock"
                : p.estado === "A_PEDIDO"
                  ? "https://schema.org/PreOrder"
                  : "https://schema.org/InStock",
            seller: { "@id": `${siteUrl}/#negocio` },
          },
        }),
      },
      jsonLdMigas([
        { nombre: "Inicio", url: siteUrl },
        { nombre: "Productos", url: `${siteUrl}/productos` },
        { nombre: p.nombre, url },
      ]),
    ],
  };
}

export function jsonLdMigas(migas: { nombre: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.nombre, item: m.url })),
  };
}

/** Serializa para `<script type="application/ld+json">` sin abrir la puerta a XSS. */
export function serializarJsonLd(datos: unknown) {
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}
