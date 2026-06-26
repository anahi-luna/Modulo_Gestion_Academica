# Inicializar Backend

Este documento está dirigido al equipo de **Backend** y describe los pasos necesarios para configurar el entorno de desarrollo del microservicio de Gestión Académica.

---

# Requisitos

Antes de comenzar, asegúrese de tener instalado:

- Python 3.13 o superior
- Git
- pip

Puede verificar la versión de Python ejecutando:

```bash
python --version
```

---

# Clonar el repositorio

```bash
git clone https://github.com/anahi-luna/Modulo_Gestion_Academica.git
```

Ingresar al proyecto:

```bash
cd Modulo_Gestion_Academica
```

---

# Ingresar al Backend

```bash
cd backend
```

---

# Crear el entorno virtual

Windows / Linux / Mac

```bash
python -m venv .venv
```

---

# Activar el entorno virtual

## Windows

```bash
.venv\Scripts\activate
```

## Linux / macOS

```bash
source .venv/bin/activate
```

---

# Instalar las dependencias

```bash
pip install -r requirements.txt
```

---

# Ejecutar el Backend

```bash
python app.py
```

Si todo está correctamente configurado, el servidor Flask iniciará en:

```text
http://localhost:5000
```

---

# Base de Datos

El proyecto utiliza **SQLite** como base de datos durante la etapa de desarrollo.

La base de datos se crea automáticamente al ejecutar el proyecto por primera vez.

También se cargan automáticamente los datos iniciales definidos en:

```text
backend/seed_data.py
```

Actualmente se cargan:

- Estados de Inscripción

No es necesario crear las tablas manualmente.

---

# Instalación de nuevas dependencias

Si durante el desarrollo se instala una nueva dependencia:

```bash
pip install nombre_paquete
```

Actualizar el archivo de dependencias ejecutando:

```bash
pip freeze > requirements.txt
```

Luego realizar el commit correspondiente para que el resto del equipo pueda instalar la misma versión.

---

# Importante

Este microservicio actualmente utiliza **Mocks** para simular la comunicación con otros microservicios mientras éstos se encuentran en desarrollo.

Los Mocks actuales corresponden a:

- Legajos
- Comisiones
- Usuarios

En futuras etapas estos serán reemplazados por llamadas HTTP a las APIs reales.