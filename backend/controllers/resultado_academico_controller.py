from flask import request
from marshmallow import ValidationError

from services.resultado_academico_service import *

from schemas.resultado_academico_schema import *

from utils.response import success_response, error_response

from exceptions import BusinessError


# Obtiene el listado de resultados académicos.
def get_lista_resultados_academicos():

    resultados = obtener_lista_resultados_academicos()

    resultado = resultados_academicos_schema.dump(resultados)

    return success_response(
        data=resultado,
        total=len(resultado),
        message="Listado de resultados académicos.",
    )


# Obtiene un resultado académico por su identificador.
def get_resultado_academico(id_resultado_academico):

    resultado = obtener_resultado_academico_por_id(id_resultado_academico)

    if not resultado:

        return error_response("Resultado académico no encontrado.", status_code=404)

    datos = resultado_academico_schema.dump(resultado)

    return success_response(data=datos, message="Resultado académico encontrado.")


# Registra un resultado académico.
def agregar_resultado_academico():

    try:

        datos = resultado_academico_request_schema.load(request.get_json())

        nuevo = crear_resultado_academico(datos)

        resultado = resultado_academico_schema.dump(nuevo)

        return success_response(
            data=resultado,
            message="Resultado académico registrado correctamente.",
            status_code=201,
        )

    except ValidationError as err:

        return error_response(
            message="Error de validación.", errors=err.messages, status_code=400
        )

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)


# Modifica un resultado académico.
def actualizar_resultado_academico(id_resultado_academico):

    try:

        datos = modificar_resultado_academico_schema.load(request.get_json())

        resultado = modificar_resultado_academico(id_resultado_academico, datos)

        if not resultado:

            return error_response("Resultado académico no encontrado.", status_code=404)

        datos_resultado = resultado_academico_schema.dump(resultado)

        return success_response(
            data=datos_resultado,
            message=(f"Resultado académico " f"{id_resultado_academico} actualizado."),
        )

    except ValidationError as err:

        return error_response(
            message="Error de validación.", errors=err.messages, status_code=400
        )

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)


# Elimina un resultado académico.
def eliminar_resultado_academico_controller(id_resultado_academico):

    try:

        eliminado = eliminar_resultado_academico(id_resultado_academico)

        if not eliminado:

            return error_response("Resultado académico no encontrado.", status_code=404)

        return success_response(
            message=(f"Resultado académico " f"{id_resultado_academico} eliminado.")
        )

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)
