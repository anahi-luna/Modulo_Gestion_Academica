from models.modelo_estado_resultado_plan import EstadoResultadoPlan


def obtener_estado_resultado_plan_por_nombre(nombre):

    return EstadoResultadoPlan.query.filter_by(
        nombre=nombre
    ).first()


def obtener_estado_resultado_plan_por_id(id_estado_resultado_plan):

    return EstadoResultadoPlan.query.get(
        id_estado_resultado_plan
    )