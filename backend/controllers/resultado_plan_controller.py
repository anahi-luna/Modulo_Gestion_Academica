from flask import request
from marshmallow import ValidationError

from services.resultado_plan_service import *

from schemas.resultado_plan_schema import *

from utils.response import success_response, error_response

from exceptions import BusinessError


# Obtiene el listado de resultados de planes.
def get_lista_resultados_plan():

    resultados = obtener_lista_resultados_plan()

    datos = resultados_plan_schema.dump(resultados)

    return success_response(
        data=datos,
        total=len(datos),
        message="Listado de resultados de planes."
    )


# Obtiene un resultado de plan por ID.
def get_resultado_plan(id_resultado_plan):

    resultado = obtener_resultado_plan_por_id(
        id_resultado_plan
    )

    if not resultado:

        return error_response(
            "Resultado del plan no encontrado.",
            status_code=404
        )

    datos = resultado_plan_schema.dump(resultado)

    return success_response(
        data=datos,
        message="Resultado del plan encontrado."
    )


# Genera o actualiza un resultado de plan.
def agregar_resultado_plan():

    try:

        datos = resultado_plan_request_schema.load(
            request.get_json()
        )

        resultado = actualizar_resultado_plan(
            datos["id_legajo"],
            datos["id_plan"]
        )

        datos_resultado = resultado_plan_schema.dump(
            resultado
        )

        return success_response(
            data=datos_resultado,
            message="Resultado del plan generado correctamente.",
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


# Cambia el estado del resultado del plan.
def actualizar_resultado_plan_controller(id_resultado_plan):

    try:

        datos = modificar_resultado_plan_schema.load(
            request.get_json()
        )

        resultado = modificar_resultado_plan(
            id_resultado_plan,
            datos
        )

        if not resultado:

            return error_response(
                "Resultado del plan no encontrado.",
                status_code=404
            )

        datos_resultado = resultado_plan_schema.dump(
            resultado
        )

        return success_response(
            data=datos_resultado,
            message=f"Resultado del plan {id_resultado_plan} actualizado."
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


# Elimina un resultado del plan.
def eliminar_resultado_plan_controller(id_resultado_plan):

    try:

        eliminado = eliminar_resultado_plan(
            id_resultado_plan
        )

        if not eliminado:

            return error_response(
                "Resultado del plan no encontrado.",
                status_code=404
            )

        return success_response(
            message=f"Resultado del plan {id_resultado_plan} eliminado."
        )

    except BusinessError as e:

        return error_response(
            message=e.message,
            status_code=e.status_code
        )