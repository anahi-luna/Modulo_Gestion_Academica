# Gestión Académica (MS2)

Microservicio desarrollado para el proyecto **Sistema Integral de Gestión Académica para el Instituto Metropolitano de Formación de Bomberos de la Ciudad Autónoma de Buenos Aires**, basado en una arquitectura de microservicios.

Este microservicio es responsable de administrar el ciclo académico de los alumnos, incluyendo las inscripciones, el registro de asistencias, evaluaciones, calificaciones, resultados académicos y la emisión de certificados.

---

# Tecnologías utilizadas

### Backend

* Python 3.14
* Flask
* SQLAlchemy
* Marshmallow
* Flask-JWT-Extended
* PostgreSQL / SQLite
* Redis
* Docker

### Herramientas

* Docker Compose
* Git
* GitHub
* Postman

---

# Arquitectura

El sistema forma parte de una arquitectura basada en microservicios compuesta por:

* **MS1 - Planes:** Administración de personas, legajos, planes de estudio, asignaturas y comisiones.
* **MS2 - Gestión Académica:** Administración de inscripciones, clases, asistencias, evaluaciones, calificaciones, resultados académicos y certificados.
* **MS3 - Autenticación:** Gestión de usuarios, autenticación, autorización, roles y permisos mediante JWT.

Cada microservicio posee su propia base de datos y se comunica con los demás mediante APIs REST.

---

# Funcionalidades

Este microservicio implementa los siguientes módulos:

* Gestión de Inscripciones
* Gestión de Clases
* Registro de Asistencias
* Gestión de Evaluaciones
* Registro de Calificaciones
* Cálculo de Resultados Académicos
* Resultado Final de Planes de Estudio
* Emisión de Certificados

---

# Requisitos

Antes de ejecutar el proyecto es necesario tener instalado:

* Docker Desktop
* Docker Compose
* Git

---

# Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al proyecto:

```bash
cd gestion-academica
```

Configurar las variables de entorno utilizando el archivo `.env`.

---

# Variables de entorno

Ejemplo:

```env
DB_ENGINE=postgres

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=gestion_academica
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

JWT_SECRET_KEY=********

REDIS_HOST=redis
REDIS_PORT=6379
```

Para utilizar SQLite simplemente cambiar:

```env
DB_ENGINE=sqlite
```

---

# Ejecución

Levantar todos los servicios:

```bash
docker compose up --build
```

Para detenerlos:

```bash
docker compose down
```

---

# Estructura del proyecto

```
backend/
│
├── controllers/
├── models/
├── routes/
├── schemas/
├── services/
├── seed/
├── config/
├── utils/
├── tests/
│
frontend/
│
├── src/
├── components/
├── pages/
├── services/
├── context/
└── hooks/
```

---

# Autenticación

La autenticación se realiza mediante JWT utilizando el microservicio de Auth.

Todas las solicitudes protegidas deben incluir el encabezado:

```
Authorization: Bearer <token>
```

Los permisos de acceso son administrados por el microservicio de Autenticación mediante roles y acciones.

---

# Base de datos

El proyecto soporta dos motores de base de datos:

* SQLite (desarrollo local)
* PostgreSQL (Docker y despliegue)

La selección se realiza mediante la variable:

```env
DB_ENGINE
```

---

# API REST

El backend expone endpoints para:

* Inscripciones
* Clases
* Asistencias
* Evaluaciones
* Calificaciones
* Resultados Académicos
* Resultados de Plan
* Certificados

Las respuestas siguen un formato JSON estandarizado.

---

# Integración

Este microservicio consume información proveniente del microservicio de Planes para validar:

* Personas
* Legajos
* Comisiones
* Planes de estudio
* Asignaturas

También utiliza el microservicio de Autenticación para:

* Inicio de sesión
* Validación de JWT
* Roles
* Permisos
* Sesiones activas

---

# Equipo de desarrollo

Proyecto desarrollado como trabajo final de la Tecnicatura Universitaria.

**Grupo 2 – Gestión Académica**

Integrantes:

* Rebeca Luna
* Agustin Blancat
* Daniel Espindola

---

# Licencia

Proyecto desarrollado con fines académicos.
