from models.modelo_estado_academico import EstadoAcademico


def obtener_estado_academico_por_nombre(nombre):

    return EstadoAcademico.query.filter_by(
        nombre=nombre
    ).first()


def obtener_estado_academico_por_id(id_estado_academico):

    return EstadoAcademico.query.get(
        id_estado_academico
    )