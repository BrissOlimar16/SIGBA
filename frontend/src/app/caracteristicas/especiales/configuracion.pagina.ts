import { Component, signal } from '@angular/core';
import { BotonComponent } from '../../compartido/interfaz/boton';
import { IconoComponent } from '../../nucleo/iconos/icono';
import { PanelComponent } from '../../compartido/interfaz/panel';
import { MENSAJES } from '../../nucleo/mensajes.es';

@Component({
  selector: 'app-configuracion-pagina',
  standalone: true,
  imports: [BotonComponent, IconoComponent, PanelComponent],
  templateUrl: './configuracion.pagina.html',
})
export class ConfiguracionPagina {
  protected readonly MENSAJES = MENSAJES;
  protected readonly inicioDesayuno = signal('07:00');
  protected readonly finDesayuno = signal('10:00');
  protected readonly inicioComida = signal('13:00');
  protected readonly finComida = signal('15:30');
  protected readonly umbral = signal(82);
  protected readonly maximoFaltas = signal(6);
  protected readonly cuentaRegresiva = signal(30);
  protected readonly fotogramas = signal(3);
  protected readonly mostrarResultado = signal(4);
  protected readonly guardado = signal(false);

  protected actualizarUmbral(evento: Event): void {
    this.umbral.set(Number((evento.target as HTMLInputElement).value));
  }

  protected actualizarNumero(senal: (valor: number) => void, evento: Event): void {
    senal(Number((evento.target as HTMLInputElement).value));
  }

  protected guardar(): void {
    this.guardado.set(true);
  }
}
