import { Component, input } from '@angular/core';

@Component({
  selector: 'app-panel',
  standalone: true,
  template: `<section
    class="overflow-hidden rounded-tarjeta border border-borde bg-superficie shadow-card"
  >
    <header
      class="flex flex-col gap-3 border-b border-borde px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
      <div class="min-w-0">
        @if (subtitulo()) {
          <p class="mb-1 text-[11px] font-bold uppercase tracking-[0.13em] text-texto-suave">
            {{ subtitulo() }}
          </p>
        }
        <h2 class="text-base font-bold text-texto">{{ titulo() }}</h2>
      </div>
      <ng-content select="[accion]" />
    </header>
    <ng-content />
  </section>`,
})
export class PanelComponent {
  readonly titulo = input.required<string>();
  readonly subtitulo = input<string>();
}
