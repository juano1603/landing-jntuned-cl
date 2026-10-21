// Builds recientes.
// Para agregar foto: deja la imagen en src/assets/trabajos/ y pon su nombre en `foto`.
// `nuevo` muestra una etiqueta azul: `true` dice "Nuevo", o pon tu propio texto.

export interface Build {
  auto: string;
  motor: string;
  tag: string;
  resultado: string;
  foto?: string;
  nuevo?: boolean | string;
}

export const builds: Build[] = [
  {
    auto: 'Mazda MX-5 Turbo',
    motor: 'Turbo · Tactrix',
    tag: 'ECU Tune',
    resultado: '246 HP · 274 Nm en dyno',
    foto: 'mazda-mx5-turbo-taller.jpg',
    nuevo: 'Nuevo servicio',
  },
  {
    auto: 'Nissan Primera P11',
    motor: "SR20DE · Apex'i SAFC",
    tag: 'Drag Race',
    resultado: '10.13 s en 1/8 de milla',
    foto: 'nissan-primera-p11-drag.jpg',
  },
  {
    auto: 'Subaru Legacy H6',
    motor: 'H6 · FuelTech FT450',
    tag: 'Engine Management',
    resultado: 'Gestión FT450',
    foto: 'subaru-legacy-h6-motor.jpg',
  },
  {
    auto: 'Subaru Impreza WRX',
    motor: 'EJ20T · Tactrix + ECUFlash',
    tag: 'ECU Flash',
    resultado: 'Stage 1',
    foto: 'subaru-wrx-azul-trasera.jpg',
  },
  {
    auto: 'Subaru Legacy GT',
    motor: 'EJ20 · FuelTech FT450',
    tag: 'Tune & Datalog',
    resultado: 'Calibración completa',
  },
  {
    auto: 'Mitsubishi Lancer Evolution',
    motor: '4G63T · Tactrix + EvoScan',
    tag: 'ECU Tune',
    resultado: 'Mapas de combustible y encendido',
  },
  {
    auto: 'Subaru Legacy GT-B BP5',
    motor: 'EJ20 · Dual AVCS · Twin-Scroll',
    tag: 'Diagnóstico',
    resultado: 'AVCS y turbo calibrados',
  },
  {
    auto: 'Suzuki Swift GTI',
    motor: 'SR20VE · Nismotronic',
    tag: 'Engine Swap',
    resultado: 'Swap con gestión standalone',
  },
];
