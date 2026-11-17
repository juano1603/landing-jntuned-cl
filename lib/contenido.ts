/**
 * Textos y fotos de la landing que NO pasan por el panel (builds, galería,
 * servicios y equipos). Para agregar una foto: déjala en public/img/trabajos/
 * y suma una línea acá.
 */

export type Build = {
  auto: string;
  motor: string;
  tag: string;
  resultado: string;
  foto?: string;
  /** `true` dice "Nuevo"; un texto reemplaza la etiqueta. */
  nuevo?: boolean | string;
};

export const BUILDS: Build[] = [
  {
    auto: "Mazda MX-5 Turbo",
    motor: "Turbo · Tactrix",
    tag: "ECU Tune",
    resultado: "246 HP · 274 Nm en dyno",
    foto: "mazda-mx5-turbo-taller.webp",
    nuevo: "Nuevo servicio",
  },
  {
    auto: "Nissan Primera P11",
    motor: "SR20DE · Apex'i SAFC",
    tag: "Drag Race",
    resultado: "10.13 s en 1/8 de milla",
    foto: "nissan-primera-p11-drag.webp",
  },
  {
    auto: "Subaru Legacy H6",
    motor: "H6 · FuelTech FT450",
    tag: "Engine Management",
    resultado: "Gestión FT450",
    foto: "subaru-legacy-h6-motor.webp",
  },
  {
    auto: "Subaru Impreza WRX",
    motor: "EJ20T · Tactrix + ECUFlash",
    tag: "ECU Flash",
    resultado: "Stage 1",
    foto: "subaru-wrx-azul-trasera.webp",
  },
  { auto: "Subaru Legacy GT", motor: "EJ20 · FuelTech FT450", tag: "Tune & Datalog", resultado: "Calibración completa" },
  {
    auto: "Mitsubishi Lancer Evolution",
    motor: "4G63T · Tactrix + EvoScan",
    tag: "ECU Tune",
    resultado: "Mapas de combustible y encendido",
  },
  { auto: "Subaru Legacy GT-B BP5", motor: "EJ20 · Dual AVCS · Twin-Scroll", tag: "Diagnóstico", resultado: "AVCS y turbo calibrados" },
  { auto: "Suzuki Swift GTI", motor: "SR20VE · Nismotronic", tag: "Engine Swap", resultado: "Swap con gestión standalone" },
];

export type Trabajo = {
  /** Archivo en public/img/trabajos/. */
  foto?: string;
  /** Nombre sin extensión en public/videos/ (mp4 + jpg de portada). */
  video?: string;
  titulo: string;
  detalle?: string;
  grande?: boolean;
  /** CSS object-position, ej. "center 70%". */
  encuadre?: string;
  ancho?: number;
  alto?: number;
};

export const TRABAJOS: Trabajo[] = [
  { foto: "subaru-forester-xt-turbo.webp", titulo: "Subaru Forester XT Turbo", grande: true },
  { video: "mazda-mx5-turbo-dyno", titulo: "Mazda MX-5 Turbo", detalle: "Dyno · Tactrix" },
  { foto: "mazda-mx5-turbo-dyno.webp", titulo: "Mazda MX-5 Turbo", detalle: "246 HP · 274 Nm" },
  { foto: "mazda-mx5-turbo-trailer.webp", titulo: "Mazda MX-5 Turbo", detalle: "Tactrix" },
  { video: "racetec-fueltech-tune", titulo: "Trabajando en Interlomas", detalle: "RaceTec · FuelTech", grande: true },
  { foto: "subaru-legacy-h6-ft450-laptop.webp", titulo: "Subaru Legacy H6", detalle: "FuelTech FT450" },
  { foto: "subaru-legacy-h6-motor.webp", titulo: "Subaru Legacy H6", detalle: "FuelTech FT450" },
  { foto: "chiloe-reprogramacion-wrx.webp", titulo: "Reprogramaciones en Chiloé" },
  { foto: "chiloe-reprogramacion-wrx-mercedes.webp", titulo: "Reprogramaciones en Chiloé" },
  { foto: "nissan-primera-p11-drag.webp", titulo: "Nissan Primera P11", detalle: "Drag · 10.13 s 1/8", grande: true, encuadre: "45% 75%" },
  { foto: "subaru-wrx-blanco.webp", titulo: "Subaru Impreza WRX" },
  { foto: "subaru-wrx-azul-trasera.webp", titulo: "Subaru Impreza WRX", detalle: "Stage 1 · Tactrix" },
  { foto: "nissan-v16-atardecer.webp", titulo: "Nissan V16" },
  { foto: "subaru-legacy-rs-y-wrx.webp", titulo: "Subaru Legacy RS & WRX" },
  { foto: "subaru-wrx-azul-llantas-doradas.webp", titulo: "Subaru Impreza WRX" },
];

export type Servicio = { titulo: string; linea: string; icono: "ecu" | "swap" | "datalog" | "hardware"; nuevo?: boolean | string };

export const SERVICIOS: Servicio[] = [
  { titulo: "Gestión de ECU", linea: "FuelTech, RaceTec y Tactrix. Tune en ruta o banco.", icono: "ecu" },
  { titulo: "Engine Swaps", linea: "SR20 y EJ20 con arnés a medida e integración CAN.", icono: "swap" },
  { titulo: "Diagnóstico y Datalog", linea: "Knock, AFR, boost y temperaturas, medido.", icono: "datalog" },
  { titulo: "Upgrade de Hardware", linea: "Turbo, inyectores y combustible, instalados y calibrados.", icono: "hardware" },
];

export const EQUIPOS = [
  { nombre: "FuelTech", tipo: "FT300 · FT450" },
  { nombre: "HP Tuners", tipo: "Flash y calibración" },
  { nombre: "Tactrix", tipo: "OpenPort 2.0" },
  { nombre: "RaceTec", tipo: "ECU standalone" },
  { nombre: "TunerNerd", tipo: "Monitor de knock" },
];

export const STATS = [
  { valor: "+150", label: "ECUs calibradas" },
  { valor: "10.13 s", label: "1/8 de milla" },
  { valor: "100%", label: "Con datalog" },
];
