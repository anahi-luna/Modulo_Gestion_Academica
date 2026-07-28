import logging
import os

import requests

from mocks.mock_comisiones_asignaturas import MOCK_COMISIONES_ASIGNATURA
from mocks.mock_legajos import MOCK_LEGAJOS

logger = logging.getLogger(__name__)

PLANES_SERVICE_URL = os.getenv(
    "PLANES_SERVICE_URL",
    "http://localhost:5001"
)

PLANES_USE_MOCK = (
    os.getenv("PLANES_USE_MOCK", "true").lower() == "true"
)


def _get(endpoint: str, params=None, headers=None):
    #Realiza una petición GET al MS1
    url = f"{PLANES_SERVICE_URL.rstrip('/')}/{endpoint.lstrip('/')}"

    try:
        logger.info(f"Consultando MS1: {url}")
        
        respuesta = requests.get(
            url,
            params=params,
            headers=headers,
            timeout=10
        )

        respuesta.raise_for_status()

        return respuesta.json()

    except requests.exceptions.RequestException as e:
        logger.error(f"Error consultando MS1 ({url}): {e}")
        return None
    
# Obtiene las comisiones asignaturas disponibles para un legajo.
def obtener_comisiones_disponibles(id_legajo=None, headers=None):

    if PLANES_USE_MOCK:
        return MOCK_COMISIONES_ASIGNATURA

    respuesta = _get(
        "comisiones-asignaturas/GetDetalleFromLegajoID",
        params={"id": id_legajo} if id_legajo else None,
        headers=headers
    )

    if not respuesta:
        return None

    return respuesta["data"]

# Obtiene una comisión asignatura por su ID.
def obtener_comision_asignatura_por_id(
    id_comision_asignatura,
    id_legajo=None,
    headers=None
):

    comisiones = obtener_comisiones_disponibles(
        id_legajo=id_legajo,
        headers=headers
    )

    if not comisiones:
        return None

    for comision in comisiones:
        if (
            comision["id_comision_asignatura"]
            == id_comision_asignatura
        ):
            return comision

    return None

# Obtiene un legajo junto con los datos de la persona.
def obtener_legajo(id_legajo, headers=None):

    if PLANES_USE_MOCK:

        for legajo in MOCK_LEGAJOS:

            if legajo["id"] == id_legajo:
                return legajo

        return None

    respuesta = _get( #CORREGIR
        "legajos/GetPersonaFromLegajoNum",  #haty q corregir 
        params={"numero": id_legajo},
        headers=headers
    )

    if not respuesta:
        return None

    return respuesta["data"]