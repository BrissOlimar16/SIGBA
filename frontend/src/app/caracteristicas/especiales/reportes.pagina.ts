import { Component, signal } from '@angular/core';
import { BotonComponent } from '../../compartido/interfaz/boton';
import { IconoComponent } from '../../nucleo/iconos/icono';
import { PanelComponent } from '../../compartido/interfaz/panel';
import { TarjetaMetricaComponent } from '../../compartido/interfaz/tarjeta-metrica';
import { MENSAJES } from '../../nucleo/mensajes.es';
import { MetricaMaqueta } from '../../nucleo/modelos';

@Component({
  selector: 'app-reportes-pagina',
  standalone: true,
  imports: [BotonComponent, IconoComponent, PanelComponent, TarjetaMetricaComponent],
  templateUrl: './reportes.pagina.html',
})
export class ReportesPagina {
  protected readonly MENSAJES = MENSAJES;
  protected readonly periodo = signal(MENSAJES.periodo);
  protected readonly cafeteria = signal('Ambas cafeterías');
  protected readonly comida = signal('Desayuno y comida');
  protected readonly mensaje = signal('');

  protected readonly metricas: MetricaMaqueta[] = [
    {
      etiqueta: MENSAJES.reportes.entregasPeriodo,
      valor: '17,580',
      detalle: MENSAJES.reportes.enQuinceDias,
      icono: 'utensilios',
      tono: 'azul',
      tendencia: '8%',
    },
    {
      etiqueta: MENSAJES.reportes.faltasRegistradas,
      valor: '342',
      detalle: MENSAJES.reportes.deAlumnos,
      icono: 'campana',
      tono: 'ambar',
      tendencia: undefined,
    },
    {
      etiqueta: MENSAJES.reportes.intentosFallidos,
      valor: '88',
      detalle: MENSAJES.reportes.delTotal,
      icono: 'incorrecto',
      tono: 'rojo',
      tendencia: undefined,
    },
  ];

  protected descargar(): void {
    this.mensaje.set(MENSAJES.configuracion.guardado);
  }
}
