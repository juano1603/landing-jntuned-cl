import { existsSync } from "node:fs";

import { defineConfig } from "prisma/config";

/**
 * Configuración de Prisma 7.
 *
 * Desde la v7 las URLs de conexión y el comando de seed salen del
 * `schema.prisma` y viven acá.
 *
 * Prisma solo lee `.env` por su cuenta, pero el proyecto guarda sus variables
 * en `.env.local` (que es lo que Next usa). Se cargan a mano para que
 * `prisma migrate`, `prisma studio` y `prisma db seed` funcionen sin duplicar
 * credenciales en dos archivos.
 */
if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

/**
 * Este archivo lo lee SOLO la CLI de Prisma (migrate, studio, db seed), nunca
 * la aplicación. Por eso apunta a la conexión DIRECTA: las migraciones deben
 * correr fuera del pooler de Neon o fallan con errores de advisory lock. La
 * app, en cambio, usa la URL con pooler desde `lib/db.ts`.
 *
 * En Prisma 7 el `directUrl` del schema ya no existe; esta separación
 * config-vs-runtime lo reemplaza.
 */
// La integración de Neon en Vercel crea DATABASE_URL_UNPOOLED (sin pooler).
const url =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "";

export default defineConfig({
  schema: "prisma/schema.prisma",

  // El bloque `datasource` se omite mientras no haya base de datos: el helper
  // `env()` de Prisma lanza si la variable falta, y `prisma generate` corre en
  // cada `npm install` (postinstall), también en entornos sin BD como los
  // previews que siguen usando el adaptador JSON.
  ...(url ? { datasource: { url } } : {}),

  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
