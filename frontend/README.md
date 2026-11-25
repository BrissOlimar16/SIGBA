# Frontend SIGBA

Maqueta frontend de SIGBA construida con Angular 22, Tailwind CSS 4, TypeScript y Vitest. Es una demostración visual y funcional con datos simulados: **no consume API, no usa `HttpClient`, no guarda información y no implementa autenticación**.

El diseño toma como referencia el prototipo y adapta todas sus pantallas a componentes standalone de Angular. La interfaz, los mensajes y los comentarios de documentación están en español.

## Requisitos

- Node.js compatible con Angular 22.
- npm 11 o superior.

Las dependencias se instalan desde `package-lock.json`; no se requieren servicios externos para ejecutar la maqueta.

## Instalación

Desde esta carpeta:

```bash
npm ci
```

Si no existe `package-lock.json` o se está actualizando deliberadamente el árbol de dependencias, también puede usarse `npm install`.

## Ejecutar en desarrollo

```bash
npm start
```

Luego abrir `http://localhost:4200/`.

Rutas principales:

- `/terminal`: terminal de cafetería.
- `/admin/inicio`: panel principal.
- `/admin/alumnos`: directorio de alumnos.
- `/admin/alumnos/nuevo`: registro de alumno.
- `/admin/alumnos/:matricula`: ficha de un alumno.
- `/admin/enrolamiento`: captura facial simulada.
- `/admin/calendario`: calendario de servicios.
- `/admin/reportes`: filtros, gráfica y descargas simuladas.
- `/admin/configuracion`: parámetros del sistema.
- `/admin/lista-espera`, `/admin/bajas-alertas`, `/admin/casos`, `/admin/justificaciones`, `/admin/periodos`, `/admin/usuarios` y `/admin/bitacora`: vistas de consulta.

La ruta raíz `/` redirige a `/admin/inicio`.

## Qué se puede probar

- En la terminal, escribir una matrícula y presionar Enter. El sufijo define el resultado simulado: `4` aprobado, `5` aviso, `9` sin conexión; cualquier otro valor muestra rechazo. También hay botones para forzar cada estado.
- En alumnos, buscar por nombre, matrícula o carrera, filtrar por cafetería/estado y abrir la ficha de un alumno.
- En enrolamiento, marcar el consentimiento y realizar tres capturas simuladas.
- En calendario, seleccionar días y revisar la leyenda de servicios.
- En reportes y configuración, usar los filtros y botones para ver mensajes de confirmación simulados.

Todos los datos viven en `src/app/nucleo/datos.ts`. Los textos visibles están centralizados en `src/app/nucleo/mensajes.es.ts`.

## Estructura

```text
src/app/
├── nucleo/
│   ├── datos.ts              # mocks de alumnos, métricas y tablas
│   ├── mensajes.es.ts        # todos los textos de la interfaz
│   ├── modelos.ts            # tipos compartidos
│   └── iconos/icono.ts       # iconos SVG locales
├── compartido/interfaz/      # shell, botones, paneles, tablas y distintivos
├── caracteristicas/          # una carpeta por pantalla o grupo de pantallas
├── app.routes.ts             # rutas perezosas
└── app.ts / app.html         # punto de entrada visual
```

No se usa Angular Material. Los iconos son SVG locales definidos en `icono.ts`: `lucide-angular` no puede instalarse con Angular 22 porque declara soporte hasta Angular 21. La fuente Inter se sirve desde el paquete `@fontsource-variable/inter`, sin CDN.

## Compilar

```bash
npm run build
```

El resultado se genera en `dist/frontend`.

## Pruebas y calidad

```bash
npm test -- --watch=false
npx prettier --check .
```

Para aplicar formato automáticamente:

```bash
npx prettier --write .
```

No hay pruebas end-to-end configuradas.

## Solución de problemas

Si la compilación falla con `ERR_MODULE_NOT_FOUND` o con un paquete incompleto en `node_modules`, reinstalar desde el lockfile:

```bash
npm ci
```

## Alcance

Este README documenta únicamente el frontend. La API, la base de datos, los contenedores y el despliegue se documentan en el README principal del repositorio.
