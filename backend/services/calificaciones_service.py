from datetime import datetime
from sqlalchemy.exc import IntegrityError
from flask import g
from extensions import db
from exceptions import BusinessError
from utils.logger import logger

from models.modelo_calificacion import Calificacion
from services.estado_inscripcion_service import obtener_estado_por_nombre
from services.evaluacion_service import obtener_evaluacion_por_id
from services.inscripcion_service import obtener_inscripcion_por_id


# -------------------CONSULTAS-------------------#

# Obtiene el listado de calificaciones.
# Permite filtrar por evaluación o inscripción.
def obtener_lista_de_calificaciones(id_evaluacion=None, id_inscripcion=None):

    logger.info("Consultando listado de calificaciones.")

    query = Calificacion.query

    if id_evaluacion is not None:
        query = query.filter_by(id_evaluacion=id_evaluacion)

    if id_inscripcion is not None:
        query = query.filter_by(id_inscripcion=id_inscripcion)

    return query.all()


# Obtiene una calificación por su identificador.
def obtener_calificacion_por_id(id_calificacion):

    logger.info(f"Consultando calificación {id_calificacion}.")

    return db.session.get(Calificacion, id_calificacion)


# Verifica si una inscripción ya posee una
# calificación para una determinada evaluación.
def existe_calificacion(id_evaluacion, id_inscripcion):

    return (
        Calificacion.query.filter_by(
            id_evaluacion=id_evaluacion, id_inscripcion=id_inscripcion
        ).first()
        is not None
    )

# -------------------VALIDACIONES-------------------#

# Valida que una calificación pueda registrarse.
def validar_item_calificacion(item, evaluacion):

    # Verifica que exista la inscripción.
    inscripcion = obtener_inscripcion_por_id(item["id_inscripcion"])

    if not inscripcion:

        logger.warning(f"La inscripción " f"{item['id_inscripcion']} no existe.")

        raise BusinessError(f"La inscripción {item['id_inscripcion']} no existe.", 404)
    
    # Verifica que la inscripción se encuentre aceptada.
    estado_aceptada = obtener_estado_por_nombre("Aceptada")

    if inscripcion.id_estado != estado_aceptada.id_estado:

        logger.warning(
            f"No es posible registrar calificación para la inscripción "
            f"{inscripcion.id_inscripcion} porque no se encuentra aceptada."
        )

        raise BusinessError(
            "Solo es posible registrar calificaciones de inscripciones aceptadas.",
            400,
        )
    
    # Verifica que la inscripción pertenezca
    # a la comisión de la evaluación.
    if inscripcion.id_comision_asignatura != evaluacion.id_comision_asignatura:

        logger.warning(
            f"La inscripción "
            f"{inscripcion.id_inscripcion} "
            f"no pertenece a la comisión asignatura "
            f"{evaluacion.id_comision_asignatura}."
        )

        raise BusinessError(
            "La inscripción no pertenece a la comisión asignatura de la evaluación.", 400
        )

    # Verifica que no exista una calificación previa.
    if existe_calificacion(evaluacion.id_evaluacion, item["id_inscripcion"]):

        logger.warning(
            f"La inscripción "
            f"{item['id_inscripcion']} "
            "ya posee una calificación registrada."
        )

        raise BusinessError("La calificación ya fue registrada.", 400)

    # El puntaje no puede ser negativo.
    if item["puntaje"] < 0:

        logger.warning("El puntaje no puede ser negativo.")

        raise BusinessError("El puntaje no puede ser negativo.", 400)

    # El puntaje no puede superar
    # el máximo de la evaluación.
    if item["puntaje"] > evaluacion.puntaje_maximo:

        logger.warning("El puntaje supera el máximo permitido.")

        raise BusinessError("El puntaje supera el máximo permitido.", 400)


# -------------------PREPARACIÓN DE DATOS-------------------#

# Prepara los datos necesarios para crear
# una calificación.
def preparar_datos_calificacion(item, id_evaluacion, fecha, id_usuario_autenticado):

    return {
        "id_evaluacion": id_evaluacion,
        "id_inscripcion": item["id_inscripcion"],
        "puntaje": item["puntaje"],
        "observacion": item.get("observacion"),
        "id_usuario_creacion": id_usuario_autenticado,
        "id_usuario_modificacion": None,
        "ts_creacion": fecha,
        "ts_modificacion": None,
    }


