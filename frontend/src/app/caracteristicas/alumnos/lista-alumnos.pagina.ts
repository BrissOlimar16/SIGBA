import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BotonComponent } from '../../compartido/interfaz/boton';
import { DistintivoEstadoComponent } from '../../compartido/interfaz/distintivo-estado';
import { IconoComponent } from '../../nucleo/iconos/icono';
import { PanelComponent } from '../../compartido/interfaz/panel';
import { ALUMNOS } from '../../nucleo/datos';
import { MENSAJES } from '../../nucleo/mensajes.es';

@Component({
  selector: 'app-lista-alumnos-pagina',
  standalone: true,
  imports: [RouterLink, BotonComponent, DistintivoEstadoComponent, IconoComponent, PanelComponent],
  templateUrl: './lista-alumnos.pagina.html',
})
export class ListaAlumnosPagina {
  protected readonly MENSAJES = MENSAJES;
  protected readonly alumnos = ALUMNOS;
  protected readonly consulta = signal('');
  protected readonly estado = signal<string>(MENSAJES.alumnos.todosEstados);
  protected readonly cafeteria = signal<string>(MENSAJES.alumnos.todasCafeterias);

  protected readonly estados = [
    MENSAJES.alumnos.todosEstados,
    'Activa',
    'Suspendida',
    'Pendiente de enrolamiento',
  ];
  protected readonly cafeterias = [MENSAJES.alumnos.todasCafeterias, 'Cafetería 1', 'Cafetería 2'];

  protected readonly visibles = computed(() => {
    const texto = this.consulta().trim().toLowerCase();
    return this.alumnos.filter((alumno) => {
      const coincideTexto = `${alumno.nombre} ${alumno.matricula} ${alumno.carrera}`
        .toLowerCase()
        .includes(texto);
      const coincideEstado =
        this.estado() === MENSAJES.alumnos.todosEstados || alumno.estado === this.estado();
      const coincideCafeteria =
        this.cafeteria() === MENSAJES.alumnos.todasCafeterias ||
        alumno.cafeteria === this.cafeteria();
      return coincideTexto && coincideEstado && coincideCafeteria;
    });
  });

  protected actualizarConsulta(evento: Event): void {
    this.consulta.set((evento.target as HTMLInputElement).value);
  }

  protected actualizarEstado(evento: Event): void {
    this.estado.set((evento.target as HTMLSelectElement).value);
  }

  protected actualizarCafeteria(evento: Event): void {
    this.cafeteria.set((evento.target as HTMLSelectElement).value);
  }

  protected tipoEstado(estado: string): 'exito' | 'advertencia' | 'error' | 'informacion' {
    if (estado === 'Activa') return 'exito';
    if (estado === 'Suspendida') return 'error';
    if (estado === 'Pendiente de enrolamiento') return 'informacion';
    return 'advertencia';
  }
}
