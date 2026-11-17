import "server-only";

import { auth } from "@/auth";

export class NoAutorizado extends Error {
  constructor() {
    super("No autorizado");
    this.name = "NoAutorizado";
  }
}

/**
 * Guardia obligatoria al inicio de TODA Server Action del panel
 *.
 *
 * El middleware no alcanza: protege navegaciones, pero una Server Action es un
 * endpoint HTTP que se puede invocar directamente con un POST, sin pasar por
 * una ruta de `/admin`.
 */
export async function requerirAdmin() {
  const sesion = await auth();

  if (!sesion?.user) throw new NoAutorizado();

  return sesion.user;
}
