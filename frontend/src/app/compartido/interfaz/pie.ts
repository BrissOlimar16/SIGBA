import { Component } from '@angular/core';
import { MENSAJES } from '../../nucleo/mensajes.es';

@Component({
  selector: 'app-pie',
  standalone: true,
  template: `<footer
    class="mx-auto flex w-full max-w-[1440px] flex-col gap-2 border-t border-borde px-5 py-4 text-[11px] text-texto-suave sm:flex-row sm:items-center sm:justify-between lg:px-8"
  >
    <span>{{ MENSAJES.sistema }} · {{ MENSAJES.nombreCompleto }}</span>
    <span>{{ MENSAJES.version }} · {{ MENSAJES.universidad }}</span>
  </footer>`,
})
export class PieComponent {
  protected readonly MENSAJES = MENSAJES;
}
