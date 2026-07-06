from extensions import db
from models.modelo_estado_inscripcion import EstadoInscripcion

# ============================================================
# Inserta los estados de inscripción en la base de datos.
# La carga solo se realiza si la tabla aún no contiene datos,
# evitando registros duplicados.
# ============================================================

def cargar_estados_inscripcion():
    # Verifica si ya existen estados registrados.
    if EstadoInscripcion.query.count() > 0:
        return 
    
     # Define los estados iniciales de una inscripción.
    estados = [
        EstadoInscripcion(id_estado=1, nombre = "Pendiente"),
        EstadoInscripcion(id_estado=2, nombre = "Aceptada"),
        EstadoInscripcion(id_estado=3, nombre = "Rechazada"),
        EstadoInscripcion(id_estado=4, nombre = "Cancelada"),
        EstadoInscripcion(id_estado=5, nombre = "Finalizada"),
    ]

    # Agrega todos los estados a la sesión de la base de datos.
    db.session.add_all(estados)
    # Confirma la transacción para almacenar los registros.
    db.session.commit()