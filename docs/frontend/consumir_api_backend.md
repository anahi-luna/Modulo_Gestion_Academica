# Consumir la API del Backend

Este documento está dirigido al equipo de **Frontend** y explica cómo ejecutar el backend localmente para consumir las APIs desarrolladas en Flask.

---

# ¿Por qué debo ejecutar el backend?

Durante las primeras etapas del proyecto el Frontend trabajó utilizando **Mocks** (datos simulados).

A medida que el Backend implementa nuevos endpoints, el Frontend deberá reemplazar esos mocks por llamadas a la API real.

Para ello es necesario ejecutar el microservicio de Gestión Académica de forma local.

---

# Requisitos

Antes de comenzar asegúrese de tener instalado:

- Git
- Python 3.13 o superior
- pip

---

# Inicializar el Backend

## 1. Clonar el repositorio

```bash
git clone https://github.com/anahi-luna/Modulo_Gestion_Academica.git
```

Ingresar al proyecto

```bash
cd Modulo_Gestion_Academica
```

---

## 2. Ingresar a la carpeta Backend

```bash
cd backend
```

---

## 3. Crear el entorno virtual

Windows / Linux / Mac

```bash
python -m venv .venv
```

---

## 4. Activar el entorno virtual

### Windows

```bash
.venv\Scripts\activate
```

### Linux / Mac

```bash
source .venv/bin/activate
```

---

## 5. Instalar las dependencias

```bash
pip install -r requirements.txt
```

---

## 6. Ejecutar el Backend

```bash
python app.py
```

Si todo se encuentra correctamente configurado, Flask iniciará el servidor de desarrollo.

---

# URL del Backend

El Backend quedará disponible en:

```text
http://localhost:5000
```

---

# Consumir la API desde React

En los servicios del Frontend configurar la URL base apuntando al Backend.

Ejemplo:

```javascript
const API = "http://localhost:5000/api";
```

Luego consumir los endpoints normalmente.

Ejemplo:

```http
GET http://localhost:5000/api/inscripciones
```

---

# Importante

Actualmente este microservicio utiliza **Mocks** para simular la comunicación con otros microservicios que aún se encuentran en desarrollo.

Los Mocks utilizados son:

- Legajos
- Comisiones
- Usuarios

Cuando dichos microservicios estén disponibles, los Mocks serán reemplazados por llamadas HTTP a sus respectivas APIs.

---

# Documentación de la API

La documentación de todos los endpoints disponibles se encuentra en:

```text
docs/api/endpoints.md
```

Se recomienda consultar ese documento para conocer:

- Endpoints disponibles.
- Método HTTP.
- Parámetros.
- Estructura de Request.
- Estructura de Response.