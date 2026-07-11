from extensions import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from exceptions import BusinessError
from utils.logger import logger
from models.modelo_clase import Clase, EstadoClase
from models.modelo_asistencia import Asistencia
from services.comision_cliente import obtener_comision
from services.usuario_cliente import obtener_usuario

ID_USUARIO_SIMULADO = 100


def obtener_lista_de_clases(id_comision=None, estado=None):
    logger.info("Consultando listado de clases.")
    # Inicia la consulta sobre la tabla Clase.
    query = Clase.query

    # Si se recibe una comisión, filtra únicamente sus clases.
    if id_comision is not None:
        query = query.filter_by(id_comision=id_comision)

    # Si se recibe un estado, filtra únicamente las clases con ese estado.
    if estado is not None:
        query = query.filter_by(estado=estado)

    # Ejecuta la consulta y devuelve todos los registros encontrados.
    return query.all()


def obtener_clase_por_id(id_clase):
    logger.info(f"Consultando clase {id_clase}.")
    # Busca la clase utilizando su clave primaria.
    return db.session.get(Clase, id_clase)


def crear_clase(datos):
    try:

        logger.info(
            f"Usuario {ID_USUARIO_SIMULADO} " "inició el registro de una clase."
        )

        # Valida la comisión.
        comision = obtener_comision(datos["id_comision"])

        if not comision:

            logger.warning(f"La comisión {datos['id_comision']} no existe.")

            raise BusinessError("La comisión no existe.", 404)

        # Verifica número de clase.
        if existe_numero_clase(datos["id_comision"], datos["numero_clase"]):

            logger.warning(
                f"Ya existe la clase "
                f"{datos['numero_clase']} "
                f"para la comisión "
                f"{datos['id_comision']}."
            )

            raise BusinessError("Ya existe ese número de clase para la comisión.", 400)

        # Valida horario.
        if datos["hora_fin"] <= datos["hora_inicio"]:

            logger.warning("La hora de fin debe ser mayor que la hora de inicio.")

            raise BusinessError(
                "La hora de fin debe ser mayor que la hora de inicio.", 400
            )

        # Valida usuario.
        usuario = obtener_usuario(ID_USUARIO_SIMULADO)

        if not usuario:

            logger.warning("El usuario no existe.")

            raise BusinessError("El usuario no existe.", 404)

        datos_clase = preparar_datos_clase(datos)

        nueva_clase = Clase(**datos_clase)

        db.session.add(nueva_clase)

        db.session.commit()

        logger.info(f"Clase {nueva_clase.id_clase} " "creada correctamente.")

        return nueva_clase

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al registrar la clase.")

        raise BusinessError("Ocurrió un error al guardar la clase.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al registrar la clase.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Modifica una clase existente.
# Solo actualiza los campos enviados.
def modificar_clase(id_clase, datos):
    try:

        logger.info(
            f"Usuario {ID_USUARIO_SIMULADO} " f"modificando la clase {id_clase}."
        )

        clase = obtener_clase_por_id(id_clase)

        if not clase:

            logger.warning(f"La clase {id_clase} no existe.")

            return None

        if "fecha" in datos:
            clase.fecha = datos["fecha"]

        if "hora_inicio" in datos:
            clase.hora_inicio = datos["hora_inicio"]

        if "hora_fin" in datos:
            clase.hora_fin = datos["hora_fin"]

        if "tema" in datos:
            clase.tema = datos["tema"]

        if "estado" in datos:
            clase.estado = EstadoClase[datos["estado"]]

        if "numero_clase" in datos:

            if datos["numero_clase"] != clase.numero_clase and existe_numero_clase(
                clase.id_comision, datos["numero_clase"]
            ):

                logger.warning(
                    f"Ya existe la clase "
                    f"{datos['numero_clase']} "
                    f"para la comisión "
                    f"{clase.id_comision}."
                )

                raise BusinessError(
                    "Ya existe ese número de clase para la comisión.", 400
                )

            clase.numero_clase = datos["numero_clase"]

        if clase.hora_fin <= clase.hora_inicio:

            logger.warning("La hora de fin debe ser mayor que la hora de inicio.")

            raise BusinessError(
                "La hora de fin debe ser mayor que la hora de inicio.", 400
            )

        clase.id_usuario_modificacion = ID_USUARIO_SIMULADO
        clase.ts_modificacion = datetime.now()

        db.session.commit()

        logger.info(f"Clase {id_clase} actualizada correctamente.")

        return clase

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al actualizar la clase.")

        raise BusinessError("No fue posible actualizar la clase.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al actualizar la clase.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


def eliminar_clase(id_clase):
    try:

        logger.info(
            f"Usuario {ID_USUARIO_SIMULADO} " f"eliminando la clase {id_clase}."
        )

        clase = obtener_clase_por_id(id_clase)

        if not clase:

            logger.warning(f"La clase {id_clase} no existe.")

            return False

        # No permite eliminar una clase
        # que ya tenga asistencias registradas.
        if existe_asistencia_clase(id_clase):
            logger.warning(f"La clase {id_clase} posee asistencias registradas.")

            raise BusinessError("No es posible eliminar la clase porque posee asistencias registradas.",400,)



        db.session.delete(clase)

        db.session.commit()

        logger.info(f"Clase {id_clase} eliminada correctamente.")

        return True

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al eliminar la clase.")

        raise BusinessError("No fue posible eliminar la clase.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al eliminar la clase.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Verifica si ya existe un número de clase
# dentro de una determinada comisión.
def existe_numero_clase(id_comision, numero_clase):
    return (
        Clase.query.filter_by(
            id_comision=id_comision, numero_clase=numero_clase
        ).first()
        is not None
    )


# Completa automáticamente los datos necesarios
# para crear una nueva clase.
def preparar_datos_clase(datos):
    ahora = datetime.now()  # Obtiene la fecha y hora actual.

    # Devuelve un diccionario con toda la información
    # necesaria para crear el registro.
    return {
        "id_comision": datos["id_comision"],
        "numero_clase": datos["numero_clase"],
        "fecha": datos["fecha"],
        "hora_inicio": datos["hora_inicio"],
        "hora_fin": datos["hora_fin"],
        "tema": datos["tema"],
        "estado": EstadoClase.PROGRAMADA,  # Toda clase nueva comienza con estado PROGRAMADA.
        # Datos de auditoría.
        "id_usuario_creacion": ID_USUARIO_SIMULADO,
        "id_usuario_modificacion": None,
        "ts_creacion": ahora,
        "ts_modificacion": None,
    }


# Verifica si una clase posee asistencias registradas.
def existe_asistencia_clase(id_clase):

    return Asistencia.query.filter_by(
            id_clase=id_clase
        ).first() is not None
