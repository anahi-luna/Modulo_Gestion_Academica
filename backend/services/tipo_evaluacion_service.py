from models.modelo_tipo_evaluacion import TipoEvaluacion

def obtener_tipo_evaluacion_por_nombre(nombre):
    return TipoEvaluacion.query.filter_by(
        nombre = nombre
    ).first()


def obtener_tipo_evaluacion_por_id(id_tipo_evaluacion):
    return TipoEvaluacion.query.get(id_tipo_evaluacion)