from models.modelo_estado_certificado import EstadoCertificado


def obtener_estado_certificado_por_nombre(nombre):

    return EstadoCertificado.query.filter_by(
        nombre=nombre
    ).first()


def obtener_estado_certificado_por_id(id_estado_certificado):

    return EstadoCertificado.query.get(
        id_estado_certificado
    )