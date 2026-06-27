from models.modelo_estado_inscripcion import EstadoInscripcion

def obtener_estado_por_nombre(nombre):
    return EstadoInscripcion.query.filter_by(
        nombre=nombre
    ).first()