from datetime import datetime

from sqlalchemy.exc import IntegrityError

from extensions import db
from exceptions import BusinessError
from utils.logger import logger

from models.modelo_evaluacion import Evaluacion

from services.comision_cliente import obtener_comision
from services.usuario_cliente import obtener_usuario
from services.tipo_evaluacion_service import (
    obtener_tipo_evaluacion_por_id
)

ID_USUARIO_SIMULADO = 100

# Obtiene el listado de evaluaciones.
# Permite filtrar por comisión o tipo de evaluación.
def obtener_lista_de_evaluaciones(id_comision=None,id_tipo_evaluacion=None):

    logger.info("Consultando listado de evaluaciones.")

    query = Evaluacion.query

    if id_comision is not None:
        query = query.filter_by(
            id_comision=id_comision
        )

    if id_tipo_evaluacion is not None:
        query = query.filter_by(
            id_tipo_evaluacion=id_tipo_evaluacion
        )

    return query.all()

# Obtiene una evaluación por su identificador.
def obtener_evaluacion_por_id(id_evaluacion):

    logger.info(
        f"Consultando evaluación {id_evaluacion}."
    )

    return db.session.get(
        Evaluacion,
        id_evaluacion
    )

# Prepara los datos necesarios para crear una evaluación.
def preparar_datos_evaluacion(datos):
    ahora = datetime.now()
    return {

        "id_comision": datos["id_comision"],
        "id_tipo_evaluacion": datos["id_tipo_evaluacion"],
        "titulo": datos["titulo"],
        "fecha_evaluacion": datos["fecha_evaluacion"],
        "puntaje_maximo": datos["puntaje_maximo"],
        "id_evaluacion_origen": datos.get("id_evaluacion_origen"),
        "id_usuario_creacion": ID_USUARIO_SIMULADO,
        "id_usuario_modificacion": None,
        "ts_creacion": ahora,
        "ts_modificacion": None
    }

# Verifica que los datos de una evaluación sean válidos.
def validar_evaluacion(datos):

    # Verifica que exista la comisión.
    comision = obtener_comision(datos["id_comision"])

    if not comision:
        logger.warning( f"La comisión {datos['id_comision']} no existe.")
        raise BusinessError("La comisión no existe.", 404)

    # Verifica que exista el tipo de evaluación.
    tipo = obtener_tipo_evaluacion_por_id(datos["id_tipo_evaluacion"])

    if not tipo:
        logger.warning(
            f"El tipo de evaluación "
            f"{datos['id_tipo_evaluacion']} no existe."
        )
        raise BusinessError("El tipo de evaluación no existe.",404)

    # El puntaje debe ser mayor que cero.
    if datos["puntaje_maximo"] <= 0:

        logger.warning("El puntaje máximo debe ser mayor que cero.")

        raise BusinessError("El puntaje máximo debe ser mayor que cero.", 400)

    # Si posee una evaluación origen,
    # verifica que exista.
    if datos.get("id_evaluacion_origen") is not None:

        evaluacion = obtener_evaluacion_por_id(datos["id_evaluacion_origen"])

        if not evaluacion:
            logger.warning("La evaluación origen no existe.")
            raise BusinessError("La evaluación origen no existe.",404)


# Crea una nueva evaluación.
def crear_evaluacion(datos):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
        "inició el registro de una evaluación."
    )

    try:
        # Valida que exista el usuario.
        usuario = obtener_usuario(ID_USUARIO_SIMULADO)

        if not usuario:
            logger.warning("El usuario no existe.")
            raise BusinessError("El usuario no existe.",404)

        # Valida la información recibida.
        validar_evaluacion(datos)

        # Prepara los datos.
        datos_evaluacion = preparar_datos_evaluacion(datos)

        nueva_evaluacion = Evaluacion(**datos_evaluacion)

        db.session.add(nueva_evaluacion)

        db.session.commit()

        logger.info(
            f"Evaluación {nueva_evaluacion.id_evaluacion} "
            "registrada correctamente."
        )

        return nueva_evaluacion

    except IntegrityError:
        db.session.rollback()
        
        logger.exception("Error de integridad al registrar la evaluación.")
        raise BusinessError("No fue posible registrar la evaluación.",500)

    except BusinessError:
        db.session.rollback()
        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al registrar la evaluación.")

        raise BusinessError("Ocurrió un error interno del servidor.",500)
    
