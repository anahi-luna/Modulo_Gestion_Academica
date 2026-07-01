from datetime import datetime
from services.legajo_cliente import obtener_legajo
from services.comision_cliente import obtener_comision
from services.usuario_cliente import obtener_usuario
from services.estado_inscripcion_service import obtener_estado_por_nombre
from exceptions import BusinessError
from extensions import db
from models.modelo_inscripcion import Inscripcion
from models.modelo_estado_inscripcion import EstadoInscripcion
from sqlalchemy.exc import IntegrityError

ID_USUARIO_SIMULADO=100

def existe_inscripcion(id_legajo, id_comision):
    return (
        Inscripcion.query.filter_by(
            id_legajo=id_legajo,
            id_comision=id_comision
        ).first()
        is not None
    )

def preparar_datos_inscripcion(inscripcion_data,id_estado):
    ahora = datetime.now()

    return {
        "id_legajo": inscripcion_data["id_legajo"],
        "id_comision": inscripcion_data["id_comision"],
        "id_estado": id_estado,
        "fecha_inscripcion": ahora,
        "id_usuario_registro": ID_USUARIO_SIMULADO,
        "ts_creacion": ahora,
        "ts_modificacion": None
    }


def obtener_lista_de_inscripciones(
        id_estado=None,
        id_legajo=None,
        id_comision=None
):
    query = Inscripcion.query

    if id_estado is not None:
        query = query.filter_by(
            id_estado = id_estado
        )
    if id_legajo is not None:
        query = query.filter_by(
            id_legajo=id_legajo
        )

    if id_comision is not None:
        query = query.filter_by(
            id_comision=id_comision
        )
    
    return query.all()

def obtener_inscripcion_por_id(id_inscripcion):
    return db.session.get(
        Inscripcion,
        id_inscripcion
    )

def crear_inscripcion(datos):

    # Obtener el estado Pendiente desde la BD
    estado = obtener_estado_por_nombre("Pendiente")

    if not estado:
        raise BusinessError("No existe el estado Pendiente.",500)

    
        #Validamos si existe legajo
    legajo = obtener_legajo(datos["id_legajo"])
    if not legajo:
        raise BusinessError("El legajo no existe.",404)
    if not legajo["activo"]:
        raise BusinessError("El legajo se encuentra inactivo.",400)
        
    #Validamos si existe la comision
    comision = obtener_comision(datos["id_comision"])
    if not comision:
        raise BusinessError("La comisión no existe.",404)
    #Validamos cupo de comision
    if comision["inscriptos"] >= comision["cupo"]:
        raise BusinessError("La comision no posee cupo disponible.",400)
        
    #Validamos si existe usuario
    usuario = obtener_usuario(ID_USUARIO_SIMULADO)
    if not usuario:
        raise BusinessError("El usuario no existe.",404)

    # Validamos si el alumno ya está inscripto en ESTA comisión
    if existe_inscripcion(datos["id_legajo"],datos["id_comision"]):
        raise BusinessError(
            "El alumno ya se encuentra inscripto en esta comisión.",400)

    datos_inscripcion = preparar_datos_inscripcion(datos, estado.id_estado)

    # Crear inscripción
    inscripcion=Inscripcion(**datos_inscripcion)

    db.session.add(inscripcion)

    # Simulacion Aumentar inscriptos
    comision["inscriptos"]+=1

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise BusinessError(
            "Ocurrió un error al guardar la inscripción.",
            500
        )

    return inscripcion
    
def modificar_inscripcion(id_inscripcion, datos):
    inscripcion = obtener_inscripcion_por_id(id_inscripcion)

    if not inscripcion:
        return None

    #cambiar estado
    if "id_estado" in datos:
        nuevo_estado= db.session.get(
                EstadoInscripcion,
                datos["id_estado"]
            )
        if not nuevo_estado:
            raise BusinessError("El estado de inscripción no existe.",404)
        
        inscripcion.id_estado = datos["id_estado"]

    
    #cambiar comision
    if "id_comision" in datos:
        nueva_comision = obtener_comision(datos["id_comision"])

        if not nueva_comision:
            raise BusinessError("La comisión no existe.", 404)
        
        if nueva_comision["inscriptos"] >= nueva_comision["cupo"]:
            raise BusinessError("La comisión no posee cupo disponible.", 400)
        
        inscripcion.id_comision = datos["id_comision"]
        # Pendiente:Actualizar cupos cuando el microservicio de comisiones exponga su API.

    inscripcion.ts_modificacion = datetime.now()
    
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()

        raise BusinessError(
            "No fue posible actualizar la inscripción.",
            500
        )

    return inscripcion

def eliminar_inscripcion(id_inscripcion):
    inscripcion = obtener_inscripcion_por_id(id_inscripcion)

    if not inscripcion:
        return False
    
    try:
        db.session.delete(inscripcion)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()

        raise BusinessError(
            "No fue posible eliminar la inscripción.",
            500
        )
    
    return True