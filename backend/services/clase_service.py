from extensions import db
from models.modelo_clase import Clase, EstadoClase
from services.comision_cliente import obtener_comision
from exceptions import BusinessError
from services.usuario_cliente import obtener_usuario
from datetime import datetime
from sqlalchemy.exc import IntegrityError

ID_USUARIO_SIMULADO = 100

def obtener_lista_de_clases(id_comision=None,estado=None):
    # Inicia la consulta sobre la tabla Clase.
    query = Clase.query

     # Si se recibe una comisión, filtra únicamente sus clases.
    if id_comision is not None:
        query = query.filter_by(
            id_comision=id_comision
        )

    # Si se recibe un estado, filtra únicamente las clases con ese estado.
    if estado is not None:
        query = query.filter_by(
            estado=estado
        )

    # Ejecuta la consulta y devuelve todos los registros encontrados.
    return query.all()


def obtener_clase_por_id(id_clase):
    # Busca la clase utilizando su clave primaria.
    return db.session.get(Clase, id_clase)


def crear_clase(datos):
    #Validamos si existe la comision
    comision = obtener_comision(datos["id_comision"])
    if not comision:
        raise BusinessError("La comision no existe",404)
    
    # Verificamos que el número de clase no esté repetido
    if existe_numero_clase(datos["id_comision"],datos["numero_clase"]):
        raise BusinessError(
            "Ya existe ese número de clase para la comisión.",
            400
        )
      
    #Validar el horario de clase
    if datos["hora_fin"] <= datos["hora_inicio"]:
        raise BusinessError(
            "La hora de fin debe ser mayor que la hora de inicio.",
            400
        ) 
    
    #Validamos si existe usuario
    usuario = obtener_usuario(ID_USUARIO_SIMULADO)
    if not usuario:
        raise BusinessError("El usuario no existe", 404)
    
    # Completa automáticamente los datos de auditoría.
    datos_clase= preparar_datos_clase(datos)

    # Crea la nueva instancia del modelo.
    nueva_clase = Clase(**datos_clase)
    # Agrega el objeto a la sesión de la base de datos.
    db.session.add(nueva_clase)

    try:
        # Guarda definitivamente la información.
        db.session.commit()
    except IntegrityError:
        # Revierte la transacción en caso de error.
        db.session.rollback()
        raise BusinessError(
            "Ocurrió un error al guardar la clase",
            500
        )
    return nueva_clase


# Modifica una clase existente.
# Solo actualiza los campos enviados.
def modificar_clase(id_clase,datos):
    clase = obtener_clase_por_id(id_clase)

    if not clase:
        return None
    
    #Preguntamos si el usuario modifico una fecha
    if "fecha" in datos:
        clase.fecha=datos["fecha"]

    #O modifico la hora de inicio
    if "hora_inicio" in datos:
        clase.hora_inicio = datos["hora_inicio"]

    if "hora_fin" in datos:
         clase.hora_fin = datos["hora_fin"]

    if "tema" in datos:
        clase.tema = datos["tema"]

    # O si actualizo el estado de la clase.
    if "estado" in datos:
        clase.estado = EstadoClase[datos["estado"]]
    
    # Si cambia el número de clase,
    # verifica que no exista otro igual.
    if "numero_clase" in datos:
        
        if (datos["numero_clase"] != clase.numero_clase
            and existe_numero_clase(clase.id_comision, datos["numero_clase"])):
            raise BusinessError(
                "Ya existe ese número de clase para la comisión.",
                400
            )
        clase.numero_clase = datos["numero_clase"]
   
   # Actualiza los datos de auditoría.
    clase.id_usuario_modificacion = ID_USUARIO_SIMULADO
    clase.ts_modificacion = datetime.now()

    # Verifica nuevamente el horario.
    if clase.hora_fin <= clase.hora_inicio:
        raise BusinessError(
            "La hora de fin debe ser mayor que la hora de inicio.",
            400
        )

    try:
        # Guarda los cambios.
        db.session.commit()
    except IntegrityError:
        # Revierte la transacción.
        db.session.rollback()
        raise BusinessError(
            "No fue posible actualizar la clase.",
            500
        )
    
    return clase

def eliminar_clase(id_clase):
    clase = obtener_clase_por_id(id_clase)

    if not clase:
        return False
    
    try:
        db.session.delete(clase)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise BusinessError(
            "No fue posible eliminar la clase.",
            500
        )
    return True


# Verifica si ya existe un número de clase
# dentro de una determinada comisión.
def existe_numero_clase(id_comision,numero_clase):
    return (
        Clase.query.filter_by(
            id_comision = id_comision,
            numero_clase = numero_clase
        ).first()
        is not None
    )


# Completa automáticamente los datos necesarios
# para crear una nueva clase.
def preparar_datos_clase(datos):
    ahora = datetime.now() # Obtiene la fecha y hora actual.

    # Devuelve un diccionario con toda la información
    # necesaria para crear el registro.
    return{
        "id_comision": datos["id_comision"],
        "numero_clase": datos["numero_clase"],
        "fecha": datos["fecha"],
        "hora_inicio": datos["hora_inicio"],
        "hora_fin": datos["hora_fin"],
        "tema": datos["tema"],
        "estado":EstadoClase.PROGRAMADA , # Toda clase nueva comienza con estado PROGRAMADA.
        # Datos de auditoría.
        "id_usuario_creacion": ID_USUARIO_SIMULADO,
        "id_usuario_modificacion": None,
        "ts_creacion": ahora,
        "ts_modificacion": None
    }