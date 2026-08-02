import logging
from pathlib import Path
import os
import requests
import yaml

logger = logging.getLogger(__name__)


def registrar_acciones():

    ruta = Path(__file__).parent.parent / "acciones.yml"

    try:
        with open(ruta, "r", encoding="utf-8") as archivo:
            datos = yaml.safe_load(archivo)

    except FileNotFoundError:
        logger.warning(f"No se encontró {ruta}")
        return

    auth_url = os.getenv("AUTH_SERVICE_URL", "http://localhost:5000")

    endpoint = f"{auth_url.rstrip('/')}/auth/acciones"

    try:
        respuesta = requests.post(endpoint, json=datos, timeout=10)

        respuesta.raise_for_status()

        logger.info(
            f"Acciones registradas correctamente en Auth ({respuesta.status_code})"
        )

    except requests.exceptions.RequestException as e:
        logger.error(f"No se pudieron registrar acciones: {e}")
    except Exception as e:
        logger.exception(f"Error inesperado registrando acciones: {e}")
