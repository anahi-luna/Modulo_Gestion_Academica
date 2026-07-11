from flask import request
from marshmallow import ValidationError
from exceptions import BusinessError
from schemas.evaluacion_schema import *
from services.evaluacion_service import *
from utils.response import success_response, error_response


# Obtiene el listado de evaluaciones.
# Permite filtrar por comisión o tipo de evaluación.
def get_lista_de_evaluaciones():

    id_comision = request.args.get("id_comision", type=int)

    id_tipo_evaluacion = request.args.get("id_tipo_evaluacion", type=int)

    evaluaciones = obtener_lista_de_evaluaciones(
        id_comision=id_comision, id_tipo_evaluacion=id_tipo_evaluacion
    )

    resultado = evaluaciones_schema.dump(evaluaciones)

    return success_response(
        data=resultado, total=len(resultado), message="Listado de evaluaciones."
    )


# Obtiene una evaluación por su identificador.
def get_evaluacion(id_evaluacion):

    evaluacion = obtener_evaluacion_por_id(id_evaluacion)

    if not evaluacion:

        return error_response("Evaluación no encontrada.", status_code=404)

    resultado = evaluacion_schema.dump(evaluacion)

    return success_response(data=resultado, message="Evaluación encontrada.")


# Registra una nueva evaluación.
def agregar_evaluacion():

    try:

        datos = evaluacion_request_schema.load(request.get_json())

        nueva = crear_evaluacion(datos)

        resultado = evaluacion_schema.dump(nueva)

        return success_response(
            data=resultado, message="Evaluación creada correctamente.", status_code=201
        )

    except ValidationError as err:

        return error_response(
            message="Error de validación.", errors=err.messages, status_code=400
        )

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)


# Modifica una evaluación existente.
def actualizar_evaluacion(id_evaluacion):

    try:

        datos = modificar_evaluacion_schema.load(request.get_json())

        evaluacion = modificar_evaluacion(id_evaluacion, datos)

        if not evaluacion:

            return error_response("Evaluación no encontrada.", status_code=404)

        resultado = evaluacion_schema.dump(evaluacion)

        return success_response(
            data=resultado, message=f"Evaluación {id_evaluacion} actualizada."
        )

    except ValidationError as err:

        return error_response(
            message="Error de validación.", errors=err.messages, status_code=400
        )

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)


# Elimina una evaluación.
def eliminar_evaluacion_controller(id_evaluacion):

    try:

        eliminado = eliminar_evaluacion(id_evaluacion)

        if not eliminado:

            return error_response("Evaluación no encontrada.", status_code=404)

        return success_response(message=f"Evaluación {id_evaluacion} eliminada.")

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)
