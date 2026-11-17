import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

/**
 * Cliente único de Prisma.
 *
 * Sin el singleton, cada recarga en caliente de Next crea un cliente nuevo y
 * las conexiones se acumulan hasta agotar el pool de Neon.
 *
 * Prisma 7 exige un driver adapter: `@prisma/adapter-pg` habla Postgres
 * plano y sirve igual con Neon en producción y con el Postgres de Docker en
 * desarrollo.
 *
 * `DATABASE_URL` debe ser la URL CON pooler. Con la conexión directa, las
 * funciones serverless agotan las conexiones de Neon bajo carga.
 *
 * La construcción es PEREZOSA a propósito: así `next build` puede importar
 * módulos que usan `db` sin que exista `DATABASE_URL` en ese momento.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function crearCliente(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Falta DATABASE_URL. En desarrollo: `npm run db:up` y copiar " +
        ".env.example a .env.local.",
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

let cliente: PrismaClient | undefined;

function obtenerCliente(): PrismaClient {
  cliente ??= globalForPrisma.prisma ?? crearCliente();

  // En desarrollo se guarda en el global para sobrevivir al hot reload, que
  // recarga los módulos y perdería la variable de arriba.
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = cliente;

  return cliente;
}

export const db = new Proxy({} as PrismaClient, {
  get(_objetivo, propiedad) {
    const valor = Reflect.get(obtenerCliente(), propiedad);

    return typeof valor === "function"
      ? valor.bind(obtenerCliente())
      : valor;
  },
});
