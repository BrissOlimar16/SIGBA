import { Component, signal } from '@angular/core';
import { BotonComponent } from '../../compartido/interfaz/boton';
import { IconoComponent } from '../../nucleo/iconos/icono';
import { PanelComponent } from '../../compartido/interfaz/panel';
import { MENSAJES } from '../../nucleo/mensajes.es';

type MarcaCalendario = 'inhabil' | 'vacaciones' | 'suspension' | 'contingencia';

@Component({
  selector: 'app-calendario-pagina',
  standalone: true,
  imports: [BotonComponent, IconoComponent, PanelComponent],
  templateUrl: './calendario.pagina.html',
})
export class CalendarioPagina {
  protected readonly MENSAJES = MENSAJES;
  protected readonly diasSemana = MENSAJES.calendario.dias;
  protected readonly seleccionado = signal(15);
  protected readonly casillas: (number | null)[] = [
    null,
    null,
    null,
    null,
    null,
    null,
    ...Array.from({ length: 30 }, (_, indice) => indice + 1),
  ];

  private readonly marcas: Record<number, MarcaCalendario> = {
    12: 'inhabil',
    20: 'vacaciones',
    21: 'vacaciones',
    22: 'vacaciones',
    23: 'vacaciones',
    24: 'vacaciones',
    25: 'suspension',
    26: 'contingencia',
  };

  protected marca(dia: number | null): MarcaCalendario | undefined {
    return dia === null ? undefined : this.marcas[dia];
  }

  protected clasesDia(dia: number | null): string {
    const base = 'relative grid aspect-square place-items-center rounded-lg text-sm font-semibold';
    if (dia === null) return '';
    const marca = this.marca(dia);
    const fondo =
      marca === 'inhabil'
        ? 'bg-error-tinte text-error-texto'
        : marca === 'vacaciones'
          ? 'bg-advertencia-tinte text-advertencia-texto'
          : marca === 'suspension'
            ? 'bg-primario-tinte text-primario'
            : marca === 'contingencia'
              ? 'bg-info-tinte text-info-texto'
              : this.seleccionado() === dia
                ? 'bg-primario text-white'
                : 'text-texto hover:bg-fondo';
    return `${base} ${fondo}`;
  }

  protected seleccionar(dia: number | null): void {
    if (dia !== null) this.seleccionado.set(dia);
  }
}
