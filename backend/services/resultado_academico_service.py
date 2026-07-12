from datetime import datetime
from sqlalchemy.exc import IntegrityError

from extensions import db
from exceptions import BusinessError
from utils.logger import logger

from models.modelo_resultado_academico import ResultadoAcademico
from models.modelo_asistencia import Asistencia
from models.modelo_calificacion import Calificacion
from models.modelo_clase import Clase, EstadoClase

from services.inscripcion_service import obtener_inscripcion_por_id
from services.estado_academico_service import (
    obtener_estado_academico_por_nombre,
    obtener_estado_academico_por_id,
)
from services.usuario_cliente import obtener_usuario
from services.comision_cliente import obtener_comision
from services.plan_asignatura_cliente import obtener_plan_asignatura

ID_USUARIO_SIMULADO = 100

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

# Obtiene las reglas académicas de la inscripción.
def obtener_reglas_academicas(id_inscripcion):

    # Obtiene la inscripción.
    inscripcion = obtener_inscripcion_por_id(id_inscripcion)

    if not inscripcion:
        raise BusinessError("La inscripción no existe.", 404)

    # Obtiene la comisión.
    comision = obtener_comision(inscripcion.id_comision)

    if not comision:
        raise BusinessError("La comisión no existe.", 404)

    # Obtiene el plan de asignatura.
    plan = obtener_plan_asignatura(comision["id_plan_asignatura"])

    if not plan:
        raise BusinessError("No fue posible obtener las reglas académicas.", 404)

    return plan


# Obtiene todas las clases dictadas correspondientes a la comisión de una inscripción.
def obtener_clases_dictadas(id_inscripcion):
    # Obtiene la inscripción.
    inscripcion = obtener_inscripcion_por_id(id_inscripcion)

    if not inscripcion:
        raise BusinessError("La inscripción no existe.", 404)

    return (
        Clase.query.filter_by(
            id_comision=inscripcion.id_comision, estado=EstadoClase.DICTADA
        )
        .order_by(Clase.numero_clase)
        .all()
    )


# Obtiene todas las asistencias registradas para una inscripción.
def obtener_asistencias(id_inscripcion):
    return Asistencia.query.filter_by(id_inscripcion=id_inscripcion).all()


# Obtiene todas las calificaciones correspondientes a una inscripción.
def obtener_calificaciones(id_inscripcion):
    return Calificacion.query.filter_by(id_inscripcion=id_inscripcion).all()


# -------------------CÁLCULOS-------------------#

# Calcula el porcentaje de asistencia de una inscripción.
def calcular_porcentaje_asistencia(id_inscripcion):

    # Obtiene las clases dictadas.
    clases_dictadas = obtener_clases_dictadas(id_inscripcion)

    # Si todavía no existen clases dictadas el alumno continúa en curso.
    if not clases_dictadas:
        return 0

    # Obtiene las asistencias registradas.
    asistencias = obtener_asistencias(id_inscripcion)

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
def validar_comision_finalizada(id_inscripcion):

    # Obtiene la inscripción.
    inscripcion = obtener_inscripcion_por_id(id_inscripcion)

    if not inscripcion:

        raise BusinessError("La inscripción no existe.", 404)

    # Busca clases pendientes de dictado.
    clases_pendientes = Clase.query.filter(
        Clase.id_comision == inscripcion.id_comision,
        Clase.estado.in_([EstadoClase.PROGRAMADA, EstadoClase.REPROGRAMADA]),
    ).count()

    if clases_pendientes > 0:

        logger.warning(f"La comisión {inscripcion.id_comision} " "todavía no finalizó.")

        raise BusinessError("La comisión todavía se encuentra en curso.", 400)


# Valida si el estado académico puede modificarse manualmente.
def validar_estado_modificacion(estado):

    if estado.nombre != "Abandonó":

        logger.warning(f"No está permitido modificar el estado a '{estado.nombre}'.")

        raise BusinessError("Solo es posible modificar el estado a 'Abandonó'.", 400)


# Determina el estado académico de una inscripción finalizada.
def determinar_estado_academico(porcentaje_asistencia, promedio_final, reglas):

    # No alcanzó el porcentaje mínimo de asistencia.
    if porcentaje_asistencia < reglas["presentismo_porcentaje"]:
        return obtener_estado_academico_por_nombre("Libre")

    # Alcanzó el promedio de aprobación.
    if promedio_final >= reglas["promedio_aprobacion"]:
        return obtener_estado_academico_por_nombre("Aprobado")

    # Alcanzó el promedio de regularización.
    if promedio_final >= reglas["promedio_regularizacion"]:
        return obtener_estado_academico_por_nombre("Regular")

    # Caso contrario queda desaprobado.
    return obtener_estado_academico_por_nombre("Desaprobado")


# -------------------PREPARACIÓN DE DATOS-------------------#

