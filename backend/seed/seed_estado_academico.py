from extensions import db
from models.modelo_estado_academico import EstadoAcademico

# ============================================================
# Inserta los estados academicos en la base de datos.
# La carga se realiza únicamente si la tabla está vacía,
# evitando duplicar registros.
# ============================================================

def cargar_estados_academicos():
    # Verifica si ya existen registros en la tabla.
    # Si existen, finaliza la ejecución.
    if EstadoAcademico.query.count() > 0:
        return
    
    # Crea la lista de estados academicos predeterminados.
    estados = [
        EstadoAcademico(id_estado_academico = 1, nombre="En curso"),
        EstadoAcademico(id_estado_academico = 2, nombre="Regular"),
        EstadoAcademico(id_estado_academico = 3, nombre="Aprobado"),
        EstadoAcademico(id_estado_academico = 4, nombre="Desaprobado"),
        EstadoAcademico(id_estado_academico = 5, nombre="Libre"),
        EstadoAcademico(id_estado_academico = 6, nombre="Abandonó")
    ]

     # Agrega todos los estados a la sesión de la base de datos.
    db.session.add_all(estados)
    # Guarda los cambios de forma permanente.
    db.session.commit()