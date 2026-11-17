import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { registrarIntento } from "./lib/rate-limit";

/**
 * Auth.js v5 con provider de credenciales contra la tabla `admin_users`
 *.
 *
 * Este módulo toca Prisma y bcrypt, así que solo puede usarse desde el runtime
 * Node. El middleware usa `auth.config.ts`, que es Edge-safe.
 */
const credencialesSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },

      async authorize(credenciales) {
        const validas = credencialesSchema.safeParse(credenciales);
        if (!validas.success) return null;

        const { email, password } = validas.data;

        // Freno básico a la fuerza bruta.
        if (!registrarIntento(email)) return null;

        const usuario = await db.adminUser.findUnique({
          where: { email: email.toLowerCase() },
        });

        // Se compara igual contra un hash falso cuando el usuario no existe,
        // para no filtrar por tiempo de respuesta qué correos están dados de
        // alta.
        const hash =
          usuario?.passwordHash ??
          "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvaliduu";

        const coincide = await bcrypt.compare(password, hash);

        if (!usuario || !usuario.activo || !coincide) return null;

        await db.adminUser.update({
          where: { id: usuario.id },
          data: { ultimoLogin: new Date() },
        });

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nombre,
        };
      },
    }),
  ],
});
