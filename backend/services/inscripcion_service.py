from datetime import datetime
from services.legajo_cliente import obtener_legajo
from services.comision_cliente import obtener_comision
from services.usuario_cliente import obtener_usuario
from exceptions import BusinessError

# Base de datos simulada
INSCRIPCIONES = []

# Simulación de ID autoincremental
NEXT_ID = 1

ESTADO_PENDIENTE = 1
ID_USUARIO_SIMULADO = 100

def existe_inscripcion(id_legajo):
    for inscripcion in INSCRIPCIONES:
        if inscripcion["id_legajo"] == id_legajo:
            return True
    return False

def obtener_lista_de_inscripciones():
    return INSCRIPCIONES

def obtener_inscripcion_por_id(id_inscripcion):
    for inscripcion in INSCRIPCIONES:
        if inscripcion["id_inscripcion"] == id_inscripcion:
            return inscripcion
    
    return None

def crear_inscripciones(lista_inscripciones):
    global NEXT_ID
    
    nuevas = []

    for item in lista_inscripciones:
        #Validamos si existe legajo
        legajo = obtener_legajo(item["id_legajo"])
        if not legajo:
            raise BusinessError("El legajo no existe.",404)
        if not legajo["activo"]:
            raise BusinessError("El legajo se encuentra inactivo.",400)
        
        #Validamos si existe la comision
        comision = obtener_comision(item["id_comision"])
        if not comision:
            raise BusinessError("La comisión no existe.",404)
        #Validamos cupo de comision
        if comision["inscriptos"] >= comision["cupo"]:
            raise BusinessError("La comision no posee cupo disponible.",400)
        
        #Validamos si existe usuario
        usuario = obtener_usuario(ID_USUARIO_SIMULADO)
        if not usuario:
            raise BusinessError("El usuario no existe.",404)

        #Validamos si una inscripcion ya existe 
        if existe_inscripcion(item["id_legajo"]):
            raise BusinessError("El alumno ya posee una inscripción.",400)

        ahora = datetime.now().isoformat()
        # Crear inscripción
        inscripcion={
            "id_inscripcion":NEXT_ID,
            "id_legajo": item["id_legajo"],
            "id_comision": item["id_comision"],
            "id_estado":ESTADO_PENDIENTE,
            "fecha_inscripcion":ahora,
            "id_usuario_registro":ID_USUARIO_SIMULADO,
            "ts_creacion":ahora,
            "ts_modificacion": None
        }

        INSCRIPCIONES.append(inscripcion)
        nuevas.append(inscripcion)

        NEXT_ID +=1
        # Aumentar inscriptos
        comision["inscriptos"]+=1

    return nuevas
    
def modificar_inscripcion(id_inscripcion, datos):
    inscripcion = obtener_inscripcion_por_id(id_inscripcion)

    if not inscripcion:
        return None

    if "id_estado" in datos:
        inscripcion["id_estado"] = datos["id_estado"]
    
    if "id_comision" in datos:
        nueva_comision = obtener_comision(datos["id_comision"])

        if not nueva_comision:
            raise BusinessError("La comisión no existe.", 404)
        
        if nueva_comision["inscriptos"] >= nueva_comision["cupo"]:
            raise BusinessError("La comisión no posee cupo disponible.", 400)
        
        inscripcion["id_comision"] = datos["id_comision"]

    inscripcion["ts_modificacion"] = datetime.now().isoformat()
    
    return inscripcion

def eliminar_inscripcion(id_inscripcion):
    global INSCRIPCIONES

    for inscripcion in INSCRIPCIONES:
        if inscripcion["id_inscripcion"] == id_inscripcion:
            INSCRIPCIONES.remove(inscripcion)

            return True
    return False