import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const svg = (contenido: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${contenido}</svg>`;

export const ICONOS: Record<string, string> = {
  panel: svg(
    '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  ),
  alumnos: svg('<path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 11v5c0 1 2.5 3 5 3s5-2 5-3v-5"/>'),
  rostro: svg(
    '<path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M20 16v2a2 2 0 0 1-2 2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="M9 10h.01M15 10h.01"/>',
  ),
  espera: svg(
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  ),
  alerta: svg(
    '<path d="m10.3 3.9-8.1 14A2 2 0 0 0 3.9 21h16.2a2 2 0 0 0 1.7-3.1l-8.1-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  ),
  casos: svg(
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/><path d="M12 8v5"/><path d="M12 16h.01"/>',
  ),
  justificaciones: svg(
    '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 13h6"/><path d="M9 17h4"/>',
  ),
  calendario: svg(
    '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
  ),
  periodos: svg(
    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M9 7h7M9 11h5"/>',
  ),
  reportes: svg(
    '<path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="8" rx="1"/><rect x="12" y="6" width="3" height="12" rx="1"/><rect x="17" y="13" width="3" height="5" rx="1"/>',
  ),
  usuarios: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  configuracion: svg(
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-4v-.1A1.7 1.7 0 0 0 8.9 19a1.7 1.7 0 0 0-1.9.3l-.1.1-2.8-2.8.1-.1A1.7 1.7 0 0 0 4.5 15a1.7 1.7 0 0 0-1.5-1H3v-4h.1A1.7 1.7 0 0 0 4.5 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1L7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.8 2.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1H21v4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  ),
  bitacora: svg(
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
  ),
  utensilios: svg(
    '<path d="M3 2v7a3 3 0 0 0 3 3V2"/><path d="M6 2v20"/><path d="M18 2c-2 0-3 3-3 6s1 4 3 4h1V2Z"/><path d="M19 12v10"/>',
  ),
  credencial: svg(
    '<rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16a3 3 0 0 1 6 0M14 10h4M14 14h4"/>',
  ),
  buscar: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  wifi: svg(
    '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><path d="M12 20h.01"/>',
  ),
  'sin-wifi': svg(
    '<path d="M2 2l20 20"/><path d="M8.5 16a5 5 0 0 1 7 0"/><path d="M5 12.5a10 10 0 0 1 5-2.8M14.5 9.8a10 10 0 0 1 4.5 2.7"/><path d="M12 20h.01"/>',
  ),
  campana: svg('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>'),
  correcto: svg('<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>'),
  incorrecto: svg('<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>'),
  informacion: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  reloj: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  izquierda: svg('<path d="m15 18-6-6 6-6"/>'),
  derecha: svg('<path d="m9 18 6-6-6-6"/>'),
  abajo: svg('<path d="m6 9 6 6 6-6"/>'),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  cerrar: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  salir: svg(
    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  ),
  mas: svg('<path d="M12 5v14M5 12h14"/>'),
  subir: svg(
    '<path d="M12 16V4m0 0L8 8m4-4 4 4"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  ),
  descargar: svg('<path d="M12 4v12m0 0 4-4m-4 4-4-4"/><path d="M4 18v2h16v-2"/>'),
  filtro: svg('<path d="M4 5h16M7 12h10M10 19h4"/>'),
  filtros: svg('<path d="M3 5h18M6 12h12M9 19h6"/>'),
  opciones: svg(
    '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  ),
  camara: svg(
    '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/>',
  ),
  repetir: svg(
    '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  ),
  editar: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
  edificio: svg(
    '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2"/>',
  ),
  'flecha-derecha': svg('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  ajustes: svg(
    '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
  ),
  ojo: svg(
    '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
  ),
  escudo: svg('<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5Z"/><path d="m9 12 2 2 4-4"/>'),
  actividad: svg('<path d="M3 12h4l3-8 4 16 3-8h4"/>'),
  'abajo-flecha': svg('<path d="M12 5v14m0 0 6-6m-6 6-6-6"/>'),
  tabla: svg(
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10M15 10v10"/>',
  ),
  guardar: svg('<path d="M5 3h12l4 4v14H3V3h2Z"/><path d="M7 3v6h9V3M7 21v-7h10v7"/>'),
  pausa: svg('<path d="M8 5v14M16 5v14"/>'),
  circulo: svg('<circle cx="12" cy="12" r="9"/>'),
};

@Component({
  selector: 'app-icono',
  standalone: true,
  template: `<span
    class="inline-flex shrink-0 items-center justify-center leading-none"
    [class.h-full]="llenar()"
    [class.w-full]="llenar()"
    [style.width.px]="llenar() ? undefined : tamano()"
    [style.height.px]="llenar() ? undefined : tamano()"
    [innerHTML]="contenido()"
  ></span>`,
})
export class IconoComponent {
  private readonly sanitizador = inject(DomSanitizer);

  readonly nombre = input.required<string>();
  readonly tamano = input(20);
  readonly llenar = input(false);

  protected readonly contenido = computed(() =>
    this.sanitizador.bypassSecurityTrustHtml(ICONOS[this.nombre()] ?? ICONOS['circulo']),
  );
}
