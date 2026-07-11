from flask import request
from marshmallow import ValidationError

from services.calificaciones_service import *

from schemas.calificacion_schema import *

from utils.response import success_response, error_response

from exceptions import BusinessError


# Obtiene el listado de calificaciones.
# Permite filtrar por evaluación o inscripción.
def get_lista_de_calificaciones():

    id_evaluacion = request.args.get("id_evaluacion", type=int)

    id_inscripcion = request.args.get("id_inscripcion", type=int)

    calificaciones = obtener_lista_de_calificaciones(
        id_evaluacion=id_evaluacion, id_inscripcion=id_inscripcion
    )

    resultado = calificaciones_schema.dump(calificaciones)

    return success_response(
        data=resultado, total=len(resultado), message="Listado de calificaciones."
    )


# Obtiene una calificación por su identificador.
def get_calificacion(id_calificacion):

    calificacion = obtener_calificacion_por_id(id_calificacion)

    if not calificacion:

        return error_response("Calificación no encontrada.", status_code=404)

    resultado = calificacion_schema.dump(calificacion)

    return success_response(data=resultado, message="Calificación encontrada.")


# Registra una o varias calificaciones.
def agregar_calificaciones():

    try:

        datos = calificacion_request_schema.load(request.get_json())

        nuevas = crear_calificaciones(datos)

        resultado = calificaciones_schema.dump(nuevas)

        return success_response(
            data=resultado,
            total=len(resultado),
            message="Calificaciones registradas correctamente.",
            status_code=201,
        )

    except ValidationError as err:

        return error_response(
            message="Error de validación.", errors=err.messages, status_code=400
        )

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)


# Modifica una calificación existente.
def actualizar_calificacion(id_calificacion):

    try:

        datos = modificar_calificacion_schema.load(request.get_json())

        calificacion = modificar_calificacion(id_calificacion, datos)

        if not calificacion:

            return error_response("Calificación no encontrada.", status_code=404)

        resultado = calificacion_schema.dump(calificacion)

        return success_response(
            data=resultado, message=f"Calificación {id_calificacion} actualizada."
        )

    except ValidationError as err:

        return error_response(
            message="Error de validación.", errors=err.messages, status_code=400
        )

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)


# Elimina una calificación.
def eliminar_calificacion_controller(id_calificacion):

    try:

        eliminado = eliminar_calificacion(id_calificacion)

        if not eliminado:

            return error_response("Calificación no encontrada.", status_code=404)

        return success_response(message=f"Calificación {id_calificacion} eliminada.")

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)
