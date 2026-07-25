import os
from pathlib import Path

import requests
import yaml


def registrar_acciones():
    auth_service_url = os.getenv(
        "AUTH_SERVICE_URL",
        "http://auth:5000"
    )

    ruta = Path(__file__).parent.parent / "acciones.yml"

    try:
        with open(ruta, "r", encoding="utf-8") as archivo:
            datos = yaml.safe_load(archivo)

        respuesta = requests.post(
            f"{auth_service_url}/acciones",
            json=datos,
            timeout=10
        )

        respuesta.raise_for_status()

        print("Acciones registradas correctamente en Auth.")

    except FileNotFoundError:
        print(f"No se encontró el archivo: {ruta}")

    except requests.exceptions.RequestException as e:
        print(f"No fue posible registrar las acciones en Auth: {e}")