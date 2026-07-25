import os
from dotenv import load_dotenv

# Ruta absoluta de la carpeta backend
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__),".."))

ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(ENV_PATH)

#Configuración general del proyecto.
class Config:

    DB_ENGINE = os.getenv("DB_ENGINE", "sqlite")

    if DB_ENGINE == "postgres":
        SQLALCHEMY_DATABASE_URI = (
            f"postgresql+psycopg://"
            f"{os.getenv('POSTGRES_USER')}:"
            f"{os.getenv('POSTGRES_PASSWORD')}@"
            f"{os.getenv('POSTGRES_HOST')}:"
            f"{os.getenv('POSTGRES_PORT')}/"
            f"{os.getenv('POSTGRES_DB')}"
        )
    else:
        SQLITE_PATH = os.getenv("SQLITE_PATH", "db.sqlite")
        # Base de datos SQLite (por ahora)
        SQLALCHEMY_DATABASE_URI = (
            "sqlite:///" + os.path.join(BASE_DIR, SQLITE_PATH)
        )

    # Desactiva eventos innecesarios de SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Modo debug
    DEBUG = True
    # Clave secreta (después irá en .env)
    SECRET_KEY = "microservicio-inscripciones-dev"

    # Auth Common
    AUTH_COMMON_REDIS_URL = os.getenv(
        "AUTH_COMMON_REDIS_URL",
        "redis://redis:6379/0"
    )

    AUTH_COMMON_SESSION_TTL = int(
        os.getenv("AUTH_COMMON_SESSION_TTL", 900)
    )

    AUTH_COMMON_ENDPOINTS_EXCEPTUADOS = [
        "home",      # /status
    ]