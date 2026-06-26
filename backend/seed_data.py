from extensions import db
from models.modelo_estado_inscripcion import EstadoInscripcion

def cargar_datos_iniciales():
    cargar_estados_inscripcion()

def cargar_estados_inscripcion():
    if EstadoInscripcion.query.count() > 0:
        return 
    
    estados = [
        EstadoInscripcion(id_estado=1, nombre = "Pendiente"),
        EstadoInscripcion(id_estado=2, nombre = "Aceptada"),
        EstadoInscripcion(id_estado=3, nombre = "Rechazada"),
        EstadoInscripcion(id_estado=4, nombre = "Cancelada"),
        EstadoInscripcion(id_estado=5, nombre = "Finalizada"),
    ]

    db.session.add_all(estados)
    db.session.commit()

