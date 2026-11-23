import { Component, computed, signal } from '@angular/core';
import { BotonComponent } from '../../compartido/interfaz/boton';
import { DistintivoEstadoComponent } from '../../compartido/interfaz/distintivo-estado';
import { IconoComponent } from '../../nucleo/iconos/icono';
import { PanelComponent } from '../../compartido/interfaz/panel';
import { TarjetaMetricaComponent } from '../../compartido/interfaz/tarjeta-metrica';
import { ENTREGAS_COMIDA, ENTREGAS_DESAYUNO, METRICAS } from '../../nucleo/datos';
import { MENSAJES } from '../../nucleo/mensajes.es';

@Component({
  selector: 'app-inicio-pagina',
  standalone: true,
  imports: [
    BotonComponent,
    DistintivoEstadoComponent,
    IconoComponent,
    PanelComponent,
    TarjetaMetricaComponent,
  ],
  templateUrl: './inicio.pagina.html',
})
export class InicioPagina {
  protected readonly MENSAJES = MENSAJES;
  protected readonly metricas = METRICAS;
  protected readonly comida = signal<'desayuno' | 'comida'>('desayuno');

  protected readonly entregas = computed(() =>
    this.comida() === 'desayuno' ? ENTREGAS_DESAYUNO : ENTREGAS_COMIDA,
  );

  protected readonly terminales = [
    { nombre: 'Cafetería 1', tiempo: MENSAJES.inicio.haceDosMin, enLinea: true },
    { nombre: 'Cafetería 2', tiempo: MENSAJES.inicio.sinConexionDiez, enLinea: false },
  ];

  protected readonly resumen = [
    { etiqueta: MENSAJES.inicio.alumnosActivos, valor: '1,248' },
    { etiqueta: `Cafetería 1 · ${MENSAJES.inicio.ocupacion}`, valor: '486 / 500' },
    { etiqueta: `Cafetería 2 · ${MENSAJES.inicio.ocupacion}`, valor: '472 / 500' },
  ];

  protected porcentaje(count: number, total: number): number {
    return Math.round((count / total) * 100);
  }
}
