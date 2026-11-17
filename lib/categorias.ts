/**
 * Categorías de la tienda. Vive aparte de `lib/productos.ts` (que es solo de
 * servidor) porque también lo usan componentes de cliente: pestañas y panel.
 *
 * `seo` es la línea con palabras clave que se muestra en el catálogo y en cada
 * ficha: Google lee el texto visible, no la meta "keywords".
 */
export const CATEGORIAS = {
  ECU_FUELTECH: {
    label: "ECUs FuelTech",
    corto: "ECU",
    singular: "ECU FuelTech",
    seo: "Venta de ECU FuelTech en Temuco y todo Chile, con instalación, seteo y mapa en dyno o en ruta.",
  },
  MODULO_FUELTECH: {
    label: "Módulos FuelTech",
    corto: "Módulo",
    singular: "Módulo FuelTech",
    seo: "Módulos y accesorios FuelTech originales en Temuco, con instalación y configuración.",
  },
  WIDEBAND: {
    label: "Wideband",
    corto: "Wideband",
    // `corto` va en la tarjeta junto a la marca ("FuelTech · ECU").
    singular: "Wideband",
    seo: "Sensores wideband y medidores de AFR en Temuco y Chile: FuelTech, AEM y sensor Bosch, con instalación.",
  },
  WASTEGATE: {
    label: "Wastegates",
    corto: "Wastegates",
    singular: "Wastegate",
    seo: "Wastegates externas Turbosmart y PSR en Chile, con instalación y control de boost en Temuco.",
  },
  TURBO: {
    label: "Turbos",
    corto: "Turbos",
    singular: "Turbo",
    seo: "Turbos para Subaru, Garrett GT/GTX y PSR en Chile, con instalación y mapa a medida en Temuco.",
  },
  OTRO: {
    label: "Otros",
    corto: "Otros",
    singular: "Producto",
    seo: "Repuestos de performance en Temuco y todo Chile, con instalación.",
  },
} as const;

export type Categoria = keyof typeof CATEGORIAS;

/** Pestañas del catálogo: FuelTech agrupa ECUs y módulos. */
export const PESTANAS = [
  { valor: "TODO", label: "Todo", categorias: null },
  { valor: "FUELTECH", label: "FuelTech", categorias: ["ECU_FUELTECH", "MODULO_FUELTECH"] },
  { valor: "WIDEBAND", label: "Wideband", categorias: ["WIDEBAND"] },
  { valor: "WASTEGATE", label: "Wastegates", categorias: ["WASTEGATE"] },
  { valor: "TURBO", label: "Turbos", categorias: ["TURBO"] },
] as const satisfies readonly { valor: string; label: string; categorias: readonly Categoria[] | null }[];

export type Pestana = (typeof PESTANAS)[number]["valor"];
