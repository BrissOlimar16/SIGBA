import { Component, input } from '@angular/core';
import { IconoComponent } from '../../nucleo/iconos/icono';

type TipoDistintivo = 'exito' | 'advertencia' | 'error' | 'informacion' | 'neutro';

@Component({
  selector: 'app-distintivo-estado',
  standalone: true,
  imports: [IconoComponent],
  template: `<span
    class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold"
    [class]="clases()"
    [attr.aria-label]="textoAlternativo()"
  >
    <app-icono [nombre]="icono()" [tamano]="14" /><ng-content />
  </span>`,
})
export class DistintivoEstadoComponent {
  readonly tipo = input<TipoDistintivo>('neutro');

  protected clases(): string {
    const estilos: Record<TipoDistintivo, string> = {
      exito: 'bg-exito-tinte text-exito-texto',
      advertencia: 'bg-advertencia-tinte text-advertencia-texto',
      error: 'bg-error-tinte text-error-texto',
      informacion: 'bg-info-tinte text-info-texto',
      neutro: 'bg-fondo text-texto-suave',
    };
    return estilos[this.tipo()];
  }

  protected icono(): string {
    const iconos: Record<TipoDistintivo, string> = {
      exito: 'correcto',
      advertencia: 'alerta',
      error: 'incorrecto',
      informacion: 'informacion',
      neutro: 'reloj',
    };
    return iconos[this.tipo()];
  }

  protected textoAlternativo(): string {
    const textos: Record<TipoDistintivo, string> = {
      exito: 'Estado correcto',
      advertencia: 'Estado de aviso',
      error: 'Estado de error',
      informacion: 'Información',
      neutro: 'Estado neutro',
    };
    return textos[this.tipo()];
  }
}
