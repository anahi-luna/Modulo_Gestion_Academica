from datetime import datetime
from sqlalchemy.exc import IntegrityError

from extensions import db
from exceptions import BusinessError
from utils.logger import logger

from models.modelo_calificacion import Calificacion

from services.evaluacion_service import (
    obtener_evaluacion_por_id
)

from services.inscripcion_service import (
    obtener_inscripcion_por_id
)

from services.usuario_cliente import (
    obtener_usuario
)

ID_USUARIO_SIMULADO = 100

# Obtiene el listado de calificaciones.
# Permite filtrar por evaluación o inscripción.
def obtener_lista_de_calificaciones(
    id_evaluacion=None,
    id_inscripcion=None
):

    logger.info(
        "Consultando listado de calificaciones."
    )

    query = Calificacion.query

    if id_evaluacion is not None:
        query = query.filter_by(
            id_evaluacion=id_evaluacion
        )

    if id_inscripcion is not None:
        query = query.filter_by(
            id_inscripcion=id_inscripcion
        )

    return query.all()

# Obtiene una calificación por su identificador.
def obtener_calificacion_por_id(id_calificacion):

    logger.info(
        f"Consultando calificación {id_calificacion}."
    )

    return db.session.get(
        Calificacion,
        id_calificacion
    )

# Verifica si una inscripción ya posee una
# calificación para una determinada evaluación.
def existe_calificacion(
    id_evaluacion,
    id_inscripcion
):

    return (
        Calificacion.query.filter_by(
            id_evaluacion=id_evaluacion,
            id_inscripcion=id_inscripcion
        ).first()
        is not None
    )

# ==========================================================
# Valida que una calificación pueda registrarse.
# ==========================================================
def validar_item_calificacion(item, evaluacion):

    # Verifica que exista la inscripción.
    inscripcion = obtener_inscripcion_por_id(
        item["id_inscripcion"]
    )

    if not inscripcion:

        logger.warning(
            f"La inscripción "
            f"{item['id_inscripcion']} no existe."
        )

        raise BusinessError(
            f"La inscripción {item['id_inscripcion']} no existe.",
            404
        )

    # Verifica que la inscripción pertenezca
    # a la comisión de la evaluación.
    if inscripcion.id_comision != evaluacion.id_comision:

        logger.warning(
            f"La inscripción "
            f"{inscripcion.id_inscripcion} "
            f"no pertenece a la comisión "
            f"{evaluacion.id_comision}."
        )

        raise BusinessError(
            "La inscripción no pertenece a la comisión de la evaluación.",
            400
        )

    # Verifica que no exista una calificación previa.
    if existe_calificacion(
        evaluacion.id_evaluacion,
        item["id_inscripcion"]
    ):

        logger.warning(
            f"La inscripción "
            f"{item['id_inscripcion']} "
            "ya posee una calificación registrada."
        )

        raise BusinessError(
            "La calificación ya fue registrada.",
            400
        )

    # El puntaje no puede ser negativo.
    if item["puntaje"] < 0:

        logger.warning(
            "El puntaje no puede ser negativo."
        )

        raise BusinessError(
            "El puntaje no puede ser negativo.",
            400
        )

    # El puntaje no puede superar
    # el máximo de la evaluación.
    if item["puntaje"] > evaluacion.puntaje_maximo:

        logger.warning(
            "El puntaje supera el máximo permitido."
        )

        raise BusinessError(
            "El puntaje supera el máximo permitido.",
            400
        )

# ==========================================================
# Prepara los datos necesarios para crear
# una calificación.
# ==========================================================
def preparar_datos_calificacion(item,id_evaluacion,fecha):

    return {
        "id_evaluacion": id_evaluacion,
        "id_inscripcion": item["id_inscripcion"],
        "puntaje": item["puntaje"],
        "observacion": item.get("observacion"),
        "id_usuario_creacion": ID_USUARIO_SIMULADO,
        "id_usuario_modificacion": None,
        "ts_creacion": fecha,
        "ts_modificacion": None
    }

