from datetime import datetime
from sqlalchemy.exc import IntegrityError

from extensions import db
from exceptions import BusinessError
from utils.logger import logger
from flask import g
from models.modelo_resultado_academico import ResultadoAcademico
from models.modelo_asistencia import Asistencia
from models.modelo_calificacion import Calificacion
from models.modelo_clase import Clase, EstadoClase
from models.modelo_inscripcion import Inscripcion

from services.estado_academico_service import (
    obtener_estado_academico_por_nombre,
)
from services.comision_cliente import obtener_comision
from services.plan_asignatura_cliente import obtener_plan_asignatura
from services.inscripcion_service import obtener_inscripcion_por_id
from services.resultado_plan_service import actualizar_resultado_plan
from services.estado_inscripcion_service import obtener_estado_por_nombre


# -------------------CONSULTAS-------------------#


# Obtiene todos los resultados académicos.
def obtener_lista_resultados_academicos():

    logger.info("Consultando listado de resultados académicos.")

    return ResultadoAcademico.query.all()


# Obtiene un resultado académico por ID.
def obtener_resultado_academico_por_id(id_resultado):

    logger.info(f"Consultando resultado académico {id_resultado}.")

    return db.session.get(ResultadoAcademico, id_resultado)


# Verifica si una inscripción ya posee resultado académico.
def existe_resultado_academico(id_inscripcion):

    return (
        ResultadoAcademico.query.filter_by(id_inscripcion=id_inscripcion).first()
        is not None
    )


# -------------------OBTENCIÓN DE DATOS-------------------#


# Obtiene todas las inscripciones aceptadas
# pertenecientes a una comisión.
def obtener_inscripciones_aceptadas(id_comision):

    return Inscripcion.query.filter_by(
        id_comision=id_comision, id_estado=2  # Aceptada
    ).all()


# Obtiene las reglas académicas de la inscripción.
def obtener_reglas_academicas(inscripcion):

    comision = obtener_comision(inscripcion.id_comision)

    if not comision:
        raise BusinessError("La comisión no existe.", 404)

    # Obtiene el plan de asignatura.
    plan = obtener_plan_asignatura(comision["id_plan_asignatura"])

    if not plan:
        raise BusinessError("No fue posible obtener las reglas académicas.", 404)

    return plan


# Obtiene todas las clases dictadas de la comisión
def obtener_clases_dictadas(id_comision):

    return (
        Clase.query.filter_by(id_comision=id_comision, estado=EstadoClase.DICTADA)
        .order_by(Clase.numero_clase)
        .all()
    )


# Obtiene todas las asistencias registradas para una inscripción.
def obtener_asistencias(id_inscripcion):
    return Asistencia.query.filter_by(id_inscripcion=id_inscripcion).all()


# Obtiene todas las calificaciones correspondientes a una inscripción.
def obtener_calificaciones(id_inscripcion):
    return Calificacion.query.filter_by(id_inscripcion=id_inscripcion).all()

#Cambia el estado a finalizado de una inscripcion
def finalizar_inscripcion(inscripcion):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    estado = obtener_estado_por_nombre(
        "Finalizada"
    )

    if inscripcion.id_estado != estado.id_estado:

        inscripcion.id_estado = estado.id_estado
        inscripcion.id_usuario_modificacion = id_usuario_autenticado
        inscripcion.ts_modificacion = datetime.now()

# -------------------CÁLCULOS-------------------#


# Calcula el porcentaje de asistencia correspondiente a una inscripción.
def calcular_porcentaje_asistencia(inscripcion):

    # Obtiene las clases dictadas.
    clases_dictadas = obtener_clases_dictadas(inscripcion.id_comision)

    # Si todavía no existen clases dictadas el alumno continúa en curso.
    if not clases_dictadas:
        return 0

    # Obtiene las asistencias registradas.
    asistencias = obtener_asistencias(inscripcion.id_inscripcion)

    # Cuenta únicamente las asistencias marcadas como presentes.
    presentes = sum(
        1 for asistencia in asistencias if asistencia.estado.nombre == "Presente"
    )

    return round((presentes / len(clases_dictadas)) * 100, 2)


# Calcula el promedio final de una inscripción.
def calcular_promedio_final(id_inscripcion):

    # Obtiene todas las calificaciones.
    calificaciones = obtener_calificaciones(id_inscripcion)

    # Si todavía no existen calificaciones devuelve cero.
    if not calificaciones:
        return 0

    total = sum(calificacion.puntaje for calificacion in calificaciones)

    return round(total / len(calificaciones), 2)


# -------------------VALIDACIONES-------------------#


# Verifica que la comisión haya finalizado
# antes de generar el resultado académico.
def validar_comision_finalizada(id_comision):

    # Busca clases pendientes de dictado.
    clases_pendientes = Clase.query.filter(
        Clase.id_comision == id_comision,
        Clase.estado.in_([EstadoClase.PROGRAMADA, EstadoClase.REPROGRAMADA]),
    ).count()

    if clases_pendientes > 0:

        raise BusinessError("La comisión todavía no finalizó.", 400)


