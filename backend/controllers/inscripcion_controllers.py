from flask import request
from services.inscripcion_service import *
from utils.response import success_response,error_response
from exceptions import BusinessError
from schemas.inscripcion_schema import *
from marshmallow import ValidationError

def get_lista_de_inscripciones():
    inscripciones = obtener_lista_de_inscripciones()

    resultado = inscripciones_schema.dump(inscripciones)
    return success_response(
        data=resultado,
        total=len(resultado),
        message="Listado de inscripciones."
    )

def get_inscripcion(id_inscripcion):
    inscripcion = obtener_inscripcion_por_id(id_inscripcion)
    if not inscripcion:
        return error_response(
            "Inscripción no encontrada",
            status_code=404
        )
    
    resultado = inscripcion_schema.dump(inscripcion)

    return success_response(
        data=resultado,
        message="Inscripción encontrada."
    )

def agregar_inscripciones():
    try:
        data = lista_inscripciones_schema.load(
            request.get_json()
        )
        nuevas = crear_inscripciones(data["inscripciones"])

        resultado = inscripciones_schema.dump(nuevas)

        return success_response(
            data=resultado,
            total=len(resultado),
            message="Solicitud recibida correctamente.",
            status_code=201
        )
    
    except ValidationError as err:
        return error_response(
            message="Error de validación.",
            errors= err.messages,
            status_code=400
        )

    except BusinessError as e:
        return error_response(
            message=e.message,
            status_code=e.status_code
        )

def actualizar_inscripcion(id_inscripcion):
    try:

        datos = request.get_json()

        actualizada = modificar_inscripcion(id_inscripcion,datos)

        if not actualizada:
            return error_response(
                "Inscripción no encontrada",
                status_code=404
            )
    
        resultado = inscripcion_schema.dump(actualizada) 

        return success_response(
            data=resultado,
            message=f"Inscripción {id_inscripcion} actualizada."
        )
    except BusinessError as e:
        return error_response(
            message=e.message,
            status_code=e.status_code
        )

def inscripcion_eliminada(id_inscripcion):
    try:

        eliminado = eliminar_inscripcion(id_inscripcion)

        if not eliminado:
            return error_response(
                "Inscripción no encontrada",
                status_code=404
            )
    
        return success_response(
            message=f"Inscripción {id_inscripcion} eliminada."
        )
    
    except BusinessError as e:
        
        return error_response(
            message=e.message,
            status_code=e.status_code
        )