// Galería de trabajos.
// Foto: déjala en src/assets/trabajos/ y pon su nombre en `foto`.
// Video: déjalo en public/videos/ (mp4 + jpg de portada con el mismo nombre) y pon el nombre sin extensión en `video`.
// `grande: true` lo muestra al doble de tamaño en la grilla.
// `encuadre` mueve el recorte de la foto (CSS object-position, ej. 'center 70%').

export interface Trabajo {
  foto?: string;
  video?: string;
  titulo: string;
  detalle?: string;
  grande?: boolean;
  encuadre?: string;
}

export const trabajos: Trabajo[] = [
  { foto: 'subaru-forester-xt-turbo.jpg', titulo: 'Subaru Forester XT Turbo', grande: true },
  { video: 'mazda-mx5-turbo-dyno', titulo: 'Mazda MX-5 Turbo', detalle: 'Dyno · Tactrix' },
  { foto: 'mazda-mx5-turbo-dyno.jpg', titulo: 'Mazda MX-5 Turbo', detalle: '246 HP · 274 Nm' },
  { foto: 'mazda-mx5-turbo-trailer.jpg', titulo: 'Mazda MX-5 Turbo', detalle: 'Tactrix' },
  { video: 'racetec-fueltech-tune', titulo: 'Trabajando en Interlomas', detalle: 'RaceTec · FuelTech', grande: true },
  { foto: 'subaru-legacy-h6-ft450-laptop.jpg', titulo: 'Subaru Legacy H6', detalle: 'FuelTech FT450' },
  { foto: 'subaru-legacy-h6-motor.jpg', titulo: 'Subaru Legacy H6', detalle: 'FuelTech FT450' },
  { foto: 'chiloe-reprogramacion-wrx.jpg', titulo: 'Reprogramaciones en Chiloé' },
  { foto: 'chiloe-reprogramacion-wrx-mercedes.jpg', titulo: 'Reprogramaciones en Chiloé' },
  { foto: 'nissan-primera-p11-drag.jpg', titulo: 'Nissan Primera P11', detalle: 'Drag · 10.13 s 1/8', grande: true, encuadre: '45% 75%' },
  { foto: 'subaru-wrx-blanco.jpg', titulo: 'Subaru Impreza WRX' },
  { foto: 'subaru-wrx-azul-trasera.jpg', titulo: 'Subaru Impreza WRX', detalle: 'Stage 1 · Tactrix' },
  { foto: 'nissan-v16-atardecer.jpg', titulo: 'Nissan V16' },
  { foto: 'subaru-legacy-rs-y-wrx.jpg', titulo: 'Subaru Legacy RS & WRX' },
  { foto: 'subaru-wrx-azul-llantas-doradas.jpg', titulo: 'Subaru Impreza WRX' },
];