# Modifica una evaluación existente.
def modificar_evaluacion(id_evaluacion, datos):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
        f"modificando la evaluación {id_evaluacion}."
    )

    # Busca la evaluación.
    evaluacion = obtener_evaluacion_por_id(id_evaluacion)

    if not evaluacion:
        logger.warning(f"La evaluación {id_evaluacion} no existe.")
        return None

    # Verifica que exista el usuario.
    if not obtener_usuario(ID_USUARIO_SIMULADO):
        logger.warning("El usuario no existe.")
        raise BusinessError("El usuario no existe.",404)

    # Indica si realmente hubo modificaciones.
    hubo_cambios = False

    # Comisión
    if "id_comision" in datos:

        if not obtener_comision(datos["id_comision"]):
            logger.warning(f"La comisión {datos['id_comision']} no existe.")
            raise BusinessError("La comisión no existe.",404)

        if evaluacion.id_comision != datos["id_comision"]:
            evaluacion.id_comision = datos["id_comision"]
            hubo_cambios = True

    # Tipo de evaluación
    if "id_tipo_evaluacion" in datos:

        if not obtener_tipo_evaluacion_por_id(datos["id_tipo_evaluacion"]):

            logger.warning("Tipo de evaluación inexistente.")

            raise BusinessError("El tipo de evaluación no existe.",404)

        if (evaluacion.id_tipo_evaluacion != datos["id_tipo_evaluacion"]):

            evaluacion.id_tipo_evaluacion = datos["id_tipo_evaluacion"]
            hubo_cambios = True

    # Título
    if "titulo" in datos:

        if evaluacion.titulo != datos["titulo"]:

            evaluacion.titulo = datos["titulo"]
            hubo_cambios = True

    # Fecha
    if "fecha_evaluacion" in datos:

        if (evaluacion.fecha_evaluacion!= datos["fecha_evaluacion"]):

            evaluacion.fecha_evaluacion = datos["fecha_evaluacion"]
            hubo_cambios = True

    # Puntaje máximo
    if "puntaje_maximo" in datos:

        if datos["puntaje_maximo"] <= 0:

            raise BusinessError("El puntaje máximo debe ser mayor que cero.",400)

        if (evaluacion.puntaje_maximo != datos["puntaje_maximo"]):

            evaluacion.puntaje_maximo = datos["puntaje_maximo"]
            hubo_cambios = True

    # Evaluación origen
    if "id_evaluacion_origen" in datos:

        origen = datos["id_evaluacion_origen"]

        if origen is not None:

            if origen == id_evaluacion:

                raise BusinessError("Una evaluación no puede ser origen de sí misma.",400)

            if not obtener_evaluacion_por_id(origen):

                raise BusinessError("La evaluación origen no existe.",404)

        if evaluacion.id_evaluacion_origen != origen:

            evaluacion.id_evaluacion_origen = origen
            hubo_cambios = True

    # Si no hubo cambios no hace UPDATE.
    if not hubo_cambios:

        logger.info(
            f"La evaluación {id_evaluacion} "
            "no presentó modificaciones."
        )

        return evaluacion

    # Auditoría.
    evaluacion.id_usuario_modificacion = ID_USUARIO_SIMULADO
    evaluacion.ts_modificacion = datetime.now()

    try:

        db.session.commit()

        logger.info(f"Evaluación {id_evaluacion} actualizada correctamente.")

        return evaluacion

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error al actualizar la evaluación.")

        raise BusinessError("No fue posible actualizar la evaluación.",500)

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al actualizar la evaluación.")

        raise BusinessError("Ocurrió un error interno del servidor.",500)
    
# Elimina una evaluación.
def eliminar_evaluacion(id_evaluacion):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
        f"eliminando la evaluación {id_evaluacion}."
    )

    evaluacion = obtener_evaluacion_por_id(id_evaluacion)
        
    if not evaluacion:

        logger.warning(f"La evaluación {id_evaluacion} no existe.")

        return False

    # ------------------------------------------------------
    # FUTURO:
    # Validar que la evaluación no tenga calificaciones
    # asociadas antes de eliminarla.
    # ------------------------------------------------------

    try:

        db.session.delete(evaluacion)

        db.session.commit()

        logger.info(f"Evaluación {id_evaluacion} eliminada correctamente.")

        return True

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al eliminar la evaluación.")

        raise BusinessError("No fue posible eliminar la evaluación.", 500)

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al eliminar la evaluación.")

        raise BusinessError("Ocurrió un error interno del servidor.",500)