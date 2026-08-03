from datetime import datetime
from extensions import db
from exceptions import BusinessError
from sqlalchemy.exc import IntegrityError
from utils.logger import logger
from flask import g, request
from sqlalchemy import func

from clients.planes_cliente import (
    obtener_comision_asignatura_por_id,
    obtener_legajo,
    obtener_comision_asignatura_por_id_general,
)
from services.estado_inscripcion_service import obtener_estado_por_nombre
from services.resultado_plan_service import actualizar_resultado_plan

from models.modelo_inscripcion import Inscripcion
from models.modelo_estado_inscripcion import EstadoInscripcion
from models.modelo_asistencia import Asistencia
from models.modelo_calificacion import Calificacion

# -------------------CONSULTAS-------------------#


# Obtiene el listado de inscripciones con filtros opcionales.
def obtener_lista_de_inscripciones(
    id_estado=None, id_legajo=None, id_comision_asignatura=None
):
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

def obtener_conteo_comisiones():

    estado_aceptada = obtener_estado_por_nombre("Aceptada")
    estado_finalizada = obtener_estado_por_nombre("Finalizada")

    conteo = (
        db.session.query(
            Inscripcion.id_comision_asignatura,
            func.count(Inscripcion.id_inscripcion).label("inscriptos")
        )
        .filter(
            Inscripcion.id_estado.in_([
                estado_aceptada.id_estado,
                estado_finalizada.id_estado
            ])
        )
        .group_by(
            Inscripcion.id_comision_asignatura
        )
        .all()
    )

    return [
        {
            "id_comision_asignatura": fila.id_comision_asignatura,
            "inscriptos": fila.inscriptos
        }
        for fila in conteo
    ]


# -------------------VALIDACIONES-------------------#


# Verifica si ya existe una inscripción para el mismo alumno y comisión.
def existe_inscripcion(id_legajo, id_comision_asignatura):
    return (
        Inscripcion.query.filter_by(
            id_legajo=id_legajo, id_comision_asignatura=id_comision_asignatura
        ).first()
        is not None
    )


# Verifica si una inscripción posee asistencias registradas.
def existe_asistencia_inscripcion(id_inscripcion):

    return Asistencia.query.filter_by(id_inscripcion=id_inscripcion).first() is not None


# Verifica si una inscripción posee calificaciones registradas.
def existe_calificacion_inscripcion(id_inscripcion):

    return (
        Calificacion.query.filter_by(id_inscripcion=id_inscripcion).first() is not None
    )


def validar_transicion_estado(estado_actual, estado_nuevo):

    # Una inscripción cancelada no puede modificarse.
    if estado_actual.nombre == "Cancelada":
        raise BusinessError(
            "Una inscripción cancelada no puede modificarse.",
            400,
        )

    # Una inscripción finalizada no puede modificarse.
    if estado_actual.nombre == "Finalizada":
        raise BusinessError(
            "Una inscripción finalizada no puede modificarse.",
            400,
        )

    # Una inscripción aceptada no puede volver a pendiente.
    if estado_actual.nombre == "Aceptada" and estado_nuevo.nombre == "Pendiente":
        raise BusinessError(
            "Una inscripción aceptada no puede volver a estado Pendiente.",
            400,
        )

    # No hacer nada si el estado no cambia.
    if estado_actual.id_estado == estado_nuevo.id_estado:
        return


# -------------------CÁLCULOS-------------------#


# Calcula el número de inscriptos en una comision asignatura
def contar_inscriptos(id_comision_asignatura):

    estado_aceptada = obtener_estado_por_nombre("Aceptada")
    estado_finalizada = obtener_estado_por_nombre("Finalizada")

    return Inscripcion.query.filter(
        Inscripcion.id_comision_asignatura == id_comision_asignatura,
        Inscripcion.id_estado.in_(
            [estado_aceptada.id_estado, estado_finalizada.id_estado]
        ),
    ).count()


