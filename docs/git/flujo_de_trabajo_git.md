# Flujo de Trabajo con Git

Este documento describe el flujo de trabajo acordado para el desarrollo del proyecto.

---

# Ramas del proyecto

El proyecto utiliza las siguientes ramas principales:

- **main**
- **develop**

## main

Contiene únicamente versiones estables del proyecto.

No se desarrolla directamente sobre esta rama.

## develop

Es la rama de integración donde se incorporan todas las funcionalidades desarrolladas por el equipo.

Tampoco se debe desarrollar directamente sobre esta rama.

---

# Antes de comenzar una tarea

Actualizar siempre la rama **develop**.

```bash
git checkout develop
git pull origin develop
```

---

# Crear una rama de trabajo

Cada nueva funcionalidad debe desarrollarse en una rama **feature**.

```bash
git checkout -b feature/nombre-funcionalidad
```

Ejemplos:

```bash
git checkout -b feature/inscripciones
```

```bash
git checkout -b feature/asistencias
```

```bash
git checkout -b feature/calificaciones
```

```bash
git checkout -b feature/certificados
```

---

# Durante el desarrollo

Agregar los cambios:

```bash
git add .
```

Realizar el commit:

```bash
git commit -m "Descripción de los cambios realizados"
```

Ejemplo:

```bash
git commit -m "Implementa CRUD de inscripciones"
```

---

# Subir la rama al repositorio

```bash
git push origin feature/nombre-funcionalidad
```

Ejemplo:

```bash
git push origin feature/inscripciones
```

---

# Finalización de la funcionalidad

Una vez terminada la funcionalidad:

```text
feature/*
      │
      ▼
develop
```

La integración debe realizarse mediante un **Pull Request** para que el código pueda ser revisado antes de incorporarse a la rama **develop**.

---

# Buenas prácticas

- No trabajar directamente sobre **main**.
- No trabajar directamente sobre **develop**.
- Actualizar **develop** antes de crear una nueva rama.
- Cada rama debe representar una única funcionalidad.
- Escribir mensajes de commit claros y descriptivos.
- Mantener sincronizada la rama con el repositorio remoto.

---

# Convención de nombres

Se recomienda utilizar el siguiente formato:

```text
feature/nombre-funcionalidad
```

Ejemplos:

```text
feature/inscripciones
feature/asistencias
feature/calificaciones
feature/certificados
feature/archivos-digitales
```