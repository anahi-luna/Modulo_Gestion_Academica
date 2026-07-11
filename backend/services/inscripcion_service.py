from datetime import datetime
from services.legajo_cliente import obtener_legajo
from services.comision_cliente import obtener_comision
from services.usuario_cliente import obtener_usuario
from services.estado_inscripcion_service import obtener_estado_por_nombre
from exceptions import BusinessError
from extensions import db
from models.modelo_inscripcion import Inscripcion
from models.modelo_estado_inscripcion import EstadoInscripcion
from models.modelo_asistencia import Asistencia
from models.modelo_calificacion import Calificacion
from sqlalchemy.exc import IntegrityError
from utils.logger import logger

ID_USUARIO_SIMULADO = 100


def existe_inscripcion(id_legajo, id_comision):
    return (
        Inscripcion.query.filter_by(
            id_legajo=id_legajo, id_comision=id_comision
        ).first()
        is not None
    )


def preparar_datos_inscripcion(inscripcion_data, id_estado):
    ahora = datetime.now()

    return {
        "id_legajo": inscripcion_data["id_legajo"],
        "id_comision": inscripcion_data["id_comision"],
        "id_estado": id_estado,
        "fecha_inscripcion": ahora,
        "id_usuario_creacion": ID_USUARIO_SIMULADO,
        "id_usuario_modificacion": None,
        "ts_creacion": ahora,
        "ts_modificacion": None,
    }


# ==========================================================
# Verifica si una inscripción posee asistencias registradas.
# ==========================================================
def existe_asistencia_inscripcion(id_inscripcion):

    return Asistencia.query.filter_by(id_inscripcion=id_inscripcion).first() is not None


# ==========================================================
# Verifica si una inscripción posee calificaciones registradas.
# ==========================================================
def existe_calificacion_inscripcion(id_inscripcion):

    return (
        Calificacion.query.filter_by(id_inscripcion=id_inscripcion).first() is not None
    )


def obtener_lista_de_inscripciones(id_estado=None, id_legajo=None, id_comision=None):
    logger.info("Consultando listado de inscripciones.")

    query = Inscripcion.query

    if id_estado is not None:
        query = query.filter_by(id_estado=id_estado)
    if id_legajo is not None:
        query = query.filter_by(id_legajo=id_legajo)

    if id_comision is not None:
        query = query.filter_by(id_comision=id_comision)

    return query.all()


def obtener_inscripcion_por_id(id_inscripcion):

    logger.info(f"Consultando inscripción {id_inscripcion}.")

    return db.session.get(Inscripcion, id_inscripcion)


