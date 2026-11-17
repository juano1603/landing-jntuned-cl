import { crearProducto } from "@/app/admin/productos/acciones";
import { EncabezadoFormulario } from "@/app/admin/productos/encabezado-formulario";
import { FormularioProducto } from "@/app/admin/productos/formulario";

export default function NuevoProductoPage() {
  return (
    <div>
      <EncabezadoFormulario antetitulo="Agregar" titulo="Nuevo producto" detalle="Se publica en el sitio apenas lo guardes." />
      <FormularioProducto nuevo accion={crearProducto} />
    </div>
  );
}
