"use client";

import { Globe, Package, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Barra de pestañas tipo app para el celular. En los formularios se oculta:
 * ahí manda la barra de "Guardar".
 */
export function BarraInferior() {
  const ruta = usePathname();
  const enFormulario = ruta.startsWith("/admin/productos/") || ruta === "/admin/login";
  if (enFormulario) return null;

  return (
    <nav
      aria-label="Panel"
      className="border-hairline bg-carbon/90 fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-3 items-center">
        <Pestana href="/admin/productos" activa={ruta === "/admin/productos"} icono={<Package className="size-5" />} label="Productos" />
        <div className="flex justify-center">
          <Link
            href="/admin/productos/nuevo"
            aria-label="Agregar producto"
            className="bg-brand shadow-brand/40 ring-carbon -mt-8 grid size-16 place-items-center rounded-2xl text-white shadow-lg ring-4 transition-transform active:scale-95"
          >
            <Plus className="size-7" strokeWidth={2.5} />
          </Link>
        </div>
        <Pestana href="/" externo icono={<Globe className="size-5" />} label="Ver sitio" />
      </div>
    </nav>
  );
}

function Pestana({
  href,
  activa,
  externo,
  icono,
  label,
}: {
  href: string;
  activa?: boolean;
  externo?: boolean;
  icono: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      target={externo ? "_blank" : undefined}
      className={cn(
        "flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors",
        activa ? "text-white" : "text-suave",
      )}
    >
      {icono}
      {label}
    </Link>
  );
}
