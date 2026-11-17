import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { MarcaPanel } from "@/app/admin/marca-panel";

import { FormularioLogin } from "./formulario";

export default async function LoginPage() {
  const sesion = await auth();
  if (sesion?.user) redirect("/admin/productos");

  return (
    <div className="mx-auto max-w-sm py-16">
      <MarcaPanel grande />
      <h1 className="eyebrow mt-8">Panel de administración</h1>
      <p className="text-suave mt-2 text-sm">Acceso solo para el equipo de JNTUNED.</p>
      <div className="bg-graphite border-hairline mt-8 rounded-2xl border p-6">
        <FormularioLogin />
      </div>
    </div>
  );
}
