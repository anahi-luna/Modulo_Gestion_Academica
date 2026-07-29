import logging
import os

import requests

logger = logging.getLogger(__name__)

PLANES_SERVICE_URL = os.getenv("PLANES_SERVICE_URL", "http://localhost:5000")


def _get(endpoint: str, params=None, headers=None):
    # Realiza una petición GET al MS1
    url = f"{PLANES_SERVICE_URL.rstrip('/')}/{endpoint.lstrip('/')}"

    try:
        logger.info(f"Consultando MS1: {url}")

        respuesta = requests.get(url, params=params, headers=headers, timeout=10)

        logger.info(f"Código de respuesta: {respuesta.status_code}")

        respuesta.raise_for_status()

        return respuesta.json()

    except requests.exceptions.RequestException as e:
        logger.error(f"Error consultando MS1 ({url}): {e}")
        if hasattr(e, "response") and e.response is not None:
            logger.error(f"Respuesta del servidor: {e.response.text}")
        return None


# Temporalmente continúa usando el mock hasta que MS1 finalice el endpoint.
def obtener_comisiones_disponibles(id_legajo=None, headers=None):

    logger.info(f"Obteniendo comisiones disponibles para legajo {id_legajo}.")
    
    params = None

    if id_legajo is not None:
        params = {"id": id_legajo}

    respuesta = _get(
        "comisiones-asignaturas/GetDetalleFromLegajoID", params=params, headers=headers
    )

    if not respuesta:
        logger.warning("No fue posible obtener las comisiones disponibles.")
        return None

    logger.info(
        f"Se obtuvieron {len(respuesta.get('data', []))} comisiones disponibles."
    )

    return respuesta.get("data")


# Obtiene el detalle de una comisión asignatura por su identificador.
def obtener_comision_asignatura_por_id(
    id_comision_asignatura, id_legajo=None, headers=None
):
    logger.info(f"Buscando comisión asignatura {id_comision_asignatura}.")

    comisiones = obtener_comisiones_disponibles(id_legajo=id_legajo, headers=headers)

    if not comisiones:
        logger.warning("No hay comisiones disponibles para consultar.")
        return None

    for comision in comisiones:
        if comision.get("id_comision_asignatura") == id_comision_asignatura:
            logger.info(f"Comisión asignatura {id_comision_asignatura} encontrada.")
            return comision
    
    logger.warning(
        f"La comisión asignatura {id_comision_asignatura} no fue encontrada."
    )
    return None


# Obtiene un legajo junto con los datos de la persona desde MS1.
def obtener_legajo(id_legajo, headers=None):
    logger.info(f"Consultando legajo {id_legajo}.")
    respuesta = _get(
        "legajos/GetPersonaFromLegajoId", params={"id": id_legajo}, headers=headers
    )

    if not respuesta:
        logger.warning(f"No se encontró el legajo {id_legajo}.")
        return None

    logger.info(f"Legajo {id_legajo} obtenido correctamente.")

    return respuesta.get("data")


# Obtiene el PlanAsignatura asociado a una comisión asignatura.
def obtener_plan_asignatura_por_comision_asignatura(
    id_comision_asignatura, id_legajo=None, headers=None
):
    
    comision = obtener_comision_asignatura_por_id(
        id_comision_asignatura, id_legajo=id_legajo, headers=headers
    )

    if not comision:
        return None

    return comision.get("plan_asignaturas")


# Obtiene el Plan de Estudio asociado a una comisión asignatura.
def obtener_plan_por_comision_asignatura(
    id_comision_asignatura, id_legajo=None, headers=None
):

    plan_asignatura = obtener_plan_asignatura_por_comision_asignatura(
        id_comision_asignatura, id_legajo=id_legajo, headers=headers
    )

    if not plan_asignatura:
        return None

    return plan_asignatura.get("plan")


# Obtiene el identificador del Plan de Estudio asociado
# a una comisión asignatura.
def obtener_id_plan_por_comision_asignatura(
    id_comision_asignatura, id_legajo=None, headers=None
):

    plan_asignatura = obtener_plan_asignatura_por_comision_asignatura(
        id_comision_asignatura, id_legajo=id_legajo, headers=headers
    )

    if not plan_asignatura:
        return None

    return plan_asignatura.get("plan_id")


# Obtiene todas las comisiones asignaturas pertenecientes a un plan.
def obtener_comisiones_asignaturas_por_plan(id_plan, id_legajo=None, headers=None):

    comisiones = obtener_comisiones_disponibles(id_legajo=id_legajo, headers=headers)

    if not comisiones:
        return []

    resultado = []

    for comision in comisiones:

        plan_asignatura = comision.get("plan_asignaturas")

        if not plan_asignatura:
            continue

        if plan_asignatura.get("plan_id") == id_plan:
            resultado.append(comision)

    return resultado


# Obtiene el Plan de Estudio por su identificador.
def obtener_plan(id_plan, id_legajo=None, headers=None):

    logger.info(f"Consultando plan {id_plan}.")

    comisiones = obtener_comisiones_asignaturas_por_plan(
        id_plan, id_legajo=id_legajo, headers=headers
    )

    if not comisiones:
        logger.warning(f"No se encontró el plan {id_plan}.")
        return None

    logger.info(f"Plan {id_plan} obtenido correctamente.")

    return comisiones[0]["plan_asignaturas"]["plan"]
