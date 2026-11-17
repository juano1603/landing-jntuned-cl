import type { NextAuthConfig } from "next-auth";

/**
 * Configuración de Auth.js que puede correr en el runtime Edge.
 *
 * Va separada de `auth.ts` a propósito: el middleware se ejecuta en Edge, y
 * ahí no funcionan ni Prisma ni bcrypt. Acá solo hay reglas de ruteo y
 * callbacks puros; el provider de credenciales —que sí toca la base de datos—
 * se agrega en `auth.ts`, que solo se usa desde el runtime Node.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },

  session: {
    // JWT en vez de sesiones en base: para 2–5 usuarios internos no justifica
    // una tabla de sesiones ni una consulta por request.
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },

  callbacks: {
    /** Primera barrera: decide si la request puede seguir (la usa el middleware). */
    authorized({ auth, request }) {
      const enAdmin = request.nextUrl.pathname.startsWith("/admin");
      const enLogin = request.nextUrl.pathname === "/admin/login";

      if (!enAdmin) return true;
      if (enLogin) return true;

      return Boolean(auth?.user);
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nombre = user.name;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;

export default authConfig;
