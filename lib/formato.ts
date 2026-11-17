const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const numero = new Intl.NumberFormat("es-CL");

/** 799900 → "$799.900" */
export function formatoPrecio(valor: number): string {
  return clp.format(valor);
}

export function formatoNumero(valor: number): string {
  return numero.format(valor);
}

/** Etiquetas legibles para los enums del esquema. */
export const etiquetas = {
  estado: {
    DISPONIBLE: "Disponible",
    A_PEDIDO: "A pedido",
    AGOTADO: "Agotado",
  },
} as const;
