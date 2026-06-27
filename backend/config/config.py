import os

# Ruta absoluta de la carpeta backend
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__),".."))

#Configuración general del proyecto.
class Config:
    # Base de datos SQLite (por ahora)
    SQLALCHEMY_DATABASE_URI = "sqlite:///"+os.path.join(BASE_DIR, "db.sqlite")
    
    # Desactiva eventos innecesarios de SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Modo debug
    DEBUG = True

    # Clave secreta (después irá en .env)
    SECRET_KEY= "microservicio-inscripciones-dev"