from datetime import datetime
from sqlalchemy.exc import IntegrityError
from extensions import db
from exceptions import BusinessError
from utils.logger import logger

from models.modelo_asistencia import (Asistencia,TipoRegistro)
from models.modelo_clase import EstadoClase
from services.clase_service import obtener_clase_por_id
from services.estado_asistencia_services import (obtener_estado_asistencia_por_id)
from services.usuario_cliente import obtener_usuario
from services.inscripcion_service import obtener_inscripcion_por_id

ID_USUARIO_SIMULADO = 100

# Obtiene el listado de asistencias.
# Permite filtrar por clase o inscripción.
def obtener_lista_de_asistencias(id_clase=None,id_inscripcion=None):
    logger.info("Consultando listado de asistencias.")

    query = Asistencia.query

    if id_clase is not None:
        query = query.filter_by(id_clase=id_clase)

    if id_inscripcion is not None:
        query = query.filter_by(id_inscripcion=id_inscripcion )

    return query.all()

# Obtiene una asistencia mediante su identificador.
def obtener_asistencia_por_id(id_asistencia):
    logger.info(
        f"Consultando asistencia {id_asistencia}."
    )
    return db.session.get( Asistencia,id_asistencia )

# Verifica si una inscripción ya posee asistencia
# registrada para una determinada clase.
def existe_asistencia(id_inscripcion,id_clase):
    return (
        Asistencia.query.filter_by(
            id_inscripcion=id_inscripcion,
            id_clase=id_clase
        ).first()
        is not None
    )

# Valida que una asistencia pueda registrarse.
def validar_item_asistencia(item, clase, id_clase):
    # Verifica que exista la inscripción.
    inscripcion = obtener_inscripcion_por_id(item["id_inscripcion"])

    if not inscripcion:
        logger.warning(
            f"La inscripción "
            f"{item['id_inscripcion']} no existe."
        )

        raise BusinessError(
            f"La inscripción "
            f"{item['id_inscripcion']} no existe.",
            404
        )

    # Verifica que la inscripción pertenezca
    # a la comisión de la clase.
    if inscripcion.id_comision != clase.id_comision:
        logger.warning(
            f"La inscripción "
            f"{inscripcion.id_inscripcion} "
            f"no pertenece a la comisión "
            f"{clase.id_comision}."
        )

        raise BusinessError(
            "La inscripción no pertenece a la comisión de la clase.", 400)

    # Verifica que exista el estado.
    estado = obtener_estado_asistencia_por_id(item["id_estado"])

    if not estado:
        logger.warning(
            f"Estado de asistencia "
            f"{item['id_estado']} inexistente."
        )

        raise BusinessError( "Estado de asistencia inválido.",400)

    # Verifica que la asistencia no exista.
    if existe_asistencia(item["id_inscripcion"],id_clase):
        logger.warning(
            f"La inscripción "
            f"{item['id_inscripcion']} "
            f"ya posee asistencia registrada."
        )

        raise BusinessError("La asistencia ya fue registrada.",400)
            

# Prepara los datos necesarios para crear una asistencia.
def preparar_datos_asistencia(item, id_clase,fecha):
    
    return {
        "id_inscripcion": item["id_inscripcion"],
        "id_clase": id_clase,
        "id_estado": item["id_estado"],
        "tipo_registro": TipoRegistro.MANUAL,
        "observacion": item.get("observacion"),
        "id_usuario_creacion": ID_USUARIO_SIMULADO,
        "id_usuario_modificacion": None,
        "ts_creacion": fecha,
        "ts_modificacion": None
    }

