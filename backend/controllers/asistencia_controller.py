from flask import request
from marshmallow import ValidationError

from exceptions import BusinessError
from services.asistencia_service import *

from schemas.asistencia_schema import *

from utils.response import (
    success_response,
    error_response
)


# ==========================================================
# Obtiene el listado de asistencias.
# Permite filtrar por clase o inscripción.
# ==========================================================
def get_lista_de_asistencias():

    id_clase = request.args.get(
        "id_clase",
        type=int
    )

    id_inscripcion = request.args.get(
        "id_inscripcion",
        type=int
    )

    asistencias = obtener_lista_de_asistencias(
        id_clase=id_clase,
        id_inscripcion=id_inscripcion
    )

    resultado = asistencias_schema.dump(
        asistencias
    )

    return success_response(
        data=resultado,
        total=len(resultado),
        message="Listado de asistencias."
    )


# ==========================================================
# Obtiene una asistencia por su identificador.
# ==========================================================
def get_asistencia(id_asistencia):

    asistencia = obtener_asistencia_por_id(
        id_asistencia
    )

    if not asistencia:

        return error_response(
            "Asistencia no encontrada.",
            status_code=404
        )

    resultado = asistencia_schema.dump(
        asistencia
    )

    return success_response(
        data=resultado,
        message="Asistencia encontrada."
    )


# ==========================================================
# Registra las asistencias de una clase.
# ==========================================================
def agregar_asistencias():

    try:

        datos = asistencia_request_schema.load(
            request.get_json()
        )

        asistencias = crear_asistencias(
            datos
        )

        resultado = asistencias_schema.dump(
            asistencias
        )

        return success_response(
            data=resultado,
            total=len(resultado),
            message="Asistencias registradas correctamente.",
            status_code=201
        )

    except ValidationError as err:

        return error_response(
            message="Error de validación.",
            errors=err.messages,
            status_code=400
        )

    except BusinessError as e:

        return error_response(
            message=e.message,
            status_code=e.status_code
        )


# ==========================================================
# Modifica una asistencia existente.
# ==========================================================
def actualizar_asistencia(id_asistencia):

    try:

        datos = modificar_asistencia_schema.load(
            request.get_json()
        )

        asistencia = modificar_asistencia(
            id_asistencia,
            datos
        )

        if not asistencia:

            return error_response(
                "Asistencia no encontrada.",
                status_code=404
            )

        resultado = asistencia_schema.dump(
            asistencia
        )

        return success_response(
            data=resultado,
            message=f"Asistencia {id_asistencia} actualizada."
        )

    except ValidationError as err:

        return error_response(
            message="Error de validación.",
            errors=err.messages,
            status_code=400
        )

    except BusinessError as e:

        return error_response(
            message=e.message,
            status_code=e.status_code
        )