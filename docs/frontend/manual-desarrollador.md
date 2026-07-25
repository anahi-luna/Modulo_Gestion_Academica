# Manual del Desarrollador

Guía para clonar, instalar y correr el frontend localmente, y para entender las convenciones del repo antes de tocar código.

## 1. Requisitos previos

| Herramienta | Versión sugerida | Para qué |
|---|---|---|
| Node.js | 18 o superior | Correr Vite y npm |
| npm | 9 o superior (viene con Node) | Instalar dependencias |
| Backend del proyecto corriendo | — | El front no funciona solo; necesita el microservicio de Gestión Académica en `http://localhost:5000` (o la URL que definas en `VITE_API_URL`) |

## 2. Instalación

```bash
# 1. Clonar el repo (o entrar a la carpeta si ya lo tenés)
git clone <url-del-repo>
cd frontend

# 2. Instalar dependencias
npm install
```

## 3. Variables de entorno

El proyecto usa **una sola** variable de entorno, leída por Vite:

| Variable | Obligatoria | Default si no está | Qué hace |
|---|---|---|---|
| `VITE_API_URL` | No | `http://localhost:5000` | Base URL del backend contra el que pega el front |

Para configurarla, crear un archivo `.env` en la raíz del proyecto (al lado de `package.json`):

```bash
# .env
VITE_API_URL=http://localhost:5000
```

Si vas a apuntar a un backend desplegado (staging/producción), cambiás solo ese valor y no hace falta tocar ni una línea de código — todas las llamadas parten de `src/api/api.js`, que lee esta variable.

> Importante: en Vite, las variables de entorno que se usan del lado del cliente **tienen que empezar con `VITE_`**, si no, no quedan expuestas al código del navegador.

## 4. Levantar el entorno de desarrollo

```bash
npm run dev
```

Por defecto Vite levanta en `http://localhost:5173`. La consola te va a mostrar la URL exacta.

Con el servidor de desarrollo corriendo, cualquier cambio en el código se refleja al instante en el navegador (Hot Module Replacement), sin recargar la página entera.

## 5. Build de producción

```bash
npm run build
```

Esto genera una carpeta `dist/` con los archivos estáticos optimizados (HTML, CSS y JS minificados), lista para servir con cualquier servidor estático (Nginx, Vercel, Netlify, etc.).

Para previsualizar ese build localmente antes de desplegarlo:

```bash
npm run preview
```

## 6. Estructura del proyecto

```
frontend/
├── public/                # Assets estáticos que se sirven tal cual
├── src/
│   ├── api/                # Funciones que hacen fetch() a cada endpoint
│   ├── Services/            # Lógica de negocio, arma los datos para la UI
│   ├── pages/                # Una página por módulo/ruta
│   ├── components/           # Componentes de UI, agrupados por módulo
│   ├── context/               # PermissionsContext (usuario + permisos)
│   ├── config/                 # Constantes compartidas (acciones de permisos, catálogo de módulos)
│   ├── mocks/                  # Datos de prueba para módulos sin endpoint real todavía
│   ├── App.jsx                  # Rutas de la aplicación
│   └── main.jsx                  # Punto de entrada, monta <App /> en el DOM
├── .env                         # Variables de entorno locales (no se commitea)
├── vite.config.js
├── package.json
└── tailwind.config.js (o configuración de Tailwind vía el plugin de Vite)
```

Para más detalle de por qué está separado así (y no, por ejemplo, todo junto en `pages/`), ver [`01-arquitectura.md`](01-arquitectura.md).

## 7. Convenciones de código

Estas son las que ya está siguiendo el proyecto; mantenerlas facilita que cualquiera pueda leer el código de cualquier módulo sin sorpresas:

- **Nombres de archivo**: `PascalCase` para componentes (`GestionClases.jsx`), `camelCase` para servicios y utilidades (`clasesAdminService.js`).
- **Un archivo de `api/` por microrecurso**, con una función por operación (`getListaClases`, `crearClase`, `editarClase`, `eliminarClase`), nunca una función genérica tipo `request(metodo, url)`. Es más código, pero cada función es autoexplicativa y fácil de buscar.
- **Nunca hacer `fetch` directo desde un componente.** Siempre pasar por `api/` → `Services/`.
- **Permisos, siempre por constante**, nunca un string suelto: usar `ACCIONES.CLASES_CREAR` (de `src/config/modulos.js`), no `"micro2.clases.crear"` tipeado a mano en cada componente.
- **Comentarios en primera persona / explicando el "por qué", no el "qué".** El código ya dice qué hace; los comentarios están para explicar decisiones que no son obvias (por qué el backend requiere tal campo, por qué hay que evitar tal endpoint en determinado caso, etc.).

## 8. Cómo agregar un módulo nuevo (checklist)

Si mañana el backend agrega un microservicio nuevo (por ejemplo, "Reportes"), el orden para agregarlo del lado del front es:

1. Crear `src/api/reportesApi.js` con una función por endpoint, siguiendo el patrón de [`02-consumo-api.md`](02-consumo-api.md).
2. Crear `src/Services/reportesService.js` que use esas funciones y arme los datos para la UI.
3. Agregar las constantes de permisos correspondientes en `src/config/modulos.js` (`REPORTES_LEER`, etc.), si el backend ya las definió en `permisos.yml`.
4. Crear la página en `src/pages/Reportes.jsx`, consumiendo el `Service`, y usando `usePermissions()` para mostrar/ocultar acciones según lo que el usuario logueado pueda hacer.
5. Agregar la ruta en `App.jsx`, protegida con `RutaProtegida` y el permiso correspondiente.
6. Agregar el link en el navbar (`src/components/navbar/Navbar.jsx`), condicionado también al permiso de lectura del módulo.