# -------------------CRUD-------------------#

# Registra las calificaciones de una evaluación.
def crear_calificaciones(datos):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} " "inició el registro de calificaciones."
    )

    if not datos["calificaciones"]:
        raise BusinessError(
            "Debe enviar al menos una calificación.",
            400
        )
    
    lista_calificaciones = []

    try:

        # Verifica que exista la evaluación.
        evaluacion = obtener_evaluacion_por_id(datos["id_evaluacion"])

        if not evaluacion:

            logger.warning(f"La evaluación " f"{datos['id_evaluacion']} no existe.")

            raise BusinessError("La evaluación no existe.", 404)
        

        ahora = datetime.now()

        inscripciones_procesadas = set()

        # Recorre todas las calificaciones.
        for item in datos["calificaciones"]:
            if item["id_inscripcion"] in inscripciones_procesadas:
                logger.warning(
                    f"La inscripción {item['id_inscripcion']} está repetida en la solicitud."
                )
                raise BusinessError(
                    "La solicitud contiene calificaciones duplicadas para la misma inscripción.",
                    400,
                )

            inscripciones_procesadas.add(item["id_inscripcion"])

            validar_item_calificacion(item, evaluacion)

            nueva = preparar_datos_calificacion(item, datos["id_evaluacion"], ahora,id_usuario_autenticado)

            lista_calificaciones.append(Calificacion(**nueva))

        db.session.add_all(lista_calificaciones)

        db.session.commit()

        logger.info(
            f"Se registraron "
            f"{len(lista_calificaciones)} "
            "calificaciones correctamente."
        )

        return lista_calificaciones

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al registrar las calificaciones.")

        raise BusinessError("No fue posible registrar las calificaciones.", 500)

    except BusinessError:

        db.session.rollback()
        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al registrar las calificaciones.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Modifica una calificación existente.
def modificar_calificacion(id_calificacion, datos):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} "
        f"modificando la calificación {id_calificacion}."
    )

    # Busca la calificación.
    calificacion = obtener_calificacion_por_id(id_calificacion)

    if not calificacion:

        logger.warning(f"La calificación {id_calificacion} no existe.")

        return None

    # Obtiene la evaluación asociada.
    evaluacion = obtener_evaluacion_por_id(calificacion.id_evaluacion)

    if not evaluacion:

        logger.warning(f"La evaluación {calificacion.id_evaluacion} no existe.")

        raise BusinessError("La evaluación no existe.", 404)

    # Indica si realmente hubo cambios.
    hubo_cambios = False

    # Puntaje
    if "puntaje" in datos:

        if datos["puntaje"] < 0:

            raise BusinessError("El puntaje no puede ser negativo.", 400)

        if datos["puntaje"] > evaluacion.puntaje_maximo:

            raise BusinessError("El puntaje supera el máximo permitido.", 400)

        if calificacion.puntaje != datos["puntaje"]:

            calificacion.puntaje = datos["puntaje"]
            hubo_cambios = True

    # Observación
    if "observacion" in datos:

        if calificacion.observacion != datos["observacion"]:

            calificacion.observacion = datos["observacion"]
            hubo_cambios = True

    # Si no hubo modificaciones, evita hacer UPDATE.
    if not hubo_cambios:

        logger.info(f"La calificación {id_calificacion} " "no presentó modificaciones.")

        return calificacion

    # Datos de auditoría.
    calificacion.id_usuario_modificacion = id_usuario_autenticado
    calificacion.ts_modificacion = datetime.now()

    try:

        db.session.commit()

        logger.info(f"Calificación {id_calificacion} " "actualizada correctamente.")

        return calificacion

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al actualizar la calificación.")

        raise BusinessError("No fue posible actualizar la calificación.", 500)

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al actualizar la calificación.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Elimina una calificación.
def eliminar_calificacion(id_calificacion):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} "
        f"eliminando la calificación {id_calificacion}."
    )

    calificacion = obtener_calificacion_por_id(id_calificacion)

    if not calificacion:

        logger.warning(f"La calificación {id_calificacion} no existe.")

        return False

    try:

        db.session.delete(calificacion)

        db.session.commit()

        logger.info(f"Calificación {id_calificacion} eliminada correctamente.")

        return True

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al eliminar la calificación.")

        raise BusinessError("No fue posible eliminar la calificación.", 500)

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al eliminar la calificación.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)
