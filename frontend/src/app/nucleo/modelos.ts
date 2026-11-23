export type NombreIcono =
  | 'panel'
  | 'alumnos'
  | 'rostro'
  | 'espera'
  | 'alerta'
  | 'casos'
  | 'justificaciones'
  | 'calendario'
  | 'periodos'
  | 'reportes'
  | 'usuarios'
  | 'configuracion'
  | 'bitacora'
  | 'utensilios'
  | 'credencial'
  | 'buscar'
  | 'wifi'
  | 'sin-wifi'
  | 'campana'
  | 'correcto'
  | 'incorrecto'
  | 'informacion'
  | 'reloj'
  | 'izquierda'
  | 'derecha'
  | 'abajo'
  | 'menu'
  | 'cerrar'
  | 'salir'
  | 'mas'
  | 'subir'
  | 'descargar'
  | 'filtro'
  | 'filtros'
  | 'opciones'
  | 'camara'
  | 'repetir'
  | 'editar'
  | 'edificio'
  | 'flecha-derecha'
  | 'ajustes'
  | 'ojo'
  | 'escudo'
  | 'actividad'
  | 'abajo-flecha'
  | 'tabla'
  | 'guardar'
  | 'pausa'
  | 'circulo';

export interface EnlaceNavegacion {
  etiqueta: string;
  ruta: string;
  icono: NombreIcono;
  insignia?: string;
}

export interface Alumno {
  matricula: string;
  nombre: string;
  iniciales: string;
  carrera: string;
  cafeteria: string;
  estado: string;
  faltas: number;
  rostro: boolean;
}

export interface TablaMaqueta {
  titulo: string;
  descripcion: string;
  columnas: string[];
  filas: string[][];
  icono: NombreIcono;
  accion: string;
}

export interface MetricaMaqueta {
  etiqueta: string;
  valor: string;
  detalle: string;
  icono: NombreIcono;
  tono: 'azul' | 'verde' | 'ambar' | 'rojo';
  tendencia?: string;
}

export interface EstadoTerminal {
  clave: 'espera' | 'aprobado' | 'aviso' | 'rechazo' | 'sin-conexion';
  fondo: string;
  icono: NombreIcono;
  titulo: string;
  mensaje: string;
  detalle: string;
}
