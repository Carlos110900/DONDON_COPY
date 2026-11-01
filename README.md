# DonDoDontonbori

Dandadan, dandadan, dandadan, dandadan, dandadan Dandadan, dandadan, dandadan, dandadan, dandadan Dandadan, dandadan, dandadan, dandadan, dandadan Dandadan, dandadan, dandadan

Dandadan, dandadan, dandadan, dandadan, dandadan Dandadan, dandadan, dandadan, dandadan, dandadan Dandadan, dandadan, dandadan, dandadan, dandadan Dandadan, dandadan, dandadan

# DonDoDontonbori

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.26.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Entrega 3: integración con API

### Fuente de datos: API simulada con json-server

**Por qué json-server:** permite tener un CRUD REST real (GET/POST/PATCH/DELETE) a partir de un
solo archivo (`api/db.json`) sin escribir un backend. Así el equipo se concentró en la capa de
datos, los formularios y los estados de la UI. No sirve para producción: no valida, no autentica
y no maneja concurrencia.

**Cómo se reemplazará por una API real:**

1. La app solo depende de la clase abstracta `ComicRepository`. La implementación actual es
   `HttpComicRepository` (se registra en `app.config.ts`).
2. Para migrar: ajustar `environment.apiUrl`, adaptar rutas y formas de respuesta en
   `HttpComicRepository` / `comic.mapper.ts` y mantener el mismo contrato (ver abajo).
3. El `ApiError` y el interceptor ya traducen los códigos HTTP estándar, así que la UI no cambia.
4. Búsqueda y paginación hoy se hacen en el cliente sobre la lista cargada (catálogo pequeño).
   Con un catálogo grande se moverían al servidor (`?_page&_limit&q`), tocando solo `ComicStore`.

### Cómo correrlo

```bash
npm install
npm run dev      # API en http://localhost:3000 + frontend en http://localhost:4200
# o por separado: npm run api   y   npm start
```

La URL base de la API está en `src/environments/environment*.ts` (`apiUrl`).

### Contrato de API (recurso `comics`)

| Método | Endpoint         | Descripción                                    | Éxito         | Errores                 |
| ------ | ---------------- | ---------------------------------------------- | ------------- | ----------------------- |
| GET    | `/comics`        | Lista todos los cómics                         | 200 `Comic[]` | 0 (sin conexión), 5xx   |
| GET    | `/comics/:id`    | Detalle                                        | 200 `Comic`   | 404                     |
| GET    | `/comics?id=:id` | Verifica si un id existe (validador asíncrono) | 200 `Comic[]` | 5xx                     |
| POST   | `/comics`        | Crea un cómic                                  | 201 `Comic`   | 400, 500 (id duplicado) |
| PATCH  | `/comics/:id`    | Edita campos (no toca capítulos)               | 200 `Comic`   | 404, 400                |
| DELETE | `/comics/:id`    | Elimina                                        | 200 `{}`      | 404                     |

**Modelo `Comic`**

```json
{
  "id": "string (slug del título; coincide con la carpeta en public/comics)",
  "title": "string (3-80)",
  "description": "string (20-500)",
  "cover": "string (ruta en public, .jpg/.jpeg/.png/.webp)",
  "publisher": "string",
  "status": "ongoing | completed",
  "genres": ["string (mínimo 1)"],
  "involved": [{ "name": "string", "role": "writer | artist" }],
  "chapters": [{ "number": 1, "title": "string", "pdfUrl": "string (.pdf)" }]
}
```

**Errores y cómo los trata la app**

| Estado HTTP | Mensaje al usuario                                                     |
| ----------- | ---------------------------------------------------------------------- |
| 0           | No se pudo conectar con el servidor. Revisa que la API esté encendida. |
| 400 / 422   | Los datos enviados no son válidos.                                     |
| 404         | No encontramos el recurso solicitado.                                  |
| 409         | Ya existe un registro con esos datos.                                  |
| 5xx         | El servidor tuvo un problema. Intenta de nuevo en unos minutos.        |

json-server devuelve cuerpos de error vacíos o en texto plano, así que el mensaje se decide por
código HTTP en un único lugar (`shared/api/error.interceptor.ts` → `ApiError`).

### Arquitectura de datos

- `shared/repositories/`: contrato (`ComicRepository`) e implementación HTTP. Único lugar con HTTP.
- `shared/api/`: DTOs, mapper a modelos de dominio, `ApiError` e interceptor global.
- `shared/services/comic-store.ts`: estado con signals (lista, estado de carga, error) y mutaciones.
- `shared/utils/load-resource.ts`: carga de un recurso por ruta con loading/error/reintento.
- Estados de UI (cargando, error, vacío) con `app-data-state`; éxito/fallo de operaciones con toasts.

### Formularios

Un solo componente reactivo (`ComicForm`) sirve para alta (`/panel/comics/nuevo`) y edición
(`/panel/comics/:id/editar`, precargado desde la API). Validaciones: obligatorios, longitudes,
`noBlank`, `publicAsset` (ruta y extensión válidas), `minSelected` (≥1 género), `namesList`
y un validador asíncrono `uniqueComicId`. El botón se deshabilita mientras se guarda, y el guard
`pendingChangesGuard` pregunta antes de salir con cambios sin guardar.

### Fuera de alcance en esta entrega

Autenticación real (Login/Registro siguen simulados), usuarios del panel y favoritos
(persisten solo en memoria), y subida de archivos (la portada se captura como ruta en `public`).