# ==========================================================
# Registra las calificaciones de una evaluación.
# ==========================================================
def crear_calificaciones(datos):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
        "inició el registro de calificaciones."
    )

    lista_calificaciones = []

    try:

        # Verifica que exista la evaluación.
        evaluacion = obtener_evaluacion_por_id(
            datos["id_evaluacion"]
        )

        if not evaluacion:

            logger.warning(
                f"La evaluación "
                f"{datos['id_evaluacion']} no existe."
            )

            raise BusinessError(
                "La evaluación no existe.",
                404
            )

        # Verifica que exista el usuario.
        if not obtener_usuario(
            ID_USUARIO_SIMULADO
        ):

            logger.warning(
                "El usuario no existe."
            )

            raise BusinessError(
                "El usuario no existe.",
                404
            )

        ahora = datetime.now()

        # Recorre todas las calificaciones.
        for item in datos["calificaciones"]:

            validar_item_calificacion(
                item,
                evaluacion
            )

            nueva = preparar_datos_calificacion(
                item,
                datos["id_evaluacion"],
                ahora
            )

            lista_calificaciones.append(
                Calificacion(**nueva)
            )

        db.session.add_all(
            lista_calificaciones
        )

        db.session.commit()

        logger.info(
            f"Se registraron "
            f"{len(lista_calificaciones)} "
            "calificaciones correctamente."
        )

        return lista_calificaciones

    except IntegrityError:

        db.session.rollback()

        logger.exception(
            "Error de integridad al registrar las calificaciones."
        )

        raise BusinessError(
            "No fue posible registrar las calificaciones.",
            500
        )

    except BusinessError:

        db.session.rollback()
        raise

    except Exception:

        db.session.rollback()

        logger.exception(
            "Ocurrió un error inesperado al registrar las calificaciones."
        )

        raise BusinessError(
            "Ocurrió un error interno del servidor.",
            500
        )
    
# ==========================================================
# Modifica una calificación existente.
# ==========================================================
def modificar_calificacion(id_calificacion, datos):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
        f"modificando la calificación {id_calificacion}."
    )

    # Busca la calificación.
    calificacion = obtener_calificacion_por_id(
        id_calificacion
    )

    if not calificacion:

        logger.warning(
            f"La calificación {id_calificacion} no existe."
        )

        return None

    # Verifica que exista el usuario.
    if not obtener_usuario(ID_USUARIO_SIMULADO):

        logger.warning(
            "El usuario no existe."
        )

        raise BusinessError(
            "El usuario no existe.",
            404
        )

    # Obtiene la evaluación asociada.
    evaluacion = obtener_evaluacion_por_id(
        calificacion.id_evaluacion
    )

    if not evaluacion:

        logger.warning(
            f"La evaluación {calificacion.id_evaluacion} no existe."
        )

        raise BusinessError(
            "La evaluación no existe.",
            404
        )

    # Indica si realmente hubo cambios.
    hubo_cambios = False

    # ==========================================
    # Puntaje
    # ==========================================
    if "puntaje" in datos:

        if datos["puntaje"] < 0:

            raise BusinessError(
                "El puntaje no puede ser negativo.",
                400
            )

        if datos["puntaje"] > evaluacion.puntaje_maximo:

            raise BusinessError(
                "El puntaje supera el máximo permitido.",
                400
            )

        if calificacion.puntaje != datos["puntaje"]:

            calificacion.puntaje = datos["puntaje"]
            hubo_cambios = True

    # ==========================================
    # Observación
    # ==========================================
    if "observacion" in datos:

        if calificacion.observacion != datos["observacion"]:

            calificacion.observacion = datos["observacion"]
            hubo_cambios = True

    # Si no hubo modificaciones, evita hacer UPDATE.
    if not hubo_cambios:

        logger.info(
            f"La calificación {id_calificacion} "
            "no presentó modificaciones."
        )

        return calificacion

    # Datos de auditoría.
    calificacion.id_usuario_modificacion = ID_USUARIO_SIMULADO
    calificacion.ts_modificacion = datetime.now()

    try:

        db.session.commit()

        logger.info(
            f"Calificación {id_calificacion} "
            "actualizada correctamente."
        )

        return calificacion

    except IntegrityError:

        db.session.rollback()

        logger.exception(
            "Error de integridad al actualizar la calificación."
        )

        raise BusinessError(
            "No fue posible actualizar la calificación.",
            500
        )

    except Exception:

        db.session.rollback()

        logger.exception(
            "Ocurrió un error inesperado al actualizar la calificación."
        )

        raise BusinessError(
            "Ocurrió un error interno del servidor.",
            500
        )
    
# ==========================================================
# Elimina una calificación.
# ==========================================================
def eliminar_calificacion(id_calificacion):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
        f"eliminando la calificación {id_calificacion}."
    )

    calificacion = obtener_calificacion_por_id(
        id_calificacion
    )

    if not calificacion:

        logger.warning(
            f"La calificación {id_calificacion} no existe."
        )

        return False

    try:

        db.session.delete(
            calificacion
        )

        db.session.commit()

        logger.info(
            f"Calificación {id_calificacion} eliminada correctamente."
        )

        return True

    except IntegrityError:

        db.session.rollback()

        logger.exception(
            "Error de integridad al eliminar la calificación."
        )

        raise BusinessError(
            "No fue posible eliminar la calificación.",
            500
        )

    except Exception:

        db.session.rollback()

        logger.exception(
            "Ocurrió un error inesperado al eliminar la calificación."
        )

        raise BusinessError(
            "Ocurrió un error interno del servidor.",
            500
        )