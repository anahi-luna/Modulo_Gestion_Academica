from flask import request
from services.clase_service import *
from utils.response import success_response, error_response
from exceptions import BusinessError
from schemas.clase_schema import *
from marshmallow import ValidationError

#Obtiene el listado de clases
def get_lista_de_clases():

    # Obtiene el parámetro "id_comision_asignatura" enviado en la URL.
    id_comision_asignatura = request.args.get("id_comision_asignatura", type=int)

    # Obtiene el parámetro "estado" enviado por la URL.
    estado = request.args.get("estado")

    if estado:
        estado = estado.upper() #Lo convierte en mayúscula para q coincida con los ENUM

    # Solicita al servicio la lista de clases aplicando los filtros.
    clases = obtener_lista_de_clases(
        id_comision_asignatura=id_comision_asignatura,
        estado=EstadoClase[estado] if estado else None
        # Si existe un estado, lo convierte al Enum.
        # Si no existe, envía None para no aplicar ese filtro.
    )

    # Convierte la lista de objetos Clase en formato JSON.
    resultado = clases_schema.dump(clases)

    return success_response(
        data=resultado,
        total=len(resultado),
        message="Listado de clases."
    )

# Obtiene una clase por id
def get_clase(id_clase):

    clase = obtener_clase_por_id(id_clase)

    if not clase:
        return error_response(
            "Clase no encontrada.",
            status_code=404
        )

     # Convierte el objeto Clase a formato JSON.
    resultado = clase_schema.dump(clase)

    return success_response(
        data=resultado,
        message="Clase encontrada."
    )

# Crea una nueva clase.
def agregar_clase():

    try:
        # Obtiene el JSON enviado por el cliente y valida
        # que los datos cumplan con el schema definido.
        datos = clase_request_schema.load(
            request.get_json()
        )

        # Envía los datos validados al servicio para crear la clase.
        nueva = crear_clase(datos)

        resultado = clase_schema.dump(nueva)

        return success_response(
            data=resultado,
            message="Clase creada correctamente.",
            status_code=201
        )

    # Captura errores de validación del schema.
    except ValidationError as err:

        return error_response(
            message="Error de validación.",
            errors=err.messages,
            status_code=400
        )

     # Captura errores de reglas de negocio.
    except BusinessError as e:

        return error_response(
            message=e.message,
            status_code=e.status_code
        )

# Modifica una clase existente.
def actualizar_clase(id_clase):

    try:
        # Obtiene y valida los datos enviados por el cliente.
        datos = modificar_clase_schema.load(
            request.get_json()
        )

        # Solicita al servicio actualizar la clase.
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

# Elimina una clase mediante su identificador.
def eliminar_clase_controller(id_clase):

    try:
        # Solicita al servicio eliminar la clase.
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