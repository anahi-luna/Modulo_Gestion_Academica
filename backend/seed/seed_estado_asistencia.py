from extensions import db
from models.modelo_estado_asistencia import EstadoAsistencia

# ============================================================
# Inserta los estados de asistencia en la base de datos.
# La carga se realiza únicamente si la tabla está vacía,
# evitando duplicar registros.
# ============================================================

def cargar_estados_asistencia():
    # Verifica si ya existen registros en la tabla.
    # Si existen, finaliza la ejecución.
    if EstadoAsistencia.query.count() > 0:
        return
    
    # Crea la lista de estados de asistencia predeterminados.
    estados = [
        EstadoAsistencia(id_estado_asistencia = 1, nombre="Presente"),
        EstadoAsistencia(id_estado_asistencia = 2, nombre="Ausente"),
        EstadoAsistencia(id_estado_asistencia = 3, nombre="Justificado"),
        EstadoAsistencia(id_estado_asistencia = 4, nombre="Tarde")
    ]

     # Agrega todos los estados a la sesión de la base de datos.
    db.session.add_all(estados)
    # Guarda los cambios de forma permanente.
    db.session.commit()