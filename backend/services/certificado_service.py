from extensions import db
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename
from utils.logger import logger
from exceptions import BusinessError
from sqlalchemy.exc import IntegrityError
from flask import g

from models.modelo_certificado import Certificado
from models.modelo_estado_certificado import EstadoCertificado

# Carpeta donde se guardan los archivos de certificados subidos.
# Al igual que en el servicio de documentos legales de auth, esta
# carpeta queda dentro de /app, que está bind-mounteado al host, por
# lo que los archivos persisten entre reinicios del contenedor.
CARPETA_UPLOADS = "/app/uploads/certificados"

EXTENSIONES_PERMITIDAS = {".pdf"}

# Firma binaria que todo PDF válido tiene al inicio del archivo. Se
# valida además de la extensión para evitar que un archivo renombrado
# a ".pdf" (que en realidad no lo es) quede guardado como certificado.
FIRMA_PDF = b"%PDF-"

TAMANIO_MAXIMO_MB = 10
TAMANIO_MAXIMO_BYTES = TAMANIO_MAXIMO_MB * 1024 * 1024

from services.resultado_plan_service import obtener_resultado_plan_por_id
from services.estado_certificado_service import obtener_estado_certificado_por_nombre
from services.tipo_certificado_service import obtener_tipo_certificado_por_nombre



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
def preparar_datos_certificado(resultado_plan, tipo_certificado, estado_certificado,id_usuario_autenticado):

    ahora = datetime.now()

    return {
        "id_resultado_plan": resultado_plan.id_resultado_plan,
        "id_tipo_certificado": tipo_certificado.id_tipo_certificado,
        "codigo_verificacion": generar_codigo_verificacion(),
        "fecha_emision": ahora.date(),
        "fecha_vencimiento": None,
        "url_documento": None,
        "id_estado_certificado": estado_certificado.id_estado_certificado,
        "id_usuario_creacion": id_usuario_autenticado,
        "id_usuario_modificacion": None,
        "ts_creacion": ahora,
        "ts_modificacion": None,
    }


# -------------------ARCHIVO ADJUNTO-------------------#


def _validar_es_pdf_real(archivo_werkzeug):
    """Comprueba que el contenido sea realmente un PDF, no solo que el
    nombre termine en .pdf."""
    posicion_original = archivo_werkzeug.stream.tell()
    archivo_werkzeug.stream.seek(0)
    encabezado = archivo_werkzeug.stream.read(len(FIRMA_PDF))
    archivo_werkzeug.stream.seek(posicion_original)

    if encabezado != FIRMA_PDF:
        raise BusinessError("El archivo seleccionado no es un PDF válido.", 400)


def _validar_tamanio_archivo(archivo_werkzeug):
    archivo_werkzeug.stream.seek(0, os.SEEK_END)
    tamanio = archivo_werkzeug.stream.tell()
    archivo_werkzeug.stream.seek(0)

    if tamanio == 0:
        raise BusinessError("El archivo está vacío.", 400)

    if tamanio > TAMANIO_MAXIMO_BYTES:
        raise BusinessError(
            f"El archivo supera el tamaño máximo permitido ({TAMANIO_MAXIMO_MB} MB).", 400
        )


def _guardar_archivo_certificado(archivo_werkzeug):
    nombre_original = secure_filename(archivo_werkzeug.filename or "")
    _, extension = os.path.splitext(nombre_original)
    extension = extension.lower()

    if extension not in EXTENSIONES_PERMITIDAS:
        raise BusinessError("El archivo debe ser un PDF.", 400)

    _validar_tamanio_archivo(archivo_werkzeug)
    _validar_es_pdf_real(archivo_werkzeug)

    os.makedirs(CARPETA_UPLOADS, exist_ok=True)
    nombre_final = f"{uuid.uuid4().hex}{extension}"
    ruta_absoluta = os.path.join(CARPETA_UPLOADS, nombre_final)
    archivo_werkzeug.save(ruta_absoluta)

    return f"/certificados/archivos/{nombre_final}", ruta_absoluta


def _borrar_archivo_certificado(url_documento):
    """Borra del disco el archivo anterior de un certificado, si existía.
    No falla el flujo si el archivo ya no está (por ejemplo, borrado a mano)."""
    if not url_documento:
        return

    nombre_archivo = url_documento.rsplit("/", 1)[-1]
    ruta_absoluta = os.path.join(CARPETA_UPLOADS, nombre_archivo)

    try:
        if os.path.isfile(ruta_absoluta):
            os.remove(ruta_absoluta)
    except OSError:
        logger.exception(f"No fue posible borrar el archivo {ruta_absoluta}.")


# Adjunta (o reemplaza) el archivo PDF de un certificado ya emitido.
def adjuntar_archivo_certificado(id_certificado, archivo_werkzeug):
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} "
        f"adjuntando archivo al certificado {id_certificado}."
    )

    if not archivo_werkzeug:
        raise BusinessError("El archivo PDF es requerido.", 400)

    certificado = obtener_certificado_por_id(id_certificado)

    if not certificado:
        return None

    try:

        url_anterior = certificado.url_documento

        nueva_url, _ = _guardar_archivo_certificado(archivo_werkzeug)

        certificado.url_documento = nueva_url
        certificado.id_usuario_modificacion = id_usuario_autenticado
        certificado.ts_modificacion = datetime.now()

        db.session.commit()

        # Si había un archivo previo, se borra recién después de
        # confirmar el commit, para no perder el anterior si algo falla.
        _borrar_archivo_certificado(url_anterior)

        logger.info(
            f"Archivo adjuntado correctamente al certificado {id_certificado}."
        )

        return certificado

    except BusinessError:

        db.session.rollback()

        raise

    except IntegrityError:

        db.session.rollback()

        logger.exception("Error de integridad al adjuntar el archivo del certificado.")

        raise BusinessError("No fue posible adjuntar el archivo.", 500)

    except Exception:

        db.session.rollback()

        logger.exception("Ocurrió un error inesperado al adjuntar el archivo del certificado.")

        raise BusinessError("Ocurrió un error interno del servidor.", 500)


# -------------------CRUD-------------------#


# Genera un certificado automáticamente.
def crear_certificado(id_resultado_plan):
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} generando un certificado para el"
        f"resultado del plan {id_resultado_plan}."
    )

    try:

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
        datos = preparar_datos_certificado(resultado_plan, tipo, estado, id_usuario_autenticado)

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
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} "
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

        certificado.id_usuario_modificacion = id_usuario_autenticado

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
    # Obtiene el usuario autenticado.
    id_usuario_autenticado = g.id_usuario

    logger.info(
        f"Usuario {id_usuario_autenticado} " f"eliminando el certificado {id_certificado}."
    )

    certificado = obtener_certificado_por_id(id_certificado)

    if not certificado:

        logger.warning(f"El certificado {id_certificado} no existe.")

        return False

    try:

        url_documento = certificado.url_documento

        db.session.delete(certificado)

        db.session.commit()

        _borrar_archivo_certificado(url_documento)

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
