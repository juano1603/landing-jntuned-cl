"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export type EstadoLogin = { error: string | null };

/**
 * Inicia sesión en el panel.
 *
 * El mensaje de error es deliberadamente genérico: distinguir entre "ese
 * correo no existe" y "la contraseña está mala" le regala a un atacante la
 * lista de correos válidos.
 */
export async function iniciarSesion(
  _estadoPrevio: EstadoLogin,
  datos: FormData,
): Promise<EstadoLogin> {
  try {
    await signIn("credentials", {
      email: String(datos.get("email") ?? ""),
      password: String(datos.get("password") ?? ""),
      redirectTo: "/admin/productos",
    });

    return { error: null };
  } catch (error) {
    // `signIn` señaliza el redirect exitoso lanzando: hay que dejarlo pasar.
    if (error instanceof AuthError) {
      return { error: "Correo o contraseña incorrectos." };
    }

    throw error;
  }
}
