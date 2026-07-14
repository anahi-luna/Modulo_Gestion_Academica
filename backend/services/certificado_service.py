from extensions import db
from datetime import datetime
import uuid
from utils.logger import logger
from exceptions import BusinessError
from sqlalchemy.exc import IntegrityError

from models.modelo_certificado import Certificado
from models.modelo_estado_certificado import EstadoCertificado

from services.usuario_cliente import obtener_usuario
from services.resultado_plan_service import obtener_resultado_plan_por_id
from services.estado_certificado_service import obtener_estado_certificado_por_nombre
from services.tipo_certificado_service import obtener_tipo_certificado_por_nombre

ID_USUARIO_SIMULADO = 100

# -------------------CONSULTAS-------------------#


# Obtiene todos los certificados.
def obtener_lista_certificados():

    logger.info("Consultando listado de certificados.")

    return Certificado.query.all()


# Obtiene un certificado por ID.
def obtener_certificado_por_id(id_certificado):

    logger.info(f"Consultando certificado {id_certificado}.")

    return db.session.get(Certificado, id_certificado)


# Obtiene el certificado correspondiente
# a un resultado de plan.
def obtener_certificado_por_resultado_plan(id_resultado_plan):

    return Certificado.query.filter_by(id_resultado_plan=id_resultado_plan).first()


# Verifica si ya existe un certificado
# para un resultado de plan.
def existe_certificado(id_resultado_plan):

    return obtener_certificado_por_resultado_plan(id_resultado_plan) is not None


# Determina automáticamente el tipo
# de certificado que corresponde emitir.
def determinar_tipo_certificado(resultado_plan):

    if resultado_plan.estado.nombre == "Finalizado":

        return obtener_tipo_certificado_por_nombre("Aprobación")

    if resultado_plan.estado.nombre == "Incompleto":

        return obtener_tipo_certificado_por_nombre("Participación")

    raise BusinessError("No fue posible determinar el tipo de certificado.", 400)


# -------------------VALIDACIONES-------------------#


# Valida que el resultado del plan
# pueda emitir un certificado.
def validar_resultado_plan(resultado_plan):

    if not resultado_plan:

        raise BusinessError("El resultado del plan no existe.", 404)

    if resultado_plan.estado.nombre == "Abandonado":

        raise BusinessError(
            "No es posible emitir certificados para un plan abandonado.", 400
        )

    if resultado_plan.materias_finalizadas != resultado_plan.materias_totales:

        raise BusinessError("El plan de estudio todavía no finalizó.", 400)


# -------------------OBTENCIÓN DE DATOS-------------------#


# Genera un código único de verificación.
def generar_codigo_verificacion():

    return f"CERT-{str(uuid.uuid4())[:8].upper()}"


def obtener_certificado_por_codigo(codigo_verificacion):

    return Certificado.query.filter_by(codigo_verificacion=codigo_verificacion).first()


# -------------------PREPARAR DATOS-------------------#
# Prepara los datos necesarios para crear
# un certificado.
def preparar_datos_certificado(resultado_plan, tipo_certificado, estado_certificado):

    ahora = datetime.now()

    return {
        "id_resultado_plan": resultado_plan.id_resultado_plan,
        "id_tipo_certificado": tipo_certificado.id_tipo_certificado,
        "codigo_verificacion": generar_codigo_verificacion(),
        "fecha_emision": ahora.date(),
        "fecha_vencimiento": None,
        "url_documento": None,
        "id_estado_certificado": estado_certificado.id_estado_certificado,
        "id_usuario_creacion": ID_USUARIO_SIMULADO,
        "id_usuario_modificacion": None,
        "ts_creacion": ahora,
        "ts_modificacion": None,
    }


# -------------------CRUD-------------------#


# Genera un certificado automáticamente.
def crear_certificado(id_resultado_plan):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} generando un certificado para el"
        f"resultado del plan {id_resultado_plan}."
    )

    try:

        # Verifica el usuario.
        if not obtener_usuario(ID_USUARIO_SIMULADO):

            raise BusinessError("El usuario no existe.", 404)

        # Obtiene el resultado del plan.
        resultado_plan = obtener_resultado_plan_por_id(id_resultado_plan)

        # Valida que pueda emitir certificados.
        validar_resultado_plan(resultado_plan)

        # Verifica que todavía no exista uno.
        if existe_certificado(id_resultado_plan):

            raise BusinessError(
                "Ya existe un certificado para este resultado del plan.", 400
            )

        # Determina automáticamente el tipo.
        tipo = determinar_tipo_certificado(resultado_plan)
        if not tipo:

            raise BusinessError(
                "No fue posible determinar el tipo de certificado.", 404
            )

        # Obtiene el estado Emitido.
        estado = obtener_estado_certificado_por_nombre("Emitido")
        if not estado:

            raise BusinessError("El estado del certificado no existe.", 404)

        # Prepara los datos.
        datos = preparar_datos_certificado(resultado_plan, tipo, estado)

        certificado = Certificado(**datos)

        db.session.add(certificado)

        db.session.commit()

        logger.info(
            f"Certificado " f"{certificado.id_certificado} " "emitido correctamente."
        )

        return certificado

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al generar el certificado.")

        raise BusinessError("No fue posible generar el certificado.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al generar el certificado.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Modifica un certificado.
def modificar_certificado(id_certificado, datos):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} "
        f"modificando el certificado {id_certificado}."
    )

    try:

        certificado = obtener_certificado_por_id(id_certificado)

        if not certificado:

            logger.warning(f"El certificado {id_certificado} no existe.")

            return None

        # Cambiar estado.
        if "id_estado_certificado" in datos:

            estado = db.session.get(EstadoCertificado, datos["id_estado_certificado"])

            if not estado:

                raise BusinessError("El estado del certificado no existe.", 404)

            certificado.id_estado_certificado = estado.id_estado_certificado

        # Cambiar URL del documento.
        if "url_documento" in datos:

            certificado.url_documento = datos["url_documento"]

        # Cambiar fecha de vencimiento.
        if "fecha_vencimiento" in datos:

            certificado.fecha_vencimiento = datos["fecha_vencimiento"]

        certificado.id_usuario_modificacion = ID_USUARIO_SIMULADO

        certificado.ts_modificacion = datetime.now()

        db.session.commit()

        logger.info(f"Certificado {id_certificado} " "actualizado correctamente.")

        return certificado

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al actualizar el certificado.")

        raise BusinessError("No fue posible actualizar el certificado.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al actualizar el certificado.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# Elimina un certificado.
# Solo para desarrollo.
def eliminar_certificado(id_certificado):

    logger.info(
        f"Usuario {ID_USUARIO_SIMULADO} " f"eliminando el certificado {id_certificado}."
    )

    certificado = obtener_certificado_por_id(id_certificado)

    if not certificado:

        logger.warning(f"El certificado {id_certificado} no existe.")

        return False

    try:

        db.session.delete(certificado)

        db.session.commit()

        logger.info(f"Certificado {id_certificado} " "eliminado correctamente.")

        return True

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al eliminar el certificado.")

        raise BusinessError("No fue posible eliminar el certificado.", 500)

    except BusinessError:

        db.session.rollback()

        raise

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al eliminar el certificado.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)
