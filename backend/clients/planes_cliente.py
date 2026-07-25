import logging
import os

import requests

logger = logging.getLogger(__name__)

PLANES_SERVICE_URL = os.getenv(
    "PLANES_SERVICE_URL",
    "http://localhost:5001"
)


def _get(endpoint: str, headers=None):

    url = f"{PLANES_SERVICE_URL.rstrip('/')}/{endpoint.lstrip('/')}"

    try:
        logger.info(f"Consultando MS1: {url}")
        
        respuesta = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        respuesta.raise_for_status()

        return respuesta.json()

    except requests.exceptions.RequestException as e:
        logger.error(f"Error consultando MS1 ({url}): {e}")
        return None
    
#Obtiene un legajo desde el Microservicio de Planes
def obtener_legajo(id_legajo: int, headers=None):
    return _get(f"legajos/{id_legajo}",headers=headers)

def obtener_comision(id_comision: int, headers=None):
    return _get(f"comisiones/{id_comision}",headers=headers)

def obtener_plan(id_plan: int, headers=None):
    return _get(f"planes/{id_plan}",headers=headers)

def obtener_asignatura(id_asignatura: int, headers=None):
    return _get(f"asignaturas/{id_asignatura}",headers=headers)