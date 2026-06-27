# Arquitectura del Backend

El microservicio de Gestión Académica sigue una arquitectura por capas con el objetivo de separar responsabilidades, facilitar el mantenimiento del código y favorecer la escalabilidad del sistema.

---

# Arquitectura General

```text
                Cliente (Frontend / API Consumer)
                            │
                            ▼
                         Routes
                            │
                            ▼
                      Controllers
                            │
                            ▼
                        Services
                       /        \
                      ▼          ▼
                 SQLAlchemy    Mocks
                      │
                      ▼
                    SQLite
```

Cada capa tiene una responsabilidad específica.

---

# Routes

Las **Routes** definen los endpoints expuestos por la API REST.

Su función es recibir las peticiones HTTP y redirigirlas al Controller correspondiente.

Ejemplo:

- GET
- POST
- PUT
- DELETE

No contienen lógica de negocio.

---

# Controllers

Los **Controllers** reciben la petición HTTP.

Se encargan de:

- Leer parámetros.
- Obtener el cuerpo del Request.
- Validar datos utilizando Marshmallow.
- Invocar al Service correspondiente.
- Construir la respuesta JSON.

Los Controllers no deben contener reglas del negocio.

---

# Services

Los **Services** implementan la lógica del negocio.

Actualmente el módulo implementa las siguientes reglas de negocio:

- Verificar existencia del legajo.
- Verificar que el legajo se encuentre activo.
- Verificar existencia de la comisión.
- Verificar disponibilidad de cupo.
- Verificar existencia del usuario que registra la inscripción.
- Verificar que el alumno no posea otra inscripción activa.
- Asignar automáticamente el estado inicial "Pendiente".

Toda regla del negocio debe implementarse en esta capa.

---

# Models

Los **Models** representan las tablas de la base de datos utilizando SQLAlchemy.

Cada modelo corresponde a una entidad del sistema.

Ejemplos:

- Inscripcion
- EstadoInscripcion

---

# Schemas

Los **Schemas** utilizan Marshmallow para:

- Validar Requests.
- Serializar objetos SQLAlchemy.
- Convertir objetos Python a JSON.
- Convertir JSON a objetos Python.

Los Schemas ayudan a mantener un formato consistente en toda la API.

---

# Base de Datos

Durante el desarrollo el proyecto utiliza:

- SQLite
- SQLAlchemy ORM

La base de datos pertenece exclusivamente al microservicio.

---

# Mocks

Actualmente existen microservicios que todavía no fueron desarrollados.

Para permitir el avance del proyecto se utilizan **Mocks**, simulando las respuestas de dichos servicios.

Actualmente se simulan:

- Legajos
- Comisiones
- Usuarios

Cuando los demás microservicios estén disponibles, estos Mocks serán reemplazados por llamadas HTTP a las APIs correspondientes.

---

# Responses

Todas las respuestas de la API siguen el formato JSON definido por el proyecto.

Ejemplo:

```json
{
    "status": "success",
    "data": [],
    "total": 0,
    "message": "Operación realizada correctamente."
}
```

En caso de error:

```json
{
    "status": "error",
    "message": "Descripción del error.",
    "errors": {}
}
```

---

# Organización del Backend

```text
backend/
│
├── app.py
├── extensions.py
├── exceptions.py
├── config/
├── controllers/
├── models/
├── routes/
├── schemas/
├── services/
├── mocks/
├── tests/
├── utils/
├── seed_data.py
└── requirements.txt
```

Cada carpeta tiene una responsabilidad específica, manteniendo una arquitectura modular y desacoplada.