from models.modelo_tipo_certificado import TipoCertificado

def obtener_tipo_certificado_por_nombre(nombre):
    return TipoCertificado.query.filter_by(
        nombre = nombre
    ).first()


def obtener_tipo_certificado_por_id(id_tipo_certificado):
    return TipoCertificado.query.get(id_tipo_certificado)