import os
import yaml
import logging
import traceback
from config.config import BASE_DIR

logger = logging.getLogger(__name__)

# Carpeta donde se encuentran los archivos de configuración YAML.
CONFIG_DIR = os.path.join(BASE_DIR,"config")

#Carga un archivo YAML ubicado en la carpeta config
#lo convierte en un diccionario de Python.
def _cargar_yaml(nombre_archivo):
    ruta = os.path.join(CONFIG_DIR,nombre_archivo)
    try:
        if not os.path.exists(ruta):
            raise FileNotFoundError(
                f"No existe el archivo: {ruta}"
            )
        with open(ruta, "r", encoding="utf-8") as archivo:
            return yaml.safe_load(archivo)
    
    except yaml.YAMLError:
        logger.error(
            "Error leyendo %s",
            nombre_archivo
        )

        logger.error(
            traceback.format_exc()
        )
        raise

    except Exception:

        logger.error(
            "Error cargando %s",
            nombre_archivo
        )

        logger.error(
            traceback.format_exc()
        )

        raise

#Carga la configuración general del microservicio.
def cargar_application():
    return _cargar_yaml("application.yml")

#Carga el listado de acciones disponibles del microservicio.
def cargar_permissions():
    return _cargar_yaml("permissions.yml")

#Carga la definición de roles y acciones asociadas.
def cargar_roles():
    return _cargar_yaml("roles.yml")

#Carga los usuarios simulados utilizados durante el desarrollo.
def cargar_users():
    return _cargar_yaml("users_mock.yml")