# Determina el estado académico de una inscripción finalizada.
def determinar_estado_academico(porcentaje_asistencia, promedio_final, reglas):

    if porcentaje_asistencia < reglas["presentismo_porcentaje"]:

        return obtener_estado_academico_por_nombre("Libre")

    if promedio_final >= reglas["promedio_aprobacion"]:

        return obtener_estado_academico_por_nombre("Aprobado")

    if promedio_final >= reglas["promedio_regularizacion"]:

        return obtener_estado_academico_por_nombre("Regular")

    return obtener_estado_academico_por_nombre("Desaprobado")


# Verifica que la inscripción continúe activa
# antes de generar el resultado académico.
def validar_inscripcion_activa(inscripcion):

    if inscripcion.id_estado != 2:  # Aceptada

        logger.warning(
            f"La inscripción "
            f"{inscripcion.id_inscripcion} "
            "no se encuentra en estado Aceptada."
        )

        raise BusinessError("La inscripción no se encuentra en estado Aceptada.", 400)


# -------------------PREPARACIÓN DE DATOS-------------------#


# Prepara los datos necesarios para crear un resultado académico.
def preparar_datos_resultado(
    id_inscripcion, porcentaje_asistencia, promedio_final, estado,id_usuario_autenticado
):

    ahora = datetime.now()

    return {
        "id_inscripcion": id_inscripcion,
        "porcentaje_asistencia": porcentaje_asistencia,
        "promedio_final": promedio_final,
        "id_estado_academico": estado.id_estado_academico,
        "fecha_resultado": ahora.date(),
        "id_usuario_creacion": id_usuario_autenticado,
        "ts_creacion": ahora,
    }


# -------------------CRUD-------------------#


# Genera los resultados académicos de todos los alumnos aceptados de una comisión finalizada.
def crear_resultado_academico(datos):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} "
        "inició la generación de resultados académicos."
    )

    try:

        # Verifica que la comisión haya finalizado.
        validar_comision_finalizada(datos["id_comision"])

        # Obtiene las inscripciones aceptadas.
        inscripciones = obtener_inscripciones_aceptadas(datos["id_comision"])

        if not inscripciones:

            raise BusinessError("La comisión no posee alumnos aceptados.", 400)

        resultados = []

        # Recorre todas las inscripciones.
        for inscripcion in inscripciones:
            # Verifica que la inscripción continúe activa.
            validar_inscripcion_activa(inscripcion)

            # Si el alumno ya posee resultado
            # simplemente continúa con el siguiente.
            if existe_resultado_academico(inscripcion.id_inscripcion):

                logger.info(
                    f"La inscripción "
                    f"{inscripcion.id_inscripcion} "
                    "ya posee resultado académico."
                )

                continue

            # Obtiene las reglas académicas.
            reglas = obtener_reglas_academicas(inscripcion)

            # Calcula porcentaje de asistencia.
            porcentaje_asistencia = calcular_porcentaje_asistencia(inscripcion)

            # Calcula promedio final.
            promedio_final = calcular_promedio_final(inscripcion.id_inscripcion)

            # Determina el estado académico.
            estado = determinar_estado_academico(
                porcentaje_asistencia, promedio_final, reglas
            )

            # Prepara los datos.
            datos_resultado = preparar_datos_resultado(
                inscripcion.id_inscripcion,
                porcentaje_asistencia,
                promedio_final,
                estado,
                id_usuario_autenticado
            )

            resultados.append(ResultadoAcademico(**datos_resultado))

        # Si todos ya tenían resultado,
        # evita hacer un commit innecesario.
        if not resultados:

            raise BusinessError("Todos los alumnos ya poseen resultado académico.", 400)

        db.session.add_all(resultados)

        db.session.commit()
        # Actualiza automáticamente el avance del plan.
        for resultado in resultados:

            inscripcion = obtener_inscripcion_por_id(resultado.id_inscripcion)

            finalizar_inscripcion(inscripcion)

            comision = obtener_comision(inscripcion.id_comision)

            plan_asignatura = obtener_plan_asignatura(comision["id_plan_asignatura"])

            actualizar_resultado_plan(inscripcion.id_legajo, plan_asignatura["id_plan"])

        logger.info(
            f"Se generaron {len(resultados)} resultados académicos correctamente."
        )

        return resultados

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al generar los resultados académicos.")

        raise BusinessError("No fue posible generar los resultados académicos.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception(
            "Ocurrió un error inesperado al generar los resultados académicos."
        )

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Elimina un resultado académico. Solo para desarrollo
def eliminar_resultado_academico(id_resultado_academico):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} "
        f"eliminando el resultado académico "
        f"{id_resultado_academico}."
    )

    resultado = obtener_resultado_academico_por_id(id_resultado_academico)

    if not resultado:

        logger.warning(
            f"El resultado académico " f"{id_resultado_academico} " "no existe."
        )

        return False

    try:

        db.session.delete(resultado)

        db.session.commit()

        logger.info(
            f"Resultado académico "
            f"{id_resultado_academico} "
            "eliminado correctamente."
        )

        return True

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al eliminar el resultado académico.")

        raise BusinessError("No fue posible eliminar el resultado académico.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception(
            "Ocurrió un error inesperado al eliminar el resultado académico."
        )

        raise BusinessError("Ocurrió un error interno del servidor.", 500)
