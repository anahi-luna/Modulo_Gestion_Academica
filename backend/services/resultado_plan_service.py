from datetime import datetime
from sqlalchemy.exc import IntegrityError

from extensions import db
from exceptions import BusinessError
from utils.logger import logger
from flask import g, request
from models.modelo_resultado_plan import ResultadoPlan
from models.modelo_resultado_academico import ResultadoAcademico
from models.modelo_inscripcion import Inscripcion

from services.estado_resultado_plan_service import (
    obtener_estado_resultado_plan_por_nombre,
    obtener_estado_resultado_plan_por_id,
)
from services.estado_inscripcion_service import obtener_estado_por_nombre
from clients.planes_cliente import (
    obtener_legajo,
    obtener_plan,
    obtener_comisiones_asignaturas_por_plan
)


# -------------------CONSULTAS-------------------#


# Obtiene todos los resultados de planes.
def obtener_lista_resultados_plan():

    logger.info("Consultando listado de resultados de planes.")

    return ResultadoPlan.query.all()


# Obtiene un resultado de plan por ID.
def obtener_resultado_plan_por_id(id_resultado_plan):

    logger.info(f"Consultando resultado de plan {id_resultado_plan}.")

    return db.session.get(ResultadoPlan, id_resultado_plan)


# Verifica si ya existe un resultado para un plan.
def existe_resultado_plan(id_legajo, id_plan):

    return (
        ResultadoPlan.query.filter_by(id_legajo=id_legajo, id_plan=id_plan).first()
        is not None
    )


# -------------------OBTENCIÓN DE DATOS-------------------#


# Obtiene todas las inscripciones de un legajo dentro de un plan.
def obtener_inscripciones_plan(id_legajo, id_plan):

    inscripciones = []

    comisiones_asignaturas = obtener_comisiones_plan(id_plan)

    for comision_asignatura in comisiones_asignaturas:
        resultado = Inscripcion.query.filter_by(
            id_legajo=id_legajo, id_comision_asignatura=comision_asignatura["id_comision_asignatura"]
        ).first()

        if resultado:
            inscripciones.append(resultado)

    return inscripciones


# Obtiene todas las comisiones asignaturas
# correspondientes a un plan.
def obtener_comisiones_plan(id_plan):

    return obtener_comisiones_asignaturas_por_plan(id_plan,headers=request.headers)


# Obtiene los resultados académicos correspondientes a un plan.
def obtener_resultados_academicos_plan(id_legajo, id_plan):

    resultados = []

    inscripciones = obtener_inscripciones_plan(id_legajo, id_plan)

    for inscripcion in inscripciones:

        resultado = ResultadoAcademico.query.filter_by(
            id_inscripcion=inscripcion.id_inscripcion
        ).first()

        if resultado:

            resultados.append(resultado)

    return resultados


# Obtiene el resultado correspondiente a un plan y un legajo.
def obtener_resultado_plan(id_legajo, id_plan):

    return ResultadoPlan.query.filter_by(id_legajo=id_legajo, id_plan=id_plan).first()


# -------------------CÁLCULOS-------------------#


# Calcula la cantidad total de comisiones asignaturas del plan.
def calcular_materias_totales(id_plan):

    comisiones_asignaturas = obtener_comisiones_plan(id_plan)

    return len(comisiones_asignaturas)


# Calcula la cantidad de materias aprobadas.
def calcular_materias_aprobadas(id_legajo, id_plan):

    resultados = obtener_resultados_academicos_plan(id_legajo, id_plan)

    aprobadas = sum(
        1 for resultado in resultados if resultado.estado.nombre == "Aprobado"
    )

    return aprobadas


# Calcula la cantidad de materias finalizadas
def calcular_materias_finalizadas(id_legajo, id_plan):

    resultados = obtener_resultados_academicos_plan(id_legajo, id_plan)

    return len(resultados)


# Determina el estado del plan.
def determinar_estado_resultado_plan(
    materias_totales, materias_finalizadas, materias_aprobadas
):

    if materias_finalizadas != materias_totales:

        return obtener_estado_resultado_plan_por_nombre("En curso")

    if materias_aprobadas == materias_totales:

        return obtener_estado_resultado_plan_por_nombre("Finalizado")

    return obtener_estado_resultado_plan_por_nombre("Incompleto")


# Indica si un alumno ya finalizó un plan.
def plan_finalizado(id_legajo, id_plan):

    resultado = ResultadoPlan.query.filter_by(
        id_legajo=id_legajo, id_plan=id_plan
    ).first()

    if not resultado:

        return False

    estado = obtener_estado_resultado_plan_por_nombre("Finalizado")

    return resultado.id_estado_resultado_plan == estado.id_estado_resultado_plan


# -------------------VALIDACIONES-------------------#


# Valida la existencia de los datos necesarios
# para generar el resultado del plan.
def validar_resultado_plan(id_legajo, id_plan):

    # Verifica el legajo.
    legajo = obtener_legajo(id_legajo,headers=request.headers)

    if not legajo:

        raise BusinessError("El legajo no existe.", 404)

    # Verifica el plan.
    plan = obtener_plan(id_plan,headers=request.headers)

    if not plan:

        raise BusinessError("El plan no existe.", 404)

    return legajo, plan


# -------------------PREPARACIÓN DE DATOS-------------------#


