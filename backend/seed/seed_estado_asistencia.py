from extensions import db
from models.modelo_estado_asistencia import EstadoAsistencia

def cargar_estados_asistencia():
    if EstadoAsistencia.query.count() > 0:
        return
    
    estados = [
        EstadoAsistencia(id_estado_asistencia = 1, nombre="Presente"),
        EstadoAsistencia(id_estado_asistencia = 2, nombre="Ausente"),
        EstadoAsistencia(id_estado_asistencia = 3, nombre="Justificado"),
        EstadoAsistencia(id_estado_asistencia = 4, nombre="Tarde")
    ]

    db.session.add_all(estados)
    db.session.commit()