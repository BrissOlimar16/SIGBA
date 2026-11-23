import { Component, computed, signal } from '@angular/core';
import { BotonComponent } from '../../compartido/interfaz/boton';
import { DistintivoEstadoComponent } from '../../compartido/interfaz/distintivo-estado';
import { IconoComponent } from '../../nucleo/iconos/icono';
import { PanelComponent } from '../../compartido/interfaz/panel';
import { MENSAJES } from '../../nucleo/mensajes.es';

@Component({
  selector: 'app-enrolamiento-pagina',
  standalone: true,
  imports: [BotonComponent, DistintivoEstadoComponent, IconoComponent, PanelComponent],
  templateUrl: './enrolamiento.pagina.html',
})
export class EnrolamientoPagina {
  protected readonly MENSAJES = MENSAJES;
  protected readonly consentimiento = signal(false);
  protected readonly capturas = signal(0);
  protected readonly mensaje = signal('');
  protected readonly tituloCapturas = computed(
    () => `${MENSAJES.enrolamiento.capturas} (${this.capturas()}/3)`,
  );

  protected capturar(): void {
    if (!this.consentimiento()) {
      this.mensaje.set(MENSAJES.enrolamiento.avisoCapturas);
      return;
    }
    this.capturas.update((valor) => Math.min(valor + 1, 3));
    this.mensaje.set('');
  }

  protected guardar(): void {
    this.mensaje.set(
      this.capturas() >= 3 && this.consentimiento()
        ? MENSAJES.enrolamiento.guardado
        : MENSAJES.enrolamiento.avisoCapturas,
    );
  }
}
