import { Component, computed, input, output } from '@angular/core';

type VarianteBoton = 'primario' | 'secundario' | 'fantasma' | 'peligro';

@Component({
  selector: 'app-boton',
  standalone: true,
  template: `<button
    [type]="tipo()"
    [disabled]="deshabilitado()"
    [class]="clases()"
    (click)="activar.emit()"
  >
    <ng-content />
  </button>`,
})
export class BotonComponent {
  readonly variante = input<VarianteBoton>('primario');
  readonly tipo = input<'button' | 'submit'>('button');
  readonly anchoCompleto = input(false);
  readonly clase = input('');
  readonly deshabilitado = input(false);
  readonly activar = output<void>();

  protected readonly clases = computed(() => {
    const estilos: Record<VarianteBoton, string> = {
      primario: 'bg-primario text-white hover:bg-primario-oscuro',
      secundario: 'border border-borde-control bg-superficie text-texto hover:bg-fondo',
      fantasma: 'text-texto-suave hover:bg-primario-tinte hover:text-primario',
      peligro: 'bg-error text-white hover:bg-error-texto',
    };

    return [
      'inline-flex min-h-10 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
      estilos[this.variante()],
      this.anchoCompleto() ? 'w-full' : '',
      this.clase(),
    ].join(' ');
  });
}
