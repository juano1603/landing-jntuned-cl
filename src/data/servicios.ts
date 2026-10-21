// `nuevo` muestra una etiqueta azul: `true` dice "Nuevo", o pon tu propio texto.

export interface Servicio {
  titulo: string;
  linea: string;
  icon: string; // contenido SVG (viewBox 0 0 24 24)
  nuevo?: boolean | string;
}

export const servicios: Servicio[] = [
  {
    titulo: 'Gestión de ECU',
    linea: 'FuelTech, RaceTec y Tactrix. Tune en ruta o banco.',
    icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  },
  {
    titulo: 'Engine Swaps',
    linea: 'SR20 y EJ20 con arnés a medida e integración CAN.',
    icon: '<circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>',
  },
  {
    titulo: 'Diagnóstico y Datalog',
    linea: 'Knock, AFR, boost y temperaturas, medido.',
    icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  },
  {
    titulo: 'Upgrade de Hardware',
    linea: 'Turbo, inyectores y combustible, instalados y calibrados.',
    icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  },
];
