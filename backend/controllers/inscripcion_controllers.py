from flask import request, g
from services.inscripcion_service import *
from utils.response import success_response,error_response
from exceptions import BusinessError
from schemas.inscripcion_schema import *
from marshmallow import ValidationError
#from clients.planes_cliente import obte

def get_lista_de_inscripciones():

    id_estado = request.args.get("id_estado", type=int)
    id_legajo = request.args.get("id_legajo", type=int)
    id_comision_asignatura = request.args.get("id_comision_asignatura", type=int)

    inscripciones = obtener_lista_de_inscripciones(
        id_estado= id_estado,
        id_legajo=id_legajo,
        id_comision_asignatura = id_comision_asignatura
    )

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

def obtener_mis_inscripciones():
    try:
        id_legajo = g.id_legajo

        mis_inscripciones= obtener_lista_de_inscripciones(id_legajo=id_legajo)
        
        resultado = inscripciones_schema.dump(mis_inscripciones)

        return success_response(
            data=resultado,
            total=len(resultado),
            message="Listado de mis inscripciones."
        )

    except BusinessError as e:
        
        return error_response(
            message=e.message,
            status_code=e.status_code
        )

def get_conteo_comisiones():
    try:

        resultado = obtener_conteo_comisiones()

        return success_response(
            data=resultado,
            total=len(resultado),
            message="Conteo de inscriptos por comisión."
        )

    except BusinessError as e:

        return error_response(
            message=e.message,
            status_code=e.status_code
        )  

def agregar_inscripcion():
    try:
        data = inscripcion_request_schema.load(
            request.get_json()
        )
        nueva = crear_inscripcion(data)

        resultado = inscripcion_schema.dump(nueva)

        return success_response(
            data=resultado,
            message="Solicitud de inscripción enviada correctamente",
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

        datos = modificar_inscripcion_schema.load(
            request.get_json()
        )

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