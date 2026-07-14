from flask import request
from marshmallow import ValidationError
from services.certificado_service import *
from schemas.certificado_schema import *
from utils.response import success_response, error_response
from exceptions import BusinessError


# Obtiene el listado de certificados.
def get_lista_certificados():

    certificados = obtener_lista_certificados()

    datos = certificados_schema.dump(certificados)

    return success_response(
        data=datos, total=len(datos), message="Listado de certificados."
    )


# Obtiene un certificado por ID.
def get_certificado(id_certificado):

    certificado = obtener_certificado_por_id(id_certificado)

    if not certificado:

        return error_response("Certificado no encontrado.", status_code=404)

    datos = certificado_schema.dump(certificado)

    return success_response(data=datos, message="Certificado encontrado.")


# Genera un certificado.
def agregar_certificado():

    try:

        datos = certificado_request_schema.load(request.get_json())

        certificado = crear_certificado(datos["id_resultado_plan"])

        datos_certificado = certificado_schema.dump(certificado)

        return success_response(
            data=datos_certificado,
            message="Certificado emitido correctamente.",
            status_code=201,
        )

    except ValidationError as err:

        return error_response(
            message="Error de validación.", errors=err.messages, status_code=400
        )

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)


# Modifica un certificado.
def actualizar_certificado_controller(id_certificado):

    try:

        datos = modificar_certificado_schema.load(request.get_json())

        certificado = modificar_certificado(id_certificado, datos)

        if not certificado:

            return error_response("Certificado no encontrado.", status_code=404)

        datos_certificado = certificado_schema.dump(certificado)

        return success_response(
            data=datos_certificado, message=f"Certificado {id_certificado} actualizado."
        )

    except ValidationError as err:

        return error_response(
            message="Error de validación.", errors=err.messages, status_code=400
        )

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)


# Elimina un certificado.
def eliminar_certificado_controller(id_certificado):

    try:

        eliminado = eliminar_certificado(id_certificado)

        if not eliminado:

            return error_response("Certificado no encontrado.", status_code=404)

        return success_response(message=f"Certificado {id_certificado} eliminado.")

    except BusinessError as e:

        return error_response(message=e.message, status_code=e.status_code)