def crear_inscripcion(datos):
    try:
        logger.info(
            f"Usuario {ID_USUARIO_SIMULADO} inició el registro de una inscripción."
        )

        # Obtener el estado Pendiente desde la BD
        estado = obtener_estado_por_nombre("Pendiente")

        if not estado:
            logger.warning("No existe el estado Pendiente.")
            raise BusinessError("No existe el estado Pendiente.", 500)

            # Validamos si existe legajo
        legajo = obtener_legajo(datos["id_legajo"])
        if not legajo:
            logger.warning(f"El legajo {datos['id_legajo']} no existe.")
            raise BusinessError("El legajo no existe.", 404)

        if not legajo["activo"]:
            logger.warning(f"El legajo {datos['id_legajo']} se encuentra inactivo.")
            raise BusinessError("El legajo se encuentra inactivo.", 400)

        # Validamos si existe la comision
        comision = obtener_comision(datos["id_comision"])
        if not comision:
            logger.warning(f"La comisión {datos['id_comision']} no existe.")
            raise BusinessError("La comisión no existe.", 404)

        # Validamos cupo de comision
        if comision["inscriptos"] >= comision["cupo"]:
            logger.warning(f"La comisión {datos['id_comision']} no posee cupo.")
            raise BusinessError("La comision no posee cupo disponible.", 400)

        # Validamos si existe usuario
        usuario = obtener_usuario(ID_USUARIO_SIMULADO)
        if not usuario:
            logger.warning("El usuario no existe.")
            raise BusinessError("El usuario no existe.", 404)

        # Validamos si el alumno ya está inscripto en ESTA comisión
        if existe_inscripcion(datos["id_legajo"], datos["id_comision"]):
            logger.warning(
                f"El legajo {datos['id_legajo']} ya está inscripto "
                f"en la comisión {datos['id_comision']}."
            )
            raise BusinessError(
                "El alumno ya se encuentra inscripto en esta comisión.", 400
            )

        datos_inscripcion = preparar_datos_inscripcion(datos, estado.id_estado)

        # Crear inscripción
        inscripcion = Inscripcion(**datos_inscripcion)

        db.session.add(inscripcion)

        # Simulacion Aumentar inscriptos
        comision["inscriptos"] += 1
        db.session.commit()
        logger.info(f"Inscripción {inscripcion.id_inscripcion} creada correctamente.")

        return inscripcion

    except IntegrityError:
        db.session.rollback()
        logger.exception("Error de integridad al registrar la inscripción.")
        raise BusinessError("Ocurrió un error al guardar la inscripción.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al registrar la inscripción.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


def modificar_inscripcion(id_inscripcion, datos):

    try:
        logger.info(
            f"Usuario {ID_USUARIO_SIMULADO} modificando la inscripción {id_inscripcion}."
        )

        inscripcion = obtener_inscripcion_por_id(id_inscripcion)

        if not inscripcion:
            logger.warning(f"La inscripción {id_inscripcion} no existe.")
            return None

        # cambiar estado
        if "id_estado" in datos:
            nuevo_estado = db.session.get(EstadoInscripcion, datos["id_estado"])

            if not nuevo_estado:
                logger.warning(f"El estado {datos['id_estado']} no existe.")
                raise BusinessError("El estado de inscripción no existe.", 404)

            inscripcion.id_estado = datos["id_estado"]

        # cambiar comision
        if "id_comision" in datos:
            nueva_comision = obtener_comision(datos["id_comision"])

            if not nueva_comision:
                logger.warning(f"La comisión {datos['id_comision']} no existe.")
                raise BusinessError("La comisión no existe.", 404)

            if nueva_comision["inscriptos"] >= nueva_comision["cupo"]:
                logger.warning(f"La comisión {datos['id_comision']} no posee cupo.")
                raise BusinessError("La comisión no posee cupo disponible.", 400)

            inscripcion.id_comision = datos["id_comision"]
            # Pendiente:Actualizar cupos cuando el microservicio de comisiones exponga su API.

        inscripcion.id_usuario_modificacion = ID_USUARIO_SIMULADO
        inscripcion.ts_modificacion = datetime.now()

        db.session.commit()
        logger.info(f"Inscripción {id_inscripcion} actualizada correctamente.")
        return inscripcion

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al actualizar la inscripción.")

        raise BusinessError("No fue posible actualizar la inscripción.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al actualizar la inscripción.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


def eliminar_inscripcion(id_inscripcion):

    try:
        logger.info(
            f"Usuario {ID_USUARIO_SIMULADO} eliminando la inscripción {id_inscripcion}."
        )

        inscripcion = obtener_inscripcion_por_id(id_inscripcion)

        if not inscripcion:
            logger.warning(f"La inscripción {id_inscripcion} no existe.")
            return False

        # No permite eliminar una inscripción
        # que ya tenga asistencias registradas.
        if existe_asistencia_inscripcion(id_inscripcion):

            logger.warning(
                f"La inscripción {id_inscripcion} posee asistencias registradas."
            )

            raise BusinessError(
                "No es posible eliminar la inscripción porque posee asistencias registradas.",
                400,
            )

        # No permite eliminar una inscripción
        # que ya tenga calificaciones registradas.
        if existe_calificacion_inscripcion(id_inscripcion):

            logger.warning(
                f"La inscripción {id_inscripcion} posee calificaciones registradas."
            )

            raise BusinessError(
                "No es posible eliminar la inscripción porque posee calificaciones registradas.",
                400,
            )

        db.session.delete(inscripcion)
        db.session.commit()
        logger.info(f"Inscripción {id_inscripcion} eliminada correctamente.")

        return True

    except IntegrityError:

        db.session.rollback()
        
        logger.exception("Error de integridad al eliminar la inscripción.")
        
        raise BusinessError("No fue posible eliminar la inscripción.", 500)

    except BusinessError:

        db.session.rollback()
        
        raise
    
    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al eliminar la inscripción.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)

    