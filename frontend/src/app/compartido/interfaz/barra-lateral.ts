import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAVEGACION } from '../../nucleo/datos';
import { MENSAJES } from '../../nucleo/mensajes.es';
import { IconoComponent } from '../../nucleo/iconos/icono';

@Component({
  selector: 'app-barra-lateral',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconoComponent],
  template: `<aside
    class="fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col bg-primario-oscuro text-white transition-transform duration-200 lg:translate-x-0"
    [class.-translate-x-full]="!abierta()"
  >
    <div class="flex h-[76px] shrink-0 items-center border-b border-white/10 px-5">
      <div class="flex items-center gap-3">
        <div
          class="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-lg font-black tracking-tight text-primario"
        >
          U
        </div>
        <div>
          <p class="text-[17px] font-bold leading-tight tracking-wide">{{ MENSAJES.sistema }}</p>
          <p class="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/60">Gestión de becas</p>
        </div>
      </div>
    </div>

    <div class="px-4 pb-2 pt-5">
      <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
        <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
          Espacio de trabajo
        </p>
        <div class="mt-1 flex items-center justify-between">
          <span class="text-sm font-semibold">{{ MENSAJES.espacioTrabajo }}</span>
          <app-icono nombre="abajo" [tamano]="15" />
        </div>
      </div>
    </div>

    <nav aria-label="Navegación principal" class="min-h-0 flex-1 overflow-y-auto px-3 py-2">
      <p class="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
        {{ MENSAJES.menuPrincipal }}
      </p>
      @for (enlace of navegacion; track enlace.ruta) {
        <a
          [routerLink]="enlace.ruta"
          routerLinkActive="bg-primario text-white shadow-sm"
          [routerLinkActiveOptions]="{ exact: true }"
          (click)="cerrar.emit()"
          class="group relative mb-1 flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <span
            class="absolute bottom-2 left-0 top-2 hidden w-[3px] rounded-r bg-advertencia group-[.bg-primario]:block"
          ></span>
          <app-icono [nombre]="enlace.icono" [tamano]="17" />
          <span class="flex-1">{{ enlace.etiqueta }}</span>
          @if (enlace.insignia) {
            <span class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
              {{ enlace.insignia }}
            </span>
          }
        </a>
      }
    </nav>

    <div class="border-t border-white/10 p-3">
      <a
        routerLink="/terminal"
        (click)="cerrar.emit()"
        class="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-white/75 hover:bg-white/10"
      >
        <app-icono nombre="utensilios" [tamano]="17" />
        <span class="flex-1">{{ MENSAJES.terminalCafeteria }}</span>
        <app-icono nombre="flecha-derecha" [tamano]="14" />
      </a>
      <div class="mt-3 flex items-center gap-3 rounded-lg px-3 py-2">
        <span
          class="grid size-8 shrink-0 place-items-center rounded-full bg-primario text-[11px] font-bold"
          >AL</span
        >
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-semibold">{{ MENSAJES.usuario }}</p>
          <p class="truncate text-[10px] text-white/50">{{ MENSAJES.rol }}</p>
        </div>
        <button
          type="button"
          [attr.aria-label]="MENSAJES.cerrarSesion"
          class="rounded-md p-1.5 hover:bg-white/10"
        >
          <app-icono nombre="salir" [tamano]="15" />
        </button>
      </div>
    </div>
  </aside>`,
})
export class BarraLateralComponent {
  readonly abierta = input(false);
  readonly cerrar = output<void>();

  protected readonly MENSAJES = MENSAJES;
  protected readonly navegacion = NAVEGACION;
}
