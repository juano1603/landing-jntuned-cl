"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/** Muestra el "listo" después de guardar y limpia el ?ok= de la URL. */
export function AvisoGuardado({ ok }: { ok?: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!ok) return;
    if (ok === "creado") toast.success("¡Producto publicado!", { description: "Ya aparece en el sitio." });
    else toast.success("Cambios guardados", { description: "El sitio ya está actualizado." });
    router.replace("/admin/productos", { scroll: false });
  }, [ok, router]);

  return null;
}
