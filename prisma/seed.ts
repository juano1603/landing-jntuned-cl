import { existsSync } from "node:fs";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient, type Prisma } from "../generated/prisma/client";

/**
 * Siembra la base. Es idempotente: se puede correr varias veces y nunca pisa
 * lo que se haya editado desde el panel (los upsert no actualizan).
 *
 *   - Usuario admin: con SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD.
 *   - Catálogo inicial: con SEED_PRODUCTOS=1. Van sin precio ("Consultar
 *     precio"): el precio lo pone el cliente desde el panel.
 */
if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const connectionString =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Falta DATABASE_URL (o DIRECT_URL) en .env.local.");
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

type Inicial = Omit<Prisma.ProductoCreateInput, "imagenes"> & { fotos: string[] };

const foto = (nombre: string) => `/img/productos/${nombre}.webp`;

const PRODUCTOS: Inicial[] = [
  // --- ECUs FuelTech -----------------------------------------------------------
  {
    slug: "fueltech-ft470",
    nombre: "FuelTech FT470",
    marca: "FuelTech",
    categoria: "ECU_FUELTECH",
    resumen: "La nueva generación FuelTech: wideband integrado y tablero en tu celular.",
    descripcion:
      "ECU programable para motores de 1 a 16 cilindros y rotativos. Trae acondicionador wideband y sensor MAP integrados, y se configura y se usa como tablero desde el celular, la tablet o el computador con la app FuelTech Vision.\n\nLa instalamos y la dejamos mapeada en nuestro taller de Temuco.",
    nuevo: true,
    destacado: true,
    orden: 1,
    palabrasClave: ["FuelTech FT470 Chile", "ECU programable Temuco"],
    fotos: [foto("fueltech-ft470"), foto("fueltech-ft470-2"), foto("fueltech-ft470-3")],
  },
  {
    slug: "fueltech-ft450",
    nombre: "FuelTech FT450",
    marca: "FuelTech",
    categoria: "ECU_FUELTECH",
    resumen: "Pantalla touch, control de boost, launch y datalogger integrado.",
    descripcion:
      "La ECU FuelTech más usada en proyectos de calle y pista. Pantalla touch a color, datalogger interno, control de boost, launch control y corte por marcha.\n\nLa usamos a diario en el taller: instalación, arnés y mapa a medida en Temuco.",
    destacado: true,
    orden: 2,
    palabrasClave: ["FuelTech FT450 Chile", "comprar FuelTech Temuco"],
    fotos: [foto("fueltech-ft450")],
  },
  {
    slug: "fueltech-ft300",
    nombre: "FuelTech FT300",
    marca: "FuelTech",
    categoria: "ECU_FUELTECH",
    resumen: "La puerta de entrada a FuelTech para motores de 4 cilindros.",
    descripcion:
      "ECU programable de entrada de la línea FuelTech, ideal para motores de 4 cilindros aspirados o turbo que necesitan gestión completa sin pagar por funciones que no van a usar.",
    orden: 3,
    palabrasClave: ["FuelTech FT300 Chile", "ECU FuelTech precio"],
    fotos: [foto("fueltech-ft300")],
  },
  {
    slug: "fueltech-ft550",
    nombre: "FuelTech FT550",
    marca: "FuelTech",
    categoria: "ECU_FUELTECH",
    resumen: "Más entradas y salidas, control de tracción y boost por marcha.",
    descripcion:
      "ECU FuelTech con pantalla touch y más entradas y salidas que la FT450, pensada para proyectos de competición: control de tracción, boost por marcha y estrategias avanzadas de drag.",
    orden: 4,
    palabrasClave: ["FuelTech FT550 Chile"],
    fotos: [foto("fueltech-ft550")],
  },
  {
    slug: "fueltech-ft600",
    nombre: "FuelTech FT600",
    marca: "FuelTech",
    categoria: "ECU_FUELTECH",
    resumen: "El tope de la línea PowerFT para motores de competición.",
    descripcion:
      "La ECU más completa de la línea PowerFT de FuelTech: pantalla grande, la mayor cantidad de entradas y salidas y todas las estrategias de competición para motores de alta potencia.",
    orden: 5,
    palabrasClave: ["FuelTech FT600 Chile"],
    fotos: [foto("fueltech-ft600")],
  },

  // --- Wideband ----------------------------------------------------------------
  {
    slug: "fueltech-wb-o2-nano",
    nombre: "FuelTech WB-O2 Nano Wideband",
    marca: "FuelTech",
    categoria: "WIDEBAND",
    resumen: "Acondicionador wideband con display, compatible con 5 sondas.",
    descripcion:
      "Acondicionador de sonda lambda wideband con display. Funciona con sondas Bosch LSU 4.2, 4.9 y 5.2 y NTK, y manda la lectura por CAN a tu ECU FuelTech sin ocupar entradas analógicas. Certificación IP67.",
    destacado: true,
    orden: 10,
    palabrasClave: ["wideband FuelTech Chile", "sensor wideband Temuco"],
    fotos: [foto("fueltech-wb-o2-nano")],
  },
  {
    slug: "fueltech-nanopro-wideband",
    nombre: "FuelTech NanoPRO Wideband",
    marca: "FuelTech",
    categoria: "WIDEBAND",
    resumen: "Wideband, display touch a color y panel de botones en uno.",
    descripcion:
      "Tres equipos en uno: acondicionador wideband, display secundario touch a color de 2\" y panel de botones por CAN. Compatible con sondas Bosch LSU 4.2, 4.9 y 5.2 y NTK. Certificación IP67.",
    orden: 11,
    palabrasClave: ["FuelTech NanoPRO Chile", "wideband touch"],
    fotos: [foto("fueltech-nanopro")],
  },
  {
    slug: "aem-x-series-wideband",
    nombre: "AEM X-Series Wideband",
    marca: "AEM",
    categoria: "WIDEBAND",
    resumen: "Reloj de AFR de 52 mm con sensor Bosch 4.9 incluido.",
    descripcion:
      "Medidor de mezcla aire/combustible AEM X-Series de 52 mm con sensor Bosch LSU 4.9 y arnés. Salida analógica para registrar el AFR en tu ECU. Ideal para cualquier auto modificado, con o sin gestión programable.",
    orden: 12,
    palabrasClave: ["wideband AEM Chile", "medidor AFR Temuco"],
    fotos: [foto("aem-x-series-wideband")],
  },

  // --- Wastegates --------------------------------------------------------------
  {
    slug: "wastegate-turbosmart-gen2-38mm",
    nombre: "Wastegate Turbosmart Gen2 38 mm",
    marca: "Turbosmart",
    categoria: "WASTEGATE",
    resumen: "Wastegate externa de 38 mm con bridas y pernos incluidos.",
    descripcion:
      "Wastegate externa Turbosmart de 38 mm para controlar el boost con precisión en proyectos de calle y pista. Incluye bridas, empaquetaduras y pernos. Te ayudamos a elegir el resorte según el boost que buscas.",
    orden: 20,
    palabrasClave: ["wastegate Turbosmart Chile", "wastegate 38 mm"],
    fotos: [foto("turbosmart-gen2-38mm")],
  },
  {
    slug: "wastegate-turbosmart-40mm",
    nombre: "Wastegate Turbosmart 40 mm 14 psi",
    marca: "Turbosmart",
    categoria: "WASTEGATE",
    resumen: "Wastegate original Turbosmart V-Band con resorte de 14 psi.",
    descripcion:
      "Wastegate externa original Turbosmart de 40 mm con montaje V-Band y resorte de 14 psi. Incluye abrazaderas, bridas y herramienta de ajuste.",
    orden: 21,
    palabrasClave: ["wastegate Turbosmart 40 mm Chile"],
    fotos: [foto("turbosmart-40mm"), foto("turbosmart-40mm-2")],
  },
  {
    slug: "wastegate-psr-45mm-v-band",
    nombre: "Wastegate PSR 45 mm V-Band",
    marca: "PSR",
    categoria: "WASTEGATE",
    resumen: "Acero inoxidable, actuador ajustable y bridas V-Band incluidas.",
    descripcion:
      "Wastegate externa PSR de 45 mm para turbos grandes. Carcasa, asiento y bridas de acero inoxidable, diafragma reforzado para alta temperatura y actuador de posición ajustable. Incluye bridas y abrazaderas V-Band de entrada y salida.",
    orden: 22,
    palabrasClave: ["wastegate PSR Chile", "wastegate 45 mm V-Band"],
    fotos: [foto("psr-wastegate-45mm")],
  },

  // --- Turbos ------------------------------------------------------------------
  {
    slug: "turbo-td04l-subaru-wrx",
    nombre: "Turbo TD04L para Subaru WRX 2.0",
    marca: "Maxpeedingrods",
    categoria: "TURBO",
    resumen: "Reemplazo directo del turbo de fábrica del WRX, hasta 211 HP.",
    descripcion:
      "Turbo TD04L de reemplazo directo para Subaru Impreza WRX 2.0 (EJ20). Mejora la respuesta y soporta hasta unos 211 HP. Incluye empaquetaduras. Lo instalamos y ajustamos el mapa con Tactrix en Temuco.",
    orden: 30,
    palabrasClave: ["turbo TD04L Subaru", "turbo WRX Chile"],
    fotos: [foto("turbo-td04l-wrx")],
  },
  {
    slug: "turbo-td05-20g-subaru-sti",
    nombre: "Turbo TD05-20G para Subaru WRX STI 02-06",
    marca: "Maxpeedingrods",
    categoria: "TURBO",
    resumen: "El clásico 20G para EJ20 y EJ25: el paso siguiente del Stage 2.",
    descripcion:
      "Turbo TD05-20G para Subaru Impreza WRX y STI 2002–2006 con motor EJ20 o EJ25. Ojo: los WRX que traen TD04 de fábrica necesitan adaptaciones; consúltanos por tu auto antes de comprar.",
    destacado: true,
    orden: 31,
    palabrasClave: ["turbo 20G Subaru Chile", "turbo STI Temuco"],
    fotos: [foto("turbo-td05-20g-sti")],
  },
  {
    slug: "turbo-gt2871",
    nombre: "Turbo GT2871",
    marca: "Maxpeedingrods",
    categoria: "TURBO",
    resumen: "Para motores de 1.6 a 2.5 L, de 250 a 480 PS.",
    descripcion:
      "Turbo GT2871 refrigerado por agua y aceite para motores de 1.6 a 2.5 litros. Rango de 250 a 480 PS según el motor y el mapa. Incluye empaquetaduras y pernos.",
    orden: 32,
    palabrasClave: ["turbo GT2871 Chile"],
    fotos: [foto("turbo-gt2871")],
  },
  {
    slug: "turbo-gt3076r",
    nombre: "Turbo GT3076R A/R .82",
    marca: "Maxpeedingrods",
    categoria: "TURBO",
    resumen: "Para motores de 2.5 a 3.0 L, hasta 500 HP.",
    descripcion:
      "Turbo GT3076R con carcasa de escape A/R .82 para motores de 4 y 6 cilindros de 2.5 a 3.0 litros. Soporta hasta 500 HP. Refrigerado por agua y aceite.",
    orden: 33,
    palabrasClave: ["turbo GT3076R Chile", "turbo GT30"],
    fotos: [foto("turbo-gt3076r")],
  },
  {
    slug: "turbo-psr-6266e",
    nombre: "Turbo PSR 6266E T3 V-Band .63",
    marca: "PSR",
    categoria: "TURBO",
    resumen: "Rodamiento de bolas, entrada T3 y salida V-Band, hasta 735 HP.",
    descripcion:
      "Turbo PSR 6266E con rodamiento de bolas para proyectos de alta potencia: hasta 735 HP. Entrada T3, salida V-Band y carcasa de escape A/R .63 para buena respuesta.",
    orden: 34,
    palabrasClave: ["turbo PSR Chile", "turbo rodamiento de bolas"],
    fotos: [foto("turbo-psr-6266e"), foto("turbo-psr-6266e-2")],
  },
];

async function sembrarProductos() {
  for (const { fotos, ...producto } of PRODUCTOS) {
    await db.producto.upsert({
      where: { slug: producto.slug },
      update: {},
      create: { ...producto, imagenes: { create: fotos.map((url, orden) => ({ url, orden })) } },
    });
  }
  console.log(`Catálogo: ${PRODUCTOS.length} productos.`);
}

async function sembrarAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("Sin SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD: no se creó usuario admin.");
    return;
  }
  if (password.length < 10) {
    throw new Error("SEED_ADMIN_PASSWORD debe tener al menos 10 caracteres.");
  }

  await db.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      email: email.toLowerCase(),
      nombre: process.env.SEED_ADMIN_NOMBRE ?? "Juan",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  console.log(`Admin listo: ${email}`);
}

async function main() {
  await sembrarAdmin();
  if (process.env.SEED_PRODUCTOS === "1") await sembrarProductos();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
