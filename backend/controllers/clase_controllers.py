from flask import request
from services.clase_service import *
from utils.response import success_response, error_response
from exceptions import BusinessError
from schemas.clase_schema import *
from marshmallow import ValidationError


def get_lista_de_clases():

    id_comision = request.args.get("id_comision", type=int)
    estado = request.args.get("estado")

    if estado:
        estado = estado.upper()

    clases = obtener_lista_de_clases(
        id_comision=id_comision,
        estado=EstadoClase[estado] if estado else None
    )

    resultado = clases_schema.dump(clases)

    return success_response(
        data=resultado,
        total=len(resultado),
        message="Listado de clases."
    )


def get_clase(id_clase):

    clase = obtener_clase_por_id(id_clase)

    if not clase:
        return error_response(
            "Clase no encontrada.",
            status_code=404
        )

    resultado = clase_schema.dump(clase)

    return success_response(
        data=resultado,
        message="Clase encontrada."
    )


def agregar_clase():

    try:

        datos = clase_request_schema.load(
            request.get_json()
        )

        nueva = crear_clase(datos)

        resultado = clase_schema.dump(nueva)

        return success_response(
            data=resultado,
            message="Clase creada correctamente.",
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


def actualizar_clase(id_clase):

    try:

        datos = modificar_clase_schema.load(
            request.get_json()
        )

        actualizada = modificar_clase(
            id_clase,
            datos
        )

        if not actualizada:
            return error_response(
                "Clase no encontrada.",
                status_code=404
            )

        resultado = clase_schema.dump(actualizada)

        return success_response(
            data=resultado,
            message=f"Clase {id_clase} actualizada."
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


def eliminar_clase_controller(id_clase):

    try:

        eliminado = eliminar_clase(id_clase)

        if not eliminado:

            return error_response(
                "Clase no encontrada.",
                status_code=404
            )

        return success_response(
            message=f"Clase {id_clase} eliminada."
        )

    except BusinessError as e:

        return error_response(
            message=e.message,
            status_code=e.status_code
        )