from flask import request
from services.inscripcion_service import *
from utils.response import *
from exceptions import BusinessError

def get_lista_de_inscripciones():
    inscripciones = obtener_lista_de_inscripciones()

    return success_response(
        data=inscripciones,
        total=len(inscripciones),
        message="Listado de inscripciones."
    )

def get_inscripcion(id_inscripcion):
    inscripcion = obtener_inscripcion_por_id(id_inscripcion)
    if not inscripcion:
        return error_response(
            "Inscripción no encontrada",
            status_code=404
        )
    return success_response(
        data=inscripcion,
        message="Inscripción encontrada."
    )

def agregar_inscripciones():
    try:
        body = request.get_json()
        lista = body.get("inscripciones", [])
        nuevas = crear_inscripciones(lista)

        return success_response(
            data=nuevas,
            total=len(nuevas),
            message="Solicitud recibida correctamente.",
            status_code=201
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
    
        return success_response(
            data=actualizada,
            message=f"Inscripción {id_inscripcion} actualizada."
        )
    except BusinessError as e:
        return error_response(
            message=e.message,
            status_code=e.status_code
        )

def inscripcion_eliminada(id_inscripcion):
    eliminado = eliminar_inscripcion(id_inscripcion)

    if not eliminado:
        return error_response(
            "Inscripción no encontrada",
            status_code=404
        )
    
    return success_response(
        message=f"Inscripción {id_inscripcion} eliminada."
    )