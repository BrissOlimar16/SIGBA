import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin/inicio' },
  {
    path: 'terminal',
    title: 'SIGBA · Terminal de cafetería',
    loadComponent: () =>
      import('./caracteristicas/terminal/terminal.pagina').then((modulo) => modulo.TerminalPagina),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./compartido/interfaz/cascaron-admin').then((modulo) => modulo.CascaronAdmin),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        title: 'Inicio · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/inicio/inicio.pagina').then((modulo) => modulo.InicioPagina),
      },
      {
        path: 'alumnos',
        title: 'Alumnos · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/alumnos/lista-alumnos.pagina').then(
            (modulo) => modulo.ListaAlumnosPagina,
          ),
      },
      {
        path: 'alumnos/nuevo',
        title: 'Registrar alumno · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/alumnos/registro-alumno.pagina').then(
            (modulo) => modulo.RegistroAlumnoPagina,
          ),
      },
      {
        path: 'alumnos/:matricula',
        title: 'Detalle de alumno · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/alumnos/detalle-alumno.pagina').then(
            (modulo) => modulo.DetalleAlumnoPagina,
          ),
      },
      {
        path: 'enrolamiento',
        title: 'Enrolamiento · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/enrolamiento/enrolamiento.pagina').then(
            (modulo) => modulo.EnrolamientoPagina,
          ),
      },
      {
        path: 'lista-espera',
        title: 'Lista de espera · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/genericas/pagina-generica').then(
            (modulo) => modulo.PaginaGenerica,
          ),
        data: { pagina: 'Lista de espera' },
      },
      {
        path: 'bajas-alertas',
        title: 'Bajas y alertas · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/genericas/pagina-generica').then(
            (modulo) => modulo.PaginaGenerica,
          ),
        data: { pagina: 'Bajas y alertas' },
      },
      {
        path: 'casos',
        title: 'Casos · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/genericas/pagina-generica').then(
            (modulo) => modulo.PaginaGenerica,
          ),
        data: { pagina: 'Casos' },
      },
      {
        path: 'justificaciones',
        title: 'Justificaciones · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/genericas/pagina-generica').then(
            (modulo) => modulo.PaginaGenerica,
          ),
        data: { pagina: 'Justificaciones' },
      },
      {
        path: 'calendario',
        title: 'Calendario · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/especiales/calendario.pagina').then(
            (modulo) => modulo.CalendarioPagina,
          ),
      },
      {
        path: 'periodos',
        title: 'Periodos · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/genericas/pagina-generica').then(
            (modulo) => modulo.PaginaGenerica,
          ),
        data: { pagina: 'Periodos' },
      },
      {
        path: 'reportes',
        title: 'Reportes · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/especiales/reportes.pagina').then(
            (modulo) => modulo.ReportesPagina,
          ),
      },
      {
        path: 'usuarios',
        title: 'Usuarios · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/genericas/pagina-generica').then(
            (modulo) => modulo.PaginaGenerica,
          ),
        data: { pagina: 'Usuarios' },
      },
      {
        path: 'configuracion',
        title: 'Configuración · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/especiales/configuracion.pagina').then(
            (modulo) => modulo.ConfiguracionPagina,
          ),
      },
      {
        path: 'bitacora',
        title: 'Bitácora · SIGBA',
        loadComponent: () =>
          import('./caracteristicas/genericas/pagina-generica').then(
            (modulo) => modulo.PaginaGenerica,
          ),
        data: { pagina: 'Bitácora' },
      },
    ],
  },
  { path: '**', redirectTo: 'admin/inicio' },
];