# Registra las asistencias de una clase.
def crear_asistencias(datos):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} inició el registro "
        f"de asistencias para la clase {datos['id_clase']}."
    )

    # Lista donde se almacenarán todas las asistencias
    # antes de guardarlas en la base de datos.
    lista_asistencias = []

    try:
        # Valida que la clase exista.
        clase = obtener_clase_por_id(datos["id_clase"])

        if not clase:
            logger.warning(f"La clase {datos['id_clase']} no existe.")
            raise BusinessError("La clase no existe.",404)

        # Solo se puede registrar asistencia cuando
        # la clase fue dictada.
        if clase.estado != EstadoClase.DICTADA:
            logger.warning(
                f"Intento de registrar asistencia para "
                f"una clase con estado {clase.estado.name}."
            )
            raise BusinessError("Solo es posible registrar asistencia en clases dictadas.",400)

        # Verifica que exista el usuario.
        usuario = obtener_usuario(ID_USUARIO_SIMULADO)

        if not usuario:
            logger.warning("El usuario no existe.")
            raise BusinessError("El usuario no existe.",404)
        
        ahora = datetime.now()

        # Recorre todas las asistencias enviadas.
        for item in datos["asistencias"]:
            # Valida la asistencia.
            validar_item_asistencia(item, clase,datos["id_clase"])

            # Prepara los datos de la asistencia.
            nueva_asistencia = preparar_datos_asistencia(item, datos["id_clase"],ahora)
            
            # Agrega la asistencia a la lista.
            lista_asistencias.append(Asistencia(**nueva_asistencia))

        # Agrega todas las asistencias a la sesión.
        db.session.add_all(lista_asistencias)

        # Guarda definitivamente los cambios.
        db.session.commit()

        logger.info(
            f"Se registraron correctamente "
            f"{len(lista_asistencias)} asistencias "
            f"para la clase {datos['id_clase']}."
        )

        return lista_asistencias

    # Error de integridad en la base de datos.
    except IntegrityError:
        db.session.rollback()

        logger.exception( "Error de integridad al registrar las asistencias.")
        raise BusinessError("No fue posible registrar las asistencias.", 500)

    # Error de negocio.
    # Se vuelve a lanzar para que el controller lo capture.
    except BusinessError:
        db.session.rollback()
        raise

    # Cualquier otro error inesperado.
    except Exception:
        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al registrar las asistencias.")
        raise BusinessError("Ocurrió un error interno del servidor.",500)


            
# Modifica una asistencia existente.
def modificar_asistencia(id_asistencia, datos):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
        f"modificando la asistencia {id_asistencia}."
    )

    # Busca la asistencia.
    asistencia = obtener_asistencia_por_id( id_asistencia )

    if not asistencia:
        logger.warning(f"La asistencia {id_asistencia} no existe.")
        return None

    # Verifica que exista el usuario.
    if not obtener_usuario(ID_USUARIO_SIMULADO):
        logger.warning("El usuario no existe.")
        raise BusinessError("El usuario no existe.",404)

    # Verifica que exista la clase.
    clase = obtener_clase_por_id(asistencia.id_clase)

    if not clase:
        logger.warning(f"La clase {asistencia.id_clase} no existe.")
        raise BusinessError("La clase no existe.",404)

    # Solo pueden modificarse asistencias
    # de clases dictadas.
    if clase.estado != EstadoClase.DICTADA:
        logger.warning(
            f"Intento de modificar una asistencia "
            f"de una clase con estado {clase.estado.name}."
        )

        raise BusinessError("Solo es posible modificar asistencias de clases dictadas.",400)

    # Indica si realmente hubo modificaciones.
    hubo_cambios = False

    # Actualiza el estado de asistencia.
    if "id_estado" in datos:
        # Verifica que exista el estado.
        if not obtener_estado_asistencia_por_id(datos["id_estado"]):

            logger.warning(
                f"Estado de asistencia "
                f"{datos['id_estado']} inexistente."
            )

            raise BusinessError("Estado de asistencia inválido.",400)

        # Solo actualiza si cambió.
        if asistencia.id_estado != datos["id_estado"]:
            asistencia.id_estado = datos["id_estado"]
            hubo_cambios = True

    # Actualiza la observación.
    if "observacion" in datos:

        if asistencia.observacion != datos["observacion"]:
            asistencia.observacion = datos["observacion"]
            hubo_cambios = True

    # Si no hubo cambios, no realiza UPDATE.
    if not hubo_cambios:

        logger.info(
            f"La asistencia {id_asistencia} "
            f"no presentó modificaciones."
        )

        return asistencia

    # Actualiza los datos de auditoría.
    asistencia.id_usuario_modificacion = ID_USUARIO_SIMULADO
    asistencia.ts_modificacion = datetime.now()

    try:

        db.session.commit()
        logger.info(
            f"Asistencia {id_asistencia} "
            f"actualizada correctamente."
        )
        return asistencia

    except IntegrityError:
        db.session.rollback()

        logger.exception("Error de integridad al actualizar la asistencia.")
        raise BusinessError("No fue posible actualizar la asistencia.",500) 

    except Exception:
        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al actualizar la asistencia.")
        raise BusinessError("Ocurrió un error interno del servidor.",500)