# Prepara los datos del resultado del plan.
def preparar_datos_resultado_plan(
    id_legajo,
    id_plan,
    materias_totales,
    materias_aprobadas,
    materias_finalizadas,
    estado,
    id_usuario_autenticado
):

    ahora = datetime.now()

    return {
        "id_legajo": id_legajo,
        "id_plan": id_plan,
        "materias_totales": materias_totales,
        "materias_aprobadas": materias_aprobadas,
        "materias_finalizadas": materias_finalizadas,
        "id_estado_resultado_plan": estado.id_estado_resultado_plan,
        "fecha_actualizacion": ahora.date(),
        "id_usuario_creacion": id_usuario_autenticado,
        "id_usuario_modificacion": None,
        "ts_creacion": ahora,
        "ts_modificacion": None,
    }


# -------------------CRUD-------------------#


# Crea o actualiza automáticamente el resultado del plan.
def actualizar_resultado_plan(id_legajo, id_plan):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Actualizando resultado del plan {id_plan} " f"para el legajo {id_legajo}."
    )

    try:

        # Valida legajo, plan y usuario.
        validar_resultado_plan(id_legajo, id_plan)

        # Calcula estadísticas.
        materias_totales = calcular_materias_totales(id_plan)

        materias_aprobadas = calcular_materias_aprobadas(id_legajo, id_plan)

        materias_finalizadas = calcular_materias_finalizadas(id_legajo, id_plan)

        estado = determinar_estado_resultado_plan(
            materias_totales, materias_finalizadas, materias_aprobadas
        )

        resultado = obtener_resultado_plan(id_legajo, id_plan)

        # Si todavía no existe, lo crea.
        if not resultado:

            datos = preparar_datos_resultado_plan(
                id_legajo,
                id_plan,
                materias_totales,
                materias_aprobadas,
                materias_finalizadas,
                estado,
                id_usuario_autenticado
            )

            resultado = ResultadoPlan(**datos)

            db.session.add(resultado)

        # Si ya existe solamente actualiza sus datos.
        else:

            resultado.materias_totales = materias_totales
            resultado.materias_aprobadas = materias_aprobadas
            resultado.materias_finalizadas = materias_finalizadas
            resultado.id_estado_resultado_plan = estado.id_estado_resultado_plan
            resultado.fecha_actualizacion = datetime.now().date()

        db.session.commit()

        logger.info(
            f"Resultado del plan " f"{resultado.id_resultado_plan} actualizado."
        )

        return resultado

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al actualizar el resultado del plan.")

        raise BusinessError("No fue posible actualizar el resultado del plan.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception(
            "Ocurrió un error inesperado al actualizar el resultado del plan."
        )

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Modifica el estado de un resultado de plan.
def modificar_resultado_plan(id_resultado_plan, datos):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} "
        f"modificando el resultado del plan {id_resultado_plan}."
    )

    try:

        resultado = obtener_resultado_plan_por_id(id_resultado_plan)

        if not resultado:

            logger.warning(
                f"El resultado del plan " f"{id_resultado_plan} " "no existe."
            )

            return None

        hubo_cambios = False

        if "id_estado_resultado_plan" in datos:

            estado = obtener_estado_resultado_plan_por_id(
                datos["id_estado_resultado_plan"]
            )

            if not estado:

                raise BusinessError("El estado del resultado del plan no existe.", 404)

            if resultado.id_estado_resultado_plan != estado.id_estado_resultado_plan:

                resultado.id_estado_resultado_plan = estado.id_estado_resultado_plan
                ahora = datetime.now()
                resultado.fecha_actualizacion = ahora.date()
                resultado.id_usuario_modificacion = id_usuario_autenticado
                resultado.ts_modificacion = ahora

                hubo_cambios = True

                # Si el plan fue marcado como abandonado,
                # cancela todas las inscripciones del plan.
                if estado.nombre == "Abandonado":

                    estado_cancelada = obtener_estado_por_nombre("Cancelada")

                    inscripciones = obtener_inscripciones_plan(
                        resultado.id_legajo, resultado.id_plan
                    )

                    for inscripcion in inscripciones:

                        if inscripcion.id_estado != estado_cancelada.id_estado:

                            inscripcion.id_estado = estado_cancelada.id_estado

                            inscripcion.id_usuario_modificacion = id_usuario_autenticado

                            inscripcion.ts_modificacion = datetime.now()

        if not hubo_cambios:

            logger.info("No hubo modificaciones en el resultado del plan.")

            return resultado

        db.session.commit()

        logger.info(
            f"Resultado del plan " f"{id_resultado_plan} " "actualizado correctamente."
        )

        return resultado

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al actualizar el resultado del plan.")

        raise BusinessError("No fue posible actualizar el resultado del plan.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception(
            "Ocurrió un error inesperado al actualizar el resultado del plan."
        )

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Elimina un resultado del plan.
def eliminar_resultado_plan(id_resultado_plan):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} "
        f"eliminando el resultado del plan "
        f"{id_resultado_plan}."
    )

    resultado = obtener_resultado_plan_por_id(id_resultado_plan)

    if not resultado:

        logger.warning(f"El resultado del plan " f"{id_resultado_plan} " "no existe.")

        return False

    try:

        db.session.delete(resultado)

        db.session.commit()

        logger.info(
            f"Resultado del plan " f"{id_resultado_plan} " "eliminado correctamente."
        )

        return True

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al eliminar el resultado del plan.")

        raise BusinessError("No fue posible eliminar el resultado del plan.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception(
            "Ocurrió un error inesperado al eliminar el resultado del plan."
        )

        raise BusinessError("Ocurrió un error interno del servidor.", 500)
