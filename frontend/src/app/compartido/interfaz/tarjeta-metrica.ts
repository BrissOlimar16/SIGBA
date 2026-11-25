import { Component, input } from '@angular/core';
import { IconoComponent } from '../../nucleo/iconos/icono';

@Component({
  selector: 'app-tarjeta-metrica',
  standalone: true,
  imports: [IconoComponent],
  template: `<article class="rounded-tarjeta border border-borde bg-superficie p-5 shadow-card">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-sm font-medium text-texto-suave">{{ etiqueta() }}</p>
        <p class="mt-3 text-3xl font-bold leading-none tracking-tight text-texto sm:text-[30px]">
          {{ valor() }}
        </p>
      </div>
      <span class="grid size-11 shrink-0 place-items-center rounded-xl" [class]="tonoClase()">
        <app-icono [nombre]="icono()" [tamano]="21" />
      </span>
    </div>
    <div class="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
      <span class="text-texto-suave">{{ detalle() }}</span>
      @if (tendencia()) {
        <span class="flex items-center gap-1 font-semibold text-exito-texto">
          <app-icono nombre="flecha-derecha" [tamano]="14" />{{ tendencia() }}
        </span>
      }
    </div>
  </article>`,
})
export class TarjetaMetricaComponent {
  readonly etiqueta = input.required<string>();
  readonly valor = input.required<string>();
  readonly detalle = input.required<string>();
  readonly icono = input.required<string>();
  readonly tono = input<'azul' | 'verde' | 'ambar' | 'rojo'>('azul');
  readonly tendencia = input<string>();

  protected tonoClase(): string {
    const tonos = {
      azul: 'bg-primario-tinte text-primario',
      verde: 'bg-exito-tinte text-exito-texto',
      ambar: 'bg-advertencia-tinte text-advertencia-texto',
      rojo: 'bg-error-tinte text-error-texto',
    };
    return tonos[this.tono()];
  }
}
