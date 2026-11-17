/**
 * Estado compartido entre formularios del panel y sus Server Actions.
 *
 * Vive fuera de los archivos `"use server"` porque esos solo pueden exportar
 * funciones async: cualquier constante con valor en runtime rompe el build.
 */
export type EstadoFormulario = {
  error: string | null;
  ok?: string;
  erroresPorCampo?: Record<string, string[]>;
};

export const ESTADO_INICIAL: EstadoFormulario = { error: null };
