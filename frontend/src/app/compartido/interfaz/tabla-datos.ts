import { Component, computed, input, signal } from '@angular/core';
import { MENSAJES } from '../../nucleo/mensajes.es';
import { BotonComponent } from './boton';
import { DistintivoEstadoComponent } from './distintivo-estado';
import { IconoComponent } from '../../nucleo/iconos/icono';

@Component({
  selector: 'app-tabla-datos',
  standalone: true,
  imports: [BotonComponent, DistintivoEstadoComponent, IconoComponent],
  template: `<div
      class="flex flex-col gap-3 rounded-tarjeta border border-borde bg-superficie p-4 shadow-card sm:flex-row sm:items-center"
    >
      <label class="relative min-w-0 flex-1">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-texto-suave">
          <app-icono nombre="buscar" [tamano]="17" />
        </span>
        <input
          class="h-10 w-full rounded-control border border-borde-control bg-superficie pl-10 pr-3 text-sm text-texto outline-none focus:border-primario"
          type="search"
          [attr.aria-label]="'Buscar en ' + titulo()"
          [placeholder]="'Buscar en ' + titulo().toLowerCase() + '...'"
          (input)="busqueda.set($any($event.target).value)"
        />
      </label>
      <div class="flex flex-wrap gap-2">
        <app-boton variante="secundario"
          ><app-icono nombre="filtros" [tamano]="16" />Filtros</app-boton
        >
        <app-boton variante="secundario"
          ><app-icono nombre="descargar" [tamano]="16" />Exportar</app-boton
        >
      </div>
    </div>

    <section class="overflow-hidden rounded-tarjeta border border-borde bg-superficie shadow-card">
      <header
        class="flex flex-col gap-3 border-b border-borde px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
      >
        <div class="flex min-w-0 items-center gap-3">
          <span
            class="grid size-12 shrink-0 place-items-center rounded-xl bg-primario-tinte text-primario"
          >
            <app-icono [nombre]="icono()" [tamano]="23" />
          </span>
          <div class="min-w-0">
            <h2 class="truncate text-xl font-bold text-texto">{{ titulo() }}</h2>
            <p class="mt-1 text-sm text-texto-suave">{{ descripcion() }}</p>
          </div>
        </div>
        <app-boton><app-icono nombre="mas" [tamano]="16" />{{ accion() }}</app-boton>
      </header>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px] text-left">
          <thead class="bg-fondo text-[11px] uppercase tracking-wider text-texto-suave">
            <tr>
              @for (columna of columnas(); track columna) {
                <th class="whitespace-nowrap px-5 py-3 font-bold">{{ columna }}</th>
              }
              <th class="px-4 py-3"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-borde">
            @for (fila of filasVisibles(); track $index) {
              <tr class="hover:bg-fondo">
                @for (celda of fila; track $index) {
                  <td [class]="clasesCelda(fila, $index)">
                    @if (esEstado(celda)) {
                      <app-distintivo-estado [tipo]="tipoEstado(celda)">{{
                        celda
                      }}</app-distintivo-estado>
                    } @else {
                      {{ celda }}
                    }
                  </td>
                }
                <td class="px-4">
                  <button
                    class="rounded-md p-2 text-texto-suave hover:bg-fondo"
                    [attr.aria-label]="'Opciones de ' + fila[0]"
                  >
                    <app-icono nombre="opciones" [tamano]="17" />
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td
                  class="px-5 py-10 text-center text-sm text-texto-suave"
                  [attr.colspan]="columnas().length + 1"
                >
                  No hay registros para la búsqueda actual.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <footer
        class="flex flex-col gap-3 border-t border-borde px-5 py-3 text-xs text-texto-suave sm:flex-row sm:items-center sm:justify-between"
      >
        <span>Mostrando {{ filasVisibles().length }} de {{ filas().length }} registros</span>
        <div class="flex items-center gap-2">
          <app-boton variante="fantasma">{{ MENSAJES.alumnos.anterior }}</app-boton>
          <span
            class="grid size-8 place-items-center rounded-control bg-primario font-semibold text-white"
            >1</span
          >
          <app-boton variante="fantasma">{{ MENSAJES.alumnos.siguiente }}</app-boton>
        </div>
      </footer>
    </section>`,
})
export class TablaDatosComponent {
  readonly titulo = input.required<string>();
  readonly descripcion = input.required<string>();
  readonly columnas = input.required<string[]>();
  readonly filas = input.required<string[][]>();
  readonly icono = input.required<string>();
  readonly accion = input.required<string>();

  protected readonly MENSAJES = MENSAJES;
  protected readonly busqueda = signal('');

  protected readonly filasVisibles = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    if (!texto) return this.filas();
    return this.filas().filter((fila) => fila.join(' ').toLowerCase().includes(texto));
  });

  protected clasesCelda(fila: string[], indice: number): string {
    const base = 'whitespace-nowrap px-5 py-4 text-sm';
    return `${base} ${indice === 0 ? 'font-semibold text-texto' : 'text-texto-suave'}`;
  }

  protected esEstado(valor: string): boolean {
    return ['En espera', 'Activo', 'En línea'].includes(valor);
  }

  protected tipoEstado(valor: string): 'exito' | 'advertencia' {
    return valor === 'En espera' ? 'advertencia' : 'exito';
  }
}
