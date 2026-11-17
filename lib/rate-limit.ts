/**
 * Frenos por identificador (correo en el login, IP en el tasador).
 *
 * LIMITACIÓN CONOCIDA: el contador vive en memoria del proceso. En Vercel cada
 * instancia serverless tiene el suyo, así que alguien repartido entre
 * instancias consigue más intentos que el nominal. Sigue siendo un freno real
 * contra un script ingenuo. Si las consultas de patente empiezan a costar
 * caro por abuso, hay que moverlo a un almacén compartido (Upstash Redis o
 * una tabla).
 */
type Registro = { intentos: number; reinicioEn: number };

const registros = new Map<string, Registro>();

/**
 * Cuenta un intento. Devuelve `false` cuando la clave ya agotó su cuota, en
 * cuyo caso el llamador debe rechazar la operación.
 */
export function registrarIntento(
  clave: string,
  { max = 5, ventanaMs = 15 * 60 * 1000 }: { max?: number; ventanaMs?: number } = {},
): boolean {
  const ahora = Date.now();
  const registro = registros.get(clave);

  if (!registro || ahora > registro.reinicioEn) {
    registros.set(clave, { intentos: 1, reinicioEn: ahora + ventanaMs });
    return true;
  }

  if (registro.intentos >= max) return false;

  registro.intentos++;
  return true;
}

/** IP del visitante detrás del proxy de Vercel. */
export function ipDe(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "desconocida"
  );
}