# -------------------PREPARACIÓN DE DATOS-------------------#


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


# -------------------CRUD-------------------#


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
        legajo = obtener_legajo(datos["id_legajo"], headers=request.headers)
        if not legajo:
            logger.warning(f"El legajo {datos['id_legajo']} no existe.")
            raise BusinessError("El legajo no existe.", 404)

        # Validamos si existe la comision
        comision = obtener_comision_asignatura_por_id_general(
            datos["id_comision_asignatura"], headers=request.headers
        )

        if not comision:
            raise BusinessError("La comisión no existe.", 404)

        # Validamos si el Legajo puede inscribirse a la comision asignatura
        comision = obtener_comision_asignatura_por_id(
            datos["id_comision_asignatura"], datos["id_legajo"], headers=request.headers
        )

        if not comision:
            raise BusinessError(
                "El legajo no cumple los requisitos para inscribirse en esta comisión asignatura.",
                403,
            )

        # Validamos cupo de comision
        if (
            contar_inscriptos(datos["id_comision_asignatura"])
            >= comision["cupo_maximo"]
        ):
            logger.warning(
                f"La comisión {datos['id_comision_asignatura']} no posee cupo."
            )
            raise BusinessError("La comisión no posee cupo disponible.", 400)

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

        # Busca la inscripción.
        inscripcion = obtener_inscripcion_por_id(id_inscripcion)

        if not inscripcion:
            logger.warning(f"La inscripción {id_inscripcion} no existe.")
            return None

        # Solo se permite modificar el estado de la inscripción.
        campos_permitidos = {"id_estado"}

        campos_invalidos = set(datos.keys()) - campos_permitidos

        if campos_invalidos:
            logger.warning(
                f"Se intentó modificar campos no permitidos: {campos_invalidos}"
            )

            raise BusinessError(
                "Solo está permitido modificar el estado de la inscripción.",
                400,
            )

        # Cambiar estado.
        if "id_estado" in datos:

            # Obtiene el estado actual de la inscripción.
            estado_actual = db.session.get(
                EstadoInscripcion,
                inscripcion.id_estado,
            )

            # Obtiene el nuevo estado solicitado.
            nuevo_estado = db.session.get(
                EstadoInscripcion,
                datos["id_estado"],
            )

            if not nuevo_estado:

                logger.warning(f"El estado {datos['id_estado']} no existe.")

                raise BusinessError(
                    "El estado de inscripción no existe.",
                    404,
                )

            # Valida que la transición de estado sea válida.
            validar_transicion_estado(
                estado_actual,
                nuevo_estado,
            )

            # Actualiza el estado.
            inscripcion.id_estado = nuevo_estado.id_estado

            # Cuando una inscripción pasa por primera vez
            # a estado ACEPTADA se crea el ResultadoPlan.
            if (
                estado_actual.id_estado != nuevo_estado.id_estado
                and nuevo_estado.nombre == "Aceptada"
            ):

                comision = obtener_comision_asignatura_por_id(
                    inscripcion.id_comision_asignatura,
                    inscripcion.id_legajo,
                    headers=request.headers,
                )

                if not comision:
                    raise BusinessError("La comisión no existe.", 404)

                actualizar_resultado_plan(
                    inscripcion.id_legajo,
                    comision["plan_asignaturas"]["plan"]["id"],
                )

        # Registra el usuario y fecha de modificación.
        inscripcion.id_usuario_modificacion = id_usuario_autenticado
        inscripcion.ts_modificacion = datetime.now()

        db.session.commit()

        logger.info(f"Inscripción {id_inscripcion} actualizada correctamente.")

        return inscripcion

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al actualizar la inscripción.")

        raise BusinessError(
            "No fue posible actualizar la inscripción.",
            500,
        )

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al actualizar la inscripción.")

        raise BusinessError(
            "Ocurrió un error interno del servidor.",
            500,
        )


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
