import { db } from "@/lib/db";

import { AvisoGuardado } from "./aviso-guardado";
import { PanelProductos } from "./panel-productos";

type Props = { searchParams: Promise<{ ok?: string }> };

export default async function ProductosAdminPage({ searchParams }: Props) {
  const { ok } = await searchParams;

  // El catálogo es chico: se trae todo y se filtra en el celular, sin esperar
  // a la red al cambiar de pestaña o buscar.
  const productos = await db.producto.findMany({
    include: { imagenes: { orderBy: { orden: "asc" }, take: 1 } },
    orderBy: [{ categoria: "asc" }, { orden: "asc" }, { creadoEn: "desc" }],
  });

  return (
    <>
      <AvisoGuardado ok={ok} />
      <PanelProductos
        productos={productos.map((p) => ({
          id: p.id,
          slug: p.slug,
          nombre: p.nombre,
          marca: p.marca,
          categoria: p.categoria,
          precio: p.precio,
          estado: p.estado,
          destacado: p.destacado,
          nuevo: p.nuevo,
          foto: p.imagenes[0]?.url ?? null,
        }))}
      />
    </>
  );
}
