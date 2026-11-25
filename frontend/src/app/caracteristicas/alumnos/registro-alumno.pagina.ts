import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BotonComponent } from '../../compartido/interfaz/boton';
import { IconoComponent } from '../../nucleo/iconos/icono';
import { PanelComponent } from '../../compartido/interfaz/panel';
import { MENSAJES } from '../../nucleo/mensajes.es';

@Component({
  selector: 'app-registro-alumno-pagina',
  standalone: true,
  imports: [RouterLink, BotonComponent, IconoComponent, PanelComponent],
  templateUrl: './registro-alumno.pagina.html',
})
export class RegistroAlumnoPagina {
  protected readonly MENSAJES = MENSAJES;
  protected readonly pasos = [
    MENSAJES.registro.credencial,
    MENSAJES.registro.datos,
    MENSAJES.registro.resumen,
  ];
  protected readonly pasoActivo = signal(0);

  protected readonly campos = [
    [MENSAJES.registro.matriculaFicha, '202610284'],
    [MENSAJES.registro.nombres, 'María Fernanda'],
    [MENSAJES.registro.apellidos, 'García López'],
    ['Carrera', 'Medicina'],
    [MENSAJES.alumnos.cafeteria, 'Cafetería 1'],
    [MENSAJES.registro.telefono, '951 000 0000'],
  ];

  protected avanzar(): void {
    this.pasoActivo.update((valor) => Math.min(valor + 1, this.pasos.length - 1));
  }
}
