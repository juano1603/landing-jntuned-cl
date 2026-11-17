import NextAuth from "next-auth";

import authConfig from "./auth.config";

/**
 * Protege todo `/admin`.
 *
 * Se instancia con la config Edge-safe: el middleware no puede cargar Prisma
 * ni bcrypt. Solo lee el JWT de la cookie y decide si deja pasar.
 *
 * Esto NO es la única defensa: cada Server Action valida la sesión por su
 * cuenta, porque las Server Actions son endpoints HTTP y se pueden invocar
 * directamente sin pasar por una navegación.
 */
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: ["/admin/:path*"],
};
