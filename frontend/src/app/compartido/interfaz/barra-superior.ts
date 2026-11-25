import { Component, inject, input, output, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NAVEGACION } from '../../nucleo/datos';
import { MENSAJES } from '../../nucleo/mensajes.es';
import { IconoComponent } from '../../nucleo/iconos/icono';

@Component({
  selector: 'app-barra-superior',
  standalone: true,
  imports: [IconoComponent],
  template: `<header
    class="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-3 border-b border-borde bg-superficie/95 px-4 backdrop-blur sm:px-5 lg:px-8"
  >
    <div class="flex min-w-0 items-center gap-3">
      <button
        type="button"
        class="rounded-lg p-2 text-texto-suave hover:bg-fondo lg:hidden"
        [attr.aria-label]="MENSAJES.abrirMenu"
        (click)="abrirMenu.emit()"
      >
        <app-icono nombre="menu" [tamano]="19" />
      </button>
      <div class="flex min-w-0 items-center gap-2 text-xs text-texto-suave">
        <span class="shrink-0">{{ MENSAJES.sistema }}</span>
        <span class="hidden sm:inline">/</span>
        <span class="truncate font-semibold text-texto">{{ titulo() }}</span>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-2 sm:gap-3">
      <div
        class="hidden items-center gap-2 rounded-full bg-exito-tinte px-3 py-1.5 text-xs font-semibold text-exito-texto xl:flex"
      >
        <span class="size-1.5 rounded-full bg-exito"></span>{{ MENSAJES.sistemaEnLinea }}
      </div>
      <div class="relative">
        <button
          type="button"
          class="relative grid size-10 place-items-center rounded-xl text-texto-suave hover:bg-fondo"
          [attr.aria-label]="MENSAJES.notificaciones"
          [attr.aria-expanded]="notificacionesAbiertas()"
          (click)="notificacionesAbiertas.set(!notificacionesAbiertas())"
        >
          <app-icono nombre="campana" [tamano]="19" />
          <span
            class="absolute right-2 top-2 size-2 rounded-full border-2 border-superficie bg-error"
          ></span>
        </button>
        @if (notificacionesAbiertas()) {
          <div
            class="absolute right-0 top-12 w-72 max-w-[85vw] rounded-xl border border-borde bg-superficie p-4 shadow-lg"
          >
            <div class="flex justify-between gap-3">
              <strong class="text-sm">{{ MENSAJES.notificaciones }}</strong>
              <button
                type="button"
                [attr.aria-label]="MENSAJES.cerrar"
                (click)="notificacionesAbiertas.set(false)"
              >
                <app-icono nombre="cerrar" [tamano]="16" />
              </button>
            </div>
            <p class="mt-3 text-sm text-texto-suave">{{ MENSAJES.notificacionBajas }}</p>
          </div>
        }
      </div>
      <span class="hidden h-7 w-px bg-borde sm:block"></span>
      <button type="button" class="flex items-center gap-2 rounded-lg p-1.5 hover:bg-fondo">
        <span
          class="grid size-8 place-items-center rounded-full bg-primario-tinte text-[11px] font-bold text-primario"
          >AL</span
        >
        <span class="hidden text-left md:block">
          <span class="block text-xs font-semibold text-texto">{{ MENSAJES.usuario }}</span>
          <span class="block text-[10px] text-texto-suave">{{ MENSAJES.rol }}</span>
        </span>
        <app-icono nombre="abajo" [tamano]="14" />
      </button>
    </div>
  </header>`,
})
export class BarraSuperiorComponent {
  readonly abrirMenu = output<void>();
  protected readonly MENSAJES = MENSAJES;
  protected readonly notificacionesAbiertas = signal(false);
  protected readonly titulo = signal<string>(MENSAJES.navegacion[0]);

  private readonly enrutador = inject(Router);

  constructor() {
    this.enrutador.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((evento) => this.titulo.set(this.obtenerTitulo(evento.urlAfterRedirects)));
  }

  private obtenerTitulo(url: string): string {
    if (url.startsWith('/admin/alumnos/nuevo')) return 'Registrar alumno';
    if (url.startsWith('/admin/alumnos/')) return MENSAJES.alumnos.detalle;
    const ruta = NAVEGACION.find((enlace) => url.startsWith(enlace.ruta));
    return ruta?.etiqueta ?? MENSAJES.navegacion[0];
  }
}