# Prepara los datos necesarios para crear un resultado académico.
def preparar_datos_resultado(datos, porcentaje_asistencia, promedio_final, estado):

    ahora = datetime.now()
    print(estado)

    return {
        "id_inscripcion": datos["id_inscripcion"],
        "porcentaje_asistencia": porcentaje_asistencia,
        "promedio_final": promedio_final,
        "id_estado_academico": estado.id_estado_academico,
        "fecha_resultado": ahora.date(),
        "observacion": datos.get("observacion"),
        "id_usuario_creacion": ID_USUARIO_SIMULADO,
        "id_usuario_modificacion": None,
        "ts_creacion": ahora,
        "ts_modificacion": None,
    }


# -------------------CRUD-------------------#

# Registra un resultado académico.
def crear_resultado_academico(datos):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
        "inició el registro de un resultado académico."
    )

    try:

        # Verifica que exista la inscripción.
        inscripcion = obtener_inscripcion_por_id(datos["id_inscripcion"])

        if not inscripcion:

            logger.warning(
                f"La inscripción " f"{datos['id_inscripcion']} " "no existe."
            )

            raise BusinessError("La inscripción no existe.", 404)

        # Verifica que exista el usuario.
        if not obtener_usuario(ID_USUARIO_SIMULADO):

            logger.warning("El usuario no existe.")

            raise BusinessError("El usuario no existe.", 404)

        # Verifica que la inscripción no posea
        # un resultado académico previo.
        if existe_resultado_academico(datos["id_inscripcion"]):

            logger.warning(
                f"La inscripción "
                f"{datos['id_inscripcion']} "
                "ya posee un resultado académico."
            )

            raise BusinessError("La inscripción ya posee un resultado académico.", 400)

        # Verifica que la comisión haya finalizado.
        validar_comision_finalizada(datos["id_inscripcion"])

        # Obtiene las reglas académicas.
        reglas = obtener_reglas_academicas(datos["id_inscripcion"])

        # Calcula el porcentaje de asistencia.
        porcentaje_asistencia = calcular_porcentaje_asistencia(datos["id_inscripcion"])

        # Calcula el promedio final.
        promedio_final = calcular_promedio_final(datos["id_inscripcion"])

        # Determina el estado académico.
        estado = determinar_estado_academico(
            porcentaje_asistencia, promedio_final, reglas
        )
        print(estado)

        # Prepara los datos del resultado.
        datos_resultado = preparar_datos_resultado(
            datos, porcentaje_asistencia, promedio_final, estado
        )

        nuevo_resultado = ResultadoAcademico(**datos_resultado)

        db.session.add(nuevo_resultado)

        db.session.commit()

        logger.info(
            f"Resultado académico "
            f"{nuevo_resultado.id_resultado_academico} "
            "registrado correctamente."
        )

        return nuevo_resultado

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al registrar el resultado académico.")

        raise BusinessError("No fue posible registrar el resultado académico.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception(
            "Ocurrió un error inesperado al registrar el resultado académico."
        )

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Modifica un resultado académico existente.
def modificar_resultado_academico(id_resultado_academico, datos):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
        f"modificando el resultado académico {id_resultado_academico}."
    )

    try:
        # Busca el resultado académico.
        resultado = obtener_resultado_academico_por_id(id_resultado_academico)

        if not resultado:

            logger.warning(
                f"El resultado académico " f"{id_resultado_academico} " "no existe."
            )

            return None

        # Verifica que exista el usuario.
        if not obtener_usuario(ID_USUARIO_SIMULADO):

            logger.warning("El usuario no existe.")

            raise BusinessError("El usuario no existe.", 404)

        # Indica si realmente hubo modificaciones.
        hubo_cambios = False

        # Estado académico
        if "id_estado_academico" in datos:

            estado = obtener_estado_academico_por_id(datos["id_estado_academico"])

            if not estado:

                logger.warning("El estado académico no existe.")

                raise BusinessError("El estado académico no existe.", 404)

            validar_estado_modificacion(estado)

            if resultado.id_estado_academico != estado.id_estado_academico:

                resultado.id_estado_academico = estado.id_estado_academico

                hubo_cambios = True

        # Observación
        if "observacion" in datos:

            if resultado.observacion != datos["observacion"]:

                resultado.observacion = datos["observacion"]

                hubo_cambios = True

        # Si no hubo modificaciones evita hacer UPDATE.
        if not hubo_cambios:

            logger.info(
                f"El resultado académico "
                f"{id_resultado_academico} "
                "no presentó modificaciones."
            )

            return resultado

        # Datos de auditoría.
        resultado.id_usuario_modificacion = ID_USUARIO_SIMULADO
        resultado.ts_modificacion = datetime.now()

        db.session.commit()

        logger.info(
            f"Resultado académico "
            f"{id_resultado_academico} "
            "actualizado correctamente."
        )

        return resultado

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al actualizar el resultado académico.")

        raise BusinessError("No fue posible actualizar el resultado académico.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception(
            "Ocurrió un error inesperado al actualizar el resultado académico."
        )

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Elimina un resultado académico. Solo para desarrollo
def eliminar_resultado_academico(id_resultado_academico):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
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
