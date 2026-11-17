import { redirect } from "next/navigation";

/** `/admin` no tiene contenido propio: el panel arranca en los productos. */
export default function AdminIndex() {
  redirect("/admin/productos");
}
