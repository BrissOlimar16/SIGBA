import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TablaDatosComponent } from '../../compartido/interfaz/tabla-datos';
import { PAGINAS_GENERICAS } from '../../nucleo/datos';
import { TablaMaqueta } from '../../nucleo/modelos';

@Component({
  selector: 'app-pagina-generica',
  standalone: true,
  imports: [TablaDatosComponent],
  template: `<app-tabla-datos
    [titulo]="pagina.titulo"
    [descripcion]="pagina.descripcion"
    [columnas]="pagina.columnas"
    [filas]="pagina.filas"
    [icono]="pagina.icono"
    [accion]="pagina.accion"
  />`,
})
export class PaginaGenerica {
  private readonly ruta = inject(ActivatedRoute);
  private readonly clave = this.ruta.snapshot.data['pagina'] as string;

  protected readonly pagina: TablaMaqueta = PAGINAS_GENERICAS[this.clave] ?? {
    titulo: this.clave,
    descripcion: `Consulta y administra ${this.clave.toLowerCase()} del periodo vigente.`,
    columnas: ['Nombre', 'Descripción', 'Estado', 'Actualizado'],
    filas: [
      ['Semestre 2026-2', 'Periodo académico vigente', 'Activo', '15 nov 2026'],
      ['Cafetería 1', 'Campus central', 'En línea', 'Hace 2 min'],
      ['Cafetería 2', 'Campus norte', 'En línea', 'Hace 5 min'],
    ],
    icono: 'calendario',
    accion: 'Nuevo registro',
  };
}
