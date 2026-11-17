/**
 * Build en Vercel (npm run vercel-build, Vercel lo prefiere sobre "build").
 *
 * 1. Aplica migraciones pendientes contra Neon (conexión sin pooler).
 * 2. Si SEED_EN_BUILD=1, corre el seed (admin + autos demo si SEED_DEMO=1).
 *    Se usa SOLO en el primer deploy: luego se borran SEED_* de Vercel para
 *    que el seed no recree autos demo que el cliente haya eliminado.
 * 3. next build.
 *
 * Existe porque las variables de Neon son "sensitive" y no se pueden leer
 * desde fuera de Vercel para migrar a mano.
 */
import { execSync } from "node:child_process";

const correr = (cmd) => execSync(cmd, { stdio: "inherit" });

if (process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED) {
  correr("npx prisma migrate deploy");
  if (process.env.SEED_EN_BUILD === "1") correr("npx prisma db seed");
} else {
  console.warn("Sin DATABASE_URL: se omiten migraciones.");
}

correr("npx next build");
