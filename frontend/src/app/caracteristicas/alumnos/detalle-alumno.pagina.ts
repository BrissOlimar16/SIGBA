import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BotonComponent } from '../../compartido/interfaz/boton';
import { DistintivoEstadoComponent } from '../../compartido/interfaz/distintivo-estado';
import { IconoComponent } from '../../nucleo/iconos/icono';
import { PanelComponent } from '../../compartido/interfaz/panel';
import { ALUMNOS } from '../../nucleo/datos';
import { MENSAJES } from '../../nucleo/mensajes.es';

@Component({
  selector: 'app-detalle-alumno-pagina',
  standalone: true,
  imports: [RouterLink, BotonComponent, DistintivoEstadoComponent, IconoComponent, PanelComponent],
  templateUrl: './detalle-alumno.pagina.html',
})
export class DetalleAlumnoPagina {
  protected readonly MENSAJES = MENSAJES;
  protected readonly pestanas = [
    MENSAJES.alumnos.entregas,
    MENSAJES.alumnos.faltasPeriodo,
    MENSAJES.alumnos.intentos,
    MENSAJES.alumnos.justificarFaltas,
    MENSAJES.alumnos.bitacora,
  ];
  protected readonly pestanaActiva = signal(0);

  private readonly ruta = inject(ActivatedRoute);
  private readonly matricula = this.ruta.snapshot.paramMap.get('matricula') ?? ALUMNOS[0].matricula;

  protected readonly alumno =
    ALUMNOS.find((item) => item.matricula === this.matricula) ?? ALUMNOS[0];
}
