from datetime import datetime
from extensions import db
from exceptions import BusinessError
from sqlalchemy.exc import IntegrityError
from utils.logger import logger
from flask import g

from clients.planes_cliente import (
    obtener_comision_asignatura_por_id,
    obtener_legajo
)
from services.estado_inscripcion_service import obtener_estado_por_nombre
from services.resultado_plan_service import actualizar_resultado_plan

from models.modelo_inscripcion import Inscripcion
from models.modelo_estado_inscripcion import EstadoInscripcion
from models.modelo_asistencia import Asistencia
from models.modelo_calificacion import Calificacion

# Verifica si ya existe una inscripción para el mismo alumno y comisión.
def existe_inscripcion(id_legajo, id_comision_asignatura):
    return (
        Inscripcion.query.filter_by(
            id_legajo=id_legajo, id_comision_asignatura=id_comision_asignatura
        ).first()
        is not None
    )

# Prepara los datos para crear una nueva inscripción
def preparar_datos_inscripcion(inscripcion_data, id_estado, id_usuario_autenticado):
    ahora = datetime.now()

    return {
        "id_legajo": inscripcion_data["id_legajo"],
        "id_comision_asignatura": inscripcion_data["id_comision_asignatura"],
        "id_estado": id_estado,
        "fecha_inscripcion": ahora,
        "id_usuario_creacion": id_usuario_autenticado,
        "id_usuario_modificacion": None,
        "ts_creacion": ahora,
        "ts_modificacion": None,
    }


# Verifica si una inscripción posee asistencias registradas.
def existe_asistencia_inscripcion(id_inscripcion):

    return Asistencia.query.filter_by(id_inscripcion=id_inscripcion).first() is not None


# Verifica si una inscripción posee calificaciones registradas.
def existe_calificacion_inscripcion(id_inscripcion):

    return (
        Calificacion.query.filter_by(id_inscripcion=id_inscripcion).first() is not None
    )

# Obtiene el listado de inscripciones con filtros opcionales.
def obtener_lista_de_inscripciones(id_estado=None, id_legajo=None, id_comision_asignatura=None):
    logger.info("Consultando listado de inscripciones.")

    query = Inscripcion.query

    if id_estado is not None:
        query = query.filter_by(id_estado=id_estado)
    if id_legajo is not None:
        query = query.filter_by(id_legajo=id_legajo)

    if id_comision_asignatura is not None:
        query = query.filter_by(id_comision_asignatura=id_comision_asignatura)

    return query.all()

# Obtiene una inscripción por su ID.
def obtener_inscripcion_por_id(id_inscripcion):

    logger.info(f"Consultando inscripción {id_inscripcion}.")

    return db.session.get(Inscripcion, id_inscripcion)

#Calcula el número de inscriptos en una comision asignatura
def contar_inscriptos(id_comision_asignatura):

    estado_aceptada = obtener_estado_por_nombre("Aceptada")
    estado_finalizada = obtener_estado_por_nombre("Finalizada")

    return (
        Inscripcion.query.filter(
            Inscripcion.id_comision_asignatura == id_comision_asignatura,
            Inscripcion.id_estado.in_([
                estado_aceptada.id_estado,
                estado_finalizada.id_estado
            ])
        ).count()
    )

# Registra una nueva inscripción.
def crear_inscripcion(datos):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    try:
        logger.info(
            f"Usuario {id_usuario_autenticado} inició el registro de una inscripción."
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
        comision = obtener_comision(datos["id_comision_asignatura"])
        if not comision:
            logger.warning(f"La comisión {datos['id_comision_asignatura']} no existe.")
            raise BusinessError("La comisión no existe.", 404)

        # Validamos cupo de comision
        if comision["inscriptos"] >= comision["cupo"]:
            logger.warning(f"La comisión {datos['id_comision_asignatura']} no posee cupo.")
            raise BusinessError("La comision no posee cupo disponible.", 400)

        # Validamos si el alumno ya está inscripto en ESTA comisión
        if existe_inscripcion(datos["id_legajo"], datos["id_comision_asignatura"]):
            logger.warning(
                f"El legajo {datos['id_legajo']} ya está inscripto "
                f"en la comisión {datos['id_comision_asignatura']}."
            )
            raise BusinessError(
                "El alumno ya se encuentra inscripto en esta comisión.", 400
            )
        
        # Prepara los datos de la inscripción.
        datos_inscripcion = preparar_datos_inscripcion(
            datos, estado.id_estado, id_usuario_autenticado
        )

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

# Modifica una inscripción existente.
def modificar_inscripcion(id_inscripcion, datos):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    try:
        logger.info(
            f"Usuario {id_usuario_autenticado} modificando la inscripción {id_inscripcion}."
        )
        # Cambia el estado de la inscripción.
        inscripcion = obtener_inscripcion_por_id(id_inscripcion)

        if not inscripcion:
            logger.warning(f"La inscripción {id_inscripcion} no existe.")
            return None

        # Cambiar estado.
        if "id_estado" in datos:

            nuevo_estado = db.session.get(EstadoInscripcion, datos["id_estado"])

            if not nuevo_estado:

                logger.warning(f"El estado {datos['id_estado']} no existe.")

                raise BusinessError("El estado de inscripción no existe.", 404)

            estado_anterior = inscripcion.id_estado

            inscripcion.id_estado = datos["id_estado"]

            # Cuando una inscripción pasa por primera vez
            # a estado ACEPTADA se crea el ResultadoPlan.
            if (
                estado_anterior != nuevo_estado.id_estado
                and nuevo_estado.nombre == "Aceptada"
            ):

                comision = obtener_comision(inscripcion.id_comision_asignatura)

                plan_asignatura = obtener_plan_asignatura(
                    comision["id_plan_asignatura"]
                )

                actualizar_resultado_plan(
                    inscripcion.id_legajo, plan_asignatura["id_plan"]
                )

        # cambiar comision
        if "id_comision_asignatura" in datos:
            nueva_comision = obtener_comision(datos["id_comision_asignatura"])

            if not nueva_comision:
                logger.warning(f"La comisión {datos['id_comision_asignatura']} no existe.")
                raise BusinessError("La comisión no existe.", 404)

            if nueva_comision["inscriptos"] >= nueva_comision["cupo"]:
                logger.warning(f"La comisión {datos['id_comision_asignatura']} no posee cupo.")
                raise BusinessError("La comisión no posee cupo disponible.", 400)

            inscripcion.id_comision_asignatura = datos["id_comision_asignatura"]
            # Pendiente:Actualizar cupos cuando el microservicio de comisiones exponga su API.

        # Registra el usuario y fecha de modificación.
        inscripcion.id_usuario_modificacion = id_usuario_autenticado
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
    id_usuario_autenticado = g.id_usuario
    try:
        logger.info(
            f"Usuario {id_usuario_autenticado} eliminando la inscripción {id_inscripcion}."
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
