from models.modelo_estado_asistencia import EstadoAsistencia

def obtener_estado_asistencia_por_nombre(nombre):
    return EstadoAsistencia.query.filter_by(
        nombre = nombre
    ).first()


def obtener_estado_asistencia_por_id(id_estado):
    return EstadoAsistencia.query.get(id_estado)