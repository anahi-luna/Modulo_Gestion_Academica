# Módulo de Seguridad - RBAC

## Objetivo

El módulo de seguridad implementa un modelo de autorización basado en **RBAC (Role-Based Access Control)** para el Microservicio de Gestión Académica.

Mientras el Microservicio de Autenticación (MS3) no está disponible, se utiliza un sistema **Mock** basado en archivos YAML que simula el comportamiento futuro con **JWT**, **Redis** y el **API Gateway**.

La arquitectura fue diseñada para que, cuando el MS3 esté implementado, únicamente sea necesario reemplazar la fuente de autenticación sin modificar los controladores, servicios o decoradores.

---

# Flujo de Autorización

Actualmente el flujo funciona de la siguiente manera:

```text
Cliente
   │
   ▼
HTTP Request
   │
   ▼
before_request.py
   │
   ▼
auth.py
   │
   ▼
auth_mock.py
   │
   ▼
YAML (usuarios, roles y acciones)
   │
   ▼
flask.g
   │
   ▼
@requires_permission(...)
   │
   ▼
Controller
   │
   ▼
Service
```

Cuando el MS3 esté disponible, solamente cambiará la obtención del usuario:

```text
JWT
   │
   ▼
Redis
   │
   ▼
Usuario + Roles + Acciones
```

El resto del flujo permanecerá igual.

---

# Estructura

```text
backend/

config/
├── application.yml
├── permissions.yml
├── roles.yml
└── users_mock.yml

security/
├── permission_loader.py
├── auth_mock.py
├── auth.py
├── before_request.py
└── decorators.py
```

---

# Descripción de los archivos

## application.yml

Archivo de configuración general del módulo de seguridad.

Contiene la configuración del microservicio, Redis y la URL del Microservicio de Autenticación.

---

## permissions.yml

Define todas las acciones disponibles dentro del microservicio.

Ejemplo:

```text
inscripcion.clases.crear
inscripcion.clases.leer
inscripcion.clases.actualizar
inscripcion.clases.eliminar
```

Estas acciones representan los permisos que posteriormente registrará el MS3.

---

## roles.yml

Define los roles del sistema y las acciones permitidas para cada uno.

Ejemplo:

```text
DOCENTE

↓

inscripcion.clases.leer
inscripcion.clases.actualizar
...
```

Implementa el modelo RBAC.

---

## users_mock.yml

Simula los usuarios que existirán en el MS3.

Cada usuario posee:

- id_usuario
- username
- nombre
- roles

Las acciones **no se almacenan**, sino que se calculan automáticamente según los roles asignados.

---

## permission_loader.py

Carga los archivos YAML del módulo de seguridad y los convierte en estructuras de Python.

Funciones principales:

- cargar_application()
- cargar_permissions()
- cargar_roles()
- cargar_users()

---

## auth_mock.py

Simula el comportamiento del Microservicio de Autenticación.

Obtiene un usuario desde `users_mock.yml`, consulta sus roles y genera automáticamente la lista de acciones permitidas.

---

## auth.py

Centraliza la obtención del usuario autenticado.

Actualmente utiliza el header:

```text
X-Mock-User
```

En el futuro obtendrá la información desde JWT y Redis sin afectar al resto del proyecto.

---

## before_request.py

Hook global de Flask que se ejecuta antes de cada request.

Carga en `flask.g` la información del usuario autenticado:

```python
g.usuario
g.id_usuario
g.roles
g.actions
```

De esta forma cualquier endpoint puede acceder al contexto del usuario.

---

## decorators.py

Implementa el decorador:

```python
@requires_permission(...)
```

Verifica que el usuario posea la acción requerida antes de ejecutar el endpoint.

Si el usuario no tiene el permiso correspondiente, devuelve:

```text
HTTP 403 - Forbidden
```

---

# Flujo interno

```text
users_mock.yml
        │
        ▼
roles.yml
        │
        ▼
auth_mock.py
        │
        ▼
Usuario + Acciones
        │
        ▼
before_request.py
        │
        ▼
flask.g
        │
        ▼
@requires_permission(...)
        │
        ▼
Endpoint
```

---

# Próximos pasos

- Agregar `@requires_permission(...)` a todos los endpoints.
- Validar cada rol utilizando el header `X-Mock-User`.
- Finalizar el desarrollo de las entidades restantes.
- Reemplazar el Mock por JWT y Redis cuando el MS3 esté disponible.