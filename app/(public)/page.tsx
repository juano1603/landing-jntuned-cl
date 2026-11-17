import { Builds } from "@/components/sections/builds";
import { Contacto } from "@/components/sections/contacto";
import { Equipos } from "@/components/sections/equipos";
import { Hero } from "@/components/sections/hero";
import { Productos } from "@/components/sections/productos";
import { Servicios } from "@/components/sections/servicios";
import { Trabajos } from "@/components/sections/trabajos";
import { SERVICIOS } from "@/lib/contenido";
import { jsonLdNegocio, serializarJsonLd } from "@/lib/json-ld";

// ISR: los cambios del panel llegan con revalidatePath; esto es la red de seguridad.
export const revalidate = 300;

export default function InicioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarJsonLd(jsonLdNegocio(SERVICIOS)) }} />
      <Hero />
      <Builds />
      <Productos />
      <Trabajos />
      <Servicios />
      <Equipos />
      <Contacto />
    </>
  );
}
