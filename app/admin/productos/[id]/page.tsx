import { notFound } from "next/navigation";

import { actualizarProducto } from "@/app/admin/productos/acciones";
import { EncabezadoFormulario } from "@/app/admin/productos/encabezado-formulario";
import { FormularioProducto } from "@/app/admin/productos/formulario";
import { obtenerPorId } from "@/lib/productos";

type Props = { params: Promise<{ id: string }> };

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  const producto = await obtenerPorId(id);
  if (!producto) notFound();

  return (
    <div>
      <EncabezadoFormulario
        antetitulo={`Editar · ${producto.marca}`}
        titulo={producto.nombre}
        detalle="Los cambios se ven en el sitio apenas guardes."
      />
      <FormularioProducto
        nuevo={false}
        accion={actualizarProducto.bind(null, producto.id)}
        valores={producto}
        existentes={producto.imagenes.map((i) => ({ id: i.id, url: i.url }))}
      />
    </div>
  );
}
