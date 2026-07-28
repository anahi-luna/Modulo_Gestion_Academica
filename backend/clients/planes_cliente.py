import logging
import os

import requests

from mocks.mock_comisiones_asignaturas import MOCK_COMISIONES_ASIGNATURA

logger = logging.getLogger(__name__)

PLANES_SERVICE_URL = os.getenv("PLANES_SERVICE_URL", "http://localhost:5000")


def _get(endpoint: str, params=None, headers=None):
    # Realiza una petición GET al MS1
    url = f"{PLANES_SERVICE_URL.rstrip('/')}/{endpoint.lstrip('/')}"

    try:
        logger.info(f"Consultando MS1: {url}")

        respuesta = requests.get(url, params=params, headers=headers, timeout=10)

        respuesta.raise_for_status()

        return respuesta.json()

    except requests.exceptions.RequestException as e:
        logger.error(f"Error consultando MS1 ({url}): {e}")
        return None


# Temporalmente continúa usando el mock hasta que MS1 finalice el endpoint.
def obtener_comisiones_disponibles(id_legajo=None, headers=None):

    return MOCK_COMISIONES_ASIGNATURA

    # Cuando MS1 finalice el endpoint, reemplazar por:
    #
    # respuesta = _get(
    #     "comisiones-asignaturas/GetDetalleFromLegajoID",
    #     params={"id": id_legajo},
    #     headers=headers
    # )
    #
    # if not respuesta:
    #     return None
    #
    # return respuesta.get("data")


# Obtiene el detalle de una comisión asignatura por su identificador.
def obtener_comision_asignatura_por_id(
    id_comision_asignatura, id_legajo=None, headers=None
):

    comisiones = obtener_comisiones_disponibles(id_legajo=id_legajo, headers=headers)

    if not comisiones:
        return None

    for comision in comisiones:
        if comision.get("id_comision_asignatura") == id_comision_asignatura:
            return comision

    return None


# Obtiene un legajo junto con los datos de la persona desde MS1.
def obtener_legajo(id_legajo, headers=None):

    respuesta = _get(
        "legajos/GetPersonaFromLegajoId", params={"id": id_legajo}, headers=headers
    )

    if not respuesta:
        return None

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

    comisiones = obtener_comisiones_disponibles(
        id_legajo=id_legajo,
        headers=headers
    )

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

    comisiones = obtener_comisiones_asignaturas_por_plan(
        id_plan,
        id_legajo=id_legajo,
        headers=headers
    )

    if not comisiones:
        return None

    return comisiones[0]["plan_asignaturas"]["plan"]