import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconoComponent } from '../../nucleo/iconos/icono';
import { MENSAJES } from '../../nucleo/mensajes.es';
import { EstadoTerminal } from '../../nucleo/modelos';
import { BotonComponent } from '../../compartido/interfaz/boton';

type ClaveEstado = EstadoTerminal['clave'];

@Component({
  selector: 'app-terminal-pagina',
  standalone: true,
  imports: [RouterLink, IconoComponent, BotonComponent],
  templateUrl: './terminal.pagina.html',
})
export class TerminalPagina {
  protected readonly MENSAJES = MENSAJES;
  protected readonly codigo = signal('');
  protected readonly estado = signal<ClaveEstado>('espera');

  private readonly estados: Record<ClaveEstado, EstadoTerminal> = {
    espera: {
      clave: 'espera',
      fondo: 'bg-fondo text-texto',
      icono: 'credencial',
      titulo: MENSAJES.terminal.paseCredencial,
      mensaje: MENSAJES.terminal.acerque,
      detalle: MENSAJES.terminal.ayuda,
    },
    aprobado: {
      clave: 'aprobado',
      fondo: 'bg-exito text-white',
      icono: 'correcto',
      titulo: MENSAJES.terminal.aprobadoTitulo,
      mensaje: MENSAJES.terminal.aprobadoMensaje,
      detalle: MENSAJES.terminal.aprobadoDetalle,
    },
    aviso: {
      clave: 'aviso',
      fondo: 'bg-advertencia text-texto',
      icono: 'alerta',
      titulo: MENSAJES.terminal.avisoTitulo,
      mensaje: MENSAJES.terminal.avisoMensaje,
      detalle: MENSAJES.terminal.avisoDetalle,
    },
    rechazo: {
      clave: 'rechazo',
      fondo: 'bg-error text-white',
      icono: 'incorrecto',
      titulo: MENSAJES.terminal.rechazoTitulo,
      mensaje: MENSAJES.terminal.rechazoMensaje,
      detalle: MENSAJES.terminal.rechazoDetalle,
    },
    'sin-conexion': {
      clave: 'sin-conexion',
      fondo: 'bg-terminal-gris text-white',
      icono: 'sin-wifi',
      titulo: MENSAJES.terminal.sinConexionTitulo,
      mensaje: MENSAJES.terminal.sinConexionMensaje,
      detalle: MENSAJES.terminal.sinConexionDetalle,
    },
  };

  protected readonly resultado = computed(() => this.estados[this.estado()]);
  protected readonly clasesPantalla = computed(
    () => `fixed inset-0 z-50 flex flex-col ${this.resultado().fondo}`,
  );
  protected readonly esEspera = computed(() => this.estado() === 'espera');

  protected procesar(evento: Event): void {
    evento.preventDefault();
    const valor = this.codigo().trim();
    if (!valor) return;
    this.estado.set(
      valor.endsWith('4')
        ? 'aprobado'
        : valor.endsWith('5')
          ? 'aviso'
          : valor.endsWith('9')
            ? 'sin-conexion'
            : 'rechazo',
    );
    this.codigo.set('');
  }

  protected actualizarCodigo(evento: Event): void {
    this.codigo.set((evento.target as HTMLInputElement).value);
  }

  protected forzar(estado: ClaveEstado): void {
    this.estado.set(estado);
    this.codigo.set('');
  }
}
